import { useState, useRef, useEffect } from "react";
import { Upload, Send, Image as ImageIcon, Thermometer, Sparkles, HelpCircle } from "lucide-react";

/* MAIN */
export default function XCropAIChat() {
    const [image, setImage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleUpload = (file) => {
        setImage(URL.createObjectURL(file));
        setStage("analysis");
    };

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages((prev) => [...prev, { role: "user", content: input }, { role: "ai", content: "Here’s more guidance based on the detected crop condition." }]);
        setInput("");
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {!image && <ImageUpload onUpload={handleUpload} />}

            {image && (
                <div className="flex-1 overflow-y-auto">
                    {/* ANALYSIS */}
                    <AnalysisFlow image={image} />

                    {/* CHAT (PART OF SCROLL) */}
                    <ChatUI
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                    />
                </div>
            )}
        </div>

    );

}

/* UPLOAD */
function ImageUpload({ onUpload }) {
    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <label className="w-full max-w-xl border-2 border-neutral-200 rounded-3xl px-40 py-30 text-center cursor-pointer hover:border-lime-400 transition">
                <Upload className="mx-auto text-lime-500" size={36} />
                <p className="mt-4 font-poppins">Upload plant image</p>
                <p className="text-sm font-poppins text-gray-400">Recommended 1024×1024</p>
                <input type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files[0])} />
            </label>
        </div>
    );
}

/* ANALYSIS FLOW */
function AnalysisFlow({ image }) {
    return (
        <div className="px-4 py-10 mt-30 space-y-10 max-w-5xl mx-auto pb-32">
            <ImageFlow image={image} />
            <Insights />
            <Actions />
        </div>
    );
}


/* IMAGE FLOW */
function ImageFlow({ image }) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <ImageCard title="Original" image={image} />
            <ImageCard title="Enhanced" image={image} icon={<Sparkles size={16} />} />
            <ImageCard title="Pseudo Thermal" image={image} icon={<Thermometer size={16} />} overlay />
        </div>
    );
}

function ImageCard({ title, image, icon, overlay }) {
    return (
        <div className="rounded-2xl overflow-hidden shadow">
            <div className="relative">
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                {overlay && <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-blue-500/30" />}
            </div>
            <div className="p-4 flex items-center gap-2 font-poppins text-sm">
                {icon} {title}
            </div>
        </div>
    );
}

/* INSIGHTS */
function Insights() {
    return (
        <div className="rounded-3xl bg-lime-50 p-6 space-y-4">
            <h2 className="font-poppins-medium text-lg">AI Findings</h2>
            <Stat label="Disease" value="Leaf Spot (Moderate)" />
            <Stat label="Affected Area" value="32%" />
            <Stat label="Confidence" value="91%" />
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

/* ACTIONS */
function Actions() {
    const items = ["Immediate Treatment", "Preventive Measures", "Long-term Care"];
    return (
        <div className="grid md:grid-cols-3 gap-4">
            {items.map((i) => (
                <div key={i} className="rounded-3xl border border-neutral-300 p-5 font-poppins hover:bg-lime-50 outline-none transition-colors">
                    {i}
                </div>
            ))}
        </div>
    );
}

/* CHAT */
function ChatUI({ messages, input, setInput, onSend }) {
    const bottomRef = useRef(null);

    // AUTO SCROLL WHEN MESSAGES CHANGE
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {/* CHAT MESSAGES — PART OF MAIN SCROLL */}
            <div className="px-4 py-6 max-w-5xl mx-auto space-y-4 font-poppins">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-3 rounded-3xl text-sm max-w-[75%]
              ${m.role === "user" ? "bg-lime-200" : "bg-gray-100"}`}
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
