<?php
class httpRequest{
	function httpRequestFn($url,$type,$params,$headers){
		$curl =curl_init();
		$timeout = 5;
		curl_setopt($curl,CURLOPT_URL,$url);
		// header 共四种
		// 使用  http_build_query函数转换数组   key-value enctype 中是 array('Content-type: application/x-www-form-urlencoded')
		// 如果  直接给数组   array('Content-type: multipart/form-data')); 
		// 需要时用 json格式的字符串  json_encode, array('Content-type:  application/json')) 需要使用  php://input 里获得原始输入流，再 json_decode 成对象
		// 应该需要xml  array('Content-type:  text/xml'))
		if($headers!=""){
			curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
		}
		curl_setopt ($curl, CURLOPT_RETURNTRANSFER, true);  
        curl_setopt ($curl, CURLOPT_CONNECTTIMEOUT, $timeout); 
		switch($type){
			case "GET":
				curl_setopt($curl, CURLOPT_HTTPGET, true);
				break;
			case "POST":
				curl_setopt($curl, CURLOPT_POST,true);  
				curl_setopt($curl,CURLOPT_HEADER,0);
				curl_setopt($curl, CURLOPT_POSTFIELDS,$params);
				break;
			case "PUT":
				curl_setopt ($curl, CURLOPT_CUSTOMREQUEST, "PUT");   
                curl_setopt ($curl, CURLOPT_POSTFIELDS,$params);
				break;
			case "DELETE":
				curl_setopt ($curl, CURLOPT_CUSTOMREQUEST, "DELETE");   
                curl_setopt ($curl, CURLOPT_POSTFIELDS,$params);
				break;
		}
		$result = array();
		$result["response"] = curl_exec($curl);
		if(curl_errno($curl)){
			$info = curl_getinfo($curl);
			$result["info"] = $info;
		}
		return $result;
		curl_close($curl);
	}
}
?>
	