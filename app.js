const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes/routes.js');
const users = require('./routes/users');
const bodyParser = require('body-parser')

app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//transformer le body en json object
app.use(bodyParser.json());

  app.use(routes)
  app.use(users)

//Gérer les images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
