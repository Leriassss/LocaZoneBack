const express = require('express');


const mongoose = require('mongoose');
/*mongoose.connect('mongodb+srv://jean:WlVqOJ2QGmzvbH9y@cluster0.novz9xo.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));*/

  /*mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));*/


const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Encrypte');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));
const stuffRoutes = require('./routes/stuff');
app.use('/api/stuff', stuffRoutes);
const usersRoutes = require('./routes/users');
app.use('/auth', usersRoutes);
const vendorRoute = require('./routes/vendor');
app.use('/vendor', vendorRoute);
const houseRoute = require('./routes/houses');
app.use('/houses', houseRoute);
const authorizationRoute = require('./routes/index');
app.use('/authorization', authorizationRoute);
const agentsRoute = require('./routes/agents');
app.use('/agents', agentsRoute);
const mailingRoute = require('./routes/mailing');
app.use('/mailing', mailingRoute);
const messageRoute = require('./routes/messages');
app.use('/messages', messageRoute);

module.exports = app;