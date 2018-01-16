import React from 'react';
import { evtNames, camelize } from './lib/GoogleMapHelpers';

class Marker extends React.Component {
	
	constructor(props){
		super(props);
	}	

	componentDidMount(){
		this.renderMarker();
	}

	componentDidUpdate(prevProps) {
		if( ( this.props.map !== prevProps.map ) ||
			( this.props.position !== prevProps.position ) ) {
			this.renderMarker();
		}
	}

	renderMarker() {
		let {
			map, google, position
		} = this.props;

		let pos = position;
		position = new google.maps.LatLng(pos.lat, pos.lng);

		if(map) {
            const pref = {
                map: map,
                position: position
            };

            var marker = this.marker = new google.maps.Marker(pref);

            this.marker.addListener("click", this.handleEvent("click"));
        }
	}

	handleEvent(evt){
		return (e) => {
			const evtName = `on${camelize(evt)}`;
			if(this.props[evtName]){
				this.props[evtName](this.props, this.marker, this.props.details, e);
			}
		}
	}

	render() {
		return null;
	}
}

Marker.propTypes = {
	position: React.PropTypes.object,
	map: React.PropTypes.object
};

export default Marker;
