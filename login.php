<?php

header('Content-Type: text/plain');

if(mysql_num_rows(mysql_query("SHOW TABLES LIKE '".$table."'"))==1){
  echo "table exists";
} else {
  echo "no table";
}



?>