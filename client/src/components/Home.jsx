import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Brain, Camera, TrendingUp, Shield, Zap } from 'lucide-react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

const Home = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const cropsRef = useRef(null);
    const howItWorksRef = useRef(null);
    const canvasRef = useRef(null);
    const plantSvgRef = useRef(null);
    const ctaRef = useRef(null);

    // Three.js Scene Setup
    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;

        // Create multiple leaves floating
        const leaves = [];
        const leafGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const leafMaterial = new THREE.MeshPhongMaterial({
            color: 0x22c55e,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
        });

        for (let i = 0; i < 50; i++) {
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.x = (Math.random() - 0.5) * 10;
            leaf.position.y = (Math.random() - 0.5) * 10;
            leaf.position.z = (Math.random() - 0.5) * 10;
            leaf.userData.velocity = {
                y: Math.random() * 0.01 + 0.005,
                x: (Math.random() - 0.5) * 0.01,
            };
            scene.add(leaf);
            leaves.push(leaf);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x22c55e, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

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

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            leafGeometry.dispose();
            leafMaterial.dispose();
        };
    }, []);

    // GSAP Animations with useGSAP hook
    useGSAP(
        () => {
            // Hero section animations
            const heroTimeline = gsap.timeline({
                defaults: { ease: 'power3.out' },
            });

            heroTimeline
                .from('.hero-badge', {
                    y: -50,
                    opacity: 0,
                    duration: 0.8,
                })
                .from(
                    '.hero-title',
                    {
                        y: 100,
                        opacity: 0,
                        duration: 1,
                    },
                    '-=0.5'
                )
                .from(
                    '.hero-subtitle',
                    {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.7'
                )
                .from(
                    '.hero-buttons',
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.6'
                )
                .from(
                    plantSvgRef.current,
                    {
                        scale: 0,
                        rotation: -180,
                        opacity: 0,
                        duration: 1.2,
                        ease: 'elastic.out(1, 0.5)',
                    },
                    '-=0.4'
                );

            // Hero parallax effect
            gsap.to(heroRef.current, {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: 300,
                opacity: 0.3,
                ease: 'none',
            });

            // Features section - Stagger animation
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none none', // no reverse
                },
                scale: 0.5,
                rotation: -45,
                opacity: 0,
                duration: 0.8, // stagger between cards
                ease: 'back.out(1.7)',
            });


            // Feature cards hover effect (for each card)
            gsap.utils.toArray('.feature-card').forEach((card) => {
                const icon = card.querySelector('.feature-icon');

                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        y: -10,
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                    gsap.to(icon, {
                        rotation: 360,
                        scale: 1.2,
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                    gsap.to(icon, {
                        rotation: 0,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                });
            });

            // Crops section - Rotating cards animation
            gsap.from('.crop-card', {
                scrollTrigger: {
                    trigger: cropsRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
                scale: 0.5,
                rotation: -45,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.7)',
            });

            // Crop cards continuous float animation
            gsap.utils.toArray('.crop-card').forEach((card, index) => {
                gsap.to(card, {
                    y: -15,
                    duration: 2 + index * 0.3,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            });

            // How It Works - Slide in from left with line animation
            gsap.from('.step-card', {
                scrollTrigger: {
                    trigger: howItWorksRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                x: -150,
                opacity: 0,
                duration: 1,
                stagger: 0.25,
                ease: 'power3.out',
            });

            // Animate connecting lines
            gsap.from('.step-line', {
                scrollTrigger: {
                    trigger: howItWorksRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                scaleX: 0,
                duration: 0.8,
                stagger: 0.25,
                ease: 'power2.inOut',
            });

            // Step number animation
            gsap.from('.step-number', {
                scrollTrigger: {
                    trigger: howItWorksRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                scale: 0,
                rotation: 360,
                opacity: 0,
                duration: 0.8,
                stagger: 0.25,
                ease: 'back.out(2)',
            });

            // CTA Section - Scale up animation
            gsap.from(ctaRef.current, {
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });

            // Scroll indicator bounce
            gsap.to('.scroll-indicator', {
                y: 10,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });

            // Animated background circles
            gsap.utils.toArray('.animated-circle').forEach((circle, index) => {
                gsap.to(circle, {
                    attr: { cy: `+=${Math.random() * 200 - 100}` },
                    duration: 10 + index * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            });
        },
        { scope: containerRef }
    );

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

    return (
        <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden">
            {/* Three.js Canvas Background */}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
                style={{ opacity: 0.3 }}
            />

            {/* Header */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-green-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-8 h-8 text-green-600" />
                        <span className="text-2xl font-bold text-green-800">CropAI</span>
                    </div>
                    <div className="hidden md:flex gap-8">
                        <a
                            href="#features"
                            className="text-green-700 hover:text-green-900 transition"
                        >
                            Features
                        </a>
                        <a
                            href="#crops"
                            className="text-green-700 hover:text-green-900 transition"
                        >
                            Crops
                        </a>
                        <a
                            href="#how"
                            className="text-green-700 hover:text-green-900 transition"
                        >
                            How It Works
                        </a>
                    </div>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
                        Get Started
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Animated Background SVG */}
                <div className="absolute inset-0 z-0">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop
                                    offset="0%"
                                    style={{ stopColor: '#f0fdf4', stopOpacity: 1 }}
                                />
                                <stop
                                    offset="100%"
                                    style={{ stopColor: '#dcfce7', stopOpacity: 1 }}
                                />
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
                        {[...Array(20)].map((_, i) => (
                            <circle
                                key={i}
                                className="animated-circle"
                                cx={Math.random() * 1000}
                                cy={Math.random() * 1000}
                                r={Math.random() * 3 + 1}
                                fill="#22c55e"
                                opacity="0.3"
                                filter="url(#glow)"
                            />
                        ))}
                    </svg>
                </div>

                <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="hero-badge inline-block mb-6 px-4 py-2 bg-green-100 rounded-full">
                        <span className="text-green-700 font-semibold">
                            🌱 AI-Powered Sustainable Agriculture
                        </span>
                    </div>
                    <h1 className="hero-title text-6xl md:text-7xl font-bold text-green-900 mb-6 leading-tight">
                        Smart Crop Disease
                        <br />
                        <span className="text-green-600">Detection System</span>
                    </h1>
                    <p className="hero-subtitle text-xl text-green-700 mb-12 max-w-3xl mx-auto">
                        Leveraging YOLOv8 and Explainable AI to detect, diagnose, and treat
                        crop diseases with unprecedented accuracy and transparency
                    </p>
                    <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105">
                            Try Disease Detection
                        </button>
                        <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition">
                            Learn More
                        </button>
                    </div>

                    {/* Animated Plant SVG */}
                    <div ref={plantSvgRef} className="mt-20">
                        <svg
                            width="200"
                            height="200"
                            viewBox="0 0 200 200"
                            className="mx-auto"
                        >
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
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="scroll-indicator w-6 h-10 border-2 border-green-600 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-green-600 rounded-full mt-2"></div>
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className="feature-card bg-white p-8 rounded-2xl shadow-lg transition-all duration-500 cursor-pointer"
                                >
                                    <div className="feature-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-green-700">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Crops Section */}
            <section
                id="crops"
                ref={cropsRef}
                className="relative py-32 bg-green-50 z-10"
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {crops.map((crop, idx) => (
                            <div
                                key={idx}
                                className="crop-card bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="text-6xl mb-4">{crop.emoji}</div>
                                <h3 className="text-2xl font-bold text-green-900 mb-3">
                                    {crop.name}
                                </h3>
                                <p className="text-green-700 text-sm">{crop.diseases}</p>
                            </div>
                        ))}
                    </div>
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="step-card relative">
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
                                            <line
                                                x1="0"
                                                y1="5"
                                                x2="100"
                                                y2="5"
                                                stroke="#22c55e"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section
                ref={ctaRef}
                className="relative py-32 bg-gradient-to-br from-green-600 to-green-800 text-white z-10"
            >
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold mb-6">
                        Ready to Protect Your Crops?
                    </h2>
                    <p className="text-xl mb-12 opacity-90">
                        Join thousands of farmers using AI to detect diseases early and save
                        their harvests
                    </p>
                    <button className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition transform hover:scale-105 shadow-2xl">
                        Start Detecting Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative bg-green-900 text-white py-12 z-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Leaf className="w-6 h-6" />
                        <span className="text-xl font-bold">CropAI</span>
                    </div>
                    <p className="text-green-300 mb-4">
                        XAI-Driven Framework for Sustainable Agriculture
                    </p>
                    <p className="text-green-400 text-sm">
                        © 2025 CropAI. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
