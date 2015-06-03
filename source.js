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

}

function onCountySelect(name) {

}
