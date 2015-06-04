<?php
ini_set('display_errors', 'On');
header('Content-Type: text/plain');


include "storedInfo.php";

//$mysqli = new mysqli($hostname, $Username, $Password, $DatabaseName);

$json_spots = file_get_contents("allspots.json");
$allspots = json_decode($json_spots, true);

$countygroups = array();
foreach ($allspots as $spot) {
  if ($spot["county_name"] == "Monterey") break;
  
  $url = "http://api.spitcast.com/api/spot/forecast/" . $spot['spot_id'] . "/";

  $curl = curl_init();
  curl_setopt($curl, CURLOPT_URL, $url);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
  $response=curl_exec($curl);
  curl_close($curl);

  if($response[0] != '<'){
    echo $spot['county_name'] . ": " . $spot['spot_name'] . "\n";
  }


}


?>