const { pool } = require("../../../config/database");

//사용자 목록 전체 조회
async function getUser() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUserQuery = 'SELECT * FROM User';
    const [rows] = (await connection.query(selectUserQuery));
    await connection.commit();
    return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
//특정 사용자 목록 조회
async function getUserid(id) { //내가만듬
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUserQuery = 'SELECT * FROM User WHERE UserID = ?';

    const [rows] = (await connection.query(selectUserQuery, [id]))
    //const rows = (await connection.query(selectUserQuery, [id]))[0] 도 가능
    await connection.commit();
    return rows[0];
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release()
  }
  //const selectUserParams = []
}
//모텔 주인 목록 전체 조회
async function getOwner() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUserQuery = 'SELECT * FROM Owner';
    const [rows] = (await connection.query(selectUserQuery));
    await connection.commit();
    return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
//특정 모텔 주인 조회
/*
async function getOwnerid(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectOwnerQuery = 'SELECT * FROM Owner WHERE OwnerID = ?';
    const [rows] = (await connection.query(selectOwnerQuery, [id]));
    await connection.commit();
    return rows[0];
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release()
  }
}*/
//새로운 사용자 생성
async function makeUser(insertUserinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectUserQuery = '' +
        'INSERT INTO User(Phone,Nickname,passwd,born,Mileage,grade,coin,reservcnt) VALUE(?);';
    const Insertv = [insertUserinfo];
    const [rows] = await connection.query(selectUserQuery,Insertv);
    const resultQuery = 'SELECT * FROM User WHERE Phone=?';
    const [result] = await connection.query(resultQuery,insertUserinfo[0]);
    await connection.commit();
    return result;
    //return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function checkDel(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkUserQuery = 'SELECT * FROM User WHERE UserID = ?';
    const [result] = await connection.query(checkUserQuery, [id]);
    await connection.commit();
    return result;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function checkOwner(id) {
  const connection = await pool.getConnection();
  try{
    await connection.beginTransaction();
    const checkOwnerQuery = 'SELECT * FROM Owner WHERE OwnerID =?';
    const [result] = await connection.query(checkOwnerQuery, [id]);
    await connection.commit();
    return result;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
//특정 사용자 제거
async function deleteUser(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const deleteUserQuery = 'DELETE FROM User WHERE UserID = ?';
    const [rows] = await connection.query(deleteUserQuery,[id]);
    await connection.commit();
    return rows;
    //return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteOwner(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const deleteOwnerQuery = 'DELETE FROM Owner WHERE OwnerID = ?';
    const [rows] = await connection.query(deleteOwnerQuery,[id]);
    await connection.commit();
    return rows;

  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
//특정 사용자 정보 수정
async function modifyUser(id,Userinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const modifyUserQuery = `UPDATE User SET Phone=?,born=?,Mileage=?,grade=?,
                              coin=?,reservcnt=? WHERE UserID=?`;
    //const exa = [Userinfo, id];
   // console.log(Userinfo[0],Userinfo[1],Userinfo[2],Userinfo[3],Userinfo[4],Userinfo[5],Userinfo[6],id);
    const [rows] = await connection.query(modifyUserQuery,[Userinfo[0],Userinfo[1],Userinfo[2],Userinfo[3],Userinfo[4],Userinfo[5],id]);
    const checkUserQuery = 'SELECT * FROM User WHERE UserID=?';
    const [result] = await connection.query(checkUserQuery,[id]);
    await connection.commit();
    return result;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function modifyOwner(id,ownerinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const modifyOwnerQuery = `UPDATE Owner SET Phone=?, Nickname=?,passwd=?,born=?,representativename=?,
                         companynum=?, companyaddress=? WHERE OwnerID=?`

    const [rows] = await connection.query(modifyOwnerQuery, [ownerinfo[0],ownerinfo[1],ownerinfo[2],
      ownerinfo[3],ownerinfo[4],ownerinfo[5],ownerinfo[6],id]);
    const checkOwnerQuery = 'SELECT * FROM Owner WHERE OwnerID=?';
    const [result] = await connection.query(checkOwnerQuery,[id]);
    await connection.commit();
    return result;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotel() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelQuery =
        "SELECT Areaname as 지역, SpecificAreaname as 상세지역, title as 모텔이름, location as 모텔위치, backgroundURL as 배경이미지, star as 별점, commentcnt as 후기개수 FROM eachmotel \n" +
        "INNER JOIN Reservationdesignation ON eachmotel.ReservationdesignationID=Reservationdesignation.ReservationdesignationID\n" +
        "INNER JOIN MotelSpecify ON Reservationdesignation.MotelSpecifyID = MotelSpecify.MotelSpecifyID\n" +
        "INNER JOIN SpecificArea ON MotelSpecify.SpecificAreaID = SpecificArea.SpecificAreaID\n" +
        "INNER JOIN Area ON SpecificArea.AreaID = Area.AreaID\n" +
        "WHERE Area.AreaID=1;";
    const [rows] = await connection.query(motelQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelspecific() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelspecificQuery =
        "SELECT \n" +
        "\tpricetype as 유형, \n" +
        "\toptionalprice as 가격, \n" +
        "\ttypetext as 시간\n" +
        "\tFROM eachprice \n" +
        "\tINNER JOIN eachmotel ON eachmotel.title=eachprice.title AND eachmotel.eachmotelID = eachprice.eachmotelID;";
    const [rows] = await connection.query(motelspecificQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelmorespecific() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelmorespecificQuery =
        "select title as 모텔이름, star as 별점, commentcnt as 후기개수, backgroundURL as 모텔사진, specialpoint as 참고사항, (Owner.Phone) as 모텔전번,\n" +
        "Deluxesleep as Deluxe숙박, Deluxeborrow as Deluxe대실,Premiumsleep as Premium숙박,Premiumborrow as Premium대실,\n" +
        "Suitesleep as Suite숙박, Suiteborrow as Suite대실, Royalsuitesleep as Royalsuite숙박, Royalsuiteborrow as Roytalsuite대실,\n" +
        "commoncomment as 공통사항, case when replycnt >= 200 then concat('200','+') end as 숙소답변 from eachmotel\n" +
        "INNER JOIN Reservationdesignation ON Reservationdesignation.ReservationdesignationID = eachmotel.ReservationdesignationID\n" +
        "INNER JOIN MotelSpecify ON MotelSpecify.MotelSpecifyID = Reservationdesignation.MotelSpecifyID\n" +
        "INNER JOIN TotalMotel ON MotelSpecify.TotalMotelID = TotalMotel.TotalMotelID\n" +
        "INNER JOIN Owner ON TotalMotel.OwnerID = Owner.OwnerID\n" +
        "INNER JOIN curlinunroomtype ON curlinunroomtype.eachmotelID = eachmotel.eachmotelID\n" +
        "where title='역삼 컬리넌' and eachmotel.eachmotelID=1;";

    const [rows] = (await connection.query(motelmorespecificQuery));
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelroom() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelroomQuery =
        "SELECT Deluxeborrow as Deluxe대실, Premiumborrow as Premium대실, Suiteborrow as Suite대실, Royalsuiteborrow as Royalsuite대실,\n" +
        "(Specificborrowprice.usehours) as 대실사용시간, (Specificborrowprice.endtime) as 대실기한, Deluxesleep as Deluxe숙박, Premiumsleep as Premium숙박, Suitesleep as Suite숙박, Royalsuitesleep as Royalsuite숙박,\n" +
        "(Specificsleepprice.usehours) as 숙박체크인, (Specificsleepprice.endtime) as 숙박기한, Specificborrowprice.usertype as 유저, Specificborrowprice.daytype as 날짜\n" +
        "FROM Specificborrowprice INNER JOIN Specificsleepprice ON Specificborrowprice.curlinunroomtypeID = Specificsleepprice.curlinunroomtypeID\n" +
        "WHERE Specificborrowprice.SpecificborrowpriceID = Specificsleepprice.SpecificsleeppriceID;";
    const [rows] = await connection.query(motelroomQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelowner() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelownerQuery =
        "SELECT title as 상호명, (eachmotel.motelintro) as 숙소소개, (eachmotel.facilities) as 편의시설, (eachmotel.service) as 이용안내, (eachmotel.introduce) as 기본규정,\n" +
        "representativename as 대표자명, (Owner.companyaddress) as 사업자주소, Phone as 연락처, companynum as 사업자등록번호 FROM eachmotel INNER JOIN Reservationdesignation\n" +
        "ON Reservationdesignation.ReservationdesignationID=eachmotel.ReservationdesignationID INNER JOIN MotelSpecify ON MotelSpecify.MotelSpecifyID = Reservationdesignation.MotelSpecifyID\n" +
        "INNER JOIN TotalMotel ON MotelSpecify.TotalMotelID=TotalMotel.TotalMotelID INNER JOIN Owner ON TotalMotel.OwnerID = Owner.OwnerID\n" +
        "WHERE eachmotel.eachmotelID=1 and TotalMotel.TotalMotelID=4 and Reservationdesignation.MotelSpecifyID=1;";
    const [rows] = await connection.query(motelownerQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelreview() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelreviewQuery =
        `select
(User.UserID) as 고객,
(ReservationReview.context) as 후기내용,
        (ReservationReview.roomtype) as 방유형,
        (ReservationReview.star) as 별점,
case when timestampdiff(hour,ReservationReview.createdAt,current_timestamp()) < 24
        then concat(timestampdiff(hour,ReservationReview.createdAt, current_timestamp()),'시간 전' )
        else concat(timestampdiff(day,ReservationReview.createdAt, current_timestamp()),'일 전')
        end as 고객리뷰시간
from ReservationReview
INNER JOIN Reviewcomment ON ReservationReview.ReviewcommentID = Reviewcomment.ReviewcommentID
INNER JOIN User ON ReservationReview.UserID = User.UserID
INNER JOIN Reservationlist ON Reservationlist.Reservationnum = ReservationReview.Reservationnum
INNER JOIN eachmotel ON eachmotel.ReservationdesignationID = Reservationlist.ReservationdesignationID
where User.UserID=1;`

    const [rows] = await connection.query(motelreviewQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getMotelreply() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const motelreply =
        "select replycontext as 숙소답변 , case when timestampdiff(hour, Reviewcomment.createdAt, current_timestamp()) < 24\n" +
        "then concat(timestampdiff(hour,Reviewcomment.createdAt, current_timestamp()),'시간 전' )\n" +
        "else concat(timestampdiff(day,Reviewcomment.createdAt, current_timestamp()),'일 전')\n" +
        "end as 숙소답변시간 from Reviewcomment INNER JOIN ReservationReview ON Reviewcomment.ReservationReviewID = ReservationReview.ReservationReviewID\n" +
        "where ReservationReview.ReviewcommentID = Reviewcomment.ReviewcommentID and ReservationReview.Reservationnum=1\n";
    const [rows] = await connection.query(motelreply);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function userinfo() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const aboutuserinfo =
        "select Usercoupon.UserID as 유저이름, (User.Mileage) as 포인트, (User.coin) as 야놀자코인, (housecoupon+leisurecoupon+overseacoupon)as 쿠폰함, \n" +
        "(ReservationReview.context) as 나의후기, (User.reservcnt) as 국내숙소구매내역 from Usercoupon\n" +
        "INNER JOIN User ON User.UserID = Usercoupon.UserID INNER JOIN ReservationReview ON ReservationReview.UserID = User.UserID WHERE User.UserID=1";
    const [rows] = await connection.query(aboutuserinfo);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getUserpoint(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
      const getUserpointQuery =
          "select  case when Mileage >10 then concat('사용 가능한 포인트 :',Mileage,'p ', ',',' 15일내,소멸예정포인트 : ',(Pointexpire.15th),'p')\n" +
          "else concat(Mileage,'p') end as 포인트 from User INNER JOIN Pointexpire ON Pointexpire.UserID = User.UserID where User.UserID=?";
      const [rows] = (await connection.query(getUserpointQuery, [id]));
    await connection.commit();
      return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getOwnerid(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectOwnerQuery = 'SELECT * FROM Owner WHERE OwnerID = ?';
    const [rows] = (await connection.query(selectOwnerQuery, [id]));
    if(!rows) {
      return false;
    }
    await connection.commit();
    return rows[0];
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release()
  }
}
async function getReservation() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getreservationQuery = 'SELECT * FROM Reservationlist';
    const [rows] = await connection.query(getreservationQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getSpecificReservation(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const d = 'SELECT * FROM Reservationlist WHERE Reservationnum = ?';
    const [rows] = await connection.query(d, [id]);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function Area(Areainfo) {
  //connection.query 에 넣어줌
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const q = 'INSERT INTO Area(AreaID,Areaname) VALUES (?)';
    const [rows] = await connection.query(q, [Areainfo]);
    const e = 'SELECT * FROM Area';
    const [result] = await connection.query(e);
    await connection.commit();
    return result;

  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function Areamodify(id, Areainfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const modifyarea = 'UPDATE Area SET Areaname=? WHERE AreaID =?';
    const [rows] = await connection.query(modifyarea, [Areainfo,id]);
    const checkQuery = 'SELECT * FROM Area';
    const [result] = await connection.query(checkQuery);
    await connection.commit();
    return result[0];
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }
  finally {
    connection.release();
  }
}
async function getArea() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const areaQuery = 'SELECT * FROM Area';
    const [rows] = await connection.query(areaQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  } finally {
    connection.release();
  }
}
async function deleteArea(id) {

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const deleteAreaQuery = 'DELETE FROM Area WHERE AreaID = ?';
    const [rows] = await connection.query(deleteAreaQuery,[id]);
    if(!rows.length) {
      throw new Error('no instance');
    }
    const checkAreaQuery = 'SELECT * FROM Area';
    const [result] = await connection.query(checkAreaQuery);
    await connection.commit();
    return result;
    //return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}

async function makeOwner(insertOwnerinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const selectOwnerQuery = '' +
        'INSERT INTO Owner(Phone,Nickname,passwd,born,representativename,companynum,companyaddress) VALUE(?);';
    const Insertv = [insertOwnerinfo];
    const [rows] = await connection.query(selectOwnerQuery,Insertv);
    //
    const resultQuery = 'SELECT * FROM Owner';
    const [result] = await connection.query(resultQuery);
    await connection.commit();
    return result;
    //return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getRoomkind() {
  const connection = await pool.getConnection();
  const selectQuery = 'SELECT * FROM Roomkind';
  const [rows] = await connection.query(selectQuery);
  return rows;
  try {
    await connection.beginTransaction();
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteRoomkind(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const deleteRoomQuery = 'DELETE FROM Roomkind WHERE RoomkindID = ?';
    const [rows] = await connection.query(deleteRoomQuery,[id]);
    if(!rows.length) {
      throw new Error('no instance');
    }
    const checkRoomQuery = 'SELECT * FROM Roomkind';
    const [result] = await connection.query(checkRoomQuery);
    await connection.commit();
    return result;
    //return rows;
  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function modifyMotel(id, eachmotelinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const modifymotelQuery = 'UPDATE eachmotel SET service=? WHERE eachmotelID=(?)';
    const [rows] = await connection.query(modifymotelQuery, [eachmotelinfo,id]);
    if(rows.length) {
      throw new Error('no instance');
    }
     const checkQuery = 'SELECT * FROM eachmotel';
     const [result] = await connection.query(checkQuery);
     await connection.commit();
     return result;

  } catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }
  finally {
    connection.release();
  }
}

async function getUserCoupon() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getusercouponQuery = 'SELECT * FROM Usercoupon';
    const [rows] = await connection.query(getusercouponQuery);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function checkCouponID(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkQuery = 'SELECT * FROM Usercoupon WHERE UsercouponID=?';
    const [rows] = await connection.query(checkQuery, id);
    if(rows[0] === undefined) {
      throw new Error('no instance')
      return false;
    }

    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function checkCouponNickname(Nickname) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const checkQuery = 'SELECT * FROM Usercoupon WHERE Nickname=?';
    const [rows] = await connection.query(checkQuery, Nickname);
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getUserSpecificCoupon(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getuserSpecificQuery = 'SELECT * FROM Usercoupon WHERE UsercouponID=?';
    const [rows] = await connection.query(getuserSpecificQuery, id);
    if(rows.length===0) {
      throw new Error('no instance');
    }
    //console.log(rows);
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteSpecificCoupon(id, Nickname) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const getuserSpecificQuery = 'DELETE FROM Usercoupon WHERE UsercouponID=? and Nickname=?';
    const [rows] = await connection.query(getuserSpecificQuery, [id,Nickname]);
    console.log(rows);
    await connection.commit();
    return results;

  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function makeUserCoupon(couponinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const couponQuery = 'INSERT INTO Usercoupon(UserID,housecoupon,leisurecoupon,overseacoupon) VALUES(?)';
    const [rows] = await connection.query(couponQuery,[couponinfo]);

    const checkQuery = 'SELECT * FROM Usercoupon';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getUsergrade() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const gradeQuery = 'SELECT * FROM Usergrade';
    const [rows] = await connection.query(gradeQuery);
    if(!rows) {
      throw new Error('no instance');
    }
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteSpecificgrade(gradeinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const firstQuery = 'SELECT * FROM Usergrade WHERE grade=?';
    const [firsts] = await connection.query(firstQuery,gradeinfo[0]);
    if(firsts.length === 0) {
      throw new Error('no instance');
    }
    const gradeSpecificQuery = 'DELETE FROM Usergrade WHERE grade=?';
    const [rows] = await connection.query(gradeSpecificQuery, gradeinfo[0]);
    console.log(rows);
    const checkQuery = 'SELECT * FROM Usergrade';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;

  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function makeUsergrade(gradeinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const gradeQuery = 'INSERT INTO Usergrade(grade,Accumulationrate) VALUES(?)';
    const [rows] = await connection.query(gradeQuery,[gradeinfo]);

    const checkQuery = 'SELECT * FROM Usergrade';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function makeMotelreply(replyinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const commentQuery = 'INSERT INTO Reviewcomment(ReservationReviewID,OwnerID,replycontext,createdAt,UserID) VALUES(?)';
    const [rows] = await connection.query(commentQuery,[replyinfo]);

    const checkQuery = 'SELECT * FROM Reviewcomment';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteMotelreply(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const replyQuery = 'DELETE FROM Reviewcomment WHERE ReviewcommentID=?';
    const [rows] = await connection.query(replyQuery, id);
    console.log(rows);
    const checkQuery = 'SELECT * FROM Reviewcomment';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function makeMotelreview(reviewinfo) {

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const reviewQuery = 'INSERT INTO ReservationReview(Reservationnum,UserID,context,star,ReviewcommentID,createdAt,OwnerID,roomtype) VALUES(?)';
    const [rows] = await connection.query(reviewQuery,[reviewinfo]);
//[reviewinfo[0], reviewinfo[1], reviewinfo[2],reviewinfo[3],
//     reviewinfo[4],reviewinfo[5],reviewinfo[6],reviewinfo[7]]
    const checkQuery = 'SELECT * FROM ReservationReview';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function deleteMotelreview(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const reviewQuery = 'DELETE FROM ReservationReview WHERE ReservationReviewID=?';
    const [rows] = await connection.query(reviewQuery, id);
    await connection.commit();
    return rows;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function makeReservation(reservinfo) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const reservQuery = 'INSERT INTO Reservationlist(Reservationnum,datew,stay,UserID,ReservationdesignationID) VALUES(?)';
    const [rows] = await connection.query(reservQuery,[reservinfo]);

    const checkQuery = 'SELECT * FROM Reservationlist';
    const [results] = await connection.query(checkQuery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
async function getLogin() {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const userquery = 'SELECT * FROM User';
    const [results] = await connection.query(userquery);
    await connection.commit();
    return results;
  }catch(err) {
    await connection.rollback();
    connection.release();
    console.log('Query error');
    return false;
  }finally {
    connection.release();
  }
}
/*



try {
    const modifyUserQuery = 'UPDATE User SET Nickname = ? WHERE UserID = ?';
    const [rows] = await connection.query(modifyUserQuery,[Userinfo,id]);
    const checkUserQuery = 'SELECT * FROM User';
    const [result] = await connection.query(checkUserQuery);
    return result;
  }finally {
    connection.release();
  }
*/
// Signup
async function userEmailCheck(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const selectEmailParams = [email];
  const [emailRows] = await connection.query(
    selectEmailQuery,
    selectEmailParams
  );
  connection.release();

  return emailRows;
}
// 유저 닉네임 중복 체크
async function userNicknameCheck(Nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT Nickname 
                FROM User        
                WHERE Nickname = ?;
                `;  //Userinfo
  //const selectNicknameParams = [Nickname];
  const [NicknameRows] = await connection.query(
      selectNicknameQuery,
      Nickname //selectNicknameParams
  );
  connection.release();
  return NicknameRows;
}
//Owner 닉네임 중복 체크
async function ownerNicknameCheck(Nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT Nickname 
                FROM Owner        
                WHERE Nickname = ?;
                `;  //Userinfo
  //const selectNicknameParams = [Nickname];
  const [NicknameRows] = await connection.query(
      selectNicknameQuery,
      Nickname //selectNicknameParams
  );
  connection.release();
  return NicknameRows;
}
// 유저 정보 입력
async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoQuery = `
        INSERT INTO User(Nickname,passwd)
        VALUES (?,?);
    `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );
  connection.release();
  return insertUserInfoRow;
}
// Owner 정보 입력
async function insertOwnerInfo(insertOwnerInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertOwnerInfoQuery = `
        INSERT INTO Owner(Nickname,passwd)
        VALUES (?,?);
    `;
  const insertOwnerInfoRow = await connection.query(
      insertOwnerInfoQuery,
      insertOwnerInfoParams
  );
  connection.release();
  return insertOwnerInfoRow;
}

//SignIn
async function selectUserInfo(Nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT Nickname,passwd 
                FROM User 
                WHERE Nickname = ?;
                `;

  let selectUserInfoParams = [Nickname];
  const [userInfoRows] = await connection.query(
      selectUserInfoQuery,
      selectUserInfoParams
  );
  return [userInfoRows];
}
async function selectOwnerInfo(Nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectOwnerInfoQuery = `
                SELECT Nickname,passwd 
                FROM Owner 
                WHERE Nickname = ?;
                `;

  let selectOwnerInfoParams = [Nickname];
  const [ownerInfoRows] = await connection.query(
      selectOwnerInfoQuery,
      selectOwnerInfoParams
  );
  return [ownerInfoRows];
}
/*
async function selectUserInfo(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT id, email , pswd, nickname, status
                FROM UserInfo
                WHERE email = ?;
                `;

  let selectUserInfoParams = [email];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  return [userInfoRows];
}
*/

module.exports = {
  userEmailCheck,
  userNicknameCheck,
  insertUserInfo,
  selectUserInfo,
  getUser, //내가만듬
  getUserid,
  getOwnerid,
  getOwner,
  makeUser,
  deleteUser,
  modifyUser,
  getMotel, // 한방쿼리 1번
  getMotelspecific, //한방쿼리 2번
  getMotelmorespecific, //한방쿼리 3번
  getMotelroom, //한방쿼리 4번
  getMotelowner, //한방쿼리 5번
  getMotelreview, //한방쿼리 6번
  getMotelreply, //한방쿼리 7번
  userinfo, //한방쿼리 8번
  getUserpoint, //한방쿼리 9번
  getReservation,
  getSpecificReservation,
  Area,
  Areamodify,
  getArea,
  deleteArea,
  deleteOwner,
  makeOwner,
  getRoomkind,
  deleteRoomkind,
  modifyMotel,
  modifyOwner,
  getUserCoupon,
  getUserSpecificCoupon,
  deleteSpecificCoupon,
  makeUserCoupon,
  getUsergrade,
  deleteSpecificgrade,
  makeUsergrade,
  makeMotelreply,
  deleteMotelreply,
  makeMotelreview,
  deleteMotelreview,
  makeReservation,
  checkDel,
  checkCouponID,
  checkCouponNickname,
  ownerNicknameCheck,
  insertOwnerInfo,
  selectOwnerInfo,
  checkOwner,
  getLogin,
};
