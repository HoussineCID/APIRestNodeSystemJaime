//Imports
const { User, Message } = require('../models');
const jwt = require('../utils/jwt.utils');
const bcrypt = require('bcrypt');
const async = require('async');
//Constants

//Routes
module.exports={

    createMessage:(req, res)=>{
        //recupere request params
        const { title,content} = req.body;

       //Getting auth header
        var headerAuth = req.headers['authorization']
        var userId = jwt.getUserId(headerAuth)
       
        //condition message
        if(title == null || content == null){
            return res.status(400).json({error : 'missing parameters'})
        }
        async.waterfall([
           //recherche existe dans BD
           (callback)=>{
               User.findOne({
                  //les champs je vais retournee -default all
                      //attributes:['idUser','title', 'content', 'likes'],
                   //condition de retour de requete
                       where:{id:userId}
               }).then((userFound)=>{
                  callback(null,userFound) 
               }).catch( (err)=> {
                   callback({ status: 500, message: 'unable to verify user' });
            });
         },
         (userFound,callback)=>{
                 Message.create({
                 title:title,
                 content:content,
                 userId:userFound.dataValues.id,
                 likes:0
                }).then((newMessage)=>{
                    callback(null,newMessage)
                }).catch(function (err) {
                    callback({ status: 500, message: 'cannot add message' });
            });
         }

       ],(err,newMessage)=>{
        newMessage ?  res.status(200).json(newMessage) : res.status(500).json({error : 'not found'})
       })

    },
    listMessage:(req, res)=>{

    }
}