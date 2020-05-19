import React, { Fragment } from 'react';
import './App.css';

import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';


import ProductList from './components/ProductList';
import Basket from './components/Basket';
import Purchase from './components/Purchase';

import {withRouter, Switch, Route, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {getProducts} from './actions/productActions';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		
			basket: [],
			basketSize: 0,
			category: [],
			
			token: null,
			nickname:undefined
		}
	}
	
	componentDidMount() {
		this.props.dispatch(getProducts());

	}

	updateQuantity = (id, amount) => {
		let tempProducts = this.state.category;
		for (let i = 0; i < tempProducts.length; i++) {
			if (id === tempProducts[i].productId) {
				console.log('quantity', amount);
				tempProducts[i].quantity += parseInt(amount);
				//this.setState({products: tempProducts});
				return;
			}
		}
	}
	
	addToBasket = (item, amount) => {
		//let amount =1;
	//	this.updateStock(item, -amount);   //quantity update to mongo
		console.log(item + ' ADD to basket');
		let tempAmount = 0;
		let tempItems = [];
		for (let i = 0; i < this.state.basket.length; i++) {
			if (item.productId === this.state.basket[i].productId) {
				console.log(item.productId + ' Found in basket');
				tempItems = this.state.basket;
				tempAmount = parseInt(tempItems[i].quantity) + parseInt(amount);
				console.log(tempAmount);
				let tempItem = {
					id: tempItems[i]._id,
					productId: tempItems[i].productId,
					name: tempItems[i].name,
					price: tempItems[i].price,
					quantity: tempAmount,
					image: tempItems[i].image,
					description: tempItems[i].description,
				}
				this.updateQuantity(item.productId, parseInt(-amount));
				tempItems.splice(i, 1, tempItem);
				this.setState({
					basket: tempItems
				})
				return;
			}
		}

		let tempItem = {
			id: item._id,
			productId: item.productId,
			name: item.name,
			price: item.price,
			quantity: amount,
			image: item.image,
			description: item.description,
		}
		this.updateQuantity(item.productId, parseInt(-amount));
		this.setState({ basket: [...this.state.basket, tempItem] });
		return;
	}

	emptyBasket = () => {
		this.setState({basket: []});
	}

	removeFromBasket = (item) => {
	//	this.updateStock(item, item.quantity);	//quantity update to mongo
		console.log(item.productId + ' Remove from basket');
		let tempItems = [];
		for (let i = 0; i < this.state.basket.length; i++) {
			if (item.productId === this.state.basket[i].productId) {
				console.log(item.productId + ' Found in basket');
				tempItems = this.state.basket;
				this.updateQuantity(item.productId, tempItems[i].quantity);
				tempItems.splice(i, 1);
				this.setState({
					basket: tempItems
				})
				return
			}
		}
	}
	setCategory = (item) => {
		this.setState({ category: item });
	}
	
	onPurchase = (list) => {	
		let request = {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json", token:this.props.token},
			body: JSON.stringify(list)
		}
		fetch("/shop/api/cashout", request).then(response => {
			if (response.ok) {
				alert("Purchase success");
				this.emptyBasket();
			} else {
				alert("Purchase failed.");
			}
		}).catch(error => {
			console.log(error);
		})
	}
	
	render() {
		return (
				<Fragment>
				<div className="App">
				
					{//<NavBar state={this.state} isLogged={this.state.isLogged}  onLogout={this.onLogout}  />
					}
					<NavBar categories={this.props.categories} category={this.setCategory}/>
					<Switch>
						
						<Route path="/list" render={() => (

							<ProductList list={this.state.category} basket={this.addToBasket} text="Add to" label="Products" />

						)} />
						<Route path="/login" render={() => (
							this.props.isLogged ?
								<Redirect to="/list" /> :
								<Login onLogin={this.onLogin} />
						)} />
						<Route path="/register" render={() => (
							this.props.isLogged ?
								<Redirect to="/list" /> :
								<Register onRegister={this.onRegister} />
						)} />
						<Route path="/purchase" render={() => (
							this.props.isLogged ?
								<Purchase onPurchase={this.onPurchase} list={this.state.basket} basket={this.removeFromBasket} text="Remove from" /> :
								<Redirect to="/list" />
						)} />
					</Switch>
					<Basket list={this.state.basket} basket={this.removeFromBasket} isLogged={this.props.isLogged} />

				
			</div>
			</Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		isLogged:state.login.isLogged,
		token:state.login.token,
		nickname:state.login.nickname,
		categories:state.product.categories,
	}
}

export default withRouter(connect(mapStateToProps)(App));
