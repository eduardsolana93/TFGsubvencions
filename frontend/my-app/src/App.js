import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Subvencions from './pages/Subvencions';
import NavBar from './components/NavBar';
import ExampleComponent from './pages/ExampleComponent';
import PrivateRoute from './components/PrivateRoute';
import { verifyToken } from './services/api';
import './App.css';

/*const Logout = ({ onLogout }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
    };

    return (
        <div>
            <h1>Logout</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};*/

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleLogin = (auth, admin) => {
        setIsAuthenticated(auth);
        setIsAdmin(admin);
    };

    /*useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setIsAdmin(token === 'adminToken');
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, []);*/

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token).then(response => {
                setIsAuthenticated(true);
                setIsAdmin(response.user.username === 'esolana');
            }).catch(() => {
                setIsAuthenticated(false);
                setIsAdmin(false);
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <Router>
            {isAuthenticated && <NavBar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/home" element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path="/register" element={
                    <PrivateRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                        <Register />
                    </PrivateRoute>
                } />
                <Route path="/subvencions" element={
                    <PrivateRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                        <Subvencions />
                    </PrivateRoute>
                } />
                <Route path="/example" element={<ExampleComponent />} />
                <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );


};

export default App;
