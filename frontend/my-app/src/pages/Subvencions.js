import React, { useState, useEffect } from 'react';
import api, { getPartidaQuantitat, getDepartaments } from '../services/api';
import PartidaInput from '../components/PartidaInput';
import '../App.css';
import './Subvencions.css';

const Subvencions = () => {
    const [formData, setFormData] = useState({
        titol: '',
        descripcio: '',
        quantitat: '',
        data_inici: '',
        data_fi: '',
        partida: '',
        departament_id: ''
    });
    const [departaments, setDepartaments] = useState([]);
    const [error, setError] = useState('');
    const [showPartidaForm, setShowPartidaForm] = useState(false);
    const [partidaData, setPartidaData] = useState({
        numero_partida: '',
        exercici: '',
        quantitat_total: ''
    });
    const [quantitatTotal, setQuantitatTotal] = useState(null);
    const [isValidQuantitat, setIsValidQuantitat] = useState(true);

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

    const handlePartidaChange = (e) => {
        setPartidaData({ ...partidaData, [e.target.name]: e.target.value });
    };

    const handleQuantitatChange = (e) => {
        const quantitat = e.target.value;
        setIsValidQuantitat(quantitat <= quantitatTotal);
        setFormData({ ...formData, quantitat });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidQuantitat) {
            setError(`La quantitat no pot ser superior a ${quantitatTotal} euros.`);
            return;
        }
        try {
            await api.post('/subvencions', formData);
            setError('');
        } catch (error) {
            setError('Error creating subvenció: ' + error.response.data.error);
        }
    };

    const handlePartidaSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.post('/subvencions/partida', partidaData);
            setShowPartidaForm(false);
            setError('');
        } catch (error) {
            setError('Error creating partida: ' + error.response.data.error);
        }
    };

    return (
        <div className="subvencions-container">
            <h1 className="subvencions-title">Subvencions</h1>
            {error && <p className="error-message">{error}</p>}
            <form className="subvencions-form" onSubmit={handleSubmit}>
                <div>
                    <label>Titol:</label>
                    <input
                        type="text"
                        name="titol"
                        value={formData.titol}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Descripcio:</label>
                    <input
                        type="text"
                        name="descripcio"
                        value={formData.descripcio}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Quantitat:</label>
                    <input
                        type="number"
                        name="quantitat"
                        value={formData.quantitat}
                        onChange={handleQuantitatChange}
                        disabled={!quantitatTotal}
                        style={{ borderColor: isValidQuantitat ? 'initial' : 'red' }}
                    />
                    {!isValidQuantitat && (
                        <p className="error-message">
                            La quantitat no pot ser superior a {quantitatTotal} euros.
                        </p>
                    )}
                </div>
                <div>
                    <label>Data Inici:</label>
                    <input
                        type="date"
                        name="data_inici"
                        value={formData.data_inici}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Data Fi:</label>
                    <input
                        type="date"
                        name="data_fi"
                        value={formData.data_fi}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Partida:</label>
                    <PartidaInput
                        value={formData.partida}
                        onChange={handleChange}
                        onAddNewPartida={() => setShowPartidaForm(true)}
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
                <button type="submit">Crear Subvenció</button>
            </form>

            {showPartidaForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Crear Nova Partida Pressupostària</h2>
                        <form className="partida-form" onSubmit={handlePartidaSubmit}>
                            <div>
                                <label>Numero Partida:</label>
                                <input
                                    type="text"
                                    name="numero_partida"
                                    value={partidaData.numero_partida}
                                    onChange={handlePartidaChange}
                                />
                            </div>
                            <div>
                                <label>Exercici:</label>
                                <input
                                    type="number"
                                    name="exercici"
                                    value={partidaData.exercici}
                                    onChange={handlePartidaChange}
                                />
                            </div>
                            <div>
                                <label>Quantitat Total:</label>
                                <input
                                    type="number"
                                    name="quantitat_total"
                                    value={partidaData.quantitat_total}
                                    onChange={handlePartidaChange}
                                />
                            </div>
                            <button type="submit">Crear Partida</button>
                        </form>
                        <button className="close-button" onClick={() => setShowPartidaForm(false)}>Tancar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subvencions;
