/**
 * Created by dthesiya on 12/03/2016.
 */

var bcrypt = require('bcryptjs');
var User = require('../model/user');
var Bill = require('../model/billing');
var Property = require('../model/property');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var ssn = require('ssn');
var faker = require('faker');

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

exports.testBill = function () {
    var startDate = new Date();
    var start = startDate.getTime();
    var end = startDate.addDays(2).getTime();
    var arr = [];
    for (var i = 0; i < 30000; i++) {
        var billDetails = new Bill();
        billDetails.billingId = ssn.generate();
        billDetails.propertyId = "584517d9c0bc83792c8231c";
        billDetails.hostId = "58447cb73c4b513340ac309";
        billDetails.userId = "58447b989ffc921090c46a6";
        billDetails.fromDate = start;
        billDetails.toDate = end;
        billDetails.total = 170;
        billDetails.createdDate = start;
        billDetails.tripId = "5845ecbfdf88c16fd87a638";
        arr.push(billDetails);
    }
    Bill.insertMany(arr);
    console.log("Done");
};