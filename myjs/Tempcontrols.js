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
