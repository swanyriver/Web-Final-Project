<?php

/////////////////////////////////////////
///////////cached computation///////////
////////////////////////////////////////
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

if($_POST['request']=='spotinfo'){
  echo json_encode($countygroups);
  exit();
}


/*$jfile = fopen('countygroups.json', 'w');
fwrite($jfile, json_encode($countygroups));
fclose($jfile);*/

//todo get this to work
//todo or make an SQL instead
/*$jsondata=file_get_contents("countygroups.json");
$countygroups = json_decode($jsondata, true);
var_dump($countygroups['Array']);

$counties = array_keys($countygroups);
echo $counties;
exit();*/

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <script type="text/javascript" src="source.js"></script>

    <title>Your Surf Spots</title>

</head>
<!-- todo move all style to seperate css -->
<body onresize="navsize()" onload="load()" style="background-color:rgb(178,208,254)">

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
            #TODO define onclick function to load content in body
            echo "<li><a onclick='onCountySelect(\"$count\")'>$count</a></li>";
          }
          ?>
        </ul>
        <br>
        <ul id="spotNav" class="nav navbar-nav">
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
<div id="mainwindow" data-spy="scroll" data-target=".navbar" class="container-fluid">

  <div class="panel panel-default">
  <div class="panel-heading">Panel Heading</div>
  <div class="panel-body">Panel Content</div>
  </div>


</div>

<!-- Bootstrap Core CSS -->
<link href="css/bootstrap.min.css" rel="stylesheet">

<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>
  
</body>

</html>