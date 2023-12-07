const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
})



exports.getVendorPlanning = (req, res, next) => {
    connection.query(`select id from vendor where idvendor = ?`, [req.auth.userId], (error, resultsf) => {
        if (error) {
            return res.status(400).json({ error: "Bad request" })
        }
        if (resultsf[0]) {
            const query = `select pseudo, id,id_visite,  heure, jour,qtier,etat_visite,etat_demande, imageUrl from 
            (select visites.id as id_visite,imageUrl, etat_demande,etat_visite,pseudo, id_maison, hour(date_visite) as heure, date_visite, weekday(date_visite) as jour from visites 
            inner join users on users.id = visites.id_client
            inner join houses on houses.id = visites.id_maison
            where id_vendeur = ?  and weekofyear(date_visite) = weekofyear(now()) and etat_visite != 3) as tmp1 
            inner join (select houses.id,concat(nom_pays,", ",nom_ville,", ",nom_quartier) as qtier  from quartiers
            inner join houses on houses.quartier = quartiers.id
            inner join villes on quartiers.id_ville = villes.id
            inner join pays on quartiers.id_country = pays.id) as tmp2
            on tmp1.id_maison = tmp2.id order by jour, date_visite`
            connection.query(query, [resultsf[0].id], (error, results) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: error });
                }
                return res.status(200).json({ datas: results });
            });
        }
        else {
            return res.status(401).json({ error: "Non authorisé" })
        }

    })

}


exports.getVisitePlanning = (req, res, next) => {
    date_visite = req.query.date_visite
    if (!parseDate(date_visite))
        return res.status(400).json({ message: 'Format de données non respecté' });

    const query = `select id, time(date_visite) as heure from visites 
    where id_maison = ? and date(date_visite) = date(?) and etat_visite != 3;`

    console.log([req.params.id, date_visite])
    connection.query(query, [req.params.id, date_visite], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        console.log('******************************* BBBBBBBB')
        console.log(results)
        return res.status(200).json({ datas: results });
    });

}
exports.putVisiteVendor = (req, res, next) => {
    let params = req.query.params
    params = JSON.parse(params)
    const good = params.good
    if (params.visite_estate) {
        console.log(params)
        connection.query(`select id,id_vendeur,id_maison from visites where id = ?`, [req.params.id], (error, resultsVisites) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            if (parseInt(resultsVisites[0].id_vendeur) != parseInt(req.auth.userId)) {
                return res.status(401).json({ message: 'Non authorisé' });
            }
            query = `update visites set etat_visite = 3, etat_demande = 2 where id = ${parseInt(resultsVisites[0].id)}`
            connection.query(query, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: error });
                }
                return res.status(201).json({ message: true });
            })
        })
    }
    else {
        connection.query(`select id,id_vendeur,id_maison from visites where id = ?`, [req.params.id], (error, resultsVisites) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            if (parseInt(resultsVisites[0].id_vendeur) != parseInt(req.auth.userId)) {
                return res.status(401).json({ message: 'Non authorisé' });
            }
            let query = '';
            let message;
            if (good) {
                query += `update visites set etat_demande = 2 where id = ${parseInt(resultsVisites[0].id)}`
                message = true
            }
            else {
                query += `update visites set etat_demande = 3 where id = ${parseInt(resultsVisites[0].id)}`
                message = false
            }
            connection.query(query, (error, result) => {
                if (error) {
                    console.log(error)
                    return res.status(500).json({ error: error });
                }
                return res.status(201).json({ message: message });
            })
        })
    }

}

exports.getPostVisite = (req, res, next) => {

    connection.query(`select id from houses where userId = ?`, [req.auth.userId], (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        const f = Object.values(result).map((values) => { return(parseInt(values.id))})
        if (f.indexOf(parseInt(req.params.id)) !=-1) {
            return res.status(401).json({ datas: "Non authorisé" });
        }
        const date_visite = req.query.date_visite
        console.log(parseDateOrString(date_visite))
        if (!parseDateOrString(date_visite))
            return res.status(400).json({ message: 'Format de données non respecté' });
    
    
        connection.query(`select id from users where id = ?`, [req.auth.userId], (error, resultsUsers) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            if (resultsUsers[0]) {
                connection.query(`select houses.id as id_house, vendor.id as vendor_id from houses inner join vendor
                on vendor.idvendor = houses.userId where houses.id = ?`, [parseInt(req.params.id)], (error, results) => {
                    if (error) {
                        console.log(error)
                        return res.status(500).json({ error: error });
                    }
                    if (results[0]) {
                        const query = `insert into visites (id_client,id_vendeur,id_maison,date_visite) values (?,?,?,?)`
                        connection.query(query, [
                            resultsUsers[0].id,
                            results[0].vendor_id,
                            results[0].id_house,
                            date_visite
                        ], (error, results) => {
                            if (error) {
                                console.log(error)
                                return res.status(500).json({ error: error });
                            }
                            return res.status(200).json({ message: "Vôtre visite a été enregistrée !!!" });
                        });
                    }
                    else {
                        return res.status(401).json({ message: 'Non authorisé' });
                    }
    
                });
            }
            else {
                return res.status(401).json({ message: 'Non authorisé' });
            }
        });
    })
}

exports.getUserPlanning = (req, res, next) => {
    const query = `select vendor_name, id,id_visite,  heure, jour,qtier,etat_visite,etat_demande, imageUrl from 
    (select vendor.name as vendor_name,visites.id as id_visite,imageUrl, etat_demande,etat_visite,
        pseudo, id_maison, 
    hour(date_visite) as heure, date_visite, weekday(date_visite) as jour from visites 
    inner join users on users.id = visites.id_client
    inner join houses on houses.id = visites.id_maison
    inner join vendor on vendor.idvendor = visites.id_vendeur
    where id_client = ?  and weekofyear(date_visite) = weekofyear(now()) and etat_visite != 3) as tmp1 
    inner join (select houses.id,concat(nom_pays,", ",nom_ville,", ",nom_quartier) as qtier  from quartiers
    inner join houses on houses.quartier = quartiers.id
    inner join villes on quartiers.id_ville = villes.id
    inner join pays on quartiers.id_country = pays.id) as tmp2
    on tmp1.id_maison = tmp2.id order by jour, date_visite`
    connection.query(query, [req.auth.userId], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        return res.status(200).json({ datas: results });
    });

}


exports.putVisiteUser = (req, res, next) => {
    connection.query(`select id,id_client,id_maison from visites where id = ?`, [req.params.id], (error, resultsVisites) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        if (parseInt(resultsVisites[0].id_client) != parseInt(req.auth.userId)) {
            return res.status(401).json({ message: 'Non authorisé' });
        }
        query = `update visites set etat_visite = 3, etat_demande = 2 where id = ${parseInt(resultsVisites[0].id)}`
        connection.query(query, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            return res.status(201).json({ message: true });
        })
    })

}

function parseDateOrString(input) {
    const parsedDate = new Date(input);
    let parsedValue = null
    if (isNaN(parsedDate)) {
        parsedValue = input
    } else {
        parsedValue = parsedDate
    }
    console.log(parsedDate)
    console.log(parsedDate.getTime())
    if (parsedValue instanceof Date) {
        if (parsedDate.getTime() < new Date().getTime()) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }

}

function parseDate(input) {
    const parsedDate = new Date(input);
    let parsedValue = null
    if (isNaN(parsedDate)) {
        parsedValue = input
    } else {
        parsedValue = parsedDate
    }

    if (parsedValue instanceof Date) {
       return true
    } else {
        return false
    }

}