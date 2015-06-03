<?php

$json_spots = file_get_contents("allspots.json");
$allspots = json_decode($json_spots, true);

$counties = array("Del Norte", "Humboldt", "Mendocino", "Sonoma", "Marin", "San Francisco", "San Mateo", "Santa Cruz", "Monterey", "San Luis Obispo", "Santa Barbara", "Ventura", "Los Angeles", "Orange County", "San Diego", );

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

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

</head>
<body>

<?php

$county = '';
echo "counties = array(";
foreach ($allspots as $spot) {
  #echo "{$spot['spot_name']} --  {$spot['county_name']} -- {$spot['latitude']} <br>";
  if($spot['county_name'] != $county){
    echo "\"{$spot['county_name']}\", ";
    $county = $spot['county_name'];
  } 
}
echo ");";

?>
  
</body>

</html>