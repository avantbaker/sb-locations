import React from 'react';
import { wrapper as GoogleApiWrapper } from './lib/GoogleApiWrapper';
import { REACT_BASE_URL_PROD, REACT_SINGLE_URL } from '../helpers/constants';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';

export class Container extends React.Component {

	constructor(props){
		super(props);
		this.state = {
	      showingInfoWindow: false,
	      activeMarker: {},
	      details: {},
	      selectedPlace: {}
	    };
		this.onMarkerClick = this.onMarkerClick.bind(this);
	}

	componentWillUpdate(nextProps, nextState) {
		let { locations, google, placesLoaded, location, isSingle } = this.props;
		let props = this.props;

		console.log("props: ", props, "nextProps: ", nextProps );

		if ( isSingle && ( placesLoaded !== nextProps.placesLoaded ) ) {
			let singleLocation = [];
			singleLocation.push(nextProps.location);
			this.markers = singleLocation.map((marker, i) => {
				let pos = {
					lat: marker.coords.lat,
					lng: marker.coords.long
				};

				return <Marker
						key={i}
						position={pos}
						details={marker}
						onClick={this.onMarkerClick}
					   />;
			});
		} else if (
			 ( placesLoaded !== nextProps.placesLoaded ) ||
			 ( locations !== nextProps.locations) ) {
			this.markers = nextProps.locations.map((marker, i) => {
				let pos = {
					lat: marker.coords.lat,
					lng: marker.coords.long
				};

				return <Marker
						key={i}
						position={pos}
						details={marker}
						onClick={this.onMarkerClick}
					   />;
			});
		}
	}

	onMarkerClick(props, marker, details, e){
		this.setState({
			selectedPlace: props,
			activeMarker: marker,
			details: details,
			showingInfoWindow: true
		});
	}

	render() {
		console.log('details', this.state.details);
		let markers = this.markers ? this.markers : [],
			{ google, zoom, isSearch, address, isSingle, location } = this.props,
			{ activeMarker, showingInfoWindow } = this.state,
            url = `${REACT_BASE_URL_PROD}${REACT_SINGLE_URL}/?q=${this.state.details.store_name}`;

		return (
		  <div className="map">
		  	<Map
		  		google={google}
		  		zoom={ zoom }
		  		isSearch={isSearch}
		  		address={address}
		  		singleLocation={ location }>
		  		{  markers  }
		  		<InfoWindow
		  		  marker={activeMarker}
		  		  visible={showingInfoWindow}>
		  			<div id="content">
			            <div id="siteNotice"></div>
				        <h5 id="firstHeading" className="firstHeading">{ "*************** " + this.state.details.city || '' }</h5>
				        <div className="info-window-content" id="bodyContent">
				            <p>
								<span>{ this.state.details.address || '' }</span><br />
				            	<span>{ this.state.details.phone || ''}</span>
							</p>
							<a className="location-card-link" href={ url }> View Details </a>
			            </div>
		            </div>
			  	</InfoWindow>
		  	</Map>
		  </div>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: "AIzaSyACLcqncp4fHfFun36g4x1pf4QQptJKwGU"
})(Container);
