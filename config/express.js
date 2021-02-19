const express = require('express');
const compression = require('compression');
//const jwtMiddleware = require('./jwtMiddleware.js');
const jwt = require('express-jwt');
const secret = require('./secret');
const methodOverride = require('method-override'); //delete , put 등 메서드 사용하기 위해서
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression()); //페이지 압축 전송 미들웨어

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());
    app.use(cors());
    
    app.use(jwt({
        secret:secret.jwtsecret,
        algorithms: ['HS256'],
        credentialsRequired: true,
        getToken: function fromHeaderOrQuerystring (req) {
            console.log('from express :', req.headers['x-access-token']);
            if (req.headers['x-access-token'] && req.headers['x-access-token'].split(' ')[0] === 'Bearer') {
                return req.headers['x-access-token'].split(' ')[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        }
    }).unless({path:['/signIn']}));
    //app.use(function (err, req, res, next) {
    //    console.log(err);
    //    if (err.name === 'UnauthorizedError') {
    //        res.status(401).send('invalid token...');
    //    }
    //});
    //app.use(jwt);
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    require('../src/app/routes/indexRoute')(app);
    require('../src/app/routes/userRoute')(app);
    require('../src/app/routes/testRoute')(app);
    /* Web */
    // require('../src/web/routes/indexRoute')(app);

    /* Web Admin*/
    // require('../src/web-admin/routes/indexRoute')(app);
    return app;
};