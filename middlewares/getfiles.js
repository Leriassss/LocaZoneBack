
const housefeaturesfields = ['salon','chambre','douche','cuisine']
module.exports = (req, res, next) => {
    let files = { facade: '', douche: [], chambre: [], cuisine: [], salon: [] }
    Object.values(req.files).map(el => {
        const type = el.fieldname.split('_')[0]
        if (type == 'facade') {
            files[type] = el.fieldname

        }
        else if(housefeaturesfields.indexOf(type) != -1){
            files[type].push(el.fieldname)
        }
        else{
            res.status(400).json({ message: "Champ inconnu !!!" })
        }
    })
    req.file = files
    next();
}
