import React, { useState, useEffect } from "react";

const slides = [
    {
        title: "Empower Your Farming",
        desc: "AI-driven crop disease analysis to secure better yields.",
        img: "/imgs/XCropAiSlide1.jpg",
    },
    {
        title: "Instant Disease Detection",
        desc: "Upload a leaf image and get AI-powered insights instantly.",
        img: "/imgs/XCropAiSlide2.jpg",
    },
    {
        title: "Protect Your Crops",
        desc: "Receive actionable advice and prevention strategies.",
        img: "/imgs/XCropAiSlide3.jpg",
    },
];

export default function AuthPage() {
    const [active, setActive] = useState(0);
    const [mode, setMode] = useState("signin");

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center px-4">

            {/* LEFT SIDE — CARD SLIDER */}
            <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center">

                {/* CARD CONTAINER */}
                <div className="w-[90%] h-[78%] rounded-3xl relative shadow-2xl overflow-hidden bg-black/10 backdrop-blur-sm">

                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out
                                ${active === index ? "opacity-100" : "opacity-0"}
                                `}
                        >
                            <img
                                src={slide.img}
                                alt="slide"
                                className="absolute inset-0 w-full h-full object-cover"
                            />


                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40"></div>

                            {/* Text */}
                            <div className="absolute bottom-10 left-10 text-white max-w-md">
                                <h2 className="text-3xl font-poppins-medium">{slide.title}</h2>
                                <p className="text-md mt-2 font-poppins">{slide.desc}</p>
                            </div>
                        </div>
                    ))}

                    {/* DOTS NAVIGATION */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-3 h-3 rounded-full transition-all
                                        ${active === i ? "bg-white scale-125" : "bg-white/40"}
                                    `}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>


            {/* RIGHT SIDE — FORM */}
            <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-10">

                {/* Toggle Buttons */}
                <div className="flex gap-5 mb-8 mx-auto">
                    <button
                        onClick={() => setMode("signin")}
                        className={`px-6 py-2 rounded-full text-sm font-poppins transition-all
                ${mode === "signin" ? "bg-lime-300 text-black" : "bg-gray-200 text-gray-600"}
              `}
                    >
                        Sign In
                    </button>

                    <button
                        onClick={() => setMode("signup")}
                        className={`px-6 py-2 rounded-full text-sm font-poppins transition-all
                ${mode === "signup" ? "bg-lime-300 text-black" : "bg-gray-200 text-gray-600"}
              `}
                    >
                        Sign Up
                    </button>
                </div>

                {/* FORM */}
                <div className="w-full max-w-sm mx-auto">

                    {mode === "signin" && (
                        <div className="animate-fadeIn">
                            <h2 className="text-3xl font-poppins-medium mb-6">Welcome Back</h2>

                            <input
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl mb-4 font-poppins"
                                placeholder="Enter your email"
                            />

                            <input
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl mb-6 font-poppins"
                                placeholder="Enter your password"
                                type="password"
                            />

                            <button className="w-full py-3 bg-lime-300 rounded-xl font-poppins-medium hover:bg-lime-400">
                                Sign In
                            </button>
                        </div>
                    )}

                    {mode === "signup" && (
                        <div className="animate-fadeIn">
                            <h2 className="text-3xl font-poppins-medium mb-6">Create Account</h2>

                            <input
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl mb-4 font-poppins"
                                placeholder="Full name"
                            />

                            <input
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl mb-4 font-poppins"
                                placeholder="Email"
                                type="email"
                            />

                            <input
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl mb-6 font-poppins"
                                placeholder="Password"
                                type="password"
                            />

                            <button className="w-full py-3 bg-lime-300 rounded-xl font-poppins-medium hover:bg-lime-400">
                                Sign Up
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
