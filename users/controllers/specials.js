const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
})

exports.getLocalisation = (req, res, next) => {
 
    connection.query(` select quartiers.id,nom_quartier,nom_ville, nom_pays from pays 
    inner join villes on villes.id_pays = pays.id
    inner join quartiers on villes.id = quartiers.id_ville`, (error, results4) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
            return res.status(200).json({ datas: results4 })
        })
};


exports.grant = (req, res, next) => {
 
    connection.query(`select id from houses where userId = ?`, [req.auth.userId], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        const f = Object.values(result).map((values) => { return(parseInt(values.id))})
        if (f.indexOf(parseInt(req.params.id)) !=-1) {
            console.log('******************************* AAATT')
            return res.status(200).json({ grantPost: false });
        }
        return res.status(200).json({ grantPost: true });
    })
};