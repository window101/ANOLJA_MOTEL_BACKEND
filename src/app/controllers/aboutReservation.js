const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');
const userDao = require('../dao/userDao');
const { constants } = require('buffer');



exports.getMotelreview = async function(req, res) {

    console.log(req.user);
    try {
        const motelreview = await userDao.getMotelreview();
        //console.log(motelreview)
        if(motelreview) {
            const checkQ = await userDao.checkDel(motelreview[0].고객);
            if(checkQ) { // id가 유효할 경우
                if(checkQ[0].Nickname === req.user.username) {
                    res.json(motelreview);
                }
                else { // 로그인한 유저랑 DB에 저장된 해당 내용의 유저랑 다를경우
                    res.json({'message':'권한이 없습니다'});
                    throw new Error('권한이 없습니다');
                }
            }
            else {
                res.json({'message':'id가 유효하지 않습니다'});
                throw new Error('id가 유효하지 않습니다');
            }
        }
        else {
            res.json({'message':'해당 한방쿼리 오류'});
            throw new Error('해당 한방쿼리 오류');
        }

    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getMotelreply = async function(req, res) {
    try {
        const motelreply = await userDao.getMotelreply();
        console.log(motelreply);
        if(motelreply.length > 0) {
            res.json(motelreply);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getReservation = async function(req, res) {
    try {
        const aboutreserve = await userDao.getReservation();
        if(aboutreserve) {
            res.json(aboutreserve);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getSpecificReservation = async function(req,res) {
    try {
        const aboutreserve = await userDao.getSpecificReservation(req.params.id);
        if(req.params.id > 3 || req.params.id < 0) {
            res.json(404);
        }
        if(aboutreserve) { res.json(aboutreserve);}
        else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.makeMotelreply = async function(req, res) {

    const {
        ReservationReviewID,OwnerID,replycontext,createdAt,UserID
    } = req.body;

    try {
        const replyinfo = [ReservationReviewID,OwnerID,replycontext,createdAt,UserID];
        const mreply = await userDao.makeMotelreply(replyinfo);
        if(mreply) res.json(mreply);
        else res.json(404);
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.deleteMotelreply = async function(req, res) {
    try {
        console.log(req.params.id);
        const deletereply = await userDao.deleteMotelreply(req.params.id);
        if(deletereply.length > 0) {
            res.json(deletereply);
        } else {
            res.send(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.makeMotelreview = async function(req, res) {

    if(req.user.ownername === 'Master' || req.user.ownername === 'Slave' || req.user.ownername === 'I2C' ||
    req.user.ownername === 'angry' || req.user.ownername === 'GOD') {
        // DB 조회해서 유동적으로 NAME 조회해야함 원래는 귀찮.
        res.json({'message':'Only User Can Access!'});
        throw new Error('Only User Can Access!');
    }
    const {
        Reservationnum,UserID,context,star,ReviewcommentID,createdAt,OwnerID,roomtype
    } = req.body;

    try {
        const reviewinfo = [Reservationnum,UserID,context,star,ReviewcommentID,createdAt,OwnerID,roomtype];
        const mreview = await userDao.makeMotelreview(reviewinfo);
        if(mreview) res.json(mreview);
        else res.json(404);
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}

exports.deleteMotelreview = async function(req, res) {

    console.log(req.user.username);
    try {
        const checkQ = await userDao.checkDel(req.params.id);
        if(checkQ) { // id가 유효할 경우
            if(checkQ[0].Nickname === req.user.username) {
                const deQ = await userDao.deleteMotelreview(req.params.id);
                res.json({'message':'delete success!'});
            }
            else {
                res.json({'message':'권한이 없습니다'});
                throw new Error('권한이 없습니다');
            }
        }
        else { // id가 유효하지 않으면
            res.json({'message':'id가 유효하지 않습니다'});
            throw new Error('id가 유효하지 않음');
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.makeReservation = async function(req, res) {

    const {
        Reservationnum,datew,stay,UserID,ReservationdesignationID
    } = req.body;

    try {
        const reservinfo = [Reservationnum,datew,stay,UserID,ReservationdesignationID];
        const mreserv = await userDao.makeReservation(reservinfo);
        if(mreserv) res.json(mreserv);
        else res.json(404);
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}