/**
 * Created by dthes on 11/21/2016.
 */
/**
 * http://usejsdoc.org/
 */
/*var fecha = require('fecha');*/
var User = require('../model/user');
var Property = require('../model/property');
var Media = require('../model/media');
var mongoose = require('mongoose');

exports.doSearch = function (msg, callback) {

    var location = msg.location;
    var property_type = msg.property_type;
    var checkin = msg.checkin;
    var checkout = msg.checkout;
    var guests = msg.guests;

    // var strArr = location.split(" ");
    // var searchArr = [];
    // for (var i = 1; i <= strArr.length; i++) {
    //     var j = i;
    //     for(var k = 0; k + i <= str.length)
    // }
    //change search criteria
    //add date available criteria also
    Property.find(
        {
            $and: [{
                // category: property_type,
                maxGuest: {$gte: guests},
                isAvailable: true,
                isApproved: true
            },
                {
                    $or: [
                        {$text : {$search: location}}
                    ]
                }]
        })
        .populate('hostId')
        .populate('mediaId')
        .exec(function (err, properties) {
                if (err) {
                    console.log(err);
                    console.log("err in find");
                    callback(err, null);
                }

                if (!properties) {
                    callback(null, null);
                } else {
                    var response = {
                        total: properties.length,
                        per_page: properties.length,
                        current_page: 1,
                        last_page: 1,
                        next_page_url: null,
                        prev_page_url: null,
                        from: 1,
                        to: properties.length,
                        data: []
                    };
                    for (var j = 0; j < properties.length; j++) {
                        var record = properties[j];
                        var datum = {
                            id: record._id,
                            user_id: (record.hostId) ? record.hostId._id : null,
                            name: record.name,
                            summary: record.description,
                            accommodates: record.maxGuest,
                            bedrooms: record.bedrooms,
                            bathrooms: record.bathrooms,
                            host_name: (record.hostId) ? record.hostId.firstName : null,
                            created_at: record.createdDate,
                            updated_at: record.createdDate,
                            photo_name: (record.mediaId) ? record.mediaId.imageUrl[0] : "",
                            images: (record.mediaId) ? record.mediaId.imageUrl : [],
                            video_url: (record.mediaId) ? record.mediaId.videoUrl : "",
                            sub_name: "",
                            property_type: 2,
                            room_type: 0,
                            beds: 1,
                            bed_type: 3,
                            amenities: "1,2,4,5,6,7,10,11,15,17,18,19,22,23,24,25,28,29,30",
                            calendar_type: "Always",
                            booking_type: null,
                            cancel_policy: "Flexible",
                            popular: "Yes",
                            started: "Yes",
                            status: "Listed",
                            deleted_at: null,
                            steps_count: 0,
                            property_type_name: "Apartment",
                            room_type_name: "Entire home\/apt",
                            bed_type_name: "Pull-out Sofa",
                            reviews_count: 0,
                            overall_star_rating: "",
                            rooms_address: {
                                room_id: record._id,
                                address_line_1: record.address,
                                address_line_2: "",
                                city: record.city,
                                state: record.state,
                                country: record.country,
                                postal_code: record.zip,
                                latitude: record.latitude,
                                longitude: record.longitude,
                                country_name: record.country,
                                steps_count: 0
                            },
                            rooms_price: {
                                room_id: record.id,
                                night: record.price,
                                week: 0,
                                month: 0,
                                cleaning: 0,
                                additional_guest: 0,
                                guests: 0,
                                security: 0,
                                weekend: 0,
                                currency_code: "USD",
                                steps_count: 0,
                                original_night: record.price,
                                original_week: 0,
                                original_month: 0,
                                original_cleaning: 0,
                                original_additional_guest: 0,
                                original_security: 0,
                                original_weekend: 0,
                                code: "USD",
                                currency: {
                                    id: 1,
                                    name: "US Dollar",
                                    code: "USD",
                                    symbol: "&#36;",
                                    rate: "1.00",
                                    status: "Active",
                                    default_currency: "1",
                                    paypal_currency: "Yes",
                                    original_symbol: "&#36;"
                                }
                            },
                            users: (record.hostId) ? {
                                id: record.hostId._id,
                                first_name: record.hostId.firstName,
                                last_name: record.hostId.lastName,
                                email: record.hostId.email,
                                dob: "0000-00-00",
                                gender: null,
                                live: "",
                                about: "",
                                school: "",
                                work: "",
                                timezone: "UTC",
                                fb_id: "",
                                google_id: "",
                                status: "Active",
                                created_at: record.hostId.createdDate,
                                updated_at: record.hostId.createdDate,
                                deleted_at: null,
                                dob_dmy: "",
                                age: 0,
                                full_name: record.hostId.firstName + " " + record.hostId.lastName,
                                profile_picture: {
                                    user_id: record.hostId._id,
                                    src: record.hostId.profileImage,
                                    photo_source: "Local",
                                    header_src: record.hostId.profileImage,
                                    email_src: record.hostId.profileImage
                                }
                            } : null
                        };
                        response.data.push(datum);
                    }
                    callback(null, response);
                }
            }
        )
    ;
}
;