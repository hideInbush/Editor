<?php
class createJs{
	public $xmlPath;
	public $dataPath;
	public $resultPath;
	public $dom;
	public $fnName;
	public $writeFlag;
	// 初始化函数
	function __construct($xmlPath,$dataPath,$resultPath){
		$this->xmlPath = $xmlPath;
		$this->dataPath = $dataPath;
		$this->resultPath = $resultPath;
	}
	//主函数
	function main(){
		$jsString = "";
		$this->getXml($this->xmlPath);
		$fnJsString = $this->createFnJs();
		$dataJsString = $this->createDataJs();
		$jsString = $fnJsString.$dataJsString;
//			$this->writeFile($this->resultPath, $jsString);
		return $jsString;
	}
	// 获得大函数的js code
	function createFnJs(){
		$fnJsString = "";
		$startString = "";
		$fnString = "";
		$startScript = "";
		$nodeString = "";
		$endScript = "";
		$endString = "";
		
		$root = $this->dom->documentElement;
		foreach($root->childNodes as $childNode){
			if($childNode->nodeType !=XML_TEXT_NODE){
				$childName = $this->getName($childNode);
				switch($childName){
					case "define":
						$childAttrs = $this->getAttr($childNode);
						$this->fnName = $childAttrs["name"];
						$startString = "function ".$childAttrs["name"]."(args,mysql,fatherId){var self, tempArgs; var thisComp = {}; if(mysql){args.mysql = mysql};";
						$endString = "};";
						break;
					case "import":
						$childAttrs = $this->getAttr($childNode);
						$fnString = $fnString.$this->getFnString($childAttrs["refId"]);
						break;
					case "script":
						$scriptString = $this->getValue($childNode);
						if($nodeString){
							$endScript = $endScript.$scriptString;
						}else{
							$startScript = $startScript.$scriptString;
						}
						break;
					case "node":
						$nodeString = $this->getNodeString($childNode);
						break;
				}
			}
		}
		$fnJsString = $startString.$fnString.$startScript.$nodeString.$endScript.$endString;
		return $fnJsString ;
	}
	// 获得结构对应数据的js code
	function createDataJs(){
		$dataJsString = $this->getFileString($this->dataPath);
		$dataJsString = " totalArgs[\"".$this->fnName."\"] = ".$dataJsString;
		return $dataJsString;
	}
	// 加载xml	
	function getXml($address){
		$dom = new DOMDocument();
		$xmlString = $address;
		$dom->load($xmlString);
		$this->dom = $dom;
	}
	//获得节点属性
	function getAttr($node){
		$array = array();
		if($node->hasAttributes()){
			foreach($node->attributes as $attr){
				$array[$attr->nodeName] = $attr->nodeValue;
			}
		}
		return $array;
	}
	//获得节点值
	function getValue($node){
		return $node->nodeValue;
	}
	//获得节点名称
	function getName($node){
		return $node->nodeName;
	}
	// 获得需要导入的函数代码
	function getFnString($fnName){
		$dir = "../xsd/js/";
		$fileAddress = $dir.$fnName.".js";
		$fileString = $this->getFileString($fileAddress);
		return $fileString;
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
	// 写入文件
	function writeFile($fileAddress,$dataString){
		$file = fopen($fileAddress,"w");
		if($file){
			fwrite($file,$dataString);
			fclose($file);
		}
	}
	// 获得node节点转换而来的结构代码
	function getNodeString($node,$fatherName=null){
		$resultString = "";
		$subsString = "";
		$nodeString = "";
		$childAttrs = $this->getAttr($node);
		$fnName = $childAttrs["funcRef"];
		$varName = $childAttrs["varName"];
		foreach($node->childNodes as $childNode){
			if($childNode->nodeType !=XML_TEXT_NODE){
				$childName = $this->getName($childNode);
				switch($childName){
					case "subs":
						$subsString = $this->getSubsString($childNode,$varName);
						break;
					default:
						$nodeString = $this->createNode($childNode,$fnName,$varName,$fatherName);
						break;
				}
			}
		}
		$resultString = $nodeString.$subsString;
		return $resultString;
	}
	function getSubsString($subs,$fatherName){
		$resultString = "";
		foreach($subs->childNodes as $childNode){
			if($childNode->nodeType!=XML_TEXT_NODE){
				$childName = $this->getName($childNode);
				switch($childName){
					case "script":
						$scriptString = "";
						$scriptString = $this->getValue($childNode);
						$resultString = $resultString.$scriptString;
						break;
					case "node":
						$nodeString = "";
						$nodeString = $this->getNodeString($childNode,$fatherName);
						$resultString = $resultString.$nodeString;
						break;
				}
			}
		}
		return $resultString;
	}
	function createNode($argsNode,$fnName,$varName,$fatherName){
		$array = array();
		$argsString = " ";
		if($argsNode->hasAttributes()){
			foreach($argsNode->attributes as $attr){
				$attrName = $attr->nodeName;
				$attrValue = $attr->nodeValue;
				$attrValue = str_replace("$", "args.", $attrValue);
				$array[$attrName] = $attrValue;
				$argsString = $argsString."\"".$attrName."\":".$attrValue.",";
			}
		}
		$resultString = "tempArgs = {".$argsString."};tempArgs[\"name\"] = \"".$varName.
						"\";var ".$varName." = ".$fnName."(tempArgs);".$varName."[\"args\"]=tempArgs;tempArgs={};";
		if($fatherName){
			$resultString = $resultString."tempArgs[\"parent\"] = ".$fatherName.";".$fatherName.".addObject(".$varName.",tempArgs);";
		}
		return $resultString;
	}
}