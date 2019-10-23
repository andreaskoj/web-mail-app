var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/data');
var session = require('express-session')

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
       
    collection.find({mailbox: type}, {}, function(err, docs){
        if (err === null){
            
            //create list of ids and store it in session 
            req.session.mailList = [];
            for(var i=0; i<docs.length; i++) {
                req.session.mailList.push(docs[i]["_id"]);
            }
            
            var emailListResponse = emailListResponseHTML(docs);
//            res.send({response: emailListResponse, emailListID: "test"});
            res.send(emailListResponse);
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
    responseString += "<div id='mailContent'>"
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

// create list of emails view
function emailListResponseHTML(data) {
    
    var responseString ="<ul id='mailList'>";
    
    responseString += "<li><span>Recipient</span><span>Title</span><span>Time</span></li>"
    
    for (var i = 0; i < data.length; i++) {
        
        var email = data[i];
        var emaiID = '"';
        emaiID += email["_id"];
        emaiID += '"';
        
        responseString += "<li><input type='checkbox'><div class='email-line' onclick='openMail(event,"+emaiID+")'><span>";
        responseString += email['recipient'];
        responseString +="</span><span>"
        responseString += email['title'];
        responseString +="</span><span>"
        responseString += email['time'];
        responseString +="</span></div>";
        responseString += "</li>";
        
    }
    responseString += "</ul>";
    return responseString;
};
