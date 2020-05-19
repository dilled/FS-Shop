import React from 'react';
import {Modal, Image, Header, Button} from 'semantic-ui-react';
import '../App.css';
export default class Product extends React.Component {

    render(){
        
        return(
        <Modal  trigger={<Button>{this.props.product.name} details</Button>} centered={false}>
                <Modal.Header>{this.props.product.label}</Modal.Header>
                <Modal.Content image ><Image style={{maxWidth:'200px',maxHeight:'200px'}} src={this.props.product.image}></Image>
                
                <Modal.Description>
                    <Header> {this.props.product.name}</Header>
                    <p>
                    {this.props.product.description}
                    </p>
                    <p>Price: {this.props.product.price}&nbsp;{this.props.product.priceTypeText}</p>
                </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }

}