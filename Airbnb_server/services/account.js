/**
 * Created by Divya Patel on 11/21/2016.
 */
var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
 var config = require('./config.js');*/
var User = require('../model/user');
var mongoose = require('mongoose');
var Property = require('../model/property');

exports.editUser = function (msg,callback) {


    var firstName=msg.firstName;
    var lastName=msg.lastName;
    var email=msg.email;
    var address=msg.address;
    var state=msg.state;
    var city=msg.city;
    var zip=msg.zip;
    var userId=msg.userId;


    console.log('In edit user');

    User.update({_id:userId},
        {
            $set:{

                firstName:firstName,
                lastName:lastName,
                address:address,
                city:city,
                state:state,
                zip: zip,
                email:email

            }
        },

        function (err,user) {
            if (err) {

                console.log(err);
                callback(err,null);            }
            else{

                callback(null,user);
            }
        });
};



exports.loadEditUserPage = function (msg,callback) {


    var userId=msg.userId;
    console.log('In edit user');

    User.findOne({_id:userId}, function (err,user) {
            if (err) {

                console.log(err);
                callback(err,null);            }
            else{
                console.log("USER IS");
                console.log(user);
                callback(null,user);
            }
        });
};


exports.uploadProfileImage = function (msg,callback) {


    var userId = msg.userId;
    var fileName = msg.fileName;

    User.update({_id:userId},
        {
            $set:{
                profileImage:fileName
            }
        },

        function (err,user) {
            if (err) {

                console.log(err);
                callback(err,null);            }
            else{

                callback(null,user);
            }
        });

};

exports.loadProfilePhotoPage = function (msg,callback) {

    var userId = msg.userId;

    User.findOne({_id:userId}, function (err,user) {
        if (err) {

            console.log(err);
            callback(err,null);            }
        else{
            console.log("USER IS");
            console.log(user);
            callback(null,user);
        }
    });



};

exports.loadPaymentPage = function (msg,callback) {

    
    var userId = msg.userId;
    
    User.findOne({_id:userId},function (err,user) {
        
        if(err){
            
            console.log("Error occurred");
            console.log(err);
            callback(err,null);
            
        }
        else{
            
            console.log(user);
            callback(null,user);
            
        }
        
    });
    
    
    


};

exports.getPropertyDetails = function (msg, callback) {


   // var userId = msg.userId;
    var propertyId = msg.propertyId;

    Property.findOne({_id: propertyId}).populate('mediaId').populate("hostId").exec(function (err, result) {
        
        if(err){
            
            console.log("ERROR TO GET PROPERTY DETAILS");
            console.log(err);
            callback(err,null);
        }
        else{
            
            console.log("property ");
            console.log(result);
            callback(null,result);
            
        }
        
    });

    
    
    
    
};