const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
})

exports.getAgents = async (req, res, next) => {
    if (req.query.filtres) {
        let mesFiltres = JSON.parse(req.query.filtres)
        /*
          elder: '2023-08-05',
  nbProp: 2,
  type: null,
  localisation: 2,
  limit: 0*/
        let arrayFiltres = [
            mesFiltres.elder && parseDateOrString(mesFiltres.elder) ?
                `date(vendor.date_creation) <= date('${mesFiltres.elder}')` : '',

            mesFiltres.type && !isNaN(parseInt(mesFiltres.type)) && parseInt(mesFiltres.type) != 0 ?
                `typevendor = ${parseInt(mesFiltres.type)}` : '',

            mesFiltres.localisation && !isNaN(parseInt(mesFiltres.localisation)) && parseInt(mesFiltres.localisation) != 0 ?
                `idquartier = ${parseInt(mesFiltres.localisation)}` : ''
        ].filter(value => value != '').join(' and ')

        /*            ,*/

        console.log(arrayFiltres)
        let getQuery = `
        select *  from (SELECT url, userId as id, name, vendoroptions.vendor, vendor.date_creation, count(houses.id) as nbhouses
                          FROM vendor
                          INNER JOIN vendoroptions ON vendor.typevendor = vendoroptions.id
                          INNER JOIN users ON users.id = vendor.idvendor
                          INNER JOIN houses ON houses.userId = vendor.idvendor
                          where ${arrayFiltres}
						  GROUP BY vendor.id
                          LIMIT 9 OFFSET ?) as tmp`

        let additional = mesFiltres.nbProp && !isNaN(parseInt(mesFiltres.nbProp)) && parseInt(mesFiltres.nbProp) > 0 ?
            ` where nbhouses >= ${parseInt(mesFiltres.nbProp)}` : ''

        getQuery += additional + ' order by date_creation'
        console.log(getQuery)
        connection.query(getQuery, mesFiltres.limit, (error, results) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ error: error });
            }
            console.log(results)
            return res.status(200).json({ datas: results });
        });
    }
    else {
        try {
            const getQuery = `SELECT url, userId as id, name, vendoroptions.vendor, vendor.date_creation, count(houses.id) as nbhouses
                          FROM vendor
                          INNER JOIN vendoroptions ON vendor.typevendor = vendoroptions.id
                          INNER JOIN users ON users.id = vendor.idvendor
                          INNER JOIN houses ON houses.userId = vendor.idvendor
                          GROUP BY vendor.id
                          order by date_creation LIMIT 9 OFFSET ? `;

            const getVendorOptionsQuery = `SELECT * FROM demargereur.vendoroptions WHERE vendor NOT IN ('user')`;
            const results = await new Promise((resolve, reject) => {
                connection.query(getQuery, [parseInt(req.query.limit)], (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
            });

            const vendorOptionsResults = await new Promise((resolve, reject) => {
                connection.query(getVendorOptionsQuery, (error, results) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(results);
                });
            });

            return res.status(200).json({ datas: results, vendorOptions: vendorOptionsResults });
        } catch (error) {
            return res.status(500).json({ error: error });
        }

    }

};

exports.getAgentInfos = (req, res, next) => {
    const query = `SELECT url, userId as id, name, vendoroptions.vendor, vendor.date_creation, count(houses.id) as nbhouses
    FROM vendor
    INNER JOIN vendoroptions ON vendor.typevendor = vendoroptions.id
    INNER JOIN users ON users.id = vendor.idvendor
    INNER JOIN houses ON houses.userId = vendor.idvendor
    where idvendor = ?`
    console.log('****************** RAU')
    console.log(req.auth.userId)
    connection.query(query, [req.auth.userId], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        console.log(results)
        return res.status(200).json({ datas: results });
    });
}

exports.getPersonalInfos = (req, res, next) => {
    const query = `SELECT url, idvendor, name, vendoroptions.vendor, vendor.date_creation, email, tel,
    propos,nom_quartier,nom_ville,nom_pays
       FROM vendor
       INNER JOIN vendoroptions ON vendor.typevendor = vendoroptions.id
       INNER JOIN users ON users.id = vendor.idvendor
       inner join quartiers on vendor.idquartier = quartiers.id
       inner join villes on quartiers.id_ville = villes.id
       inner join pays on quartiers.id_country = pays.id
       where idvendor = ?`

    console.log(req.auth.userId)
    connection.query(query, [req.auth.userId], (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        console.log(results)
        return res.status(200).json({ datas: results });
    });
}

exports.register = (req, res, next) => {
    console.log('------------')

    const registerVendorQuery = `insert into vendor (idvendor,typevendor,url_id_card, url,name,idquartier) values (?,?,?,?,?,?)`
    values = [
        req.auth.userId,
        JSON.parse(req.body.vendorType).index,
        req.protocol + '://' + req.get('host') + req.paths.idCard + '/' + req.file.idCard,
        '',
        req.body.name,
        req.body.localisation
    ]
    console.log(values)
    connection.query(registerVendorQuery, values, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: error });
        }
        return res.status(200).json({ message: 'Compte Vendeur crée avec succès !!!!' });
    });
}

function parseDateOrString(input) {
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



