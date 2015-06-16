//todo make alternat button group to go next to image
//maybe another logo image,  insert them as a table and just create a whole new layout on collumn

function goBig() {

  document.getElementById('APIroll').removeAttribute('data-small');
  //document.getElementById('cpHolder').removeAttribute('data-small');
  //document.getElementById('spotNav').removeAttribute('data-small');
  document.getElementById('logo').removeAttribute('data-small');
  document.getElementById('navbar').removeAttribute('data-small');
  //document.getElementById('navbar').removeAttribute('data-small');
  //document.getElementById('blocker').removeAttribute('data-small');

}

function goLittle() {

  document.getElementById('APIroll').setAttribute('data-small', true);
  //document.getElementById('cpHolder').setAttribute('data-small',true);
  //document.getElementById('spotNav').setAttribute('data-small', true);
  document.getElementById('logo').setAttribute('data-small', true);
  document.getElementById('navbar').setAttribute('data-small', true);
  //document.getElementById('blocker').setAttribute('data-small',true);

}

function navsize() {

  //console.log('navsize being called');

  var navbar = document.getElementById('navbar');
  var blocker = document.getElementById('blocker');

  var height = navbar.clientHeight;

  blocker.setAttribute('style' , 'height:' + height);
  blocker.style.height = height + 'px';

  //console.log('resize:' + height);

  navHeight = height;

  if( isBreakpoint('lg') ) {
    goBig();
  } else {
    goLittle();
  }

  //if( isBreakpoint('xs') ) {
  //  $('.someClass').css('property', 'value');
  //}
  //console.log(isBreakpoint('sm'));

  //todo reset anchor margin-top:##px

  //todo being called too many times
  //todo get this to work
  //setBottomMargin();

}

//TODO MAYBE SWITCH TO PARENT BOTTOM PADDING
//todo margin not bieng set,  probably a problem of missing the px
function setBottomMargin(){

  if(!document.getElementById('mainwindow').lastChild) return;

  var bottomPanel = document.getElementById('mainwindow').lastChild;
  var topPanelmarg = document.getElementById('mainwindow').firstChild.marginTop;
  margin = innerHeight - (bottomPanel.clientHeight + navHeight + topPanelmarg);
  bottomPanel.marginBottom = margin;

  console.log('bottom margin set, clientHeight of panel', bottomPanel.clientHeight);
}

function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}
