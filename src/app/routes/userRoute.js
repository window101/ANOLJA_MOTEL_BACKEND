module.exports = function(app){
    const user = require('../controllers/userController');
    const owner = require('../controllers/userController');
    const motel = require('../controllers/motelController');
    const aboutreserv = require('../controllers/aboutReservation');
    const aboutarea = require('../controllers/aboutArea')
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //app.route('/app/signUp').post(user.signUp);
    // app.route('/app/signIn').post(user.signIn);
    // app.route('/app/')
    // console.log("route user")

    app.route('/user').get(user.getUser);
    app.route('/user/:id').put(jwtMiddleware,user.modifyUser);
    app.route('/user/:id').delete(jwtMiddleware,user.deleteUser);
    //app.route('/user').post(user.makeUser);
    app.route('/signup').post(user.signUp);       // 유저 회원가입
    app.route('/signin').get(user.signIn);        // 유저 정보 확인 후, 토큰 발급
    app.route('/ownersignup').post(owner.OwnersignUp);
    app.route('/ownersignin').get(owner.OwnersignIn);

    app.route('/user/:id/point').get(jwtMiddleware,user.getUserpoint);//한방쿼리 9번
    app.route('/user/:id').get(jwtMiddleware,user.getUserid); //내가 만듬


    app.route('/usercoupon').get(user.getUserCoupon);
    app.route('/usercoupon/:id').get(jwtMiddleware,user.getUserSpecificCoupon);
    app.route('/usercoupon/:id').delete(jwtMiddleware,user.deleteSpecificCoupon);

    app.route('/usercoupon').post(user.makeUserCoupon);
    app.route('/usergrade').get(user.getUsergrade);
    app.route('/usergrade').delete(user.deleteSpecificgrade);
    app.route('/usergrade').post(user.makeUsergrade);

    app.route('/owner/:id').get(jwtMiddleware,owner.getOwnerid);
    app.route('/owner/:id').put(jwtMiddleware,owner.modifyOwner);
    //app.route('/owner').post(owner.makeOwner);
    app.route('/owner/:id').delete(jwtMiddleware,owner.deleteOwner);
    app.route('/owner').get(owner.getOwner);
    app.route('/moteluser/userinfo').get(jwtMiddleware,user.userinfo);//한방쿼리 8번

    app.route('/motel').get(motel.getMotel);//한방쿼리 1번
    app.route('/motel/specific').get(motel.getMotelspecific);//한방쿼리 2번
    app.route('/motel/specific/more').get(motel.getMotelmorespecific);//한방쿼리 3번
    app.route('/motel/specific/room').get(motel.getMotelroom);//한방쿼리 4번
    app.route('/motel/ownerinfo').get(motel.getMotelowner);//한방쿼리 5번
    app.route('/motel/roomkind').get(motel.getRoomkind);
    app.route('/motel/roomkind/:id').delete(motel.deleteRoomkind);
    app.route('/eachmotel/:id').put(motel.modifyMotel);


    app.route('/motel/reply').get(aboutreserv.getMotelreply);//한방쿼리 7번
    app.route('/reserv').get(aboutreserv.getReservation);//예약목록 전체조회
    app.route('/reserv').post(aboutreserv.makeReservation);
    app.route('/reserv/:id').get(aboutreserv.getSpecificReservation);//특정 예약목록 조회

    app.route('/motel/reply').post(aboutreserv.makeMotelreply);
    app.route('/motel/reply/:id').delete(aboutreserv.deleteMotelreply);


    app.route('/motel/review').get(jwtMiddleware,aboutreserv.getMotelreview);//한방쿼리 6번 (jwt 적용완료)
    app.route('/motel/review').post(jwtMiddleware,aboutreserv.makeMotelreview);

    app.route('/motel/review/:id').delete(jwtMiddleware,aboutreserv.deleteMotelreview);

    app.route('/area').get(aboutarea.getArea);
    app.route('/area').post(aboutarea.Area);//지역 데이터 추가
    app.route('/area/:id').put(aboutarea.Areamodify);//지역 데이터 수정
    app.route('/area/:id').delete(aboutarea.deleteArea);

    // app.route('/app/check').post(user.check);
    //app.get('/check', user.check);
    //app.get('/check', jwtMiddleware, user.check);
};