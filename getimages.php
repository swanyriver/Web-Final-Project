<?php

$json_spots = file_get_contents("allspots.json");
$allspots = json_decode($json_spots, true);

$counties = array("Del Norte", "Humboldt", "Mendocino", "Sonoma", "Marin", "San Francisco", "San Mateo", "Santa Cruz", "Monterey", "San Luis Obispo", "Santa Barbara", "Ventura", "Los Angeles", "Orange County", "San Diego", );

$countygroups = array();
foreach ($allspots as $spot) {
  if(!array_key_exists($spot['county_name'],$countygroups)){
    $countygroups[$spot['county_name']] = array();
  }
  $countygroups[$spot['county_name']][] = $spot;
}



?>



<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Your Surf Spots</title>

    

</head>
<body>

<?php
/*foreach ($countygroups as $county => $spots) {
  echo "<br><b> $county </b>";
  foreach ($spots as $spot) {
    echo "{$spot["spot_name"]}";
  }
}*/
$pipe = "%7C";
$url = "https://maps.googleapis.com/maps/api/staticmap?size=1020x1280&markers=";

foreach ($countygroups as $county => $spots) {
  echo "<br><b> $county </b><br>";
  $countyurl = $url;
  foreach ($spots as $spot) {
    $countyurl .= $spot['latitude'] . "," . $spot['longitude'] . $pipe;
  }
  #echo $countyurl;
  echo "<img src=$countyurl>";
}
?>

</body>
</html>