/**
 * Created by dthesiya on 11/22/2016.
 */

var mq_client = require("../rpc/client.js");
var ejs = require("ejs");

exports.test = function (req, res) {
    var user_data = {
        "hello": "hello",
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName
    };
    ejs.renderFile('../views/viewitinerary.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.addListing = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName
    };
    ejs.renderFile('../views/becomehostDescription.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.becomeHost = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName
    };
    ejs.renderFile('../views/becomeHostMainPage.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.yourListings = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName
    };
    ejs.renderFile('../views/profile_activeListings.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.getActiveListings = function (request, response) {

    var userId = request.session.userId;
    console.log(userId);
    var msg_payload = {userId: userId};

    mq_client.make_request('getActiveListings_queue', msg_payload, function (err, properties) {
        if (!err) {
            response.end(JSON.stringify(properties));
        } else {
            console.log(err);
            response.end();
        }
    });
};

exports.getActiveListingsFromId = function (request, response) {

    var userId = request.params.userId;
    console.log(userId);
    var msg_payload = {userId: userId};

    mq_client.make_request('getActiveListings_queue', msg_payload, function (err, properties) {
        if (!err) {
            response.end(JSON.stringify(properties));
        } else {
            console.log(err);
            response.end();
        }
    });
};

exports.addNewListing = function (request, response) {
    var msg_payload =
    {
        "hostId": request.session.userId,
        "maxGuest": request.param("maxGuest"),
        "roomType": request.param("roomType"),
        "category": request.param("propertyType"),
        "city": request.param("city"),
        "state": request.param("state"),
        "address": request.param("address"),
        "zipCode": request.param("zipCode"),
        "bedrooms": request.param("bedrooms"),
        "beds": request.param("beds"),
        "bathrooms": request.param("bathrooms"),
        "name": request.param("name"),
        "description": request.param("description"),
        "price": request.param("price"),
        "latitude": request.param("latitude"),
        "longitude": request.param("longitude"),
        "createdDate": request.param("createdDate"),
        "isApproved": request.param("isApproved"),
        "isBidding": request.param("isBidding")
    }

    mq_client.make_request('addNewListing_queue', msg_payload, function (err, result) {


        if (!err) {
            console.log(result);
            if (result.statusCode == 200) {
                response.send({result: result});
            }
        } else {
            console.log(err);
            response.end();
        }
    });
}

exports.getReservations = function (request, response) {

    var hostId = request.session.userId;
    var msg_payload = {hostId: hostId};

    mq_client.make_request('getReservations_queue', msg_payload, function (err, reservations) {

        if (!err) {
            response.end(JSON.stringify(reservations));
        } else {
            console.log(err);
            response.end();
        }
    });
};