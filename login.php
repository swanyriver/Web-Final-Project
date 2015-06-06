<?php

header('Content-Type: text/plain');

echo $_POST['favorites'];
exit();

include "storedInfo.php"; //contains hostname/username/password/databasename

//connect to database with created mysqli object
$mysqli = new mysqli($hostname, $Username, $Password, $DatabaseName);
if ($mysqli->connect_errno || $mysqli->connect_error)
{
  http_response_code(500);
  echo "User Login currently unvailable";
  exit();
}

$surfTable = "surfUsers";

//create table if it doesnt exist
$mysqli->query("CREATE TABLE IF NOT EXISTS $surfTable (
  name VARCHAR(127) UNIQUE PRIMARY KEY,
  passSalt VARCHAR(255) NOT NULL,
  passHashed VARCHAR(255) NOT NULL,
  prefWeather INT,
  prefWater INT,
  prefWave INT,
  prefRating INT,
  favoritesJSON CHAR(269)
)");

if($_POST['request'] == 'login'){
  //check that password matches what we have in database

} else if ($_POST['request'] == 'signup'){
  //check that username is available

  //add user to database


} else {
  http_response_code(500);
  echo "We cannot perform that action right now";
  exit();
}

?>