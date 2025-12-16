import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Clock, Check, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FloatingCartButton from '../components/FloatingCartButton';

const GameDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Attempt to get game data from location state, or fallback to dummy data if accessed directly
    const game = location.state?.game || {
        id: id,
        title: "Game Title",
        desc: "Experience the ultimate gaming adventure.",
        image: "https://placehold.co/1920x1080/202020/FFFFFF/png?text=GAME+IMAGE",
        price: "$59.99"
    };

    const pricingOptions = [
        { label: "7 Days", price: "₹10", value: "7 Days" },
        { label: "30 Days", price: "₹50", value: "30 Days" },
        { label: "Permanent", price: "₹300", value: "Permanent" },
    ];

    const handleAddToCart = (option) => {
        addToCart(game, option.value, option.price);
        // navigate('/cart'); // Removed auto-redirect as requested
    };

    return (
        <div className="bg-[#121212] min-h-screen text-white pt-24 pb-12 px-4 md:px-8 relative">
            <FloatingCartButton />
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">

                {/* LEFT: 70% Hero Image Section */}
                <div className="lg:col-span-7 h-[50vh] lg:h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800">
                    <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

                    {/* Floating Title on large image */}
                    <div className="absolute bottom-8 left-8">
                        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl mb-2">
                            {game.title}
                        </h1>
                        <p className="text-xl text-gray-200 font-medium max-w-2xl drop-shadow-md">
                            {game.desc}
                        </p>
                    </div>
                </div>

                {/* RIGHT: 30% Details & Pricing */}
                <div className="lg:col-span-3 space-y-6 flex flex-col justify-center">

                    {/* Game Info Card */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <span className="bg-[#8000FF] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                Available Now
                            </span>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                <Shield size={14} /> Official License
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400 mb-6">
                            <p className="flex justify-between border-b border-zinc-800 pb-2">
                                <span>Platform</span> <span className="text-white">PC (Steam/Epic)</span>
                            </p>
                            <p className="flex justify-between border-b border-zinc-800 pb-2">
                                <span>Developer</span> <span className="text-white">Rockstar Games</span>
                            </p>
                            <p className="flex justify-between pt-1">
                                <span>Base Price</span> <span className="text-gray-500 line-through">$59.99</span>
                            </p>
                        </div>
                    </div>

                    {/* Pricing Timeline Card */}
                    <div className="bg-[#202020] rounded-xl p-6 border-2 border-zinc-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-zinc-800 p-2 rounded-bl-xl text-zinc-500">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Select Duration</h3>

                        <div className="space-y-4">
                            {pricingOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-[#151515] p-4 rounded-lg border border-zinc-700 hover:border-[#8000FF] transition-colors group"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg text-white group-hover:text-[#8000FF] transition-colors">
                                            {option.label}
                                        </span>
                                        <span className="text-xs text-[#8000FF]">Instant Delivery</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-bold text-white">
                                            {option.price}
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(option)}
                                            className="bg-zinc-800 hover:bg-[#8000FF] hover:text-white text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCart size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-xs text-gray-500 mt-6">
                            *Prices are tailored for regional access.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GameDetails;
