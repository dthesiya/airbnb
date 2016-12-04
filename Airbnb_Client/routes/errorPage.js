/**
 * Created by Divya Patel on 12/3/2016.
 */

var ejs = require('ejs');
exports.handleError = function (req,res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn,
        "firstname": sess.firstName,
        "profileImg": req.session.profileImg
    };
    ejs.renderFile('../views/errorPage.ejs', user_data, function (err, result) {
        res.end(result);
    });



};