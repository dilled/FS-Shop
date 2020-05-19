import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import BasketList from './BasketList'


export default class Basket extends React.Component {

    constructor(props) {
		super(props);
		this.state = { 
			showBasketList: false,
		}
    }
    
    basketSize() {
        let size =0;
        for (let i=0; i<this.props.list.length; i++){ 
            size += parseInt(this.props.list[i].quantity);
        }
		return size;
	}
	
	basketCost = () => {
        let cost =0;
        for (let i=0; i<this.props.list.length; i++){ 
            cost += this.props.list[i].quantity * this.props.list[i].price;
        }   
		return cost.toFixed(2);
	}
	
	showBasket = () => {
		this.setState({showBasketList: !this.state.showBasketList});		
	}

	render() {		
		
			let styleBasket = {
				position: "absolute",
				right: "100px",
				top: "15px",
				//height:100,
				//backgroundColor:"lightblue"
			}
			if (this.props.list.length > 0){
				return (
					<div style={styleBasket}>
						<button  onClick={this.showBasket}>				
							Amount:{this.basketSize()}
							<hr/>
							Price total:{this.basketCost()}					
						</button>				
						{this.state.showBasketList ? 
                            <BasketList list={this.props.list} basket={this.props.basket} text="Remove from" label="Basket" show={this.showBasket}/> :
                            <div></div>}
                        {this.props.isLogged ? <Button onClick={()=>this.setState({showBasketList: false})}><Link to="/purchase">Cash out</Link></Button> : <Button onClick={()=>this.setState({showBasketList: false})}><Link to="/login">Login</Link></Button>}
					</div>	
				)
			}
			else{
				return (<div></div>)
			}
		}
}

