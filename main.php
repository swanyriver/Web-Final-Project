<?php
//todo disable
ini_set('display_errors', 'On');

ini_set('session.save_path',realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));
session_start();

echo "<!DOCTYPE html>";

$counties = array("Sonoma","Marin","San Francisco","San Mateo","Santa Cruz");
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
          echo "<!--user: {$_SESSION['username']} -->";
          //echo "<!--" . var_export($_SESSION) . "-->";
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

      <div class="col-lg-1 controlPanel">
        <!-- todo connect to modal -->
        <!-- todo dont display if already logged in -->
        <button class = "btn btn-success" data-toggle="modal" data-target="#loginMod">
          <span class="glyphicon glyphicon-user"></span>
          Login
        </button>

        <!-- <button class = "btn btn-danger">
          <span class="glyphicon glyphicon-log-out"></span>
          Logout
        </button> -->

        <!-- todo connect to modal -->
        <!-- todo connect to sign in if not signed in -->
        <button class = "btn btn-default" data-toggle="modal" data-target="#settingsMod">
          <span class="glyphicon glyphicon-cog"></span>
          Settings
        </button>


        <div id="tempControls" class="btn-group">
          <button id="Fbutton" type="button" class="btn btn-default>" onclick="changeUnit('F')">
            F&deg;
          </button>
          <button id="Cbutton" type="button" class="btn btn-default" onclick="changeUnit('C')">
            C&deg;
          </button>
        </div>
        </p>
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
    <div class="panel panel-default" id="testpanel">
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
    </div>user
    </div>
    <!--end of panel -->

    <form action="login.php" method="POST">
      <input type="text" name="username" value="doris">
      <input type="text" name="password" value="hate">
      <input type="text" name="request" value="login">
      <input type="submit" value="login">
     </form> 

    <form action="main.php" method="POST">
      <input type="text" name="logout" value="logout" hidden>
      <button type="submit" class = "btn btn-danger">
        <span class="glyphicon glyphicon-log-out"></span>
        Logout
      </button> 
     </form> 

</div>
<div class="col-lg-4">
<!-- todo figure out how to get the map to display over here 
      todo change this from collumn to just all panel divs are n% wide
      and make image a static background
-->
</div>
</div>

<!-- todo make a api footer roll -->
<!-- todo make sure it displays at the bottom of the page -->
API FOOTER ROLL HERE

</div>

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

        <br> #insert form here
        <br>
         <button class = "btn btn-success" data-toggle="modal" data-target="#loginMod">
          <span class="glyphicon glyphicon-user"></span>
          Login
        </button>
      </div>
      <div class="modal-footer">
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


 <script type="text/javascript" src="source.js"></script>

 <?php 
 //todo if logged in overide user object here
 if($userLoggedin){
/*  echo "<script> 
    userInfo = JSON.parse({$_SESSION['userInfo']});
  </script>";
*/
  session_write_close();
 }
 
 ?>
  
</body>

</html>