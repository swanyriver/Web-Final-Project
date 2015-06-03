<?php

$json_spots = file_get_contents("allspots.json");
$allspots = json_decode($json_spots, true);

$countygroups = array();
foreach ($allspots as $spot) {
  if ($spot["county_name"] == "Santa Cruz") break;
  if(!array_key_exists($spot['county_name'],$countygroups)){
    $countygroups[$spot['county_name']] = array();
  }
  $countygroups[$spot['county_name']][] = $spot;
}
$counties = array_keys($countygroups);

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<meta name="viewport" content="width=device-width, initial-scale=1"> -->
    <meta name="description" content="">
    <meta name="author" content="">

    <script type="text/javascript" src="navsize.js"></script>

    <title>Your Surf Spots</title>

    

</head>
<body onresize="navsize()" onload="navsize()">

<nav id='navbar' class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="row">

      <div class = "col-lg-2">
        <img src="logo.png" style="height:100px; width:auto;">
      </div>

      <div class="col-lg-9">
        <ul class="nav nav-pills nav-justified">
          <?php
          foreach ($counties as $count) {
            #todo define onclick function to load content in body
            echo "<li><a href='#'>$count</a></li>";
          }
          ?>
        </ul>
        <br>
        <ul class="nav nav-pills">
          <li><a href='#'>test1</a></li>
          <li><a href='#'>test1</a></li>
          <li><a href='#'>test1</a></li>
          <li><a href='#'>test1</a></li>
        </ul>
      </div>

      <div class="col-lg-1">
        <p style="color:white;">userstuff <br> api logo</p>
      </div>

    </div>
  </div>
</nav>

<!-- style="margin-top: 100px;"-->
<div id="blocker"></div>
<div id="mainwindow" class="container-fluid">
<?php

foreach ($countygroups as $county => $spots) {
  echo "<br><b> $county </b>";
  foreach ($spots as $spot) {
    echo "<br>{$spot['spot_name']}";
  }
  #echo $countyurl;
  echo "<img src=$countyurl>";
}

?>
</div>

<!-- Bootstrap Core CSS -->
<link href="css/bootstrap.min.css" rel="stylesheet">

<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>
  
</body>

</html>