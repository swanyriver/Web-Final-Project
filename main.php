<?php

$counties = array("Sonoma","Marin","San Francisco","San Mateo","Santa Cruz");

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

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- my CSS -->
    <link href="css/style.css" rel="stylesheet">

    <title>Your Surf Spots</title>

</head>
<!-- todo move all style to seperate css -->
<body onresize="navsize()" onload="load()">

<nav id='navbar' class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="row">

      <div id="logo" class = "col-lg-2">
        <a onclick="mySpots()" >
          <img src="logo.png">
        </a>
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

<div id="blocker"></div>
<!-- data-spy="scroll" data-target=".navbar"
//todo get navspy activity to work
-->
<div class="container-fluid">
<div class="row">
<div id="mainwindow" class="col-lg-8">
  <!--todo make a splash page, if they arent logged in! -->
    <div class="panel panel-default">
    <div class="panel-heading">
    <span "spotLabel"> spot name </span>
    <a class="favoriteButton" onclick="favorite(spotid)">
      <span class="glyphicon glyphicon-star-empty"></span>
    </a>
    </div>
    <div class="panel-body">

    <div clas="row">

      <!---weather -->
      <div class="col-lg-4">
        <label>Weather</label> <br>
          <div class="reportSection">
          <img class="weatherIcon">
          <div style="float:left">
          88&deg; 
          </div>
          <div>
          HI:<br>
          LO:
          </div>
        </div>
      </div>

      <!---water temp -->
      <div class="col-lg-3">
      
        <label>Water Temp</label> <br>
        <div class="reportSection">
        55&deg; 
        </div>
      </div>

      <!---wave height -->
      <div class="col-lg-3">
        <label>wave height</label> <br>
        <div class="reportSection">
        <div class="waveHeightText"> 10ft </div> 

        <div>
        HI:<br>
        LO:
        </div>
        </div>
      </div>

      <!---grade -->
      <div class="col-lg-2">
        <label>Rating</label> <br>
        it sucks
      </div>


    </div>

    </div>
    </div>
</div>
<div class="col-lg-4">
<!-- todo figure out how to get the map to display over here -->
</div>
</div>

</div>


  
</body>

</html>