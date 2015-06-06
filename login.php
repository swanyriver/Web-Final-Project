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

if(mysql_num_rows(mysql_query("SHOW TABLES LIKE '".$table."'"))==1){
  echo "table exists";
} else {
  echo "no table";
}



?>