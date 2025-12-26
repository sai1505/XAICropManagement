import { useState, useRef, useEffect } from "react";
import { Upload, Send, Image as ImageIcon, Thermometer, Sparkles, HelpCircle } from "lucide-react";

/* MAIN */
export default function UserDashboard() {
    const [image, setImage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [crop, setCrop] = useState("");
    const [analysis, setAnalysis] = useState(null);

    const handleUpload = async (file) => {
        if (!crop.trim()) return;
        const formData = new FormData();
        formData.append("name", crop);
        formData.append("image", file);

        const res = await fetch("http://localhost:8000/api/analyze", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();
        setAnalysis(data);
    };

    const imgSrc = (b64) => `data:image/png;base64,${b64}`;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file || !crop.trim()) return;
        handleUpload(file);
    };

    const handleSend = async () => {
        if (!input.trim() || !analysis) return;

        const userMsg = { role: "user", content: input };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setMessages(prev => [...prev, { role: "ai", content: "Typing…" }]);

        try {
            const res = await fetch("http://localhost:8000/api/analyze/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: crop,
                    stats: analysis.stats,
                    previous_response:
                        messages
                            .filter(m => m.role === "ai")
                            .map(m => m.content)
                            .join("\n"),
                    question: userMsg.content,
                }),
            });

            const data = await res.json();

            setMessages(prev => [
                ...prev,
                { role: "ai", content: data.response }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    content: "⚠️ Unable to get response. Please try again."
                }
            ]);
        }
    };


    return (
        <div className="h-screen bg-white flex flex-col">

            {!analysis && (
                <ImageUpload
                    crop={crop}
                    setCrop={setCrop}
                    handleFileChange={handleFileChange}
                />
            )}

            {analysis && (
                <div className="flex-1 overflow-y-auto">
                    <div className="mt-20 flex justify-center">
                        <h1
                            className="mt-5 inline-flex px-6 py-2 bg-lime-200 text-2xl font-poppins-medium rounded-3xl text-center"
                        >
                            {crop} Analysis
                        </h1>
                    </div>


                    <AnalysisFlow
                        image={{
                            original: imgSrc(analysis.images.original),
                            enhanced: imgSrc(analysis.images.enhanced),
                            thermal: imgSrc(analysis.images.thermal),
                        }}
                        stats={analysis.stats}
                        analysis={analysis}
                    />

                    <ChatUI
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                        analysis={analysis}
                    />
                </div>
            )}
        </div>

    );

}

/* UPLOAD */
function ImageUpload({ crop, setCrop, handleFileChange }) {
    return (
        <div className="flex-1 flex items-center justify-center px-4 font-poppins">
            <div className="w-full max-w-xl text-center space-y-6">

                <input
                    type="text"
                    placeholder="Enter crop name (e.g., Potato)"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border border-neutral-200
                               focus:outline-none focus:ring-2 focus:ring-lime-400"
                />

                <label className="block border-2 border-neutral-200 rounded-3xl
                                  px-24 py-20 cursor-pointer hover:border-lime-400">
                    <Upload className="mx-auto text-lime-500" size={36} />
                    <p className="mt-4">Upload plant image</p>

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </label>
            </div>
        </div>
    );
}


/* ANALYSIS FLOW */
function AnalysisFlow({ image, stats, analysis }) {
    return (
        <div className="px-4 py-10 space-y-10 max-w-5xl mx-auto pb-32">
            <ImageFlow image={image} />
            <Insights stats={stats} llm={analysis.llm_analysis} prevention={analysis.prevention} />
        </div>
    );
}


/* IMAGE FLOW */
function ImageFlow({ image }) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <ImageCard title="Original" image={image.original} />
            <ImageCard title="Enhanced" image={image.enhanced} icon={<Sparkles size={16} />} />
            <ImageCard title="Pseudo Thermal" image={image.thermal} icon={<Thermometer size={16} />} overlay />
        </div>
    );
}

function ImageCard({ title, image, icon, overlay }) {
    return (
        <div className="rounded-2xl overflow-hidden shadow">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex items-center gap-2 font-poppins text-sm">
                {icon} {title}
            </div>
        </div>
    );
}

/* INSIGHTS */
function Insights({ stats, llm, prevention }) {
    const health = stats.plant_health;
    const imageAnalysis = stats.image_analysis;

    return (
        <div className="space-y-6">
            {/* EXISTING STATS */}
            <div className="rounded-3xl bg-lime-50 p-6 space-y-4">
                <h2 className="font-poppins-medium text-lg">AI Findings</h2>

                <Stat label="Disease Stage" value={health.disease_stage} />
                <Stat label="Stress %" value={`${health.stress_percentage}%`} />
                <Stat label="Care Urgency" value={health.care_urgency} />
                <Stat label="Recovery Potential" value={health.recovery_potential} />
                <Stat label="Infected Area" value={imageAnalysis.infected_area_percent} />
                <Stat label="Life Expectancy" value={health.life_expectancy_band} />
                <Stat label="Health Score" value={health.health_score} />
                <Stat label="Survivability Score" value={health.survivability_score} />
            </div>

            {/* LLM EXPLANATION — CHAT STYLE */}
            {llm && (
                <div className="flex justify-start">
                    <div className="text-gray-700 px-5 py-4 rounded-3xl space-y-3 text-[15px] font-poppins leading-relaxed">
                        <p className="font-poppins-medium text-xl">
                            AI Explanation
                        </p>

                        <p className="leading-relaxed">{llm.explanation}</p>

                        <div className="space-y-2">
                            <p className="text-gray-800">
                                <span className="font-poppins-medium">Future Trend:</span>{" "}
                                {llm.future_trend}
                            </p>

                            <p className="text-gray-800">
                                <span className="font-poppins-medium">Confidence:</span>{" "}
                                {llm.confidence_level}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {prevention && (
                <div className="flex justify-start -mt-9">
                    <div className="px-5 py-4 rounded-3xl font-poppins text-[15px] space-y-3 leading-relaxed">

                        <div className="space-y-2" >
                            <p className="font-poppins-medium">
                                Prevention & Care Guidance
                            </p>
                            {/* OVERALL ASSESSMENT */}
                            <p className="text-gray-700">
                                {prevention.overall_assessment}
                            </p>
                        </div>


                        {/* PREVENTION STEPS */}
                        {prevention.prevention_steps?.length > 0 && (
                            <div className="space-y-2">
                                <p className="font-poppins-medium text-gray-800">
                                    Recommended Actions
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {prevention.prevention_steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CAUTIONS */}
                        {prevention.necessary_cautions?.length > 0 && (
                            <div className="space-y-2">
                                <p className="font-poppins-medium text-gray-800">
                                    Important Cautions
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {prevention.necessary_cautions.map((caution, i) => (
                                        <li key={i}>{caution}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}


function Stat({ label, value }) {
    return (
        <div className="flex justify-between text-sm font-poppins">
            <span className="text-gray-500">{label}</span>
            <span>{value}</span>
        </div>
    );
}

/* CHAT */
function ChatUI({ messages, input, setInput, onSend, analysis }) {
    const bottomRef = useRef(null);

    // AUTO SCROLL WHEN MESSAGES CHANGE
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {/* CHAT MESSAGES — PART OF MAIN SCROLL */}
            <div className="px-4 py-6 max-w-5xl mx-auto space-y-3 font-poppins -mt-25">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-3 rounded-3xl text-[15px] max-w-[75%]
              ${m.role === "user" ? "bg-lime-200 text-black" : "text-gray-700"}`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {/* SCROLL TARGET */}
                <div ref={bottomRef} />
            </div>

            {/* INPUT — STICKY */}
            <div className="sticky bottom-0 bg-white px-4 py-3 font-poppins">
                <div className="max-w-5xl mx-auto flex gap-3 items-center">

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={!analysis}
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                        placeholder="Ask about this crop…"
                        className="flex-1 border border-neutral-400 rounded-3xl px-4 py-3 text-sm focus:outline-none"
                    />

                    <button
                        onClick={onSend}
                        className="bg-lime-300 px-6 py-4 rounded-3xl hover:bg-lime-400"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
