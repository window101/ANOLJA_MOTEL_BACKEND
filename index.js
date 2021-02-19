
const express = require('./config/express');
const jwt = require('jsonwebtoken');
const secret = require('./config/secret');
console.log(secret);
//console.log(jwt.sign({
//    username:'abcd'
//}, secret.jwtsecret, { expiresIn: '1h' })
//);
//const app = express();
//app.use(express.json());

// nodemon


const {logger} = require('./config/winston');

const port = 3000;
express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);


/*
var express = require('./config/express');
var app = express();
app.listen(3000);
module.exports = app;
console.log('Server running at localhost');

*/
/*
var express = require('express');
var app = express();
var question = function(req, res, next) {
    if(req.param('answer')) {
        next(); }
    else {
        res.send('so what is your answer?') }
}; var result = function(req,res) {
    res.send('give me your tit')
}
app.get('/', question , result);
app.listen(3000);
console.log('server start');*/


/*
const http = require('http');
const express = require('./config/express');
var app = express();

app.get('/',function(req, res) {
    res.send('hello world');
})







const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hello World\n');
});

server.listen(port , hostname,()=> {
    console.log('server is running');
})

*/



