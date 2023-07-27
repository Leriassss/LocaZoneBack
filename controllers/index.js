const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demargereur'
  })

exports.authUser = (req, res, next) => {
    const getQuery = 'select * from users where id = ?'
        values = [req.auth.userId]
        connection.query(getQuery, values, (error, results) => {
            if(error){
                res.status(500).json({ error : error})
                throw error
            }
            if(results.length == 0){
                return res.status(400).json({ error: 'Utilisateur non trouvé' });
            }
            else{
                return res.status(201).json({auth:  results[0].role});
            }
        })
} 