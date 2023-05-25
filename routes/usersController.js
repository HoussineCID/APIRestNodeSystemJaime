const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.utils');
const { User } = require('../models');
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
      if(username.length >= 13 || username.length <= 4){
        return res.status(400).json({ error: 'worng username (must be length 5-12)' });
      }
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'email is not valid' });
      }
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Password invalid (must length Minimum 8 in length and At least one special character,At least one digit,At least one lower case English letter,At least one upper case)' });
      }

    User.findOne({ where: { email: email } })
      .then(function (userFound) {
      console.log(userFound.dataValues);
        if (!userFound) {
            /////crypter password b
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            User.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              bio: bio,
              isAdmin: false,
            })
              .then(function (newUser) {
                return res.status(200).json({ userId: newUser.id });
              })
              .catch(function (err) {
                return res.status(500).json({ error: 'cannot add user' });
              });
          });
        } else {
          return res.status(409).json({ error: 'user already exists' });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ error: 'unable to verify user' });
      });
  },

  login: function (req, res) {
    // Code pour la connexion de l'utilisateur

      //recupere request params
    const { email,password} = req.body;

    if(email==null || password == null ){
        return res.status(400).json({'error' : 'missing parameters'})
    }
    User.findOne({
        where : {email:email}
    }).then(function(userFound){
        if(userFound){
            bcrypt.compare(password , userFound.password, function(errBycrypt , resBycrypt){
                console.log(userFound)
                if(resBycrypt){
                    return res.status(200).json({
                        
                            'userId' : userFound.id,
                            'token':jwt.generateTokenForUser(userFound)
          
                    })
                }else{
                    return res.status(403).json({'error':'invalid password'})
                }
            })
        }else{
            return res.status(404).json({'error':'user not exist in DB'})
        }

    }).catch(function(err){
        return res.status(500).json({'error':'unable to verify user'})
    })

  },
};
