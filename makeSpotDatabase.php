<?php
ini_set('display_errors', 'On');
header('Content-Type: text/plain');


include "storedInfo.php";

$spotfilter = array(
"Goat Rock",
"Salmon Creek",
"Dillon Beach",
"The Patch",
"Bolinas",
"Stinson Beach",
"Fort Cronkhite",
"Fort Point",
"Eagles Point",
"Deadmans",
"Kellys Cove",
"North Ocean Beach",
"South Ocean Beach",
"Rockaway Beach",
"Linda Mar",
"Montara",
"Mavericks",
"Princeton Jetty",
"Pomponio State Beach",
"Pescadero State Beach",
"Franklin Point",
"Ano Nuevo",
"Waddell Creek",
"Scotts Creek",
"Davenport Landing",
"Four Mile",
"Natural Bridges",
"Mitchells Cove",
"Steamer Lane",
"Cowells",
"26th Avenue",
"Pleasure Point",
"38th Avenue",
"The Hook",
"Manresa"
);



//$mysqli = new mysqli($hostname, $Username, $Password, $DatabaseName);

$json_spots = file_get_contents("allspots.json");
$allspots = json_decode($json_spots, true);

$countygroups = array();
foreach ($allspots as $spot) {
  if ($spot["county_name"] == "Monterey") break;

  if(in_array($spot["spot_name"], $spotfilter) && $spot["county_name"] != "Humboldt"){
    if(!array_key_exists($spot['county_name'],$countygroups)){
      $countygroups[$spot['county_name']] = array();
    }
    $countygroups[$spot['county_name']][] = $spot;
  }
  
 /* $url = "http://api.spitcast.com/api/spot/forecast/" . $spot['spot_id'] . "/";

  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  $response=curl_exec($curl);
  curl_close($curl);

  if($response[0] != '<'){
    echo $spot['county_name'] . ": " . $spot['spot_name'] . "\n";
  }*/
}

echo json_encode($countygroups);

?>