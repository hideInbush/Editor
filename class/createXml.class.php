<?php
class createXml{
	public $jPath;
	public $xmlPath;
	public $jsonPath;
	public $resultXmlPath;
	public $dom;
	public $resultArray;
	public $baseXmlPath;
	public $baseJsonPath;
	public $baseResultXmlPath;
	public $xml;
	public $argsArray;
	public $typeArray;
	public $baseType;
	function __construct($baseData){
		$this->baseName = $baseData["name"];
		$this->baseType = $baseData["type"];
		$this->resultArray = array();
		$this->argsArray = array();
		$this->typeArray = array();
		$this->baseXmlPath = "../baseXml/";
		$this->baseJsonPath = "../data/";
		$this->baseResultXmlPath = "../xml/";
		$this->jPath = "../json/";
		$this->jsonPath = $this->baseJsonPath.$this->baseType."/".$this->baseName.".js";
		$this->xmlPath = $this->baseXmlPath.$this->baseType."/".$this->baseName.".xml";
		$this->resultXmlPath = $this->baseResultXmlPath.$this->baseType."/".$this->baseName.".xml";
	}
	function main(){
		$this->dom = $this->getXml($this->xmlPath);
		$root = $this->dom->documentElement;
		$this->resultArray = $this->getNodeData($root);
		return $this->resultArray;
	}
	function createJson(){
		$argsArray = $this->argsArray;
		$argsJsonString = $this->arrayToJs($argsArray);
		$fileAddress = $this->jsonPath;
		$this->writeFile($fileAddress,$argsJsonString);
		return $fileAddress;
	}
	function arrayToJs($argsArray){
		$string = "";
		$beginString = "{";
		$endString = "}";
		foreach($argsArray as $key=>$value){
			if(is_array($value)){
				switch($key){
					default:
						$string = $string.$key." : ".$this->arrayToJs($value).",";
					break;
				}
			}else{
				$value = $this->checkValue($value);
				$string = $string.$key." : ".$value.",";
			}
		}
		$resultString = $beginString.$string.$endString;
		return $resultString;
	}
	function writeFile($fileAddress,$dataString){
		$file = fopen($fileAddress,"w");
		if($file){
			fwrite($file,$dataString);
			fclose($file);
		}
	}
	function createXml(){
		$nodeData = $this->resultArray;
		$this->xml = new DomDocument("1.0","UTF-8");
		$root = $this->createRoot();
		$this->xml->appendChild($root);
		$define = $this->createDefine($nodeData);
		$root->appendChild($define);
		$importArray = $this->createImports();
		if($importArray){
			for($i=0;$i<count($importArray);$i++){
				$root->appendChild($importArray[$i]);	
			}
		}
		$node = $this->createNode($nodeData);
		$root->appendChild($node);
		$this->xml->save($this->resultXmlPath);
		return $this->resultXmlPath;
	}
	function getNodeData($node,$fnodeData=null){
		$nodeData = array();
		$nodeData["type"] = "node";
		$nodeData["attr"] = array();
		$nodeData["childs"] = array();
		$nodeData["args"] = array();
		$nodeData["attr"] = $this->getAttr($node);
		if(isset($fnodeData["attr"])){
			$nodeData["attr"]["id"] = $fnodeData["attr"]["id"].$nodeData["attr"]["id"];
		}
		//针对不同的组件，加入默认的部分子组件（目前是script）
		$nodeData = $this->getDefaultData($nodeData);
		if(isset($nodeData["attr"])&&isset($nodeData["attr"]["baseId"])){
			if($fnodeData){
				if(isset($fnodeData["args"]["repeatFlag"])&&$fnodeData["args"]["repeatFlag"]=="(B)true"){
					$nodeData["args"]["repeatFlag"] = "(B)true";
				}
			}
			$nodeData = $this->getLinkNodeData($nodeData);
		}
		$this->typeArray[] = $nodeData["attr"]["type"];
		$i = count($nodeData["childs"]);
		//合并子组件
		foreach($node->childNodes as $childNode){
			$childType = $this->getType($childNode);
			if($childType!=XML_TEXT_NODE){
				$childName = $this->getName($childNode);
				switch($childName){
					case "args":
						$nodeArgs = $this->getArgs($childNode);
						$nodeData["args"] = $this->dataMerge($nodeData["args"],$nodeArgs);

						if($fnodeData){
							if(isset($fnodeData["args"]["repeatFlag"])&&$fnodeData["args"]["repeatFlag"]=="(B)true"){
								$nodeData["args"]["repeatFlag"] = "(B)true";
							}
						}
						break;
					case "subs":
						foreach($childNode->childNodes as $grandChildNode){
							$grandChildType = $this->getType($grandChildNode);
							if($grandChildType!=XML_TEXT_NODE){
								$grandChildName = $this->getName($grandChildNode);
								switch($grandChildName){
									case "node":
									// 暂时先不考虑替换、指定位置添加问题；只允许在最后面添加
									$num=-1;
									if($i>0){
										$grandChildAttr = $this->getAttr($grandChildNode); 
										$grandChildAttr["id"] = $nodeData["attr"]["id"].$grandChildAttr["id"];
										$num = $this->searchInArrays($grandChildAttr["id"],$nodeData["childs"],"id");
									}
									if($num>=0){
										$tmpData = $this->getNodeData($grandChildNode,$nodeData);
										$nodeData["childs"][$num] = $this->applyIf($tmpData,$nodeData["childs"][$num]);
									}else{
										$nodeData["childs"][$i] = $this->getNodeData($grandChildNode,$nodeData);
										$i++;
									}
									break;
									case "script":
									$nodeData["childs"][$i] = $this->getNodeString($grandChildNode);
									$i++;
									break;
									default:
									break;
								}
							}
						}
					break;
					default:
					break;
				}
			}
		}
		return $nodeData;
	}
	function getNodeString($node){
		$nodeData = array();
		$nodeData["childs"] = array();
		$nodeData["args"] = array();
		$nodeData["type"] = "script";
		$nodeData["value"] = $this->getValue($node);
		return $nodeData;
	}
	function getTypeArray(){
		return $this->typeArray;
	}
	function getDefaultData($nodeData){
		if(isset($nodeData["attr"]["type"])){
			$type = $nodeData["attr"]["type"];
			switch($type){
				case "window":
				case "appWindow":
				$nodeData["childs"][0] = array();
				$nodeData["childs"][0]["childs"] = array(); 
				$nodeData["childs"][0]["args"] = array(); 
				$nodeData["childs"][0]["type"] = "script"; 
				$nodeData["childs"][0]["value"] = $nodeData["attr"]["id"].".show(this);"; 
				break;
			}
		}
		return $nodeData;
	}
	//从文件中获取代码
	function getFileString($fileAddress){
		$file = fopen($fileAddress,"r");
		if($file){
			$fileString = fread($file,filesize($fileAddress));
			fclose($file);
		}else{
			$fileString = "";
		}
		return $fileString;
	}
	//读取xml文件，并生成dom
	function getXml($address){
		$tmpDom = new DOMDocument();
		$xmlString = $address;
		$tmpDom->load($xmlString);
		return $tmpDom;
	}
	function getName($node){
		return $node->nodeName;
	}
	function getValue($node){
		return $node->nodeValue;
	}
	function getType($node){
		return $node->nodeType;
	}
	function getAttr($node){
		$array = array();
		if($node->hasAttributes()){
			foreach($node->attributes as $attr){
				$array[$attr->nodeName] = $attr->nodeValue;
			}
		}
		return $array;
	}
	function getXmlPath($nodeAttr){
		$tmpXmlPath = "";
		if($nodeAttr["baseId"]&&$nodeAttr["type"]){
			$tmpXmlPath = $this->baseXmlPath.$nodeAttr["type"]."/".$nodeAttr["baseId"].".xml";
		}
		return $tmpXmlPath;
	}
	function getArgsArray(){
		return $this->argsArray;
	}
	function getLinkNodeData($nodeData){
		$tmpNodeData = array();
		$tmpNodeData["attr"] = array();
		if($nodeData["attr"]&&$nodeData["attr"]["baseId"]){
			$tmpXmlPath = $this->getXmlPath($nodeData["attr"]);
			if($tmpXmlPath){
				$tmpDom = $this->getXml($tmpXmlPath);
				$root = $tmpDom->documentElement;
				$root->setAttribute("id",$nodeData["attr"]["id"]);
				if(isset($nodeData["args"]["repeatFlag"])&&$nodeData["args"]["repeatFlag"]=="(B)true"){
					$fnodeData = array();
					$fnodeData["args"] = array();
					$fnodeData["args"]["repeatFlag"] = "(B)true"; 
					$tmpNodeData = $this->getNodeData($root,$fnodeData);
				}else{
					$tmpNodeData = $this->getNodeData($root);
				}
				if($tmpNodeData){
					$nodeData["attr"]["type"] = $tmpNodeData["attr"]["type"];
					$tmpNodeData["attr"] = array_merge($tmpNodeData["attr"],$nodeData["attr"]);
				}
			}
		}
		return $tmpNodeData;
	}
	// 在多个数组中查找是否有符合的key对应的数组序号
	function searchInArrays($value,$arrays,$key){
		$num = -1;
		for($i=0;$i<count($arrays);$i++){
			if(isset($arrays[$i]["attr"][$key])&&$arrays[$i]["attr"][$key]==$value){
				$num = $i;
				break;
			}else{
				continue;
			}
		}
		return $num;
	}
	function applyIf($targetArray,$baseArray){
		foreach($baseArray as $key=>$value){
			if(!isset($targetArray[$key])){
				$targetArray[$key] = $value;
			}
			else{
				if(is_array($targetArray[$key])&&is_array($baseArray[$key])){
					switch($key){
						case "childs":
							break;
						default:
							$value = $this->applyIf($targetArray[$key],$baseArray[$key]);
							$targetArray[$key] = $value;	
							break;
					}
				}
			}
		}
		return $targetArray;
	}
	function dataMerge($firstArray,$secondArray){
		//此处加入需要特殊处理的key
		if(isset($firstArray["cls"])&&isset($secondArray["cls"])){
			$secondArray["cls"] = $secondArray["cls"]." ".$firstArray["cls"];
		}
		
		foreach($secondArray as $key=>$value){
			$firstArray[$key] = $value;
		}
//		$mergeArray = array_merge($firstArray,$secondArray);
		return $firstArray;
	}
	function checkValue($value){
		if(strlen($value)>3){
			$type = substr($value,0,3);
			switch($type){
				//boolean
				case "(B)":
					$value = $this->getB($value);
					break;
				//columns
				case "(C)":
					$value = $this->getC($value);
					break;
				//function
				case "(F)":
					$value = $this->getF($value);
					break;
				//obj
				case "(J)":
					$value = $this->getJ($value);
					break;
				//number
				case "(N)":
					$value = $this->getN($value);
					break;
				//proxy
				case "(P)":
					$value = $this->getP($value);
					break;
				//store
				case "(S)":
					$value = $this->getS($value);
					break;
				//toolbar
				case "(T)":
					$value = $this->getT($value);
					break;
				default:
					$value = $this->getString($value);
					break;
			}
		}else{
			$value = $this->getString($value);
		}
		return $value;
	}
	function createRoot(){
		$component = $this->xml->createElement("component");
		return $component;
	}
	function createDefine($nodeData){
		$define = $this->xml->createElement("define");
		$define->setAttribute("name",$nodeData["attr"]["id"]);
		$define->setAttribute("id",$nodeData["attr"]["id"]);
		return $define;
	}
	function createImports(){
		$importArray = array();
		$typeArray = array_merge(array_unique($this->typeArray));
		for($i=0;$i<count($typeArray);$i++){
			$import = $this->xml->createElement("import");
			$import->setAttribute("refId",$typeArray[$i]);
			$import->setAttribute("funcName",ucfirst($typeArray[$i]));
			$importArray[$i] = $import;
		}
		return $importArray;
	}
	function createNode($nodeData){
		if($nodeData){
			switch($nodeData["type"]){
				case "node":
					$node = $this->xml->createElement("node");
					$funcName = $node->setAttribute("funcRef",ucfirst($nodeData["attr"]["type"]));
					$varName = $node->setAttribute("varName",$nodeData["attr"]["id"]);
					$args = $this->xml->createElement("args");
					$this->argsArray[$nodeData["attr"]["id"]] = array();
					foreach($nodeData["args"] as $key => $value){
						$tmpValue = "$".$nodeData["attr"]["id"].".".$key;
						$args->setAttribute($key,$tmpValue);
						$this->argsArray[$nodeData["attr"]["id"]][$key] = $value;
					}
					$node->appendChild($args);
					if(count($nodeData["childs"])){
						$subs = $this->xml->createElement("subs");
						$node->appendChild($subs);
						for($i=0;$i<count($nodeData["childs"]);$i++){
							$son = $this->createNode($nodeData["childs"][$i]);
							$subs->appendChild($son);
						}
					}
					break;
				case "script":
					$node = $this->xml->createElement("script");
					$cdata = $this->xml->createCDATASection($nodeData["value"]);
					$node->appendChild($cdata);
					break;
				default:
					break;
			}
			
		}
		return $node;
	}
	//获得节点的args
	function getArgs($node){
		$args = array();
		$args = $this->getAttr($node);
		foreach($node->childNodes as $argNode){
			$argType = $this->getType($argNode);
			if($argType!=XML_TEXT_NODE){
				$argName = $this->getName($argNode);
				switch($argName){
					case "listeners":
						$args[$argName] = $this->getListeners($argNode);
					break;
					default:
					break;
				}
			}
		}
		return $args;
	}
	function getListeners($node){
		$listeners = array();
		foreach($node->childNodes as $listenerNode){
			$listenerNodeType = $this->getType($listenerNode);
			if($listenerNodeType!=XML_TEXT_NODE){
				$listenerName = $this->getName($listenerNode);
				if($listenerName=="listener"){
					$listenerAttr = $this->getAttr($listenerNode);
					if(isset($listenerAttr["type"])&&isset($listenerAttr["fn"])){
						$listeners[$listenerAttr["type"]] = $listenerAttr["fn"]; 
					}
				}
			}
		}
		return $listeners;
	}
	//获取value对应的columns
	function getC($value){
		$tmpValue = substr($value,3);
		$cPath = "../other/columns/".$tmpValue.".js";
		$cString = $this->getFileString($cPath);
		if(strlen(trim($cString))==0){
			$cString = "[]";
		}
		return $cString;
	}
	//获取value对应的boolean
	function getB($value){
		$tmpValue = substr($value,3);
		$value = $tmpValue;
		return $value;
	}
	//获取value对应的function
	function getF($value){
		$tmpValue = substr($value,3);
		$fPath = "../function/".$tmpValue.".js";
		$fnString = $this->getFileString($fPath);
		if(strlen(trim($fnString))==0){
			$fnString = "function(){}";
		}
		return $fnString;
	}
	//获取value对应的json字符串;
	function getJ($value){
		$tmpValue = substr($value,3);
		$jPath = $this->jPath.$tmpValue.".json";
		$jsString = $this->getFileString($jPath);
		if(strlen(trim($jsString))==0){
			$jsString = "{}";
		}
		return $jsString;
	}
	//获取value对应的数值
	function getN($value){
		$tmpValue = substr($value,3);
		$value = (int)$tmpValue;
		return $value;
	}
	//获取value对应的proxy
	function getP($value){
		$tmpValue = substr($value,3);
		$pPath = "../other/proxy/".$tmpValue.".js";
		$pString = $this->getFileString($pPath);
		if(strlen(trim($pString))==0){
			$pString = "";
		}
		return $pString;
	}
	//获取value对应的store
	function getS($value){
		$tmpValue = substr($value,3);
		$sPath = "../other/store/".$tmpValue.".js";
		$sString = $this->getFileString($sPath);
		if(strlen(trim($sString))==0){
			$sString = "";
		}
		return $sString;
	}
	//获取value对应的string字符串;
	function getString($value){
		if($value){
			$value = "\"".$value."\"";
		}else{
			$value = "\"\"";
		}
		return $value;
	}
	//获取value对应的store
	function getT($value){
		$tmpValue = substr($value,3);
		$tPath = "../other/toolbar/".$tmpValue.".js";
		$tString = $this->getFileString($tPath);
		if(strlen(trim($tString))==0){
			$tString = "";
		}
		return $tString;
	}
}
?>