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