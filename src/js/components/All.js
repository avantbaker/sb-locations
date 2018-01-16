import React from 'react';
import MapContainer from './MapContainer';
import axios from 'axios';
import { isEmpty, getParameterByName } from '../helpers/functions';
import { REACT_LOCATIONS_PROD_PATH } from '../helpers/constants';
import LocationCard from './LocationCard.js';

var Qs = require('qs');

class All extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			locations: [],
			placesLoaded: false,
			zip: '',
			search: false
		};

		this.fetchLocations = this.fetchLocations.bind(this);
		this.setZip = this.setZip.bind(this);
	}

	componentDidMount() {
        let search = getParameterByName("search");
		this.fetchLocations(search);
	}

	fetchLocations( zip = '' ) {
		var parsedState = { "pageType": "All",
							"query": zip };
		return axios.post( REACT_LOCATIONS_PROD_PATH,
          Qs.stringify(parsedState),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).then((res) => {
        	this.setState({
        		locations: res.data,
        		placesLoaded: true
        	});
        });
	}

	setZip(ev){
		this.setState(Object.assign({}, this.state, { zip: ev.target.value}));
	}

	renderLocationCards() {
		let { locations, placesLoaded } = this.state;
		return !isEmpty(locations) && placesLoaded ? locations.slice(0, 10).map((location, i) => {
			return (
				<LocationCard key={i} location={ location } />
			)
		}) : (<div className="locations-preloader"></div> );
	}

    render(){
    	let { locations, placesLoaded, zip, search } = this.state;
        return (
        	<section className="locations-all-section">
				<div className="locations-all-map-canvas-container">
					<div className="map-all">
						<MapContainer 
							locations={locations} 
							placesLoaded={placesLoaded}
							address={zip}
							isSearch={search}
							zoom={7} />
					</div>
					<div className="all-locations-list">
						<div className="all-locations-search">
							<div className="field-wrapper sbnh-form location-all-search-form">
								<input 
									className="sbnh-input" 
									type="search" 
									placeholder="Enter City, State or Zip"
									value={zip}
									onChange={this.setZip} />
								<a 
									className="all-locations-search-button"
									onClick={() => this.fetchLocations(zip) }></a>
							</div>
						</div>
						<div className="all-locations-wrapper">
							<h2>Locations</h2>
							{ this.renderLocationCards() }
						</div>
					</div>
				</div>
			</section>
        )
    }
}

export default All;