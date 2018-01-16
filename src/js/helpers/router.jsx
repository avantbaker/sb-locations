import React from 'react';

import Single from '../components/Single';
import Main from '../components/Main';
import All from '../components/All';

export default function pageRouter(pageState){
	switch(pageState) {
		case 1:
			return (<Main />);
		case 2:
			return (<Single />);
		case 3:
			return (<All />);
		default:
			return (<Main />);
	} 
}