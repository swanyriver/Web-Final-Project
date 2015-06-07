<?php
//todo disable
ini_set('display_errors', 'On');

ini_set('session.save_path',realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));
session_start();

echo "<!DOCTYPE html>";

$counties = array("Sonoma","Marin","San Francisco","San Mateo","Santa Cruz");
$conditions = array("0","Poor","Poor-Fair","Fair","Fair-Good","Good");
$tempmin = 283;
$tempMax = 313;
$waveMin = 1;
$waveMax = 10;
$userLoggedin = false;

?>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <link href="inversebutton.css" rel="stylesheet">
    <!-- my CSS -->
    <link href="style.css" rel="stylesheet">

    <script type="text/javascript" src="spotJSON.js"></script>
    <?php
      if(session_status() != PHP_SESSION_ACTIVE){
        echo "<!-- Problem starting session -->";
      } else {
        echo "<!--started session -->";

        if(isset($_POST['logout'])){
          //destroy session
          session_unset();
          session_destroy();
          echo "<!--user is logged out-->";
        } else if(isset($_SESSION['userInfo'])){

          //display user info JSON in html
          //echo "<!--user: {$_SESSION['username']} -->";


          $userLoggedin=true;

          echo "
            <script>
              var userInfo = JSON.parse('{$_SESSION['userInfo']}');
              var favoriteSpots = JSON.parse('{$_SESSION['favorites']}');
            </script>
          ";
        }
      }

      if(session_status() != PHP_SESSION_ACTIVE || !isset($_SESSION['userInfo'])){
        echo "
            <script>
              var userInfo = JSON.parse(noUser);
              var favoriteSpots = JSON.parse(noFavorites);
            </script>
          ";
      }
    ?>

    <title>Your Surf Spots</title>

</head>
<!-- todo move all style to seperate css -->
<body onresize="navsize()" onload="load()">

<nav id='navbar' class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="row">

      <div id="logo" class = "col-lg-2">
        <a href="#" onclick="mySpots()" >
          <img src="logo.png">
        </a>
      </div>

      <div class="col-lg-8">
        <ul class="nav nav-pills nav-justified">
          <?php
          foreach ($counties as $count) {
            echo "<li><a onclick='onCountySelect(\"$count\")'>$count</a></li>";
          }
          ?>
        </ul>
        <br>
        <ul id="spotNav" class="nav navbar-nav">
        </ul>
      </div>

      <div class="col-lg-2 controlPanel">

         <!--login button -->
        <?php if(!$userLoggedin) 
          echo "<button id=\"loginButton\"
            class = \"btn btn-success\" data-toggle=\"modal\" data-target=\"#loginMod\">
            <span class=\"glyphicon glyphicon-user\"></span>
            Login
          </button>";
          else
          echo "<form action=\"main.php\" method=\"POST\" id=\"logoutbutton\">
          <input type=\"text\" name=\"logout\" value=\"logout\" hidden>
          <button type=\"submit\" class = \"btn btn-danger\">
            <span class=\"glyphicon glyphicon-log-out\"></span>
            Logout
          </button> 
         </form> "
        ?>

        <button class = "btn btn-inverse" data-toggle="modal" data-target="#settingsMod">
          <span class="glyphicon glyphicon-cog"></span>
          Settings
        </button>


        <div id="tempControls" class="btn-group">
          <button id="Fbutton" type="button" class="btn btn-inverse" onclick="changeUnit('F')">
            F&deg;
          </button>
          <button id="Cbutton" type="button" class="btn btn-inverse" onclick="changeUnit('C')">
            C&deg;
          </button>
        </div>
      </div>

    </div>
  </div>
</nav>

<div id="blocker"></div>
<!-- data-spy="scroll" data-target=".navbar"
//todo get navspy activity to work
-->
<div class="container-fluid" id="bodyContainer">
<div class="row">
<div  class="col-lg-8">

<div id="mainwindow" >
<!--todo make a splash page, if they arent logged in! -->
</div>

<!--
Bootstrap.png
Maps-logo-white.png
spitlogowhite.png
OpenWeatherMap_logo_white.png
-->
<div id="APIroll" class='row'>

<div id="apiSpit" class="col-lg-3">
<a href="http://www.spitcast.com/">
 <img src = 'spitlogowhite.png'>
 Spitcast Surf Forecast
</a>
</div>

<div id="apiOpenWeather" class="col-lg-3">
<a href="http://openweathermap.org/">
 <img src = 'OpenWeatherMap_logo_white.png'>
 Open Weather Map
</a>
</div>

<div id="apiBootstrap" class="col-lg-3">
<a href="http://getbootstrap.com/">
 <img src = 'Bootstrap.png'>
 Twitter Bootsrap
</a>
</div>

<div id="apiMap" class="col-lg-3" hidden>
<a href="https://developers.google.com/maps/">
 <img src = 'Maps-logo-white.png'>
 Google Maps
</a>
</div>

</div> <!--api roll -->

</div>
<div class="col-lg-4">
<!-- todo figure out how to get the map to display over here 
      todo change this from collumn to just all panel divs are n% wide
      and make image a static background
-->
</div>
</div>


</div> <!--end of container fluid for body -->

<!-- settings modal -->
<div class="modal fade" id="settingsMod" role="dialog">
  <div class="modal-dialog modal-lg">
  
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Your Surf Spot Sweet Spot</h4>
      </div>
      <div class="modal-body">
        <p>Tell us how you like your Surf Spots and we will help you spot that perfect spot to hit the waves today</p>

        <form id="userSettings">
          <div class="row">

            <!--todo generate settings and select users prefs -->
            <div class="col-lg-3 settingBox">
              <h2>Weather<br><small>Minimum</small></h2>
              <select class="form-control" id="userWeather"
                <?php if(!$userLoggedin) echo " disabled" ?>>
                <option value="null" selected="">Not Selected</option>
                <?php
                  for($i = $tempMax; $i>=$tempmin; $i-=3){
                    echo "<option value=\"$i\" 
                    class=\"Temperature\" data-kelvin=\"$i\">
                    </option>";
                  }
                ?>
              </select>
            </div>
            <div class="col-lg-3 settingBox">
              <h2>Water<br><small>Minimum</small></h2>
              <select class="form-control" id="userWaterTemp" 
              <?php if(!$userLoggedin) echo " disabled" ?>>
                <option value="null" selected="">Not Selected</option>
                <?php
                  for($i = $tempMax; $i>=$tempmin; $i-=3){
                    echo "<option value=\"$i\" 
                    class=\"Temperature\" data-kelvin=\"$i\">
                    </option>";
                  }
                ?>
              </select>
            </div>
            <div class="col-lg-3 settingBox">
              <h2>Wave Height<br><small>Minimum</small></h2>
              <select class="form-control" id="userWaveHeight"
                <?php if(!$userLoggedin) echo " disabled" ?>>
                <option value="null" selected="">Not Selected</option>
                <?php
                  for($i = $waveMax; $i>=$waveMin; $i--){
                    echo "<option value=\"$i\" 
                    class=\"WaveHeight\"> $i <sup>ft</sup>
                    </option>";
                  }
                ?>
              </select>
            </div>
            <div class="col-lg-3 settingBox">
              <h2>Rating<br><small>Minimum</small></h2>
              <select class="form-control" id="userRating"
                <?php if(!$userLoggedin) echo " disabled" ?>>
                <option value="null" selected="">Not Selected</option>
                <?php
                  for ($i=5; $i>=1; $i--) {
                    echo "<option value=\"$i\" 
                    class=\"grade\"> {$conditions[$i]}
                    </option>";
                  }
                ?>
              </select>
            </div>
          </div>
          <!--todo add another temp control, maybe -->
        </form>

      </div>
      <div class="modal-footer">
        <?php 
          if(!$userLoggedin)
            echo "<button id=\"settingsLogin\" class =\"btn btn-success\" 
          data-toggle=\"modal\" data-target=\"#loginMod\">
          <span class=\"glyphicon glyphicon-user\"></span>
          Login
        </button>";
          else
            echo "<button id=\"settingsSave\" class =\"btn btn-success\" 
          data-dismiss=\"modal\">
          <span class=\"glyphicon glyphicon-edit\"></span>
          Save Settings
        </button>"
        ?>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
    
  </div>
</div>

<!-- welcom modal -->
<div class="modal fade" id="welcomeMod" role="dialog">
  <div class="modal-dialog modal-lg">
  
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Welcome to My Surf Spots</h4>
      </div>
      <div class="modal-body">
        <p>#insert welcom display here</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
    
  </div>
</div>

<!-- Login Modal -->
<div class="modal fade" id="loginMod" role="dialog">
  <div class="modal-dialog">
  
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Sign in to My Surf Spots</h4>
      </div>
      <div class="modal-body">
        <p>Users can save their favorite surf spots and 
        set minimum weather and wave conditions to be alerted to wich spots are particularily primo today</p>

        <!-- login form -->

        <form class="form-horizontal" id="LoginForm" onsubmit="return false;">
        <div class="form-group">
          <label for="inputEmail3" class="col-sm-2 control-label">UserName</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="loginUserName" placeholder="UserName">
          </div>
        </div>
        <div class="form-group">
          <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" id="loginPassword" placeholder="Password">
          </div>
        </div>
        <div class="form-group" id="submitLogin">
          <div class="col-sm-offset-2 col-sm-10">
            <button class="btn btn-info" onclick="user('login')" disabled>
              <span class="glyphicon glyphicon-log-in"></span>
              Sign in
            </button>
            <button class="btn btn-info" onclick="user('signup')" disabled>
              <span class="glyphicon glyphicon-user"></span>
              Create Account
            </button>
          </div>
        </div>
      </form>
        <!-- end login form -->
        
      </div>
      <div class="modal-footer">
        <span id="loginMessage" class="text-danger"> </span>
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
    
  </div>
</div>

<?php if(!$userLoggedin) 
  echo "<form action=\"main.php\" method=\"POST\" id=\"logoutbutton\" hidden>
  <input type=\"text\" name=\"logout\" value=\"logout\" hidden>
  <button type=\"submit\" class = \"btn btn-danger\">
    <span class=\"glyphicon glyphicon-log-out\"></span>
    Logout
  </button> 
 </form> ";


  echo "
  <form hidden>
  <button id=\"settingsSave\" class =\"btn btn-success\" 
  data-dismiss=\"modal\">
  <span class=\"glyphicon glyphicon-edit\"></span>
  Save Settings
  </button> </form>";
?>

 <script type="text/javascript" src="source.js"></script>

  
</body>

</html>