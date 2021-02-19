const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const regexEmail = require('regex-email');
const crypto = require('crypto');


const userDao = require('../dao/userDao');
const { constants } = require('buffer');

const jwt = require('jsonwebtoken'); //jwt를 쓸려면 대칭키가 있어야함
const secret_config = require('../../../config/secret'); // jwt를 풀었다가 암호화했다가 해야 하기때문에 대칭기 사용
//const hash = crypto.createHash('sha256');


exports.getUser = async function(req, res) {
    // 이것 또한 getUserid 처럼 body에 있는 로그인 정보만으로 접근제한 하면 getUserid 함수로 똑같애져 버려서 생략.
    // 맨 처음 authorization token을 첨부하면 모든 사용자 목록을 열람 할 수 있게 하였음
    // 다만 getUserid()의 경우 맨처음 authorization 토큰만으로는 다른 유저 정보를 볼 수 없음(본인 토큰을 새로 발급 받아서 해야 함)
    console.log(req.header);
    try {
        const user = await userDao.getUser();
        if(user) {
            res.json(user);
        }
        else {
            res.send(404)
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}

exports.getUserid = async function(req, res) {
    console.log("id = ",req.params.id)
    //console.log(req.headers.authorization);
    console.log(req.user);   // decoded token is attached to req.user
    try {
        const user = await userDao.getUserid(req.params.id);
        if(!user) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
        }
        if(req.user.username !== user.Nickname) {
            res.status(404).json({
                'message':'사용자 접근권한이 없습니다'
            });
        }
        if(user) {
            res.json(user)
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getOwner = async function(req, res) {
    try {
        const owner = await userDao.getOwner();
        if(owner) {
            res.json(owner);
        }
        else {
            res.send(404)
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getOwnerid = async function(req,res) {
    console.log(req.params.id);
    console.log(req.user.ownername);
    try {
        const owner = await userDao.getOwnerid(req.params.id);

        if(!owner) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
            throw new Error('사용자 목록에 없음');
        }

        if (req.user.ownername !== owner.Nickname) {
            res.status(404).json({
                'message': '사용자 접근권한이 없습니다'
            });
            throw new Error('사용자 접근권한 없음');
        }
        if(owner) {
            res.json(owner);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
/*           signup 이랑 유사해서 필요없음
exports.makeUser = async function(req, res) {
    const {
        Phone,Nickname,passwd
    } = req.body;
    if(!passwd) {
        res.json('비밀번호는 4자 이상,8자리 미만입니다').send(202);
    }
    try {
        //const body = req.body;
        const UserInfo = [Phone,Nickname,passwd];
        const Muser = await userDao.makeUser(UserInfo);
        if(Muser){
            res.json(Muser);
        }
        let payload = {
            Nickname:req.body.Nickname,
            passwd:req.body.passwd
        };
        let options = {};
        jwt.sign(payload,secret_config.jwtsecret, options,(err,token)=>{
            res.status(201).json({
                token:token,
                msg:'success'
            })
        });

        //if(Muser.length > 1) {
         //   res.json(Muser); //
       // } else {
       //     res.send(404);
       // }
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
    //const {
    //    Nickname
    //} = req.body;
    //console.log(req.body);
    //res.send(202);
}*/

exports.deleteUser = async function(req, res) {

    console.log(req.user);
    try {
        console.log(req.params.id);
        const checkuser = await userDao.checkDel(req.params.id);
        console.log(checkuser[0].Nickname);
        if(checkuser[0].Nickname !== req.user.username) {
            res.status(404).json({
                'message':'사용자 접근권한이 없습니다'
            });
            throw new Error('접근권한 없음');
        }
        if(!checkuser) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
            throw new Error('목록에 없음');
        }
        const deleteuser = await userDao.deleteUser(req.params.id);
        res.json({ 'message' : 'delete success!'});
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.deleteOwner = async function(req, res) {

    console.log(req.user);
    try {
        console.log(req.params.id);
        const checkowner = await userDao.checkOwner(req.params.id);
        console.log(checkowner[0].Nickname);
        console.log(req.user.ownername);
        if(checkowner[0].Nickname !== req.user.ownername) {
            res.status(404).json({
                'message':'사용자 접근권한이 없습니다'
            });
            throw new Error('접근권한 없음');
        }
        if(!checkowner) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
            throw new Error('목록에 없음');
        }
        const deleteowner = await userDao.deleteOwner(req.params.id);
        res.json({'message':'delete success!'});
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.modifyUser = async function(req, res) {
    //if(req.user.username !==) //로직처리 (1번 사용자에 대한 토큰이 1번사용자의 usermodify만 가능하게)
    const {
        Phone,born,Mileage,grade,coin,reservcnt
    } = req.body;
    try {
        console.log(req.params.id);
        const checkuser = await userDao.checkDel(req.params.id); // 유저 존재여부 체크
        if(checkuser[0].Nickname !== req.user.username) {
            res.status(404).json({
                'message':'사용자 접근권한이 없습니다'
            });
            throw new Error('접근권한 없음');
        }
        if(!checkuser) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
            throw new Error('목록에 없음');
        }
        const Userinfo = [Phone,born,Mileage,grade,coin,reservcnt];
        const modifyuser = await userDao.modifyUser(req.params.id,Userinfo);
        if(modifyuser) res.json({'message':'변경 성공!'});
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.modifyOwner = async function(req,res) {
    const {
        Phone,Nickname,passwd,born,representativename,companynum,companyaddress
    } = req.body;
    try {
        console.log(req.params.id);
        const checkowner = await userDao.checkOwner(req.params.id);
        if(checkowner[0].Nickname !== req.user.username) {
            res.status(404).json({
                'message':'사용자 접근권한이 없습니다'
            });
            throw new Error('접근권한 없음');
        }
        if(!checkowner) {
            res.status(404).json({
                'message':'사용자 목록에 없습니다'
            });
            throw new Error('목록에 없음');
        }
        const Ownerinfo = [Phone,Nickname,passwd,born,representativename,companynum,companyaddress];
        const modifyowner = await userDao.modifyOwner(req.params.id,Ownerinfo);
        if(modifyowner) res.json({'message':'변경 성공!'});
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getUserCoupon = async function(req, res) {

    try {
        const usercoupon = await userDao.getUserCoupon();
        if(usercoupon) {
            res.json(usercoupon);
        }
        else {
            res.send(404)
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getUserSpecificCoupon = async function(req, res) {

    const {
        Nickname
    } = req.body;

    console.log(req.params.id);
    console.log(req.body.Nickname);
    try {
        console.log(req.user);
        const checkQ = await userDao.checkCouponID(req.params.id); // couponID가 유효?
        if(checkQ) {
            const checkQ2 = await userDao.checkCouponNickname(Nickname); // 특정 유저에 대한 Usercoupon만 확인가능하게
            console.log(checkQ2);
            console.log(req.user.username);
            console.log(checkQ[0].Nickname);
            if(checkQ2) {
                if(req.user.username !== checkQ[0].Nickname) {
                    res.json({'message':'접근 권한이 없습니다'});
                    throw new Error('접근 권한 없음');
                }
                else {
                    res.json(checkQ2[0]);
                }
            }
            else {
                res.send({'message':'Nickname에 해당하는 쿠폰정보가 없습니다'});
                throw new Error('Nickname에 해당하는 쿠폰정보 없음');
            }
        }
        else {
            res.send({
                'message':'coupon ID가 유효하지 않습니다'
            });
            throw new Error('쿠폰 ID 에러');
        }

        //const userSpecific = await userDao.getUserSpecificCoupon(req.params.id);
        //if(userSpecific) {
        //    res.json(userSpecific);
        //}else {
        //    res.send(404);
        // }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}



exports.userinfo = async function(req, res) {

    const {
        Nickname
    } = req.body;
    console.log(req.user.username);

    try {
        const checkQuery = await userDao.userNicknameCheck(Nickname);
        console.log(checkQuery[0])
        if(checkQuery) { // 닉네임이 존재한다면
            if(req.user.username !== checkQuery[0].Nickname) {
                res.json({'message':'권한이 없습니다'});
                throw new Error('권한이 없습니다');
            }
            else {
                const aboutuser = await userDao.userinfo();
                res.json(aboutuser);
            }
        }
        else {
            res.json({'message':'접근할 수 없는 Nickname입니다'});
            throw new Error('접근 할 수 없는 Nickname입니다');
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getUserpoint = async function(req, res) {
    if(req.params.id !== '1') {
        res.json({'message':'Not found'});
        throw new Error('not found');
    }
    try {
        const checkQ = await userDao.checkDel(req.params.id);
        console.log(checkQ);
        console.log(req.user.username);

        if(req.user.username !== checkQ[0].Nickname) {
            res.json({'message':'권한이 없는 유저입니다'});
            throw new Error('권한이 없는 유저');
        }
        else {
            const aboutuserpoint = await userDao.getUserpoint(req.params.id);
            console.log(aboutuserpoint);
            res.json(aboutuserpoint);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}

exports.makeOwner = async function(req, res) {

    const {
        Phone,Nickname,passwd,born,representativename,companynum,companyaddress
    } = req.body;
    if(!passwd) {
        res.json('비밀번호는 4자 이상,8자리 미만입니다').send(202);
    }
    try {
        //const body = req.body;
        const OwnerInfo = [Phone,Nickname,passwd,born,representativename,companynum,companyaddress];
        const Mowner = await userDao.makeOwner(OwnerInfo);
        if(Mowner.length > 1) {
            res.json(Mowner); //
        } else {
            res.send(404);
        }
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.deleteSpecificCoupon = async function(req, res) {

    const {
        Nickname
    } = req.body;
    try {
        console.log(req.user);
        const checkQ = await userDao.checkCouponID(req.params.id); // couponID가 유효?
        if(checkQ) {
            const checkQ2 = await userDao.checkCouponNickname(Nickname); // 특정 닉네임에 대한 Usercoupon이 있나 확인
            console.log(checkQ2);
            console.log(req.user.username);
            console.log(checkQ[0].Nickname);
            if(checkQ2) {
                if(req.user.username !== checkQ[0].Nickname) {
                    res.json({'message':'접근 권한이 없습니다'});
                    throw new Error('접근 권한 없음');
                }
                else {
                    const checkQ3 = await userDao.deleteSpecificCoupon(req.params.id,Nickname);
                    res.json(checkQ2[0]);
                }
            }
            else {
                res.send({'message':'Nickname에 해당하는 쿠폰정보가 없습니다'});
                throw new Error('Nickname에 해당하는 쿠폰정보 없음');
            }
        }
        else {
            res.send({
                'message':'coupon ID가 유효하지 않습니다'
            });
            throw new Error('쿠폰 ID 에러');
        }
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.makeUserCoupon = async function(req, res) {
    const {
        UserID,housecoupon,leisurecoupon,overseacoupon
    } = req.body;
    try {
        const couponinfo = [UserID,housecoupon,leisurecoupon,overseacoupon];
        const res = await userDao.makeUserCoupon(couponinfo);
        console.log(res)
        if(res) res.json(res);
        else res.json(404);
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.getUsergrade = async function(req, res) { // 등급,적립률만 보여줌

    try {
        const usergrade = await userDao.getUsergrade();
        if(usergrade) {
            res.json(usergrade);
        }else {
            res.json(404);
        }
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.deleteSpecificgrade = async function(req, res) {
    const {
        grade
    } = req.body;
    try {
        const gradeinfo = [grade];
        const usergrade = await userDao.deleteSpecificgrade(gradeinfo);
        if(usergrade.length!==0) {
            res.json(usergrade);
        }else {
            res.send(404);
        }
    } catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
exports.makeUsergrade = async function(req, res) {
    const {
        grade,Accumulationrate
    } = req.body;
    try {
        const gradeinfo = [grade,Accumulationrate];
        const res = await userDao.makeUsergrade(gradeinfo);
        console.log(res)
        res.json(res);
    }catch (err) {
        logger.error(`App - usercheck Query error\n: ${JSON.stringify(err)}`);
        res.sendStatus(500)
    }
}
/**
 update : 2020.10.4
 01.signUp API = 회원가입
 */
/*
exports.signUp = async function (req, res) {
    const {
        email, password, nickname
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    if (password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 305,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!nickname) return res.json({isSuccess: false, code: 306, message: "닉네임을 입력 해주세요."});
    if (nickname.length > 20) return res.json({
        isSuccess: false,
        code: 307,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
    try {
        // 이메일 중복 확인
        const emailRows = await userDao.userEmailCheck(email);
        if (emailRows.length > 0) {

            return res.json({
                isSuccess: false,
                code: 308,
                message: "중복된 이메일입니다."
            });
        }

        // 닉네임 중복 확인
        const nicknameRows = await userDao.userNicknameCheck(nickname);
        if (nicknameRows.length > 0) {
            return res.json({
                isSuccess: false,
                code: 309,
                message: "중복된 닉네임입니다."
            });
        }

        // TRANSACTION : advanced
        // await connection.beginTransaction(); // START TRANSACTION
        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
        const insertUserInfoParams = [email, hashedPassword, nickname];

        const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

        //  await connection.commit(); // COMMIT
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원가입 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};*/
exports.signUp = async function (req, res) {     // 유저 회원가입
    const {
        Nickname,passwd
    } = req.body;
    console.log('Signup:',req.body.Nickname);

    if (!Nickname) return res.json({isSuccess: false, code: 301, message: "닉네임을 입력해주세요."});
    if (Nickname.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "닉네임은 30자리 미만으로 입력해주세요."
    });
    if (!passwd) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    if (passwd.length <3 || passwd.length > 20) {
        return res.json({isSuccess: false, code: 304, message: "비밀번호 길이 4 ~ 19글자로 입력하세요"})
    }
    if (!Nickname) return res.json({isSuccess: false, code: 306, message: "닉네임을 입력 해주세요."});
    if (Nickname.length > 20) return res.json({
        isSuccess: false,
        code: 307,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
    try {
        // 닉네임 중복 확인
        const nicknameRows = await userDao.userNicknameCheck(Nickname);
        if (nicknameRows.length > 0) {
            return res.json({
                isSuccess: false,
                code: 309,
                message: "중복된 닉네임입니다."
            });
        }
        
        const hashedPassword = await crypto.createHash('sha512').update(passwd).digest('hex');
        console.log('hashedPass',hashedPassword);
        const insertUserInfoParams = [Nickname,hashedPassword];
        const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);
        
        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원가입 성공"
            
        });
    } catch (err) {
        
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};
exports.signIn = async function (req, res) {       // 로그인
    const {
        Nickname,passwd
    } = req.body;
    if (!Nickname) return res.json({isSuccess: false, code: 301, message: "닉네임을 입력해주세요."});
    if (Nickname.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "닉네임은 30자리 미만으로 입력해주세요."
    });
    //if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});
    if (!passwd) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    try {
        const [userInfoRows] = await userDao.selectUserInfo(Nickname);
        if (userInfoRows.length < 0) {
            // connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "닉네임을 확인해주세요."
            });

        }
        // 해쉬된 패스워드 확인하는 로직
        const hashedPassword = await crypto.createHash('sha512').update(passwd).digest('hex');
        if (userInfoRows[0].passwd !== hashedPassword) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 311,
                message: "비밀번호를 확인해주세요."
            });
        }


        //if (userInfoRows[0].status === "INACTIVE") {
        //    connection.release();
        //    return res.json({
        //        isSuccess: false,
        //        code: 312,
        //        message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
        //    });
        // }
        //else if (userInfoRows[0].status === "DELETED") {
        //    connection.release();
        //    return res.json({
        //        isSuccess: false,
        //        code: 313,
        //        message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
        //    });
        // }
        //토큰 생성
        let token = await jwt.sign({
                username: userInfoRows[0].Nickname,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀 키
            {
                expiresIn: '365d'
                //subject: 'User',
            } // 유효 시간은 365일
        );
        console.log('User token:',token);
        res.json({
            User: userInfoRows[0],
            token: token,
            isSuccess: true,
            code: 200,
            message: "로그인 성공"
        });
        console.log('Login Success!');
        //connection.release();
    } catch (err) {
        logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return false;
    }
};
exports.OwnersignUp = async function (req, res) {     // 유저 회원가입
    const {
        Nickname,passwd
    } = req.body;
    console.log('Signup:',req.body.Nickname);

    if (!Nickname) return res.json({isSuccess: false, code: 301, message: "닉네임을 입력해주세요."});
    if (Nickname.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "닉네임은 30자리 미만으로 입력해주세요."
    });
    if (!passwd) return res.json({ isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    if (passwd.length <3 || passwd.length > 20) {
        return res.json({isSuccess: false, code: 304, message: "비밀번호 길이 4 ~ 19글자로 입력하세요"})
    }
    if (!Nickname) return res.json({isSuccess: false, code: 306, message: "닉네임을 입력 해주세요."});
    if (Nickname.length > 20) return res.json({
        isSuccess: false,
        code: 307,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });
    try {
        // 닉네임 중복 확인
        const nicknameRows = await userDao.ownerNicknameCheck(Nickname);
        if (nicknameRows.length > 0) {
            return res.json({
                isSuccess: false,
                code: 309,
                message: "중복된 닉네임입니다."
            });
        }
        //const token = jwt.sign({
        //    username:req.body.Nickname
        //}, secret_config.jwtsecret, {expiresIn : '1h'});

        // await connection.beginTransaction(); // START TRANSACTION
        const hashedPassword = await crypto.createHash('sha512').update(passwd).digest('hex');
        console.log('hashedPass',hashedPassword);
        const insertOwnerInfoParams = [Nickname,hashedPassword];
        const insertOwnerRows = await userDao.insertOwnerInfo(insertOwnerInfoParams);
        //  await connection.commit(); // COMMIT
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원가입 성공"
            // token:token
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
        logger.error(`App - SignUp Query error\n: ${err.message}`);
        return res.status(500).send(`Error: ${err.message}`);
    }
};
exports.OwnersignIn = async function (req, res) {       // 로그인
    const {
        Nickname,passwd
    } = req.body;
    if (!Nickname) return res.json({isSuccess: false, code: 301, message: "닉네임을 입력해주세요."});
    if (Nickname.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "닉네임은 30자리 미만으로 입력해주세요."
    });
    //if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});
    if (!passwd) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    try {
        const [ownerInfoRows] = await userDao.selectOwnerInfo(Nickname);
        if (ownerInfoRows.length < 0) {
            // connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "닉네임을 확인해주세요."
            });

        }
        // 해쉬된 패스워드 확인하는 로직
        const hashedPassword = await crypto.createHash('sha512').update(passwd).digest('hex');
        if (ownerInfoRows[0].passwd !== hashedPassword) {
            //connection.release();
            return res.json({
                isSuccess: false,
                code: 311,
                message: "비밀번호를 확인해주세요."
            });
        }
        //토큰 생성
        let token = await jwt.sign({
                ownername: ownerInfoRows[0].Nickname,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀 키
            {
                expiresIn: '365d'
                //subject: 'User',
            } // 유효 시간은 365일
        );
        console.log('Owner token:',token);
        res.json({
            Owner: ownerInfoRows[0],
            token: token,
            isSuccess: true,
            code: 200,
            message: "로그인 성공"
        });
        console.log('Login Success!');
        //connection.release();
    } catch (err) {
        logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
        //connection.release();
        return false;
    }
};
/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
/*
exports.signIn = async function (req, res) {
    const {
        email, password
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
    try {
        const [userInfoRows] = await userDao.selectUserInfo(email)

        if (userInfoRows.length < 1) {
            connection.release();
            return res.json({
                isSuccess: false,
                code: 310,
                message: "아이디를 확인해주세요."
            });
        }

        const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
        if (userInfoRows[0].pswd !== hashedPassword) {
            connection.release();
            return res.json({
                isSuccess: false,
                code: 311,
                message: "비밀번호를 확인해주세요."
            });
        }
        if (userInfoRows[0].status === "INACTIVE") {
            connection.release();
            return res.json({
                isSuccess: false,
                code: 312,
                message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
            });
        } else if (userInfoRows[0].status === "DELETED") {
            connection.release();
            return res.json({
                isSuccess: false,
                code: 313,
                message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
            });
        }
        //토큰 생성
        let token = await jwt.sign({
                id: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀 키
            {
                expiresIn: '365d',
                subject: 'userInfo',
            } // 유효 시간은 365일
        );

        res.json({
            userInfo: userInfoRows[0],
            jwt: token,
            isSuccess: true,
            code: 200,
            message: "로그인 성공"
        });

        connection.release();
    } catch (err) {
        logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
        connection.release();
        return false;
    }
};
*/
/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};