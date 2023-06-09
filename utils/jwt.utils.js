var jwt = require('jsonwebtoken')
const JWT_SIGN_SECRET = '0sjs6gf9mk9nwx22aer5hvbBmlp7788ttyfxcfd654lmkjcc852zhfjhrjheoelllekssq1fg254ge888er66re33fre5r8zteg6g5zy56gre655tygtr56y'
//exported functions 
module.exports ={

generateTokenForUser: function(userData){
 return jwt.sign({
    userId : userData.id,
    isAdmin:userData.isAdmin
 },JWT_SIGN_SECRET,
 {
    expiresIn :'1h'
 })

},
parseAuthorization: function(authorization){
    //pour replacerla chaine Bearer par chaine vide ('') 
    return (authorization != null)?  authorization.replace('Bearer', '').trim() : null ;
},
getUserId: function(authorization){
   var userId = -1;
    var token = module.exports.parseAuthorization(authorization)
    if(token !=null){
        try{
            var jwtToken= jwt.verify(token,JWT_SIGN_SECRET);
               if(jwtToken != null){
                  userId = jwtToken.userId;
            }
        }catch(err){}
    }
    return userId;
}

}