var waterCounties = [];
waterCounties['Sonoma'] = 'sonoma';
waterCounties['Marin'] = 'marin';
waterCounties['San Francisco'] = 'san-francisco';
waterCounties['San Mateo'] = 'san-mateo';
waterCounties['Santa Cruz'] = 'santa-cruz';

var spotInfo = JSON.parse(spotJSON);

var navHeight;

function load() {
  navsize();

  changeUnitButton(userInfo.tempUnit);
  updateAllTemps();

  if (userInfo.name) adjustSettingsPanel();
  //todo generate favorites page, if user has favorites
}

function requestState(panel) {
  this.numRequests = 0;
  this.completed = false;

  //todo 6 if i can get callback for image load
  this.numWaiting = 5;
  this.panel = panel;

  this.responsVals = new Object();

  this.spotName = panel.getElementsByClassName('panel-heading')[0].textContent;
  console.log(this.spotName + ' begining');

  var blocker = document.createElement('div');
  blocker.setAttribute('class', 'blocker');
  blocker.appendChild(document.createTextNode(this.spotName));
  this.panel.getElementsByClassName('panel-body')[0].appendChild(blocker);

  this.myBlock = panel.getElementsByClassName('blocker')[0];

  var progress = document.createElement('div');
  progress.setAttribute('class', 'progress');
  var bar = document.createElement('div');
  bar.setAttribute('class', 'progress-bar progress-bar-info progress-bar-striped active');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuenow', '0');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', String(this.numWaiting));
  bar.setAttribute('style', 'width:0%');
  progress.appendChild(bar);
  this.panel.getElementsByClassName('panel-heading')[0].appendChild(progress);

  this.myBar = panel.getElementsByClassName('progress-bar')[0];

  function ajaxReturn(success, value, view) {
    this.success = success;
    this.value = value;
    
    this.view = view;
    if (view)this.header = view.parentElement.getElementsByClassName('ReportHeading')[0];
    return this;
  }

  this.response = function(success, key, value, view) {
    this.numRequests++;

    this.responsVals[key] = new ajaxReturn(success, value, view);

    this.myBar.setAttribute('style', 'width:' + Math.round(this.numRequests / this.numWaiting * 100) + '%');
    this.myBar.setAttribute('aria-valuenow', String(this.numRequests));

    if (this.numRequests == this.numWaiting) {
      this.completed = true;
      updateRequestBoxes(this.responsVals);

      //remove progress and blockers
      console.log(panel.getElementsByClassName('panel-heading')[0].textContent + ' finished');
      $(this.myBar.parentElement).fadeOut(1400, function() {
        this.parentElement.removeChild(this);
      });

      $(this.myBlock).fadeOut(1400, function() {
        this.parentElement.removeChild(this);
      });

    }
  };
}
var spotRequestStates = new Object();
spotRequestStates.boxKeys = ["watertemp","Grade","waveHeight","weather"]

function updateRequestBoxes(responsVals) {
  console.log(responsVals);

  var keys = spotRequestStates.boxKeys;

  if (!responsVals.hilo.success) responsVals.hilo.view.innerHTML = '';

  for (var i = keys.length - 1; i >= 0; i--) {

    var response = responsVals[keys[i]];
    var userPref = userInfo[prefMap[keys[i]]];

    if (userInfo.name) {

      response.header.classList.remove('prefMet');
      response.header.classList.remove('prefNotMet');

      if (response.success && userPref && userPref != 'null') {
        if (response.value >= userPref) {
          response.header.classList.add('prefMet');
        } else {
          response.header.classList.add('prefNotMet');
        }
      }

    } 

    if (!response.success) {
      responsVals[keys[i]].view.innerHTML = '';
      responsVals[keys[i]].view.appendChild(unavailicon());
    }
  }
}

function unavailicon() {
  var div = document.createElement('div');
  div.setAttribute('class', 'unavailDiv');
  var icon = document.createElement('span');
  icon.setAttribute('class', 'glyphicon glyphicon-remove');
  div.appendChild(icon);
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createTextNode('Unavailable'));
  return div;
}


function onCountySelect(countyName) {
  navbar = document.getElementById('spotNav');
  body = document.getElementById('mainwindow');

  document.getElementById('backMap').setAttribute('src', 'img/' + countyName + '.png');

  clearNode(body);
  clearNode(navbar);


  //todo get it to work or remove these spot names
  for (var i = 0; i < spotInfo[countyName].length; i++) {
    //<li><a href='#'>test1</a></li>
    var listitem = document.createElement('li');
    var anchor = document.createElement('a');

    if (i)var href = '#' + spotInfo[countyName][i - 1]['spot_id'];
    else var href = '#blocker';

    anchor.setAttribute('href', href);
    //anchor.setAttribute('onclick', '$.scrollTo( ' + href + ', 750 ); return false;"');
    anchor.appendChild(document.createTextNode(spotInfo[countyName][i]['spot_name']));
    listitem.appendChild(anchor);
    navbar.appendChild(listitem);

  }

  navsize();

  spotviews = [];

  for (var i = 0; i < spotInfo[countyName].length; i++) {

    //add spot to body
    spotviews[i] = createPanel(spotInfo[countyName][i], body);

  }

  waterTempAjax(countyName);

  for (var i = 0; i < spotInfo[countyName].length; i++) {
    makeAjaxcalls(spotInfo[countyName][i], spotviews[i]);
  }
}

function waterTempAjax(countyName) {
  console.log('water temp request for ' + countyName);

  //Spitcast call
  var spotReq = new XMLHttpRequest();
  if (!spotReq) {
    unabletoMakeAjax();
    return;
  }

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.response) {
      updateWaterTemp(countyName, this.response, true);
    } else if (this.readyState === 4) {
      updateWaterTemp(countyName, null, false);
    }
  };

  var url = 'http://api.spitcast.com/api/county/water-temperature/' + waterCounties[countyName] + '/';
  spotReq.open('GET', url);
  spotReq.send();
}

function unabletoMakeAjax() {
  console.log('unable to make ajax');
  alert("our apolagies but the browser doesn't want to talk the surf seers");
}

function makeAjaxcalls(spot, views) {

  var spotID = spot.spot_id;

  //////Spitcast call//////////////
  var spotReq = new XMLHttpRequest();
  if (!spotReq) {
    unabletoMakeAjax();
    return;
  }
  

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.response) {
      ajaxReturnSpitcast(views['WaveBox'], views['GradeBox'], this.response, spot['spot_id']);
    } else if (this.readyState === 4) {
      this.ontimeout();
    }
  };

  spotReq.ontimeout = function() {
    console.log('no response: spitcast');
    spotRequestStates[spotID].response(false, 'Grade', null, views['GradeBox']);
    spotRequestStates[spotID].response(false, 'waveHeight', null, views['WaveBox']);
  }

  var url = "http://api.spitcast.com/api/spot/forecast/" + spot['spot_id'] + "/";
  spotReq.open('GET', url);
  spotReq.send();

  ///////weather call///////////
  var weatherReq = new XMLHttpRequest();
  if (!weatherReq) {
    unabletoMakeAjax();
    return;
  }

  weatherReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.response) {
      ajaxReturnWeather(views['WeatherBox'], this.response, spot['spot_id']);
    } else if (this.readyState === 4) {
      this.ontimeout();
    }
  };

  weatherReq.ontimeout = function() {
    console.log('no response: weather timeout');
    spotRequestStates[spotID].response(false, 'weather', null, views['WeatherBox']);
  };

  var wurl = 'http://api.openweathermap.org/data/2.5/weather';
  var lat = 'lat=' + spot['latitude'];
  var lon = 'lon=' + spot['longitude'];
  var weatheroptions = 'mode=json';
  var apikey = 'APPID=4e43be43a6ad8d7f0655ddfb5d8275d4'
  var weatherRequest = wurl + '?' + lat + '&' + lon + '&' + weatheroptions + '&' + apikey;

  weatherReq.open('GET', weatherRequest);
  weatherReq.send();

  console.log(weatherRequest);

  ///////forecast call///////////
  var forecastReq = new XMLHttpRequest();
  if (!forecastReq) {
    unabletoMakeAjax();
    return;
  }

  forecastReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200 && this.response) {
      ajaxReturnForecast(views['WeatherBox'], this.response, spot['spot_id']);
    } else if (this.readyState === 4) {
      this.ontimeout();
    }
  };

  forecastReq.ontimeout = function() {
    console.log('no response: forcast Weather');
    spotRequestStates[spotID].response(false, 'hilo', null, 
    views['WeatherBox'].getElementsByClassName('hilo')[0]);
  }

  var wurl = 'http://api.openweathermap.org/data/2.5/forecast/daily';
  var lat = 'lat=' + spot['latitude'];
  var lon = 'lon=' + spot['longitude'];
  var weatheroptions = 'cnt=1&mode=json';
  var forcastRequest = wurl + '?' + lat + '&' + lon + '&' + weatheroptions;

  forecastReq.open('GET', forcastRequest);
  forecastReq.send();


}

function updateWaterTemp(countyName, JSONdata, success) {

  if(!success){
    waterTemp = null;
  } else{
    waterTemp = JSON.parse(JSONdata)['fahrenheit'];
  }
  console.log(countyName + ' waterTemp:' + waterTemp);

  for (var i = 0; i < spotInfo[countyName].length; i++) {
    var spotID = spotInfo[countyName][i]['spot_id'];
    var panel = document.getElementById(spotID);
    if (panel) {
      var out = panel.getElementsByClassName("WaterBox")[0].getElementsByClassName("Temperature")[0];
      if (success) setTemp(FtoK(waterTemp), out);
      spotRequestStates[spotID].response(success, 'watertemp', FtoK(waterTemp),
        panel.getElementsByClassName("WaterBox")[0]);
    }
  }
}

function ajaxReturnWeather(WeatherBox, JSONdata, spotID) {

  var Weather = JSON.parse(JSONdata);

  var tempdiv = WeatherBox.getElementsByClassName('currentTemp')[0];
  var currentTempView = tempdiv.getElementsByClassName('Temperature')[0];
  setTemp(Weather.main.temp, currentTempView);

  var iconView = WeatherBox.getElementsByClassName('weatherIcon')[0];
  var iconURL = 'http://openweathermap.org/img/w/' + Weather.weather[0].icon + ".png";
  iconView.setAttribute('src', iconURL);

  var descriptionView = WeatherBox.getElementsByClassName('weatherDescription')[0];
  descriptionView.appendChild(document.createTextNode(Weather.weather[0].description));

  spotRequestStates[spotID].response(true,'weather',Weather.main.temp,WeatherBox);
}

function ajaxReturnForecast(WeatherBox, JSONdata, spotID) {
  var Weather = JSON.parse(JSONdata);

  var hiloView = WeatherBox.getElementsByClassName('hilo')[0];

  var lotemp = hiloView.getElementsByClassName('lo')[0].getElementsByClassName('Temperature')[0];
  var hitemp = hiloView.getElementsByClassName('hi')[0].getElementsByClassName('Temperature')[0];

  setTemp(Weather.list[0].temp.min, lotemp);
  setTemp(Weather.list[0].temp.max, hitemp);

  spotRequestStates[spotID].response(true,'hilo','hilo',WeatherBox.getElementsByClassName('hilo')[0]);

}

function ajaxReturnSpitcast(WaveBox, GradeBox, JSONdata, spotID) {

  var spotForcast = JSON.parse(JSONdata);

  var currentConditions = spotForcast[getPSTtime()];

  var gradeout = GradeBox.getElementsByClassName('grade')[0];
  gradeout.appendChild(document.createTextNode(currentConditions['shape_full']));

  spotRequestStates[spotID].response(true, 'Grade',conditions.indexOf(currentConditions['shape_full']),GradeBox);

  var waveout = WaveBox.getElementsByClassName('waveHeight')[0];
  waveout.appendChild(document.createTextNode(currentConditions['size']));
  sup = document.createElement('sup');
  sup.appendChild(document.createTextNode('ft'));
  waveout.appendChild(sup);

  spotRequestStates[spotID].response(true, 'waveHeight', currentConditions['size'], WaveBox);

}

function favorite(spotid) {
  //todo implement
}

function mySpots() {
  //todo implement
}

function updateAllTemps() {
  temps = document.getElementsByClassName('Temperature');
  for (var i = temps.length - 1; i >= 0; i--) {
    updateTemp(temps[i]);
  }
}

function updateTemp(tempview) {
  setTemp(tempview.getAttribute('data-kelvin'), tempview);
}

function changeUnitButton(unit) {
  var Cbutton = document.getElementById('Cbutton');
  var Fbutton = document.getElementById('Fbutton');
  if (unit == 'C') {
    Cbutton.classList.add('active');
    Fbutton.classList.remove('active');
  } else {
    Fbutton.classList.add('active');
    Cbutton.classList.remove('active');
  }
}

function updateUser(poststring, onFinish) {
  updateReq = new XMLHttpRequest();

  updateReq.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.response) {
        onFinish(this.status, this.response);
      } else {
        //todo server returned no string, why
      }
    }
  };

  updateReq.open('POST', 'updateUser.php');
  updateReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  updateReq.send(poststring);
}

function updateUserFavorites() {
  //todo stringify and send favorites
}

function updateUserSettings() {

  function notify(code, response) {
    console.log('user settings updated' + code + response);

    if (code == 201) {
      var color = 'background-color: lightgreen;';
    } else {
      var color = 'background-color: lightcoral;';
    }

    var style = 'width: 100%; font-size: large; position: fixed; text-align: center;padding: 5px;' + color;
    if (document.getElementById('navbar').style.position == 'fixed') {
      style += 'top:' + navHeight + 'px;';
    } else {
      style += ' bottom:0px;';
    }


    var popup = document.createElement('div');
    popup.setAttribute('style', style);
    popup.style.top = navHeight;
    popup.id = 'saveSettingsPopUp';
    popup.appendChild(document.createTextNode(response));
    document.getElementsByTagName('body')[0].appendChild(popup);

    $(document.getElementById('saveSettingsPopUp'))
      .fadeOut(1400 * 3, function() {
          this.parentElement.removeChild(this);
        });
  } //end of notify

  var newPrefWave = document.getElementById('userWaveHeight').value;
  var newPrefWeather = document.getElementById('userWeather').value;
  var newPrefRating = document.getElementById('userRating').value;
  var newPrefWater = document.getElementById('userWaterTemp').value;

  var poststring = '';

  if (userInfo.prefWave != newPrefWave) {
    poststring += '&' + 'prefWave=' + newPrefWave;
    userInfo.prefWave = newPrefWave;
  }
  if (userInfo.prefWeather != newPrefWeather) {
    poststring += '&' + 'prefWeather=' + newPrefWeather;
    userInfo.prefWeather = newPrefWeather;
  }
  if (userInfo.prefWater != newPrefWater) {
    poststring += '&' + 'prefWater=' + newPrefWater;
    userInfo.prefWater = newPrefWater;
  }
  if (userInfo.prefRating != newPrefRating) {
    poststring += '&' + 'prefRating=' + newPrefRating;
    userInfo.prefRating = newPrefRating;
  }

  if (poststring == '') return;
  else poststring = poststring.substring(1);

  console.log("updating user:"+poststring);
  updateUser(poststring, notify);


  refreshSpotHighlights();
}

function refreshSpotHighlights() {
  //refresh highlights
  spotPanels = document.getElementsByClassName('spotPanel');
  for (var i = 0; i < spotPanels.length; i++) {
    id = spotPanels[i].id;
    if (spotRequestStates[id].completed) {
      updateRequestBoxes(spotRequestStates[id].responsVals);
    }
  }
}

//button click relies on this for submiting
$('#settingsMod').on('hide.bs.modal', updateUserSettings);

function changeUnit(unit) {

  if (unit != userInfo.tempUnit) {

    changeUnitButton(unit);

    userInfo.tempUnit = unit;
    updateAllTemps();

    var Cbutton = document.getElementById('Cbutton');
    var Fbutton = document.getElementById('Fbutton');
    
    var onFinish = function(code, response) {
      console.log("temp changed: " + code + response);
    }
    
    if (userInfo.name)
      updateUser("tempUnit=" + unit, onFinish);

  } else {
    //no effect
  }
}

function setTemp(kelvin, tempview) {

  tempview.innerHTML = '';

  tempview.setAttribute('data-kelvin', kelvin);

  if (userInfo.tempUnit == 'C') {
    var Temperature = KtoC(kelvin);
  } else {
    var Temperature = KtoF(kelvin);
  }

  tempview.appendChild(document.createTextNode(Temperature + '\xB0')); 
}

function KtoF(kelvin) {
  var fahrenheit = (kelvin - 273.15) * 1.8 + 32;
  return Math.round(fahrenheit);
}
function KtoC(kelvin) {
  return Math.round(kelvin - 273.15);
}
function FtoK(fahrenheit) {
  var kelvin = (fahrenheit - 32) / 1.8 + 273.15;
  return Math.round(kelvin);
}

function createPanel(spot, body) {

  var views = [];

  var panel = document.createElement('div');
  panel.setAttribute('class', 'panel panel-default spotPanel');
  panel.setAttribute('id', spot['spot_id']);
  var pHead = document.createElement('div');
  pHead.setAttribute('class', 'panel-heading');
  var pBody = document.createElement('div');
  pBody.setAttribute('class', 'panel-body');

  pHead.appendChild(document.createTextNode(spot['spot_name']));

  

  //todo put favorite buttons back
  //var favlink = document.createElement('a');
  //favlink.setAttribute('class', 'favoriteButton');
  //favlink.setAttribute('onclick', 'favorite(' + spot['spot_id'] + ')');
  //var favglyph = document.createElement('span');
  //favglyph.setAttribute('class', 'glyphicon glyphicon-star-empty');
  //favlink.appendChild(favglyph);
  //pHead.appendChild(favlink);


  panel.appendChild(pHead);

  var WeatherBox = createReportBox('Weather', 4, 'WeatherBox');
  var WaterBox = createReportBox('Water Temperature', 3, 'WaterBox');
  var WaveBox = createReportBox('Wave Height', 3, 'WaveBox');
  var GradeBox = createReportBox('Current Rating', 2, 'GradeBox');

  var WeatherBoxReport = WeatherBox.lastChild;
  var WaterBoxReport = WaterBox.lastChild;
  var WaveBoxReport = WaveBox.lastChild;
  var GradeBoxReport = GradeBox.lastChild;

  var weatherrow = document.createElement('div');
  weatherrow.setAttribute('class', 'row');

  var iconcol = document.createElement('div');
  iconcol.setAttribute('class', 'col-lg-3');
  var weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('class', 'weatherIcon');
  iconcol.appendChild(weatherIcon);
  weatherrow.appendChild(iconcol);
  var temp = document.createElement('div');
  temp.setAttribute('class', 'currentTemp col-lg-3');
  var tempspan = document.createElement('span');
  tempspan.setAttribute('class', 'Temperature');
  temp.appendChild(tempspan);
  weatherrow.appendChild(temp);

  //third box
  var thirdbox = document.createElement('div');
  thirdbox.setAttribute('class', 'col-lg-6');
  var description = document.createElement('div');
  description.setAttribute('class', 'weatherDescription');
  thirdbox.appendChild(description);
  //thirdbox.appendChild(document.createElement('br'));
  var hilo = document.createElement('div');
  hilo.setAttribute('class', 'hilo');


  var lo = document.createElement('span');
  lo.setAttribute('class', 'lo');
  lo.appendChild(document.createTextNode('LOW:'));
  var lotemp = document.createElement('span');
  lotemp.setAttribute('class', 'Temperature');
  lo.appendChild(lotemp);
  hilo.appendChild(lo);

  var hi = document.createElement('span');
  hi.setAttribute('class', 'hi');
  hi.appendChild(document.createTextNode('HIGH:'));
  var hitemp = document.createElement('span');
  hitemp.setAttribute('class', 'Temperature');
  hi.appendChild(hitemp);
  hilo.appendChild(hi);


  thirdbox.appendChild(hilo);
  weatherrow.appendChild(thirdbox);

  WeatherBoxReport.appendChild(weatherrow);




  var watertemp = document.createElement('div');
  watertemp.setAttribute('class', 'Temperature');
  WaterBoxReport.appendChild(watertemp);

  var waveH = document.createElement('div');
  waveH.setAttribute('class', 'waveHeight');
  WaveBoxReport.appendChild(waveH);

  var grade = document.createElement('div');
  grade.setAttribute('class', 'grade');
  GradeBoxReport.appendChild(grade);


  pBody.appendChild(WeatherBox);
  pBody.appendChild(WaterBox);
  pBody.appendChild(WaveBox);
  pBody.appendChild(GradeBox);

  panel.appendChild(pBody);
  body.appendChild(panel);

  //get hooks to views
  var mypanel = document.getElementById(spot['spot_id']);

  views['WeatherBox'] = mypanel.getElementsByClassName('WeatherBox')[0];
  views['WaterBox'] = mypanel.getElementsByClassName('WaterBox')[0];
  views['WaveBox'] = mypanel.getElementsByClassName('WaveBox')[0];
  views['GradeBox'] = mypanel.getElementsByClassName('GradeBox')[0];

  spotRequestStates[spot['spot_id']] = new requestState(mypanel);

  return views;

}

function createReportBox(name, width, classname) {
  //creating report square
  var box = document.createElement('div');
  box.setAttribute('class', 'col-lg-' + width + ' displayBox');
  var heading = document.createElement('label');
  heading.setAttribute('class', 'ReportHeading');
  heading.appendChild(document.createTextNode(name));
  box.appendChild(heading);
  //box.appendChild(document.createElement('br'));
  var report = document.createElement('div');
  report.setAttribute('class', 'reportSection ' + classname);
  box.appendChild(report);

  return box;
}

//empyt contents of an HTML element
function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function getPSTtime() {
  var utcHour = new Date().getUTCHours();
  return ((utcHour + 23) - 7) % 23;
}

function displayMessage(msg, element) {
  element.innerHTML = '';
  var msgNode = document.createTextNode(msg);
  element.appendChild(msgNode);
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

function user(request) {
  console.log(request);

  var ErrorOut = document.getElementById('loginMessage');
  displayMessage('', ErrorOut);

  var passIn = document.getElementById('loginUserName');
  var nameIn = document.getElementById('loginPassword');

  loginReq = new XMLHttpRequest();

  loginReq.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.response) {
        if (this.status == 200) {
          $('#loginMod').modal('hide');
          userloggedin(this.response);
          return;
        } else if (this.status == 201) {
          $('#loginMod').modal('hide');
          //$('#welcomeMod').modal('show');
          userloggedin(this.response);
          return;
        }
        displayMessage(this.response, ErrorOut);
        var warning = 'rosybrown';
        switch (this.status) {
          case 404: //username not found
              document.getElementById('submitLogin').
                getElementsByTagName('button')[0].
                setAttribute('disabled', 'true');
              document.getElementById('submitLogin').
                getElementsByTagName('button')[1].select();
              break;
          case 403: //incorect password
            passIn.value = '';
            passIn.style.backgroundColor = warning;
            break;
          case 409: //username exists
            nameIn.style.backgroundColor = warning;
          case 406: //pass too short
            passIn.style.backgroundColor = warning;

          default: //php fail
            // todo decide what to do on utter failure, disable all fields?
          }


      } else {
        //todo server returned no string, why
      }
    }
  };

  var nameIn = document.getElementById('loginUserName');
  var passIn = document.getElementById('loginPassword');
  var nameData = encodeURIComponent(nameIn.value);
  var passData = encodeURIComponent(passIn.value);

  var postPs = 'username=' + nameData + '&password=' + passData;
  postPs += '&request=' + request;
  postPs += '&tempUnit=' + userInfo.tempUnit;
  postPs += '&favorites=' + JSON.stringify(favoriteSpots);
  loginReq.open('POST', 'login.php');
  loginReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  loginReq.send(postPs);
}

//move cursor to name field
$('#loginMod').on('shown.bs.modal', function(e) {
  document.getElementById('loginUserName').select();
});

$('#loginMod').on('show.bs.modal', function(e) {
  var nameIn = document.getElementById('loginUserName');
  var passIn = document.getElementById('loginPassword');
  var submit = document.getElementById('submitLogin');
  var buttons = submit.getElementsByTagName('button');
  var ErrorOut = document.getElementById('loginMessage');

  function check(name, pass) {

    displayMessage('', ErrorOut);

    var letters = /^[0-9a-zA-Z]+$/;
    if ((name.length && !letters.test(name)) ||
      (pass.length && !letters.test(pass))) {
      displayMessage('Letters and Numbers only please', ErrorOut);
      return false;
    }

    if (!name.length || !pass.length) {
      return false;
    }

    var maxlength = 126;
    if (name.length > maxlength) {
      displayMessage('Username is too long', ErrorOut);
      return false;
    }
    if (pass.length > maxlength) {
      displayMessage('Password is too long', ErrorOut);
      return false;
    }

    return true;
  }

  function buttonControl(field) {
    field.style.backgroundColor='initial';

    if (check(nameIn.value, passIn.value)) {
      buttons[0].removeAttribute('disabled');
      buttons[1].removeAttribute('disabled');
    } else {
      buttons[0].setAttribute('disabled', 'true');
      buttons[1].setAttribute('disabled', 'true');
    }
  }

  //enable buttons if fields were autofilled
  buttonControl(nameIn, passIn);

  nameIn.oninput = function() {buttonControl(nameIn);};
  passIn.oninput = function() {buttonControl(passIn);};
  //passIn.oninput = buttonControl;
});

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

