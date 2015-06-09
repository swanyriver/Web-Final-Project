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