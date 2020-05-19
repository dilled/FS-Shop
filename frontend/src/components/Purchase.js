import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Image } from 'semantic-ui-react';
import Product from './Product';

export default class Purchase extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false
		}
	}

	basket = (item, amount) => {
		this.props.basket(item, amount);
		//console.log(item);       
	}

	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	onSubmit = (event) => {
		event.preventDefault();
		let list = this.props.list;
		const purchases = list.map(({ name, id, image, price, description, ...rest }) => rest)
		this.props.onPurchase(purchases);
	}
	render() {
		let items = this.props.list.map((item, index) =>
			<Table.Row key={index}>

				<Table.Cell>{item.name}</Table.Cell>

				<Table.Cell>{item.quantity}</Table.Cell>
				<Table.Cell>{item.price}</Table.Cell>
				<Table.Cell>
					<Button onClick={() =>
						this.basket(item, this.state[item.productId] <= item.quantity ? this.state[item.productId] : this.state[item.productId] ? item.quantity : 1)}
						disabled={true ? item.quantity <= 0 : false}>{this.props.text} basket</Button></Table.Cell>
			</Table.Row>
		)
		return (
			<div>
				<Table celled>
					<Table.Header>

						<Table.Row>

							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell>Quantity</Table.HeaderCell>
							<Table.HeaderCell>Price</Table.HeaderCell>

						</Table.Row>
					</Table.Header>
					<Table.Body>

						{items}

					</Table.Body>
				</Table>
				<Button onClick={this.onSubmit}>Confirm purchase</Button>
				<Link to="/"><Button>Cancel</Button></Link>
			</div>
		)
	}
}