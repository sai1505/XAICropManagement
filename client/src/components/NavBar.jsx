import React from "react";
import { Asterisk } from 'lucide-react';
import Lottie from "lottie-react";
import leafAnim from "../assets/LeafAnim.json";

export default function NavBar() {
    return (
        <nav className="group absolute top-0 w-full z-20 bg-transparent px-8" >
            <div className="relative w-full flex items-center justify-between px-6 py-4" >
                {/* Logo Section */}
                <div className="flex items-center gap-3 text-xl font-bold tracking-normal cursor-pointer text-lime-700 " >
                    <Lottie animationData={leafAnim} className="w-18 h-18" />
                    <span className="text-xl font-poiretone tracking-[0.25rem]">XCROPAI</span>
                </div>

                {/* Center Links */}
                <div className="hidden md:flex items-center px-49 gap-8 text-gray-800 -mt-1">
                    <a href="#" className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors">Product</a>
                    <a href="#" className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors">Customers</a>
                    <a href="#" className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors">Company</a>
                    <a href="#" className="font-poppins hover:text-black hover:bg-lime-200 px-3 py-1.5 rounded-full transition-colors">Resources</a>
                </div>

                {/*Right Side*/}
                <button className="font-poppins text-sm tracking-normal bg-lime-200 px-4 py-2.5 rounded-full hover:bg-lime-400 transition-colors" >
                    Sign up / Sign in
                </button>
            </div>
        </nav>
    );
}