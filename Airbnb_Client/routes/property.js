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
/*var log = require("./log");*/
/*
 var mongo = require("./mongo");
 var config = require('./config.js');
 */


exports.loadDetailPg = function (req, res) {
    res.render("../views/detail.ejs");
};

exports.getProperty = function (req, res, next) {
    var id = req.param("id");

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
