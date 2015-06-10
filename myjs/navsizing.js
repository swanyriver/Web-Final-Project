//todo make alternat button group to go next to image
//maybe another logo image,  insert them as a table and just create a whole new layout on collumn

function goBig() {

  document.getElementById('APIroll').removeAttribute('data-small');
  document.getElementById('cpHolder').removeAttribute('data-small');
  document.getElementById('spotNav').removeAttribute('data-small');
  document.getElementById('logo').removeAttribute('data-small');
  document.getElementById('navbar').removeAttribute('data-small');
  document.getElementById('navbar').removeAttribute('data-small');

}

function goLittle() {

  document.getElementById('APIroll').setAttribute('data-small', true);
  document.getElementById('cpHolder').setAttribute('data-small',true);
  document.getElementById('spotNav').setAttribute('data-small', true);
  document.getElementById('logo').setAttribute('data-small', true);
  document.getElementById('navbar').setAttribute('data-small', true);
  blocker.setAttribute('data-small',true);

}

function navsize() {

  //console.log('navsize being called');

  var navbar = document.getElementById('navbar');
  var blocker = document.getElementById('blocker');

  var height = navbar.clientHeight;

  blocker.setAttribute('style' , 'display:block;height:' + height);
  blocker.style.height = height + 'px';

  //console.log('resize:' + height);

  navHeight = height;

  if (document.getElementById('cpHolder').clientWidth > innerWidth * .7) {
    //gone narrow
    goLittle();
  }else if (document.getElementById('logo').clientWidth < innerWidth * .7) {
    //gone wide
    goBig();
  }

  //todo reset anchor margin-top:##px

  //todo being called too many times
  //setBottomMargin();

}

//TODO MAYBE SWITCH TO PARENT BOTTOM PADDING
//todo margin not bieng set,  problem a problem of missing the px
function setBottomMargin(){

  if(!document.getElementById('mainwindow').lastChild) return;

  var bottomPanel = document.getElementById('mainwindow').lastChild;
  var topPanelmarg = document.getElementById('mainwindow').firstChild.marginTop;
  margin = innerHeight - (bottomPanel.clientHeight + navHeight + topPanelmarg);
  bottomPanel.marginBottom = margin;

  console.log('bottom margin set, clientHeight of panel', bottomPanel.clientHeight);
}
