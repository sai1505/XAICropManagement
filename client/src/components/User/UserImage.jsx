import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Trash2, Download, ZoomIn, Search } from 'lucide-react';

const UserImage = () => {
    const [images, setImages] = useState([
        // Sample images - replace with actual user images from backend/session
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
            name: 'wheat_disease.jpg',
            uploadDate: '2025-10-20',
            diagnosis: 'Wheat Rust Disease'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
            name: 'corn_healthy.jpg',
            uploadDate: '2025-10-19',
            diagnosis: 'Healthy Corn Plant'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800',
            name: 'tomato_blight.jpg',
            uploadDate: '2025-10-18',
            diagnosis: 'Tomato Late Blight'
        }
    ]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            const newImages = files.map((file, index) => ({
                id: Date.now() + index,
                url: URL.createObjectURL(file),
                name: file.name,
                uploadDate: new Date().toISOString().split('T')[0],
                diagnosis: 'Analysis pending...'
            }));

            setImages(prev => [...newImages, ...prev]);
            setIsUploading(false);

            // Clear input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }, 1500);
    };

    const handleDelete = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
        if (selectedImage?.id === imageId) {
            setSelectedImage(null);
        }
    };

    const handleDownload = async (image) => {
        try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = image.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const filteredImages = images.filter(img =>
        img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-green-900 mb-2 flex items-center gap-3">
                                <ImageIcon className="w-10 h-10 text-green-600" />
                                My Crop Images
                            </h1>
                            <p className="text-green-700">
                                Upload and analyze your crop images
                            </p>
                        </div>

                        {/* Upload Button */}
                        <motion.button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            whileHover={{ scale: isUploading ? 1 : 1.05 }}
                            whileTap={{ scale: isUploading ? 1 : 0.95 }}
                        >
                            {isUploading ? (
                                <>
                                    <motion.div
                                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Upload Images
                                </>
                            )}
                        </motion.button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 bg-white transition-all"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">Total Images</p>
                        <p className="text-3xl font-bold text-green-900">{images.length}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">This Month</p>
                        <p className="text-3xl font-bold text-green-900">
                            {images.filter(img => img.uploadDate.startsWith('2025-10')).length}
                        </p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border-2 border-green-100">
                        <p className="text-green-700 text-sm font-medium">Analyzed</p>
                        <p className="text-3xl font-bold text-green-900">
                            {images.filter(img => img.diagnosis !== 'Analysis pending...').length}
                        </p>
                    </div>
                </motion.div>

                {/* Image Grid */}
                {filteredImages.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    variants={itemVariants}
                                    exit="exit"
                                    className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border-2 border-green-100 hover:border-green-300 transition-all group"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Overlay on hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                        >
                                            <motion.button
                                                onClick={() => setSelectedImage(image)}
                                                className="p-3 bg-white rounded-full text-green-600 hover:bg-green-50 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <ZoomIn className="w-5 h-5" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDownload(image)}
                                                className="p-3 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Download className="w-5 h-5" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(image.id)}
                                                className="p-3 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </motion.div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-green-900 truncate mb-1">
                                            {image.name}
                                        </h3>
                                        <p className="text-sm text-green-700 mb-2">{image.uploadDate}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${image.diagnosis === 'Analysis pending...'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                                }`} />
                                            <p className="text-xs text-gray-600 truncate">{image.diagnosis}</p>
                                        </div>
                                    </div>
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
                        <ImageIcon className="w-20 h-20 text-green-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-900 mb-2">
                            {searchQuery ? 'No images found' : 'No images yet'}
                        </h3>
                        <p className="text-green-700">
                            {searchQuery ? 'Try a different search term' : 'Upload your first crop image to get started'}
                        </p>
                    </motion.div>
                )}

                {/* Image Preview Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedImage(null)}
                            />
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center z-50 p-4"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-6 border-b-2 border-green-100">
                                        <h2 className="text-2xl font-bold text-green-900">{selectedImage.name}</h2>
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="p-2 hover:bg-green-100 rounded-full transition-colors"
                                        >
                                            <X className="w-6 h-6 text-green-700" />
                                        </button>
                                    </div>

                                    {/* Modal Image */}
                                    <div className="p-6">
                                        <img
                                            src={selectedImage.url}
                                            alt={selectedImage.name}
                                            className="w-full h-auto rounded-2xl"
                                        />
                                    </div>

                                    {/* Modal Info */}
                                    <div className="p-6 bg-green-50 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-green-900">Upload Date:</span>
                                            <span className="text-sm text-green-700">{selectedImage.uploadDate}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-green-900">Diagnosis:</span>
                                            <span className="text-sm text-green-700">{selectedImage.diagnosis}</span>
                                        </div>
                                        <div className="flex gap-3 mt-4">
                                            <motion.button
                                                onClick={() => handleDownload(selectedImage)}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Download className="w-5 h-5" />
                                                Download
                                            </motion.button>
                                            <motion.button
                                                onClick={() => {
                                                    handleDelete(selectedImage.id);
                                                    setSelectedImage(null);
                                                }}
                                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                                Delete
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserImage;
