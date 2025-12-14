import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex">
            {/* LEFT – IMAGE */}
            <div className="w-1/2 bg-white flex items-center justify-center">
                <img
                    src="../imgs/XCropAISignUp.jpg"
                    alt="Signup illustration"
                    className="max-w-[70%] h-auto"
                />
            </div>

            {/* RIGHT – FORM */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md px-10">
                    <h2 className="text-3xl font-poppins-medium mb-2">Create account</h2>
                    <p className="text-gray-500 font-poppins mb-8">Please enter your details</p>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full name"
                            className="w-full border font-poppins border-lime-400 rounded-3xl px-4 py-3 focus:bg-lime-200 focus:border-white focus:outline-none"
                        />

                        <input
                            type="email"
                            placeholder="Email address"
                            className="w-full border font-poppins border-lime-400 rounded-3xl px-4 py-3 focus:bg-lime-200 focus:border-white focus:outline-none"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border font-poppins border-lime-400 rounded-3xl px-4 py-3 focus:bg-lime-200 focus:border-white focus:outline-none"
                        />

                        <button className="w-full text-neutral-950 font-poppins bg-lime-200 py-3 rounded-3xl hover:bg-lime-400 transition">
                            Sign up
                        </button>

                        <button className="w-full border border-lime-400 py-3 font-poppins rounded-3xl flex items-center justify-center gap-2 hover:border-2">
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                className="w-5"
                                alt="google"
                            />
                            Sign up with Google
                        </button>
                    </div>

                    <p className="text-sm font-poppins text-center mt-6">
                        Already have an account ? {" "}
                        <span className="text-amber-950 cursor-pointer" onClick={() => navigate('/signin')}>Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    );
}