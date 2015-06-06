<?php

header('Content-Type: text/plain');

include "storedInfo.php"; //contains hostname/username/password/databasename

//connect to database with created mysqli object
$mysqli = new mysqli($hostname, $Username, $Password, $DatabaseName);
if ($mysqli->connect_errno || $mysqli->connect_error)
{
  http_response_code(500);
  echo "User Login currently unvailable";
  exit();
}

http_response_code(404);

$table = "surfUsers";

//create table if it doesnt exist
$mysqli->query("CREATE TABLE IF NOT EXISTS $surfUsers (
  name VARCHAR(127) UNIQUE NOT NULL,
  passSalt VARCHAR(255), NOT NULL,
  passHashed VARCHAR(255), NOT NULL,
  prefWeather INT,
  prefWater INT,
  prefWave INT,
  prefRating INT,
  favoritesJSON CHAR(269)
)");


  

?>