const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');
const userDao = require('../dao/userDao');
const { constants } = require('buffer');


exports.getMotel = async function(req, res) {
    try {
        const motelinfo = await userDao.getMotel();
        console.log(motelinfo.length);
        if(motelinfo.length > 0) {
            res.json(motelinfo);
        } else {
            res.send(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getMotelspecific= async function(req, res) {
    try {
        const motelspecificinfo = await userDao.getMotelspecific();
        console.log(motelspecificinfo.length);
        if(motelspecificinfo.length > 0) {
            res.json(motelspecificinfo);
        }else {
            res.send(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}

exports.getMotelmorespecific = async function(req, res) {
    try {
        const motelmorespecificinfo = await userDao.getMotelmorespecific();
        if(motelmorespecificinfo.length > 0) {
            res.json(motelmorespecificinfo[0]);
            //모텔 이름만 할라면 motelmorespecificinfo[0].모텔이름
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getMotelroom = async function(req, res) {
    try {
        const motelroom = await userDao.getMotelroom();
        console.log(motelroom.length);
        if(motelroom.length > 3) {
            res.json(motelroom);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getMotelowner = async function(req, res) {
    try {
        const motelowner = await userDao.getMotelowner();
        console.log(motelowner.length);
        if(motelowner.length > 0) {
            res.json(motelowner);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getRoomkind = async function(req, res) {
    try {
        const room = await userDao.getRoomkind();
        console.log(room.length);
        if(room.length > 0) {
            res.json(room);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500);
    }
}
exports.deleteRoomkind = async function(req, res) {

    try {
        console.log(req.params.id);
        const deleteroom = await userDao.deleteArea(req.params.id);
        if(deleteroom.length > 1) {
            res.json(deleteroom);
        } else {
            res.send(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.modifyMotel = async function(req, res) {
    const {
        service
    } = req.body;
    if(req.params.id !== '1') {
        res.status(404).json('no');
    }
    try {
        console.log(req.params.id);
        const abouteachmotel = [service];
        const modifyeachmotel = await userDao.modifyMotel(req.params.id,abouteachmotel);

        if(modifyeachmotel.length > 0) {
            res.json(modifyeachmotel);
        } else {
            res.status(404).json('no instance');
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}


