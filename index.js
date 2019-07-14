/**
 * wait to load the page
 */
$( document ).ready(function() {
    console.log('page is fully loaded');
    $(".addCliForm").hide();
    refresh_all_cli_list()
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
        }
    }
}



function loadClients(item, index) {
    //console.log(item)
	$(document).ready(function(){
		$("ul").append("<li>"+index+": "+item.Firstname.S+" "+item.Lastname.S+"</li>");
  
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

//new client obj to fill
new_cli_form={
    first_name: "yuval",
    last_name: "duek",
    phone_num: "050",
    work_place: "aroma"
}

/**
 * on click listener for the submit new client form buttom
 * update the new client obj by the form
 * sent POST HTTP request to the server to add new client to the system
 */
function onClickSub(){
    new_cli_form.last_name=$("#lastname").val();
	new_cli_form.first_name=$("#firstname").val();
	new_cli_form.phone_num=$("#phoneNum").val();
    new_cli_form.work_place=$("#workPlace").val();
    console.log(new_cli_form)
    // const Http = new XMLHttpRequest();
    // var url='https://832ikitvi4.execute-api.us-east-1.amazonaws.com/Credits/addCostumer';
    // Http.responseType = 'json';
    // Http.open("POST", url);
    // Http.send();
    // Http.onreadystatechange = (e) => { 
    //     if(Http.response!=null){
    //         //do something with ans
    //     }
    // }
	$(".addCliForm").hide();
	
  }
//======================CLIENT SCREEN-SHOW/EDIT/DELETE======================
/**
 * on click listener for a client. open a window with all the client details
 */
function onClickCli(){
    $(".client_div").show();
    $(".client_div").append("<h1>"+clientInformation.Firstname+" "+clientInformation.Lastname+"</h1>");
    $(".client_div").append("<h2>CREDIT: "+clientInformation.credit+"</h1>");
    $(".client_div").append("<h2>Last actions:</h2>");
    $(".client_div").append("<table>");
    $(".client_div").append("<tr><th>Date</th><th>Action</th></tr>");
    clientInformation.actions.forEach(actionsTable);
    $(".client_div").append("</table>");
}

  function actionsTable(item) {
	$(".client_div").append("<tr><th>"+item.Date+"</th><th>"+item.Action+"</th></tr>");
}

/**
 * on click listener for delete client.
 */
  function onClickDeleteCli(){

  }

/**
 * on click listener to edit client.
 */
  function onClickEditCli(){}

 /**
 * on click listener to edit client's credit, and update it as his last action.
 */
function onClickEditCredit(){}




