var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require("connect-mongo")(session);
var mongo = require("mongodb").MongoClient;

var fileUpload = require('express-fileupload');
var routes = require('./routes/index');
var users = require('./routes/users');
var signin = require('./routes/signin');
var home = require('./routes/home');
var account = require('./routes/account');
var search = require('./routes/search');
var review = require('./routes/review');
var property = require('./routes/property');
var account_management = require('./routes/account_management');


var app = express();
app.use(fileUpload());
app.use(passport.initialize());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    store: new mongoStore({
        url: "mongodb://team14:airbnb_14@ds011863.mlab.com:11863/airbnb"
    })
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signin', signin.authenticateUser);
app.post('/registerUser', signin.registerUser);

app.get('/searchResult', search.search);
app.get('/search', search.loadSearchPg);
app.get('/', home.homepg);
app.get('/login', signin.loginpg);
app.get('/signout', signin.signout);
app.post('/registerUser', signin.registerUser);
app.get('/search', search.loadSearchPg);
app.post('/editUser', account.editUser);
app.get('/editProfilePage', account.getEditProfilePage);
app.get('/getUserPhotoPage', account.getUserPhotoPage);
app.get('/getUserReviewAboutPage', account.getUserReviewAboutPage);
app.get('/getUserReviewbyPage', account.getUserReviewbyPage);
app.post('/loadEditUserPage', account.loadEditUserPage);
app.get('/login', signin.loginpg);
app.get('/property', property.loadDetailPg);
app.get('/detail', property.getProperty);
app.get('/Account_Transactions', account_management.accountPage);
app.get('/Account_Security', account_management.accountSecurityPage);
app.get('/Account_Payment_Method', account_management.accountPaymentMethodPage);
app.get('/payinTransaction', account_management.payinTransactions);
app.get('/payoutTransaction', account_management.payoutTransactions);
app.post('/updatePassword', account_management.updatePassword);
app.post('/paymentMethodUpdate', account_management.updatePaymentMethod);

app.post('/loadReviewAboutPage', review.loadReviewAboutPage);
app.post('/loadReviewByPage', review.loadReviewByPage);
app.post('/uploadProfileImage', account.uploadProfileImage);
app.post('/loadProfilePhotoPage', account.loadProfilePhotoPage);

app.get('/receipt/:billingID', account_management.receiptPage);

app.get('/signin', isAuthenticated, function (req, res) {
    res.redirect('/');
});
function isAuthenticated(req, res, next) {
    if (req.session.user_id) {
        console.log(req.session.user_id);
        return next();
    }
    res.redirect('/signinPg');
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
