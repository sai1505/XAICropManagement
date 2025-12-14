import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/SupabaseClient";

export default function ProtectedRoutes({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });
    }, []);

    if (loading) return null;

    if (!session) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}
