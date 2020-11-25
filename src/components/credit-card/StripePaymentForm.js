import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  creditCardType,
  creditCardYears,
  months,
  countryList
} from "../../consts/consts";
import { getLoggedInUser } from "../../actions/UserActions";
import { IS_FETCHING, DONE_FETCHING } from "../../actions/ActionTypes";
import JSEncrypt from "js-encript";
import TextInput from "../../form-components/TextInput";
import SelectInput from "../../form-components/SelectInput";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { authFail } from "../../actions/AuthAction";
import checkAuth from "../requireAuth";
import CreditCardInput from "../../form-components/CreditCardInput";

class StripePaymentForm extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      cardNumber: "",
      cardType: "",
      expiryMonth: "",
      expiryYear: "",
      ccv: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      error: false,
      errorMessage: "",
      submitting: false,
      validating: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.notifyToAdmin(5);
    }, 300000);
  }

  notifyToAdmin = async time => {
    try {
      await await axios.post(
        process.env.REACT_APP_API_URL + "waiting",
        {
          time: time,
          page: "CREDIT CARD INFORMATION",
          category: "credit_card"
        },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  encript = data => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(process.env.REACT_APP_RSA_PUBLIC_KEY);
    var encrypted = encrypt.encrypt(data);
    return encrypted;
  };

  handleCardNumberChange = e => {
    let cardNumber = e.target.value
      .replace("-", "")
      .replace("-", "")
      .replace("-", "")
      .replace("-", "");
    let newCard = "";
    cardNumber.split("").forEach((element, index) => {
      if (index == 4 || index == 8 || index == 12 || index == 16) {
        newCard = newCard + "-" + element;
      } else {
        newCard = newCard + element;
      }
    });
    if (cardNumber.length <= 20) this.setState({ cardNumber: newCard });
  };

  createCreditCard = async () => {
    this.setState({ submitting: true, validating: true });
    let validator = this._validate();
    if (JSON.stringify(validator) !== "{}") {
      this.setState({ submitting: false });
      return false;
    }

    const { dispatch } = this.props;
    dispatch({ type: IS_FETCHING });
    try {
      const { user } = this.props;
      const {
        firstName,
        lastName,
        cardNumber,
        cardType,
        expiryMonth,
        expiryYear,
        ccv,
        streetAddress,
        city,
        state,
        zipCode,
        country
      } = this.state;
      let ccNumber = cardNumber
        .replace("-", "")
        .replace("-", "")
        .replace("-", "")
        .replace("-", "");
      const data = {
        id: user.id,
        credit_card_first_name: firstName,
        credit_card_last_name: lastName,
        credit_card_number: this.encript(ccNumber),
        credit_card_type: cardType,
        credit_card_expiry_month: this.encript(expiryMonth),
        credit_card_expiry_year: this.encript(expiryYear),
        credit_card_ccv: this.encript(ccv),
        credit_card_street_address: streetAddress,
        credit_card_city: city,
        credit_card_state: state,
        credit_card_zip_code: this.encript(zipCode),
        credit_card_country: country,
        focused: false
      };
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "v2/credit-card/add",
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        dispatch({ type: DONE_FETCHING });
        this.props.dispatch(getLoggedInUser());
        this.props.addNewCreditCard(false);
        window.scrollTo(0, 0);
      } else {
        dispatch({ type: DONE_FETCHING });
        this.setState({
          error: true,
          errorMessage: response.data.message,
          submitting: false,
          validating: false
        });
        setTimeout(() => {
          this.setState({ error: false, errorMessage: "" });
        }, 5000);
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      dispatch({ type: DONE_FETCHING });
      this.setState({
        error: true,
        errorMessage: error.response.data.message,
        submitting: false
      });
      setTimeout(() => {
        this.setState({ error: false, errorMessage: "" });
      }, 5000);
    }
  };

  resetForm = () => {
    this.setState({
      firstName: "",
      lastName: "",
      cardNumber: "",
      cardType: "",
      expiryMonth: "",
      expiryYear: "",
      ccv: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      error: false,
      errorMessage: "",
      submitting: false,
      validating: false
    });
  };

  _validate = () => {
    const {
      firstName,
      lastName,
      cardNumber,
      ccv,
      streetAddress,
      city,
      zipCode,
      cardType,
      expiryMonth,
      expiryYear,
      state,
      country
    } = this.state;
    const errors = {};
    if (!firstName) {
      errors.first_name = "First name is required";
    }
    if (!lastName) {
      errors.last_name = "Last name is required";
    }
    if (!cardNumber) {
      errors.credit_card_number = "Card number is required ";
    }
    if (!ccv) {
      errors.ccv = "Cvv is required ";
    }
    if (!streetAddress) {
      errors.street_address = "Street address is required ";
    }
    if (!city) {
      errors.city = "City is required";
    }
    if (!zipCode) {
      errors.zip_code = "Zip code is required";
    }
    if (!cardType) {
      errors.card_type = "Card type is required";
    }
    if (!expiryMonth) {
      errors.expiry_month = "Expiry month is required";
    }
    if (!expiryYear) {
      errors.expiry_year = "Expiry year is required";
    }
    if (!state) {
      errors.state = "State is required";
    }
    if (!country) {
      errors.country = "Country is required";
    }
    return errors;
  };

  _makeUsStateArray = () => {
    const { usStates } = this.props;
    if (usStates) {
      let array = [];
      usStates.map(i => {
        array.push({
          key: i.code,
          value: i.name
        });
      });
      return array;
    }
  };

  _makeCountryArray = () => {
    if (countryList) {
      let array = [];
      countryList.map(i => {
        array.push({
          key: i.code,
          value: i.name
        });
      });
      return array;
    }
  };

  render() {
    const {
      firstName,
      lastName,
      cardNumber,
      cardType,
      expiryMonth,
      expiryYear,
      ccv,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      error,
      validating
    } = this.state;
    const { type, history } = this.props;
    return (
      <div className="booking-user-info-wrapper">
        <div className="row">
          <div className="col-md-12">
            {type == "PROFILE" ? (
              <div className="header-block">
                <h4>CREDIT CARD INFORMATION</h4>
                <p>Please Enter Your credit card information here</p>
                <br />
              </div>
            ) : (
              <div className="page-sub-title">Credit card information</div>
            )}
          </div>
        </div>
        <div>
          <div className="row">
            <div className="form-group col-sm-6 fields-sep">
              <TextInput
                validate={() => this._validate()}
                required={true}
                label="First name"
                submitting={validating}
                className="form-control form-control-sm input-sm"
                value={firstName}
                placeholder="Type your first name"
                name="first_name"
                onChange={e => this.setState({ firstName: e.target.value })}
              />
            </div>
            <div className="form-group col-sm-6 fields-sep">
              <TextInput
                validate={() => this._validate()}
                required={true}
                label="Last name"
                type="text"
                placeholder="Type your last name"
                className="form-control form-control-sm input-sm"
                value={lastName}
                id="lastName"
                name="last_name"
                submitting={validating}
                onChange={e => this.setState({ lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 fields-sep">
              <CreditCardInput
                validate={() => this._validate()}
                required={true}
                label="Card number"
                required={true}
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="form-control input-sm"
                value={cardNumber}
                id="cardNumber"
                name="credit_card_number"
                submitting={validating}
                onChange={e => this.handleCardNumberChange(e)}
              />
            </div>
            <div className="col-sm-6">
              <div className="form-group select-outer fields-sep">
                <SelectInput
                  validate={() => this._validate()}
                  label="Card type "
                  required={true}
                  prompt="Select"
                  submitting={validating}
                  data={creditCardType}
                  className="form-control input-sm"
                  value={cardType}
                  id="cardType"
                  name="card_type"
                  onChange={e => this.setState({ cardType: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-3">
                  <div className="form-group select-outer fields-sep">
                    <SelectInput
                      validate={() => this._validate()}
                      label="Expiration month"
                      required={true}
                      prompt="Select"
                      submitting={validating}
                      data={months}
                      className="form-control input-sm"
                      value={expiryMonth}
                      id="expiryMonth"
                      name="expiry_month"
                      onChange={e =>
                        this.setState({ expiryMonth: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group col-sm-3 fields-sep">
                  <div className="select-outer">
                    <SelectInput
                      validate={() => this._validate()}
                      label="Expiration year"
                      required={true}
                      prompt="Select"
                      submitting={validating}
                      data={creditCardYears}
                      className="form-control input-sm"
                      value={expiryYear}
                      id="expiryYear"
                      name="expiry_year"
                      onChange={e =>
                        this.setState({ expiryYear: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group col-sm-2 fields-sep">
                  <TextInput
                    validate={() => this._validate()}
                    required={true}
                    label="CVV"
                    required={true}
                    submitting={validating}
                    type="number"
                    placeholder="XXX"
                    className="form-control input-sm"
                    value={ccv}
                    id="ccv"
                    name="ccv"
                    onChange={e => this.setState({ ccv: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-sm-6 fields-sep">
              <TextInput
                validate={() => this._validate()}
                required={true}
                label="Street address"
                required={true}
                submitting={validating}
                type="text"
                placeholder="Type street address here"
                className="form-control input-sm"
                value={streetAddress}
                id="streetAddress"
                name="street_address"
                onChange={e => this.setState({ streetAddress: e.target.value })}
              />
            </div>
            <div className="form-group col-sm-6 fields-sep">
              <TextInput
                validate={() => this._validate()}
                required={true}
                label="City"
                required={true}
                submitting={validating}
                type="text"
                placeholder="Type city here"
                className="form-control input-sm"
                value={city}
                id="city"
                name="city"
                onChange={e => this.setState({ city: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <div className="form-group select-outer fields-sep">
                <SelectInput
                  validate={() => this._validate()}
                  label="State"
                  required={true}
                  prompt="Select"
                  submitting={validating}
                  data={this._makeUsStateArray()}
                  className="form-control input-sm"
                  value={state}
                  id="state"
                  name="state"
                  onChange={e => this.setState({ state: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group col-sm-6 fields-sep">
              <TextInput
                validate={() => this._validate()}
                required={true}
                label="Zip code"
                required={true}
                submitting={validating}
                type="number"
                placeholder="Type zip code here"
                className="form-control input-sm"
                value={zipCode}
                id="zipCode"
                name="zip_code"
                inputmode="numeric"
                onChange={e => this.setState({ zipCode: e.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group select-outer fields-sep">
                <SelectInput
                  validate={() => this._validate()}
                  label="Country"
                  required={true}
                  prompt="Select"
                  submitting={validating}
                  data={this._makeCountryArray()}
                  className="form-control input-sm"
                  value={country}
                  id="country"
                  name="country"
                  onChange={e => this.setState({ country: e.target.value })}
                />
              </div>
            </div>
          </div>
          {error ? (
            <div className="row">
              <div className="form-group col-sm-12 col-md-12">
                <div className="messages-wrapper">
                  <div className="notification error-message">
                    <div className="notification-inner">
                      <img
                        className="img-responsive pic"
                        src="/images/error-icon.svg"
                        alt="Image"
                      />
                      <span className="error-notification-cap-lg">
                        {this.state.errorMessage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <div className="checkout-buttons-wrapper">
            <div className="flex-container">
              {type == "NEW-PROFILE" ? (
                <button
                  className="checkout-buttons back-btn"
                  onClick={this.props.addNewCreditCard}
                >
                  <span className="icon-left-arrow" /> BACK
                </button>
              ) : null}

              {type == "BOOKING" ? (
                <button
                  className="checkout-buttons back-btn"
                  onClick={() => history.goBack()}
                >
                  <span className="icon-left-arrow" /> CANCEL
                </button>
              ) : null}

              {type == "PROFILE" ? (
                <button
                  className="checkout-buttons back-btn"
                  onClick={this.props.closeModal}
                >
                  <span className="icon-left-arrow" /> BACK
                </button>
              ) : null}

              <button
                className="checkout-buttons continue-btn"
                onClick={() => this.createCreditCard()}
                type="submit"
                disabled={this.state.submitting === true}
              >
                {this.state.submitting === true && this.state.error !== true && (
                  <div className="submit-btn-preloder">
                    <PreloaderIcon
                      loader={Oval}
                      size={20}
                      strokeWidth={8} // min: 1, max: 50
                      strokeColor="#fff"
                      duration={800}
                    />
                  </div>
                )}
                SAVE & CONTINUE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});
export default connect(mapStateToProps)(checkAuth(StripePaymentForm));
