var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/data');

// constants
var EMAILS_ON_PAGE = 4;

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Starting webMail app at http://localhost%s%s", host, port);
})

//set default page to webmail.html, initalize database
app.use(express.static('public', {index: 'webmail.html'}), function(req,res,next){
    req.db = db;
    next();
})  

// display list of emails
app.get('/retriveemaillist', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');
    var type = req.query.type;
    var pageNo = parseInt(req.query.page);
       
    collection.find({mailbox: type}, {}, function(err, docs){
        if (err === null){
            // slice to get only one page, due to limited functionality of monk library I have to retive the whole collection and then trim it. 
            var page = docs.slice(EMAILS_ON_PAGE*(pageNo-1),EMAILS_ON_PAGE*pageNo)
            var pagesQty = Math.ceil(docs.length / EMAILS_ON_PAGE);
            
            res.send({response: page, pagesQty: pagesQty});
            
        } else console.log(err);
    });
});

//display specific email 
app.get('/getmail', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');
    var id = req.query.id;

    collection.findOne({_id: id }, {}, function(err, docs){
        if (err === null){
            res.send(docs);
        } else console.log(err);
    });
});



