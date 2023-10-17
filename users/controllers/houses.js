const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_USER
})

exports.postHouse = (req, res, next) => {
    console.log('--------------------------- REQ --------------------------')
    console.log(req.auth)
    console.log('----------------------------------------------------------')
    const myErrors = []
    if (req.file.facade != '' && req.file.douche.length > 0
        && req.file.chambre.length > 0 && req.file.cuisine.length > 0) {
    }
    else {
        return res.status(400).json({ error: "Bad request" })
    }

    console.log('--------------------')
    console.log(req.body.monhouse)
    connection.query(`select id,id_ville,id_country from quartiers where id = ?`,
        [req.body.monhouse.localisation], (error, resultsl) => {
            if (error) {
                console.log(error)
                connection.rollback(() => {
                    myErrors.push(error)
                    return res.status(500).json({ message: error })
                    throw error
                })
            }
            console.log('-------------------- 2 ')
            console.log(req.body.monhouse.localisation)
            console.log(resultsl)
            const insertHouseQuery = `insert into 
             houses (type,categorie,namehouse,imageUrl,pays,ville,quartier,voisin,prix,frais,superficie,nbsalon,nbchambre,nbcuisine,nbdouche,userId,description,disponibilite) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            values = [
                req.body.monhouse.type,
                req.body.monhouse.categorie,
                req.body.monhouse.houseName,
                req.file.facade,
                parseInt(resultsl[0].id_country),
                parseInt(resultsl[0].id_ville),
                parseInt(resultsl[0].id),
                req.body.monhouse.neighbor,
                req.body.monhouse.prix,
                req.body.monhouse.frais,
                req.body.monhouse.area,
                Object.values(req.body.feats.salon).length,
                Object.values(req.body.feats.chambre).length,
                Object.values(req.body.feats.cuisine).length,
                Object.values(req.body.feats.douche).length,
                req.auth.userId,
                req.body.monhouse.description,
                req.body.monhouse.disponibilite
            ]
            console.log('...............-values-....................')
            console.log(values)
            console.log('...................................')
            connection.beginTransaction((err) => {
                if (err) {
                    myErrors.push(err)
                    return res.status(500).json({ message: err })
                    throw err;
                }
                connection.query(insertHouseQuery, values, (errorIHQ, results) => {
                    if (errorIHQ) {
                        console.log(errorIHQ)
                        myErrors.push(errorIHQ)
                        connection.rollback(() => {
                            throw errorIHQ
                        })
                        return res.status(400).json({ error: "Format des données non respecté" })
                    }
                    else {
                        console.log('--------------------------- TULSA ---------------------')
                        console.log(req.file)
                        console.log('-------------------------------------------------')
                        console.log('--------------------------- TULSA2 ---------------------')
                        console.log(req.body.feats)
                        console.log('-------------------------------------------------')
                        try {
                            const saves = []
                            const insertHouseFeaturesQuery = 'insert into housefeatures (url,type,idhouse,area) values '
                            for (var id in req.body.feats) {
                                const element = req.body.feats[id]
                                let element2 = req.file[id]
                                console.log('--------------------------- FOR   ---------------------')
                                console.log(id)
                                console.log(element)
                                console.log(element2)
                                console.log('-------------------------------------------------')
                                if (element2 && element2.length > 0 && id != 'facade') {
                                    console.log('--------------------------- ELEMENTS PICTURE TO POST---------------------')
                                    console.log(element)
                                    console.log('-------------------------------------------------')
                                    for (var i = 0, c = element.length; i < c; i++) {
                                        console.log('--------------------------- req.file[id][i] ---------------------')
                                        console.log(id)
                                        console.log(i)
                                        console.log('-------------------------------------------------')
                                        saves.push('("' +
                                            `${req.protocol}://${req.get('host')}/images/houses/${element2[i]}",` +
                                            '(select id from typefeatures where features = \'' + id + '\'),' +
                                            results.insertId + ',' +
                                            element[i] + ')'
                                        )
                                    }
                                }
                            }
                            console.log('................... QUERY ..........................')
                            console.log(saves)
                            console.log('....................................................')
                            if (saves.length == 0) {
                                myErrors.push({ error: 'Pas bon' })
                                throw ({ error: 'Pas bon' })
                            }
                            else {
                                const query = saves.join(',')
                                console.log('................... SAVES ..........................')
                                console.log(insertHouseFeaturesQuery + query)
                                console.log('....................................................')
                                connection.query(insertHouseFeaturesQuery + query, (errorIHFQ, resultsf) => {
                                    if (errorIHFQ) {
                                        myErrors.push(errorIHFQ)
                                        throw errorIHFQ
                                    }
                                    else {
                                        const saves2 = []
                                        const insertOptionsHouseQuery = 'insert into optionshouse (optionshouse,idhouse) values '
                                        for (var id in req.body.accessoires) {
                                            const element = req.body.accessoires[id]
                                            saves2.push('(' + element + ',' + results.insertId + ')'
                                            )

                                        }
                                        const query2 = saves2.join(',')
                                        console.log('................... SAVES 2..........................')
                                        console.log(insertOptionsHouseQuery + query2)
                                        console.log('....................................................')
                                        connection.query(insertOptionsHouseQuery + query2, (errorIOHQ, results3) => {
                                            if (errorIOHQ) {
                                                myErrors.push(errorIOHQ)
                                                throw errorIOHQ
                                            }
                                            console.log('................... SAVES 3..........................')
                                            console.log(results3)
                                            console.log('....................................................')
                                            connection.commit((errorCommit, results) => {
                                                if (errorCommit) {
                                                    console.log('................... SAVES OF..........................')
                                                    connection.rollback(() => {
                                                        return res.status(400).json({ error: "Format des features non respecté" })
                                                    })
                                                }
                                                console.log('................... SREEEEEEEEE..........................')
                                                console.log(results)
                                                console.log('....................................................')
                                                return res.status(200).json({ message: "Maison créée avec succès" })
                                            });
                                        })
                                    }
                                })
                            }
                        } catch (errorCatch) {
                            console.log(' CAAAAAAAAAAAAAAAAAAAAAATCHHHHHHHHHHHHHHHHHHHHHHHHH')
                            console.log(errorCatch)
                            connection.rollback(() => {
                                return res.status(400).json({ error: errorCatch })
                            })
                        }
                    }
                })
            })
        })
};

exports.alterHouse = (req, res, next) => {
    connection.query(`select * from houses where id = ?`, parseInt(req.params.id), (error, resultsf) => {
        if (error) {
            return res.status(400).json({ error: "Bad request" })
        }

        const count = {
            "salon": parseInt(resultsf[0].nbsalon),
            "chambre": parseInt(resultsf[0].nbchambre),
            "cuisine": parseInt(resultsf[0].nbcuisine),
            "douche": parseInt(resultsf[0].nbdouche)
        }
        console.log('----------------- count')
        console.log(count)
        console.log('-----------------')

        if (parseInt(resultsf[0].userId) == parseInt(req.auth.userId)
            && resultsf[0].id == parseInt(req.params.id)
            && req.auth.vendor == 'vendor') {
            console.log('*/*/*/*/** LU')
            const bod = { ...req.body }
            const accessoires = bod.accessoires ? JSON.parse(bod.accessoires) : null
            const localisation = bod.localisation ? JSON.parse(bod.localisation) : null
            const delsElements = bod.delsElements ? JSON.parse(bod.delsElements) : null
            const addsElements = bod.addsElements ? JSON.parse(bod.addsElements) : null
            const altersElements = bod.altersElements ? JSON.parse(bod.altersElements) : null

            const informations = bod.informations ? JSON.parse(bod.informations) : null
            console.log('*/*/*/*/** BOD')
            console.log(localisation)

            /** -------------------------------- LOCALISATION ---------------------------------------- */
            if (!isNaN(parseInt(localisation))) {
                console.log('*/*/*/*/** LOC')
                console.log(localisation)
                connection.query(`select id,id_ville,id_country from quartiers where id = ?`,
                    [localisation], (error, resultsl) => {
                        if (error) {
                            console.log(error)
                            connection.rollback(() => {
                                return res.status(500).json({ message: error })
                            })
                        }
                        console.log(resultsl)
                        connection.beginTransaction((errBTL) => {
                            if (errBTL) {
                                connection.rollback(() => {
                                    return res.status(500).json({ err: errBTL })
                                })
                            }
                            connection.query(`update houses set  quartier = ?,ville = ?,pays = ? where id =?`,
                                [resultsl[0].id, resultsl[0].id_ville, resultsl[0].id_country, resultsf[0].id],
                                (error, results) => {
                                    if (error) {
                                        console.log(error)
                                        connection.rollback(() => {
                                            return res.status(500).json({ message: error })
                                        })
                                    }
                                    connection.commit((error, results) => {
                                        if (error) {
                                            connection.rollback(() => {
                                                return res.status(400).json({ error: "Format des features non respecté" })
                                            })
                                        }
                                        return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                                    });
                                })
                        })
                    })
            }
            /** ------------------------------------------------------------------------------------ */
            /** -------------------------------- FACADE ---------------------------------------- */
            if (req.file.facade != '' && req.file.facade.length > 0) {
                fs.access(`${req.protocol}://${req.get('host')}/images/houses/${req.file.facade}`,
                    fs.constants.F_OK, (errfs) => {
                        if (errfs) {
                            return res.status(400).json({ error: errfs })
                        }
                        else {
                            console.log('*/*/*/*/**')
                            console.log(req.file.facade)
                            fs.unlink(`images/houses/${resultsf[0].url.split('/images/houses/')[1]}`, (errorUL) => {
                                if (errorUL) {
                                    console.log('------------A')
                                    return res.status(500).json({ error: errorUL })
                                }
                                connection.beginTransaction((errBTL) => {
                                    if (errBTL) {
                                        connection.rollback(() => {
                                            return res.status(500).json({ err: errBTL })
                                        })
                                    }
                                    connection.query(`update houses set imageUrl = ?`,
                                        [`${req.protocol}://${req.get('host')}/images/houses/${req.file.facade}`],
                                        (error, results) => {
                                            if (error) {
                                                console.log(error)
                                                connection.rollback(() => {
                                                    return res.status(500).json({ message: error })
                                                })
                                            }
                                            connection.commit((error, results) => {
                                                if (error) {
                                                    connection.rollback(() => {
                                                        return res.status(400).json({ error: "Format des features non respecté" })
                                                    })
                                                }
                                                return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                                            });
                                        })
                                })
                            });
                        }
                    })
            }
            /** -------------------------------------------------------------------------------- */
            /** -------------------------------- INFOS ---------------------------------------- */
            if (informations && informations.length > 0) {
                console.log('-------- infos')
                console.log(informations)
                connection.beginTransaction((errBTL) => {
                    if (errBTL) {
                        connection.rollback(() => {
                            return res.status(500).json({ err: errBTL })
                        })
                    }
                    connection.query(`delete from optionshouse where idhouse =${resultsf[0].id}`, (error, resultsd) => {
                        if (error) {
                            console.log(error)
                            connection.rollback(() => {
                                return res.status(500).json({ message: "Format des données non respecté" })
                            })

                        }
                        const paramss = new Array(informations.length).fill('(?,?)').join(',')
                        const valss = informations.map(el => `${parseInt(el)},${resultsf[0].id}`).join(',').split(',')
                        console.log(`insert into optionshouse (optionshouse, idhouse) values ${paramss}`)
                        console.log(valss)
                        connection.query(`insert into optionshouse (optionshouse, idhouse) values ${paramss}`, valss, (error, results) => {
                            if (error) {
                                console.log(error)
                                connection.rollback(() => {
                                    return res.status(500).json({ message: error })
                                })
                            }
                            connection.commit((error, results) => {
                                if (error) {
                                    connection.rollback(() => {
                                        return res.status(400).json({ error: "Format des features non respecté" })
                                    })
                                }
                                return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                            });
                        })
                    })
                })

            }
            /** ------------------------------------------------------------------------------- */

            /** -------------------------------- ACCESSOIRES ---------------------------------- */
            if (accessoires && accessoires.length > 0) {
                const fi = {}
                Object.values(accessoires).forEach(el => {
                    console.log(el)
                    if (el[0] == 'houseName') { fi['namehouse'] = el[1][0] }
                    else if (el[0] == 'neighbor') { fi['voisin'] = parseInt(el[1][0]) }
                    else if (el[0] == 'area') { fi['superficie'] = parseInt(el[1][0]) }
                    else if (el[0] == 'disponibilite') { fi['disponibilite'] = el[1][0].split('T')[0] }
                    else { fi[el[0]] = el[1][0] }
                })

                console.log('-------- accessoires')

                const valuees = []
                const paramss = Object.entries(fi).map(el => {
                    valuees.push(el[1])
                    return `${el[0]} = ? `
                }).join(',')
                console.log(valuees)
                connection.beginTransaction((errBTL) => {
                    if (errBTL) {
                        connection.rollback(() => {
                            return res.status(500).json({ err: errBTL })
                        })
                    }
                    connection.query(`update houses set ${paramss} where id=${parseInt(resultsf[0].id)}`, valuees, (error, resultsd) => {
                        if (error) {
                            console.log(error)
                            connection.rollback(() => {
                                return res.status(500).json({ error: error })
                            })
                        }
                        connection.commit((error, results) => {
                            if (error) {
                                connection.rollback(() => {
                                    return res.status(400).json({ error: "Format des features non respecté" })
                                })
                            }
                            return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                        });
                    })
                })
            }
            /** ------------------------------------------------------------------------------ */
            /** -------------------------------- DEL ------------------------------------------ */
            if (delsElements && delsElements.length > 0) {
                console.log('-------- DEL -----------')
                console.log(delsElements)
                console.log('------- DEL F------------')
                const getf = `select housefeatures.id,url,idhouse,features from housefeatures inner join typefeatures
                                    on housefeatures.type = typefeatures.id
                                    where idhouse = ? and  housefeatures.id in(?)`
                connection.query(getf, [resultsf[0].id, delsElements], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: error })
                    }
                    console.log('-------- PARAMS 0  -----------')
                    console.log(results.length)
                    console.log(results)
                    if (results.length == delsElements.length &&
                        parseInt(results[0].idhouse) == parseInt(resultsf[0].id)) {
                        console.log('-------- PARAMS 2  -----------')
                        console.log(results.length)
                        console.log(results)

                        Object.values(results).forEach(el => {
                            console.log('-------- PARAMS  -----------')
                            console.log(count[el.features] - 1)
                            console.log(el.features)
                            if ((count[el.features] - 1) <= 0 && el.features != 'salon') {
                                return res.status(400).json({ error: "Minimum d'options de maison requis..." })
                            }
                            connection.beginTransaction((errBTL) => {
                                if (errBTL) {
                                    connection.rollback(() => {
                                        return res.status(500).json({ err: errBTL })
                                    })
                                }
                                count[el.features]--
                                console.log('-------- CONNARD  -----------')
                                console.log(count[el.features])
                                console.log('-------- CONNARD F -----------')
                                connection.query(`delete from housefeatures where id = ?`, [el.id], (error, results) => {
                                    if (error) {
                                        connection.rollback(() => {
                                            console.log('------------B')
                                            return res.status(500).json({ error: error })
                                        })
                                    }

                                    fs.unlink(`images/houses/${el.url.split('/images/houses/')[1]}`, (error) => {
                                        if (error) {
                                            console.log('------------A')
                                            connection.rollback(() => {
                                                return res.status(500).json({ error: error })
                                            })
                                        }
                                        console.log('------------UPDATE')
                                        console.log(count)
                                        console.log(resultsf[0].id)
                                        connection.query(`update houses set nbsalon = ${count.salon},
                                        nbchambre = ${count.chambre},nbdouche = ${count.douche},
                                        nbcuisine = ${count.cuisine} where id = ${resultsf[0].id}`, (error, resultsa) => {
                                            if (error) {
                                                connection.rollback(() => {
                                                    console.log('------------C')
                                                    return res.status(500).json({ error: error })
                                                })
                                            }
                                            connection.commit((error, results) => {
                                                if (error) {
                                                    connection.rollback(() => {
                                                        return res.status(400).json({ error: "Format des features non respecté" })
                                                    })
                                                }
                                                return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                                            });
                                        })
                                    });
                                })

                            })

                        })

                    }
                    else {
                        return res.status(400).json({ error: "Format des données non respecté" })

                    }
                })

            }
            /** ------------------------------------------------------------------------------- */
            /** -------------------------------- ALTER ---------------------------------------- */
            if (altersElements && Object.values(altersElements).filter((el) => el.length > 0).length > 0) {
                console.log('-------- ALTER -----------')
                console.log(altersElements)
                console.log('------- ALTER F------------')
                connection.beginTransaction((errBTL) => {
                    if (errBTL) {
                        connection.rollback(() => {
                            return res.status(500).json({ err: errBTL })
                        })
                    }
                    Object.entries(altersElements).forEach(([keys, el]) => {
                        console.log('.......el')
                        console.log(el)
                        const j = 0
                        el.forEach(el2 => {
                            connection.query(`select url from housefeatures where id = ${parseInt(el2.id)}`,
                                (error, results) => {
                                    if (error) {
                                        connection.rollback(() => {
                                            return res.status(500).json({ err: errBTL })
                                        })
                                    }
                                    console.log('.......el2')
                                    console.log(el2)
                                    fs.unlink(`images/houses/${results[0].url.split('/images/houses/')[1]}`, (error) => {
                                        if (error) {
                                            console.log('----------------------- FS 1  -----------------------')
                                            console.log(error)
                                            console.log('----------------------- FS 1  -----------------------')
                                            connection.rollback(() => {
                                                return res.status(500).json({ error: error })
                                            })
                                        }
                                        console.log('.......keys')
                                        console.log(req.file[keys][j])
                                        const queryUrl = `update housefeatures set 
                                            url = '${req.protocol}://${req.get('host')}/images/houses/${req.file[keys][j]}', 
                                            area = ${el2.area} where id= ${parseInt(el2.id)} `
                                        connection.query(queryUrl, (error, results) => {
                                            if (error) {
                                                connection.rollback(() => {
                                                    throw error
                                                })
                                            }
                                            connection.commit((error2, results) => {
                                                if (error2) {
                                                    connection.rollback(() => {
                                                        return res.status(400).json({ error: "Format des features non respecté" })
                                                    })
                                                }
                                                return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                                            });
                                        })
                                    });
                                })
                        })
                    })
                })
            }
            /** ----------------------------------------------------------------------- */

            /** -------------------------------- ADD ----------------------------------- */
            if (addsElements && Object.values(addsElements).filter((el) => el.length > 0).length > 0) {
                console.log()
                const pusha = []
                const pusha2 = []
                Object.entries(addsElements).forEach(([keys, el]) => {
                    if (el.length > 0) {
                        const areas = Object.entries(el).map(([keys2, el2]) => {
                            count[keys]++
                            return parseInt(el2.area)
                        })
                        const url = req.file[keys]
                        pusha.push(url.map((value, index) => {
                            pusha2.push(`(?,(select id from typefeatures where features = "${keys}"),${parseInt(resultsf[0].id)},?)`)
                            return [`${req.protocol}://${req.get('host')}/images/houses/${value}`, areas[index]]
                        }))
                    }
                })
                const sp = pusha.join(',').split(',')
                const sp2 = 'insert into housefeatures (url,type,idhouse,area) values ' + pusha2.join(',')
                console.log(sp)
                console.log('----- sp -----')
                console.log(sp2)
                connection.beginTransaction((errBTL) => {
                    if (errBTL) {
                        connection.rollback(() => {
                            return res.status(500).json({ err: errBTL })
                        })
                    }
                    connection.query(sp2, sp, (error, results) => {
                        if (error) {
                            connection.rollback(() => {
                                return res.status(500).json({ error: error })
                            })
                            return res.status(400).json({ error: "Format des données non respecté" })
                        }
                    })
                    console.log('------------UPDATE')
                    console.log(count)
                    console.log(resultsf[0].id)
                    connection.query(`update houses set nbsalon = ${count.salon},
                        nbchambre = ${count.chambre},nbdouche = ${count.douche},
                        nbcuisine = ${count.cuisine} where id = ${resultsf[0].id}`, (error, resultsa) => {
                        if (error) {
                            connection.rollback(() => {
                                return res.status(500).json({ error: error })
                            })
                            connection.commit((error2, results) => {
                                if (error2) {
                                    connection.rollback(() => {
                                        return res.status(400).json({ error: "Format des features non respecté" })
                                    })
                                }
                                return res.status(200).json({ message: "Modifications effectuées avec succès !!!" })
                            });
                        }
                    })
                })
            }
            /** ----------------------------------------------------------------------- */
        }
        else {
            return res.status(401).json({ message: "Non autorisée" })
        }
    })
}


exports.getHouseVendor = (req, res, next) => {
    const getQuery = `select * from (select namehouse,houses.id as idhouse,
        imageUrl,quartier,voisin,prix,superficie,userId,disponibilite, typehouse,cathouse,date_creation 
        from houses inner join typehouse on houses.type = typehouse.id
        inner join cathouse on houses.categorie = cathouse.id
        where userId = (select idvendor from vendor where idvendor = ?) order by idhouse desc) 
        as tmp2
        inner join (select quartiers.id as id_quartier ,nom_pays,nom_ville,nom_quartier 
        from quartiers inner join (select villes.id,nom_pays,nom_ville from villes 
        inner join pays on villes.id_pays = pays.id) as tmp 
        on tmp.id = quartiers.id_ville) as tmp3 on tmp3.id_quartier = tmp2.quartier
        order by nom_ville,nom_quartier,prix,date_creation desc limit 1000 offset ?`
    connection.query(getQuery, [req.auth.userId, parseInt(req.query.offset)], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
        if (results.length != 0) {
            if (results[0].userId != req.auth.userId || req.auth.vendor != 'vendor') {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }
        return res.status(200).json({ datas: results });

    })
}

exports.getHouse = (req, res, next) => {
    if (req.query.filtres) {
        console.log('-------------------4-4-4-4-----------------------')
        // ---------------------------- infos ----------------------------//
        const infos = JSON.parse(req.query.filtres).infos
        const opts = JSON.parse(req.query.filtres).opts
        const offset = JSON.parse(req.query.filtres).limit
        const queryVariables = mm({ vals: [infos.prixMin, infos.prixMax], field: 'prix' }) +
            mm({ vals: [infos.areaMin, infos.areaMax], field: 'superficie' })

        const queryLocalisation = infos.localisation ? ' and quartier = ' + parseInt(infos.localisation) : ''
        const queryFeatures =
            (infos.nbDouche == null || isNaN(infos.nbDouche) ? '' : ' and nbdouche = ' + parseInt(infos.nbDouche)) +
            (infos.nbChambre == null || isNaN(infos.nbChambre) ? '' : ' and nbchambre = ' + parseInt(infos.nbChambre)) +
            (infos.nbCuisine == null || isNaN(infos.nbCuisine) ? '' : ' and nbcuisine = ' + parseInt(infos.nbCuisine)) +
            (infos.nbSalon == null || isNaN(infos.nbSalon) ? '' : ' and nbsalon = ' + parseInt(infos.nbSalon))

        const queryType = parseInt(infos.type) > 0 ? 'type = ' + parseInt(infos.type) : ''
        const queryCath = parseInt(infos.type) > 0 ? ' and categorie = ' + parseInt(infos.categorie) : ''
        const queryDispo = parseDateOrString(infos.disponibilite) ? ' and date(disponibilite) <= date("' + infos.disponibilite + '")' : ''
        const queryTC = queryType + queryCath + queryLocalisation + queryDispo

        const filtre = 'select * from houses where ' +
            queryTC + (queryVariables == '' ? '' : ' and ') + queryVariables + queryFeatures

        // ---------------------------- opt ----------------------------//
        var finalQuery = ''
        if (Object.keys(opts).length > 0) {
            var queryOpts = 'select * from (select tmp1.idhouse from (SELECT * FROM optionshouse where optionshouse = '
                + parseInt(opts[0]) + ') as tmp1 '
            for (let index = 1; index < opts.length; index++) {
                const element = opts[index];
                queryOpts += ' inner join (SELECT * FROM optionshouse where optionshouse = ' + parseInt(element) +
                    ') as tmp' + (index + 1) + ' on tmp1.idhouse = tmp' + (index + 1) + '.idhouse'
            }
            queryOpts += ') as optionsfind'

            finalQuery += 'select p.id as idhouse,imageUrl,voisin,prix,superficie,nbsalon,nbchambre,nbcuisine,nbdouche,typehouse,cathouse,nom_ville,nom_quartier from (select * from (' + filtre + ') as house inner join ('
                + queryOpts + ') as accessoires on house.id = accessoires.idhouse order by house.id desc limit 9 offset ?) as p ' +
                ` inner join typehouse on p.type = typehouse.id 
                            inner join cathouse on p.categorie = cathouse.id 
                            inner join villes on p.ville = villes.id 
                            inner join quartiers on p.quartier = quartiers.id 
                           inner join pays on p.pays = pays.id`
            console.log(finalQuery)
            console.log('-------------------SORRY------------------------------')
        }
        else {
            finalQuery = 'select p.id as idhouse,imageUrl,voisin,prix,superficie,nbsalon,nbchambre,nbcuisine,nbdouche,typehouse,cathouse,nom_ville,nom_quartier from (' + filtre + ' order by houses.id desc limit 9 offset ?' +
                ') as p inner join typehouse on p.type = typehouse.id' +
                ' inner join cathouse on p.categorie = cathouse.id inner join villes on p.ville = villes.id inner join quartiers on p.quartier = quartiers.id inner join pays on p.pays = pays.id'
            console.log(finalQuery)
            console.log(offset)
        }
        connection.query(finalQuery, [offset], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error })
                throw error
            }
            return res.status(200).json({ datas: results });
        })
    }
    else {
        const getQuery = `SELECT houses.id AS idhouse, imageUrl, voisin, prix, superficie,
        nbsalon, nbchambre, nbcuisine, nbdouche,
        typehouse, cathouse, nom_ville, nom_quartier, total_rows
    FROM houses 
    INNER JOIN typehouse ON houses.type = typehouse.id 
    INNER JOIN cathouse ON houses.categorie = cathouse.id 
    INNER JOIN villes ON houses.ville = villes.id 
    INNER JOIN quartiers ON houses.quartier = quartiers.id 
    INNER JOIN pays ON houses.pays = pays.id
    CROSS JOIN (SELECT COUNT(*) AS total_rows FROM houses) AS total
    ORDER BY houses.id DESC 
    LIMIT 9 OFFSET ?`
        console.log('-8-8-8-8-88-8-8888-8--88-88-8-8-8888-8-8-8-8-88-8-8888-88-')
        console.log(getQuery)
        console.log('-8-8-8-8-88-8-8888-8--88-88-8-8-8888-8-8-8-8-88-8-8888-88-')
        connection.query(getQuery, [parseInt(req.query.limit)], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error })
                throw error
            }
            console.log(results)
            return res.status(200).json({ datas: results });
        })
    }

}

exports.getOptions = (req, res, next) => {
    const getQuery = 'select * from options'
    const construct = [];
    connection.query(getQuery, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
            throw error
        }
        construct.push(results)
        connection.query('select * from cathouse', (error, results3) => {
            if (error) {
                return res.status(500).json({ error: error })
                throw error
            }
            construct.push(results3)
            connection.query('select * from typehouse', (error, results2) => {
                if (error) {
                    return res.status(500).json({ error: error })
                    throw error
                }
                construct.push(results2)
                connection.query(` select quartiers.id,nom_quartier,nom_ville, nom_pays from pays 
                inner join villes on villes.id_pays = pays.id
                inner join quartiers on villes.id = quartiers.id_ville `, (error, results4) => {
                    if (error) {
                        return res.status(500).json({ error: error })
                        throw error
                    }
                    construct.push(results4)
                    if (construct.length == 4) {
                        return res.status(200).json({ datas: construct })
                    }
                    else {
                        return res.status(400).json({ error: 'Something bad happened' })
                    }
                })

            })
        })
    })


}
exports.getAgentHouses = (req, res, next) => {
    const offset = req.query.offset
    console.log('-*-*-*-*-**-**-*-*- ')
    console.log(offset)
    const getQuery = `select houses.id as idhouse, userId, imageUrl,voisin,prix,superficie,
    nbsalon,nbchambre,nbcuisine,nbdouche,
    typehouse,cathouse,nom_ville,nom_quartier from houses 
    inner join typehouse on houses.type = typehouse.id 
    inner join cathouse on houses.categorie = cathouse.id 
    inner join villes on houses.ville = villes.id 
    inner join quartiers on houses.quartier = quartiers.id 
    inner join pays on houses.pays = pays.id
    inner join vendor on vendor.idvendor = houses.userId
    where houses.userId = ?
    order by houses.id desc limit 9 offset ?`
    connection.query(getQuery, [parseInt(req.params.id), parseInt(offset)], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
            throw error
        }
        console.log(results)
        return res.status(200).json({ datas: results });
    })
}

exports.getOneHouse = (req, res, next) => {
    const getQuery = `
    select houses.type, houses.categorie,houses.frais,houses.imageUrl,
    nbchambre,nbsalon,nbdouche,nbcuisine,namehouse,cathouse.cathouse,
    typehouse.typehouse, type_feat, housefeatures.area as area_feat, housefeatures.id as id_feat,
    pays.nom_pays as pays,villes.nom_ville as ville,quartiers.nom_quartier as quartier,
    voisin,prix,superficie,userId,description,disponibilite, features,
    date_creation,url,idhouse,area from houses 
    inner join housefeatures on houses.id = housefeatures.idhouse
    inner join typehouse on houses.type = typehouse.id
    inner join cathouse on houses.categorie = cathouse.id
    inner join villes on houses.ville = villes.id
    inner join quartiers on houses.quartier = quartiers.id
    inner join pays on houses.pays = pays.id
    inner join (select features,id as type_feat from typefeatures ) as tmp 
    on tmp.type_feat = housefeatures.type 
    where houses.id = ?`
    values = [req.params.id]
    connection.query(getQuery, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error: error })
        }
        if (results.length != 0) {
            values2 = [results[0].idhouse]
            const getOpts = `select * from optionshouse 
                inner join options on options.id = optionshouse.optionshouse where optionshouse.idhouse = ?`
            connection.query(getOpts, values2, (error, resultsOptions) => {
                if (error) {
                    return res.status(500).json({ error: error })
                }
                console.log('...............-results-....................')
                console.log({ datas: results, options: resultsOptions })
                console.log('............................................')
                return res.status(200).json({ datas: results, options: resultsOptions });
            })
        }
        else {
            return res.status(400).json({ error });
        }
    })
}

exports.deleteHouse = (req, res, next) => {
    if (req.auth.userId) {
        console.log('------------------pre ld ------------')
        console.log(req.params.id)
        connection.beginTransaction((err) => {
            if (err) {
                throw err;
            }
            connection.query(`select housefeatures.idhouse, userId,imageUrl,url from houses inner join 
            housefeatures on houses.id = housefeatures.idhouse
            where userId = ? and housefeatures.idhouse = ?`, [req.auth.userId, req.params.id], (error, results) => {
                if (error) {
                    connection.rollback(() => {
                        return res.status(500).json({ error: error })
                        throw error
                    })
                }
                if (results[0].userId != req.auth.userId) {
                    return res.status(401).json({ message: 'Not authorized' });
                }
                else {
                    connection.query('delete from houses where id = ?', [req.params.id], (error) => {
                        if (error) {
                            connection.rollback(() => {
                                return res.status(500).json({ error: error })
                                throw error
                            })
                        }
                        console.log('----------------------- DELL 1  -----------------------')
                        console.log(`images/houses/${results[0].imageUrl.split('/images/houses/')[1]}`)
                        console.log('----------------------- DELL 1 -----------------------')
                        fs.unlink(`images/houses/${results[0].imageUrl.split('/images/houses/')[1]}`, (error) => {
                            if (error) {
                                console.log('----------------------- ERRO 1  -----------------------')
                                console.log(error)
                                console.log('----------------------- ERRO 1 -----------------------')
                                connection.rollback(() => {
                                    return res.status(500).json({ error: error })
                                    throw error
                                })
                            }
                        });

                        Object.values(results).forEach(element => {
                            console.log('----------------------- DELL 2  -----------------------')
                            console.log(`images/houses/${element.url.split('/images/houses/')[1]}`)
                            console.log('----------------------- DELL 2 -----------------------')
                            fs.unlink(`images/houses/${element.url.split('/images/houses/')[1]}`, (error) => {
                                if (error) {
                                    console.log('----------------------- ERRO 2  -----------------------')
                                    console.log(error)
                                    console.log('----------------------- ERRO 2 -----------------------')
                                    connection.rollback(() => {
                                        return res.status(500).json({ error: error })
                                        throw error
                                    })
                                }
                            });
                        })
                    })
                }
            })
        })
        connection.commit((error, results) => {
            if (error) {
                connection.rollback(() => {
                    return res.status(400).json({ error: "Format des features non respecté" })
                    throw error
                })
            }
            return res.status(200).json({ message: 'Maison supprimée avec succès' })
        });
    }


    /*Houses.findOne({ _id: req.params.id })
        .then(house => {
            const id = { ...house }._id
            if (house.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = house.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    House.deleteOne({ _id: req.params.id })
                        .then(() => {
                            HouseFeatures.deleteMany({ idHouse: id })
                                .then(() => {
                                    return res.status(200).json({ message: 'Maison supprimée !' })
                                })
                                .catch(error => {
                                    return res.status(401).json({ error });
                                });
                        })
                        .catch(error => return res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            return res.status(500).json({ error });
        });*/
};


function mm(ob) {
    var query = ''
    if (ob.vals[0] == null && ob.vals[1] != null) {
        query += ob.field + ' <= ' + ob.vals[1]
    }
    else if (ob.vals[0] != null && ob.vals[1] == null) {
        query += ob.field + ' >= ' + ob.vals[0]
    }
    else if (ob.vals[0] != null && ob.vals[1] != null) {
        query += ob.field + ' between ' + ob.vals[0] + ' and ' + ob.vals[1]
    }
    return query

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