const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
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
                        ),
                        role : results[0].role
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

exports.addLike = (req, res, next) => {
    connection.query('select id from users where id = ?', [req.auth.userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
        console.log('/*************************')
        console.log(req.params.id)
        if(parseInt(results[0].id) != parseInt(req.auth.userId)){
            return res.status(401).json({ error: 'Non authorisé' })
        }
        connection.query('select likes from users where id = ?',[req.auth.userId], (error2, results2) => {
            if (error2) {
                return res.status(500).json({ error: error2 })
            }
            console.log(results2[0])
            console.log(results2[0].likes.split(','))
            if(results2[0].likes.split(',').indexOf(req.params.id) == -1){
                const getQuery = `update users set likes = concat(likes,',',?) where id = ?`
                connection.query(getQuery, [req.params.id, parseInt(req.auth.userId)], (error1, results1) => {
                    if (error1) {
                        return res.status(500).json({ error: error1 })
                    }
                    return res.status(201).json({ message : 'Favori ajouté !!!'});
                })
            }

        })

    })

}