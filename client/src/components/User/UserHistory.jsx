import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Play } from "lucide-react";
import { supabase } from "../../supabase/SupabaseClient";

export default function UserHistory() {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const { data, error } = await supabase
            .from("user_chats")
            .select("id, title, created_at")
            .order("created_at", { ascending: false }); // 🔥 recent first

        if (!error) setChats(data);
    };


    const handleResume = (id) => {
        navigate(`/dashboard/chat/${id}`);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Delete this chat permanently?");
        if (!confirm) return;

        await supabase
            .from("user_chats")
            .delete()
            .eq("id", id);

        setChats(prev => prev.filter(chat => chat.id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto pt-28 px-4 font-poppins space-y-4">
            <h1 className="text-2xl font-poppins-medium">Chat History</h1>

            {chats.length === 0 && (
                <p className="text-gray-500">No chats yet</p>
            )}

            {chats.map(chat => (
                <div
                    key={chat.id}
                    className="flex items-center justify-between bg-lime-50 rounded-3xl px-6 py-4"
                >
                    <div>
                        <p className="font-poppins-medium">{chat.title}</p>
                        <p className="text-sm text-gray-600">
                            {new Date(chat.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleResume(chat.id)}
                            className="bg-lime-200 p-3 rounded-full hover:bg-lime-300"
                        >
                            <Play size={16} />
                        </button>

                        <button
                            onClick={() => handleDelete(chat.id)}
                            className="bg-red-100 p-3 rounded-full hover:bg-red-200"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}