var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tripSchema = new Schema({
    tripId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'property'},
    userId: {type: String, ref: 'user'},
    hostId: {type: String, ref: 'user'},
    checkIn: {type: Number},
    checkOut: {type: Number},
    noOfGuests: {type: Number},
    isAccepted: {type: Boolean},
    createdDate: {type: Number}

});

var Trip = mongoose.model('trip', tripSchema,'trip');
module.exports = Trip;