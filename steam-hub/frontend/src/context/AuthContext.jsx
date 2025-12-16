import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null); // Mock user state: null = guest, object = logged in

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const login = (email) => {
        // Mock login logic
        setUser({ email, name: email.split('@')[0] });
        closeModal();
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        isModalOpen,
        openModal,
        closeModal,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
