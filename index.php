<?php 
	
	include_once('./Config.php');
	include_once('./ReactLocations.php');

	$query = $_POST["query"] !== '' ? array("query" => $_POST['query']) : null;
	if( $query ){ $config = array_merge($config, $query); }
	
	$pageType = $_POST["pageType"] ? array("pageType" => $_POST['pageType']) : 'All';
	if( $pageType ){ $config = array_merge($config, $pageType); }

	$store = $_POST['store'] ? $_POST["store"] : null;

	$maddiosLocations = new ReactLocations($config);

	echo $maddiosLocations->formatDataByPageType($store);
	
?>