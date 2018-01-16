import React, { PropTypes } from 'react';
import pageRouter from '../helpers/router';
import Single from './Single';
import Main from './Main';
import All from './All';

class Root extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			page: 1
		}
		this.page = pageRouter(this.state.page);
	}
	
	componentWillUpdate(nextProps, nextState) {
		if(this.state.page !== nextState.page){
			this.page = pageRouter(nextState.page);
		}
	}

	nextPage(){
		this.setState({
			page: this.state.page == 3 ? 3 : this.state.page + 1
		});
	}

	prevPage(){
		this.setState({
			page: this.state.page == 1 ? 1 : this.state.page - 1
		});
	}

    render(){
    	console.log(this.page);
    	return (
    		<div>
    			<button onClick={() => this.nextPage()}>Next Page</button>
    			<button onClick={() => this.prevPage()}>Previous Page</button>
		    	{ this.page }
		    </div>
    	)
    }
}

export default Root;