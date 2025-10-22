import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserChatContext } from './UserDashboardLayout';
import { Clock, MessageSquare, Image as ImageIcon, Trash2, Search, Calendar, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserHistory = () => {
    const { chatSessions, loadChat, chatHistory } = useContext(UserChatContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [filterDate, setFilterDate] = useState('all');

    // Sample data - replace with actual data from context/backend
    const [history] = useState([
        {
            id: 1,
            title: 'Wheat Rust Disease Analysis',
            messages: 15,
            hasImages: true,
            date: '2025-10-22',
            time: '14:30',
            preview: 'I uploaded an image of wheat leaves with rust spots...',
            category: 'Disease'
        },
        {
            id: 2,
            title: 'Corn Fertilizer Recommendations',
            messages: 8,
            hasImages: false,
            date: '2025-10-21',
            time: '10:15',
            preview: 'What type of fertilizer should I use for corn?',
            category: 'Fertilizer'
        },
        {
            id: 3,
            title: 'Tomato Pest Control',
            messages: 22,
            hasImages: true,
            date: '2025-10-20',
            time: '16:45',
            preview: 'How can I control aphids on my tomato plants?',
            category: 'Pest'
        },
        {
            id: 4,
            title: 'Irrigation Schedule Query',
            messages: 12,
            hasImages: false,
            date: '2025-10-19',
            time: '09:00',
            preview: 'What is the optimal irrigation schedule for rice?',
            category: 'Irrigation'
        },
        {
            id: 5,
            title: 'Soil pH Testing Guide',
            messages: 18,
            hasImages: true,
            date: '2025-10-18',
            time: '11:30',
            preview: 'How do I test and adjust soil pH levels?',
            category: 'Soil'
        }
    ]);

    const filterByDate = (sessions) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filterDate) {
            case 'today':
                return sessions.filter(s => {
                    const sessionDate = new Date(s.date);
                    sessionDate.setHours(0, 0, 0, 0);
                    return sessionDate.getTime() === today.getTime();
                });
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return sessions.filter(s => new Date(s.date) >= weekAgo);
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return sessions.filter(s => new Date(s.date) >= monthAgo);
            default:
                return sessions;
        }
    };

    const filteredHistory = filterByDate(
        history.filter(session =>
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const handleViewSession = (session) => {
        // Load the chat session and navigate to dashboard
        if (loadChat) {
            loadChat(session.id);
        }
        navigate('/dashboard');
    };

    const handleDeleteSession = (sessionId) => {
        // Implement delete functionality
        console.log('Delete session:', sessionId);
    };

    const handleExportSession = (session) => {
        // Export conversation as text file
        const content = `CropGuard AI Chat History
Title: ${session.title}
Date: ${session.date} ${session.time}
Category: ${session.category}
Messages: ${session.messages}

Preview: ${session.preview}`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${session.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: { duration: 0.2 }
        }
    };

    const timelineVariants = {
        hidden: { height: 0 },
        visible: {
            height: "100%",
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    };

    const categoryColors = {
        Disease: 'bg-red-100 text-red-700 border-red-300',
        Fertilizer: 'bg-blue-100 text-blue-700 border-blue-300',
        Pest: 'bg-orange-100 text-orange-700 border-orange-300',
        Irrigation: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        Soil: 'bg-green-100 text-green-700 border-green-300'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-green-900 mb-2 flex items-center gap-3">
                        <Clock className="w-10 h-10 text-green-600" />
                        Chat History
                    </h1>
                    <p className="text-green-700">
                        View and manage your previous conversations
                    </p>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 bg-white transition-all"
                        />
                    </div>

                    {/* Date Filters */}
                    <div className="flex flex-wrap gap-3">
                        {['all', 'today', 'week', 'month'].map((filter) => (
                            <motion.button
                                key={filter}
                                onClick={() => setFilterDate(filter)}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filterDate === filter
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-white text-green-700 border-2 border-green-200 hover:border-green-400'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">Total Chats</p>
                        <p className="text-3xl font-bold text-green-900">{history.length}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">This Week</p>
                        <p className="text-3xl font-bold text-green-900">
                            {filterByDate(history.filter(() => true)).length}
                        </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">Total Messages</p>
                        <p className="text-3xl font-bold text-green-900">
                            {history.reduce((acc, s) => acc + s.messages, 0)}
                        </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">With Images</p>
                        <p className="text-3xl font-bold text-green-900">
                            {history.filter(s => s.hasImages).length}
                        </p>
                    </div>
                </motion.div>

                {/* Timeline History */}
                {filteredHistory.length > 0 ? (
                    <motion.div
                        className="relative"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Timeline Line */}
                        <motion.div
                            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-green-200"
                            variants={timelineVariants}
                            style={{ originY: 0 }}
                        />

                        <AnimatePresence mode="popLayout">
                            {filteredHistory.map((session, index) => (
                                <motion.div
                                    key={session.id}
                                    layout
                                    variants={itemVariants}
                                    exit="exit"
                                    className="relative pl-20 pb-8"
                                >
                                    {/* Timeline Dot */}
                                    <motion.div
                                        className="absolute left-6 w-5 h-5 bg-green-600 rounded-full border-4 border-white shadow-lg z-10"
                                        whileHover={{ scale: 1.3 }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    />

                                    {/* Session Card */}
                                    <motion.div
                                        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 border-green-100 hover:border-green-300 transition-all overflow-hidden group"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="p-6">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-green-900 mb-2">
                                                        {session.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-green-600">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {session.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {session.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Category Badge */}
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${categoryColors[session.category]}`}>
                                                    {session.category}
                                                </span>
                                            </div>

                                            {/* Preview */}
                                            <p className="text-gray-700 mb-4 line-clamp-2">
                                                {session.preview}
                                            </p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 mb-4 text-sm">
                                                <span className="flex items-center gap-1 text-green-700">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {session.messages} messages
                                                </span>
                                                {session.hasImages && (
                                                    <span className="flex items-center gap-1 text-blue-700">
                                                        <ImageIcon className="w-4 h-4" />
                                                        Contains images
                                                    </span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <motion.button
                                                    onClick={() => handleViewSession(session)}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleExportSession(session)}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Download className="w-5 h-5" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDeleteSession(session.id)}
                                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Clock className="w-20 h-20 text-green-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                            {searchQuery ? 'No conversations found' : 'No chat history yet'}
                        </h3>
                        <p className="text-green-700 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Start a conversation to see your history here'}
                        </p>
                        {!searchQuery && (
                            <motion.button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start New Chat
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserHistory;
