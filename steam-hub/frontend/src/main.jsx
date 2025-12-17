import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="INSERT_YOUR_CLIENT_ID_HERE">
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
