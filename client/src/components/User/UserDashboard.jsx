import React, { useState, useRef, useEffect, useContext } from 'react';
import { UserChatContext } from './UserDashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ImagePlus, X, Leaf, Loader2 } from 'lucide-react';

// Custom Icons using Lucide
const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
    </svg>
);

const Notification = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className="fixed bottom-8 right-8 flex items-center p-4 max-w-xs bg-white border-2 border-green-200 rounded-2xl shadow-2xl z-50"
    >
        <div className="text-sm font-medium text-gray-800">{message}</div>
        <button
            type="button"
            className="ml-4 text-gray-500 hover:text-gray-800 transition-colors"
            onClick={onClose}
        >
            <X className="w-4 h-4" />
        </button>
    </motion.div>
);

const UserDashboard = () => {
    const { currentChat, addMessage } = useContext(UserChatContext);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentChat?.messages, isLoading]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setNotification({ message: `Image selected: ${file.name}`, type: 'success' });
        } else if (file) {
            setNotification({ message: 'Please select a valid image file', type: 'error' });
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (e, promptText = null) => {
        e?.preventDefault();
        const messageText = promptText || input;

        if (!messageText.trim() && !selectedImage) return;

        const message = {
            id: Date.now(),
            text: messageText,
            image: imagePreview,
            sender: 'user',
            timestamp: new Date()
        };

        addMessage(message);
        setInput('');
        removeImage();

        // Simulate AI response for crop analysis
        setIsLoading(true);
        setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                text: selectedImage
                    ? 'Based on the crop image analysis:\n\n✓ Plant Health: Good overall condition\n✓ Leaf Color: Healthy green pigmentation\n⚠ Minor nutrient deficiency detected\n\nRecommendations:\n• Apply balanced NPK fertilizer (10-10-10)\n• Monitor soil moisture levels\n• Check for early signs of pest infestation\n• Consider soil pH testing'
                    : 'Hello! I\'m CropGuard AI, your agricultural assistant. I can help you with:\n\n🌱 Crop disease identification\n🐛 Pest management advice\n💧 Irrigation recommendations\n🌾 Fertilizer guidance\n📊 Yield predictions\n\nHow can I assist you today?',
                sender: 'ai',
                timestamp: new Date()
            };
            addMessage(aiResponse);
            setIsLoading(false);
        }, 1500);
    };

    const AIAvatar = () => (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-green-600 to-green-500 rounded-full shadow-lg"
        >
            <SparklesIcon />
        </motion.div>
    );

    const UserAvatar = () => (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-green-100 rounded-full border-2 border-green-200"
        >
            <Leaf className="w-5 h-5 text-green-700" />
        </motion.div>
    );

    const LoadingIndicator = () => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4"
        >
            <AIAvatar />
            <div className="flex items-center space-x-1 p-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-2xl rounded-bl-sm">
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-green-600 rounded-full"
                />
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-green-600 rounded-full"
                />
                <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-green-600 rounded-full"
                />
            </div>
        </motion.div>
    );

    const examplePrompts = [
        "🌾 Identify crop disease from symptoms",
        "💧 Optimal irrigation schedule",
        "🐛 Natural pest control methods"
    ];

    return (
        <div className="h-screen w-full flex flex-col items-center bg-gradient-to-br from-green-50 via-white to-green-50">
            {/* Chat Display Area */}
            <div className="w-full max-w-4xl flex-1 overflow-y-auto p-4 custom-scrollbar">
                {!currentChat || currentChat.messages.length === 0 ? (
                    // Welcome Screen
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center px-4"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl"
                        >
                            <Leaf className="w-12 h-12 text-white" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-green-500 mb-3"
                        >
                            CropGuard AI
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-green-700 text-lg mb-12"
                        >
                            Your AI-powered agricultural assistant
                        </motion.p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                            {examplePrompts.map((prompt, index) => (
                                <motion.button
                                    key={prompt}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleSendMessage(e, prompt)}
                                    className="p-5 bg-white border-2 border-green-200 rounded-2xl text-left hover:border-green-400 hover:shadow-xl transition-all duration-200"
                                >
                                    <p className="text-sm font-semibold text-green-800">{prompt}</p>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    // Chat Messages
                    <div className="space-y-6 pt-10 pb-10">
                        <AnimatePresence>
                            {currentChat.messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                                >
                                    {msg.sender === 'ai' && <AIAvatar />}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className={`p-4 rounded-2xl max-w-[75%] text-sm whitespace-pre-wrap shadow-md ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-green-600 to-green-500 text-white rounded-br-sm'
                                            : 'bg-white border-2 border-green-100 text-gray-800 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.image && (
                                            <motion.img
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                src={msg.image}
                                                alt="Uploaded crop"
                                                className="rounded-xl mb-3 max-w-full h-auto border-2 border-white/20"
                                            />
                                        )}
                                        {msg.text}
                                        <div className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </motion.div>
                                    {msg.sender === 'user' && <UserAvatar />}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && <LoadingIndicator />}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="w-full flex-shrink-0 flex justify-center p-4 bg-gradient-to-t from-green-50 via-white to-transparent">
                <div className="w-full max-w-4xl">
                    {/* Image Preview */}
                    <AnimatePresence>
                        {imagePreview && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 overflow-hidden"
                            >
                                <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl p-3">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="relative"
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-20 w-20 object-cover rounded-xl border-2 border-green-300 shadow-md"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X className="w-3 h-3" />
                                        </motion.button>
                                    </motion.div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-800">Ready to analyze</p>
                                        <p className="text-xs text-green-600">Crop image preview</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSendMessage} className="relative flex items-end gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

                        {/* Image Upload Button */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                            title="Upload crop image"
                        >
                            <ImagePlus className="w-6 h-6" />
                        </motion.button>

                        {/* Text Input */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Ask about your crops or upload an image..."
                                rows={1}
                                className="w-full px-5 py-4 border-2 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none bg-white text-gray-800 placeholder-gray-400 shadow-md transition-all"
                                style={{ minHeight: '56px', maxHeight: '200px' }}
                            />
                        </div>

                        {/* Send Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-4 bg-gradient-to-br from-green-600 to-green-500 text-white rounded-2xl hover:from-green-700 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <Send className="w-6 h-6" />
                            )}
                        </motion.button>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-center text-gray-500 mt-3"
                    >
                        CropGuard AI may produce inaccurate information. Please verify important agricultural advice.
                    </motion.p>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: linear-gradient(to bottom, #16a34a, #15803d);
                    border-radius: 10px; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
                    background: linear-gradient(to bottom, #15803d, #166534);
                }
            `}</style>
        </div>
    );
};

export default UserDashboard;
