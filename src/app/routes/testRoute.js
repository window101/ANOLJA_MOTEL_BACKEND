module.exports = function(app) {
    var index = require('../controllers/testController');
    app.get('/', index.render);
}
/*
module.exports = function(app) {
    var index = require('../controllers/indexController'); //내가 삽입
    app.get('/users', index.render);
}*/

/*
module.exports = function(app){
    const test = require('../controllers/testController');
    //const jwtMiddleware = require('../../../config/jwtMiddleware');
    //app.get('/test', jwtMiddleware, test.practice);
    //app.get('/test',test.practice);
    app.get()
};*/