import React, { useRef, useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const Navbar = () => {
    const navRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // --- Replaced GSAP ScrollTrigger with a native React scroll listener ---
    useEffect(() => {
        const handleScroll = () => {
            // Set state to true if user has scrolled more than 50px
            setIsScrolled(window.scrollY > 50);
        };

        // Add the event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty array means this effect runs only once (on mount)

    // --- Replaced GSAP ScrollTo with native scrollIntoView ---
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
        setIsMenuOpen(false);
    };

    const navItems = [
        { name: 'Features', id: 'features' },
        { name: 'How It Works', id: 'how' },
        { name: 'Sign Up', href: '/signup' },
        { name: 'Sign In', href: '/signin' },
    ];

    return (
        <nav
            ref={navRef}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-[95%] max-w-6xl"
        >
            {/* This div now uses conditional classes based on the `isScrolled` state.
              We also add Tailwind's 'transition-all duration-300' to animate the changes.
            */}
            <div
                className={`
                    backdrop-blur-md rounded-full px-8 py-4 border-2
                    transition-all duration-300
                    ${isScrolled
                        ? 'bg-white/100 shadow-xl border-green-200'
                        : 'bg-white/80 shadow-none border-transparent'
                    }
                `}
            >
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                            <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-green-900 hidden sm:block">
                            CropGuard AI
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (item.id) {
                                        scrollToSection(item.id);
                                    } else if (item.href) {
                                        window.location.href = item.href;
                                    }
                                }}
                                // --- Removed GSAP hover, using Tailwind's hover:scale-105 ---
                                className={`
                                    px-6 py-2.5 rounded-full font-semibold
                                    transition-all duration-200 ease-out
                                    hover:scale-[1.05] hover:-translate-y-0.5
                                    ${item.href
                                        ? item.name === 'Sign Up'
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                            : 'border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800'
                                        : 'text-green-800 hover:bg-green-100 hover:text-green-900'
                                    }
                                `}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-full transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-green-200">
                        {navItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (item.id) {
                                        scrollToSection(item.id);
                                    } else if (item.href) {
                                        window.location.href = item.href;
                                    }
                                }}
                                className={`block w-full text-center px-6 py-3 rounded-full mb-2 transition-all font-semibold ${item.href
                                    ? item.name === 'Sign Up'
                                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                                        : 'border-2 border-green-600 text-green-700 hover:bg-green-50'
                                    : 'text-green-800 hover:bg-green-100'
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;