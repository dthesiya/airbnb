/**
 * Created by vicky on 11/20/2016.
 */



var ejs = require("ejs");

exports.homepg = function(req,res){

    var sess = req.session;
    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn,
        "firstname" : sess.firstName,
        "profileImg": req.session.profileImg
    };
    ejs.renderFile('../views/homewithoutlogin.ejs', user_data,function (err,result) {
        if(err){

        } else {

        }

        res.end(result);
    });

};