import React, { Component, PropTypes as T } from 'react';
import ReactDOM from 'react-dom';

import {
	mapStyles,
	getCurrentPosition,
	makeGeoPromise,
	createMapConfig
} from './lib/GoogleMapHelpers';


class Map extends Component {

	componentDidMount(){
		let { initialCenter: { lat, lng } } = this.props;
		if ( this.props.centerAroundCurrentLocation ) {
			// if (navigator && navigator.geolocation) {
			// 	getCurrentPosition();
			// }
			this.loadMap();
		} else {
			this.reloadMap();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let { google, singleLocation } = this.props;

		if( prevProps.google !== google ) {
			this.loadMap();
		}
		
		if( prevProps.google !== google ){
			this.reloadMap();
		}

		if(prevProps.google !== google || singleLocation !== prevProps.singleLocation ) {
			this.recenterMap();
		}
	}

	loadMap() {
		let { google, map } = this.props; 
		if( this.props && google ) {
			let { initialCenter: { lat, lng } , zoom } = this.props,
				maps = google.maps,
				mapRef = this.refs.map,
				node = ReactDOM.findDOMNode(mapRef),
				center = new maps.LatLng(lat,lng),
				mapConfig = createMapConfig(center, zoom || 20);

			this.map = new maps.Map(node, mapConfig);
		}
	}

	recenterMap() {
		let gMap = this.map,
			{ google, initialCenter: { lat, lng }, isSearch, address } = this.props,
			center = {},
			isSingle = this.props.singleLocation;

		if (gMap && isSearch) {
			makeGeoPromise( maps, address ).then((options) => {
				center = new maps.LatLng( options.lat, options.lng );
				gMap.panTo(center);
			});
        } else {
			if( isSingle) {
				center = new google.maps.LatLng( isSingle.coords.lat, isSingle.coords.long );
			} else {
				center = new google.maps.LatLng( lat, lng );
			}
			gMap.panTo(center);
        }
        
	}

	reloadMap(){
		let options,
			{ google, initialCenter: { lat, lng }, zoom, address, isSearch } = this.props,
			maps = google.maps,
			node = ReactDOM.findDOMNode(this.refs.map);
		if( isSearch ){
			makeGeoPromise( maps, address ).then((options) => {
				let center = new maps.LatLng( options.lat, options.lng );
				let mapConfig = createMapConfig(center, 12);
				this.map = new maps.Map(node, mapConfig);
			});
		} else {
			let center = new maps.LatLng( lat, lng );
			let mapConfig = createMapConfig(center, zoom || 12);
			this.map = new maps.Map(node, mapConfig);
		}
		
	}

	renderChildren() {
		const { children, google, initialCenter, singleLocation } = this.props;
        if( !children || !google ) return;

		let newChildren = React.Children.map(children, c => {
			return React.cloneElement(c, {
				map: this.map,
				google: google,
				mapCenter: initialCenter
			});
		});

		return newChildren;
	}

	render() {
		return(
			<div style={mapStyles.map} ref="map">
				Loading Map ...
				{ this.renderChildren() }
			</div>
		);
	}
}

Map.propTypes = {
	google: T.object,
	zoom: T.number,
	initialCenter: T.object
};

Map.defaultProps = {
  zoom: 12,
  initialCenter: {
  	lat: 33.807197,
  	lng: -84.345238
  },
  centerAroundCurrentLocation: true
};

export default Map;



