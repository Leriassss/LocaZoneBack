const Particulier = require('../models/vendors/particulier');

exports.createParticulier = (req, res, next) => { 
     const newVendor = new Particulier({
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
        .then(() => res.status(201).json({ message: 'Particulier créé !' }))
        .catch(error => res.status(400).json({ error }));*/
}


exports.getParticulier = (req, res, next) => {
    Particulier.findOne({
      idUser: req.auth.userId
    }).then(
      (Particulier) => {
        res.status(200).json(Particulier);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };


exports.modifyParticulier = (req, res, next) => {
    Particulier.findOne({idUser : req.auth.userId}).then((Particulier) => {
        modifications = new Particulier({
            _id : Particulier._id,
            idCard : req.body.idCard ? req.body.idCard : Particulier.idCard,
            description : req.body.description ? req.body.localisation : Particulier.description,
            idUser : Particulier.userId, 
            city : req.body.city ? req.body.city : Particulier.city,
            dateCreation : Particulier.dateCreation
        })
        Particulier.updateOne({_id: req.auth.userId}, modifications).then(() => {
              res.status(201).json({
                message: 'Particulier updated successfully!'
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

  
  exports.deleteParticulier = (req, res, next) => {
    Particulier.deleteOne({idUser : req.auth.userId}).then(
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

  exports.getOneParticulier = (req, res, next) => {
    Particulier.findOne({
      _id: req.params.id
    }).then(
      (particulier) => {
        res.status(200).json(particulier);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

  exports.getAllParticulier = (req, res, next) => {
    Particulier.find().then(
      (particuliers) => {
        res.status(200).json(particuliers);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };