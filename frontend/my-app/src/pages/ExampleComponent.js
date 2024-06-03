import React, { useEffect, useState } from 'react';
import { getDepartaments, getPartidaQuantitat } from '../services/api';

const ExampleComponent = () => {
    const [departaments, setDepartaments] = useState([]);
    const [partidaQuantitat, setPartidaQuantitat] = useState(null);

    useEffect(() => {
        const fetchDepartaments = async () => {
            try {
                const data = await getDepartaments();
                setDepartaments(data);
            } catch (error) {
                console.error('Error fetching departaments:', error);
            }
        };

        const fetchPartidaQuantitat = async () => {
            try {
                const data = await getPartidaQuantitat(1); // Prova amb un ID específic
                setPartidaQuantitat(data);
            } catch (error) {
                console.error('Error fetching partida quantitat:', error);
            }
        };

        fetchDepartaments();
        fetchPartidaQuantitat();
    }, []);

    return (
        <div>
            <h1>Departaments</h1>
            <ul>
                {departaments.map((dep) => (
                    <li key={dep.id}>{dep.nom}</li>
                ))}
            </ul>
            <h1>Partida Quantitat</h1>
            <p>{partidaQuantitat}</p>
        </div>
    );
};

export default ExampleComponent;
