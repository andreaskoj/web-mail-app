// global list with email IDs from current scope
var emailList = [];
var currentPage = 1;
var pagesQty;
var currentMailbox = "";
var composeHTML = 
    "<div class='box'><h3>Compose a new email</h3> To:<textarea></textarea> <br>Subject:<textarea></textarea><br> <textarea></textarea><br><button>Send</button></div>"

function openMail(ev, emailID) {
    $(".box").remove();
//    $("#mailContent").remove();
    webMailHttpRequest("getmail?id="+emailID);
};  

//// reqType - type of request
//function webMailHttpRequest(reqType) {
//    var xmlhttp = new XMLHttpRequest();
//    
//    xmlhttp.open("GET",reqType, true);
//    xmlhttp.send();
//
//    xmlhttp.onreadystatechange = function() {
//        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
//            $("#loading").hide(); 
//            var responseJSON = JSON.parse(xmlhttp.response);
//            
//            console.log("tesst");
//            console.log(responseJSON);
//            // parsing to JSON format 
//            
////            console.log(responseJSON["emailListID"]);
//            
////            $("#mail").append(xmlhttp.responseText);
//            $("#mail").append(emailListResponseHTML(responseJSON));
////            global = xmlhttp.responseText;
//        }
//    }
//}

$(document).ready(function(){
    retriveEmailList("Inbox");
    
    
// intially tigger inboxButton to open inbox
//    $("#inboxButton").trigger("click");
//    $.get("retriveemaillist?type=Inbox&page=" +currentPage, function(data){
//        $("#loading").hide();         
//        $("#mail").append(emailListResponseHTML(data));
//    });
    
//    webMailHttpRequest("retriveemaillist?type=Inbox&page=" +currentPage);

    $("#composeButton").click(function(){
        
        $(".box").remove();
        $("#mail").append(composeHTML);

        console.log("test compose");   
    });    

    $("#moveToButton").click(function(){
        console.log("test moveTo");  
        console.log(global);
    });    
    
    $("#inboxButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#loading").show(); 

        retriveEmailList("Inbox");
    });   

    $("#importantButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#loading").show(); 

        retriveEmailList("Important");
    });    

    $("#sentButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#loading").show(); 

        retriveEmailList("Sent");
    });     

    $("#trashButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#loading").show(); 
        
        retriveEmailList("Trash");
    }); 

    //previous button implementation
    $("#previousButton").click(function(){
        
        if($("#mailContent").length){
            console.log("mail");
        }

        else {
            if(currentPage == 1){
                return;
            }
            currentPage --;
            $(".box").remove();
            retriveEmailList(currentMailbox);
        }
    });
    
    $("#nextButton").click(function(){
        if($("#mailContent").length){
            console.log("mail")
        }

        else{
            if(currentPage == pagesQty){
                return;
            }
            // increment page number 
            currentPage ++;
            $(".box").remove();
            retriveEmailList(currentMailbox);
        }  
    });
    
    // create list of emails view
    function emailListResponseHTML(data) {

        var responseString ="<ul id='mailList' class='box'>";

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

    function retriveEmailList(type){
        currentMailbox = type;
        $.get("retriveemaillist?type="+type+"&page=" +currentPage, function(data){
            $("#loading").hide();
            emailList = data;
            pagesQty = data["pagesQty"]; $("#mail").append(emailListResponseHTML(data["response"]));
        });
    };

    
});

