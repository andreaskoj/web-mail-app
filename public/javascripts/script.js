// init self invoking function which fetches inbox emails
(function () {
    webMailHttpRequest("inbox");
})();


function inboxButton(ev){
    console.log("INBOX Button");
    //removes selected lass from all divs in mailbox div
    //adds class selected to this id
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
//    httpRequest("inbox");   

};

function importantButton(ev){
    console.log("IMPORTANT Button");
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
};

function sentButton(ev){
    console.log("SENT Button");
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
};

function trashButton(ev){
    console.log("TRASH Button");
    $("#mailbox>div").removeClass("selected");
    $("#"+ev.target.id).addClass("selected");
};

// reqType - type of request
function webMailHttpRequest(reqType) {
    
    console.log("init wmhr");
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open("GET",reqType, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("REQUEST OK");    
            $("#loader").hide(); 
            $("#mail").html(xmlhttp.responseText); 
        }
    }
}
