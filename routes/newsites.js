var express     = require("express");
var router      = express.Router(),
    mongoose    = require("mongoose"),
    middleware  = require("../middleware/middleware.js");
    

var newSites    = require("../models/newsites");
var Sites       = require("../models/sites");

// GET - Index - /sites - get - Sites.find()
router.get("/", function(req, res) {
    newSites.find({}).sort({ "Area Code": 1, "Block Number": 1, "Structure Name": 1 }).exec(function(err, foundNewSites){
        if(err) {
            console.log(err);
        } else {
            res.render( './newsites/index', { sites: foundNewSites } );
        }
    });    
});

router.post("/search", function(req, res){
    newSites.find( { "Area Code": req.body.areaCode } ).sort( { "Area Code": 1, "Block Number": 1, "Structure Name": 1 } ).exec( function( err, foundNewSites ) {
        if( err ) {
            console.log( err );
        } else {
            res.render( './newsites/index', { sites: foundNewSites } );
        }
    }); 
});

router.post("/edit", function(req, res){
    
    var selected = req.body.select;
    
    newSites.find({
        _id: {
            $in: selected
        }
    }, function(e, o){
        if ( e ) { console.log ( e ) }
        else { 
            res.render( './newsites/edit', { objects: o } );
        }
    });
});


router.post("/add", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
    
    var asset = req.body.asset;
    asset.properties.group = req.user.group;
   
    Sites.create(asset, function(err, docs){
        if( err ) { console.log( err )}
        else {
            console.log( docs );
            res.status(201).send('Success');
        }
    });
});

module.exports = router;