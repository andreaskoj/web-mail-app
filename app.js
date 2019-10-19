var express = require('express');
var app = express();
var monk = require('monk');
var db = monk('localhost:27017/data');

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

app.get('/inbox', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');

    collection.find({mailbox: 'Inbox'}, {}, function(err, docs){
        if (err === null){
            res.send(emailResponseHTML(docs));
        } else console.log(err);
    });
    
});

app.get('/important', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');

    collection.find({mailbox: 'Important'}, {}, function(err, docs){
        if (err === null){
            res.send(emailResponseHTML(docs));
        } else console.log(err);
    });
    
});

app.get('/sent', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');

    collection.find({mailbox: 'Sent'}, {}, function(err, docs){
        if (err === null){
            res.send(emailResponseHTML(docs));
        } else console.log(err);
    });
    
});

app.get('/trash', function(req, res){
    var db = req.db;
    var collection = db.get('emailList');

    collection.find({mailbox: 'Trash'}, {}, function(err, docs){
        if (err === null){
            res.send(emailResponseHTML(docs));
        } else console.log(err);
    });
    
});

function emailResponseHTML(data) {
    
    var responseString ="<ul id='mailList'>";
    
    responseString += "<li><span>Recipient</span><span>Title</span><span>Time</span></li>"
    
    for (var i = 0; i < data.length; i++) {
        var email = data[i];
        responseString += "<li><input type='checkbox'><span>";
        responseString += email['recipient'];
        responseString +="</span><span>"
        responseString += email['title'];
        responseString +="</span><span>"
        responseString += email['time'];
        responseString += "</span>";
        responseString += "</li>"
    }
    
    responseString += "</ul>";
    
    return responseString;
}
