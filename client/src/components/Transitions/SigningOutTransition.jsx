import Lottie from "lottie-react";
import leafLoader from "../../assets/LeafAnim.json";

export default function SigningOutTransition() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="flex items-center gap-4">
                <Lottie animationData={leafLoader} loop className="w-24 h-24" />
                <span className="text-sm text-gray-600 animate-pulse">
                    Signing out…
                </span>
            </div>
        </div>
    );
}
