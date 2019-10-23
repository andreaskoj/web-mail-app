// global list with email IDs from current scope
var emailListID = [];

function openMail(ev, emailID) {
    $("#mailList").remove();
    $("#mailContent").remove();
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

webMailHttpRequest("retriveemaillist?type=Inbox");
    
$("#composeButton").click(function(){
        console.log("test compose");      
});    
    
$("#moveToButton").click(function(){
        console.log("test moveTo");  
    console.log(global);
});    
        
$("#inboxButton").click(function(){
    //removes selected lass from all divs in mailbox div
    $("#mailbox>div").removeClass("selected");
    //adds class selected to this id    
    $(this).addClass("selected");
    // remove mail list     
    $("#mailList").remove();
    // remove mail content    
    $("#mailContent").remove();
    // show loading circle
    $("#loading").show(); 

    webMailHttpRequest("retriveemaillist?type=Inbox");
});   

$("#importantButton").click(function(){

    $("#mailbox>div").removeClass("selected");
    $(this).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Important");   
});    

$("#sentButton").click(function(){

    $("#mailbox>div").removeClass("selected");
    $(this).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Sent");  
});     

$("#trashButton").click(function(){

    $("#mailbox>div").removeClass("selected");
    $(this).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Trash");   
}); 

  
    
    
    
//logic for previous button 
function previousButton(ev) {
    // check if the mail details view is on the screen
    if($("#mailContent").length){
        var prev =$("#prevID").html(); 
        
        if (prev != "undefined"){
            openMail(ev,prev);
        }    
    }
    
    else {
        // implement witching pages of emails
        console.log("mail view list")
    }
};

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