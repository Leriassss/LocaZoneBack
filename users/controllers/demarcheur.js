const Demarcheur = require('../models/vendors/demarcheur');

exports.createDemarcheur = (req, res, next) => { 
     const newVendor = new Demarcheur({
            nameVendor : req.body.nameVendor,
            idCard : req.body.idCard,
            description : req.body.description,
            idUser : req.auth.userId,
            city : req.body.city,
            dateCreation : Date.now()
        });
        console.log("----------------------------");
        console.log(newVendor);
        /*newVendor.save()
        .then(() => res.status(201).json({ message: 'Demarcheur créée !' }))
        .catch(error => res.status(400).json({ error }));*/
};


exports.getDemarcheur = (req, res, next) => {
    Demarcheur.findOne({
      idUser: req.auth.userId
    }).then(
      (Demarcheur) => {
        res.status(200).json(Demarcheur);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };


exports.modifyDemarcheur = (req, res, next) => {
    Demarcheur.findOne({idUser : req.auth.userId}).then((demarcheur) => {
        modifications = new Demarcheur({
            _id : demarcheur._id,
            idCard : req.body.idCard ? req.body.idCard : demarcheur.idCard,
            description : req.body.description ? req.body.localisation : demarcheur.description,
            idUser : Demarcheur.userId, 
            city : req.body.city ? req.body.city : Demarcheur.city,
            dateCreation : demarcheur.dateCreation
        })
        Demarcheur.updateOne({_id: req.auth.userId}, modifications).then(() => {
              res.status(201).json({
                message: 'Demarcheur updated successfully!'
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

  
  exports.deleteDemarcheur = (req, res, next) => {
    Demarcheur.deleteOne({idUser : req.auth.userId}).then(
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

  exports.getOneDemarcheur = (req, res, next) => {
    Demarcheur.findOne({
      _id: req.params.id
    }).then(
      (demarcheur) => {
        res.status(200).json(demarcheur);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.getAllDemarcheur = (req, res, next) => {
    Demarcheur.find().then(
      (demarcheurs) => {
        res.status(200).json(demarcheurs);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };