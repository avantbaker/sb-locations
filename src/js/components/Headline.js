import React from 'react';
import MapContainer from "./MapContainer";
import axios from 'axios';
import {
	REACT_LOCATIONS_PROD_PATH,
	REACT_LOCATIONS_BASE_PATH
} from '../helpers/constants';
import { getParameterByName, formatDistance } from '../helpers/functions';
var Qs = require('qs');

class Headline extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			location: [],
			isLoading: true,
			placesLoaded: false
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

	renderHeadLine(){
		let { location, isLoading } = this.state;
		return !isLoading ? (
			<div>
				<h1 className="display-text">{ location.store_name }</h1>
			</div>
		): (<div className="locations-preloader"></div>);
	}

    render(){
    	let { location } = this.state;
        return (
	    	<section className="location-single-header">
	    		{ this.renderHeadLine() }
	    		<div>
	    			<a href={'tel:' + (location.phone)} className="button">Call: { location.phone }</a>
	    			<a href="http://************.com/parties-events/" className="button desktop-item">Book a Party</a>
	    			<a href="http://************.com/catering/" className="button desktop-item">Catering</a>
	    		</div>
	    	</section>
        );
    }
}

export default Headline;
