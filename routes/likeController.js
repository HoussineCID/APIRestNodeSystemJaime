//Imports 
const { Like,Message,User } = require('../models');
const jwt = require('../utils/jwt.utils');
const bcrypt = require('bcrypt');
const async = require('async');
//Constants


//Routes
module.exports = {

    likePost:(req,res)=>{

       //Getting auth header
        var headerAuth = req.headers['authorization']
        var userId = jwt.getUserId(headerAuth)

       //recupere request params
         var  messageId = parseInt(req.params.messageId)
     // verification du message 
     if(messageId <= 0){
        return res.status(400).json({error : 'invalid Parameters'})
     }
     async.waterfall([
        (callback)=>{
            Message.findOne({
                where : {id: messageId}
            }).then((messageFound)=>{
                callback(null,messageFound)
            }).catch((err)=>{
                 return res.status(500).json({error : 'unable to verify message'})
            })
        },
        (messageFound, callback)=>{
            if(messageFound){
                User.findOne({
                    where:{id:userId}
                }).then((userFound)=>{
                    callback(null,messageFound,userFound)
                }).catch((err)=>{
                     return res.status(500).json({error : 'unable to verify user'})
                })
            }else{
                     return res.status(404).json({error : 'post already liked'})
            }
        },
        (messageFound,userFound,callback)=>{
           Like.findOne({
            where:{
                userId : userId,
                messageId: messageId
            }
           }).then((isUserAlreadyLiked)=>{
            callback(null, messageFound, userFound, isUserAlreadyLiked)
           }).catch((err)=>{
                res.status(500).json({error : 'unable to verifiy is user already liked'})
           })   
        },
        (messageFound, userFound, isUserAlreadyLiked, callback )=>{
            if(!isUserAlreadyLiked){
                messageFound.addUser(userFound)
                .then((alreadyLikedFound)=>{
                    callback(null,messageFound, userFound, isUserAlreadyLiked)
                }).catch((err)=>{
                    return res.status(500).json({error : 'unable to set user reaction'})
                })
            }else{
                res.status(409).json({error : 'message already liked' })
            }
        },
        (messageFound, userFound, isUserAlreadyLiked, callback)=>{
            messageFound.update({
                likes : messageFound.likes + 1,
            }).then(()=>{
               callback(null, messageFound)
            })
            .catch((err)=>{
               res.status(500).json({error : 'cannot update message like counter'})
            })

        }
     ],(err, messageFound)=>{
          if(messageFound){
            return res.status(200).json(messageFound)
          }else{
            return  res.status(500).json({error : 'cannot update message'})
          }
     })

    },
    dislikePost:(req,res)=>{

       //Getting auth header
       var headerAuth = req.headers['authorization']
       var userId = jwt.getUserId(headerAuth)

      //recupere request params
        var  messageId = parseInt(req.params.messageId)
    // verification du message 
    if(messageId <= 0){
       return res.status(400).json({error : 'invalid Parameters'})
    }
    async.waterfall([
       (callback)=>{
           Message.findOne({
               where : {id: messageId}
           }).then((messageFound)=>{
               callback(null,messageFound)
           }).catch((err)=>{
                return res.status(500).json({error : 'unable to verify message'})
           })
       },
       (messageFound, callback)=>{
           if(messageFound){
               User.findOne({
                   where:{id:userId}
               }).then((userFound)=>{
                   callback(null,messageFound,userFound)
               }).catch((err)=>{
                    return res.status(500).json({error : 'unable to verify user'})
               })
           }else{
                    return res.status(404).json({error : 'post already liked'})
           }
       },
       (messageFound,userFound,callback)=>{
          Like.findOne({
           where:{
               userId : userId,
               messageId: messageId
           }
          }).then((isUserAlreadyLiked)=>{
           callback(null, messageFound, userFound, isUserAlreadyLiked)
          }).catch((err)=>{
               res.status(500).json({error : 'unable to verifiy is user already liked'})
          })   
       },
       (messageFound, userFound, isUserAlreadyLiked, callback )=>{
           if(isUserAlreadyLiked){
            isUserAlreadyLiked.destroy()
               .then((alreadyLikedFound)=>{
                   callback(null,messageFound, userFound)
               }).catch((err)=>{
                   return res.status(500).json({error : 'unable to set user reaction'})
               })
           }else{
               res.status(409).json({error : 'message already disliked' })
           }
       },
       (messageFound, userFound, callback)=>{
           messageFound.update({
               likes : messageFound.likes - 1,
           }).then(()=>{
              callback(null, messageFound)
           })
           .catch((err)=>{
            console.log(err);
              res.status(500).json({error : 'cannot update message like counter'})
           })

       }
    ],(err, messageFound)=>{
         if(messageFound){
           return res.status(200).json(messageFound)
         }else{
           return  res.status(500).json({error : 'cannot update message'})
         }
    })
    }
    




}