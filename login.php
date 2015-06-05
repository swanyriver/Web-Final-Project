<?php

header('Content-Type: text/plain');

echo "LOGIN.php response";

foreach ($_POST as $key => $value) {
  echo "$key:$value";
}


?>