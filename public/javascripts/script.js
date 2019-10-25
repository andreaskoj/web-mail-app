// global list with email IDs from current scope
var emailListID = [];
var emailList = [];
var currentPage = 1;
var pagesQty;
var currentMailbox = "";
var composeHTML = 
    "<div class='box'><h3>Compose a new email</h3> To:<textarea id='taTo'></textarea> <br>Subject:<textarea id='taSubject'></textarea><br><textarea id='taContent'></textarea><br><button id='btSend'>Send</button></div>"

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
    responseString += "<p>"+data['title']+"</p>";
    responseString += "<p>"+data['time']+"</p>";
    responseString += "<p>"+data['sender']+"</p>";
    responseString += "<p>"+data['recipient']+"</p>";
    responseString += "<p>"+data['content']+"</p>";
    responseString += "<p id='hiddenID'>"+data['_id']+"</p>";    
    responseString += "</div>";
    return responseString;      
}; 

$(document).ready(function(){
    
    // retrive initial email llist
    retriveEmailList("Inbox");
    $("#inboxButton").addClass("selected");    

    //dynamically generated object;
    $('#mail').on('click', '#btSend', function() {
        
           var to = $("#taTo").val();
           var subject = $("#taSubject").val();
           var content = $("#taContent").val();

            console.log(to);
            console.log(subject);
            console.log(content);
        
        $.post( "sendemail", { to: to, subject: subject, content: content}, function(data){
            
            
            });
    });
    
    $("#composeButton").click(function(){
        $(".box").remove();
        $("#mail").append(composeHTML);
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

        retriveEmailList("Inbox");
    });   

    $("#importantButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();

        retriveEmailList("Important");
    });    

    $("#sentButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();

        retriveEmailList("Sent");
    });     

    $("#trashButton").click(function(){
        currentPage=1;
        $("#mailbox>div").removeClass("selected");
        $(this).addClass("selected");
        $(".box").remove();
        
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
 
    // create list of emails view
    function emailListResponseHTML(data) {

        var responseString ="<ul id='mailList' class='box'>";

        responseString += "<li><span>Recipient</span><span>Title</span><span>Time</span></li>"

        for (var i = 0; i < data.length; i++) {

            var email = data[i];
            
            var emaiID = '"';
            emaiID += email["_id"];
            emaiID += '"';

            responseString += "<li><input type='checkbox'><div class='email-line' onclick='openMail("+emaiID+")' ><span>";
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
        $.get("retriveemaillist?type="+type+"&page=" +currentPage, function(data){
            $("#loading").hide();
            
            // update ids
            emailListID=[];
            data["response"].forEach(function(element){
                emailListID.push(element['_id']);
            }) 
            
            emailList = data["response"];
            
            pagesQty = data["pagesQty"]; $("#mail").append(emailListResponseHTML(data["response"]));
        });
    };

});

