var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var DB_Utils = require('../DButils');
var jwt = require('jsonwebtoken');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');
var countries = [];
const superSecret = "SUMsumOpen"; // secret variable


var ReadXMl = () => {
    fs.readFile(__dirname + '/../countries.xml', 'utf8', function(err, data) {
        if (!err) {
            countries = data.match(/<Name>(.*?)<\/Name>/g).map(function(val){
                return val.replace(/<\/?Name>/g,'');
             });
        }
        //console.log(countries);
        
    });
}

var CheckIfUserExits = (array,user) =>
    {
        for(var i = 0;i<array.length;i++)
            if(array[i].username === user)
            {
                return true;
                break;
            }

        return false;
}      


//register the user to the system
router.post('/register', function (req, res) {
    var userToChange = req.body;
    var user = userToChange.username;
    var pass = userToChange.password;
    var first = userToChange.FirstName;
    var last = userToChange.LastName;
    var city = userToChange.City;
    var Country = userToChange.Country;
    var Email = userToChange.Email;
    var VQ = userToChange.VQ;
    var VA = userToChange.VA;
    var Categories = userToChange.Categories;

    if(!countries.includes(Country))
        res.send("Please Enter valid country");
    
    else
    {
        var query = `INSERT INTO RegUsers VALUES ('${user}','${pass}','${first}','${last}','${city}','${Country}','${Email}','${VQ}','${VA}','${Categories}')`                
        

        DB_Utils.execQuery("Select username from RegUsers").then((result) => {
            if (!CheckIfUserExits(result,user)){
                DB_Utils.execQuery(query).then((result) => {
                    res.send(200);
                })
            }
            else
                res.send({message: 'you choose a username that all ready exist'});
        });
    }

});

//return the question of the user
router.get('/:username/get',function (req, res){
    var username = req.params.username;
    console.log(username + " sadsaddsfdsffds");
    DB_Utils.execQuery("Select * from RegUsers").then((result) => {
        if (CheckIfUserExits(result,username)){
            DB_Utils.execQuery("Select v1,v2 from RegUsers WHERE username = '" + username +"'").then((result) => {
                res.send([result[0].v1.split("?")[0]+"?",result[0].v2.split("?")[0]+"?"]);
            })
        }
        else
            res.send({message: 'Invalid username'});
    
    });
});

//return reviews for poi
router.get('/getPOIReview/:ID', function (req, res) {
    var id = req.params.ID;
    var query = `SELECT * FROM POIReview
    where POIID='${id}'`;

    DB_Utils.execQuery(query).then((result) => {
        
        res.send(result);

    });
});


//return the password if the answers are correct
router.post('/answers',function (req, res){
    var username = req.body.username;
    var ans1 = req.body.Answer1.trim();
    var ans2 = req.body.Answer2.trim();

    DB_Utils.execQuery("Select * from RegUsers").then((result) => {
        if (CheckIfUserExits(result,username)){
            DB_Utils.execQuery("Select v1,v2,password from RegUsers").then((result) => {
                DBans1 = result[0].v1.split("?")[1].trim();
                DBans2 = result[0].v2.split("?")[1].trim();
                if(ans1===DBans1 && ans2===DBans2)
                    res.send("The password is - " + result[0].password);
                else
                res.send("Wrong Answers!!!");
            })
        }
        else
            res.send({message: 'Invalid username'});
    
    });
});


//return poi of barcelona
router.get('/getBarcelona', function (req, res) {
   
    var query = `SELECT * FROM POI
    where city LIKE 'Barcelona'`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(result);

    });
});

//return poi of barcelona
router.get('/getAllPOI', function (req, res) {
    var query = `SELECT * FROM POI`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(result);

    });
});


//gets all pois of category
router.get('/getPoiByCat/:cat', function (req, res) {
    var category = req.params.cat;
    var query = `select * from POI where Category='${category}'`;
    console.log(query);
    DB_Utils.execQuery(query).then((result) => {
        res.send(result);
    }).catch((e) => {
        res.send(e)
    });
    

});

//return POI according to id
router.get('/getPOIInfo/:ID', function (req, res) {
    var id = req.params.ID;
    var query = `SELECT * FROM POI
    where ID='${id}'`;

    DB_Utils.execQuery(query).then((result) => {
        
        res.send(result);

    });

    var query = `UPDATE POI
    SET views = views + 1
    WHERE ID = '${id}'`;

    DB_Utils.execQuery(query).then((result) => {
        
        res.send(result);

    });

});


//gets all pois by name
router.get('/getPoiByName/:name', function (req, res) {
    var name = req.params.name;
    var query = `SELECT * FROM POI
    where title LIKE '%${name}%'`;
    console.log(query);
    DB_Utils.execQuery(query).then((result) => {
        res.send(result);
    }).catch((e) => {
        res.send(e)
    });
    

});

//return token after login
router.post('/login', function (req, res) {
    var userToChange = req.body;
    console.log(req);

    var user = userToChange.username;
    var pass = userToChange.password;
    
    var query = `select * from RegUsers where username='${user}' and password='${pass}'`;
    console.log(query);

    DB_Utils.execQuery(query).then((result) => {
       if(result[0] === undefined)
            res.send({ success: false, message: 'Authentication failed. Wrong Password' })
        else
            sendToken(user, res);
    });

});

//return 3 random poi
router.get('/get3POI', function (req, res) {
    
    var query = `select * from POI`;

    DB_Utils.execQuery(query).then((result) => {
        var size = result.length;
        var numbers = new Array(3);
        var result3 = new Array(3);
        var ran;
        var counter = 0;
        while (counter<3)
        {
            ran  = Math.floor((Math.random() * result.length));
            if(numbers.indexOf(ran) === -1)
            {
                numbers[counter]= ran;
                result3[counter] = (result[numbers[counter]]);
                counter++;
            }
        } 
            res.send(result3);
       });

});

function sendToken(user, res) {
    var payload = {
        userName: user,
    }

    var token = jwt.sign(payload, superSecret, {
        expiresIn: "1d" // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
    });

}

module.exports.router = router;
module.exports.ReadXMl = ReadXMl;