var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    propertyId: {type: Schema.Types.ObjectId, ref: 'Property'},
    imageUrl: {type: String},
    videoUrl: {type: String}


});

var Media = mongoose.model('media', mediaSchema,'media');
module.exports = Media;