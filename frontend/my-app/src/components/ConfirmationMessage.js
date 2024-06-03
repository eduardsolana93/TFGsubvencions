import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmationMessage.css';

const ConfirmationMessage = ({ message }) => {
    const navigate = useNavigate();

    const handleAccept = () => {
        navigate('/home');
    };

    return (
        <div className="confirmation-container">
            <div className="confirmation-message">
                <h2>{message}</h2>
                <button onClick={handleAccept} className="btn btn-primary">Acceptar</button>
            </div>
        </div>
    );
};

export default ConfirmationMessage;
