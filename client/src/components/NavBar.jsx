import React from "react";
import { Asterisk } from 'lucide-react';
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import leafAnim from "../assets/LeafAnim.json";

const navLinks = [
    { name: "Home", target: "home" },
    { name: "Stats", target: "stats" },
    { name: "Problems", target: "problems" },
    { name: "Solution", target: "solution" },
    { name: "Key Features", target: "keyFeatures" },
];

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const goToSection = (id) => {
        navigate("/");
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`group -mt-3 fixed top-0 w-full h-20 z-20 px-8 transition-colors 
                ${scrolled ? "bg-gray-100/30 backdrop-blur-sm shadow-xs" : "bg-transparent"}
            `}
        >

            <div className="relative w-full flex items-center px-6 py-4" >
                {/* Logo Section */}
                <div className="flex items-center gap-3 text-xl font-bold tracking-normal cursor-pointer text-lime-700 " >
                    <Lottie animationData={leafAnim} className="w-18 h-18" />
                    <span className="text-xl font-poiretone text-black tracking-[0.25rem]">XCROPAI</span>
                </div>

                {/* Center Links */}
                <div className={`ms-30 hidden md:flex items-center px-49 gap-8 -mt-1 
                    ${scrolled ? "text-black" : "text-white"}
                `}>
                    {navLinks.map((link) => (
                        <button
                            key={link.target}
                            onClick={() => goToSection(link.target)}
                            className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/*Right Side - Sign up*/}
                <button className="ms-15 font-poppins text-sm tracking-normal bg-lime-200 px-6 py-2.5 rounded-full hover:bg-lime-400 transition-colors"
                    onClick={() => navigate('/signup')} >
                    Sign Up
                </button>

                {/*Right Side - Sign In*/}
                <button className="ms-5 font-poppins text-sm tracking-normal bg-lime-200 px-6 py-2.5 rounded-full hover:bg-lime-400 transition-colors"
                    onClick={() => navigate('/signin')} >
                    Sign In
                </button>
            </div>
        </nav >
    );
}