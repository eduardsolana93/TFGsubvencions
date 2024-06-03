import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getDepartaments } from '../services/api';
import '../App.css';
import './Register.css';
import ConfirmationMessage from '../components/ConfirmationMessage';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nom: '',
        cognoms: '',
        correu_electronic: '',
        departament_id: ''
    });
    const [departaments, setDepartaments] = useState([]);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartaments = async () => {
            try {
                const departamentsData = await getDepartaments();
                setDepartaments(departamentsData);
            } catch (error) {
                console.error('Error fetching departaments:', error);
            }
        };
        fetchDepartaments();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            await api.post('/users/register', formData);
            setIsRegistered(true);
        } catch (error) {
            setError('Error during registration: ' + (error.response.data.error || 'Unknown error'));
        }
    };

    if (isRegistered) {
        return <ConfirmationMessage message="Usuari creat correctament!" />;
    }

    return (
        <div className="register-container">
            <h1 className="register-title">Registrar Usuari</h1>
            {error && <p className="error-message">{error}</p>}
            <form className="register-form" onSubmit={handleRegister}>
                <div>
                    <label>Nom d'usuari:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Contrasenya:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Nom:</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Cognoms:</label>
                    <input
                        type="text"
                        name="cognoms"
                        value={formData.cognoms}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Correu Electrònic:</label>
                    <input
                        type="email"
                        name="correu_electronic"
                        value={formData.correu_electronic}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Departament:</label>
                    <select
                        name="departament_id"
                        value={formData.departament_id}
                        onChange={handleChange}
                    >
                        <option value="">Selecciona un departament</option>
                        {departaments.map((departament) => (
                            <option key={departament.id} value={departament.id}>
                                {departament.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Registrar usuari</button>
            </form>
        </div>
    );
};

export default Register;
