// Imports
var express = require('express');
var usersCtrl = require('./routes/usersController');

// Router
var apiRouter = express.Router();

// User routes
apiRouter.post('/users/register', function(req, res) {
  usersCtrl.register(req, res);
});

apiRouter.post('/users/login', function(req, res) {
  usersCtrl.login(req, res);
});

// Export du routeur
module.exports.router = apiRouter;
