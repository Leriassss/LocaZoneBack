

module.exports = (req, res, next) => {
    const ob = { ...req.body };
    const mesfeats = JSON.parse(ob.features)
    const monhouse = JSON.parse(ob.accessoires)
    const accessoires = JSON.parse(ob.house)
    const files = { ...req.files }
    const feats = {
        "douche": mesfeats.douche.map(element => {
            return (element = isNaN(parseInt(element)) ? 0 : parseInt(element))
        }),
        "cuisine": mesfeats.cuisine.map(element => {
            return (element = isNaN(parseInt(element)) ? 0 : parseInt(element))
        }),
        "chambre": mesfeats.chambre.map(element => {
            return (element = isNaN(parseInt(element)) ? 0 : parseInt(element))
        }),
        "salon": mesfeats.salon.map(element => {
            return (element = isNaN(parseInt(element)) ? 0 : parseInt(element))
        }),
    }
    console.log('...............-file-....................')
    console.log(files)
    console.log('...................................')
    console.log('...............-feats-....................')
    console.log(feats)
    console.log('...................................')
    console.log('...............-monhouse-....................')
    console.log(monhouse)
    console.log('...................................')
    console.log('...............-accessoires-....................')
    console.log(accessoires)
    console.log('...................................')

    console.log('...............-accessoires 2-....................')
    console.log(Object.values(feats.salon).length)
    console.log('...................................')

    const errors = {};
    console.log('*****')
    console.log(monhouse.houseName.trim()!='')
    if(!/^[\w'\s]+$/.test(monhouse.houseName) && monhouse.houseName.trim()!=''){
        errors.houseName = 'Nom incorrect';
      }
    else{
        monhouse.houseName = monhouse.houseName.trim()
    }
    if(monhouse.area == null || (''+monhouse.area).trim() == '' ){
        monhouse.area = 0
    }
    if(isNaN(Date.parse(monhouse.disponibilite))){
        errors.disponibilite = 'Date incorrect';
      }
    if(isNaN(parseInt(monhouse.frais)) || !isFinite(parseInt(monhouse.frais)) || parseInt(monhouse.frais) < 0){
        errors.frais = 'Somme incorrecte'
    }
    if(isNaN(parseInt(monhouse.prix)) || !isFinite(parseInt(monhouse.prix)) || parseInt(monhouse.frais) < 0){
        errors.prix = 'Somme incorrecte'
    }
    if(isNaN(parseInt(monhouse.neighbor)) || !isFinite(parseInt(monhouse.neighbor)) || parseInt(monhouse.neighbor) < 0){
        errors.neighbor = 'Champ incorrecte'
    }
    // Vérifier s'il y a des erreurs
    if (Object.keys(errors).length > 0) {
        console.log(errors)
        return res.status(400).json({errors : errors});
    }
    req.body = {files,feats,monhouse,accessoires}
    // Si la validation réussit, passer au middleware suivant
    next();
};
