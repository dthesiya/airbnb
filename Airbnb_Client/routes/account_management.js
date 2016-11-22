/**
 * Created by shalin on 11/21/2016.
 */
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");

exports.accountPage = function (req,res,next) {
    res.render('Account_Transactions', {isLoggedIn:req.session.isLoggedIn});
};

exports.accountSecurityPage = function (req, res, next) {
    res.render('Account_Security', {isLoggedIn:req.session.isLoggedIn});
};

exports.accountPaymentMethodPage = function (req, res, next) {
    res.render('Account_Payment_Method', {isLoggedIn:req.session.isLoggedIn});
};

exports.updatePassword = function (req, res, next) {
    console.log("in routes account_management");
    console.log(req.param("old_password"), req.param("new_password"));
    var old_password = req.param("old_password");
    var new_password = req.param("new_password");
    var msg_payload = {
        old_password:old_password,
        new_password:new_password,
        email : req.session.email
    };

    mq_client.make_request('updatePassword_queue', msg_payload, function (err, user) {
        if(err){

            console.log(err);
            res.send("invalid");
        }else if(user){
            res.send("valid")
        }else{
            res.send("invalid");
        }
    });
};

exports.updatePaymentMethod = function (req, res, next) {
    console.log("in routes account_management");
    console.log(req.param("cvv"), req.param("cno"), req.param("expm"),req.param("expy"));
    var cvv = req.param("cvv");
    var cno = Number(req.param("cno"));
    var expm = req.param("expm");
    var expy = req.param("expy");
    console.log(expm+expy);
    var msg_payload = {
        cvv:cvv,
        cno:cno,
        expm:expm,
        expy:expy,
        email : req.session.email
    };

    mq_client.make_request('updatePaymentMethod_queue', msg_payload, function (err, user) {
        if(err){
            console.log(err);
            res.send(err);
        }else{
            console.log("responsed");
            res.send("OK");
        }
    });
};