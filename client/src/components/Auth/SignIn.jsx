import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    console.log('Sign in successful:', data.user);

                    // Store user data in sessionStorage
                    sessionStorage.setItem('userId', data.user.id || data.user._id);
                    sessionStorage.setItem('userName', data.user.name);
                    sessionStorage.setItem('userEmail', data.user.email);
                    sessionStorage.setItem('isAuthenticated', 'true');

                    // Store token if provided
                    if (data.token) {
                        sessionStorage.setItem('authToken', data.token);
                    }

                    // If "Remember Me" is checked, also store in localStorage
                    if (formData.rememberMe) {
                        localStorage.setItem('userId', data.user.id || data.user._id);
                        localStorage.setItem('userName', data.user.name);
                        localStorage.setItem('userEmail', data.user.email);
                        localStorage.setItem('rememberMe', 'true');
                        if (data.token) {
                            localStorage.setItem('authToken', data.token);
                        }
                    }

                    // Show success notification
                    const successNotification = document.createElement('div');
                    successNotification.className = 'fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3';
                    successNotification.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span class="font-semibold">Welcome back, ${data.user.name}!</span>
`;
                    document.body.appendChild(successNotification);

                    // Remove notification after 3 seconds
                    setTimeout(() => {
                        successNotification.remove();
                    }, 5000);

                    // Redirect to dashboard after 1 second
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);


                } else {
                    // Handle error from backend
                    setErrors({
                        email: data.message || 'Invalid credentials',
                        submit: data.message || 'Login failed'
                    });
                }
            } catch (error) {
                console.error('Sign in failed:', error);
                setErrors({
                    submit: 'Network error. Please check your connection and try again.'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleGoogleSignIn = () => {
        console.log('Google sign-in initiated');
        // Implement Google OAuth logic here
        // After successful Google sign-in, set session storage similarly:
        // sessionStorage.setItem('userId', user.id);
        // sessionStorage.setItem('userName', user.name);
        // sessionStorage.setItem('userEmail', user.email);
        // sessionStorage.setItem('isAuthenticated', 'true');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
            return;
        }

        // Simulate sending reset email
        setTimeout(() => {
            setResetSent(true);
            setTimeout(() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setResetEmail('');
            }, 3000);
        }, 1000);
    };

    // Animation variants remain the same
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

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
                    <h1 className="text-3xl font-bold text-green-900 mb-2">Welcome Back</h1>
                    <p className="text-green-700">Sign in to continue to CropGuard AI</p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-green-100 p-8"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Display submit error if exists */}
                        <AnimatePresence>
                            {errors.submit && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">{errors.submit}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${errors.email
                                        ? 'border-red-400 focus:border-red-500 bg-red-50'
                                        : 'border-green-200 focus:border-green-500 bg-white'
                                        }`}
                                    placeholder="john@example.com"
                                    whileFocus={{ scale: 1.02 }}
                                />
                            </div>
                            <AnimatePresence>
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
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
                                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${errors.password
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
                            <AnimatePresence>
                                {errors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-red-600 text-sm mt-1.5 ml-1 flex items-center gap-1"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            className="flex items-center justify-between"
                            variants={itemVariants}
                        >
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 border-2 border-green-300 rounded bg-white peer-checked:bg-green-600 peer-checked:border-green-600 transition-all duration-200 flex items-center justify-center">
                                        <motion.svg
                                            className="w-3 h-3 text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: formData.rememberMe ? 1 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </motion.svg>
                                    </div>
                                </div>
                                <span className="text-sm text-green-800 group-hover:text-green-900 transition-colors">
                                    Remember me
                                </span>
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm font-semibold text-green-700 hover:text-green-900 hover:underline transition-all"
                            >
                                Forgot Password?
                            </button>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 ${isSubmitting
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
                                    Signing In...
                                </span>
                            ) : (
                                'Sign In'
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
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </motion.button>
                    </form>

                    {/* Sign Up Link */}
                    <motion.p
                        className="text-center mt-6 text-green-700"
                        variants={itemVariants}
                    >
                        Don't have an account?{' '}
                        <a href="/signup" className="font-bold text-green-800 hover:text-green-900 hover:underline transition-all">
                            Sign Up
                        </a>
                    </motion.p>
                </motion.div>

                {/* Terms */}
                <motion.p
                    className="text-center mt-6 text-sm text-green-600"
                    variants={itemVariants}
                >
                    By signing in, you agree to our{' '}
                    <a href="#" className="underline hover:text-green-800 transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-green-800 transition-colors">Privacy Policy</a>
                </motion.p>
            </motion.div>

            {/* Forgot Password Modal - remains the same */}
            <AnimatePresence>
                {showForgotPassword && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !resetSent && setShowForgotPassword(false)}
                        />
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 px-4"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                                {!resetSent ? (
                                    <>
                                        <div className="text-center mb-6">
                                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Lock className="w-7 h-7 text-green-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-green-900 mb-2">Reset Password</h2>
                                            <p className="text-green-700 text-sm">
                                                Enter your email and we'll send you a link to reset your password
                                            </p>
                                        </div>

                                        <form onSubmit={handleForgotPassword}>
                                            <div className="mb-6">
                                                <label className="block text-sm font-semibold text-green-900 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                                                    <input
                                                        type="email"
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none bg-white transition-all"
                                                        placeholder="john@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowForgotPassword(false)}
                                                    className="flex-1 py-3 rounded-xl border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                                                >
                                                    Send Link
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        <motion.div
                                            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                        >
                                            <motion.svg
                                                className="w-8 h-8 text-green-600"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.3, duration: 0.5 }}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2.5"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </motion.svg>
                                        </motion.div>
                                        <h2 className="text-2xl font-bold text-green-900 mb-2">Check Your Email</h2>
                                        <p className="text-green-700">
                                            We've sent a password reset link to <strong>{resetEmail}</strong>
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SignIn;
