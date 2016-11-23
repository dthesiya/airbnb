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


exports.loadReviewAboutPage_queue = function (msg,callback) {

    var userId= msg.userId;
    
    



};

exports.loadReviewByPage_queue = function (msg,callback) {

    var userId= msg.userId;





};