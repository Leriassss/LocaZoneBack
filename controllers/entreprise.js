const Entreprise = require('../models/vendors/entreprise');

exports.createEntreprise = (req, res, next) => { 
     const newVendor = new Entreprise({
            nameVendor : req.body.nameVendor,
            ifu : req.body.ifu,
            idCard : req.body.idCard,
            localisation : req.body.localisation,
            description : req.body.description,
            idUser : req.auth.userId,
            city : req.body.city,
            dateCreation : Date.now()
        });
        console.log("----------------------------");
        console.log(newVendor);
        newVendor.save()
        .then(() => res.status(201).json({ message: 'Entreprise créée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getEntreprise = (req, res, next) => {
    Entreprise.findOne({
      idUser: req.auth.userId
    }).then(
      (Entreprise) => {
        res.status(200).json(Entreprise);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.getOneEntreprise = (req, res, next) => {
    Entreprise.findOne({
      _id: req.params.id
    }).then(
      (entreprise) => {
        res.status(200).json(entreprise);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

exports.modifyEntreprise = (req, res, next) => {
    Entreprise.findOne({idUser : req.auth.userId}).then((entreprise) => {
        modifications = new Entreprise({
            _id : entreprise._id,
            ifu : req.body.ifu ? req.body.ifu : entreprise.ifu,
            idCard : req.body.idCard ? req.body.idCard : entreprise.idCard,
            localisation : req.body.localisation ? req.body.localisation : entreprise.localisation,
            description : req.body.description ? req.body.localisation : entreprise.description,
            idUser : entreprise.userId, 
            city : req.body.city ? req.body.city : entreprise.city,
            dateCreation : entreprise.dateCreation
        })
        Entreprise.updateOne({_id: req.auth.userId}, modifications).then(() => {
              res.status(201).json({
                message: 'Entreprise updated successfully!'
              });
            }).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
    }).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );
    };

  
  exports.deleteEntreprise = (req, res, next) => {
    Entreprise.deleteOne({idUser : req.auth.userId}).then(
      () => {
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.getAllEntreprise = (req, res, next) => {
    Entreprise.find().then(
      (entreprises) => {
        res.status(200).json(entreprises);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };