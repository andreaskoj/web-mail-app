// init self invoking function which fetches inbox emails
(function () {
    webMailHttpRequest("retriveemaillist?type=Inbox");
})();

function inboxButton(ev){
    //removes selected lass from all divs in mailbox div
    $("#mailbox>div").removeClass("selected");
    //adds class selected to this id
    $("#"+ev.target.id).addClass("selected");
    // remove mail list 
    $("#mailList").remove();
    // remove mail content
    $("#mailContent").remove();
    // show loading circle
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Inbox");
};

function importantButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Important");
};

function sentButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Sent");
};

function trashButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#mailContent").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("retriveemaillist?type=Trash");
};

function moveToButton(ev) {
    console.log("clicked!");
}

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

function openMail(ev, emailID) {
    $("#mailList").remove();
    $("#mailContent").remove();
    webMailHttpRequest("getmail?id="+emailID);
};
 
// reqType - type of request
function webMailHttpRequest(reqType) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",reqType, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            $("#loading").hide(); 
            $("#mail").append(xmlhttp.responseText); 
        }
    }
}
