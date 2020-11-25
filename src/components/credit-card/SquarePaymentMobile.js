import React, { Component } from 'react';
import SquarePaymentForm from 'react-square-hosted-fields';

const w = window;
const $ = window.$;
$(document).ready(function () {
  console.log();
  $('#rootHeader').hide()
});
class SquarePaymentMobile extends Component {



    render(){
        return(
            <div className="container">
              <div className="square-payment-wrapper">
                  <SquarePaymentForm
                      submitText = "Verify"
                      buttonWrapperClass = "phome-verify-btn"
                      appId= {process.env.REACT_APP_SQUARE_APP_ID}
                      onNonceError={ (error) => {
                        w.postMessage(error[0].message, '*');
                      } }
                      onNonceGenerated={(data) => {
                        w.postMessage(data, '*')
                      }} >
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
                </div>
            </div>
        );
    }
}


export default SquarePaymentMobile
