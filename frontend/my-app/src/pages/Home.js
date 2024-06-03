import React, { useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [pregunta, setPregunta] = useState('');
    const [historial, setHistorial] = useState([]); // Historial de preguntes i respostes

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/chatgpt/consultar', { pregunta });
            const data = response.data.resposta;
            const novaResposta = Array.isArray(data) ? data : [data];

            // Afegir la nova pregunta i resposta a l'historial
            setHistorial(prevHistorial => [
                ...prevHistorial,
                { pregunta, resposta: novaResposta }
            ]);

            // Netejar el camp de pregunta després d'enviar la pregunta
            setPregunta('');
        } catch (error) {
            console.error('Error al enviar la pregunta:', error);
        }
    };

    return (
        <div className="home-container">
            <form className="chat-form" onSubmit={handleSubmit}>
                <label>
                    Pregunta:
                    <input
                        className="chat-input"
                        type="text"
                        value={pregunta}
                        onChange={(e) => setPregunta(e.target.value)}
                    />
                </label>
                <button className="chat-submit" type="submit">Enviar</button>
            </form>
            <div className="resposta">
                <h2>Respostes:</h2>
                <ul>
                    {historial.map((entry, index) => (
                        <li key={index} className="chat-message">
                            <strong>Pregunta:</strong> {entry.pregunta}
                            <br />
                            <strong>Resposta:</strong> <p>{entry.resposta}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
