import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    // Calculate total quantity of items (sum of all devices/qty)
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    if (totalItems === 0) return null; // Optional: Hide if empty? User said "cart tio rught should be there through out". Best to show always or show with 0? "showing 3 default it shoudl update every time" -> implies always show. Let's return button always.

    return (
        <button
            onClick={() => navigate('/cart')}
            className="fixed top-24 right-8 z-50 bg-[#8000FF] hover:bg-[#6b02d1] text-white p-4 rounded-full shadow-[0_0_20px_rgba(128,0,255,0.5)] transition-all duration-300 hover:scale-110 group"
            aria-label="View Cart"
        >
            <ShoppingCart size={24} className="group-hover:animate-bounce" />
            {/* Dynamic Badge */}
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#121212] animate-in zoom-in">
                    {totalItems}
                </span>
            )}
        </button>
    );
};

export default FloatingCartButton;
