/**
 * Created by Divya Patel on 11/21/2016.
 */



var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
var ejs = require('ejs');

exports.loadReviewAboutPage = function (req, res) {


    var userId = req.session.userId;

    var msg_payload = {

        userId: userId
    };


    mq_client.make_request('loadReviewAboutPage_queue', msg_payload, function (err, user) {
        if (err) {

            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();

        } else {

            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode": 200,"data":user};
            res.send(json_responses);
            res.end();

        }
    });


};


exports.loadReviewByPage = function (req, res) {


    var userId = req.session.userId;

    var msg_payload = {

        userId: userId
    };


    mq_client.make_request('loadReviewByPage_queue', msg_payload, function (err, user) {
        if (err) {

            console.log(err);
            console.log("In err to save");
            var json_responses = {"statusCode": 401};
            res.send(json_responses);
            res.end();

        } else {

            console.log("After editing user in client");
            //console.log(user);
            var json_responses = {"statusCode": 200,"data":user};
            res.send(json_responses);
            res.end();

        }
    });
};

exports.getHostReviewsCount = function (req, res) {

    var hostId = req.param("hostId");

    var msg_payload = {
        hostId: hostId
    };

    mq_client.make_request('hostReviewsCount_queue', msg_payload, function (err, result) {
        if (err) {
            console.log(err);
            res.send({"statusCode": 401});
            res.end();

        } else {
            res.send(result);
        }
    });
};


exports.getUserReview = function (request, response) {
    var userId = request.params.userId;
    var msg_payload =
    {
        userId: userId
    }
    mq_client.make_request('getUserReview_queue', msg_payload, function (err, result) {

        if (err) {
            console.log(err);
        }
        else {
            response.send({userReview: result});
        }

    });
};

exports.getHostReview = function (request, response) {
    var hostId = request.params.hostId;
    var msg_payload =
    {
        hostId: hostId
    }
    mq_client.make_request('getHostReview_queue', msg_payload, function (err, result) {

        if (err) {
            console.log(err);
        }
        else {
            response.send({hostReview: result});
        }

    });
};


exports.addUserReview = function (request, response) {
    var msg_payload =
    {
        userId: request.body.userId,
        hostId: request.session.userId,
        review: request.body.review,
        rating: request.body.rating,
        image: request.body.image,
        createdDate: Date.now()
    }

    mq_client.make_request('addUserReview_queue', msg_payload, function (err, result) {

        if (err) {
            console.log(err);
            response.send({statusCode: 401});
        }
        else {
            response.send({statusCode: 200});
        }

    });
};


exports.addHostReview = function (request, response) {
    var msg_payload =
    {
        userId: request.session.userId,
        hostId: request.body.hostId,
        review: request.body.review,
        rating: request.body.rating,
        imageUrl: request.body.image,
        createdDate: Date.now()
    }

    mq_client.make_request('addHostReview_queue', msg_payload, function (err, result) {

        if (err) {
            console.log(err);
            response.send({statusCode: 401});
        }
        else {
            response.send({statusCode: 200});
        }

    });
};