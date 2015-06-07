<?php
ini_set('session.save_path',realpath(dirname($_SERVER['DOCUMENT_ROOT']) . '/../session'));
session_start();

//ini_set('display_errors', 'On');

header('Content-Type: text/plain');
include "storedInfo.php"; //contains hostname/username/password/databasename
//todo on login make a session, set $_SESSION['user'] & $_SESSION['hash']

if(session_status() != PHP_SESSION_ACTIVE){
  http_response_code(500);
  echo "User Login currently unvailable";
  exit();
}

//connect to database with created mysqli object
$mysqli = new mysqli($hostname, $Username, $Password, $DatabaseName);
if ($mysqli->connect_errno || $mysqli->connect_error)
{
  http_response_code(500);
  echo "User Login currently unvailable";
  exit();
}

$surfTable = "surfUsers";

function unable(){
  http_response_code(500);
  echo "Unable to save settings for user {$_SESSION['username']}";
  exit();
}

foreach ($_POST as $key => $value) {
  $update = $mysqli->prepare("
    UPDATE $surfTable
    SET $key=?
    WHERE name=?");
  if(!$update) {
    unable();
  }

  $update->bind_param("ss",
    $value,
    $_SESSION['username']
    );

  if(! $update->execute() ){
    $update->close();
    unable();
  }
}

$update->close();
http_response_code(201);

$user = array();
$stmt = $mysqli->prepare("SELECT name,prefWeather,prefWater,prefWave,prefRating,tempUnit,favoritesJSON 
  FROM $surfTable WHERE name = ?");
$stmt->bind_param("s",$_SESSION['username']);
$stmt->execute();
$stmt->bind_result($user['name'],$user['prefWeather'],$user['prefWater'],
  $user['prefWave'],$user['prefRating'],$user['tempUnit'],$_SESSION['favorites']);
$user['logedin'] = true;
$stmt->fetch();
$stmt->close();
$_SESSION['userInfo'] = json_encode($user);

echo "Your settings have been saved!";
exit();