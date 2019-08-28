//======================CLIENT STRUCTS======================

cli_name_obj={
    Firstname: {"S":"yuval"},
    Lastname: {"S":"duek"}
}

new_cli_form={
    Firstname: {"S": "yuval"},
    Lastname: {"S": "duek"},
    Phone: {"S": "050"},
    Workplace: {"S": "aroma"},
    Credit: {"S": "0"}//,
    //Actions: {"L":[{"M": {"Date":{"S":"-1"}}, {"Action":{"S":"-1"}} }] }
}

var clients = []
var names
//======================LOAD PAGE======================
/**
 * wait to load the page
 */
$( document ).ready(function() {
    console.log('page is fully loaded');
    $(".addCliForm").hide();
    refresh_all_cli_list();
    $("#client_div").hide();
    var clicked_cli_id=-1;
});

//======================REFRESH PAGE======================
/**
 * this function refresh the client list
 */
function refresh_all_cli_list(){
    $( "li" ).remove();
    const Http = new XMLHttpRequest();
    var url='https://832ikitvi4.execute-api.us-east-1.amazonaws.com/Credits/getCostumers';
    Http.responseType = 'json';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => { 
        if(Http.response!=null){
            cli_arr=Http.response.body.Items
            //console.log(cli_arr)
            cli_arr.forEach(loadClients);
            clients=cli_arr;
            $(search())
        }
    }
}

/**
 * to make the list of clients clickable
 * @param {the struct of the client} item 
 * @param {the index of the client} index 
 */
function loadClients(item, index) {
    //console.log(item)
	$(document).ready(function(){
		$("ul").append("<li onClick=onClickCli(this.id) id=\""+index+"\">"+index+": "+item.Firstname.S+" "+item.Lastname.S+"</li>");
  
    });
}

//=======================SEARCH CLIENT==================

function search() {
    console.log(clients)
    $( "#search" ).autocomplete({
      source: clients.map((item, index)=>{
          return index + ': ' + item.Firstname.S + ' ' + item.Lastname.S
      }),
      select: function(event, ui){
        var item = ui.item;
        var itemValue = item.value.substring(0, item.value.indexOf(":"))
        onClickCli(itemValue)
        return false
      }
    });
}


//======================ADD CLIENT======================

/**
 * on click listener for the add client buttom
 * open the add client form
 */
function onClickAddCli(){
	$(".addCliForm").show();
}

/**
 * on click listener for the submit new client form buttom
 * update the new client obj by the form
 * sent POST HTTP request to the server to add new client to the system
 */
function onClickSub(){
    new_cli_form.Lastname.S=$("#lastname").val();
	new_cli_form.Firstname.S=$("#firstname").val();
	new_cli_form.Phone.S=$("#phoneNum").val();
    new_cli_form.Workplace.S=$("#workPlace").val();
    new_cli_form.Credit.S=$("#credit").val().toString();
    if (new_cli_form.Credit.S==null || new_cli_form.Credit.S=="")
        new_cli_form.Credit.S="0"
    console.log(new_cli_form)
    const Http = new XMLHttpRequest();
    var url='https://832ikitvi4.execute-api.us-east-1.amazonaws.com/Credits/addCostumer';
    Http.responseType = 'json';
    Http.open("POST", url);
    Http.send(JSON.stringify(new_cli_form));
    Http.onreadystatechange = (e) => { 
        if(Http.response!=null){
            //do something with ans
            $(".addCliForm").hide();
            refresh_all_cli_list();
        }
    }

	
  }


/**
 * on click listener for cancel add cliend action
 */
function onClickCancel(){
    $(".addCliForm").hide();
  }


//======================CLIENT SCREEN-SHOW/DELETE======================

/**
 * on click listener for a client. open a window with all the client details
 */
function onClickCli(caller_id){
    console.log("clicked on costomer")

    console.log(clients[Number(caller_id)])
    clientInformation=clients[Number(caller_id)]
    console.log(clientInformation.Firstname.S)
    clicked_cli_id=Number(caller_id);

    $("#client_div").show();
    $("#add_action").hide();
    $("#client_name").html(clientInformation.Firstname.S+" "+clientInformation.Lastname.S);
    $("#client_details").html(clientInformation.Phone.S+" "+clientInformation.Workplace.S);
    $("#client_credit").html("CREDIT: "+clientInformation.Credit.S);
    $("#client_actions").html("<h2>Last actions:</h2>");
    /*$(".client_actions").append("<table>");
    $(".client_actions").append("<tr><th>Date</th><th>Action</th></tr>");
    clientInformation.actions.forEach(actionsTable);
    $(".client_actions").append("</table>");*/
}

/**
 * TODO
 * @param {} item 
 */
  function actionsTable(item) {
	$(".client_div").append("<tr><th>"+item.Date+"</th><th>"+item.Action+"</th></tr>");
}

/**
 * on cluck listener to hide a client window
 */
function onClickHideCli(){
    $("#client_div").hide();
    clicked_cli_id=-1;
}


/**
 * on click listener for delete client.
 */
function onClickDeleteCli(){
    console.log(clicked_cli_id);
    cli_name_obj.Firstname.S=clients[clicked_cli_id].Firstname.S
    cli_name_obj.Lastname.S=clients[clicked_cli_id].Lastname.S
    console.log(cli_name_obj);

    const Http = new XMLHttpRequest();
    var url='https://832ikitvi4.execute-api.us-east-1.amazonaws.com/Credits/deleteCostumer';
    Http.responseType = 'json';
    Http.open("DELETE", url);
    Http.send(JSON.stringify(cli_name_obj));
    Http.onreadystatechange = (e) => { 
        if(Http.response!=null){
            //do something with ans
            refresh_all_cli_list();
        }
    }
}


//======================CLIENT SCREEN-SHOW/DELETE======================


/**
 * on click listener to edit client.
 */
  function onClickEditCli(){

    console.log("onClickEditCli");
    $("#edit_details").show();
    clientInformation=clients_list[Number(clicked_cli_id)];
    $("#edit_details").html("Phone: <input type=\"number\" id=\"edit_phone\" value=\""+Number(clientInformation.Phone.S)+"\"><br>"
    +"Work place: <input type=\"text\" id=\"edit_workPlace\" value=\""+clientInformation.Workplace.S+"\"><br>"
    +"<button onclick=onClickSubEdit()>Submit</button>");
    
  }


/**
* on click method when submit a details change of a client.
 */
function onClickSubEdit(){
    var new_phone=$("#edit_phone").val();
    var new_workPlace=$("#edit_workPlace").val();
    clientInformation=clients_list[Number(clicked_cli_id)];

    update_cli_struct={
        ExpressionAttributeNames: {"#P": "Phone","#W": "Workpalce"},
        ExpressionAttributeValues: {":p": {"S":new_phone}, ":w": {"S":new_workPlace}},
        Key: {Firstname: {"S": clientInformation.Firstname.S}, Lastname: {"S": clientInformation.Lastname.S}},
        ReturnValues: "ALL_NEW",
        TableName: "Costumers",
        UpdateExpression: "SET #W = :w, #P = :p"
    }
    console.log(update_cli_struct);
    sent_put_http_req(update_cli_struct)
    $("#edit_details").hide();
    onClickHideCli();

  }


/**
 * on click listener to edit client's credit, and update it as his last action.
 */
function onClickEditCredit(){
    $("#add_action").show();
}


/**
 * on click listener for submit new action
 */
function onClickSubAction(){
    //get the new action sum
    var new_action=$("#add_credit").val();

    //current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    console.log("the action "+new_action+"\t the date "+today);

    //update the client credit
    clientInformation=clients[Number(clicked_cli_id)];
    new_action=Number(new_action);
    clientInformation.Credit.S=(Number(clientInformation.Credit.S)+new_action).toString();
    $("#client_credit").html("CREDIT: "+clientInformation.Credit.S);
    update_cli_struct={
        ExpressionAttributeNames: {"#C":"Credit"},
        ExpressionAttributeValues: {":c": {"S":clientInformation.Credit.S}},
        Key: {Firstname: {"S": clientInformation.Firstname.S}, Lastname: {"S": clientInformation.Lastname.S}},
        ReturnValues: "ALL_NEW",
        TableName: "Costumers",
        UpdateExpression: "SET #C = :c"
    }

    sent_put_http_req(update_cli_struct)
    $("#add_action").hide();
}


/**
 * this method sent HTTP put request to update costumer details
 * @param {the fields to update} update_cli_struct 
 */
function sent_put_http_req(update_cli_struct){
     //sent http put request to update the client on the server
     const Http = new XMLHttpRequest();
     var url='https://832ikitvi4.execute-api.us-east-1.amazonaws.com/Credits/updateCostumer';
     Http.responseType = 'json';
     Http.open("PUT", url);
     Http.send(JSON.stringify(update_cli_struct));
     Http.onreadystatechange = (e) => { 
         if(Http.response!=null){
             refresh_all_cli_list();
         }
     }
}




