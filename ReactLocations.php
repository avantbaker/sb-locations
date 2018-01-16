<?php
/**
* ReactLocations
*/


class ReactLocations
{

	private $dsn;
	private $user;
	private $pass;
	private $pdo; // Object
	private $client_location;
	private $tableInfo; // Array
	private $searchParam;
	private $locations;
	private $stores;
	private $locations_ByDistance;
	private $locations_ByDistance_sorted;
	private $store_coords;
	private $curlURL = 'http://freegeoip.net/json/';
	private $query;
	private $page_type;
	
	function __construct( $config )
	{
		// Accepts Main, Single, and All
		$this->config = $config;
		$this->tableInfo = $config["table"];
		$this->curlUrl = 'http://freegeoip.net/json/' . $_SERVER["REMOTE_ADDR"];
		$this->dsn = "mysql:dbname={$config["database"]["dbname"]};host=localhost";
		$this->user = $config["database"]["user"];
		$this->pass = $config["database"]["password"];
		$this->searchParam = $config["query"];
		$this->page_type = $config['pageType'];
		// Start the PDO Instance
		$this->pdo = new PDO($this->dsn, $this->user, $this->pass);
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

		$this->init();
	}

	private function init() {
		$this->getClientLocation();
		$this->getLocations();
		$this->getLocationsProximalToClient();
		$this->sortByDistance();
	}

	public function formatDataByPageType($store_num = '') {
		$pageType = $this->page_type;
		switch($pageType){
			case "Single":
				return json_encode($this->getSingleLocation($store_num));
			case "Main":
				return json_encode($this->getMainLocation());
			case "All":
				return json_encode($this->getAllLocations());
			default:
				return json_encode($this->getAllLocations());
		}
	}
	/**
	 * ClIENT FUNCTIONS
	 */

	/**
	 * Sets the Users location based on Search parameter of IP Address
	 */
	private function getClientLocation() {
		if ( $this->searchParam ) {
			$search = $this->get_lat_long($this->searchParam);
			$this->client_location = Array(
				'latitude' => $search['lat'],
				'longitude' => $search['long']
			);
		} else {
			$geo = $this->getIpGeo();
			$this->client_location = Array(
				"latitude" => $geo["latitude"],
				"longitude" => $geo["longitude"]
			);
		}
	}

	/**
	 * LOCATION FUNCTIONS
	 */
	
	/**
	 * Gets all the locations from the DB and stores them
	 */
	private function getLocations() {
		$pdo_query = "SELECT * FROM {$this->tableInfo["name"]}";
		$query = $this->pdo->query($pdo_query);
		$this->locations = $query->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * Filters through the locations and Sees how far each location is in relation to the users current position
	 */
	public function getLocationsProximalToClient() {
		foreach ($this->locations as $r){
			$id = $r[$this->tableInfo["fields"]["id"]]; // TABLE_SPECIFIC
			//Determines distance for each store from the current zip code location
			$this->stores[$id] = $r;
			$store_lat_long = array(
				"lat" => $r[$this->tableInfo["fields"]["lat"]],
				"long" => $r[$this->tableInfo["fields"]["lon"]],
			);
			$this->store_coords[$id] = $store_lat_long;
			$this->locations_ByDistance[$id] = $this->distance( $this->client_location['latitude'] , 
														 		$this->client_location['longitude'], 
														 		$store_lat_long['lat'], 
														 		$store_lat_long['long'], 'M' );

		}
	}

	private function sortByDistance() {
		asort($this->locations_ByDistance);
		foreach ($this->locations_ByDistance as $key => $value) {
			$this->locations_ByDistance_sorted[] = array_merge( $this->stores[$key], 
																array("distance" => $this->locations_ByDistance[$key],
																	  "coords" => $this->store_coords[$key]));
		}
	}

	private function getSingleLocation($storeNumber){
		return $this->locations_ByDistance_sorted[array_search($storeNumber, $this->array_column($this->locations_ByDistance_sorted, $this->tableInfo["fields"]['storeID']))];
	}

	private function getMainLocation() {
		return $this->locations_ByDistance_sorted[0];
	}

	private function getAllLocations() {
		return $this->locations_ByDistance_sorted;
	}
	
	/**
	 * GEOLOCATION HELPER FUNCTIONS
	 */

	/**
	 * Finds the IP Address of the Person on the page
	 */
	private function getIpGeo() {
		$ch = curl_init();
		// Set the options for curl
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);                  // Return the actual result
		curl_setopt($ch,CURLOPT_URL, $this->curlUrl);               // Use the URL constructed previously
		curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);                  // Set the timeout so we don't take forever to load the page
		$data = curl_exec($ch);                                     // Execute the call
		curl_close($ch);

		return json_decode($data, true);
	}

	/**
	 * Finds the Distance from One Location to another
	 * Note :: Used to find users current distance from each location
	 */
	private function distance($lat1, $lon1, $lat2, $lon2, $unit) {
	  
	  $theta = $lon1 - $lon2;
	  $dist = (sin(deg2rad($lat1)) * sin(deg2rad($lat2))) + (cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta)));
	  $dist = acos($dist);
	  $dist = rad2deg($dist);
	  $miles = $dist * 60 * 1.1515;
	  $unit = strtoupper($unit);

	  switch($unit){
	  	case 'K':
	  		return ($miles * 1.609344);
	  	case 'N':
	  		return ($miles * 0.8684);
	  	default:
	  		return $miles;
	  }
	}

    private function array_column($array,$column_name) {
        return array_map( function($element) use($column_name) { return $element[$column_name]; }, $array);

    }

	/**
	 * Extracts the state from the JSON obect in get_lat_long
	 * Note :: If something breaks with get_lat_long this is a great place to check for errors
	 */
	private function extract_state($info){
		$info = str_split(str_replace(' ', '', $info));
		$statekey = array_search(',', $info);
		$letters = $info[$statekey+1] . $info[$statekey+2];
		return $letters;
	}

	/**
	 * Gets the lat and Longitude from the provided address which is most likely a zip or can be the address of
	 * a place
	 */
	private function get_lat_long($address){
	
		$address = urlencode($address);
		$url = "https://maps.google.com/maps/api/geocode/json?address={$address}&sensor=false&?key=****************************";
		$json = $this->curl_get_contents($url);
		
		if ($json === false) {
			echo($json);
			return false;
		} else {
			$json = json_decode($json);
			$state = $json->{'results'}[0]->{'formatted_address'};
			$state = $this->extract_state($state);
		    $lat = $json->{'results'}[0]->{'geometry'}->{'location'}->{'lat'};
		    $long = $json->{'results'}[0]->{'geometry'}->{'location'}->{'lng'};

		    return array("lat" => $lat, "long" => $long, 'state' => $state);
		}
	}

	private function curl_get_contents($url) {
	    $ch = curl_init();
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	    $data = curl_exec($ch);
	    curl_close($ch);

	    return $data;
	}

}
