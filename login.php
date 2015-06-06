<?php

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
  tempUnit CHAR(1) DEFAULT 'F',
  favoritesJSON TEXT
)");

//check that username exists
$usrInStmt = $mysqli->prepare("SELECT COUNT(*) FROM surfUsers WHERE name = ?");
$usrInStmt->bind_param("s", $_POST['username']);
$usrInStmt->execute();
$usrInStmt->bind_result($userExists);
$usrInStmt->fetch();
$usrInStmt->close();

if($_POST['request'] == 'login'){

  //check that user is in database
  if(!$userExists){
    http_response_code(404);
    echo "We dont have a user with that name. Would you like to create that account now?";
    exit();
  }

  //check that password matches what we have in database
  //retrieve has from database
  $getHash = $mysqli->prepare("SELECT passHashed FROM $surfTable WHERE name = ?");
  $getHash->bind_param("s",$_POST['username']);
  $getHash->execute();
  $getHash->bind_result($hash);
  $getHash->fetch();
  $getHash->close();

  if(password_verify($_POST['password'],$hash)){
    http_response_code(200);
    //todo need to echo json of entire row, except hash and username
    echo "succesfully logged in";
    exit();
  } else {
    http_response_code(403);
    echo "Incorect Password";
    exit();
  }

} else if ($_POST['request'] == 'signup'){


  if($userExists) {
    http_response_code(409);
    echo "A user with that name already exists";
    exit();
  }

  //PLEASE NOTE: the returned string includes algo, random salt, and hash
  $hashp = password_hash($_POST['password'], PASSWORD_DEFAULT);

  //add user to database
  $addUser = $mysqli->prepare("INSERT INTO 
    $surfTable ( name, passHashed, favoritesJSON, tempUnit ) 
    VALUES (?,?,?,?)");

  $addUser->bind_param("ssss", $_POST['username'], $hashp, $_POST['favorites'], $_POST['tempUnit']);

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