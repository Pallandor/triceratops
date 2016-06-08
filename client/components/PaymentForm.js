import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import {blueGrey500} from 'material-ui/styles/colors';
import StripeCheckout from 'react-stripe-checkout'; 
import util from '../services/helper'; 
import { browserHistory } from 'react-router';

const errorStyle = {
    color: blueGrey500
  };

class PaymentForm extends Component {
  constructor(props, context){
    super(props, context);
  }

  onToken(token) {
    const { product, user } = this.props; 
    const transactionObj = {
      product: product,
      user: user,
      stripeToken: token
    };
    util.postHelper('/products/stripe', transactionObj)
      .then(res=>{
        if (res.status === 200){
          browserHistory.push('/manage'); 
        }
        else {
          alert('Status response was not OK! See PaymentForm.js Component line 32'); 
        }
      }); 
  }

  render(){
    return (
        <StripeCheckout
          name="ShareAnything Inc."
          description={'Renting a ' + this.props.product.title}
          image="https://s32.postimg.org/l2gyohb05/ic_face_black_48dp_2x.png"
          componentClass="div"
          panelLabel="Confirm Payment"
          amount={this.props.product.price * 100}
          currency="USD"
          stripeKey="pk_test_5NqE0jbJlQN5Y86wK5waoZOh"
          locale="auto"
          shippingAddress={false}
          billingAddress={false}
          zipCode={false}
          alipay={true}
          bitcoin={true}
          allowRememberMe={true}
          token={this.onToken.bind(this)}
          reconfigureOnUpdate={false}
          >
          <FlatButton primary={true} className="myOwnButton">
            Click Here to Proceed with Payment
          </FlatButton>
        </StripeCheckout>
        )
    }
}

export default PaymentForm;

