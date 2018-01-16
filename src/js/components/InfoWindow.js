import React from 'react';
import ReactDOMServer from 'react-dom/server';

class InfoWindow extends React.Component {
	componentWillMount(){
		this.renderInfoWindow();
	}

	componentDidUpdate(prevProps){
		if (this.props.map !== prevProps.map) {
	      this.renderInfoWindow();
	    }
	    if (this.props.children !== prevProps.children) {
	      this.updateContent();
	    }
	    if ((this.props.visible !== prevProps.visible) ||
	    	(this.props.marker !== prevProps.marker)) {
		      this.props.visible ?
		        this.openWindow() :
		        this.closeWindow();
	    }
	}

	renderInfoWindow(){
		let { google } = this.props;

		const iw = this.infowindow = new google.maps.InfoWindow({
			content: ''
		});
	}

	updateContent(){
		const content = this.renderChildren();
		this.infowindow.setContent(content);

	}
	renderChildren(){
		const {children} = this.props;
		return ReactDOMServer.renderToString(children);
	}
	openWindow() {
		let { map, marker } = this.props;
		this.infowindow.open(map, marker);
	}
	closeWindow() {
		this.infowindow.close();
	}
	render() {
		return  null
	}
}

export default InfoWindow;
