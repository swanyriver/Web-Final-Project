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
  
}

function load() {
  navsize();

  //todo load in names of spots and county groups and ids
  // for later making ajax calls
  var spotReq = new XMLHttpRequest();
  //todo respond to error creating

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        spotInfo = JSON.parse(this.response);
      } else {
        //todo error handle
      }
    }
  };

  spotReq.open('POST', 'main.php');
  spotReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  spotReq.send('request=spotinfo');

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
    pBody.appendChild(document.createTextNode("place holding for now"));

    panel.appendChild(pHead);
    panel.appendChild(pBody);
    body.appendChild(panel);
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createElement('br'));

  }

  navsize();


}


//empyt contents of an HTML element
function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
