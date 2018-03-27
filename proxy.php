<?php
ini_set("session.name","session_id");
session_start();
$data=file_get_contents("php://input");
$paramsArray = json_decode($data,true);
$paramsArray["session_id"] = session_id();
include_once("./class/httpRequest.php");
$httpRequest = new httpRequest();
$type = "POST";
$url = "http://ebook.local/ebook";
$headers = array("Content-type:application/json;");
$paramsString = json_encode($paramsArray);
$result = $httpRequest->httpRequestFn($url,$type,$paramsString,$headers);
echo $result['response'];
?>