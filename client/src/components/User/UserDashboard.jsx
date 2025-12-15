import { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

export default function XCropAIChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: input },
            {
                role: "ai",
                content:
                    "I can help analyze plant diseases, treatments, and prevention steps. Please upload an image or describe the issue.",
            },
        ]);
        setInput("");
    };

    const isEmpty = messages.length === 0;

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-4">
                {isEmpty ? (

                    /* INITIAL STATE */
                    <div className="min-h-full flex items-center justify-center">
                        <div className="max-w-xl w-full text-center space-y-6 flex flex-col">
                            <div className="mx-auto w-16 h-16 rounded-full bg-lime-500/20 flex items-center justify-center shadow-lg">
                                <span className="text-lime-400 text-2xl">🌱</span>
                            </div>

                            <h1 className="text-2xl font-poppins-medium">
                                Hi <span className="text-lime-600">Battula</span>
                            </h1>
                            <p className="text-gray-400 font-poppins">
                                What would you like to analyze today?
                            </p>

                            {/* INPUT */}
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about a plant disease, treatment, or prevention…"
                                    className="w-full font-poppins bg-white/10 backdrop-blur border border-neutral-300 rounded-3xl px-4 py-3 pr-12 text-sm focus:outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lime-600 hover:text-lime-500"
                                >
                                    <Send size={17} />
                                </button>
                            </div>

                            {/* QUICK ACTIONS */}
                            <div className="flex flex-wrap justify-center gap-3 pt-2">
                                {["Detect Plant Disease", "Treatment Advice", "Prevention Tips", "Upload Image"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            className="font-poppins px-5 py-1.5 text-sm rounded-full border border-neutral-200 text-black hover:bg-lime-500 hover:text-black transition"
                                        >
                                            {item}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* CHAT STATE */
                    <div className="w-full mt-15 max-w-3xl mx-auto space-y-6 py-6 pb-28">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-3 font-poppins rounded-3xl text-sm leading-relaxed shadow ${msg.role === "user"
                                        ? "bg-lime-200 text-black"
                                        : "bg-lime-50 text-gray-900"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* INPUT BAR (PERSISTENT) */}
            {!isEmpty && (
                <div className="sticky bottom-0 w-full bg-white px-4 py-4">
                    <div className="max-w-3xl mx-auto flex items-center gap-3">
                        <button className="text-lime-600 hover:text-lime-500">
                            <ImageIcon size={22} />
                        </button>

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message…"
                            className="font-poppins flex-1 bg-white/10 border border-neutral-200 rounded-2xl px-4 py-3 text-sm focus:outline-none"
                        />

                        <button
                            onClick={handleSend}
                            className="bg-lime-300 hover:bg-lime-400 text-black rounded-xl px-5 py-3 transition"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
