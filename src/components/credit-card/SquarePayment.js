import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import SquarePaymentForm from 'react-square-hosted-fields';
import { getLoggedInUser } from '../../actions/UserActions';

class SquarePayment extends Component {

    constructor(){
        super();
        this.state = {
            error : false,
            errorMessage : '',
            success : false,
            successMessage : '',
            submitting : false,
        }
    }

    onNonceError = (error) => {
        this.setState({error:true,errorMessage: error[0].message})
        setTimeout(() => {
            this.setState({ error: false, errorMessage: '' })
          }, 5000);
    }

    onNonceGenerated = async (nonce) => {
        try {
            this.setState({error:false,errorMessage: ''})
            const response = await (await axios.post(process.env.REACT_APP_API_URL + 'credit-card/verify-square', {
                nonce : nonce,
                user_id: this.props.user.id
            }, {
                headers: {
                  Authorization: localStorage.access_token
                }
              }));
            if(!response.data.error){
                this.props.dispatch(getLoggedInUser())
                this.setState({ success: true, successMessage: response.response })
                setTimeout(() => {
                this.setState({ success: false, successMessage: '' })
              }, 5000);
            }
        } catch (error) {
            this.setState({ error: true, errorMessage: error.response.data.message })
            setTimeout(() => {
            this.setState({ error: false, errorMessage: '' })
          }, 5000);
        }
    }

    render(){
        const { user } = this.props;

        return(
            <div className="square-payment-wrapper clearfix">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-sub-title">Verify your credit card information ( {user && user.credit_card} )</div>
                    </div>
                </div>
                <SquarePaymentForm 
                    submitText= "VERIFY & CONTINUE"
                    buttonWrapperClass = "verify-btn"
                    appId= {process.env.REACT_APP_SQUARE_APP_ID} 
                    onNonceError={ (error) => this.onNonceError(error) }
                    onNonceGenerated={this.onNonceGenerated} >
                    <div className="some-custom-wrapper">
                        <div className="row">
                            <div className="form-group col-sm-6 fields-sep">
                                <label>Card Number <span className="fields-requred">*</span></label>
                                <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="form-control form-control-sm input-sm" id="sq-card-number" />
                            </div>
                            <div className="form-group col-sm-6 fields-sep">
                                <label>CVV <span className="fields-requred">*</span></label>
                                <input type="text" placeholder="XXXX" className="form-control form-control-sm input-sm" id="sq-cvv" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6 fields-sep">
                                <label>Expiration Date <span className="fields-requred">*</span></label>
                                <input type="text" placeholder="Type your card expiration date" className="form-control form-control-sm input-sm" id="sq-expiration-date" />
                            </div>
                            <div className="form-group col-sm-6 fields-sep">
                                <label>Postal Code <span className="fields-requred">*</span></label>
                                <input type="text" placeholder="Type postal code" className="form-control form-control-sm input-sm" id="sq-postal-code" />
                            </div>
                        </div>
                    </div>
                </SquarePaymentForm>
                
                
                    {
                        (this.state.success) &&   
                        <div className="messages-wrapper">
                            <div className="notification success-message">
                                <span className="success-notification-cap-lg">Thank you.</span>
                                <span className="success-notification-cap-sm">{ this.state.successMessage }</span>
                            </div>
                        </div>
                    }
                    {
                        (this.state.error) &&   
                        <div className="messages-wrapper">
                            <div className="notification error-message">
                                <div className="notification-inner">
                                    <img className="img-responsive pic" src="/images/checkout/exclamation-icon-red.png" alt="RYDE" />
                                    <span className="error-notification-cap-lg">{ this.state.errorMessage }</span>
                                </div>
                            </div>
                        </div>
                    }
               
        </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
  })  
export default connect(mapStateToProps)(SquarePayment)