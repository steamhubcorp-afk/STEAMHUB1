import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-yellow-500 selection:text-black">
            <Navbar />
            <main className="pt-16 min-h-screen flex flex-col">
                {children}
            </main>

            {/* Simple Footer matching style */}
            <footer className="bg-[#0f0f0f] py-12 border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                        <div className="mb-4 md:mb-0">
                            <span className="uppercase tracking-wider font-bold text-gray-300">SteamHUB</span>
                            <span className="mx-2">|</span>
                            <span>© 2025 SteamHUB Corp.</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Legal</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
