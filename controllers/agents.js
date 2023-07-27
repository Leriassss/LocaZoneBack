const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demargereur'
})

exports.getAgents = (req, res, next) => {
    const getQuery = `SELECT url, userId as id, name,vendoroptions.vendor,vendor.date_creation, count(houses.id) as nbhouses from vendor 
    inner join vendoroptions  on vendor.typevendor = vendoroptions.id
    inner join users on users.id = vendor.idvendor
    inner join houses on houses.userId = vendor.idvendor group by vendor.id limit 9 offset ?`
    console.log(getQuery)
    connection.query(getQuery,[parseInt(req.query.limit)], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
        return res.status(200).json({ datas: results });
    })
}

