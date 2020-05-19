import React from 'react';
import {Link} from 'react-router-dom';
import {Form, Button, Header} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {onRegister} from '../actions/loginActions';

class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nickname:"",
			email:[],
			password:"",
			passwordverification:""
		}
	}

	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		if(this.state.nickname.length === 0 || this.state.email.length === 0) {
			alert("All fields required")
			return;
		}
		let user = {
			
			nickname:this.state.nickname,		
			email:this.state.email,
			password:this.state.password,
			passwordverification: this.state.passwordverification,
		}
		this.props.dispatch(onRegister(user));
		this.setState({
			nickname:"",
			email:[],
			password:"",
			passwordverification:""
		})
	}
	
	
	submit = (event) => {
		event.preventDefault();
	}
	
	render() {
		
		return (
		<div>
			<Form onSubmit={this.submit}>
				<Header as='h2'>Register account</Header>				
				<Form.Field>	
					<label htmlFor="nickname">Nickname</label>
					<input type="text"
							name="nickname"
							onChange={this.onChange}
							value={this.state.nickname}/>
				</Form.Field>
				<Form.Field>	
					<label htmlFor="nickname">Email</label>
					<input type="text"
							name="email"
							onChange={this.onChange}
							value={this.state.email}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="password">Password</label>
					<input type="password"
							name="password"
							value={this.state.password}
							onChange={this.onChange}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="password">Password verification</label>
					<input type="passwordverification"
							name="passwordverification"
							value={this.state.passwordverification}
							onChange={this.onChange}/>
				</Form.Field>			
			</Form>
			<Button onClick={this.onSubmit}>Save</Button>
			<Link to="/"><Button>Home</Button></Link>
		</div>
		)
	}
}

export default connect()(Register);