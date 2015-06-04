<?php

header('Content-Type: text/plain');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $_POST['url']);
curl_exec($curl);
curl_close($curl);

?>
