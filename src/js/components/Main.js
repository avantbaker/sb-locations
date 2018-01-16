import React from 'react';
import { isEmpty } from '../helpers/functions';
import { REACT_LOCATIONS_PROD_PATH, REACT_ALL_LOCATIONS } from '../helpers/constants';
import axios from 'axios';
import LocationCard from './LocationCard';
var Qs = require('qs');

class Main extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			zip: '',
			mainLocation: {}
		};

		this.setCurrentPosition = this.setCurrentPosition.bind(this);
		this.setZip = this.setZip.bind(this);
		this.fetchLocations = this.fetchLocations.bind(this);
	}

	componentDidMount(){
		this.fetchLocations();
	}

	isChrome(){
		var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		return isChrome;
	}

	fetchLocations( zip = '' ) {
		var parsedState = { "pageType": "Main",
							"query": zip };
		return axios.post( REACT_LOCATIONS_PROD_PATH,
          Qs.stringify(parsedState),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).then((res) => {
        	console.log(res);
        	this.setState({
        		mainLocation: res.data
        	});
        });
	}

	setCurrentPosition(obj){
		this.setState(Object.assign({}, this.state, obj));
	}

	setZip(ev){
		console.log(ev.target.value);
		this.setState(Object.assign({}, this.state, { zip: ev.target.value}));
	}

	renderLocationCard() {
		let { mainLocation } = this.state;
		return !isEmpty(mainLocation) ? (
			<LocationCard location={ mainLocation } />
		) : null;
	}

    sendToLocations(zip){
		window.location.href = `http://www.******.com/${REACT_ALL_LOCATIONS}/?search=${zip}`;
	}

    render(){
        return (
	        <span>
	        	<section className="menu-header sbnh-default-header">
					<div className="default-hero-wrapper">
						<div className="default-hero-outer">
							<div className="default-hero-inner">
								<div className="sbnh-full-row default-hero-container">
									<h1 className="display-text">Locations</h1>
								</div>
							</div>
						</div>
					</div>
				</section>
		        <section className="locations-root-section">
		        	<div className="sbnh-full-row location-root-container">
						<div className="location-root-card nearest-location-card">
							<h2>Your nearest ************ B&#8217;s location</h2>
							{ this.renderLocationCard() }
						</div>
						<div className="location-root-card find-location-card">
							<h2>Find a ************ B&#8217;s </h2>
							<div className="field-wrapper sbnh-form location-main-form">
								<input className="sbnh-input" type="text" value={this.state.zip} onChange={this.setZip} placeholder="Zip Code" />
								<a className="button alt" onClick={ () => this.sendToLocations(this.state.zip) }>Find</a>
							</div>
						</div>
					</div>
					<div className="locations-root-all-row">
						<a href={ REACT_ALL_LOCATIONS } className="button full-width-button alt">View All ************ B&#8217;s Locations</a>
					</div>
				</section>
			</span>
        )
    }
}

export default Main;
