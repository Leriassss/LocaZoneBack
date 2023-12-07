const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
})


exports.getFiltres = (req, res, next) => {

    connection.query(`select id, filtre from filtres where userId = ?`, [req.auth.userId], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
            return res.status(200).json({ data: results });
        });
}

exports.getOneFiltre = (req, res, next) => {
    connection.query(`select userId, filtre from filtres where id = ?`, [req.params.id], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }

        if(results.length == 0 || results[0].userId != req.auth.userId){
            return res.status(401).json({ message: 'Non authorisé' });
        }
            return res.status(200).json({ data: Object.values(results).map(el => {
                return(el.filtre)}) 
            });
        });
}

exports.delFiltre = (req, res, next) => {
    connection.query(`select id,userId from filtres where id = ?`, [req.params.id], (error, resultsUsers) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        console.log(resultsUsers)
        if (resultsUsers[0] && resultsUsers[0].userId) {
            connection.query(`delete from filtres where id = ?`, [resultsUsers[0].id], (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: error });
                }
                connection.query(`select id,filtre from filtres where userId = ?`, resultsUsers[0].userId, (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json({ error: error });
                    }
                    console.log(results)
                    console.log()
                    return res.status(200).json({ data: results});
                })

            });
        }
        else{
            return res.status(401).json({ message: 'Non authorisé' });
        }

    })

}

exports.putFiltre = (req, res, next) => {
    const filtres = JSON.stringify(req.body)
    console.log('---------------- putFiltre')
    console.log(filtres)
    connection.query(`select id,userId from filtres where id = ?`, [req.params.id], (error, resultsUsers) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        if (resultsUsers[0] && resultsUsers[0].userId == req.auth.userId) {
            const query = `update filtres set filtre = ? where id = ?`
            connection.query(query, [filtres,resultsUsers[0].id], (error, resultsQuery) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: error });
                }
                connection.query(`select id,filtre from filtres where userId = ?`, resultsUsers[0].userId, (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json({ error: error });
                    }
                    console.log(results)
                    return res.status(200).json({ data: results});
                })

            });
        }
        else {
            return res.status(401).json({ message: 'Non authorisé' });
        }
    });

}

exports.postFiltre = (req, res, next) => {

    const filtres = JSON.stringify(req.body)
    console.log('---------------- R B')
    console.log(filtres)
    const query = `insert into filtres (userId,filtre) values (?,?)`
    connection.query(query, [req.auth.userId,filtres], (error, resultsQuery) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        connection.query(`select id,filtre from filtres where userId = ?`, req.auth.userId, (error, results) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            return res.status(200).json({ data: results});
        })

    });


}
