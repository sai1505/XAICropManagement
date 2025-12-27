import React from "react";
import { Asterisk } from 'lucide-react';
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import leafAnim from "../../assets/LeafAnim.json";
import { supabase } from "../../supabase/SupabaseClient";

const navLinks = [
    { name: "New Chat", target: "/dashboard/new" },
    { name: "History", target: "/dashboard/history" },
    { name: "Images", target: "/dashboard/images" },
    { name: "Profile", target: "/dashboard/profile" },
];


export default function DashboardNavBar() {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) setScrolled(true);
            else setScrolled(false);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSignOut = async () => {
        const { error } = supabase.auth.signOut();

        if (error) {
            console.error("Sign out failed:", error.message);
            return false;
        }
        navigate('/signin');
        return true;
    };

    return (
        <nav
            className="group -mt-3 fixed top-0 w-full h-20 z-20 px-8 transition-colors bg-gray-100/30 backdrop-blur-sm shadow-xs"
        >

            <div className="relative w-full flex items-center px-6 py-4" >
                {/* Logo Section */}
                <div className="flex items-center gap-3 text-xl font-bold tracking-normal cursor-pointer text-lime-700 " >
                    <Lottie animationData={leafAnim} className="w-18 h-18" />
                    <span className="text-xl font-poiretone text-black tracking-[0.25rem]">XCROPAI</span>
                </div>

                {/* Center Links */}
                <div className="ms-70 hidden md:flex items-center px-49 gap-8 text-gray-800 -mt-1">
                    {navLinks.map((link) => (
                        <button
                            className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors"
                            onClick={() => {
                                if (link.name == "New Chat") {
                                    navigate("/dashboard/new", { replace: true });
                                } else {
                                    navigate(link.target);
                                }
                            }}
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/*Right Side - Sign out*/}
                <button className="ms-15 font-poppins text-sm tracking-normal bg-lime-200 px-6 py-2.5 rounded-full hover:bg-lime-400 transition-colors"
                    onClick={handleSignOut}
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}