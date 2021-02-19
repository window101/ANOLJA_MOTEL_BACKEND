const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');
const userDao = require('../dao/userDao');
const { constants } = require('buffer');

exports.getArea = async function(req, res) {

    try {
        const areainfo = await userDao.getArea();

        res.json(areainfo);
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.Area = async function(req, res) {
    const {
        AreaID,Areaname
    } = req.body;
    try {
        const aboutArea = [AreaID,Areaname];
        const makeArea = userDao.Area(aboutArea);
        console.log(makeArea);
        if(makeArea) {
            res.json(makeArea);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.Areamodify = async function(req, res) {
    const {
        Areaname
    } = req.body;
    try {
        if(req.params.id > 7 || req.params.id < 0) {
            res.json(404);
        }
        const aboutArea = [Areaname];
        const modifyarea = userDao.Areamodify(req.params.id, aboutArea);
        res.json(modifyarea);
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.deleteArea = async function(req, res) {

    try {
        console.log(req.params.id);
        const deletearea = await userDao.deleteArea(req.params.id);
        if(deletearea.length > 1) {
            res.json(deletearea);
        } else {
            res.send(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}