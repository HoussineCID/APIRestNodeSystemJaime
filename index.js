//Imports
var express = require('express')

//Instantiate server 
var server = express()

//Configuration routes 
server.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.send('<h1>Bonjour sur mon server</h1>')
})

//launch server
server.listen(3030,()=>{
    console.log("Start server port 3030")
})

