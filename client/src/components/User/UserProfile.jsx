import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, LogOut, Camera, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        userId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');

    // Retrieve user data from session storage on component mount
    useEffect(() => {
        const userName = sessionStorage.getItem('userName');
        const userEmail = sessionStorage.getItem('userEmail');
        const userId = sessionStorage.getItem('userId');

        if (userName && userEmail) {
            setUserData({
                name: userName,
                email: userEmail,
                userId: userId || ''
            });
            setEditedName(userName);
        } else {
            // If no session data, redirect to sign in
            navigate('/signin');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear session storage
        sessionStorage.clear();
        // Also clear localStorage if remember me was used
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('rememberMe');

        // Redirect to home
        navigate('/');
    };

    const handleSaveEdit = () => {
        if (editedName.trim()) {
            sessionStorage.setItem('userName', editedName);
            setUserData(prev => ({ ...prev, name: editedName }));
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(userData.name);
        setIsEditing(false);
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length >= 2) {
            return names[0][0] + names[1][0];
        }
        return name[0];
    };

    // Animation variants
    const avatarVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
            }
        },
        hover: {
            scale: 1.1,
            rotate: [0, -10, 10, -10, 0],
            transition: {
                duration: 0.5
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    };

    const pulseVariants = {
        animate: {
            boxShadow: [
                "0 0 0 0 rgba(22, 163, 74, 0.4)",
                "0 0 0 20px rgba(22, 163, 74, 0)",
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
            <motion.div
                className="max-w-3xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-green-100 overflow-hidden"
                    variants={itemVariants}
                >
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-green-600 to-green-500 relative">
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: [
                                    "linear-gradient(to right, #16a34a, #15803d)",
                                    "linear-gradient(to right, #15803d, #16a34a)",
                                    "linear-gradient(to right, #16a34a, #15803d)"
                                ]
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                    </div>

                    {/* Profile Content */}
                    <div className="relative px-8 pb-8">
                        {/* Avatar */}
                        <div className="flex justify-between items-start -mt-16 mb-6">
                            <motion.div
                                className="relative"
                                variants={avatarVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                            >
                                <motion.div
                                    className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600 to-green-500 border-4 border-white shadow-2xl flex items-center justify-center"
                                    variants={pulseVariants}
                                    animate="animate"
                                >
                                    <motion.span
                                        className="text-4xl font-bold text-white"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {getInitials(userData.name)}
                                    </motion.span>
                                </motion.div>

                                {/* Camera icon for profile picture upload (optional) */}
                                <motion.button
                                    className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-200"
                                    whileHover={{ scale: 1.1, rotate: 15 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Camera className="w-5 h-5 text-green-600" />
                                </motion.button>
                            </motion.div>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogout}
                                className="px-6 py-2.5 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 border-2 border-red-200 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </motion.button>
                        </div>

                        {/* User Information */}
                        <motion.div className="space-y-6" variants={itemVariants}>
                            {/* Name Section */}
                            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border-2 border-green-100">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-semibold text-green-900 flex items-center gap-2">
                                        <User className="w-5 h-5 text-green-600" />
                                        Full Name
                                    </label>
                                    {!isEditing && (
                                        <motion.button
                                            onClick={() => setIsEditing(true)}
                                            className="text-green-600 hover:text-green-700 p-2 hover:bg-green-100 rounded-full transition-all"
                                            whileHover={{ scale: 1.1, rotate: 15 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="flex-1 px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                                            autoFocus
                                        />
                                        <motion.button
                                            onClick={handleSaveEdit}
                                            className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Check className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            onClick={handleCancelEdit}
                                            className="p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.p
                                        className="text-2xl font-bold text-green-900"
                                        key={userData.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {userData.name || 'Not set'}
                                    </motion.p>
                                )}
                            </div>

                            {/* Email Section */}
                            <motion.div
                                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border-2 border-green-100"
                                variants={itemVariants}
                            >
                                <label className="text-sm font-semibold text-green-900 flex items-center gap-2 mb-3">
                                    <Mail className="w-5 h-5 text-green-600" />
                                    Email Address
                                </label>
                                <p className="text-xl font-semibold text-green-800">
                                    {userData.email || 'Not set'}
                                </p>
                                <p className="text-sm text-green-600 mt-2">
                                    Email cannot be changed
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            className="mt-8 pt-6 border-t-2 border-green-100 text-center"
                            variants={itemVariants}
                        >
                            <p className="text-sm text-green-600">
                                Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                    variants={containerVariants}
                >
                    <motion.button
                        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all shadow-md hover:shadow-xl text-left"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🌾</span>
                        </div>
                        <h3 className="font-bold text-green-900 mb-1">Dashboard</h3>
                        <p className="text-sm text-green-600">View your crops</p>
                    </motion.button>

                    <motion.button
                        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all shadow-md hover:shadow-xl text-left"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">⚙️</span>
                        </div>
                        <h3 className="font-bold text-green-900 mb-1">Settings</h3>
                        <p className="text-sm text-green-600">Manage account</p>
                    </motion.button>

                    <motion.button
                        className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all shadow-md hover:shadow-xl text-left"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">❓</span>
                        </div>
                        <h3 className="font-bold text-green-900 mb-1">Help</h3>
                        <p className="text-sm text-green-600">Get support</p>
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UserProfile;
