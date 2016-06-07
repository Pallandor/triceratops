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
          // 10 is 10 cents. 
          amount={this.props.product.price * 100}
          currency="USD"
          stripeKey="pk_test_5NqE0jbJlQN5Y86wK5waoZOh"
          locale="auto"
          // email="the email key"
          // Note: Enabling either address option will give the user the ability to 
          // fill out both. Addresses are sent as a second parameter in the token callback. 
          shippingAddress={false}
          billingAddress={false}
          // Note: enabling both zipCode checks and billing or shipping address can have 
          // unintended consequences. 
          zipCode={false}
          alipay={true}
          bitcoin={true}
          allowRememberMe={true}
          token={this.onToken.bind(this)}
          // Note: `reconfigureOnUpdate` should be set to true IFF if you do not change 
          // the core stripe config (stripeKey, image, ...) on subsequent components. It can 
          // improve performance if you have a lot of buttons that tie to the same account. 
          reconfigureOnUpdate={false}
          >
          <FlatButton primary={true} className="myOwnButton">
            Click Here to Proceed with Payment
          </FlatButton>
        </StripeCheckout>
        )
    }
}

// PaymentForm.propTypes = {
//   router: React.PropTypes.shape({
//     push: React.PropTypes.func.isRequired
//   }).isRequired
// };

export default PaymentForm;

// const PaymentForm = (props) => {
//   // const { fields, handleSubmit, resetForm, isAttemptingToAdd, mapUpdate, ui, setMapCenter, setMarkerCenter } = props;
//   // mock fields obj

//   return (
//     <div>
//     <noscript>
//       <form action="" method="POST" id="payment-form" className='addForm'>
//       <h3>Please enter payment details below: </h3>
//       {/* isAttemptingToAdd ? <p>Processing payment, please wait...</p> : null */}
//         <ul style={{listStyle:'none', background:'rgba(255,255,255,0.8)'}}>
//           <li><TextField hintStyle={errorStyle} floatingLabelText={'Card Number'} /></li>
//           <li><TextField hintStyle={errorStyle} floatingLabelText={'Expiration (MM/YY)'} /></li>
//           <li><TextField hintStyle={errorStyle} hintText={'Price'} /></li>
//           <li>
//              <RaisedButton
//               primary={true}
//               type="submit"
//               label="Pay Now!"
//               onClick={()=>{console.log('making payment within form!')}}
//               />
//           </li>
//         </ul>
//       </form>
//       </noscript>

//       <form action="" method="POST">
//         <script
//           src="https://checkout.stripe.com/checkout.js" class="stripe-button"
//           data-key="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
//           data-amount="999"
//           data-name="Stripe.com"
//           data-description="Widget"
//           data-image="/img/documentation/checkout/marketplace.png"
//           data-locale="auto">
//         </script>
//       </form>
//     </div>
//     );
// };

