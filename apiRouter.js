// Imports
var express = require('express');
var usersCtrl = require('./routes/usersController');
var messageCtrl=require ('./routes/messagesWaterfallController')
// Router
var apiRouter = express.Router();

// User routes
apiRouter.post('/users/register', function(req, res) {
  usersCtrl.register(req, res);
});

apiRouter.post('/users/login', function(req, res) {
  usersCtrl.login(req, res);
});
apiRouter.get('/users/userProfile', function(req, res) {
  usersCtrl.getUserProfile(req, res);
});
apiRouter.put('/users/updateBio', function(req, res) {
  usersCtrl.updateUserProfileBio(req, res);
});

//messages routes 
apiRouter.post('/messages/newMessage', function(req, res) {
  messageCtrl.createMessage(req, res);
});
// Export du routeur
module.exports = apiRouter;
