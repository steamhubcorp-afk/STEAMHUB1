import React, { useState } from 'react';
import { X, Lock, Monitor, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async () => {
        if (!user) {
            alert("Please login to proceed with payment");
            return;
        }

        setIsProcessing(true);

        // 1. Fake Processing Delay (2.5 seconds)
        await new Promise(resolve => setTimeout(resolve, 2500));

        setIsProcessing(false);
        setPaymentSuccess(true);

        // 2. Fake Success Delay (1.5 seconds) before actual API call/redirect
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // 3. Actual Backend Call to update Library
            // Prepare payload
            console.log("Cart Payment User State:", user);
            const payload = {
                userId: user.id || user._id, // Handle different ID fields if needed
                items: cartItems.map(item => ({
                    gameId: item.id,
                    amount: item.price === 'Free' ? 0 : parseFloat(item.price.replace(/[^0-9.]/g, '') || 0),
                    hours: item.duration === 'Permanent' ? 87600 : (item.duration === '7 Days' ? 168 : 720)
                })),
                totalAmount: cartTotal,
                transactionId: `TXN_${Date.now()}_FAKE`
            };

            // Note: In real app, we check success here.
            // But user said "see what need to be added" and "pop a success".
            // We'll try to call the backend.
            console.log("PAYLOAD SENT:", payload);
            const res = await axios.post('http://localhost:3000/api/payments', payload, { withCredentials: true });

            if (res.data.success) {
                clearCart();
                navigate('/');
            }
        } catch (error) {
            console.error("Payment Failed:", error);
            const serverMsg = error.response?.data?.message || "Unknown Error";
            const validationErrors = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : "";
            alert(`Payment Failed: ${serverMsg}\n${validationErrors}`);
            setPaymentSuccess(false);
        }
    };

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

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing || paymentSuccess}
                                    className={`w-full text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${isProcessing || paymentSuccess
                                        ? 'bg-zinc-700 cursor-not-allowed'
                                        : 'bg-[#8000FF] hover:bg-[#6b02d1]'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            <span>Pay ₹{cartTotal.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    Secure Payment by SteamHub
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Fake Payment Overlay */}
            {(isProcessing || paymentSuccess) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
                    <div className="max-w-md w-full bg-[#1a1a1a] p-8 rounded-2xl border border-zinc-800 text-center shadow-2xl animate-in zoom-in duration-300">
                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 border-4 border-[#8000FF]/30 border-t-[#8000FF] rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Lock size={24} className="text-[#8000FF]" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Processing Payment</h3>
                                <p className="text-gray-400">Securely contacting payment gateway...</p>
                            </div>
                        ) : paymentSuccess ? (
                            <div className="flex flex-col items-center">
                                <div className="mb-6 bg-green-500/10 p-4 rounded-full">
                                    <CheckCircle size={48} className="text-green-500 animate-bounce" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                                <p className="text-gray-400">Your library has been updated.</p>
                                <p className="text-xs text-gray-500 mt-4">Redirecting you shortly...</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
