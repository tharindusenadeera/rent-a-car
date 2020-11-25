import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
// import axios from "axios";
import {
  defaultModelPopup,
  defaultMobileModelPopup,
  modalStylesBooking
} from "../../consts/consts";
//import StripePaymentForm from "../../components/credit-card/StripePaymentForm";
import { getUsStates } from "../../actions/CarActions";
import StripePaymentForm from "../credit-card/StripePaymentForm";

class AcceptTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      showModelNotRyde: false,
      showAddCreditCard: false,
      addNewCreditCard: false,
      showCardUpdatedPopUp: false
    };
  }

  componentDidMount() {
    const { dispatch, usStates } = this.props;
    if (usStates.length === 0) {
      dispatch(getUsStates());
    }
  }

  toggleModel = () => {
    const { ticket } = this.props;
    ticket &&
      ticket.detailable.resolve_with_guest_status === 1 &&
      this.setState({ showModelNotRyde: !this.state.showModelNotRyde });
    ticket &&
      ticket.detailable.resolve_with_guest_status === 0 &&
      this.setState({ showModel: !this.state.showModel });
  };

  showCreditCardForm = () => {
    this.setState({ showAddCreditCard: true });
  };

  render() {
    const {
      usStates,
      user,
      handleAccept,
      success,
      message,
      ticket
    } = this.props;

    return (
      <div>
        <button
          type="button"
          className="btn SC_btn SC_btn_submit"
          onClick={this.toggleModel}
        >
          ACCEPT
        </button>
        <Modal
          isOpen={this.state.showModelNotRyde}
          onRequestClose={() => this.setState({ showModelNotRyde: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div className="del_icon">
              <span
                className="icon-cancel"
                onClick={() => this.setState({ showModelNotRyde: false })}
              />
            </div>
            <div className="header_second">
              Are you sure you want to accept this claim request ?
            </div>
            <div className="btn-scbox">
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_withdraw"
                onClick={() => this.setState({ showModelNotRyde: false })}
              >
                NO
              </button>
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_submit"
                onClick={() => handleAccept()}
              >
                YES
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.showModel}
          onRequestClose={this.toggleModel}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div className="del_icon">
              <span
                className="icon-cancel"
                onClick={() => this.setState({ showModel: false })}
              />
            </div>
            <div className="header_second">
              Total amount of{" "}
              <strong>
                ${" "}
                {ticket &&
                  ticket.detailable.chargeable_amount &&
                  ticket.detailable.chargeable_amount}
              </strong>
              <br />
              {ticket &&
                parseFloat(ticket.detailable.estimate_amount) <
                  parseFloat(ticket.detailable.max_deduct_amount) && (
                  <p>
                    (
                    {ticket && ticket.detailable.estimate_amount > 0 ? (
                      <Fragment>
                        ${" "}
                        {ticket &&
                          ticket.detailable.estimate_amount &&
                          ticket.detailable.estimate_amount}{" "}
                        +{" "}
                      </Fragment>
                    ) : (
                      <Fragment></Fragment>
                    )}
                    {ticket &&
                      ticket.detailable.processing_fee_percentage &&
                      ticket.detailable.processing_fee_percentage}
                    % processing fee{" "}
                    {ticket && ticket.detailable.estimate_amount == 0 ? (
                      "included"
                    ) : (
                      <Fragment></Fragment>
                    )}
                    )
                  </p>
                )}
              will be withdrawn from your card no
              <br />
              <strong>{user && user.credit_card}</strong>
            </div>

            <div className="col-sm-12 SC_poup_btnbox">
              <button
                className="btn SC_btn_add"
                onClick={this.showCreditCardForm}
              >
                <img
                  alt="Add another icon"
                  src="/images/support-center/create_icon.svg"
                />{" "}
                Add Another Card
              </button>
            </div>

            {!success && message && (
              <div className="col-sm-12 SC_drawer_box">
                <div className="SC_msg_error">
                  {/* janith to style here icon */}
                  {/* <div className="icon">
                      <img src="/images/support-center/error_icon.svg" />
                    </div> */}
                  <div className="text">{message}</div>
                </div>
              </div>
            )}
            <div className="btn-scbox">
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_withdraw"
                onClick={this.toggleModel}
              >
                GO BACK
              </button>
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_submit"
                onClick={() => handleAccept()}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          className="coupon-modal"
          isOpen={this.state.showAddCreditCard}
          onRequestClose={this.toggleModel}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          style={modalStylesBooking}
        >
          <StripePaymentForm
            usStates={usStates}
            addNewCreditCard={() => {
              this.setState({
                addNewCreditCard: !this.state.addNewCreditCard,
                showAddCreditCard: false,
                showCardUpdatedPopUp: true
              });
            }}
            type={"PROFILE"}
            closeModal={() => {
              this.setState({ showAddCreditCard: false });
            }}
          />
        </Modal>

        {/* Add New Card - Success */}
        <Modal
          isOpen={this.state.showCardUpdatedPopUp}
          onRequestClose={() => this.setState({ showCardUpdatedPopUp: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div className="del_icon">
              <span
                className="icon-cancel"
                onClick={() => this.setState({ showCardUpdatedPopUp: false })}
              />
            </div>
            <div className="icon">
              <img src="/images/checkout/success-icon-green.png" />
            </div>
            <div className="header">
              New card has been updated <br />
              to your account
            </div>
            <div>
              <button
                className="btn SC_btn SC_btn_submit"
                onClick={() => this.setState({ showCardUpdatedPopUp: false })}
              >
                CONTINUE
              </button>
            </div>
          </div>
        </Modal>
        {/* Add New Card - Success */}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    usStates: state.car.usStates,
    user: state.user.user
  };
};
export default connect(mapStateToProps)(AcceptTicket);
