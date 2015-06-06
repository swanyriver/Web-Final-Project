var waterCounties = [];
waterCounties['Sonoma'] = 'sonoma';
waterCounties['Marin'] = 'marin';
waterCounties['San Francisco'] = 'san-francisco';
waterCounties['San Mateo'] = 'san-mateo';
waterCounties['Santa Cruz'] = 'santa-cruz';

//todo delete allspots.json
var spotInfo = JSON.parse(spotJSON);

function requestState(panel) {
  this.numRequests = 0;
  this.numWaiting = 5; //todo 6 if i can get callback for image load
  this.panel = panel;

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

  this.response = function() {
    this.numRequests++;

    this.myBar.setAttribute('style', 'width:' + Math.round(this.numRequests / this.numWaiting * 100) + '%');
    this.myBar.setAttribute('aria-valuenow', String(this.numRequests));

    if (this.numRequests == this.numWaiting) { 
      //remove progress and blockers
      console.log(panel.getElementsByClassName('panel-heading')[0].textContent + ' finished');
      $(this.myBar.parentElement).fadeOut(1400, function() {
        this.parentElement.removeChild(this);
      });

      $(this.myBlock).fadeOut(700, function() {
        this.parentElement.removeChild(this);
      });

    }
  };
}
var spotRequestStates = new Object();

//todo make global user object, parsed from server


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

  }

  navsize();

  spotviews = [];

  for (var i = 0; i < spotInfo[countyName].length; i++) {

    var anchor = document.createElement('a');
    anchor.setAttribute('class', 'spotAnchor');
    anchor.setAttribute('id', spotInfo[countyName][i]['spot_name']);
    body.appendChild(anchor);

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
  //todo respond to error creating

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        updateWaterTemp(countyName, this.response);
      } else {
        //todo handle errer here
        console.log(countyName + ' response:' + this.status);
      }
    }
  };

  var url = 'http://api.spitcast.com/api/county/water-temperature/' + waterCounties[countyName] + '/';
  spotReq.open('GET', url);
  spotReq.send();
}

function makeAjaxcalls(spot, views) {

  //////Spitcast call//////////////
  var spotReq = new XMLHttpRequest();
  //todo respond to error creating

  spotReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        ajaxReturnSpitcast(views['WaveBox'], views['GradeBox'], this.response, spot['spot_id']);
      } else {
        //todo handle errer here
        console.log(spot['spot_name'] + ' response:' + this.status);
      }
    }
  };

  var url = "http://api.spitcast.com/api/spot/forecast/" + spot['spot_id'] + "/";
  spotReq.open('GET', url);
  spotReq.send();

  ///////weather call///////////
  var weatherReq = new XMLHttpRequest();
  //todo respond to error creating

  weatherReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        ajaxReturnWeather(views['WeatherBox'], this.response, spot['spot_id']);
      } else {
        //todo handle errer here
        console.log(spot['spot_name'] + ' response:' + this.status);
      }
    }
  };

  var wurl = 'http://api.openweathermap.org/data/2.5/weather';
  var lat = 'lat=' + spot['latitude'];
  var lon = 'lon=' + spot['longitude'];
  var weatheroptions = 'mode=json';
  var weatherRequest = wurl + '?' + lat + '&' + lon + '&' + weatheroptions;

  weatherReq.open('GET', weatherRequest);
  weatherReq.send();

  console.log(weatherRequest);

  ///////forecast call///////////
  var forecastReq = new XMLHttpRequest();
  //todo respond to error creating

  forecastReq.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (this.response) {
        ajaxReturnForecast(views['WeatherBox'], this.response, spot['spot_id']);
      } else {
        //todo handle errer here
        console.log(spot['spot_name'] + ' response:' + this.status);
      }
    }
  };

  var wurl = 'http://api.openweathermap.org/data/2.5/forecast/daily';
  var lat = 'lat=' + spot['latitude'];
  var lon = 'lon=' + spot['longitude'];
  var weatheroptions = 'cnt=1&mode=json';
  var forcastRequest = wurl + '?' + lat + '&' + lon + '&' + weatheroptions;

  forecastReq.open('GET', forcastRequest);
  forecastReq.send();


}

function updateWaterTemp(countyName, JSONdata) {

  //todo record in kelvin
  //todo find a way to set all temperatures as function from kelvin and switch in one press
  waterTemp = JSON.parse(JSONdata)['fahrenheit'];
  console.log(countyName + ' waterTemp:' + waterTemp);

  for (var i = 0; i < spotInfo[countyName].length; i++) {
    var spotID = spotInfo[countyName][i]['spot_id'];
    var panel = document.getElementById(spotID);
    if (panel) {
      var out = panel.getElementsByClassName("WaterBox")[0].getElementsByClassName("Temperature")[0];
      setTemp(FtoK(waterTemp), out);
      spotRequestStates[spotID].response();
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

  spotRequestStates[spotID].response();
}

function ajaxReturnForecast(WeatherBox, JSONdata, spotID) {
  var Weather = JSON.parse(JSONdata);

  var hiloView = WeatherBox.getElementsByClassName('hilo')[0];

  var lotemp = hiloView.getElementsByClassName('lo')[0].getElementsByClassName('Temperature')[0];
  var hitemp = hiloView.getElementsByClassName('hi')[0].getElementsByClassName('Temperature')[0];

  setTemp(Weather.list[0].temp.min, lotemp);
  setTemp(Weather.list[0].temp.max, hitemp);

  spotRequestStates[spotID].response();

}

function ajaxReturnSpitcast(WaveBox, GradeBox, JSONdata, spotID) {

  var spotForcast = JSON.parse(JSONdata);

  var currentConditions = spotForcast[getPSTtime()];

  var gradeout = GradeBox.getElementsByClassName('grade')[0];
  gradeout.appendChild(document.createTextNode(currentConditions['shape_full']));

  spotRequestStates[spotID].response();

  var waveout = WaveBox.getElementsByClassName('waveHeight')[0];
  waveout.appendChild(document.createTextNode(currentConditions['size']));
  sup = document.createElement('sup');
  sup.appendChild(document.createTextNode('ft'));
  waveout.appendChild(sup);

  spotRequestStates[spotID].response();

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

//todo update user prefrences if logged in
//this will be a call to my php file
function changeUnit(unit) {
  if (unit != userInfo.userInfo.tempUnit) {
    userInfo.tempUnit = unit;
    updateAllTemps();

    var Cbutton = document.getElementById('Cbutton');
    var Fbutton = document.getElementById('Fbutton');
    if (unit == 'C') {
      Fbutton.setAttribute('class', 'btn btn-default');
      Cbutton.setAttribute('class', 'btn btn-default active');
    } else {
      Cbutton.setAttribute('class', 'btn btn-default');
      Fbutton.setAttribute('class', 'btn btn-default active');
    }
  }
}

function setTemp(kelvin, tempview) {

  tempview.innerHTML = '';

  tempview.setAttribute('data-kelvin', kelvin);

  //todo implement session variable of users prefrence k or f
  if (userInfo.tempUnit == 'C') {
    var Temperature = KtoC(kelvin);
  } else {
    var Temperature = KtoF(kelvin);
  }

  tempview.appendChild(document.createTextNode(Temperature + '\xB0')); 
  //todo add degree symbol
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
  panel.setAttribute('class', 'panel panel-default');
  panel.setAttribute('id', spot['spot_id']);
  var pHead = document.createElement('div');
  pHead.setAttribute('class', 'panel-heading');
  var pBody = document.createElement('div');
  pBody.setAttribute('class', 'panel-body');

  pHead.appendChild(document.createTextNode(spot['spot_name']));

  var favlink = document.createElement('a');
  favlink.setAttribute('class', 'favoriteButton');
  favlink.setAttribute('onclick', 'favorite(' + spot['spot_id'] + ')');
  var favglyph = document.createElement('span');
  favglyph.setAttribute('class', 'glyphicon glyphicon-star-empty');
  favlink.appendChild(favglyph);
  pHead.appendChild(favlink);


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
  iconcol.setAttribute('class', 'col-lg-4');
  var weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('class', 'weatherIcon');
  iconcol.appendChild(weatherIcon);
  weatherrow.appendChild(iconcol);
  var temp = document.createElement('div');
  temp.setAttribute('class', 'currentTemp col-lg-4');
  var tempspan = document.createElement('span');
  tempspan.setAttribute('class', 'Temperature');
  temp.appendChild(tempspan);
  weatherrow.appendChild(temp);

  //third box
  var thirdbox = document.createElement('div');
  thirdbox.setAttribute('class', 'col-lg-4');
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

function userloggedin(JSONprofile) {
  //console.log(JSONprofile);

  userPackage = JSON.parse(JSONprofile);
  //console.log(userPackage);
  userInfo = userPackage['userInfo'];
  favoriteSpots = JSON.parse(userPackage['favorites']);

  console.log(userInfo);
  console.log(favoriteSpots);

  //todo apply to html, settemp etc put user name in settings and welcom modal
    //set temp
    //enable settings controls and remove sign in button
    //disable sign in tooltip on favorites button
    //jump to myspots ??  or not let them
    //set favorite icons accordingly
    //set report box backgrounds according to settings
}

function user(request) {
  console.log(request);

  var ErrorOut = document.getElementById('loginMessage');
  displayMessage('', ErrorOut);

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
          $('#welcomeMod').modal('show');
          userloggedin(this.response);
          return;
        }
        displayMessage(this.response, ErrorOut);
        switch (this.status) {
          //todo implement conditions
          case 404: //username not found
            //disable login, leave create enabled
            break;
          case 403: //incorect password
            //empty password field, turn it red?
            //todo add clear textbox state to oninput and set when bad
            break;
          case 409: //username exists
            //empty neither, red username,
          case 406: //pass too short
            //todo highlight password
            console.log("pass too short");
          default: //php fail
            // todo decide what to do on utter failure, disable all fields

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
  postPs += '&userInfo.tempUnit=' + userInfo.tempUnit;
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
    //todo maybe check for bad chars and empties here
  //todo before encoding and sending to php
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

    //todo add minimums?

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

  function buttonControl() {

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

  nameIn.oninput = buttonControl;
  passIn.oninput = buttonControl;
});

