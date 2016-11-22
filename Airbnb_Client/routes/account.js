/**
 * Created by Divya Patel on 11/21/2016.
 */

var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require('ejs');

exports.editUser = function(req, res ) {



    var firstName = req.param("firstName");
    var lastName = req.param("lastName");
    var email = req.param("email");
    var address = req.param("address");
    var state = req.param("state");
    var city = req.param("city");
    var zip = req.param("zip");
    var userId=req.session.userId;

    var msg_payload={

        firstName:firstName,
        lastName:lastName,
        email:email,
        address:address,
        state:state,
        city:city,
        zip:zip,
        userId:userId
        
    };


    mq_client.make_request('editUser_queue', msg_payload, function (err, user) {
        if(err){

            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode" : 401};
            res.send(json_responses);
            res.end();

        }else{

            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode" : 200};
            res.send(json_responses);
            res.end();

        }
    });





};


exports.getEditProfilePage = function (req,res) {


    var sess = req.session;
    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn

    };
    ejs.renderFile('../views/profile_edit_profile.ejs', user_data,function (err,result) {
        if(err){

            console.log("Error in getting edit profile page");
            res.send("An error occured to get profile edit page");

        } else {

            res.end(result);

        }


    });
    
    
};


exports.loadEditUserPage = function (req,res) {


    var userId=req.session.userId;

    var msg_payload={
        userId:userId
    };



    mq_client.make_request('loadEditUser_queue', msg_payload, function (err, user) {
        if(err){

            console.log(err);
            console.log("In err to loadedit user queue");
            var json_responses = {"statusCode" : 401};
            res.send(json_responses);
            res.end();

        }else{

            console.log("After editing user in client");
            console.log(user);
            var json_responses = {"statusCode" : 200, "data":user};
            res.send(json_responses);
            res.end();

        }
    });



};

exports.getUserPhotoPage = function (req,res) {

    var sess = req.session;
    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn

    };
    ejs.renderFile('../views/profile_photo_tab.ejs', user_data,function (err,result) {
        if(err){

            console.log("Error in getting  profile photo page");
            res.send("An error occured to get profile photo page");

        } else {

            res.end(result);

        }


    });





};



exports.getUserReviewAboutPage = function (req,res) {

    var sess = req.session;
    var user_data ={
        "email" : sess.email,
        "isLoggedIn" : sess.isLoggedIn

    };
    ejs.renderFile('../views/profile_review_about_you.ejs', user_data,function (err,result) {
        if(err){

            console.log("Error in getting  profile review about page");
            res.send("An error occured to get profile review about page");

        } else {

            res.end(result);

        }


    });


};


exports.getUserReviewbyPage = function (req,res) {

    var sess = req.session;
    var user_data = {
        "email": sess.email,
        "isLoggedIn": sess.isLoggedIn

    };
    ejs.renderFile('../views/profile_review_by_you.ejs', user_data, function (err, result) {
        if (err) {

            console.log("Error in getting  profile review by page");
            res.send("An error occured to get profile review by page");

        } else {

            res.end(result);

        }


    });
};