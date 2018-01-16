import React from 'react';
import MapContainer from "./MapContainer";
import axios from 'axios';
import {
	REACT_LOCATIONS_PROD_PATH,
	REACT_LOCATIONS_BASE_PATH
} from '../helpers/constants';
import { getParameterByName, formatDistance } from '../helpers/functions';
var Qs = require('qs');

class SliceNation extends React.Component{
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

	renderSliceNation() {
		let { location, isLoading } = this.state;
		return !isLoading ? (
			<div className="slice-nation-small-callout">
				<div className="slice-nation-wrapper">
					<div className="sl-column left">
						<img src="/wp-content/themes/************/assets/images/slice-nation-logo.png" alt="slider image" />
					</div>
					<div className="sl-column right">
						<h5>Get {location.store_name} Rewards!</h5>
						<p>Receive exclusive offers, details on the latest deals, and much more as a part of our SliceNation rewards program!</p>
						<a href="http://************.com/join-the-club/" className="button">Join Now</a>
					</div>
				</div>
			</div>
		) : (<div className="locations-preloader">Loading...</div>);
	}

    render(){
        return this.renderSliceNation();
    }
}

export default SliceNation;
