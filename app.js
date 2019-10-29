var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/data');

// constants
var EMAILS_ON_PAGE = 3;

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

app.post('/sendemail', express.urlencoded({extended: true}), function(req,res){
    var db = req.db;
    var collection = db.get('emailList');
    
    collection.insert({'sender':req.body.from, 'recipient': req.body.to, 'title':req.body.subject, 'time': getDatestamp(), 'content': req.body.content, 'mailbox':'Sent'}, function(){
        console.log("mail added");
    }); 
    
    console.log(req.body.to);
    console.log(req.body.from);
    console.log(req.body.subject);
    console.log(req.body.content);
    console.log(getDatestamp());
    
    //sending empty response if added to the databse 
    res.end();
    
});
//20:32:01 Fri Oct 11 2019
function getDatestamp(){
    var currentDateString = "";
    var datestamp = new Date();
    var time = datestamp.toTimeString();
    
    currentDateString += time.substr(0, time.indexOf(" ")) + " ";
    currentDateString += datestamp.toDateString()
    
    return currentDateString;
}

