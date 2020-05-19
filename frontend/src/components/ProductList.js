import React from 'react';
import {Table, Image, Button} from 'semantic-ui-react';
import Product from './Product';
import '../App.css';

export default class ProductList extends React.Component {
	 
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
	
	render() {
		let items = this.props.list.map((item,index) =>  
			
			<Table.Row key={index}> 
				<Table.Cell><Image src={item.image}></Image></Table.Cell>
				<Table.Cell>{<Product product={item}/>}</Table.Cell>
				{/*<Table.Cell>{item.name}</Table.Cell>*/}
				<Table.Cell>{item.quantity}</Table.Cell>
				<Table.Cell>{item.price}&nbsp;{item.priceTypeText}</Table.Cell>
				<Table.Cell>{item.quantity <= 0 || this.props.label === "Basket" ? '' :
							<input type="number"
							name={item.productId}
							onChange={this.onChange}
							defaultValue="1"
							min="1"
							max={item.quantity}
							value={this.state[item.productId] > item.quantity ? item.quantity : this.state[item.productId]}/>}
							<Button onClick={() =>
							this.basket(item, this.state[item.productId] <= item.quantity ? this.state[item.productId] : this.state[item.productId] ? item.quantity : 1)}
							disabled={true ? item.quantity <= 0 : false}>{this.props.text} basket</Button></Table.Cell>
			</Table.Row>
		)
		return (
			<Table celled  className="fs-products-table">
				<Table.Header>
					
					<Table.Row>
						<Table.HeaderCell></Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
						<Table.HeaderCell>Quantity</Table.HeaderCell>
						<Table.HeaderCell>Price</Table.HeaderCell>
						
					</Table.Row>
				</Table.Header>
				<Table.Body>
		
					{items}

				</Table.Body>
			</Table>
		
		)
	}
}