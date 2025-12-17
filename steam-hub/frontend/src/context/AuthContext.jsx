import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState(null);       // Add error state

    const openModal = () => {
        setError(null);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    // Helper to get or create a machine ID
    const getMachineId = () => {
        let machineId = localStorage.getItem('steamhub_machine_id');
        if (!machineId) {
            machineId = crypto.randomUUID(); // Native browser UUID
            localStorage.setItem('steamhub_machine_id', machineId);
        }
        return machineId;
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const machineId = getMachineId();
            const response = await axios.post('http://localhost:3000/api/verify', {
                email,
                password,
                machineId
            }, { withCredentials: true });

            if (response.data.success) {
                // Login Successful
                // Login Successful
                setUser({
                    email,
                    id: response.data.user ? response.data.user.id : (response.data.token ? JSON.parse(atob(response.data.token.split('.')[1])).id : null),
                    token: response.data.token,
                    ...response.data.config
                });
                closeModal();
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name, email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('http://localhost:3000/api/signup', {
                name,
                email,
                password
            }, { withCredentials: true });

            if (response.data.success) {
                // Signup Successful - usually we don't auto-login if verification needed
                // Just return true or let the component know to show a success message
                return true;
            }
        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.message || "Signup failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            // Decode the JWT to get user info (simple base64 decode for frontend usage)
            // Note: In production, verify this token on backend for security
            const decoded = JSON.parse(atob(token.split('.')[1]));

            setUser({
                name: decoded.name,
                email: decoded.email,
                image: decoded.picture,
                isGoogle: true
            });
            closeModal();
        } catch (err) {
            console.error("Google Login Error:", err);
            setError("Failed to process Google Login");
        }
    };

    const logout = () => {
        setUser(null);
        // Optional: Call release endpoint if needed, but user said don't touch machine logic
    };

    const value = {
        isModalOpen,
        openModal,
        closeModal,
        user,
        login,
        signup,
        googleLogin,
        logout,
        isLoading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
