var express = require('express');
var mq_client = require("../rpc/client.js");
var ejs = require("ejs");
var winston = require('winston');
var redis = require('./redisConnect');


exports.userProfile = function (req, res) {

    console.log("user ssn--------------------" + req.session.userSSN);
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName,
        "userSSN": req.session.userSSN,
        "profileImg": req.session.profileImg
    };
    ejs.renderFile('../views/user_profile.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.getUserProfile = function (request, response) {
    winston.info('Get User Profile request', {'user': request.session.firstName, 'url_clicked': '/getUserProfile'});
    var userId = request.params.userId;
    var msg_payload =
    {
        userId: userId
    };

    /*var client = redis.getClient();

     if(client.hget("users",userId,function (err, reply) {
     if(err){
     console.log("error in redis cache: "+ err);
     }else if(reply == null){
     console.log("property not in redis cache");
     mq_client.make_request('getUserProfile_queue', msg_payload, function (err, result) {
     if (err) {
     console.log(err);
     } else {
     client.hmset("users",userId, JSON.stringify(result),redis.print);
     response.send({user: result});
     }
     });
     }else if(reply){
     console.log(reply);
     // var json_responses = {"statusCode": 200, "data": result};
     response.send({user: reply});
     }
     })
     );*/

    mq_client.make_request('getUserProfile_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            response.send({user: result});
        }
    });

};

exports.deleteUser = function (request, response) {
    winston.info('Delete User request', {'user': request.session.firstName, 'url_clicked': '/deleteUser'});
    var userId = request.session.userId;
    var msg_payload = {userId: userId};
    mq_client.make_request('DeleteUser_queue', msg_payload, function (err, result) {
        if (!err) {
            request.session.destroy();
            response.redirect("/");
        } else {
            response.status(400);
            response.end();
        }
    });
};