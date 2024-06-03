const OpenAIApi = require('openai');
const pool = require('../src/db');
const { text } = require('express');

const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});


const generateSQLQuery = async (pregunta) => {
    const prompt = `
        L'usuari fa la següent pregunta: "${pregunta}"
        Genera una consulta SQL per la pregunta de l'usuari basant-te en tota la base de dades "subvencions".
        Pensa que les taules i els seus paràmetres a tenir en compte de la base de dades "subvencions" són les següents:
        Taula departaments: id, nom on de la id 1 al 10 són els departaments següents: Presidència, Intervenció, Secretaria, Noves Tecnologies, Cooperació Municipal, Serveis Jurídics, Salut, Esports, Serveis Tècnics i Igualtat.
        Taula partides_pressupostaries: id, descripcio, import
        Taula subvencions: id, titol, descripcio, quantitat, departament_id, partida_id, data_inici, data_fi
        Taula usuaris: id, nom, email, contrasenya.
        Estudia i comprèn què et demana l'usuari amb la pregunta i construeix un SQL en base a la pregunta de l'usuari i les taules de la base de dades que t'he informat.
        Retorna només la query SQL que has generat sense salts de línia, en una sola línia i per a PostgreSQL.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
    });

    const sqlQuery = response.choices[0].message.content;

    return sqlQuery;
};

const generateChatGPTresponse = async (resposta, pregunta) => {
    const prompt = `
        El resultat de la query SQL ha sigut la següent: "${(resposta)}"
        Transforma aquesta resposta en un text explicatiu el més breu possible que s'entengui a mode d'informació clara per a un usuari que t'havia preguntat això: "${pregunta}"
    `;
    console.error(prompt);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
    });

    console.error(response);

    const textResposta = response.choices[0].message.content;

    console.error(textResposta);

    return textResposta;
}

const executeSQLQuery = async (sqlQuery) => {
    try {
        const result = await pool.query(sqlQuery);
        console.error(result);
        return JSON.stringify(result.rows);
    } catch (error) {
        console.error('Error al executar la consulta SQL:', error);
        throw new Error('Error al executar la consulta SQL');
    }
};


const chatgptController = {
    getAnswer: async (req, res) => {
        const { pregunta } = req.body;

        try {
            const sqlQuery = await generateSQLQuery(pregunta);
            const resposta = await executeSQLQuery(sqlQuery);
            const finalResposta = await generateChatGPTresponse(resposta, pregunta);
            res.json({ resposta: finalResposta });
        } catch (error) {
            console.error('Error al processar la pregunta:', error);
            res.status(500).send('Error del servidor');
        }
    }
};

module.exports = chatgptController;