export default function HomePage() {
    return (
        <section className="relative w-full flex flex-col items-center">

            {/* Background Image */}
            <div className="w-full h-[84vh] relative">
                <img
                    src="/imgs/XCropAiMainBg.jpg"
                    alt="XCropBg"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Fade to white at bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-b from-transparent to-white"></div>

                {/* Centered hero content INSIDE the image area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 mt-140">
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

        </section>
    );
}
