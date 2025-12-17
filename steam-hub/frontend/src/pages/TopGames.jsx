import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Users, ShieldCheck, Gamepad2, ShoppingCart, LifeBuoy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import axios from 'axios';

const TopGames = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    // Game Data State
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Top Games
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/games/top');
                if (res.data.success) {
                    // Map backend data to frontend structure
                    const mappedGames = res.data.games.map(game => ({
                        id: game._id,
                        title: game.name,
                        subtitle: game.about || "Experience the game.", // Fallback
                        tag: game.name.toUpperCase(),
                        image: game.images.main,
                        logo: getLocalLogo(game.steam_id), // Use local logo helper
                        // Helper to assign colors based on game (hardcoded mapping for style)
                        color: getGameColor(game.steam_id)
                    }));
                    setGames(mappedGames);
                }
            } catch (err) {
                console.error("Failed to fetch top games:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // Helper for local logos
    const getLocalLogo = (steamId) => {
        const logos = {
            "271590": "/images/hero/gta.png",
            "2651280": "/images/hero/mar.png",
            "2050650": "/images/hero/re4.png",
            "2322010": "/images/hero/gow.png"
        };
        return logos[steamId] || "/images/hero/gta.png"; // Default fallback
    };

    // Helper for colors
    const getGameColor = (steamId) => {
        const colors = {
            "271590": "text-[#8000FF]", // GTA V
            "2651280": "text-red-500",  // Spiderman 2
            "2050650": "text-red-700",  // RE4
            "2322010": "text-blue-400"  // GOW
        };
        return colors[steamId] || "text-white";
    };

    // If loading or empty, show fallback or loader (optional)
    // For now, if empty, we might want to keep the hardcoded ones as fallback?
    // The user explicitly asked to "take all these data from database", so we trust the DB.

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % games.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [games.length]);

    // Library State
    const [libraryGames, setLibraryGames] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchLibrary = async () => {
                try {
                    // Use user.id or user._id depending on what's available
                    const res = await axios.get('http://localhost:3000/api/games/library', { withCredentials: true });
                    if (res.data.success) {
                        setLibraryGames(res.data.games);
                    }
                } catch (err) {
                    console.error("Failed to fetch library:", err);
                }
            };
            fetchLibrary();
        }
    }, [user]);

    return (
        <div className="w-full">
            {/* Hero Section with Carousel */}
            <div className="relative w-full h-[100vh] overflow-hidden bg-black">
                {games.map((game, index) => {
                    let positionClass = 'translate-x-[100%] opacity-0 z-10'; // Default: waiting on right

                    if (index === current) {
                        positionClass = 'translate-x-0 opacity-100 z-20'; // Active
                    } else if (index === (current - 1 + games.length) % games.length) {
                        positionClass = '-translate-x-[100%] opacity-0 z-10'; // Previous: moved to left
                    }

                    return (
                        <div
                            key={game.id}
                            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${positionClass}`}>
                            {/* Background Image */}
                            <div className="absolute inset-0 bg-black/40 z-10" />
                            <img
                                src={game.image}
                                alt={game.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Content Layout */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-32 px-4 md:px-20">
                                <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-end md:items-center gap-8 md:gap-12">
                                    {/* Logo Section */}
                                    <div className="w-48 md:w-64 flex-shrink-0 mb-4 md:mb-0">
                                        <img
                                            src={game.logo}
                                            alt={`${game.tag} Logo`}
                                            className="w-full h-auto drop-shadow-2xl object-contain filter brightness-125 saturate-125 hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex flex-col items-start text-left mb-4">
                                        <h2 className="text-white text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-2 leading-none drop-shadow-xl max-w-2xl">
                                            {game.title}
                                        </h2>
                                        <p className="text-gray-200 text-lg md:text-xl font-medium tracking-wide mb-6 drop-shadow-lg">
                                            {game.subtitle}
                                        </p>
                                        <button onClick={() => navigate(`/game/${game.id}`)} className="group flex items-center gap-3 bg-white text-black px-8 py-3 rounded-sm font-black uppercase tracking-wider hover:bg-[#ff3366] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,51,102,0.6)]">
                                            <span className="relative">Available Now</span>
                                            <ArrowRight size={20} className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Hero Bottom Gradient Integration */}
                <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent z-20 pointer-events-none" />
            </div>

            {/* Trust Building Section (Scroll Reveal) */}
            <ScrollReveal>
                <div className="w-full bg-[#121212] py-8 border-b-4 border-[#8000FF]/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                            <div className="flex flex-col items-center group p-4 cursor-default">
                                <Users className="w-16 h-16 text-[#107C10] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" strokeWidth={1.5} />
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1 drop-shadow-md">100+ Current Users</h3>
                                <p className="text-gray-200 text-sm font-medium uppercase tracking-wide drop-shadow-md">and growing daily</p>
                            </div>
                            <div className="flex flex-col items-center group p-4 cursor-default">
                                <ShieldCheck className="w-16 h-16 text-[#107C10] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" strokeWidth={1.5} />
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1 drop-shadow-md">10K+ Trusted Users</h3>
                                <p className="text-gray-200 text-sm font-medium uppercase tracking-wide drop-shadow-md">From Start</p>
                            </div>
                            <div className="flex flex-col items-center group p-4 cursor-default">
                                <Gamepad2 className="w-16 h-16 text-[#107C10] mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" strokeWidth={1.5} />
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1 drop-shadow-md">15+ Games Added</h3>
                                <p className="text-gray-200 text-sm font-medium uppercase tracking-wide drop-shadow-md">Every Month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Game Names Marquee Section */}
            <div className="w-full bg-black py-16 overflow-hidden">
                <div className="space-y-6">
                    {/* Row 1 - Moving Right */}
                    <div className="flex gap-8 animate-marquee-right">
                        {[
                            "Grand Theft Auto V", "Red Dead Redemption 2", "Cyberpunk 2077", "The Witcher 3",
                            "Elden Ring", "God of War", "Horizon Zero Dawn", "Spider-Man 2",
                            "Grand Theft Auto V", "Red Dead Redemption 2", "Cyberpunk 2077", "The Witcher 3",
                            "Elden Ring", "God of War", "Horizon Zero Dawn", "Spider-Man 2"
                        ].map((game, i) => (
                            <div key={i} className="flex-shrink-0 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <span className="text-white font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                                    {game}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Row 2 - Moving Left */}
                    <div className="flex gap-8 animate-marquee-left">
                        {[
                            "Resident Evil 4", "Final Fantasy XVI", "Starfield", "Baldur's Gate 3",
                            "Hogwarts Legacy", "Dead Space", "Forza Horizon 5", "Halo Infinite",
                            "Resident Evil 4", "Final Fantasy XVI", "Starfield", "Baldur's Gate 3",
                            "Hogwarts Legacy", "Dead Space", "Forza Horizon 5", "Halo Infinite"
                        ].map((game, i) => (
                            <div key={i} className="flex-shrink-0 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <span className="text-white font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                                    {game}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Row 3 - Moving Right */}
                    <div className="flex gap-8 animate-marquee-right-slow">
                        {[
                            "Call of Duty: Modern Warfare", "Assassin's Creed Valhalla", "Far Cry 6", "Watch Dogs Legion",
                            "Ghost of Tsushima", "The Last of Us", "Uncharted 4", "Death Stranding",
                            "Call of Duty: Modern Warfare", "Assassin's Creed Valhalla", "Far Cry 6", "Watch Dogs Legion",
                            "Ghost of Tsushima", "The Last of Us", "Uncharted 4", "Death Stranding"
                        ].map((game, i) => (
                            <div key={i} className="flex-shrink-0 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <span className="text-white font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                                    {game}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inline Styles for Marquee Animations */}
                <style>{`
                    @keyframes marquee-right {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    @keyframes marquee-left {
                        0% { transform: translateX(-50%); }
                        100% { transform: translateX(0); }
                    }
                    .animate-marquee-right {
                        animation: marquee-right 40s linear infinite;
                    }
                    .animate-marquee-left {
                        animation: marquee-left 40s linear infinite;
                    }
                    .animate-marquee-right-slow {
                        animation: marquee-right 60s linear infinite;
                    }
                `}</style>
            </div>

            {/* Game Library Infinite Scroll Section */}
            {user && (
                <div className="relative w-full bg-black py-24 overflow-hidden group">
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

                    {/* Infinite Moving Wheel */}
                    {libraryGames.length > 0 ? (
                        <div className="flex gap-6 w-max animate-marquee opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                            {/* Repeat the list to ensure smooth marquee loop if few games */}
                            {[...libraryGames, ...libraryGames, ...libraryGames].map((game, i) => {
                                const isPermanent = new Date(game.expirationDate).getFullYear() > 2030; // Simple check for long duration
                                const daysLeft = Math.ceil((new Date(game.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));

                                return (
                                    <div key={`${game.id}-${i}`} className="flex-shrink-0 w-[200px] md:w-[300px] aspect-[3/4] rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 relative group/card border border-zinc-800">
                                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />

                                        {/* Status Badge */}
                                        <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-md">
                                            {isPermanent ? (
                                                <span className="text-[#8000FF]">Owned</span>
                                            ) : (
                                                <span className={daysLeft < 3 ? "text-red-500" : "text-green-500"}>
                                                    {daysLeft} Days Left
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                            <h4 className="text-white font-bold text-xl mb-2">{game.title}</h4>
                                            <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-[#8000FF] hover:text-white transition-colors">
                                                Play Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="relative z-30 flex flex-col items-center justify-center h-64 text-center px-4">
                            <p className="text-gray-400 text-xl mb-4">Your library is empty.</p>
                            <p className="text-gray-500 text-sm">Purchase games to see them here.</p>
                        </div>
                    )}

                    {/* Content Overlay (Bottom Left) */}
                    <div className="absolute bottom-0 left-0 z-30 p-8 md:p-16 max-w-2xl">
                        <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-xl">
                            Game Library
                        </h2>
                        <p className="text-gray-300 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-lg drop-shadow-lg">
                            All Rockstar Games titles, from upcoming releases like Grand Theft Auto VI to the classics.
                        </p>
                        <button onClick={() => navigate('/store')} className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg">
                            <span>View All</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Inline Styles for Animation */}
                    <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                    }
                `}</style>
                </div>
            )}

            {/* Usage Section (Replaces Newswire) */}
            <div className="bg-[#121212] py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl font-bold uppercase tracking-tight mb-10 border-l-4 border-[#8000FF]/50 pl-4">Usage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Usage Items */}
                        {[
                            {
                                title: "How to setup",
                                description: "A video about setup app application with all instructions.",
                                image: "https://placehold.co/1920x1080/202020/FFFFFF/png?text=VIDEO+THUMBNAIL" // Placeholder as requested
                            },
                            {
                                title: "How to change",
                                description: "How to change when user want to change to different device of the steam account.",
                                image: "https://placehold.co/1920x1080/202020/FFFFFF/png?text=VIDEO+THUMBNAIL" // Placeholder as requested
                            }
                        ].map((item, i) => (
                            <div key={i} onClick={() => navigate('/how-to-use')} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-[#202020]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center ">
                                            <Play size={32} fill="currentColor" className="text-white translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-2xl font-bold leading-tight group-hover:text-[#8000FF] transition-colors uppercase">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-400 text-lg">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Support Section */}
            <div className="relative py-32 px-4 bg-cover bg-center bg-fixed group" style={{ backgroundImage: "url('https://images8.alphacoders.com/117/1172605.jpg')" }}>
                {/* Dark Overlay with Gradient */}
                <div className="absolute inset-0 bg-black/80 transition-opacity duration-500 group-hover:bg-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                        {/* Rockstar-style Support Header */}
                        <div className="relative">
                            <LifeBuoy className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse-slow" strokeWidth={1.5} />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#8000FF] rounded-full animate-ping" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-2xl">
                            Support
                        </h2>
                    </div>

                    <p className="text-gray-200 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                        Get help with issues, browse common solutions, view service status updates, and more.
                    </p>

                    <button onClick={() => navigate('/support')} className="bg-white text-black px-10 py-3 rounded-full font-bold text-xl hover:bg-[#8000FF] hover:text-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(128,0,255,0.4)] flex items-center gap-3 mx-auto">
                        <span>Get Support</span>
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ScrollReveal = ({ children }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

export default TopGames;
