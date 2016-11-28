/**
 * Created by dthesiya on 11/21/2016.
 */

var mq_client = require("../rpc/client.js");
var ejs = require("ejs");

exports.tripPage = function (req, res) {
    var user_data = {
        "email": req.session.email,
        "isLoggedIn": req.session.isLoggedIn,
        "firstname": req.session.firstName
    };
    ejs.renderFile('../views/profile_yourTrips.ejs', user_data, function (err, result) {
        res.end(result);
    });
};

exports.getUserTrips = function (request, response) {


    var userId = request.session.userId;
    // var userId = 'ObjectId("5833baaecbf1171f6806c745")';

    var msg_payload = {userId: userId};

    mq_client.make_request('getUserTrips_queue', msg_payload, function (err, trips) {

        if (!err) {
            console.log(trips);
            for (var i = 0; i < trips.length; i++) {

                if (trips[i].isAccepted) {
                    trips[i].isAccepted = "Accepted";
                }
                else {
                    trips[i].isAccepted = "Pending";
                }

            }
            response.end(JSON.stringify(trips));
        }

    });

};

exports.acceptTrip = function (request, response) {

    var tripId = request.body.tripId;
    console.log(request.body);
    var hostId = request.session.userId;

    var msg_payload = {tripId: tripId, hostId: hostId};

    mq_client.make_request('acceptTrip_queue', msg_payload, function (err, result) {

        if (!err && result.code == 200) {

            console.log('done');
            response.status(200);
            response.end();
        } else {
            response.status(400);
            response.end();
        }
    });


};

exports.displayItinerary = function (request, response) {


    var tripId = request.params.tripId;
    var userId = request.session.userId;

    var msg_payload = {tripId: tripId, userId: userId};

    mq_client.make_request('getItinerary_queue', msg_payload, function (err, trips) {

        if (!err) {
            if (trips) {
                var user_data = {
                    "email": request.session.email,
                    "isLoggedIn": request.session.isLoggedIn,
                    "firstname": request.session.firstName,
                    "itinerary": JSON.stringify(trips)

                };
                ejs.renderFile('../views/viewitinerary.ejs', user_data, function (err, result) {
                    response.end(result);
                });
            } else {
                response.end();
            }
        }
        response.status(400);
        response.end();
    });


};