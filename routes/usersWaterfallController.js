const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.utils');
const { User } = require('../models');
const async = require('async');
//Constants
var EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        // Cette expression régulière appliquera ces règles :
        // Au moins une lettre anglaise majuscule ,(?=.*?[A-Z])
        // Au moins une lettre anglaise minuscule,(?=.*?[a-z])
        // Au moins un chiffre,(?=.*?[0-9])
        // Au moins un caractère spécial,(?=.*?[#?!@$%^&*-])
        // Minimum huit de longueur .{8,}(avec les ancres)
var PASSWORD_REGEX =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
// Routes
module.exports = {

    register: function (req, res) {
      const { email, username, password, bio } = req.body;
    
      if (!email || !username || !password) {
        return res.status(400).json({ error: 'missing parameters' });
      }
      if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ error: 'wrong username (must be length 5-12)' });
      }
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'email is not valid' });
      }
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Password invalid (must length Minimum 8 in length and At least one special character,At least one digit,At least one lower case English letter,At least one upper case)' });
      }
    
      async.waterfall([
        function (callback) {
          User.findOne({ where: { email: email } })
            .then(function (userFound) {
              if (userFound) {
                callback({ status: 409, message: 'user already exists' });
              } else {
                callback(null);
              }
            })
            .catch(function (err) {
              callback({ status: 500, message: 'unable to verify user' });
            });
        },
        function (callback) {
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            if (err) {
              callback({ status: 500, message: 'unable to hash password' });
            } else {
              callback(null, bcryptedPassword);
            }
          });
        },
        function (bcryptedPassword, callback) {
          User.create({
            email: email,
            username: username,
            password: bcryptedPassword,
            bio: bio,
            isAdmin: false,
          })
            .then(function (newUser) {
              callback(null, newUser.id);
            })
            .catch(function (err) {
              callback({ status: 500, message: 'cannot add user' });
            });
        }
      ], function (err, userId) {
        if (err) {
          return res.status(err.status).json({ error: err.message });
        } else {
          return res.status(200).json({ userId: userId });
        }
      });
    },
    
    login: function (req, res) {
      const { email, password } = req.body;
    
      if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
      }
    
      async.waterfall([
        function (callback) {
          User.findOne({ where: { email: email } })
            .then(function (userFound) {
              if (userFound) {
                callback(null, userFound);
              } else {
                callback({ status: 404, message: 'user not exist in DB' });
              }
            })
            .catch(function (err) {
              callback({ status: 500, message: 'unable to verify user' });
            });
        },
        function (userFound, callback) {
          bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
            if (resBycrypt) {
              callback(null, userFound);
            } else {
              callback({ status: 403, message: 'invalid password' });
            }
          });
        }
      ], function (err, userFound) {
        if (err) {
          return res.status(err.status).json({ error: err.message });
        } else {
          return res.status(200).json({
            'userId': userFound.id,
            'token': jwt.generateTokenForUser(userFound)
          });
        }
      });
    },  
};
