import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import '../App.css';

const NavBar = ({ isAdmin, isAuthenticated, onLogout }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    if (isAuthenticated) return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item"><Link to="/">Home</Link></li>
                {isAdmin && <li className="navbar-item"><Link to="/register">Registrar Usuari</Link></li>}
                {isAdmin && <li className="navbar-item"><Link to="/subvencions">Afegir Subvencions</Link></li>}
                <li className="navbar-item"><button onClick={handleLogout} className="logout-button">Logout</button></li>
            </ul>
        </nav>
    );
};

export default NavBar;
