import React from 'react';
import {Link} from 'react-router-dom';
import {Form,Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {onLogin} from '../actions/loginActions';

class Login extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			username:"",
			password:""
		}
	}
	
	onChange = (event) => {
		let state = {}
		state[event.target.name] = event.target.value
		this.setState(state);
	}

	onLogin = () => {
		if(this.state.username.length < 4 || this.state.password.length < 8) {
			alert("Username must be four characters and password eight characters long");
			return;
		}
		let user = {
			email:this.state.username,
			password:this.state.password
		}
		this.props.dispatch(onLogin(user));
	}

	
	
	render() {
		return(
			<Form>
				<Form.Field>
					<label htmlFor="username">Username</label>
					<input type="text"
							name="username"
							value={this.state.username}
							onChange={this.onChange}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="password">Password</label>
					<input type="password"
							name="password"
							value={this.state.password}
							onChange={this.onChange}/>
				</Form.Field>
				<Link to="/register"><Button>Register</Button></Link>
				<Button onClick={this.onLogin}>Login</Button>
			</Form>
		)
	}

}
export default connect()(Login);