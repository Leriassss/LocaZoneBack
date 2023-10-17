const { now } = require('mongoose');
const Messages = require('../models/messages');

exports.createMessage = (req, res, next) => {
  const message = new Messages({
    emetteurId : req.auth.userId,
    destinataireId : req.body.destinataireId,
    body: req.body.text,
    date: now()
  });
  message.save()
    .then(() => {
      res.status(201).json({
        message: 'delivred'
      });
    })
    .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getAllMessages = (req, res, next) => {
  Messages.find({emetteurId: req.auth.userId, destinataireId : req.body.destinataireId})
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};