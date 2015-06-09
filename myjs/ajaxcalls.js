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
  var weatherRequest = wurl + '?' + lat + '&' + lon + '&' + weatheroptions;

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