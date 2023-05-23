// Imports
var express = require('express');
var bodyParser = require('body-parser');
// Import du routeur API
var apiRouter = require('./apiRouter').router;

// Instanciation du serveur
var server = express();

// Configuration du body parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configuration des routes
server.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send('<h1>Bonjour sur mon serveur</h1>');
});

// Utilisation du routeur API
server.use('/api/', apiRouter);

// Lancement du serveur
server.listen(3030, () => {
  console.log("Démarrage du serveur sur le port 3030");
});
