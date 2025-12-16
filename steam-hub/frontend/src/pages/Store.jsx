import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import FloatingCartButton from '../components/FloatingCartButton';
import axios from 'axios';

const Store = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define tag categories
    const tagCategories = ['top', 'trending', 'survival', 'free', 'shooting'];

    useEffect(() => {
        const fetchGamesByTags = async () => {
            try {
                // Fetch all games with the specified tags
                const res = await axios.get(`http://localhost:3000/api/games/by-tags?tags=${tagCategories.join(',')}`);

                if (res.data.success) {
                    // Group games by tags
                    const groupedGames = tagCategories.map(tag => {
                        const gamesForTag = res.data.games.filter(game => game.tags.includes(tag));
                        return {
                            title: tag,
                            games: gamesForTag.map(game => ({
                                id: game._id,
                                title: game.name,
                                price: game.price === 0 ? 'Free' : `₹${game.price}`,
                                desc: game.about || 'No description available.',
                                image: game.images?.banner || 'https://placehold.co/600x400/202020/FFFFFF/png?text=GAME+IMAGE'
                            }))
                        };
                    });

                    setCategories(groupedGames);
                }
            } catch (err) {
                console.error('Failed to fetch games by tags:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGamesByTags();
    }, []);

    if (loading) {
        return (
            <div className="bg-[#121212] min-h-screen text-white pt-24 pb-20 px-4 md:px-8 flex items-center justify-center">
                <div className="text-2xl font-bold">Loading Store...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white pt-24 pb-20 px-4 md:px-8 relative">
            {/* Sticky/Floating Cart Icon */}
            <FloatingCartButton />

            <div className="max-w-[1600px] mx-auto space-y-16">
                <header className="mb-12 border-b border-gray-800 pb-8">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-lg">
                        Store
                    </h1>
                    <p className="text-gray-400 text-xl font-medium max-w-2xl">
                        Discover the latest hits, classic favorites, and free-to-play gems.
                    </p>
                </header>

                {categories.map((category, index) => (
                    <GameRow key={index} title={category.title} games={category.games} />
                ))}
            </div>
        </div>
    );
};

const GameRow = ({ title, games }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-end mb-6 px-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase border-l-4 border-[#8000FF] pl-4">
                    {title}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div
                ref={rowRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2 py-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

const GameCard = ({ game }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleCardClick = () => {
        navigate(`/game/${game.id}`, { state: { game } });
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent card click from triggering
        // Add to cart with game's actual price and 7 Days duration as default for quick add
        addToCart(game, "7 Days", game.price);
    };

    return (
        <div
            className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer relative"
            onClick={handleCardClick}
        >
            {/* Unified Card Container (Image + Details) */}
            <div className="bg-[#202020] rounded-xl overflow-hidden shadow-lg border border-zinc-800 group-hover:border-zinc-600 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:-translate-y-2">

                {/* Banner Image Area */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark Gradient Overlay for Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202020] via-transparent to-transparent opacity-90" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                            {game.title}
                        </h3>
                    </div>

                    {/* Quick Add Button (Top Right of Card Image) */}
                    <button
                        className="absolute top-3 right-3 bg-white/10 hover:bg-[#8000FF] text-white hover:text-white p-2 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0"
                        title="Quick Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>

                {/* Details Section (Merged below) */}
                <div className="p-4 pt-2">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3 line-clamp-1 border-b border-zinc-700 pb-2">
                        {game.desc}
                    </p>
                    <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-lg">
                            {game.price}
                        </span>
                        {/* Optional platform/tag */}
                        <span className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                            Base Game
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Store;
