import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, MessageSquarePlus, Image, History, User, Menu, X } from 'lucide-react';

const UserDashboardNavbar = () => {
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

    const navItems = [
        { name: 'New Chat', icon: MessageSquarePlus, path: '/dashboard' },
        { name: 'Images', icon: Image, path: '/dashboard/image' },
        { name: 'History', icon: History, path: '/dashboard/history' },
        { name: 'Profile', icon: User, path: '/dashboard/profile' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] w-[95%] max-w-6xl">
            <div className={`
                    backdrop-blur-md rounded-full px-8 py-4 border-2
                    transition-all duration-300
                    ${isScrolled
                    ? 'bg-white/100 shadow-xl border-green-200'
                    : 'bg-white/80 shadow-none border-green-100'
                }
                `}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/dashboard')}
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
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold
                                        transition-all duration-200 ease-out
                                        hover:scale-[1.05] hover:-translate-y-0.5
                                        ${active
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'text-green-800 hover:bg-green-100 hover:text-green-900'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-full transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-7 h-7" />
                        ) : (
                            <Menu className="w-7 h-7" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-green-200">
                        {navItems.map((item, index) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`
                                        flex items-center justify-center gap-2 w-full px-6 py-3 
                                        rounded-full mb-2 transition-all font-semibold
                                        ${active
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'text-green-800 hover:bg-green-100'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UserDashboardNavbar;
