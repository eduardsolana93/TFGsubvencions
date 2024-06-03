const bcrypt = require('bcrypt');
const pool = require('../../../backend/src/db'); // Ajusta el camí si cal

const createAdminUser = async () => {
    const username = 'esolana';
    const password = '1234';
    const nom = 'Eduard';
    const cognoms = 'Solana Pons';
    const correu_electronic = 'esolana@example.com';
    const departament_id = 4;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO usuaris (username, password, nom, cognoms, correu_electronic, departament_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [username, hashedPassword, nom, cognoms, correu_electronic, departament_id]
        );
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    }
};

createAdminUser();
