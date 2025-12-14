export default function UserDashboard() {
    return (
        <div className="min-h-screen bg-lime-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#5a3e2b] text-lime-50 p-6 hidden md:block">
                <h1 className="text-2xl font-semibold mb-10">MyDashboard</h1>
                <nav className="space-y-4">
                    <p className="cursor-pointer hover:text-lime-300">Overview</p>
                    <p className="cursor-pointer hover:text-lime-300">Profile</p>
                    <p className="cursor-pointer hover:text-lime-300">Settings</p>
                    <p className="cursor-pointer hover:text-lime-300">Logout</p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-semibold text-[#5a3e2b]">Welcome, User</h2>
                    <div className="w-10 h-10 rounded-full bg-lime-400"></div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-lime-400">
                        <p className="text-sm text-gray-500">Total Projects</p>
                        <h3 className="text-2xl font-bold text-[#5a3e2b]">12</h3>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-lime-400">
                        <p className="text-sm text-gray-500">Active Tasks</p>
                        <h3 className="text-2xl font-bold text-[#5a3e2b]">34</h3>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-lime-400">
                        <p className="text-sm text-gray-500">Notifications</p>
                        <h3 className="text-2xl font-bold text-[#5a3e2b]">5</h3>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-12 text-sm text-gray-400">© 2025 Your Company</p>
            </main>
        </div>
    );
}
