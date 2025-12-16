import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, duration = '7 Days', price = '10', qty = 1) => {
        setCartItems(prev => {
            // Normalize product data
            const normalizedItem = {
                id: product.id || product._id,
                title: product.title || product.name,
                image: product.image || product.images?.banner || product.images?.main || "https://placehold.co/600x400/202020/FFFFFF/png?text=GAME",
                price: price || product.price,
                duration,
                qty
            };

            // Check if item with same ID AND duration exists
            const existing = prev.find(item => item.id === normalizedItem.id && item.duration === duration);

            if (existing) {
                return prev.map(item =>
                    (item.id === normalizedItem.id && item.duration === duration)
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, normalizedItem];
        });
    };

    const removeFromCart = (itemId, duration) => {
        setCartItems(prev => prev.filter(item => !(item.id === itemId && item.duration === duration)));
    };

    const updateQty = (itemId, duration, newQty) => {
        setCartItems(prev => prev.map(item =>
            (item.id === itemId && item.duration === duration) ? { ...item, qty: parseInt(newQty) } : item
        ));
    };

    const cartTotal = cartItems.reduce((total, item) => {
        // Extract number from price string (e.g. "300" or "$300" -> 300)
        const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        return total + (priceVal * item.qty);
    }, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
