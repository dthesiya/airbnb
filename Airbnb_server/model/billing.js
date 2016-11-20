var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billingSchema = new Schema({
    billingId: {type: String},
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    hostId: {type: String, ref: User},
    userId: {type: String, ref: User},
    date: {type: Number},
    fromDate: {type: Number},
    toDate: {type: Number},
    total: {type: Number},
    createdDate: {type: Number}

});

var Billing = mongoose.model('billing', billingSchema,'billing');
module.exports = Billing;