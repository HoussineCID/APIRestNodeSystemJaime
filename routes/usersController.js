const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt.utils');
const { User } = require('../models');

// Routes
module.exports = {
  register: function (req, res) {
    const { email, username, password, bio } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'missing parameters' });
    }

    User.findOne({ where: { email: email } })
      .then(function (userFound) {
        if (!userFound) {
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            User.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              bio: bio,
              isAdmin: false,
            })
              .then(function (newUser) {
                return res.status(201).json({ userId: newUser.id });
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
