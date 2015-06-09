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

//button click relies on this for submiting
$('#settingsMod').on('hide.bs.modal', updateUserSettings);

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