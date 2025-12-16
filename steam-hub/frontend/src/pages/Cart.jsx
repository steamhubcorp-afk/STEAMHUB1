import React from 'react';
import { X, Lock, Monitor } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();

    return (
        <div className="bg-[#121212] min-h-screen text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-400">Checkout</span>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-zinc-800">
                        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* LEFT COLUMN: Order Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Order Summary <span className="text-sm font-normal text-gray-400 ml-2">{cartItems.length} items</span></h2>

                            <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-xl border border-zinc-800 space-y-6">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.duration}`} className="flex flex-col gap-4 relative border-b border-zinc-800 pb-6 last:border-0 last:pb-0">
                                        {/* Top Row: Image and Details */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Item Image */}
                                            <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h3 className="text-xl font-bold">{item.title}</h3>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.duration)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors bg-zinc-900 rounded-full p-2 flex-shrink-0"
                                                        title="Remove item"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-2 text-sm text-gray-400 mb-3">
                                                    <span className="bg-zinc-800 px-3 py-1 rounded text-xs uppercase font-bold tracking-wider text-[#8000FF]">
                                                        {item.duration}
                                                    </span>
                                                    <span className="bg-zinc-800 px-3 py-1 rounded text-xs">PC Edition</span>
                                                </div>

                                                {/* Quantity / Device Selector */}
                                                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded border border-zinc-700 w-fit">
                                                    <Monitor size={14} className="text-gray-400" />
                                                    <label className="text-xs text-gray-400 mr-1">Devices:</label>
                                                    <select
                                                        value={item.qty}
                                                        onChange={(e) => updateQty(item.id, item.duration, e.target.value)}
                                                        className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm"
                                                    >
                                                        {[...Array(10)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1} className="bg-zinc-900">{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Row: Price and Duration Info */}
                                        <div className="flex items-center gap-6 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Price:</span>
                                                <span className="text-xl font-bold text-white">₹{item.price}</span>
                                            </div>
                                            <div className="h-8 w-px bg-zinc-700"></div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Duration:</span>
                                                <span className="text-xl font-bold text-[#8000FF]">
                                                    {item.duration === 'Permanent' ? '∞' : item.duration === '7 Days' ? '7 Days' : '30 Days'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Payment / Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-xl border border-zinc-800 sticky top-24">
                                <h3 className="text-xl font-bold mb-6">Payment Details</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Discount</span>
                                        <span className="text-[#8000FF] font-medium">₹0.00</span>
                                    </div>
                                    <div className="border-t border-zinc-800 my-4 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-2xl font-black text-white">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-[#8000FF] hover:bg-[#6b02d1] text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-colors">
                                    <Lock size={20} />
                                    <span>Pay ₹{cartTotal.toFixed(2)}</span>
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Secure Payment by SteamHub
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
