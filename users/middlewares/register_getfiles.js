const housefeaturesfields = ['idCard']
module.exports = (req, res, next) => {
    let files = { idCard: ''}
    let path = { idCard : ''}
    Object.values(req.files).map(el => {
        const type = el.fieldname.split('_')[0]
        if(housefeaturesfields.indexOf(type) != -1){
            files[type] = el.fieldname
            path[type] = el.destination
        }
        else{
            res.status(400).json({ message: "Champ inconnu !!!" })
        }
    })
    req.file = files
    req.paths = path
    next();
}