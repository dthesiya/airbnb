/**
 * Created by dthesiya on 11/21/2016.
 */
/**
 * Created by dthes on 11/21/2016.
 */
/**
 * http://usejsdoc.org/
 */
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require("ejs");

exports.addProperty = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName,
        "profileImg": req.session.profileImg
    };
    ejs.renderFile('../views/becomehostMainPage.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.loadDetailPg = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName,
        "profileImg": req.session.profileImg
    };
    ejs.renderFile('../views/detail.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.getProperty = function (req, res, next) {
    var id = req.param("propertyId");

    var msg_payload = {
        id: id
    };

    mq_client.make_request('property_detail_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
        } else {
            console.log(result);
            // var json_responses = {"statusCode": 200, "data": result};
            res.send(result);
            res.end();

        }
    });
};
