var spotInfo;

function navsize() {
  var navbar = document.getElementById('navbar');
  var blocker = document.getElementById('blocker');

  //blocker.setAttribute("style","width:500px");navbar.clientHeight;

  var height = navbar.clientHeight + 'px';

  blocker.setAttribute('style' , 'display:block;height:' + height);
  blocker.style.height = height;

  console.log('resize:' + height);

  //todo if we are full collumn, make nav not fixed it will cover the content
  
  return height;

}

function load() {
  navsize();

  //todo delete allspots.json
  spotInfo = JSON.parse(spotJSON);
}

function onCountySelect(countyName) {
  navbar = document.getElementById('spotNav');
  body = document.getElementById('mainwindow');

  clearNode(body);
  clearNode(navbar);

  for (var i = 0; i < spotInfo[countyName].length; i++) {
    //<li><a href='#'>test1</a></li>
    var listitem = document.createElement('li');
    var anchor = document.createElement('a');
    anchor.setAttribute('href', '#' + spotInfo[countyName][i]['spot_name']);
    anchor.appendChild(document.createTextNode(spotInfo[countyName][i]['spot_name']));
    listitem.appendChild(anchor);
    navbar.appendChild(listitem);

    //add spot to body
    var panel = document.createElement('div');
    panel.setAttribute('class', 'panel panel-default');
    panel.setAttribute('id', spotInfo[countyName][i]['spot_name']);
    var pHead = document.createElement('div');
    pHead.setAttribute('class', 'panel-heading');
    var pBody = document.createElement('div');
    pBody.setAttribute('class', 'panel-body');

    pHead.appendChild(document.createTextNode(spotInfo[countyName][i]['spot_name']));

    panel.appendChild(pHead);
    panel.appendChild(pBody);
    body.appendChild(panel);
  }

  navsize();

  for (var i = 0; i < spotInfo[countyName].length; i++) {
    //add spot to body
    var panel = document.createElement('div');
    panel.setAttribute('class', 'panel panel-default');
    panel.setAttribute('id', spotInfo[countyName][i]['spot_name']);
    var pHead = document.createElement('div');
    pHead.setAttribute('class', 'panel-heading');
    var pBody = document.createElement('div');
    pBody.setAttribute('class', 'panel-body');

    pHead.appendChild(document.createTextNode(spotInfo[countyName][i]['spot_name']));

    panel.appendChild(pHead);
    panel.appendChild(pBody);
    //body.appendChild(panel);

    var anchor = document.createElement('a');
    anchor.setAttribute('class','spotAnchor');
    anchor.setAttribute('id',spotInfo[countyName][i]['spot_name']);
    body.appendChild(anchor);

    makeAjaxcalls(spotInfo[countyName][i],document.getElementById(spotInfo[countyName][i]['spot_name']));

  }

  waterTempAjax(countyName);
}

function waterTempAjax(countyName){
  console.log("water temp for " + countyName);

  //todo implement
  //todo make ajax for water temp
  //todo define class of html element in each list item to update
}

function makeAjaxcalls(spot, htmlContainer){

  //Spitcast call
  var spotReq = new XMLHttpRequest();
  //todo respond to error creating

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        ajaxReturnSpitcast(spot,htmlContainer,this.response);
      } else {
        //todo handle errer here
        console.log(spot['spot_name'] + " response:" + this.status);
      }
    }
  };

  var url = "http://api.spitcast.com/api/spot/forecast/" + spot['spot_id'] + "/";
  spotReq.open('POST', 'corsurl.php');
  spotReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  spotReq.send('url=' + url);

}

function ajaxReturnSpitcast(spot,htmlContainer, JSONdata){
  htmlContainer.appendChild(document.createTextNode(JSONdata));
}


//empyt contents of an HTML element
function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

var spotJSON = '{"Sonoma":[{"county_name":"Sonoma","latitude":38.4395930032,"longitude":-123.1264469919,"spot_id":694,"spot_name":"Goat Rock"},{"county_name":"Sonoma","latitude":38.351613979665,"longitude":-123.07019379396,"spot_id":107,"spot_name":"Salmon Creek"}],"Marin":[{"county_name":"Marin","latitude":38.25173671725,"longitude":-122.97220607458,"spot_id":109,"spot_name":"Dillon Beach"},{"county_name":"Marin","latitude":37.901189197748,"longitude":-122.68965344323,"spot_id":592,"spot_name":"The Patch"},{"county_name":"Marin","latitude":37.903464512429,"longitude":-122.68152044023,"spot_id":110,"spot_name":"Bolinas"},{"county_name":"Marin","latitude":37.893586518216,"longitude":-122.639142788,"spot_id":111,"spot_name":"Stinson Beach"},{"county_name":"Marin","latitude":37.831304879997,"longitude":-122.5397845322,"spot_id":112,"spot_name":"Fort Cronkhite"}],"San Francisco":[{"county_name":"San Francisco","latitude":37.811280863495,"longitude":-122.47625629388,"spot_id":113,"spot_name":"Fort Point"},{"county_name":"San Francisco","latitude":37.787739768519,"longitude":-122.49284119361,"spot_id":649,"spot_name":"Eagles Point"},{"county_name":"San Francisco","latitude":37.788031359487,"longitude":-122.49442903432,"spot_id":648,"spot_name":"Deadmans"},{"county_name":"San Francisco","latitude":37.777486331151,"longitude":-122.51582571053,"spot_id":697,"spot_name":"Kellys Cove"},{"county_name":"San Francisco","latitude":37.768256511796,"longitude":-122.51347658831,"spot_id":114,"spot_name":"North Ocean Beach"},{"county_name":"San Francisco","latitude":37.754622592302,"longitude":-122.51110522562,"spot_id":117,"spot_name":"South Ocean Beach"}],"San Mateo":[{"county_name":"San Mateo","latitude":37.609975328464,"longitude":-122.49864248294,"spot_id":119,"spot_name":"Rockaway Beach"},{"county_name":"San Mateo","latitude":37.599078592064,"longitude":-122.50308531947,"spot_id":120,"spot_name":"Linda Mar"},{"county_name":"San Mateo","latitude":37.55160926014,"longitude":-122.51463970856,"spot_id":121,"spot_name":"Montara"},{"county_name":"San Mateo","latitude":37.491656365489,"longitude":-122.50225242285,"spot_id":122,"spot_name":"Mavericks"},{"county_name":"San Mateo","latitude":37.500694272357,"longitude":-122.47166536563,"spot_id":123,"spot_name":"Princeton Jetty"},{"county_name":"San Mateo","latitude":37.299344926694,"longitude":-122.41011858847,"spot_id":126,"spot_name":"Pomponio State Beach"},{"county_name":"San Mateo","latitude":37.271525294532,"longitude":-122.41140388824,"spot_id":127,"spot_name":"Pescadero State Beach"},{"county_name":"San Mateo","latitude":37.151969802576,"longitude":-122.36170330391,"spot_id":622,"spot_name":"Franklin Point"},{"county_name":"San Mateo","latitude":37.117632563783,"longitude":-122.31448293583,"spot_id":118,"spot_name":"Ano Nuevo"}],"Santa Cruz":[{"county_name":"Santa Cruz","latitude":37.096622267322,"longitude":-122.28087432452,"spot_id":129,"spot_name":"Waddell Creek"},{"county_name":"Santa Cruz","latitude":37.041670594978,"longitude":-122.23367276633,"spot_id":128,"spot_name":"Scotts Creek"},{"county_name":"Santa Cruz","latitude":37.021350150843,"longitude":-122.21623359876,"spot_id":133,"spot_name":"Davenport Landing"},{"county_name":"Santa Cruz","latitude":36.963129058213,"longitude":-122.12687891196,"spot_id":131,"spot_name":"Four Mile"},{"county_name":"Santa Cruz","latitude":36.948803992795,"longitude":-122.06109853031,"spot_id":6,"spot_name":"Natural Bridges"},{"county_name":"Santa Cruz","latitude":36.951489416606,"longitude":-122.04201384838,"spot_id":144,"spot_name":"Mitchells Cove"},{"county_name":"Santa Cruz","latitude":36.951092291956,"longitude":-122.02596109603,"spot_id":2,"spot_name":"Steamer Lane"},{"county_name":"Santa Cruz","latitude":36.958080811438,"longitude":-122.02456315544,"spot_id":3,"spot_name":"Cowells"},{"county_name":"Santa Cruz","latitude":36.956752467719,"longitude":-121.98143667929,"spot_id":7,"spot_name":"26th Avenue"},{"county_name":"Santa Cruz","latitude":36.954087622045,"longitude":-121.97169006289,"spot_id":1,"spot_name":"Pleasure Point"},{"county_name":"Santa Cruz","latitude":36.957393750256,"longitude":-121.96900332408,"spot_id":4,"spot_name":"38th Avenue"},{"county_name":"Santa Cruz","latitude":36.95911112064,"longitude":-121.96521161821,"spot_id":147,"spot_name":"The Hook"},{"county_name":"Santa Cruz","latitude":36.931200193213,"longitude":-121.86414993502,"spot_id":150,"spot_name":"Manresa"}]}';
