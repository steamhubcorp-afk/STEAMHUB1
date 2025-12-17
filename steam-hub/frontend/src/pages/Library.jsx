import React, { useState, useEffect } from 'react';
import { Play, Download, Clock, Trophy } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Library = () => {
    const { user } = useAuth();
    const [ownedGames, setOwnedGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrary = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:3000/api/games/library', { withCredentials: true });
                if (res.data.success) {
                    setOwnedGames(res.data.games);
                }
            } catch (err) {
                console.error("Failed to fetch library:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-[#121212] min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#8000FF]/30 border-t-[#8000FF] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-[#121212] min-h-screen flex flex-col items-center justify-center text-white px-4">
                <h2 className="text-3xl font-bold mb-4">Please Login</h2>
                <p className="text-gray-400 mb-8">You need to be logged in to view your library.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-10 border-b border-gray-800 pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-white">
                            My Library
                        </h1>
                        <p className="text-gray-400 font-medium">
                            {ownedGames.length} Games Owned
                        </p>
                    </div>
                </header>

                {/* Grid */}
                {ownedGames.length === 0 ? (
                    <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-zinc-800">
                        <h2 className="text-2xl font-bold text-gray-400 mb-2">Your library is empty</h2>
                        <p className="text-gray-500 mb-6">Explore the store to add games to your collection.</p>
                        <Link to="/store" className="bg-[#8000FF] hover:bg-[#9a33ff] text-white px-8 py-3 rounded-full font-bold transition-colors">
                            Go to Store
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ownedGames.map((game) => {
                            // Calculate status based on expiration
                            const isPermanent = new Date(game.expirationDate).getFullYear() > 2030;
                            const daysLeft = Math.ceil((new Date(game.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                            const status = isPermanent ? "Owned" : `${daysLeft} Days Left`;
                            const playTime = `${game.accumulatedHours || 0} hrs`;
                            const achievements = "0/0";

                            const handleAddTime = async () => {
                                try {
                                    const res = await axios.put(
                                        `http://localhost:3000/api/games/library/${game.id}/playtime`,
                                        { hours: 6 },
                                        { withCredentials: true }
                                    );

                                    if (res.data.success) {
                                        // Update the game in the state
                                        setOwnedGames(prev => prev.map(g =>
                                            g.id === game.id
                                                ? { ...g, accumulatedHours: res.data.accumulatedHours }
                                                : g
                                        ));
                                    }
                                } catch (err) {
                                    console.error("Failed to add playtime:", err);
                                }
                            };

                            return (
                                <div key={game.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden group border border-zinc-800 hover:border-[#8000FF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(128,0,255,0.2)] hover:-translate-y-1">
                                    {/* Image Area */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={game.image}
                                            alt={game.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                        {/* Overlay Stats (Hidden by default, shown on hover) */}
                                        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm gap-3">
                                            <button className="bg-[#8000FF] hover:bg-[#9a33ff] text-white px-6 py-2 rounded-full font-bold uppercase tracking-wide flex items-center gap-2 transform transition-transform hover:scale-105">
                                                <Play size={18} fill="currentColor" />
                                                Play
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-[#8000FF] transition-colors">
                                            {game.title}
                                        </h3>

                                        <div className="flex justify-between items-center text-xs text-gray-400 border-t border-zinc-800 pt-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5" title="Play Time">
                                                    <Clock size={14} className="text-zinc-500" />
                                                    <span>{playTime}</span>
                                                </div>
                                                <button
                                                    onClick={handleAddTime}
                                                    className="text-[#8000FF] hover:text-[#9a33ff] text-xs font-bold transition-colors"
                                                >
                                                    + Add 6hrs
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Achievements">
                                                <Trophy size={14} className="text-zinc-500" />
                                                <span>{achievements}</span>
                                            </div>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                                            <div className={`w-2 h-2 rounded-full ${isPermanent ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-blue-500"}`} />
                                            <span className={isPermanent ? "text-green-400" : "text-blue-400"}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
