//var $ = window.$;
import React from 'react';
import MapContainer from "./MapContainer";
import axios from 'axios';
import {
	REACT_LOCATIONS_PROD_PATH,
	REACT_LOCATIONS_BASE_PATH,
	SLIDER_LOCATION_PROD_PATH,
} from '../helpers/constants';
import { getParameterByName, formatDistance } from '../helpers/functions';
var Qs = require('qs');

class Single extends React.Component{
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

	formatHours(location) {
		let StoreHours = [],
			organizedHours;

		Object.keys(location).forEach(function(key,index) {
		    if( !/^storeHours/.test(key) ) { return; }
		    let day = key.replace( /^storeHours/, ''),
		    	dayObj = Object.assign({}, { [day] : location[key] });
		    StoreHours.push(dayObj);
		});

		if( !StoreHours ) return;
		organizedHours = StoreHours.sort((a, b) => {
			let key1 = Object.keys(a)[0],
				key2 = Object.keys(b)[0];
			return a[key1] < b[key2];
		});

		return organizedHours.map((day, index) => {
			let dayName = Object.keys(day)[0];
			return (<span key={index}>{ dayName }:  { day[dayName] }<br /></span>);
		});
	}
	renderHeadLine(){
		let { location, isLoading } = this.state;
		return !isLoading ? (
			<div>
				<h1 className="display-text">{ location.city }, { location.state }</h1>
			</div>
		): (<div className="locations-preloader"></div>);
	}

	renderMap() {
		let { location, isLoading, placesLoaded } = this.state;
		return <MapContainer
		        location={location}
		        placesLoaded={ placesLoaded }
		        zoom={9}
		        isSingle />;
	}

	renderDetails() {
		let { location, isLoading } = this.state;
		return !isLoading ? (
			<section className="locations-main-content-section no-pad">
				<div className="sbnh-full-row">
					<div className="sidebar">
						<div id="location-photo">
							<img src="/wp-content/themes/************/assets/images/sbnh-location-photo-sample.png" alt="picture of ************ *** location" />
						</div>
						<h3 className="-sans-serif -primary">Address</h3>
						<address>
							<p><span>{ location.street }</span><br />
							{ location.apt ? ( <span> { location.apt } <br /></span> ) : '' }
							<span>{ location.city }</span>, <span>{ location.state }</span> { location.zipcode }</p>
						</address>

						<a href="`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.long}`" className="contact-item">
							<img className="sidebar-symbol before" src="/wp-content/themes/************/assets/images/icon_location.png" />
							<h5 className="sidebar-sub-heading">Get Directions</h5>
						</a>
						<div id="location-map">
							{ this.renderMap() }
						</div>

						<h3 className="-sans-serif -primary">Hours</h3>
						<p> { this.formatHours(location.store_hours) }</p>
						<hr />
						<a href="#" className={'contact-item gray-text ' + (location.phone != '' ? 'visible' : 'not-available')}>
							<img className="sidebar-symbol before" src="/wp-content/themes/************/assets/images/icon_phone.png" />
							{ location.phone }
						</a>
						<a href={ 'mailto:' + location.email} className={'contact-item gray-text ' + (location.email != '' ? 'visible' : 'not-available')}>
							<img className="sidebar-symbol before" src="/wp-content/themes/************/assets/images/icon_email.png" />
							EMAIL
						</a>
						<div className="social-buttons">
							<a href={location.facebook_url}><img src="/wp-content/themes/************/assets/images/icon_facebook.png" /></a>
							<a href={location.twitter_url}><img src="/wp-content/themes/************/assets/images/icon_twitter.png" /></a>
						</div>
						<hr />
						<h3 className="-sans-serif -primary">Delivery Options</h3>
						<a href={location.ubereats_url} className={'contact-item ' + (location.ubereats_url != "" ? 'visible' : 'not-available') }>
							<img className="before" src="/wp-content/themes/************/assets/images/icon_ubereats.png" />
							UberEats Delivery
						</a>

						<a href={location.orderonline_url} className="button alt">Order</a>
						<hr />
						<h3 className="-sans-serif -primary">At This ************ ***</h3>
						<div className={'checklist-item ' + (location.gameroom == "1" ? 'visible' : 'not-available') }>
							GameLand
							<img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" />
						</div>
						<div className={'checklist-item ' + (location.catering == "1" ? 'visible' : 'not-available') }>
							Catering Available
							<img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" />
						</div>
						<div className={'checklist-item ' + (location.partyroom == "1" ? 'visible' : 'not-available') }>
							Partyland Room
							<img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" />
						</div>
						<hr />
						<a className="gray-link" href="#">Apply For A Job</a>
					</div> {/* ---- end sidebar ----- */}

					<div className="main-content small-9 columns">
						<div className="location-single-slider-container" id="location-single-slider-container"></div>

							<div className="slice-nation-small-callout">
								<div className="slice-nation-wrapper">
									<div className="sl-column left">
										<img src="/wp-content/themes/************/assets/images/slice-nation-logo.png" alt="slider image" />
									</div>
									<div className="sl-column right">
										<h5>Get {location.store_name} Rewards!</h5>
										<p>Lorem ipsum dolor sit amet, consectetur adipiscing elt. Proin en justo id dolor porttitor.</p>
										<a className="button alt">Join Now</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
		) : (<div className="locations-preloader">Loading...</div>);
	}

    render(){
    	let { location } = this.state;
        return (
	        <span>
	        	<section className="location-single-header">
	        		{ this.renderHeadLine() }
	        		<div>
	        			<a className="button alt">Call: { location.phone }</a>
	        			<a className="button alt">Book a Party</a>
	        			<a className="button alt">Catering</a>
	        		</div>
	        	</section>
        		<div>
        			{ this.renderDetails() }
        		</div>
			</span>
        )
    }
}

export default Single;
