import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import leafLoader from "../../assets/LeafAnim.json";

export default function SigningOutTransition() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/signin", { replace: true });
        }, 3000);
    }, []);

    return (
        <div className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-gradient-to-br
            from-green-50
            via-white
            to-lime-50
            ">

            <div className="flex items-center gap-4">

                <Lottie
                    animationData={leafLoader}
                    loop
                    className="w-24 h-24"
                />

                <span className="text-xs text-gray-500 tracking-wider uppercase">
                    Signing out...
                </span>

            </div>
        </div>
    );
}
