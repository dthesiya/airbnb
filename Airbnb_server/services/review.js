/**
 * Created by Divya Patel on 11/21/2016.
 */

var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
 var config = require('./config.js');*/

var userReview = require('../model/userReview');
var hostReview = require('../model/hostReview');
var propertyReview = require('../model/propertyReview');
var mongoose = require('mongoose');


exports.loadReviewAboutPage = function (msg, callback) {

    var userId = msg.userId;
    //reviews from host
    userReview.find({userId: userId}).populate('hostId').exec(function (err, result) {

        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            //reviews from user
            hostReview.find({hostId: userId}).populate('userId').exec(function (err, result1) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    for (var i = 0; i < result.length; i++) {
                        result[i].createdDate = new Date(result[i].createdDate).toLocaleDateString();
                    }
                    for (var i = 0; i < result1.length; i++) {
                        result1[i].createdDate = new Date(result1[i].createdDate).toLocaleDateString();
                    }
                    var json = {
                        "fromHostReview": result,
                        "fromUserReview": result1
                    };
                    callback(null, json);
                }
            });
        }
    });
};

exports.loadReviewByPage = function (msg, callback) {

    var userId = msg.userId;
    // review by you to user
    userReview.find({hostId: userId}).populate('userId').exec(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            //reviews by you to host
            hostReview.find({userId: userId}).populate('hostId').exec(function (err, result1) {
                if (err) {
                    console.log(err);
                    callback(err, null);
                } else {
                    var json = {
                        "toUserReview": result,
                        "toHostReview": result1
                    };
                    callback(null, json);
                }
            });
        }
    });
};

exports.getHostReviewsCount = function (msg, callback) {

    var hostId = msg.hostId;
    hostReview.find({hostId: hostId}).count(function (err, result) {

        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var json = {
                "count": result
            };
            callback(null, json);
        }
    });
};