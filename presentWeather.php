<?php 
header('Content-Type: text/plain');

echo "im sorry ";
exit();

$curl = curl_init();


$curl_setopt($ch, CURLOPT_URL,"http://api.openweathermap.org/data/2.5/weather");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
         '&lat='. $_POST['lat'] .'&lon='. $_POST['lon']
         ."&mode=json");



curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$return = curl_exec($curl);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE); 
http_response_code($status);

echo $return;

curl_close($curl);

exit();

?>