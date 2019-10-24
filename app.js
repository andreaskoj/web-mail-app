var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/data');
var session = require('express-session')

// constants
var EMAILS_ON_PAGE = 3;

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Starting webMail app at http://localhost%s%s", host, port);
})

//set up session
app.use(session({
    secret: 'HpSVPhmTFAtpNb0oIrBO',
    resave: true,
    saveUninitialized: true
})) 

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
//    console.log(pageNo);
       
    collection.find({mailbox: type}, {}, function(err, docs){
        if (err === null){
            
            // slice to get only one page 
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
        
    collection.find({_id: id }, {}, function(err, docs){
        if (err === null){
            var mailList = req.session.mailList;
            res.send(emailContentResponseHTML(docs, prepareIDs(mailList, id)));
        } else console.log(err);
    });
});

// function takes mailList from session an current ID to find next and previous ids
function prepareIDs(mailList, currentID) {
    var currentPostionID = mailList.indexOf(currentID);
    var prevID;
    var nextID;

    // if the id position is 0 then only assign next ID
    if(currentID == 0) {
        nextID = mailList[currentPostionID+1];
        prevID = undefined;
    }
    // if the current id is the last one the assign only last ID
    else if(currentID == mailList.length-1) {
        prevID = mailList[currentPostionID-1];
        nextID = undefined;
    }
    else {
        prevID = mailList[currentPostionID-1];
        nextID = mailList[currentPostionID+1];
    }
    return [prevID,nextID];
}

// create view for specific email
function emailContentResponseHTML(data, ids){
    var responseString = "";
    responseString += "<div id='mailContent' class='box'>"
    responseString += "<p>"+data[0]['title']+"</p>";
    responseString += "<p>"+data[0]['time']+"</p>";
    responseString += "<p>"+data[0]['sender']+"</p>";
    responseString += "<p>"+data[0]['recipient']+"</p>";
    responseString += "<p>"+data[0]['content']+"</p>";
    responseString += "<p id='prevID'>"+ids[0]+"</p>";    
    responseString += "<p id='nextID'>"+ids[1]+"</p>";    
    responseString += "</div>";
    return responseString;      
}; 

