/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
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



	