import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import MainNav from "../components/layouts/MainNav";
import MainFooter from "../components/layouts/MainFooter";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { Radio, Input, Checkbox } from "antd";
import {
  defaultModelPopup,
  defaultMobileModelPopup,
  modalStylesBooking
} from "../consts/consts";
import { getUsStates } from "../actions/CarActions";
import StripePaymentForm from "../components/credit-card/StripePaymentForm";
import UserAuthModel from "../components/forms/UserAuthModel";
import "antd/lib/radio/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/checkbox/style/index.css";
import ModalPopUp from "react-modal";
import { isMobileOnly } from "react-device-detect";
import PreLoader from "../components/preloaders/preloaders";

ModalPopUp.setAppElement("#root");

const RadioGroup = Radio.Group;
const { TextArea } = Input;

class GiftCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      giftCardAmtType: 2,
      giftCardType: 1,
      giftCardAmount: null,
      receiverEmail: "",
      giftMessage: "",
      declareStatus: false,
      errors: {},
      message: "",
      paying: false,
      // Models
      showConfirmation: false,
      showSuccess: false,
      showTermsAndConditions: false,
      showCardDecline: false,
      showAddCreditCard: false,
      showCardUpdatedPopUp: false,
      showModelLogin: false
    };
  }

  componentDidMount() {
    const { dispatch, usStates, authenticated } = this.props;
    if (authenticated !== false && usStates.length === 0) {
      dispatch(getUsStates());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id) {
      this.setState({ showModelLogin: false });
    }
  }

  postGiftCard = data => {
    this.setState({ paying: true });
    axios
      .post(`${process.env.REACT_APP_API_URL}gift-card`, data, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(res => {
        if (!res.data.error) {
          this.setState({ message: res.data.status, paying: false });
          this.toggleModel(1);
          this.toggleModel(2);
          this.setState({
            giftCardAmtType: 2,
            giftCardType: 1,
            giftCardAmount: null,
            receiverEmail: "",
            giftMessage: "",
            declareStatus: false,
            errors: {}
          });
        } else {
          this.toggleModel(3);
        }
      })
      .catch(err => {
        this.setState({
          paying: false,
          message: err.response.data.message,
          showCardDecline: true
        });
      });
  };

  toggleModel = model => {
    model === 1 &&
      this.setState({ showConfirmation: !this.state.showConfirmation });
    model === 2 && this.setState({ showSuccess: !this.state.showSuccess });
    model === 3 &&
      this.setState({ showCardDecline: !this.state.showCardDecline });
    model === 4 &&
      this.setState({
        showTermsAndConditions: !this.state.showTermsAndConditions
      });
    model === 5 &&
      this.setState({ showAddCreditCard: !this.state.showAddCreditCard });
    model === 6 &&
      this.setState({ showCardUpdatedPopUp: !this.state.showCardUpdatedPopUp });
    model === 7 &&
      this.setState({ showModelLogin: !this.state.showModelLogin });
  };

  setAmount = type => {
    switch (type) {
      case 1:
        return 50;
      case 2:
        return 100;
      case 3:
        return 200;
      case 4:
        return this.state.giftCardAmount;
      default:
        return 30;
    }
  };

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validateForm = () => {
    let errors = {};

    const { authenticated, user } = this.props;

    const {
      giftCardAmtType,
      giftCardType,
      giftCardAmount,
      declareStatus,
      receiverEmail,
      giftMessage
    } = this.state;

    if (giftCardAmtType === 4) {
      if (!giftCardAmount) {
        errors.giftCardAmount = "Should not be empty!";
      } else if (giftCardAmount > 1000 || giftCardAmount < 10) {
        errors.giftCardAmount = "Amount must be between  $10 - $1000";
      }
    }
    if (giftCardType === 2) {
      if (!receiverEmail) {
        errors.receiverEmail = "Should not be empty!";
      } else if (!this.validateEmail(receiverEmail)) {
        errors.receiverEmail = "Invalid email address!";
      }
      if (!giftMessage) {
        errors.giftMessage = "Should not be empty!";
      }
    }
    if (!declareStatus) {
      errors.declareStatus = "Please accept the terms and conditions!";
    }
    if (!Object.keys(errors).length) {
      if (authenticated) {
        if (!user.credit_card) {
          this.toggleModel(5);
        } else {
          this.toggleModel(1);
        }
      }
    }
    if (!authenticated) {
      this.setState({ showModelLogin: true });
    } else {
      this.setState({ errors });
    }
  };

  handleSubmit = () => {
    const {
      giftCardAmtType,
      giftCardType,
      receiverEmail,
      giftMessage
    } = this.state;
    const { timeZoneId } = this.props;
    let amount = this.setAmount(giftCardAmtType);
    let type = giftCardType === 1 ? "own" : giftCardType === 2 && "guest";
    let data;
    if (giftCardType === 1) {
      data = {
        amount: parseFloat(amount).toFixed(2),
        type: type,
        gift_type: giftCardAmtType,
        timeZoneId
      };
      this.postGiftCard(data);
    } else if (giftCardType === 2) {
      data = {
        amount: parseFloat(amount).toFixed(2),
        receiver_email: receiverEmail.toLowerCase(),
        type: type,
        message: giftMessage,
        gift_type: giftCardAmtType,
        timeZoneId
      };
      this.postGiftCard(data);
    }
  };

  render() {
    const { errors, giftCardAmtType } = this.state;
    const { user, usStates } = this.props;
    return (
      <>
        <MainNav />
        <div className="container">
          {/* Page Header */}
          <div className="row">
            <div className="col-md-12 page-newhead">
              <div className="page-newhead_backlink">
                <div className="page-newhead_backlink_box">
                  <Link to="/">Home</Link>
                </div>
                {/* <div className="page-newhead_backlink_iconbox">
                  <img src="/images/support-center/bclinks-arrow.png" />
                </div> */}

                {/* <div className="page-newhead_backlink_box">
                  <Link to="/profile">Profile</Link>
                </div> */}
                <div className="page-newhead_backlink_iconbox">
                  <img src="/images/support-center/bclinks-arrow.png" />
                </div>
                <div className="page-newhead_backlink_box">Gift Cards</div>
              </div>
              <h1>Gift Cards</h1>
              <h5>
                You can now give your loved ones the gift to Ryde the car of
                their dreams. You can choose a preselected amount or enter your
                own. We will make sure they have the best car experience gifted
                from you.
              </h5>
            </div>
          </div>
          {/* Page Header */}

          {/* Page Body */}
          <div className="row">
            <div className="GC_rowin">
              <RadioGroup
                onChange={e => {
                  this.setState({ giftCardAmtType: e.target.value });
                  delete errors.giftCardAmount;
                }}
                value={this.state.giftCardAmtType}
              >
                <div className="col-xs-12 col-md-3">
                  <div className="GC_box green">
                    <div className="GC_card_select">
                      <Radio value={1} />
                    </div>
                    <div className="GC_card_text">
                      <div className="text-wrapper">
                        <span className="doller">$</span>
                        <span className="int">50</span>
                      </div>
                    </div>
                    <div className="GC_card_logo">
                      <img src="./images/ryde-logo.png" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-md-3">
                  <div className="GC_box blue">
                    <div className="GC_card_select">
                      <Radio value={2} />
                    </div>
                    <div className="GC_card_text">
                      <div className="text-wrapper">
                        <span className="doller">$</span>
                        <span className="int">100</span>
                      </div>
                    </div>
                    <div className="GC_card_logo">
                      <img src="./images/ryde-logo.png" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-md-3">
                  <div className="GC_box orange">
                    <div className="GC_card_select">
                      <Radio value={3} />
                    </div>
                    <div className="GC_card_text">
                      <div className="text-wrapper">
                        <span className="doller">$</span>
                        <span className="int">200</span>
                      </div>
                    </div>
                    <div className="GC_card_logo">
                      <img src="./images/ryde-logo.png" />
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-md-3">
                  <div className="GC_box black">
                    <div className="GC_card_select">
                      <Radio value={4} />
                    </div>
                    <div className="GC_card_text">
                      <div className="text-wrapper">
                        <span className="varch">Your own</span>
                      </div>
                    </div>
                    <div className="GC_card_logo">
                      <img src="./images/ryde-logo.png" />
                    </div>
                    <div>
                      {this.state.giftCardAmtType === 4 && (
                        <Input
                          placeholder="Enter your amount"
                          className={
                            errors.giftCardAmount
                              ? "GC_field GC_card_input error"
                              : "GC_field GC_card_input"
                          }
                          type="number"
                          min={0}
                          value={this.state.giftCardAmount}
                          onChange={e => {
                            this.setState({
                              giftCardAmount: e.target.value
                            });
                            delete errors.giftCardAmount;
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {errors.giftCardAmount && (
                    <div
                      className="GC_form_error"
                      style={{ textAlign: "center" }}
                    >
                      {errors.giftCardAmount}
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="row GC_formrow">
            <div className="">
              <div className="row GC_radiorow">
                <RadioGroup
                  onChange={e => {
                    this.setState({ giftCardType: e.target.value });
                  }}
                  value={this.state.giftCardType}
                >
                  <div className="col-md-6">
                    <Radio value={1}>Email me the details</Radio>
                  </div>
                  <div className="col-md-6">
                    <Radio value={2}>Send as a gift to someone</Radio>
                  </div>
                </RadioGroup>
              </div>

              <div>
                {/* Your self - Message */}
                {this.state.giftCardType === 1 && (
                  <div className="rowspace GC_message">
                    This gift card will be sent to {user && user.email}. Please
                    check your email for a copy of this gift card.
                  </div>
                )}
                {/* Your self - Message */}

                {/* Form */}
                <div className="GC_form">
                  {this.state.giftCardType === 2 && (
                    <div>
                      <div className="GC_fieldrow">
                        <Input
                          placeholder="Receiver’s email address"
                          className={
                            errors.receiverEmail ? "GC_field error" : "GC_field"
                          }
                          onChange={e => {
                            this.setState({ receiverEmail: e.target.value });
                            delete errors.receiverEmail;
                          }}
                          value={this.state.receiverEmail}
                        />
                        {errors.receiverEmail && (
                          <div className="GC_form_error">
                            {errors.receiverEmail}
                          </div>
                        )}
                      </div>
                      <div className="GC_fieldrow">
                        <TextArea
                          placeholder="Type your gift message"
                          autosize={{ minRows: 1, maxRows: 10 }}
                          className={
                            errors.giftMessage ? "GC_field error" : "GC_field "
                          }
                          onChange={e => {
                            this.setState({ giftMessage: e.target.value });
                            delete errors.giftMessage;
                          }}
                          value={this.state.giftMessage}
                        />
                        {errors.giftMessage && (
                          <div className="GC_form_error">
                            {errors.giftMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rowspace">
                    <Checkbox
                      onChange={e => {
                        this.setState({ declareStatus: e.target.checked });
                        delete errors.declareStatus;
                      }}
                      checked={this.state.declareStatus}
                    >
                      <span className="disclaimertxt">
                        By purchasing this gift card you accept the{" "}
                        <a
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.toggleModel(4);
                          }}
                        >
                          Terms and Conditions
                        </a>{" "}
                        as published on this site.
                      </span>
                    </Checkbox>
                    {errors.declareStatus && (
                      <div className="GC_form_error">
                        {errors.declareStatus}
                      </div>
                    )}
                  </div>

                  <div className="rowspace">
                    <button
                      type="button"
                      className="btn page-newbtn-submit"
                      onClick={this.validateForm}
                    >
                      {" "}
                      Purchase{" "}
                    </button>
                  </div>
                </div>
                {/* Form */}
              </div>
            </div>
          </div>
          {/* Page Body */}

          <ModalPopUp
            isOpen={this.state.showConfirmation}
            onRequestClose={() => this.toggleModel(1)}
            shouldCloseOnOverlayClick={true}
            contentLabel="model purchase"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="SC_popup">
              <div className="del_icon">
                <span
                  className="icon-cancel"
                  onClick={() => this.toggleModel(1)}
                />
              </div>

              <div className="SC_pop_wrapper">
                <div>
                  <div className="header_second">
                    Total amount of{" "}
                    <strong>
                      {giftCardAmtType &&
                        "$" +
                          parseFloat(this.setAmount(giftCardAmtType)).toFixed(
                            2
                          )}
                    </strong>{" "}
                    will be withdrawn from your card{" "}
                    <strong>{user && user.credit_card}</strong>
                  </div>
                  <div className="btn">
                    <div className="row">
                      <div className="col-md-6 col-md-push-6">
                        <div className="popbtn">
                          <button
                            type="button"
                            className="btn SC_btn SC_btn_submit"
                            onClick={() => this.handleSubmit()}
                            disabled={this.state.paying ? true : false}
                          >
                            {this.state.paying && (
                              <PreloaderIcon
                                style={{ paddingRight: "5px" }}
                                loader={Oval}
                                size={20}
                                strokeWidth={8} // min: 1, max: 50
                                strokeColor="#fff"
                                duration={800}
                              />
                            )}
                            {this.state.paying ? "PAYING" : "PAY"}
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6 col-md-pull-6">
                        <div className="popbtn">
                          <button
                            type="button"
                            className="btn SC_btn SC_btn_withdraw"
                            onClick={() => this.toggleModel(1)}
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="btn">
                    <a
                      className="SC_btn_add"
                      onClick={() => this.toggleModel(5)}
                    >
                      <img src="/images/support-center/create_icon.svg" />
                      ADD ANOTHER CARD
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ModalPopUp>

          <ModalPopUp
            isOpen={this.state.showSuccess}
            onRequestClose={() => this.toggleModel(2)}
            shouldCloseOnOverlayClick={true}
            contentLabel="reason to decline"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            {/* ---------------------- Sucess Message ----------------------- */}
            <div className="SC_popup GC_form">
              <div className="del_icon">
                <span
                  className="icon-cancel"
                  onClick={() => this.toggleModel(2)}
                />
              </div>
              <div className="icon">
                <img src="/images/checkout/success-icon-green.png" />
              </div>
              <div className="header">
                {this.state.message && this.state.message}
              </div>
              <div className="desc">
                Please check your email for more information.
              </div>
            </div>
          </ModalPopUp>

          <ModalPopUp
            isOpen={this.state.showTermsAndConditions}
            onRequestClose={() => this.toggleModel(4)}
            shouldCloseOnOverlayClick={true}
            contentLabel="terms and conditions"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            {/* ---------------------- Terms & Conditions ----------------------- */}
            <div className="SC_popup GC_form">
              <div className="del_icon">
                <span
                  className="icon-cancel"
                  onClick={() => this.toggleModel(4)}
                />
              </div>
              <div className="header">Terms & Conditions</div>
              <div className="desc justfy">
                The recipient of this gift card must be subject to further
                identity verification and approval as a responsible driver in
                order to successfully rent a Ryde. In the case of disapproval,
                the gift card may be used by another person. This gift card is
                valid for 6 months from the date of purchase and must be
                redeemed before the expiration date. Age Requirement: Minimum 21
                years of age to rent and 30+ years of age for all exotic cars.
              </div>
            </div>
          </ModalPopUp>

          <ModalPopUp
            isOpen={this.state.showCardDecline}
            onRequestClose={() => this.toggleModel(3)}
            shouldCloseOnOverlayClick={true}
            contentLabel="card decline"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            {/* ---------------------- Card Decline Message ----------------------- */}
            <div className="SC_popup GC_form">
              <div className="del_icon">
                <span className="icon-cancel" />
              </div>
              <div className="icon">
                <img src="/images/support-center/decline-icon.svg" />
              </div>
              <div className="header">
                {/* Unfortunately your card didn’t go through. */}
                {this.state.message}
              </div>
              <div className="desc">Please add another card to continue.</div>
              <div className="btn">
                <a
                  className="SC_btn_add"
                  onClick={() => {
                    this.toggleModel(5);
                    this.setState({ showCardDecline: false });
                  }}
                >
                  <img src="/images/support-center/create_icon.svg" />
                  ADD ANOTHER CARD
                </a>
              </div>
            </div>
          </ModalPopUp>

          <ModalPopUp
            className="coupon-modal Credit_poup_wrapper"
            isOpen={this.state.showAddCreditCard}
            onRequestClose={() => this.toggleModel(5)}
            contentLabel="add another card"
            shouldCloseOnOverlayClick={true}
            style={modalStylesBooking}
          >
            <StripePaymentForm
              usStates={usStates}
              addNewCreditCard={() => {
                this.setState({
                  showAddCreditCard: false,
                  showCardUpdatedPopUp: true
                });
              }}
              type={"PROFILE"}
              closeModal={() => {
                this.setState({ showAddCreditCard: false });
              }}
            />
          </ModalPopUp>

          <ModalPopUp
            isOpen={this.state.showCardUpdatedPopUp}
            onRequestClose={() => this.toggleModel(6)}
            shouldCloseOnOverlayClick={true}
            contentLabel="success"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="SC_popup">
              <div className="del_icon">
                <span
                  className="icon-cancel"
                  onClick={() => this.toggleModel(6)}
                />
              </div>
              <div className="icon">
                <img src="/images/checkout/success-icon-green.png" />
              </div>
              <div className="header">
                New card has been updated <br />
                to your account
              </div>
              <div className="btn">
                <button
                  className="btn SC_btn SC_btn_submit"
                  onClick={() => {
                    this.toggleModel(6);
                    this.setState({ showConfirmation: true });
                  }}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </ModalPopUp>

          <ModalPopUp
            isOpen={this.state.showModelLogin}
            onRequestClose={() => this.toggleModel(7)}
            shouldCloseOnOverlayClick={true}
            contentLabel="Login"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <UserAuthModel
              stack={"checkout"}
              closeModel={() => {
                this.toggleModel(7);
              }}
            />
          </ModalPopUp>
        </div>

        <Suspense fallback={<PreLoader />}>
          <MainFooter />
        </Suspense>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    usStates: state.car.usStates,
    user: state.user.user,
    authenticated: state.user.authenticated,
    timeZoneId: state.common.timeZoneId
  };
};

export default connect(mapStateToProps)(GiftCards);
