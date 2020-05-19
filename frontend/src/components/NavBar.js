import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {onLogout} from '../actions/loginActions';
import '../App.css';


class NavBar extends React.Component {

	logout = () => {
		this.props.dispatch(onLogout(this.props.token));
	}

	constructor(props) {
		super(props);
		this.state = {
			currentCategory: this.props.categories,
	
		}
	}

	setCategory = (item) => {
		console.log("item ", item);
		if (item !== null) {
			this.setState({ currentCategory: item });
			this.props.category(item);
		} else {
			this.setState({ currentCategory: [] });
		}
	}
	setSubCategory = (item) => {
		this.props.category(item);
	}


	render() {
		let button = {
			position: "float:left",		
			
		}
		let header = "FS - Shop";
		if(this.props.loading) {
			header = "Loading..."
		}
		if(this.props.error) {
			header = "Error:"+this.props.error
		}
	
		return (
			<Fragment>
				<div className="fs-navbar-header">
		<Header className="fs-navbar-header">{header}</Header>
				</div>
				<div className="fs-navbar-buttons">
					{this.props.isLogged ? 					
							<div className="fs-useraction-section">
								<span>
									Hello {this.props.nickname},
								</span>
								<div className="logoutButton">
									<Button onClick={()=>this.logout()}>
										Log out
									</Button>
								</div>
							</div>
							
					:		
					<div className="fs-useraction-section">			
							<Button style={button} onClick={() => this.setCategory(null)}><Link to="/login">Login</Link></Button>
						</div>
					}

						<div>
							Choose category below:
							<div>
								<Link to="/list">{this.props.categories.map((item, index) =>
									<Button key={index} onClick={() => this.setCategory(item.products)}>{item.categoryName}</Button>
								)}</Link>
							</div>
						</div>
				</div>
			</Fragment>
				


		)
	}

}
const mapStateToProps = (state) => {
	return {
		error:state.login.error,
		loading:state.login.loading,
		isLogged:state.login.isLogged,
		token:state.login.token,
		nickname:state.login.nickname
	}	
}

export default connect(mapStateToProps)(NavBar);