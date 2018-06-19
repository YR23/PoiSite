// =======================
// get the packages ============
// =======================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var poi = require('./server_modules/POI')
var general = require('./server_modules/general')
var DB_Utils = require('./DButils');


// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;


// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

var  superSecret = "SUMsumOpen"; // secret variable


// =======================
// routes ================
// =======================
// basic route


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");

    next();
 });

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// route middleware to verify a token
app.use('/reg', function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    console.log("Token is " + token)
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                // get the decoded payload and header
                var decoded = jwt.decode(token, {complete: true});
                req.username = decoded.payload.userName;
                console.log("The user name is --> " + req.username);
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }

})

app.get('/reg/getuser', function (req, res){
        res.send(req.username);
})

app.use('/general', general.router)
app.use('/reg/poi', poi)





// =======================
// start the server ======
// =======================
app.listen(port, function(){ 
    console.log('Magic happens at http://localhost:' + port);
    general.ReadXMl();
    })
