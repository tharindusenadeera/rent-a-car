import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "react-modal";
import { Field, reduxForm } from "redux-form";
import { createCreditCard } from "../../actions/UserActions";
import { modalStylesBooking } from "../../consts/consts";
import SquarePayment from "../credit-card/SquarePayment";
import StripePaymentForm from "../credit-card/StripePaymentForm";
import { getLoggedInUser } from "../../actions/UserActions";

Modal.setAppElement("#root");

class CreditCardForm extends Component {
  constructor() {
    super();
    this.state = {
      showSquareForm: false,
      showModal: false
    };
  }

  afterStripeSubmit = () => {
    if (this.props.user && this.props.user.square_sign_up == true) {
      this.setState({ showSquareForm: true });
    }
  };

  componentDidMount() {
    if (this.props.user && this.props.user.square_sign_up == true) {
      this.setState({ showSquareForm: true });
    }
  }

  getLoggedInUser = () => {
    this.props.dispatch(getLoggedInUser());
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.square_sign_up == true) {
      this.setState({ showSquareForm: true });
    }
    this.handelModal();
  }

  componentWillMount() {
    this.handelModal();
  }

  handelModal() {
    this.setState({ showModal: true });
  }

  render() {
    const { usStates, handleCloseModal, showCreditCardForm, user } = this.props;

    return (
      <Fragment>
        <Modal
          className="coupon-modal Credit_poup_wrapper"
          isOpen={this.state.showModal}
          onRequestClose={handleCloseModal}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          style={modalStylesBooking}
        >
          {this.state.showSquareForm == false ? (
            <StripePaymentForm
              usStates={usStates}
              afterStripeSubmit={this.afterStripeSubmit}
              type={"PROFILE"}
              addNewCreditCard={val => {
                handleCloseModal();
              }}
              closeModal={() => {
                this.setState({ showModal: false });
              }}
            />
          ) : (
            <StripePaymentForm
              usStates={usStates}
              afterStripeSubmit={this.afterStripeSubmit}
              type={"PROFILE"}
              addNewCreditCard={val => {
                handleCloseModal();
              }}
              closeModal={() => {
                this.setState({ showModal: false });
              }}
            />
          )
          //Comment for square payment form
          // <SquarePayment user={user} getLoggedInUser={this.getLoggedInUser} />
          }
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});

export default connect(mapStateToProps)(CreditCardForm);
