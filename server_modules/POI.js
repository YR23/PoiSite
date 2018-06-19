var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var DB_Utils = require('../DButils');


var BuildQuery = (cats) =>
    {
        var firstQuery = `Select ID,title,description from POI Where`;

        for(var i = 0 ; i<cats.length ; i++)
            if(i===cats.length-1)
                firstQuery += ` category = '${cats[i].toLowerCase()}')`;
            else
                firstQuery += ` (category = '${cats[i].toLowerCase()}' OR`;
        
        console.log("Query is " + firstQuery);
        return firstQuery;
}      

var RandomNumbers = (size) =>
    {
        var first = Math.floor(Math.random() * (size));
        var second = Math.floor(Math.random() * (size));
        while (second === first)
            second = Math.floor(Math.random() * (size));

        return [first,second];

}    

var comparePOI = (a,b) => {
    return a.rank - b.rank;
}

//home URI of reg/poi area
router.get('/', function (req, res) {
    res.send ( {message: 'Welcome to area for registered users only!!'})
});

//save POI to the SavedPOI
router.post('/save', function (req, res) {
    var query = req.body;
    var user = req.username;
    var poiID = query.POI;
    var query = `INSERT INTO SavedPOI (username,POIID) VALUES ('${user}','${poiID}')`;
    var querycheck = `Select * from SavedPOI Where username = '${user}' AND poiID = '${poiID}'`;
    DB_Utils.execQuery(querycheck).then((result) => {
        if(result.length>0)
            res.send("This POI is already part of your saved list")
        else
            DB_Utils.execQuery(query).then((result) => {
                res.send(200);
            })        
    })
    

});

//Return the POIS of rank higher than 3.
router.get('/getRecByCat', function (req, res) {
    var user = req.username;
    var query = `Select categories from RegUsers Where username = '${user}'`;
    DB_Utils.execQuery(query).then((result) => {
        cats = result[0].categories.split("|");
        Builtquery = BuildQuery(cats);
        Builtquery+= ` AND rank > 3`;
        DB_Utils.execQuery(Builtquery).then((result) => {
            res.send({
                Categories:cats,
                'Recommended POI': result});
        });
    });
});
        


//gets the list of fav poi for a user
router.get('/getSFavouritePOI', function (req, res) {
    var query = `SELECT * FROM POI
    INNER JOIN SavedPOI ON SavedPOI.POIID=POI.ID
    where SavedPOI.username='${req.username}'`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(result);

    });
});

//return poi by it's title
router.get('/searchPOIbyName/:name', function (req, res) {
    var title = req.params.name;
    var query = `SELECT * FROM POI
    where title LIKE '%${title}%'`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(result);

    });
});

//removes poi from tables: poi,SavedPOI
router.delete('/removePOI/:ID', function (req, res) {
    var id = req.params.ID;
    var query = `DELETE FROM POI
    where id = '${id}'`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(200);
       
    });
    var query = `DELETE FROM SavedPOI
    where POIID = '${id}'`;

    DB_Utils.execQuery(query).then((result) => {
        res.send(200);
    });

});

//return blank if the poi is not favorite, and filled if it is fav.
router.get('/getIconOfPOI/:ID', function (req, res) {
    var ID = req.params.ID;
    var query = `SELECT * FROM SavedPOI
    where username = '${req.username}' and POIID = '${ID}'`;

    DB_Utils.execQuery(query).then((result) => {
        if (result[0] === undefined)
            res.send({icon:"blank"});
        else
            res.send({icon:"filled"});
    });
});

//removes fav poi from SavedPOI
router.delete('/RemoveFavoritePOI/:ID', function (req, res) {
    var id = req.params.ID;
    var query = `DELETE FROM SavedPOI
    where POIID = '${id}' and username = '${req.username}' `;
    console.log(query);

    DB_Utils.execQuery(query).then((result) => {
        res.send(200);
    });

})
    
router.get('/get2PoiByUserCat', function (req, res) {
    var user = req.username;
    var query = `Select categories from RegUsers Where username = '${user}'`;
    DB_Utils.execQuery(query).then((result) => {
        cats = result[0].categories.split("|");
        Builtquery = BuildQuery(cats);
        
        DB_Utils.execQuery(Builtquery).then((result) => {
            if(result.length<2)
                res.send({
                    Message : "There is only one POI",
                    Categories:cats,
                    'POI': result[0],
                });
            else
            {
                random = RandomNumbers(result.length)
                res.send({
                    Categories:cats,
                    result: result
                });
            }
        })
    });
});

        
//return the number of fav pois for user
router.get('/getNumberOfFavorite', function (req, res) {
    var query = `SELECT * FROM SavedPOI
    where SavedPOI.username='${req.username}'`;

    DB_Utils.execQuery(query).then((result) => {
        
        res.send({Count:result.length.toString()});

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


//update the view
router.post('/UpdatePoiRank', function (req, res) {
    var userToChange = req.body;
    var id = userToChange.id;
    var query = `UPDATE POI
    SET rank = (SELECT AVG(rank)
                         FROM POIRank
                         WHERE POIRank.poiid = '${id}')       
    WHERE ID = '${id}'`;
    console.log(query);
    DB_Utils.execQuery(query).then((result) => {
        
        res.send(result);

    });
});


//Add rank to poi
router.post('/AddRanktoPOI', function (req, res) {
    var query = req.body;
    var user = req.username;
    var rank = query.rank;
    var POI = query.POI;
    var query = `INSERT INTO POIRank (poiid,rank,username) VALUES ('${POI}','${rank}','${user}')`;
    console.log(query);
    var querycheck = `Select * from POIRank Where username = '${user}' AND poiID = '${POI}'`;
 
    DB_Utils.execQuery(querycheck).then((result) => {
        if (result.length>0)
            res.send("you already rated this query");
        else
            DB_Utils.execQuery(query).then((result) => {
                res.send(200);
            })          
    })       

});

//add new poi review
router.post('/AddReviewToPOI', function (req, res) {
    var userToChange = req.body;
    var poiid = userToChange.poiid;
    var review = userToChange.review;
    var username = userToChange.username;
    var query = `INSERT INTO POIReview (POIID,review,username) VALUES ('${poiid}','${review}','${username}')`;
    console.log(query);
    DB_Utils.execQuery(query).then((result) => {
       res.send(200);
    });

});

//return all POI of specific category
router.get('/getPoiByCat/:cat', function (req, res) {
        var category = req.params.cat.toLowerCase();
        cats = [category]
        Builtquery = BuildQuery(cats);
        Builtquery = Builtquery.replace(")","");
        Builtquery = Builtquery.replace("ID,title,description","*");

        DB_Utils.execQuery(Builtquery).then((result) => {
            res.send(result);
        }).catch((e) => {
            res.send(e)
        });
        
    
});

//return all POI of specific category, sorted
router.get('/getSortedPoiByCat/:cat', function (req, res) {
    var category = req.params.cat.toLowerCase();
    cats = [category]
    Builtquery = BuildQuery(cats);
    Builtquery = Builtquery.replace(")","");
    Builtquery = Builtquery.replace("ID,title,description","*");

    DB_Utils.execQuery(Builtquery).then((result) => {
        result.sort(comparePOI);
        res.send(result);
    }).catch((e) => {
        res.send(e)
    });
    

});



//Update the rank entry in POI table
router.put('/UpdateAvgRank', function (req, res) {
    var query = req.body;
    var POI = query.POI;
    var query = `SELECT AVG(rank) as AVG from POIRank Where poiid = '${POI}'`;

    DB_Utils.execQuery(query).then((result) => {
        UpdateQquery = `UPDATE POI SET rank = '${result[0].AVG}' WHERE ID = '${POI}'`
        DB_Utils.execQuery(UpdateQquery).then((result) => {
            res.send(200)
        })
    })        

});

//add new POI
router.post('/addPOI', function (req, res) {
    var newPOI = req.body;
    var city = newPOI.city;
    var title = newPOI.title;
    var description = newPOI.description;
    var rank = newPOI.rank;
    var image = newPOI.image;
    var views = newPOI.views;
    var category = newPOI.category;
    
    
    var city = newPOI.city;
    var query = `INSERT INTO POI (city,title,description,rank,image,views,category) VALUES ('${city}','${title}','${description}','${rank}','${image}','${views}','${category}')`                

    DB_Utils.execQuery(query).then((result) => {
        res.send(200);
    })
        
});

module.exports = router;