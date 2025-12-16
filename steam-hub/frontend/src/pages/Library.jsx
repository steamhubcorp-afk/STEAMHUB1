import React from 'react';
import { Play, Download, Clock, Trophy } from 'lucide-react';

const Library = () => {
    // Mock "Owned" Games Data
    const ownedGames = [
        {
            id: 1,
            title: "Grand Theft Auto V",
            image: "https://placehold.co/600x400/202020/FFFFFF/png?text=GTA+V",
            playTime: "120 hrs",
            achievements: "45/70",
            status: "Installed"
        },
        {
            id: 3,
            title: "Cyberpunk 2077",
            image: "https://placehold.co/600x400/202020/FFFFFF/png?text=Cyberpunk+2077",
            playTime: "45 hrs",
            achievements: "12/50",
            status: "Update Queued"
        },
        {
            id: 4,
            title: "Elden Ring",
            image: "https://placehold.co/600x400/202020/FFFFFF/png?text=Elden+Ring",
            playTime: "200 hrs",
            achievements: "42/42",
            status: "Installed"
        },
        {
            id: 10,
            title: "Resident Evil 4",
            image: "https://placehold.co/600x400/202020/FFFFFF/png?text=RE4+Remake",
            playTime: "15 hrs",
            achievements: "10/35",
            status: "Not Installed"
        },
        {
            id: 18,
            title: "DOOM Eternal",
            image: "https://placehold.co/600x400/202020/FFFFFF/png?text=DOOM+Eternal",
            playTime: "30 hrs",
            achievements: "50/50",
            status: "Installed"
        }
    ];

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ownedGames.map((game) => (
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
                                        {game.status === "Installed" ? <Play size={18} fill="currentColor" /> : <Download size={18} />}
                                        {game.status === "Installed" ? "Play" : "Install"}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-[#8000FF] transition-colors">
                                    {game.title}
                                </h3>

                                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-zinc-800 pt-3">
                                    <div className="flex items-center gap-1.5" title="Play Time">
                                        <Clock size={14} className="text-zinc-500" />
                                        <span>{game.playTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5" title="Achievements">
                                        <Trophy size={14} className="text-zinc-500" />
                                        <span>{game.achievements}</span>
                                    </div>
                                </div>

                                {/* Status Indicator */}
                                <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                                    <div className={`w-2 h-2 rounded-full ${game.status === "Installed" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                                            game.status === "Update Queued" ? "bg-blue-500" : "bg-zinc-600"
                                        }`} />
                                    <span className={
                                        game.status === "Installed" ? "text-green-400" :
                                            game.status === "Update Queued" ? "text-blue-400" : "text-zinc-500"
                                    }>
                                        {game.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;
