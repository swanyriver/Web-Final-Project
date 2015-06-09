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
