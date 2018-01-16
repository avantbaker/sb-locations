import React from 'react';
import MapContainer from "./MapContainer";
import axios from 'axios';
import {
	REACT_LOCATIONS_PROD_PATH,
	REACT_LOCATIONS_BASE_PATH
} from '../helpers/constants';
import { getParameterByName, formatDistance } from '../helpers/functions';
var Qs = require('qs');

class Details extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			location: [],
			isLoading: true,
			placesLoaded: false,
			slider: null,
			loadSlider: true,
		};
	}

	componentDidMount() {
		this.fetchLocations();
	}

	fetchLocations() {
		let storeNum = getParameterByName("q");
		var parsedState = { "pageType": "Single",
							"store": storeNum };
		return axios.post( REACT_LOCATIONS_PROD_PATH,
          Qs.stringify(parsedState),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).then((res) => {
        	console.log("Setting isLoading to false");
        	this.setState({
        		location: res.data,
        		isLoading: false,
        		placesLoaded: true
        	});
        });
	}

	renderDetails() {
		let { location, isLoading } = this.state;
		return !isLoading ? (
			<span dangerouslySetInnerHTML={{ __html: location.body_content }} />
		) : (<div className="locations-preloader">Loading...</div>);
	}

    render(){
        return this.renderDetails();
    }
}

export default Details;
