function adjustSettingsPanel(){

  var weatherSet = new Object();
  var waterSet = new Object();
  var waveSet = new Object();
  var ratingSet = new Object();

  weatherSet.opts = document.getElementById('userWeather').
    getElementsByTagName('option');
  waterSet.opts = document.getElementById('userWaterTemp').
    getElementsByTagName('option');
  waveSet.opts = document.getElementById('userWaveHeight').
    getElementsByTagName('option');
  ratingSet.opts = document.getElementById('userRating').
    getElementsByTagName('option');

  
  weatherSet.setting = userInfo.prefWeather;
  waterSet.setting = userInfo.prefWater;
  waveSet.setting = userInfo.prefWave;
  ratingSet.setting = userInfo.prefRating;

  var sets = [weatherSet, waterSet,waveSet,ratingSet];

  for (var i = sets.length - 1; i >= 0; i--) {
    sets[i].set = false;
    for (var v = sets[i].opts.length - 1; v >= 0; v--) {
      if(sets[i].opts[v].value == sets[i].setting){
        sets[i].opts[v].setAttribute('selected','true');
        sets[i].set = true;
      } else {
        sets[i].opts[v].removeAttribute('selected');
      }
    };
    if (!sets[i].set) sets[i].opts[0].setAttribute('selected', 'true');
  };


}

function enableSettings() {
  document.getElementById('userWeather').removeAttribute('disabled');
  document.getElementById('userWaterTemp').removeAttribute('disabled');
  document.getElementById('userWaveHeight').removeAttribute('disabled');
  document.getElementById('userRating').removeAttribute('disabled');

}

function changeJumbotron() {

  var jumbo = document.getElementById("welcometron");

  if (!jumbo) return;
  var surfsup = document.getElementById('SurfsUP');

  jumbo.innerHTML = '';

  var h = document.createElement('H1')
  h.appendChild(
    document.createTextNode('Welcome Back ' + userInfo.name));
  jumbo.appendChild(h);

  var p = document.createElement('p')
  p.appendChild(document.createTextNode('If you haven\'t done so yet hit the '));
  p.appendChild(document.createElement('br'));

  var button = document.createElement('button');
  button.setAttribute('class', 'btn btn-inverse');
  button.setAttribute('data-toggle', 'modal');
  button.setAttribute('data-target', '#settingsMod');

  var span = document.createElement('span');
  span.setAttribute('class', 'glyphicon glyphicon-cog');
  button.appendChild(span);
  button.appendChild(document.createTextNode('Settings'))

  p.appendChild(button);
  p.appendChild(document.createTextNode('button to get highlighted forecast information'));

  jumbo.appendChild(p);

  //put surfs up button back
  jumbo.appendChild(surfsup);

}

function userloggedin(JSONprofile) {
  //console.log(JSONprofile);

  userPackage = JSON.parse(JSONprofile);
  //console.log(userPackage);
  userInfo = userPackage['userInfo'];
  favoriteSpots = JSON.parse(userPackage['favorites']);

  console.log(userInfo);
  console.log(favoriteSpots);

  //set temperature
  changeUnitButton(userInfo.tempUnit);
  changeUnit(userInfo.tempUnit);
  //change sign in to log out button
  var loginbutton = document.getElementById('loginButton');
  var logoutbutton = document.getElementById('logoutbutton');
  loginbutton.parentElement.replaceChild(logoutbutton, loginbutton);
  logoutbutton.removeAttribute('hidden');
  // enable settings controls and remove sign in button reflect user prefs
  enableSettings();
  document.getElementById('settingsLogin').parentElement.replaceChild(
    document.getElementById('settingsSave'), //new child
    document.getElementById('settingsLogin')); //old child
  document.getElementById('settingsSave').removeAttribute('hidden');
  adjustSettingsPanel();

  //highlight spots
  refreshSpotHighlights();

  changeJumbotron();

  // TODO disable sign in tooltip on favorites button TODO make tooltips
  // TODO jump to myspots ??  TODO make myspots
  // TODO set favorite icons accordingly
  // TODO set report box backgrounds according to settings
  // TODO put user name somwhere on page
}
