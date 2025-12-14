import { useEffect, useState } from "react";
import { FiZap, FiImage, FiBarChart, FiTarget, FiTrendingUp, FiWifiOff, FiGrid } from "react-icons/fi";

function AnimatedNumber({ from = 0, to, duration = 2500, format }) {
    const [value, setValue] = useState(from);

    useEffect(() => {
        let frame;
        const start = performance.now();

        const animate = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const current = from + (to - from) * progress;
            setValue(current);

            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, [from, to, duration]);

    return <span>{format ? format(value) : Math.round(value)}</span>;
}

const stats = [
    {
        id: 1,
        from: 0,
        to: 40,
        format: (v) => `${v.toFixed(0)}%`,
        label: "of global crop production is lost every year to pests and diseases",
        sub: "(FAO)",
    },
    {
        id: 2,
        from: 0,
        to: 220,
        format: (v) => `$${v.toFixed(0)} Billion`,
        label: "economic loss from plant diseases annually",
    },
    {
        id: 3,
        from: 0,
        to: 600,
        format: (v) => `${v.toFixed(0)} Million`,
        label: "people could be fed with the food lost to crop pathogens",
    },
    {
        id: 4,
        from: 30,
        to: 80,
        format: (v) => `30–${v.toFixed(0)}%`,
        label: "market price spike caused by seasonal disease outbreaks",
    },
    {
        id: 5,
        from: 0,
        to: 70,
        format: (v) => `${v.toFixed(0)}+ Million`,
        label: "Indian farmers affected by crop diseases yearly",
    },
];

const keyProblems = [
    "Late or incorrect diagnosis",
    "Excessive pesticide usage",
    "Reduced crop quality and export rejection",
    "Market volatility from sudden yield drops",
    "Rising food inflation",
    "Increased global hunger and poverty",
];

const steps = [
    {
        id: 1,
        title: "Capture or Upload Image",
        desc: "Farmers upload or capture a leaf image via app or web for analysis.",
        image: "/imgs/XCropAIstep1.jpg",
    },
    {
        id: 2,
        title: "AI-Powered Analysis",
        desc: "Our deep-learning CNN identifies the crop type, detects disease, and estimates severity.",
        image: "/imgs/XCropAIstep2.jpg",
    },
    {
        id: 3,
        title: "Instant Diagnosis",
        desc: "Real-time results include disease name, confidence score, severity %, and affected region.",
        image: "/imgs/XCropAIstep3.jpg",
    },
    {
        id: 4,
        title: "Actionable Recommendations",
        desc: "Provides remedies, pesticide options, and preventive actions based on severity.",
        image: "/imgs/XCropAIstep4.jpg",
    },
    {
        id: 5,
        title: "Monitoring & Alerts",
        desc: "Area-wide alerts notify farmers and enterprises when disease patterns emerge.",
        image: "/imgs/XCropAIstep5.jpg",
    },
];

const features = [
    {
        id: 1,
        title: "Real-Time Detection",
        desc: "Scan leaf images and receive instant disease diagnosis powered by deep-learning models.",
        icon: <FiZap size={28} className="text-lime-600" />,
    },
    {
        id: 2,
        title: "High Accuracy (up to 98%)",
        desc: "Powered by PlantVillage, PlantDoc, and proprietary crop disease datasets.",
        icon: <FiTarget size={28} className="text-lime-600" />,
    },
    {
        id: 3,
        title: "Multi-Crop Support",
        desc: "Works with tomatoes, potatoes, rice, maize, cotton, chili, and more.",
        icon: <FiGrid size={28} className="text-lime-600" />,
    },
    {
        id: 4,
        title: "Severity Estimation",
        desc: "Detects infection spread and identifies early-stage symptoms using segmentation models.",
        icon: <FiBarChart size={28} className="text-lime-600" />,
    },
    {
        id: 5,
        title: "Actionable Insights",
        desc: "Provides science-backed remedies, pesticide suggestions, and prevention tips.",
        icon: <FiTrendingUp size={28} className="text-lime-600" />,
    },
    {
        id: 6,
        title: "Enterprise Dashboard",
        desc: "Predict outbreaks across regions with aggregated analytics and heatmaps.",
        icon: <FiImage size={28} className="text-lime-600" />,
    },
];


export default function HomePage() {
    const [active, setActive] = useState(1);
    const [cards, setCards] = useState(null);

    const toggle = (id) => {
        setCards(cards === id ? null : id); // click again to close
    };

    const stepsToogle = (id) => {
        setActive(active === id ? null : id);
    }
    return (
        <section id="home" className="relative w-full flex flex-col items-center">

            {/* Background Image */}
            <div className="w-full h-[84vh] relative">
                <img
                    src="/imgs/XCropAiMainBg.jpg"
                    alt="XCropBg"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Fade to white at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent to-white"></div>

                {/* Centered hero content INSIDE the image area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-160">
                    <h1 className="text-5xl font-poppins-medium leading-tight text-gray-900 max-w-3xl">
                        Protecting Global Agriculture With AI-Powered Crop Disease Detection
                    </h1>

                    <p className="text-gray-700 font-poppins text-lg mt-4 max-w-2xl">
                        Real-time disease identification, actionable insights, and scientific recommendations — helping farmers and enterprises prevent crop loss, stabilize supply chains, and ensure food security.
                    </p>

                    <button className="mt-6 font-poppins bg-lime-200 text-black px-6 py-3 rounded-full text-lg hover:bg-lime-400 transition-colors">
                        Get started
                    </button>
                </div>
            </div>

            {/* Horizontal Divider */}
            <div className="w-320 h-0.5 bg-gray-200 mt-40"></div>

            {/* Stats */}
            <section id="stats" className="w-full bg-white py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col">

                            <div className="text-4xl font-poppins-medium text-gray-900">
                                <AnimatedNumber
                                    from={stat.from}
                                    to={stat.to}
                                    format={stat.format}
                                />
                            </div>

                            <p className="mt-2 text-base font-poppins text-gray-600 leading-relaxed">
                                {stat.label}
                            </p>

                            {stat.sub && (
                                <p className="text-sm font-poppins text-gray-400 mt-1">{stat.sub}</p>
                            )}

                        </div>
                    ))}

                </div>
            </section>

            {/* Horizontal Divider */}
            <div className="w-320 h-0.5 bg-gray-200"></div>

            {/* Problems Section */}
            <section id="problems" className="w-full bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-poppins-medium text-gray-900">
                        Crop Diseases Are a Global Threat
                    </h2>

                    {/* Short intro (optional) */}
                    <p className="mt-3 text-gray-600 font-poppins max-w-2xl">
                        Crop diseases damage yields, disrupt supply chains, and
                        grow harder to manage as climate change accelerates their spread.
                    </p>

                    {/* Cards grid */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Big description card with image background */}
                        <div className="md:col-span-2 rounded-3xl overflow-hidden relative min-h-[260px]">
                            <img
                                src="/imgs/XCropAiCropDisease.jpg" // change if you want another image
                                alt="Crop disease impact"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />
                            <div className="relative z-10 h-full w-full p-6 md:p-8 flex flex-col justify-end text-white">
                                <h3 className="text-sm uppercase font-poppins tracking-[0.2em] mb-3 opacity-80">
                                    Description
                                </h3>
                                <p className="md:text-lg font-poppins leading-relaxed max-w-2xl">
                                    Crop diseases reduce agricultural productivity, disrupt food supply chains,
                                    and create long-term economic distress. As climate change accelerates,
                                    pathogens are spreading faster and becoming harder to manage — putting farmers,
                                    distributors, and entire economies at risk.
                                </p>
                            </div>
                        </div>

                        {/* “Key problems” label card */}
                        <div className="rounded-3xl bg-lime-200 text-white p-6 flex flex-col justify-between">
                            <div>
                                <p className="text-xs uppercase font-poppins tracking-[0.25em] text-neutral-950">
                                    Section
                                </p>
                                <h3 className="mt-2 text-black text-2xl font-poppins-medium">Key Problems</h3>
                            </div>
                            <p className="mt-4 text-black text-sm font-poppins">
                                Systemic issues that make crop diseases more destructive and harder to control.
                            </p>
                        </div>

                        {/* Key problem cards */}
                        {keyProblems.map((problem) => (
                            <div
                                key={problem}
                                className="rounded-3xl bg-neutral-50 border border-neutral-200 p-6 flex items-start gap-3 hover:bg-neutral-100 transition-colors"
                            >
                                <div className="mt-1.75 h-2 w-2 rounded-full bg-lime-500 shrink-0" />
                                <p className="text-sm font-poppins md:text-gray-800 leading-relaxed">
                                    {problem}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Horizontal Divider */}
            <div className="w-320 h-0.5 bg-gray-200"></div>

            {/* Our Solution */}
            <section id="solution" className="w-full py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT SIDE — Dynamic Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-neutral-100 h-[380px] flex items-end p-8 shadow-sm">
                        <img
                            src={steps.find((step) => step.id === active)?.image}
                            alt="step"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                        {/* Step title + description */}
                        <div className="relative z-10 text-white max-w-md">
                            <h3 className="text-2xl font-poppins font-semibold">
                                {steps.find((s) => s.id === active).title}
                            </h3>
                        </div>
                    </div>

                    {/* RIGHT SIDE — Hover Steps List */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-poppins-medium text-gray-900">
                            Transforming Agriculture With Machine Learning
                        </h2>
                        <p className="font-poppins text-gray-600 -mt-2 mb-4">
                            XCropAI uses advanced computer vision and deep learning to detect crop diseases with high accuracy.
                        </p>

                        {steps.map((step) => (
                            <div
                                key={step.id}
                                onClick={() => stepsToogle(step.id)}
                                className={`flex items-start gap-4 p-5 rounded-3xl cursor-pointer transition-all duration-300
                                    ${active === step.id
                                        ? "bg-lime-100 border-lime-200"
                                        : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                                    }
                                `}
                            >
                                <div>
                                    <p className="text-lg font-poppins-medium text-gray-900">
                                        {step.title}
                                    </p>

                                    {/* Smooth reveal animation */}
                                    <div
                                        className={`overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]
                                            ${active === step.id
                                                ? "max-h-40 opacity-100 translate-y-0 scale-100"
                                                : "max-h-0 opacity-0 -translate-y-2 scale-95"
                                            }
                                        `}
                                    >
                                        <p className="text-sm font-poppins text-gray-600 mt-1">
                                            {step.desc}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            {/* Horizontal Divider */}
            <div id="keyFeatures" className="w-320 h-0.5 bg-gray-200"></div>

            {/*  Key Features */}
            <section className="w-full py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-poppins-medium text-gray-900">
                            Key Features
                        </h2>
                        <p className="font-poppins text-gray-600 mt-2 max-w-2xl">
                            Powerful AI-driven capabilities designed to support farmers, enterprises, and agricultural ecosystems.
                        </p>
                    </div>


                    {features.map((f) => (
                        <div
                            key={f.id}
                            onClick={() => toggle(f.id)}
                            className={`rounded-2xl border p-6 cursor-pointer transition-all duration-300 
                                ${cards === f.id ? "bg-lime-100 border-lime-50" : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"}
                            `}
                        >
                            {/* Icon + Title */}
                            <div className="flex items-center gap-4">
                                {f.icon}
                                <h3 className="text-lg font-poppins-medium text-gray-900">{f.title}</h3>
                            </div>

                            {/* Smooth reveal content */}
                            <div
                                className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-hidden
                                    ${cards === f.id ? "max-h-40 opacity-100 mt-3 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
                                `}
                            >
                                <p className="text-sm font-poppins text-gray-600 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </section>

            {/* Horizontal Divider */}
            <div className="w-320 h-0.5 bg-gray-200"></div>

            <section className="w-full py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-poppins-medium text-gray-900">
                        Ready to Transform Agriculture?
                    </h2>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto font-poppins">
                        Empower farmers, enterprises, and governments with AI-driven crop disease detection.
                        Start diagnosing plant health in seconds.
                    </p>

                    {/* Buttons */}
                    <div className="mt-10 flex justify-center gap-4">
                        <button className="px-8 py-3 rounded-full bg-lime-200 text-black text-md font-poppins-medium hover:bg-lime-400 transition-all duration-300">
                            Try XCropAI
                        </button>
                    </div>

                </div>
            </section>

        </section>

    );
}
