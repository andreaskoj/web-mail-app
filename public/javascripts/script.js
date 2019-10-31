/*

Future outlook (things that could be implemented):

- all textareas before sending to the server should be santitized 
- sent mails dont't parse special characters
- fetched list of mails is not in the the order from the newest to oldest 
- js client code could be optimised, there is still quite a lot redundacy
- ui for smaller screens could be imporved 
- email adress format should be checked and the user should be informed about incorrect format
- the app should be tested with diffrent length of data fetched from the database to check if the UI is still concise. 
*/

// global variables
var currentUserEmail = "kojandreas@gmail.com";
var mailboxesList = ["Inbox","Important","Sent","Trash"]
var emailListID = [];
var emailList = [];
var currentPage = 1;
var pagesQty;
var currentMailbox = "";
var composeHTML = 
    "<div class='box'><h3>Compose a new email</h3><textarea id='taTo' rows='1' cols='40' placeholder='To:'></textarea><textarea id='taSubject' rows='1' placeholder='Subject:'></textarea><textarea id='taContent' rows='40' placeholder='Message:'></textarea><button id='btSend'>Send</button></div>"

function openMail(emailID) {

    $(".box").remove();
    $.get("getmail?id="+emailID , function(data){

            $("#loading").hide();
            $("#mail").append(emailContentResponseHTML(data));
            
            var currentID = $("#hiddenID").html();
            var currentPostion = emailListID.indexOf(currentID);
            var emailListLen = emailList.length;            
        });
};

function emailContentResponseHTML(data){
    
    var responseString = "";
    responseString += "<div id='mailContent' class='box'>"
    responseString += "<div id='emailHeader'><span>Subject: </span><span>"+data['title']+"</span>";
    responseString += "<span>"+data['time']+"</span><span>Time:</span></div>";
    responseString += "<div id='emailSender'><span>Sender: </span><span>"+data['sender']+"</span></div>";
    responseString += "<div id='emailReceiver'><span>Receiver: </span><span>"+data['recipient']+"</span></div>";
    responseString += "<div id='emailContent'><span>Content: </span><span>"+data['content']+"</span></div>";
    responseString += "<span id='hiddenID'>"+data['_id']+"</span>";    
    responseString += "</div>";
    return responseString;      
}; 

$(document).ready(function(){
    
    //dynamically generated object;
    $('#mail').on('click', '#btSend', function() {
        
           var to = $("#taTo").val();
           var subject = $("#taSubject").val();
           var content = $("#taContent").val();
        
        $.post("sendemail", { to: to, subject: subject, content: content, from: currentUserEmail}, function(data){
            
                $(".box").remove();
                retriveEmailList(currentMailbox);
                $("#arrows").show();
                $("#moveToButton").show(); 
            });
    });

    // assign event listeners to dropdown list elements
    $( ".dropdown-item div" ).on( "click", function() {
        var mailboxName = $(this).text();
        var idsToMove =[];
        $("#mailList input").each(function(){
            
            if($(this).is(':checked')){
                var checkedEmail = $(this).parent().children()[1];  
                var checkEmailID = $(checkedEmail).attr("emailID")

                idsToMove.push(checkEmailID);                
            }; 
        });     
                
        if(idsToMove.length > 0){
            $.post("changeemailbox", { id: idsToMove, newEmailBox: mailboxName}, function(data){
            
                // update current mailbox
                $(".box").remove();
                retriveEmailList(currentMailbox);
            });
        }
        
        console.log(idsToMove.length);
    });
        
    $("#composeButton").click(function(){
        $(".box").remove();
        $("#arrows").hide();
        $("#moveToButton").hide();
        $("#mail").append(composeHTML); 
    });      
    
    $("#inboxButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#moveToButton").show();         
        retriveEmailList("Inbox");
    });
    
    $("#importantButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#moveToButton").show(); 
        retriveEmailList("Important");
    });    

    $("#sentButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#moveToButton").show(); 
        retriveEmailList("Sent");
    });     

    $("#trashButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        $("#moveToButton").show();         
        retriveEmailList("Trash");
    }); 

    //previous button behaviour implementation
    $("#previousButton").click(function(){
        
        if($("#mailContent").length){
            var currentID = $("#hiddenID").html();
            var currentPostion = emailListID.indexOf(currentID);
            var emailListLen = emailList.length;
                              
            if(currentPostion == 0){
                                
                if(currentPage == 1){
                    return;
                }
                
                currentPage--;
                $.get("retriveemaillist?type="+currentMailbox+"&page="+currentPage, function(data){
                        emailList = data["response"];
                    
                // update ids
                emailListID=[];
                data["response"].forEach(function(element){
                    emailListID.push(element['_id']);
                }) 
                        $(".box").remove();
                      $("#mail").append(emailContentResponseHTML(emailList[emailListID.length-1]));   
                });                
            }   
            else {
                $(".box").remove();
                $("#mail").append(emailContentResponseHTML(emailList[currentPostion-1]));                
            }        
        }
        // email list 
        else {
            if(currentPage == 1){
                return;
            }
            currentPage --;
            $(".box").remove();
            retriveEmailList(currentMailbox);
        }
    });
    
    // next button behaviour implementation
    $("#nextButton").click(function(){
        if($("#mailContent").length){

            var currentID = $("#hiddenID").html();
            var currentPostion = emailListID.indexOf(currentID);
            var emailListLen = emailList.length;

            if(currentPostion == emailListLen-1) {
                
                if(currentPage == pagesQty){
                    return;
                }
                currentPage++;
                $.get("retriveemaillist?type="+currentMailbox+"&page="+currentPage, function(data){
                        emailList = data["response"];
                    
                // update ids
                emailListID=[];
                data["response"].forEach(function(element){
                    emailListID.push(element['_id']);
                }) 
                        $(".box").remove();
                      $("#mail").append(emailContentResponseHTML(emailList[0]));   
                });
            }
            
            else{
                $(".box").remove();
                $("#mail").append(emailContentResponseHTML(emailList[currentPostion+1]));            
            }
        }

        else {
            if(currentPage == pagesQty){
                return;
            }
            
            // increment page number 
            currentPage ++;
            $(".box").remove();
            retriveEmailList(currentMailbox);
        }  
    });
 
    // triggers clicking on the inboxButton (initialize the app)
    $( "#inboxButton" ).trigger( "click");

    // create list of emails view
    function emailListResponseHTML(data) {

        var responseString ="<ul id='mailList' class='box'>";

        responseString += "<li><span>Recipient</span><span>Title</span><span>Time</span></li>"

        for (var i = 0; i < data.length; i++) {

            var email = data[i];
            
            var emaiID = '"';
            emaiID += email["_id"];
            emaiID += '"';

            responseString += "<li><input type='checkbox'><div class='email-line' emailID = "+emaiID+" onclick='openMail("+emaiID+")' ><span>";
            responseString += email['recipient'];
            responseString +="</span><span>";
            responseString += email['title'];
            responseString +="</span><span>";
            responseString += email['time'];
            responseString +="</span></div>";
            responseString += "</li>";
        }
        responseString += "</ul>";                
        return responseString;
    };  
    
    function retriveEmailList(type){
        currentMailbox = type;
        updateDropdown();
        $.get("retriveemaillist?type="+type+"&page=" +currentPage, function(data){
            $("#loading").hide();
            
            // update ids
            emailListID=[];
            data["response"].forEach(function(element){
                emailListID.push(element['_id']);
            }) 
            
            emailList = data["response"];
            pagesQty = data["pagesQty"]; 
            
            $("#mail").append(emailListResponseHTML(data["response"]));
            
            if(pagesQty==1){
                $("#arrows").hide();
            }
            else{
                $("#arrows").show();
            }
        });
    };
    
    function updateDropdown(){ 
        
        var moveToMailboxes = mailboxesList.filter(word => word != currentMailbox)
                
        var index = 0;
        $(".dropdown-item div").each(function(){
            
            $(this).text(moveToMailboxes[index]);
            index ++;
        });
    } 
});

