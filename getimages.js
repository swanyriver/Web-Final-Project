var spotInfo = JSON.parse(spotJSON);

pipe = "%7C";
url = "https://maps.googleapis.com/maps/api/staticmap?size=600x600&markers=";

var counties ["Sonoma","Marin","San Francisco","San Mateo","Santa Cruz"];

var allMarks;
var pipe = "%7C";
for (var i = counties.length - 1; i >= 0; i--) {
  var spots = spotInfo[counties[i]];
  var countyMark;

  for (var i = spots.length - 1; i >= 0; i--) {
    countyMark += spots[i]['latitude'] + ',' + spots[i]['longitued'] + pipe;
  };

  allMarks += countyMark;

  console.log(url+countyMark);

};

console.log(url + allMarks);
