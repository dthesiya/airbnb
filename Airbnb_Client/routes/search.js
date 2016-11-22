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


exports.loadSearchPg = function (req, res) {
    res.render("../views/searchPage.ejs");
};

exports.search = function (req, res, next) {
    var location = req.param("location");
    var property_type = req.param("property_type");
    var checkin = req.param("checkin");
    var checkout = req.param("checkout");
    var guests = req.param("guests");

    var msg_payload = {
        location: location,
        property_type: property_type,
        checkin: checkin,
        checkout: checkout,
        guests: guests
    };


    mq_client.make_request('search_queue', msg_payload, function (err, result) {
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
