import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Shield, Gamepad2, Cpu, HardDrive, Monitor, MemoryStick, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FloatingCartButton from '../components/FloatingCartButton';
import axios from 'axios';

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/games/${id}`);
                if (res.data.success) {
                    setGame(res.data.game);
                } else {
                    setError('Game not found');
                }
            } catch (err) {
                console.error("Error fetching game details:", err);
                setError('Failed to load game details');
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (game) {
            // Updated to pass required arguments: product, duration, price, qty
            addToCart(game, 'Permanent', game.price.toString(), 1);
        }
    };

    if (loading) return <div className="text-white text-center pt-40">Loading game details...</div>;
    if (error) return <div className="text-red-500 text-center pt-40">{error}</div>;
    if (!game) return null;

    return (
        <div className="bg-[#121212] min-h-screen text-white pt-24 pb-12 px-4 md:px-8 relative">
            <FloatingCartButton />
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">

                {/* LEFT: 70% Content Section */}
                <div className="lg:col-span-7 space-y-12">

                    {/* Hero Image */}
                    <div className="h-[50vh] lg:h-[70vh] rounded-2xl overflow-hidden shadow-2xl relative border border-zinc-800">
                        <img
                            src={game.images?.main || game.images?.banner}
                            alt={game.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-8 left-8">
                            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-2xl mb-2">
                                {game.name}
                            </h1>
                            <div className="flex gap-2">
                                {game.tags?.map((tag, index) => (
                                    <span key={index} className="bg-zinc-900/80 text-gray-300 px-3 py-1 rounded text-xs font-bold uppercase backdrop-blur-sm border border-zinc-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-[#1a1a1a] rounded-xl p-8 border border-zinc-800">
                        <h2 className="text-2xl font-bold mb-4 text-[#8000FF] uppercase tracking-wide">Description</h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {game.description}
                        </p>
                    </div>

                    {/* About This Game */}
                    <div className="bg-[#1a1a1a] rounded-xl p-8 border border-zinc-800">
                        <h2 className="text-2xl font-bold mb-4 text-[#8000FF] uppercase tracking-wide">About This Game</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {game.about}
                        </p>
                    </div>

                    {/* System Requirements */}
                    <div className="bg-[#1a1a1a] rounded-xl p-8 border border-zinc-800">
                        <h2 className="text-2xl font-bold mb-6 text-[#8000FF] uppercase tracking-wide flex items-center gap-2">
                            <Monitor size={24} /> System Requirements
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Minimum */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-200 border-b border-zinc-700 pb-2">Minimum</h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li className="flex gap-3">
                                        <span className="w-6"><Monitor size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">OS:</strong> {game.systemRequirements?.minimum?.os || 'Windows 10'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><Cpu size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Processor:</strong> {game.systemRequirements?.minimum?.processor || 'Intel Core i5'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><MemoryStick size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Memory:</strong> {game.systemRequirements?.minimum?.memory || '8 GB RAM'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><Gamepad2 size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Graphics:</strong> {game.systemRequirements?.minimum?.graphics || 'NVIDIA GTX 1060'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><HardDrive size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Storage:</strong> {game.systemRequirements?.minimum?.storage || '50 GB available space'}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Recommended */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-200 border-b border-zinc-700 pb-2">Recommended</h3>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    <li className="flex gap-3">
                                        <span className="w-6"><Monitor size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">OS:</strong> {game.systemRequirements?.recommended?.os || 'Windows 10/11'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><Cpu size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Processor:</strong> {game.systemRequirements?.recommended?.processor || 'Intel Core i7'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><MemoryStick size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Memory:</strong> {game.systemRequirements?.recommended?.memory || '16 GB RAM'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><Gamepad2 size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Graphics:</strong> {game.systemRequirements?.recommended?.graphics || 'NVIDIA RTX 3060'}</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="w-6"><HardDrive size={18} className="text-zinc-500" /></span>
                                        <span><strong className="text-gray-300">Storage:</strong> {game.systemRequirements?.recommended?.storage || '50 GB available space'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT: 30% Details & Pricing */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="sticky top-24 space-y-6">

                        {/* Game Logo/Title Card */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-zinc-800 text-center">
                            <img src={game.images?.logo || game.images?.banner} alt="Logo" className="w-3/4 mx-auto mb-4 object-contain" />
                            <div className="flex justify-center items-center gap-2 mb-2">
                                <span className="bg-[#8000FF] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                                    Available Now
                                </span>
                            </div>
                        </div>

                        {/* Purchase Card */}
                        <div className="bg-[#202020] rounded-xl p-6 border-2 border-zinc-800 shadow-2xl relative overflow-hidden">
                            <h3 className="text-xl font-bold mb-6 text-white text-center">Buy {game.name}</h3>

                            <div className="bg-[#151515] p-6 rounded-lg border border-zinc-700 hover:border-[#8000FF] transition-colors group mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg text-white">Standard Edition</span>
                                    <span className="text-2xl font-bold text-[#8000FF]">₹{game.price}</span>
                                </div>
                                <p className="text-xs text-gray-500">Includes base game and standard online access.</p>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-[#8000FF] hover:bg-[#6600cc] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-purple-900/50"
                            >
                                <ShoppingCart size={24} />
                                <span>Add to Cart</span>
                            </button>

                            <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500 border-t border-zinc-800 pt-4">
                                <span className="flex items-center gap-1"><Shield size={12} /> Secure Payment</span>
                                <span className="flex items-center gap-1"><Check size={12} /> Instant Delivery</span>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-zinc-800 text-sm">
                            <div className="space-y-3 text-gray-400">
                                <p className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span>Developer</span> <span className="text-white text-right">{game.developer}</span>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
