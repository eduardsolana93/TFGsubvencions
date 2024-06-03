const OpenAIApi = require('openai');
const pool = require('../src/db');
const { text } = require('express');

const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
});


const generateSQLQuery = async (pregunta) => {
    const prompt = `
        L'usuari fa la seg�ent pregunta: "${pregunta}"
        Genera una consulta SQL per la pregunta de l'usuari basant-te en tota la base de dades "subvencions".
        Pensa que les taules i els seus par�metres a tenir en compte de la base de dades "subvencions" s�n les seg�ents:
        Taula departaments: id, nom on de la id 1 al 10 s�n els departaments seg�ents: Presid�ncia, Intervenci�, Secretaria, Noves Tecnologies, Cooperaci� Municipal, Serveis Jur�dics, Salut, Esports, Serveis T�cnics i Igualtat.
        Taula partides_pressupostaries: id, descripcio, import
        Taula subvencions: id, titol, descripcio, quantitat, departament_id, partida_id, data_inici, data_fi
        Taula usuaris: id, nom, email, contrasenya.
        Estudia i compr�n qu� et demana l'usuari amb la pregunta i construeix un SQL en base a la pregunta de l'usuari i les taules de la base de dades que t'he informat.
        Retorna nom�s la query SQL que has generat sense salts de l�nia, en una sola l�nia i per a PostgreSQL.
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
        El resultat de la query SQL ha sigut la seg�ent: "${(resposta)}"
        Transforma aquesta resposta en un text explicatiu el m�s breu possible que s'entengui a mode d'informaci� clara per a un usuari que t'havia preguntat aix�: "${pregunta}"
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