var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propertySchema = new Schema({
    propertyId: {type: String},
    hostId: {type: Schema.Types.ObjectId, ref: 'User'},
    category: {type: String},
    address: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: String},
    maxGuest: {type: Number},
    description: {type: String},
    price: {type: Number},
    maxBidPrice: {type: Number},
    biddingDueTime: {type: Number},
    isBidding: {type: Boolean},
    isBidCompleted: {type: Boolean},
    latestBidder: {type: String},
    isAvailable: {type: Boolean},
    latitude: {type: String},
    longitude: {type: String},
    createdDate: {type: Number}

});

var Property = mongoose.model('property', propertySchema,'property');
module.exports = Property;