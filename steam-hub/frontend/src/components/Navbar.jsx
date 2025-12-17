import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { openModal, user, logout } = useAuth();
    const navigate = useNavigate();

    // Search State
    const [query, setQuery] = useState('');
    const [allGames, setAllGames] = useState([]);
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef(null);

    // Fetch all games on mount
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/games');
                if (res.data.success) {
                    setAllGames(res.data.games);
                }
            } catch (err) {
                console.error("Failed to fetch games for search:", err);
            }
        };
        fetchGames();
    }, []);

    // Search Algorithm: Multi-term matching
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            setSelectedIndex(0);
            return;
        }

        const terms = query.toLowerCase().trim().split(/\s+/);
        const filtered = allGames.filter(game => {
            const name = game.name.toLowerCase();
            // All terms must be present in the name
            return terms.every(term => name.includes(term));
        });

        setResults(filtered.slice(0, 5)); // Limit to top 5
        setSelectedIndex(0); // Reset to first item
    }, [query, allGames]);

    const handleSearchClose = () => {
        setQuery('');
        setResults([]);
        setSelectedIndex(0);
    };

    const handleResultClick = (gameId) => {
        navigate(`/game/${gameId}`);
        handleSearchClose();
    };

    const handleKeyDown = (e) => {
        if (results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleResultClick(results[selectedIndex]._id);
        } else if (e.key === 'Escape') {
            handleSearchClose();
        }
    };

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setResults([]);
                setSelectedIndex(0);
            }
        };

        if (results.length > 0) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [results.length]);

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0f0f0f] text-white border-b border-gray-800 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-black tracking-tighter uppercase">
                            Steam<span className="text-[#8000FF]">HUB</span>
                        </Link>
                    </div>

                    {/* Desktop Menu - Center */}
                    <div className="hidden md:flex items-center flex-1 justify-center">
                        <div className="flex items-center space-x-1">
                            <Link to="/top-games" className="hover:text-[#8000FF] hover:bg-zinc-900/50 transition-all px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                                Top Games
                            </Link>
                            <Link to="/how-to-use" className="hover:text-[#8000FF] hover:bg-zinc-900/50 transition-all px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                                How to Use
                            </Link>
                            <Link to="/store" className="hover:text-[#8000FF] hover:bg-zinc-900/50 transition-all px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                                Store
                            </Link>
                            {user && (
                                <Link to="/library" className="hover:text-[#8000FF] hover:bg-zinc-900/50 transition-all px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                                    Library
                                </Link>
                            )}
                            <Link to="/support" className="hover:text-[#8000FF] hover:bg-zinc-900/50 transition-all px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                                Support
                            </Link>
                        </div>
                    </div>

                    {/* Right Section - Search & User */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Search - Compact */}
                        <div ref={searchRef} className="relative w-52">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search games..."
                                className="w-full px-4 py-1.5 text-sm bg-zinc-900 text-white rounded-md border border-zinc-700 focus:outline-none focus:border-[#8000FF] transition-colors placeholder:text-gray-500"
                            />

                            {/* Results Dropdown */}
                            {results.length > 0 && (
                                <div className="absolute top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                                    {results.map((game, index) => (
                                        <div
                                            key={game._id}
                                            onClick={() => handleResultClick(game._id)}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-zinc-800 last:border-b-0 ${index === selectedIndex
                                                ? 'bg-[#8000FF] text-white'
                                                : 'hover:bg-zinc-800'
                                                }`}
                                        >
                                            <img
                                                src={game.images?.banner || game.images?.main}
                                                alt={game.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-bold text-sm">{game.name}</p>
                                                <p className={`text-xs ${index === selectedIndex ? 'text-gray-200' : 'text-gray-400'}`}>₹{game.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* User Section */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                {/* Download Button */}
                                <button
                                    onClick={async () => {
                                        try {
                                            const axios = (await import('axios')).default;
                                            const toast = (await import('react-hot-toast')).toast;

                                            const toastId = toast.loading('Preparing download...');

                                            const response = await axios.get('http://localhost:3000/api/app/download', {
                                                withCredentials: true,
                                                headers: {
                                                    Authorization: `Bearer ${user.token}`
                                                }
                                            });

                                            if (response.data.success && response.data.downloadUrl) {
                                                toast.success('Download started!', { id: toastId });
                                                window.location.href = response.data.downloadUrl;
                                            } else {
                                                toast.error('Failed to get download link', { id: toastId });
                                            }
                                        } catch (error) {
                                            console.error("Download Error:", error);
                                            const toast = (await import('react-hot-toast')).toast;
                                            toast.dismiss();
                                            toast.error(error.response?.data?.message || 'Download failed. Please try again.');
                                        }
                                    }}
                                    className="px-4 py-1.5 bg-[#8000FF] hover:bg-[#6a00d4] text-white text-xs font-bold uppercase rounded-md transition-colors"
                                >
                                    Download App
                                </button>

                                {/* User Menu */}
                                <div className="flex items-center gap-2 bg-zinc-900 rounded-md px-3 py-1.5 border border-zinc-800">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-sm font-semibold text-white">{user.name}</span>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to logout?")) {
                                            logout();
                                        }
                                    }}
                                    className="px-4 py-1.5 bg-zinc-900 hover:bg-red-900/20 border border-zinc-800 hover:border-red-900 text-red-400 hover:text-red-300 text-xs font-bold uppercase rounded-md transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={openModal}
                                className="px-5 py-2 bg-[#8000FF] hover:bg-[#6a00d4] text-white text-sm font-bold uppercase rounded-md transition-colors flex items-center gap-2"
                            >
                                <User size={16} />
                                <span>Sign In</span>
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
                        {user && (
                            <Link to="/library" onClick={() => setIsOpen(false)} className="block hover:bg-gray-800 hover:text-[#8000FF] px-3 py-2 rounded-md text-base font-medium uppercase">
                                Library
                            </Link>
                        )}
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
