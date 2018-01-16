import React from 'react';
import { formatDistance } from '../helpers/functions';
import { REACT_BASE_URL_PROD, REACT_SINGLE_URL } from '../helpers/constants';

const LocationCard = (props) => {
	let { location } = props,
		url = `${REACT_BASE_URL_PROD}${REACT_SINGLE_URL}/?q=${location.store_name}`;
	return (
		<div className="location-card">
			<div className="location-details">
				<h3 className="location-card-store-name -sans-serif"><a className="location-link" href={url}> { location.store_name } <span className="location-card-distance">({ formatDistance( location.distance, 1) } miles)</span></a></h3>
				<p><span className="location-card-address"> { location.street } </span><br />
				<span className="location-card-address"> { location.city }, { location.state } { location.zipcode }</span></p>
			</div>
			<div className="location-details-btn">
				<a href={url} className="button alt">Details</a>
			</div>
		</div> 
	);
};


export default LocationCard;