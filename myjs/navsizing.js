function goBig() {
  document.getElementById('navbar').style.position = 'fixed';
  document.getElementById('APIroll').style.position = 'fixed';
  document.getElementById('spotNav').hidden = false;


  var cp = document.getElementById('controlPanel');
  //document.getElementById('cpHolder').appendChild(cp);
  cp.classList.remove('smaller');

  document.getElementById('APIroll').removeAttribute('data-small');

}

function goLittle() {
  document.getElementById('navbar').style.position = 'static';
  blocker.style.height = '0px';
  document.getElementById('APIroll').style.position = 'static';
  document.getElementById('spotNav').hidden = true;

  //document.getElementById('cpHolder').hidden = true;


  // todo the button group breaks when its moved, maybe clone it and re add it
  var cp = document.getElementById('controlPanel');
  //document.getElementById('logo').appendChild(cp);
  cp.classList.add('smaller');

  document.getElementById('APIroll').setAttribute('data-small', true);
}

function navsize() {
  var navbar = document.getElementById('navbar');
  var blocker = document.getElementById('blocker');

  var height = navbar.clientHeight;

  blocker.setAttribute('style' , 'display:block;height:' + height);
  blocker.style.height = height + 'px';

  //console.log('resize:' + height);

  navHeight = height;
/*  var toobig = innerHeight / 3;
  var small = (innerHeight / 4)
  if (height > toobig) {
    goLittle();
  } else if (height < small) {
    goBig();
  }*/

  if (document.getElementById('cpHolder').clientWidth > innerWidth * .7) {
    //gone narrow
    goLittle();
  }else if (document.getElementById('logo').clientWidth < innerWidth * .7) {
    //gone wide
    goBig();
  }

}