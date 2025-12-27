import { useEffect, useState } from "react";
import { supabase } from "../../supabase/SupabaseClient";
import { Download } from "lucide-react";

export default function UserImage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        const { data, error } = await supabase
            .from("user_chats")
            .select("id, title, created_at, main_image, derived_images")
            .order("created_at", { ascending: false });

        if (!error) setItems(data);
    };

    const imgSrc = (b64) => `data:image/png;base64,${b64}`;

    const downloadImage = (b64, filename) => {
        const link = document.createElement("a");
        link.href = imgSrc(b64);
        link.download = filename;
        link.click();
    };

    return (
        <div className="max-w-6xl mx-auto pt-28 px-4 font-poppins space-y-6">
            <h1 className="text-2xl font-poppins-medium">Your Images</h1>

            {items.length === 0 && (
                <p className="text-gray-500">No images yet</p>
            )}

            {items.map(chat => (
                <div
                    key={chat.id}
                    className="bg-lime-50 rounded-3xl p-6 space-y-4"
                >
                    <div>
                        <p className="font-poppins-medium">{chat.title}</p>
                        <p className="text-sm text-gray-600">
                            {new Date(chat.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* ORIGINAL */}
                        <ImageCard
                            label="Original"
                            image={chat.main_image}
                            onDownload={() =>
                                downloadImage(chat.main_image, `${chat.title}_original.png`)
                            }
                        />

                        {/* ENHANCED */}
                        <ImageCard
                            label="Enhanced"
                            image={chat.derived_images?.enhanced}
                            onDownload={() =>
                                downloadImage(chat.derived_images.enhanced, `${chat.title}_enhanced.png`)
                            }
                        />

                        {/* THERMAL */}
                        <ImageCard
                            label="Thermal"
                            image={chat.derived_images?.thermal}
                            onDownload={() =>
                                downloadImage(chat.derived_images.thermal, `${chat.title}_thermal.png`)
                            }
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ImageCard({ label, image, onDownload }) {
    if (!image) return null;

    return (
        <div className="rounded-2xl overflow-hidden bg-white shadow">
            <img
                src={`data:image/png;base64,${image}`}
                alt={label}
                className="w-full h-48 object-cover cursor-pointer"
            />

            <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-poppins-medium">{label}</span>
                <button
                    onClick={onDownload}
                    className="bg-lime-200 p-2 rounded-full hover:bg-lime-300"
                >
                    <Download size={16} />
                </button>
            </div>
        </div>
    );
}