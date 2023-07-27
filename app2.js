const express = require('express');

const app2 = express();
app2.use(express.json());

app2.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app2.post('/api/vendor/entreprise', (req, res, next) => {
    console.log(req.body);});

module.exports = app2;