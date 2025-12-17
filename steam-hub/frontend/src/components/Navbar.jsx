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
                            {user && (
                                <Link to="/library" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                    Library
                                </Link>
                            )}
                            <Link to="/support" className="hover:text-[#8000FF] transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide">
                                Support
                            </Link>
                        </div>
                    </div>

                    {/* Icons (Search/User) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Search */}
                        <div ref={searchRef} className="relative w-64">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search games..."
                                className="w-full px-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:outline-none focus:border-[#8000FF] transition-colors"
                            />

                            {/* Results Dropdown */}
                            {results.length > 0 && (
                                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
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

                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-[#8000FF]">{user.name}</span>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to logout?")) {
                                            logout();
                                        }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2 rounded"
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
