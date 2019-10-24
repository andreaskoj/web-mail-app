// global list with email IDs from current scope
var emailListID = [];
var currentPage= 2;
var composeHTML = 
    "<div class='box'><h3>Compose a new email</h3> To:<textarea></textarea> <br>Subject:<textarea></textarea><br> <textarea></textarea><br><button>Send</button></div>"

function openMail(ev, emailID) {
    $(".box").remove();
//    $("#mailContent").remove();
    webMailHttpRequest("getmail?id="+emailID);
};  

// reqType - type of request
function webMailHttpRequest(reqType) {
    var xmlhttp = new XMLHttpRequest();
    
//    console.log(reqType);
//    
    xmlhttp.open("GET",reqType, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            $("#loading").hide(); 
            
//            var responseJSON = JSON.parse(xmlhttp.response);
            
//            console.log(responseJSON["emailListID"]);
            
            $("#mail").append(xmlhttp.responseText);
//            global = xmlhttp.responseText;
        }
    }
}

$(document).ready(function(){

    webMailHttpRequest("retriveemaillist?type=Inbox&page=" +currentPage);

    $("#composeButton").click(function(){
        
        $(".box").remove();
        $("#mail").append(composeHTML);

        console.log("test compose");   
    });    

    $("#moveToButton").click(function(){
        console.log("test moveTo");  
        console.log(global);
    });    

//    $(".email-line").click(function(){
//        $(".box").remove();
//        
//        
//        webMailHttpRequest("getmail?id="+emailID);
//    });
    
    $("#inboxButton").click(function(){
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#loading").show(); 

        webMailHttpRequest("retriveemaillist?type=Inbox");
    });   

    $("#importantButton").click(function(){

        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
//        $("#mailContent").remove();
        $("#loading").show(); 

        webMailHttpRequest("retriveemaillist?type=Important");   
    });    

    $("#sentButton").click(function(){

        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
//        $("#mailContent").remove();
        $("#loading").show(); 

        webMailHttpRequest("retriveemaillist?type=Sent");  
    });     

    $("#trashButton").click(function(){

        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
//        $("#mailContent").remove();
        $("#loading").show(); 

        webMailHttpRequest("retriveemaillist?type=Trash");   
    }); 

    $("#previousButton").click(function(){
        
        if($("#mailContent").length){
            console.log("mail ")

        }

        else {
            // implement witching pages of emails
            console.log("mail list")
        }
         
    });



//    //logic for previous button 
//    function previousButton(ev) {
//        // check if the mail details view is on the screen
//        if($("#mailContent").length){
//            var prev =$("#prevID").html(); 
//
//            if (prev != "undefined"){
//                openMail(ev,prev);
//            }    
//        }
//
//        else {
//            // implement witching pages of emails
//            console.log("mail view list")
//        }
//    };

    //logic for next button
    function nextButton(ev) {
        if($("#mailContent").length){
            var next = $("#nextID").html(); 

            if (next != "undefined"){
                openMail(ev,next);
            }           
        }

        else{
            // implement witching pages of emails
            console.log("mail view list")
        }  
    };


});