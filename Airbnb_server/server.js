
var amqp = require('amqp'),
    util = require('util');
require('./model/mongoconnect');
var signIn = require('./services/signin');
/*
var signinup = require('./services/signinup');
var postAdvertisement = require('./services/postAdvertisement');
var product = require('./services/product');
var index = require('./services/index');
var profile = require('./services/profile');
var shoppingCart = require('./services/shoppingCart');

var checkout = require('./services/checkout');
*/
var cnn = amqp.createConnection({host: '127.0.0.1'});

//require('./services/biddingChecker');
cnn.on('error', function (e) {
    console.log("error from amqp "+e);
});
cnn.on('ready', function () {

    cnn.queue('login_queue', function (q) {
        q.subscribe(function (message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            signIn.doLogin(message, function (err, res) {
                //return index sent
                cnn.publish(m.replyTo, res, {
                    contentType: 'application/json',
                    contentEncoding: 'utf-8',
                    correlationId: m.correlationId
                });
            });
        });
    });


});
