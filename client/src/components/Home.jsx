import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Brain, Camera, TrendingUp, Shield, Zap } from 'lucide-react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
    // --- FIX: Removed refs that were only for GSAP selectors ---
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const cropsRef = useRef(null);
    const howItWorksRef = useRef(null);
    const canvasRef = useRef(null);
    const ctaRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        let animationFrameId;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;
        const leaves = [];
        const leafGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x22c55e, shininess: 100, transparent: true, opacity: 0.8 });
        for (let i = 0; i < 50; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.x = (Math.random() - 0.5) * 10;
            leaf.position.y = (Math.random() - 0.5) * 10;
            leaf.position.z = (Math.random() - 0.5) * 10;
            leaf.userData.velocity = { y: Math.random() * 0.01 + 0.005, x: (Math.random() - 0.5) * 0.01 };
            scene.add(leaf);
            leaves.push(leaf);
        }
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x22c55e, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            leaves.forEach((leaf) => {
                leaf.position.y += leaf.userData.velocity.y;
                leaf.position.x += leaf.userData.velocity.x;
                leaf.rotation.x += 0.01;
                leaf.rotation.y += 0.01;
                if (leaf.position.y > 5) leaf.position.y = -5;
                if (leaf.position.x > 5) leaf.position.x = -5;
                if (leaf.position.x < -5) leaf.position.x = 5;
            });
            renderer.render(scene, camera);
        };
        animate();
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            leafGeometry.dispose();
            leafMaterial.dispose();
            ambientLight.dispose();
            pointLight.dispose();
            scene.clear();
            renderer.dispose();
        };
    }, []);

    // --- FIX: Framer Motion Parallax Hooks ---
    const { scrollYProgress: heroScrollY } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'], // [elementStart, windowStart]
    });
    const heroParallaxY = useTransform(heroScrollY, [0, 1], [0, 300]);
    const heroParallaxOpacity = useTransform(heroScrollY, [0, 1], [1, 0.3]);

    const { scrollYProgress: ctaScrollY } = useScroll({
        target: ctaRef,
        offset: ['start end', 'end start'],
    });
    const ctaParallaxY = useTransform(ctaScrollY, [0, 1], ['0%', '20%']);

    // --- FIX: Framer Motion Stagger Variants ---
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.2 * i, delayChildren: 0.1 * i },
        }),
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    const cardHover = {
        y: -10,
        scale: 1.05,
        transition: { duration: 0.3 }
    };

    // --- FIX: Create state for animated circles ---
    const [circles] = useState(() =>
        [...Array(20)].map((_, i) => ({
            key: i,
            cx: Math.random() * 1000,
            cy: Math.random() * 1000,
            r: Math.random() * 3 + 1,
            yTarget: Math.random() * 200 - 100,
            duration: 10 + i * 2,
        }))
    );

    // --- FIX: Remove useGSAP hook ---

    const crops = [
        { name: 'Coconut', emoji: '🥥', diseases: 'Bud Rot, Leaf Spot' },
        { name: 'Rice', emoji: '🌾', diseases: 'Blast, Blight' },
        { name: 'Potato', emoji: '🥔', diseases: 'Late Blight, Early Blight' },
        { name: 'Groundnut', emoji: '🥜', diseases: 'Rust, Leaf Spot' },
    ];

    const features = [
        {
            icon: Camera,
            title: 'Real-Time Detection',
            desc: 'Instant disease identification from leaf images',
        },
        {
            icon: Brain,
            title: 'Explainable AI',
            desc: 'Visual heatmaps show exactly where the disease is',
        },
        {
            icon: Shield,
            title: 'Treatment Advice',
            desc: 'Get personalized recommendations instantly',
        },
        {
            icon: Zap,
            title: 'YOLOv8 Powered',
            desc: 'Lightning-fast and accurate predictions',
        },
    ];

    const steps = [
        {
            num: '01',
            title: 'Upload Image',
            desc: 'Take a photo of the affected crop leaf',
        },
        {
            num: '02',
            title: 'AI Analysis',
            desc: 'YOLOv8 detects disease patterns instantly',
        },
        {
            num: '03',
            title: 'Get Insights',
            desc: 'View heatmap and understand the diagnosis',
        },
        {
            num: '04',
            title: 'Take Action',
            desc: 'Follow treatment suggestions for recovery',
        },
    ];

    const navigate = useNavigate();

    return (
        // --- FIX: Removed containerRef, Framer Motion doesn't need it ---
        <div className="min-h-screen bg-white overflow-x-hidden">
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
                style={{ opacity: 0.3 }}
            />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Animated Background SVG */}
                <div className="absolute inset-0 z-0">
                    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#f0fdf4', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#dcfce7', stopOpacity: 1 }} />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <rect fill="url(#grad1)" width="1000" height="1000" />
                        {circles.map((circle) => (
                            <motion.circle
                                key={circle.key}
                                className="animated-circle"
                                cx={circle.cx}
                                r={circle.r}
                                fill="#22c55e"
                                opacity="0.3"
                                filter="url(#glow)"
                                transition={{
                                    duration: circle.duration,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </svg>
                </div>

                {/* --- FIX: Added ref and style for parallax --- */}
                <motion.div
                    ref={heroRef}
                    style={{ y: heroParallaxY, opacity: heroParallaxOpacity }}
                    className="relative z-10 max-w-7xl mx-auto px-6 text-center"
                    // --- FIX: Replaced timeline with variants ---
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={staggerItem} className="hero-badge inline-block mb-6 px-4 py-2 bg-green-100 rounded-full">
                        <span className="text-green-700 font-semibold">
                            🌱 AI-Powered Sustainable Agriculture
                        </span>
                    </motion.div>
                    <motion.h1 variants={staggerItem} className="hero-title text-6xl md:text-7xl font-bold text-green-900 mb-6 leading-tight">
                        Smart Crop Disease
                        <br />
                        <span className="text-green-600">Detection System</span>
                    </motion.h1>
                    <motion.p variants={staggerItem} className="hero-subtitle text-xl text-green-700 mb-12 max-w-3xl mx-auto">
                        Leveraging YOLOv8 and Explainable AI...
                    </motion.p>

                    <motion.div variants={staggerItem} className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
                        >
                            Try Disease Detection
                        </button>
                        <button
                            onClick={() => {
                                const element = document.getElementById('features');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition"
                        >
                            Learn More
                        </button>
                    </motion.div>

                    {/* Animated Plant SVG */}
                    <motion.div
                        className="mt-20"
                        initial={{ scale: 0, rotation: -180, opacity: 0 }}
                        animate={{
                            scale: 1,
                            rotation: 0,
                            opacity: 1,
                            transition: { type: 'spring', damping: 10, stiffness: 100, delay: 0.8 }
                        }}
                    >
                        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                            <defs>
                                <filter id="leafGlow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <g transform="translate(100, 100)">
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="60"
                                    stroke="#16a34a"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M 0,20 Q -30,10 -40,30"
                                    fill="#22c55e"
                                    stroke="#16a34a"
                                    strokeWidth="2"
                                    filter="url(#leafGlow)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 0 20"
                                        to="5 0 20"
                                        dur="2s"
                                        repeatCount="indefinite"
                                        additive="sum"
                                    />
                                </path>
                                <path
                                    d="M 0,20 Q 30,10 40,30"
                                    fill="#22c55e"
                                    stroke="#16a34a"
                                    strokeWidth="2"
                                    filter="url(#leafGlow)"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 0 20"
                                        to="-5 0 20"
                                        dur="2s"
                                        repeatCount="indefinite"
                                        additive="sum"
                                    />
                                </path>
                                <ellipse
                                    cx="0"
                                    cy="0"
                                    rx="15"
                                    ry="20"
                                    fill="#22c55e"
                                    stroke="#16a34a"
                                    strokeWidth="2"
                                    filter="url(#leafGlow)"
                                />
                            </g>
                        </svg>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="scroll-indicator w-6 h-10 border-2 border-green-600 rounded-full flex justify-center">
                        {/* --- FIX: Replaced GSAP with Framer loop --- */}
                        <motion.div
                            className="w-1 h-3 bg-green-600 rounded-full mt-2"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                ref={featuresRef}
                className="relative py-32 bg-gradient-to-b from-white to-green-50 z-10"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-green-900 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-green-700">
                            Advanced technology for modern agriculture
                        </p>
                    </div>
                    {/* --- FIX: Added motion.div with variants for scroll stagger --- */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                // --- FIX: Added motion.div, variants, and whileHover ---
                                <motion.div
                                    key={idx}
                                    className="feature-card bg-white p-8 rounded-2xl shadow-lg cursor-pointer"
                                    variants={staggerItem}
                                    whileHover={cardHover}
                                >
                                    <div className="feature-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-green-700">{feature.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Crops Section */}
            <section
                id="crops"
                ref={cropsRef}
                className="relative py-15 bg-green-50 z-10"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-green-900 mb-4">
                            Supported Crops
                        </h2>
                        <p className="text-xl text-green-700">
                            Specialized detection for key agricultural crops
                        </p>
                    </div>
                    {/* --- FIX: Added motion.div for scroll stagger --- */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        custom={0.15} // Use custom prop to slow down stagger
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {crops.map((crop, idx) => (
                            // --- FIX: Added motion.div, variants, and looping animate ---
                            <motion.div
                                key={idx}
                                className="crop-card bg-white p-8 rounded-2xl shadow-lg text-center cursor-pointer"
                                variants={staggerItem}
                                animate={{
                                    y: -15,
                                    transition: {
                                        duration: 2 + idx * 0.3,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                        ease: 'easeInOut',
                                    }
                                }}
                            >
                                <div className="text-6xl mb-4">{crop.emoji}</div>
                                <h3 className="text-2xl font-bold text-green-900 mb-3">
                                    {crop.name}
                                </h3>
                                <p className="text-green-700 text-sm">{crop.diseases}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how"
                ref={howItWorksRef}
                className="relative py-32 bg-white z-10"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-green-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-green-700">
                            Simple process, powerful results
                        </p>
                    </div>
                    {/* --- FIX: Added motion.div for scroll stagger --- */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        custom={0.25}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {steps.map((step, idx) => (
                            // --- FIX: Added motion.div and variants ---
                            // Note: We animate the card as one unit for simplicity
                            <motion.div key={idx} className="step-card relative" variants={staggerItem}>
                                <div className="text-center">
                                    <div className="step-number w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                                        {step.num}
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-green-700">{step.desc}</p>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="step-line hidden lg:block absolute top-10 left-full w-full h-1 origin-left">
                                        <svg className="w-full h-full" viewBox="0 0 100 10">
                                            {/* ...svg line... */}
                                        </svg>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            {/* --- FIX: Added motion.section, ref, and style for parallax --- */}
            <motion.section
                ref={ctaRef}
                className="relative py-20 bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden"
                style={{ backgroundPositionY: ctaParallaxY }}
                id="signup"
                // --- FIX: Simple whileInView for the section scale ---
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                <div className="absolute inset-0 z-0 opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                    animation: 'sparkle-bg 20s linear infinite'
                }}>
                </div>

                {/* --- FIX: Replaced GSAP with Framer loop --- */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-12 h-12 text-white opacity-20"
                    animate={{
                        y: [-25, 25], x: [-10, 10], rotate: [0, 360], scale: [0.9, 1.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                >
                    <Leaf className="w-full h-full" />
                </motion.div>
                <motion.div
                    className="absolute bottom-1/3 right-1/3 w-16 h-16 text-white opacity-15"
                    animate={{
                        y: [-35, 35], x: [-15, 15], rotate: [360, 0], scale: [1.1, 0.9]
                    }}
                    transition={{ duration: 14, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                >
                    <Leaf className="w-full h-full" />
                </motion.div>

                {/* --- FIX: Added motion.div for text/button stagger --- */}
                <motion.div
                    className="max-w-4xl mx-auto px-6 text-center relative z-10"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.h2 variants={staggerItem} className="text-5xl font-bold mb-6">
                        Ready to Protect Your Crops?
                    </motion.h2>
                    <motion.p variants={staggerItem} className="text-xl mb-12 opacity-90">
                        Join thousands of farmers using AI...
                    </motion.p>
                    <motion.button
                        onClick={() => navigate('/signup')}
                        variants={staggerItem}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition shadow-2xl"
                    >
                        Start Detecting Now
                    </motion.button>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default Home;