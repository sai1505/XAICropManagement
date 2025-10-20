import React from 'react';
import { Leaf, Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    const socialLinks = [
        { icon: Twitter, href: '#' },
        { icon: Github, href: '#' },
        { icon: Linkedin, href: '#' },
    ];

    // Note: The navLinks and scrollToTop function are not used in your code,
    // so I've removed them for cleanup.

    return (
        <footer className="w-full bg-white/90 backdrop-blur-md shadow-inner border-t-2 border-green-100 rounded-t-2xl mt-20">
            <div className="bg-white/90 backdrop-blur-md shadow-xl border-green-200 px-8 py-10">

                {/* --- FIX: Replaced Grid with Flexbox --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left Side: Copyright */}
                    <p className="text-sm text-green-800 text-center md:text-left">
                        &copy; {new Date().getFullYear()} CropGuard AI. All rights reserved.
                    </p>

                    {/* Right Side: Social Media Links */}
                    <div className="flex gap-5 me-10">
                        {socialLinks.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-700 hover:text-green-500 hover:scale-110 transition-all"
                                >
                                    <Icon className="w-6 h-6" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;