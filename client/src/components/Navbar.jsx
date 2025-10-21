import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Navbar = () => {
    const navRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle scrolling to section after navigation
    useEffect(() => {
        const hash = location.hash;
        if (hash) {
            // Small delay to ensure the page has rendered
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }, 100);
        }
    }, [location]);

    const scrollToSection = (sectionId) => {
        const currentPath = location.pathname;
        
        // If we're already on the home page
        if (currentPath === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        } else {
            // Navigate to home page with hash
            navigate(`/#${sectionId}`);
        }
        
        setIsMenuOpen(false);
    };

    const handleNavigation = (item) => {
        if (item.id) {
            // It's a section scroll
            scrollToSection(item.id);
        } else if (item.href) {
            // It's a regular link
            navigate(item.href);
            setIsMenuOpen(false);
        }
    };

    const navItems = [
        { name: 'Home', href: '/' },
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
                    <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
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
                                onClick={() => handleNavigation(item)}
                                className={`
                                    px-6 py-2.5 rounded-full font-semibold
                                    transition-all duration-200 ease-out
                                    hover:scale-[1.05] hover:-translate-y-0.5
                                    ${item.href
                                        ? item.name === 'Sign Up'
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                            : item.name === 'Sign In'
                                            ? 'border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800'
                                            : 'text-green-800 hover:bg-green-100 hover:text-green-900'
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
                                onClick={() => handleNavigation(item)}
                                className={`block w-full text-center px-6 py-3 rounded-full mb-2 transition-all font-semibold ${
                                    item.href
                                        ? item.name === 'Sign Up'
                                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                                            : item.name === 'Sign In'
                                            ? 'border-2 border-green-600 text-green-700 hover:bg-green-50'
                                            : 'text-green-800 hover:bg-green-100'
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
