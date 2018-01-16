import React from 'react';
import MapContainer from "./MapContainer";
import axios from 'axios';
import {
	REACT_LOCATIONS_PROD_PATH,
	REACT_LOCATIONS_BASE_PATH
} from '../helpers/constants';
import { getParameterByName, formatDistance } from '../helpers/functions';
var Qs = require('qs');

class Sidebar extends React.Component{
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

	formatHours(hours) {
		if(!hours) return;

		let parsedDates = hours.split(", ");
		return parsedDates.map((day, index) => {
			return (<span key={index}>{ day }<br /></span>);
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
		        isSingle />
	}

	renderSidebar() {
		let { location, isLoading } = this.state;
		const { catering, gameroom, partyroom } = location;
		let hasCatering = catering === "1",
			hasGameroom = gameroom === "1",
			hasPartyroom = partyroom === "1";

		const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.long}`;

		return (
			<div className="sidebar">
				<div id="location-photo">
					<img src="/wp-content/themes/**********/assets/images/sbnh-location-photo-sample.png" alt="picture of ************ *** location" />
				</div>
				<h3 className="-sans-serif -primary">Address</h3>
				<address>
					<p><span>{ location.street }</span><br />
					{ location.apt ? ( <span> { location.apt } <br /></span> ) : '' }
					<span>{ location.city }</span>, <span>{ location.state }</span> { location.zipcode }</p>
				</address>

				<a href={directionsUrl} target="_blank" className="contact-item">
					<img className="sidebar-symbol before" src="/wp-content/themes/************/assets/images/icon_location.png" />
					<h5 className="sidebar-sub-heading">Get Directions</h5>
				</a>
				<div id="location-map">
					{ this.renderMap() }
				</div>

				<h3 className={"-sans-serif -primary " + ( location.store_hours != '' ? 'visible' : 'not-available')}>Hours</h3>
				<p> { this.formatHours(location.store_hours) }</p>
				<hr />
				<a href={"tel:" + (location.phone) } className={'contact-item gray-text ' + (location.phone != '' ? 'visible' : 'not-available')}>
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
				<h3 className={"-sans-serif -primary " + (location.orderonline_url || location.ubereats_url ? 'visible' : 'not-available')}>Delivery Options</h3>
                {
                	location.ubereats_url ?
					<a href={location.ubereats_url}
					   className={'contact-item ' + (location.ubereats_url != "" ? 'visible' : 'not-available') }>
						<img className="before" src="/wp-content/themes/************/assets/images/icon_ubereats.png"/>
						UberEats Delivery
					</a> : null
                }

				<a href={location.orderonline_url} className={"button alt " + (location.orderonline_url ? 'visible': 'not-available')}>Order</a>
				<hr className={(location.orderonline_url || location.ubereats_url ? 'visible' : 'not-available')} />
				<h3 className="-sans-serif -primary">At This ************ ***</h3>
				<div className={'checklist-item ' + (location.gameroom == "1" ? 'visible' : 'not-available') }>
					GameLand
                    { hasGameroom ? <img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" /> :
                        null }
				</div>
				<div className={'checklist-item ' + (location.catering == "1" ? 'visible' : 'not-available') }>
					Catering Available
                    { hasCatering ? <img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" /> :
                        null }
				</div>
				<div className={'checklist-item ' + (location.partyroom == "1" ? 'visible' : 'not-available') }>
					Partyland Room
					{ hasPartyroom ? <img className="sidebar-symbol after" src="/wp-content/themes/************/assets/images/icon_check_green.png" /> :
									 null }
				</div>
				<hr />
				<a className="gray-link" href="http://************.com/jobs/">Apply For A Job</a>
			</div>
		);
	}

    render(){
        return this.renderSidebar();
    }
}

export default Sidebar;
