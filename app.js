const express = require('express');
const { rateLimit } = require('express-rate-limit');
require('dotenv').config();

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

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
  })

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Encrypte');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*app.use(apiLimiter)*/
const path = require('path');
app.use('/users/images', express.static(path.join(__dirname, 'users/images')));
const stuffRoutes = require('./users/routes/stuff');
app.use('/api/stuff', stuffRoutes);
const usersRoutes = require('./users/routes/users');
app.use('/auth', usersRoutes);
const vendorRoute = require('./users/routes/vendor');
app.use('/vendor', vendorRoute);
const houseRoute = require('./users/routes/houses');
app.use('/houses', houseRoute);
const authorizationRoute = require('./users/routes/index');
app.use('/authorization', authorizationRoute);
const agentsRoute = require('./users/routes/agents');
app.use('/agents', agentsRoute);
const spRoute = require('./users/routes/specials');
app.use('/options', spRoute);
const visitesRoute = require('./users/routes/visites');
app.use('/visites', visitesRoute);
const FiltresRoute = require('./users/routes/filtres');
app.use('/filtres', FiltresRoute);
const mailingRoute = require('./users/routes/mailing');
app.use('/mailing', mailingRoute);
const messageRoute = require('./users/routes/messages');
app.use('/messages', messageRoute);

module.exports = app;