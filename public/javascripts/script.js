// init self invoking function which fetches inbox emails
(function () {
    webMailHttpRequest("inbox");
})();

function inboxButton(ev){
    //removes selected lass from all divs in mailbox div
    $("#mailbox>div").removeClass("selected");
    //adds class selected to this id
    $("#"+ev.target.id).addClass("selected");
    // remove previous content
    $("#mailList").remove();
    // show loading circle
    $("#loading").show(); 
    
    webMailHttpRequest("inbox");
};

function importantButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("important");
};

function sentButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("sent");
};

function trashButton(ev){
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
    $("#mailList").remove();
    $("#loading").show(); 
    
    webMailHttpRequest("trash");
};

    
// reqType - type of request
function webMailHttpRequest(reqType) {
    
    console.log("init wmhr");
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
