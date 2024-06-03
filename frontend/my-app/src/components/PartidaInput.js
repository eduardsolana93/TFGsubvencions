import React, { useState, useEffect } from 'react';
import { getPartidaQuantitat } from '../services/api';
import './PartidaInput.css';

const PartidaInput = ({ value, onChange, onAddNewPartida }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (inputValue) {
            const fetchPartidas = async () => {
                try {
                    const result = await getPartidaQuantitat(inputValue);
                    setSuggestions(result);
                    setError(false);
                } catch (error) {
                    setSuggestions([]);
                    setError(true);
                }
            };
            fetchPartidas();
        } else {
            setSuggestions([]);
            setError(false);
        }
    }, [inputValue]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onChange(e);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion.numero_partida);
        setShowSuggestions(false);
        setError(false);
    };

    const handleAddNewPartida = () => {
        onAddNewPartida();
    };

    return (
        <div className="partida-input-container">
            <div className="input-with-button">
                <input
                    type="text"
                    name="partida"
                    value={inputValue}
                    onChange={handleInputChange}
                    className={`form-control ${error ? 'error' : ''}`}
                    placeholder="Partida"
                />
                <button type="button" onClick={handleAddNewPartida} className="add-button">+</button>
            </div>
            {showSuggestions && (
                <div className="suggestions-container">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="suggestion"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.numero_partida}
                            </div>
                        ))
                    ) : (
                        <div className="no-suggestions">Aquesta partida no està registrada</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PartidaInput;
