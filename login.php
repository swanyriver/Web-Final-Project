<?php

//todo remove
ini_set('display_errors', 'On');

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

$surfTable = "surfUsers";

//create table if it doesnt exist
$mysqli->query("CREATE TABLE IF NOT EXISTS $surfTable (
  name VARCHAR(127) PRIMARY KEY,
  passHashed VARCHAR(255) NOT NULL,
  prefWeather INT,
  prefWater INT,
  prefWave INT,
  prefRating INT,
  favoritesJSON TEXT
)");

if($_POST['request'] == 'login'){
  //check that password matches what we have in database

} else if ($_POST['request'] == 'signup'){
  //check that username is available
  $usrInStmt = $mysqli->prepare("SELECT COUNT(*) FROM surfUsers WHERE name = ?");
  $usrInStmt->bind_param("s", $_POST['username']);
  $usrInStmt->execute();
  $usrInStmt->bind_result($userExists);
  $usrInStmt->fetch();
  $usrInStmt->close();

  if($userExists) {
    http_response_code(409);
    echo "A user with that name already exists";
    exit();
  }

  //PLEASE NOTE: the returned string includes algo, random salt, and hash
  $hashp = password_hash($_POST['password'], PASSWORD_DEFAULT);

  //add user to database
  $addUser = $mysqli->prepare("INSERT INTO $surfTable ( name, passHashed, favoritesJSON ) VALUES (?,?,?)");
  $addUser->bind_param("sss", $_POST['username'], $hashp, $_POST['favorites']);
  if(!$addUser->execute()){
    http_response_code(500);
    echo "We cannot perform that action right now";
    exit();
  }
  $addUser->close();

  http_response_code(201);
  echo "Account created";
  exit();

} else {
  http_response_code(500);
  echo "We cannot perform that action right now";
  exit();
}

?>