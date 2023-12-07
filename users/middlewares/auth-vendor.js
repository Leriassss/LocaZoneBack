const jwt = require('jsonwebtoken');
const Users = require('../models/users')
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demargereur'
})
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        const getQuery = 'select * from users where id = ?'
        values = [userId]
        connection.query(getQuery, values, (error, results) => {
            if (error) {
                res.status(500).json({ error: error })
                throw error
            }
            if (results.length == 0) {
                return res.status(400).json({ error: 'Utilisateur non trouvé' });
            }
            else {
                if (results[0].role != 'vendor') {
                    res.status(401).json({ message: 'Not authorized' });
                }
                else {
                    req.auth = {
                        userId: results[0].id,
                        vendor: results[0].role,
                    };
                    req.body.auth = results[0].id
                    next();
                }
            }
        })
    } catch (error) {
        res.status(401).json({ error });
    }
};