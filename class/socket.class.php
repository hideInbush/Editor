<?php
class socketClass{
	private $ip;
	private $port;
	private $socket;
	function createSocket($host,$port){
		$socket=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
		if($socket<0){
			$string = "socket_create() failed: reason:".socket_strerror($socket);
		}
		$connect = socket_connect($socket,$host,$port);
		if($connect <0){
			$string = "socket_connect() failed: reason:".socket_strerror($connect);
		}
		$this->socket = $socket;
		
	}
	function readsocket($size){
		$socket = $this->socket;
		$once_size=10*1024;
		$times=ceil($size/$once_size);
		$data="";
		for($i=0;$i<$times;$i++){
			if($i==($times-1)){
				$once_size=$size-$once_size*($times-1);
			}
			$read=$once_size;
			$string="";
			$repeat_time=0;
			do{
				$tmp_data=socket_read($socket,$read,PHP_BINARY_READ);
				$tmp_len=strlen($tmp_data);
				if($tmp_len==0){
					$repeat_time++;
				}
				$string=$string.$tmp_data;
				$len=strlen($string);
				$read=$once_size-$len;
			}while($len<$once_size||$repeat_time==10);
			$data=$data.$string;
		}
		if(strlen($data)==$size){
			return $data;
		}
		else {
			echo "failed";
			return 0;
		}
	}
	function sendsocket_data($headline,$data){
		$socket = $this->socket;
		$data_length=strlen($data);
		$zero=0;
		$length=pack("V*",$data_length,$zero);
		$head=$headline.$length;
		socket_write($socket,$head);
		socket_write($socket,$data);
		return $length;
	}
	function sendsocket_length($data_length){
		$socket = $this->socket;
		$zero=0;
		$length=pack("V*",$data_length,$zero);
		socket_write($socket,$length);
		return $length;
	}
	function send_commond($commond,$data_array){
		$socket = $this->socket;
		socket_write($socket,$data_array);
		$result = $this->readsocket($socket,8,PHP_BINARY_READ);
		
	}
	function closeSocket(){
		socket_close($this->socket);
	}
	function sendJson($jsonString){
		$socket = $this->socket;
		$dataLength = strlen($jsonString);
		$length = pack("N",$dataLength);
		socket_write($socket,$length);
		socket_write($socket,$jsonString);
		$result = socket_read($socket,4,PHP_BINARY_READ);
		$numarray = unpack("N*number",$result);
		$data = $this->readsocket($numarray["number1"]);
		return $data;
	}
}
