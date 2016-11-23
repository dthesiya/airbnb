/**
 * Created by Divya Patel on 11/21/2016.
 */

var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
 var config = require('./config.js');*/
var userReview = require('../model/userReview');
var hostReview = require('../model/hostReview');
var mongoose = require('mongoose');


exports.loadReviewAboutPage = function (msg, callback) {

    var userId='5834da5be3806d3740cc06f3';
        // msg.userId;

    //reviews from host
    userReview.find({userId:userId}).populate('hostId').exec(function (err, result) {

        if(err){

            console.log("Getting error in user reviews");
            console.log(err);
            callback(err,null);
        }
        else{


            //reviews from user
            hostReview.find({userId:userId}).populate('userId').exec(function (err, result1) {

                if(err){

                    console.log("Getting error in from user reviews");
                    console.log(err);
                    callback(err,null);
                }
                else{

                    console.log("User/Host Reviews got");
                    console.log(result1);
                    var json={
                        "fromHostReview":result,
                        "fromUserReview":result1
                    };
                    console.log("------------------------------------------------------");
                    console.log(json);
                    callback(null,json);

                }

            });


        }

    });


};

exports.loadReviewByPage = function (msg, callback) {

    var userId = msg.userId;


};