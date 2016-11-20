var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var biddingSchema = new Schema({
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    bidPrice: {type: Number},
    createdDate: {type: Number}
});

var Bidding = mongoose.model('bidding', biddingSchema,'bidding');
module.exports = Bidding;