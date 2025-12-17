import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthModal = () => {
    const { isModalOpen, closeModal, login, signup, googleLogin, isLoading, error } = useAuth();
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form inputs state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    if (!isModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (isLogin) {
            await login(email, password);
        } else {
            const success = await signup(name, email, password);
            if (success) {
                setSuccessMessage('Signup successful! Please check your email to verify your account.');
                // Optional: switch to login view or keep showing success
                // setIsLogin(true); 
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-zinc-800 animate-in fade-in zoom-in duration-300">

                {/* Close Button Mobile (Top Right) */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white md:hidden"
                >
                    <X size={24} />
                </button>

                {/* Left Side - Branding / Visual */}
                <div className="hidden md:flex md:w-1/2 bg-zinc-900 relative items-center justify-center overflow-hidden">
                    {/* Background Gradient Only */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8000FF]/20 to-transparent"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center p-8">
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-2xl">
                            Steam<span className="text-[#8000FF]">HUB</span>
                        </h2>
                        <p className="text-gray-300 text-lg font-light tracking-wide">
                            Your gateway to the ultimate gaming experience.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#8000FF] rounded-full blur-[100px] opacity-20"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#121212] relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors hidden md:block"
                    >
                        <X size={24} />
                    </button>

                    <div className="max-w-md mx-auto w-full">
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h3>
                        <p className="text-gray-400 mb-8">
                            {isLogin
                                ? 'Enter your details to access your library.'
                                : 'Join the community and start playing.'}
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm">
                                {successMessage}
                            </div>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <UserIcon size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-[#1e1e1e] border border-zinc-800 focus:border-[#8000FF] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#1e1e1e] border border-zinc-800 focus:border-[#8000FF] rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 outline-none transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#1e1e1e] border border-zinc-800 focus:border-[#8000FF] rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-600 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {isLogin && (
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs text-[#8000FF] hover:text-[#9a33ff] transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#8000FF] hover:bg-[#9a33ff] disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(128,0,255,0.4)] mt-4 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    isLogin ? 'Log In' : 'Sign Up'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-400">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-white font-bold hover:text-[#8000FF] transition-colors"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
                        </div>


                        <div className="flex items-center gap-4 my-6">
                            <div className="h-px bg-zinc-800 flex-1" />
                            <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">OR</span>
                            <div className="h-px bg-zinc-800 flex-1" />
                        </div>
                        <div className="flex justify-center mb-6">
                            <GoogleLogin
                                onSuccess={googleLogin}
                                onError={() => console.log('Login Failed')}
                                theme="filled_black"
                                shape="pill"
                                text="signin_with"
                                width="300"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
