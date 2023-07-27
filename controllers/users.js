const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demargereur'
  })


exports.signin = (req, res, next) => {
    const getQuery = 'select * from users where email = ?'
    if(req.body.email){
        values = [req.body.email]
        connection.query(getQuery, values, (error, results) => {
            if(error){
                res.status(500).json({ error : error})
                throw error
            }
            if(results.length == 0){
                return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
            }
            else{
                bcrypt.compare(req.body.password, results[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
                    }
                    res.status(200).json({
                        token: jwt.sign(
                            { userId: results[0].id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
            }
        })
    }
 };

exports.signup = (req, res, next) => {
    const insertQuery = 'insert into users (pseudo, tel, email, password, role,vendor) values (?,?,?,?,?,?)'
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const values = [
            req.body.pseudo,
            req.body.tel,
            req.body.email,
            hash,
            'client',
            6
        ]
        console.log(values)

      connection.query(insertQuery, values, (error, results) => {
        if(error){
            res.status(400).json({ message: "Format des données non respecté"})
            throw error
        }
        res.status(200).json({ message: "Utilisateur crée avec succès"})
      })
    })
    .catch(error => res.status(500).json({ error }));
};

exports.unicity = (req, res, next) => {
    reqParams = req.query;
    field = null
    values = null
    if(reqParams.pseudo){
        field = 'pseudo'
        values = [reqParams.pseudo]
    }
    else if(reqParams.tel){
        field = 'tel'
        values = [reqParams.tel]
    }
    else if(reqParams.email){
        field = 'email'
        values = [reqParams.email]
    }
    if(field != null || values != null){
        const getQuery = 'select * from users where ' + field +' = ?'
        connection.query(getQuery, values, (error, results) => {
            if(error){
                res.status(500).json({ error : error})
                throw error
            }
            if(results.length == 0){
                return res.status(200).json( null )
            }
            else{
                return res.status(400).json( {warning : 'Attempt to violate the unicity'} );
            }
        })
    }
    else{
        return res.status(400).json( {error : 'Bad request'} );
    }
};