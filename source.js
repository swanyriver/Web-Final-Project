var spotInfo;

function navsize() {
  var navbar = document.getElementById('navbar');
  var blocker = document.getElementById('blocker');

  //blocker.setAttribute("style","width:500px");navbar.clientHeight;

  var height = navbar.clientHeight + 'px';

  blocker.setAttribute('style' , 'display:block;height:' + height);
  blocker.style.height = height;

  console.log('resize:' + height);

  //todo call in onload
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

function onCountySelect(name) {

}
