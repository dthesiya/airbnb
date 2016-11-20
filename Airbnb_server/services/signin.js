/**
 * Created by Divya Patel on 11/19/2016.
 */

/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
var config = require('./config.js');*/
var User = require('../model/user');
var mongoose = require('mongoose');

exports.doLogin=function(msg, callback) {


    var username = msg.username;
    var password = msg.password;
    console.log("USERNAME: "+username+" PASSWORD: "+password);

    User.find({email : username}, function (err, result) {
        console.log(result);
        console.log(err);
        if (err) {

            console.log("err in find");
            callback(err,null);

        }

        if (!result) {
            callback(null, null);
        }
        if (result) {
            console.log(result);
            //if (bcrypt.compareSync(password, result.password)) {
          if(password===result[0].password){
                callback(null, result);

            } else {
                callback(null, null);
            }
        }

    });
};
