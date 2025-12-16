import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TopGames from './pages/TopGames';
import HowToUse from './pages/HowToUse';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Support from './pages/Support';
import GameDetails from './pages/GameDetails';
import Library from './pages/Library';
import { CartProvider } from './context/CartContext';
import './App.css';

import AuthModal from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Layout>
                        <AuthModal />
                        <Routes>
                            <Route path="/" element={<Navigate to="/top-games" replace />} />
                            <Route path="/top-games" element={<TopGames />} />
                            <Route path="/how-to-use" element={<HowToUse />} />
                            <Route path="/store" element={<Store />} />
                            <Route path="/game/:id" element={<GameDetails />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/support" element={<Support />} />
                        </Routes>
                    </Layout>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
