/**
 * Created by shalin on 11/21/2016.
 */
var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
 var config = require('./config.js');*/
var User = require('../model/user');
var mongoose = require('mongoose');
var ssn = require('ssn');

exports.updatePassword = function (msg, callback) {
    var opass = msg.old_password;
    var npass = msg.new_password;
    var username = msg.email;
    console.log(opass, npass);
    User.findOne({email : username}, function (err, result) {
        if (err) {

            console.log("err in find");
            callback(err,null);

        }

        if (!result) {
            callback(null, null);
        }
        if (result) {
            console.log(result);
            if (bcrypt.compareSync(opass, result.password)) {
            //if(opass===result.password){
                var salt = bcrypt.genSaltSync(10);
                var passwordToSave = bcrypt.hashSync(npass, salt);
                User.update({email:username},{$set:{password:passwordToSave}},function (err,user) {
                    if (err) {
                        callback(err,null);
                    }
                    else if(user){
                        var res = {};
                        console.log("updateProfile queue");
                        res.code = 200;
                        callback(null,res);
                    }
                });
            } else {
                callback(null, null);
            }
        }

    });
};

exports.updatePaymentMethod = function (msg, callback) {
    var cvv = msg.cvv;
    var cnos = Number(msg.cno);
    var edate = Number(msg.expm + msg.expy);
    var username = msg.email;
    console.log(username);
    console.log(cvv, cnos, edate);
    User.update({email : username},{$set: {cardNumber:cnos, cvv:cvv, expDate:edate}}, function (err, result) {
        if (err) {
            console.log("err in update");
            callback(err,null);
        }
        if (!result) {
            callback(null, null);
        }
        if (result) {
            var res = {};
            console.log("updateProfile queue");
            res.code = 200;
            callback(null, res);
        }

    });
};