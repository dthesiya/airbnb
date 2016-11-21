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
var ssn = require('ssn');
exports.doLogin=function(msg, callback) {


    var username = msg.username;
    var password = msg.password;
    console.log("USERNAME: "+username+" PASSWORD: "+password);

    User.find({}, function (err, result) {
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

exports.registerUser = function (msg,callback) {


        var firstName=msg.firstName;
        var lastName=msg.lastName;
        var email=msg.email;
        var password=msg.password;


        console.log('In register user');
        var salt = bcrypt.genSaltSync(10);
        var passwordToSave = bcrypt.hashSync(password, salt);

        var userDetails = new User();

        userDetails.firstName=firstName;
        userDetails.lastName = lastName;
        userDetails.email=email;
        userDetails.password=passwordToSave;
        userDetails.userId = ssn.generate();

    console.log("SSN"+userDetails.userId);



        userDetails.save(function (err) {

            if(err){

                callback(err,null);
            }
            else{


                var id= userDetails._id;
                console.log("ID "+id);
                User.findOne({_id:id}, function (err, result) {
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
                        callback(null, result);

                    }

                });



            }


        });


};