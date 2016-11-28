/**
 * Created by Salmaan on 11/21/2016.
 */

var Trip = require('../model/trip');
var Property = require('../model/property');
var Billing = require('../model/billing');
var mongoose = require('mongoose');
var ssn = require('ssn');

exports.getUserTrips = function (msg, callback) {

    var userId = msg.userId;

    Trip.find({userId: msg.userId})
        .populate('userId')
        .populate('hostId')
        .populate('billingId')
        .populate('propertyId')
        .sort('-checkIn')
        .exec(function (err, trips) {
            if (err) {
                console.log(err);
                callback(err, null);
            }
            else {
                console.log(trips);
                callback(null, trips);
            }
        });

};

exports.acceptTrip = function (msg, callback) {

    var res = {};

    var hostId = msg.hostId;
    var tripId = msg.tripId;
    console.log(msg);

    Trip.findOneAndUpdate({_id: tripId, hostId: hostId}, {$set: {isAccepted: true}}, {new: true})
        .populate('propertyId')
        .exec(function (err, doc) {

            if (!err) {

                // console.log(doc);

                var days = doc.checkOut - doc.checkIn;
                var total;
                days = Math.floor(days / (1000 * 60 * 60 * 24));
                if (days < 1) {
                    days = 1;
                    total = 1 * doc.propertyId.price;
                }
                else
                    total = days * doc.propertyId.price;

                var bill = new Billing();
                bill.propertyId = doc.propertyId;
                bill.hostId = doc.hostId;
                bill.tripId = doc._id;
                bill.userId = doc.userId;
                bill.date = Date.now();
                bill.fromDate = doc.checkIn;
                bill.toDate = doc.checkOut;
                bill.total = total;
                bill.days = days;
                bill.createdDate = Date.now();
                bill.billingId = ssn.generate();
                bill.save(function (err) {

                    if (!err) {
                        res.code = 200;

                        var revenue = total;
                        console.log("*******************************");
                        //

                        Property.findOne({_id: doc.propertyId._id}, function (err, forRevenue) {
                            if (!err) {
                                // console.log(forRevenue);
                                // console.log(forRevenue.revenue);
                                revenue = revenue + Number(forRevenue.revenue);
                                // console.log(revenue);
                                Property.findById(doc.propertyId, function (err, newRevenue) {
                                    if (err) console.log(err);

                                    newRevenue.revenue = revenue;
                                    newRevenue.save(function (err, updatedTank) {
                                        if (err) console.log(err);

                                    });
                                });


                            }

                            else
                                console.log(err);
                        });


                    } else if (err.code == 11000) {
                        res.code = 400;
                        console.log("Duplicate");
                    } else {
                        res.code = 500;
                        console.log(err);
                    }
                    callback(null, res);

                });


            } else {
                res.code = 500;
                callback(err, null);
            }
        });


};

exports.getItinerary = function (msg, callback) {


    var tripId = msg.tripId;
    var userId = msg.userId;

    var itinerary = {};
    itinerary.trip = [];
    itinerary.bill = [];

    console.log(tripId, userId);

    Trip.findOne({tripId: tripId, userId: userId})
        .populate('propertyId')
        .populate('userId')
        .populate('hostId')
        .exec(function (err, trip) {

            console.log(trip);
            itinerary.trip.push(trip);

            if (!err && trip != null) {


                Billing.findOne({tripId: trip._id})
                    .exec(function (err, bill) {
                        if (!err) {
                            console.log(bill);
                            itinerary.bill.push(bill);
                            callback(null, itinerary);
                        } else {
                            console.log(err);
                            callback(err, null);
                        }
                    });

            } else {
                console.log(err);
                callback(err, null);
            }

        });


};