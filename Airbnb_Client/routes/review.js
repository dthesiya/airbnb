/**
 * Created by Divya Patel on 11/21/2016.
 */



var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require('ejs');

exports.loadReviewAboutPage = function (req,res) {


   console.log("In routs of review about you");
    var userId=req.session.userId;

    var msg_payload={
        
        userId:userId
    };


    mq_client.make_request('loadReviewAboutPage_queue', msg_payload, function (err, result) {
        if(err){

            console.log(err);
            console.log("In to get user review");
            var json_responses = {"statusCode" : 401};
            res.send(json_responses);
            res.end();

        }else{

            console.log("After getting user review in client");
            console.log(result);
            var json_responses = {"statusCode" : 200, "data":result};
            res.send(json_responses);
            res.end();

        }
    });



};



exports.loadReviewByPage = function (req,res) {



    var userId=req.session.userId;

    var msg_payload={

        userId:userId
    };


    mq_client.make_request('loadReviewByPage_queue', msg_payload, function (err, user) {
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