import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { openModal, user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0f0f0f] text-white border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold tracking-tighter uppercase font-sans">
                            SteamHUB
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/top-games" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                Top Games
                            </Link>
                            <Link to="/how-to-use" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                How to Use
                            </Link>
                            <Link to="/store" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                Store
                            </Link>
                            <Link to="/library" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                Library
                            </Link>
                            <Link to="/support" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                Support
                            </Link>
                        </div>
                    </div>

                    {/* Icons (Search/User) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none">
                            <Search size={20} />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-[#8000FF]">{user.name}</span>
                                <button
                                    onClick={logout}
                                    className="text-xs uppercase font-bold text-gray-500 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={openModal}
                                className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none"
                                title="Login / Signup"
                            >
                                <User size={20} />
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0f0f0f] border-b border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/top-games" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                            Top Games
                        </Link>
                        <Link to="/how-to-use" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                            How to Use
                        </Link>
                        <Link to="/store" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                            Store
                        </Link>
                        <Link to="/library" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                            Library
                        </Link>
                        <Link to="/support" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                            Support
                        </Link>

                        {/* Mobile Auth Trigger */}
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (!user) openModal();
                            }}
                            className="block w-full text-left hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase text-gray-400"
                        >
                            {user ? `Signed in as ${user.name}` : "Login / Sign Up"}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
