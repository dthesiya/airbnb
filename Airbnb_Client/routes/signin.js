/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var mq_client = require("../rpc/client.js");
/*var log = require("./log");*/
/*
var mongo = require("./mongo");
var config = require('./config.js');
*/
var passport = require("passport");
require('./passport')(passport);


exports.loadSigninPg = function(req,res){

	res.render("../views/signin.ejs");
};

exports.authenticateUser = function(req, res, next) {

//	var email_id = req.body.email_id;
//	var pwd = req.body.password;
	/*var sess = req.session;*/
	  passport.authenticate('login', function(err, user) {
		  console.log(user);
	    if(err) {
	      return next(err);
	    }

	    if(!user) {

			res.json({
				success: false,
				message: 'No user found'
			});
			res.end();
	      /*return res.redirect('/signup');*/
	    }
	   
	    if(user){
	    	
	    	/*sess.first_name =user.first_name;
			sess.last_name = user.last_name;
			sess.user_id = user._id;
			sess.last_access = user.last_access;*/

//		        res.statusCode = 200;
				res.json({
		          success: true,
		          message: 'Logged in'
		        });
				res.end();
	    }
	  })(req, res, next);
};

exports.signout = function(req,res){
	

	req.session.destroy();
	res.redirect("/");
};


exports.registerUser = function (req,res) {

	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var email = req.param("email");
	var password = req.param("password");


	var msg_payload={

		firstName:firstName,
		lastName:lastName,
		email:email,
		password:password
	};


	mq_client.make_request('register_queue', msg_payload, function (err, user) {
		if(err){

			console.log(err);
			console.log("In err to save");
			var json_responses = {"statusCode" : 401};
			res.send(json_responses);

		}else{

			console.log("After refgister in client");
			console.log(user);
			/*req.session.userSSN=user.userId;
			req.session.firstName=user.firstName;
			req.session.lastName=user.lastName;
			req.session.userId=user._id;
			req.session.email=user.email;*/
			var json_responses = {"statusCode" : 200,"data":user};
			res.send(json_responses);
			res.end();

		}
	});




};



	