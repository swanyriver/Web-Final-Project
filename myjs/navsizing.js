function goBig() {
  document.getElementById('navbar').style.position = 'fixed';
  //document.getElementById('APIroll').style.position = 'fixed';
  document.getElementById('spotNav').hidden = false;


  var cp = document.getElementById('controlPanel');
  //document.getElementById('cpHolder').appendChild(cp);
  cp.classList.remove('smaller');

  document.getElementById('APIroll').removeAttribute('data-small');
  document.getElementById('cpHolder').removeAttribute('data-small');

}

function goLittle() {
  document.getElementById('navbar').style.position = 'static';
  blocker.style.height = '0px';
  //document.getElementById('APIroll').style.position = 'static';
  document.getElementById('spotNav').hidden = true;

  //document.getElementById('cpHolder').hidden = true;


  // todo the button group breaks when its moved, maybe clone it and re add it
  var cp = document.getElementById('controlPanel');
  //document.getElementById('logo').appendChild(cp);
  cp.classList.add('smaller');

  document.getElementById('APIroll').setAttribute('data-small', true);
  document.getElementById('cpHolder').setAttribute('data-small',true);
}

function navsize() {

  console.log('navsize being called');

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
