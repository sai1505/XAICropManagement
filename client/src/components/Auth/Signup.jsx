import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, User, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPass: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password strength calculator
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (!formData.confirmPass) {
            newErrors.confirmPass = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPass) {
            newErrors.confirmPass = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', formData);
                setIsSubmitting(false);
                // Handle successful signup
            }, 2000);
        }
    };

    const handleGoogleSignIn = () => {
        console.log('Google sign-in initiated');
        // Implement Google OAuth logic here
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return 'bg-red-500';
        if (passwordStrength <= 50) return 'bg-orange-500';
        if (passwordStrength <= 75) return 'bg-yellow-500';
        return 'bg-green-600';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 25) return 'Weak';
        if (passwordStrength <= 50) return 'Fair';
        if (passwordStrength <= 75) return 'Good';
        return 'Strong';
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

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full blur-3xl opacity-40"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-32 h-32 bg-green-300 rounded-full blur-3xl opacity-30"
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -30, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo Section */}
                <motion.div 
                    className="text-center mt-19 mb-8"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full shadow-lg mb-4"
                        variants={floatingVariants}
                        animate="animate"
                    >
                        <Leaf className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-green-900 mb-2">Join CropGuard AI</h1>
                    <p className="text-green-700">Create your account to get started</p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-green-100 p-8"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-green-900 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                <motion.input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        errors.name 
                                            ? 'border-red-400 focus:border-red-500 bg-red-50' 
                                            : 'border-green-200 focus:border-green-500 bg-white'
                                    }`}
                                    placeholder="John Doe"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                {errors.name && (
                                    <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}
                            </div>
                            <AnimatePresence>
                                {errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-green-900 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                <motion.input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        errors.email 
                                            ? 'border-red-400 focus:border-red-500 bg-red-50' 
                                            : 'border-green-200 focus:border-green-500 bg-white'
                                    }`}
                                    placeholder="john@example.com"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                {errors.email && (
                                    <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                                )}
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-green-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                <motion.input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        errors.password 
                                            ? 'border-red-400 focus:border-red-500 bg-red-50' 
                                            : 'border-green-200 focus:border-green-500 bg-white'
                                    }`}
                                    placeholder="••••••••"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${passwordStrength}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-green-700">
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                            
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Confirm Password Field */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-semibold text-green-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                <motion.input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPass"
                                    value={formData.confirmPass}
                                    onChange={handleChange}
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                                        errors.confirmPass 
                                            ? 'border-red-400 focus:border-red-500 bg-red-50' 
                                            : 'border-green-200 focus:border-green-500 bg-white'
                                    }`}
                                    placeholder="••••••••"
                                    whileFocus={{ scale: 1.02 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {formData.confirmPass && formData.password === formData.confirmPass && (
                                    <CheckCircle2 className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                )}
                            </div>
                            <AnimatePresence>
                                {errors.confirmPass && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1"
                                    >
                                        {errors.confirmPass}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${
                                isSubmitting 
                                    ? 'bg-green-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 hover:shadow-xl'
                            }`}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <motion.div
                                        className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Creating Account...
                                </span>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-green-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-green-700 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full py-4 rounded-xl border-2 border-green-200 bg-white hover:bg-green-50 font-semibold text-green-900 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign up with Google
                        </motion.button>
                    </form>

                    {/* Sign In Link */}
                    <motion.p 
                        className="text-center mt-6 text-green-700"
                        variants={itemVariants}
                    >
                        Already have an account?{' '}
                        <a href="/signin" className="font-bold text-green-800 hover:text-green-900 hover:underline transition-all">
                            Sign In
                        </a>
                    </motion.p>
                </motion.div>

                {/* Terms */}
                <motion.p 
                    className="text-center mt-6 text-sm text-green-600"
                    variants={itemVariants}
                >
                    By signing up, you agree to our{' '}
                    <a href="#" className="underline hover:text-green-800 transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-green-800 transition-colors">Privacy Policy</a>
                </motion.p>
            </motion.div>
        </div>
    );
};

export default SignUp;
