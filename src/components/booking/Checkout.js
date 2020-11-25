import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { withCookies } from "react-cookie";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import queryString from "query-string";
import moment from "moment";
import { getBookingData } from "../../actions/BookingActions";
import { getLoggedInUser } from "../../actions/UserActions";
import { GET_BOOKING_DATA } from "../../actions/ActionTypes";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import { Select } from "antd";
import CalenderModel from "../car/CalenderModel";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import Tooltip from "../tooltips/Tooltip";
import { LazyImage } from "../comman";
import TermsConditionCheckbox from "./TermsConditonCheckbox";
import "antd/lib/select/style/index.css";
import ReactPixel from "react-facebook-pixel";
import { PRODUCT_CATALOG_ID } from "../../consts/consts";
import { postGtag } from "../../api/googleServices";
import { authFail } from "../../actions/AuthAction";

Modal.setAppElement("#root");

const Option = Select.Option;

class Checkout extends Component {
  constructor(props) {
    super(props);
    const searchParams = queryString.parse(props.history.location.search);

    this.state = {
      showCalender: false,
      couponCode:
        searchParams && searchParams.couponCode ? searchParams.couponCode : "",
      selectedValue: "",
      showBookingReview: false,
      error: false,
      success: false,
      message: "",
      booking_id: null,
      addPromo: searchParams && searchParams.couponCode ? true : false,
      paymentSuccess: false,
      isCouponCodeRequired: false,
      invalidCoupon: false,
      submitting: false,
      selectedCard: null,
      checkedTermsAndConditions: false
    };
    this.setCouponCode = this.setCouponCode.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.removeCouponCode = this.removeCouponCode.bind(this);
  }

  componentDidMount() {
    const { bookingData, user } = this.props;
    if (bookingData.applied_coupon_code) {
      this.setState({
        couponCode: bookingData.applied_coupon_code,
        addPromo: true
      });
    }
    const dfCd = user.credit_card_details.find(({ status }) => {
      return status == 1;
    });

    if (dfCd) {
      this.setState({ selectedCard: dfCd.id });
    }
    setTimeout(() => {
      this.notifyToAdmin(3);
    }, 180000);
  }

  componentWillReceiveProps(nextProps) {
    const { bookingData } = nextProps;
    if (
      this.props.bookingData.applied_coupon_code !==
      bookingData.applied_coupon_code
    ) {
      if (bookingData.applied_coupon_code) {
        this.setState({
          couponCode: bookingData.applied_coupon_code,
          addPromo: true
        });
      }
    }

    if (
      this.props.bookingData.coupon_error !== nextProps.bookingData.coupon_error
    ) {
      if (
        bookingData.coupon_apply &&
        !bookingData.coupon_use &&
        this.state.couponCode
      ) {
        this.setState({ invalidCoupon: true }, () => {
          setTimeout(() => {
            this.setState({ invalidCoupon: false, couponCode: "" });
          }, 6000);
        });
      } else {
        this.setState({
          invalidCoupon: false
        });
      }
    } else if (
      this.props.bookingData.coupon_error == nextProps.bookingData.coupon_error
    ) {
      if (
        bookingData.coupon_apply &&
        !bookingData.coupon_use &&
        this.state.couponCode
      ) {
        this.setState({ invalidCoupon: true }, () => {
          setTimeout(() => {
            this.setState({ invalidCoupon: false, couponCode: "" });
          }, 6000);
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (user.id && prevProps.user) {
      if (prevProps.user.credit_card_details !== user.credit_card_details) {
        const dfCd = user.credit_card_details.find(({ status }) => {
          return status == 1;
        });
        if (dfCd) {
          this.setState({ selectedCard: dfCd.id });
        }
      }
    }
  }

  _toggleModal = () =>
    this.setState({ showCalender: !this.state.showCalender });

  notifyToAdmin = async time => {
    const { timeZoneId } = this.props;
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "waiting",
        { time: time, page: "CONFIRM AND PAY", category: "pay", timeZoneId },
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
  handleCloseModal() {
    this.setState({ showBookingReview: false });
    if (this.state.booking_id) {
      this.props.history.push(`/booking/${this.state.booking_id}`);
    }
  }

  setCouponCode() {
    const {
      dispatch,
      bookingData,
      latitude,
      longitude,
      delivery_location,
      fromDate,
      toDate,
      history
    } = this.props;
    this.state.couponCode === ""
      ? this.setState({ isCouponCodeRequired: true })
      : this.setState({ isCouponCodeRequired: "" });

    if (this.state.couponCode) {
      const filterdData = {
        from_date: fromDate,
        to_date: toDate,
        car_id: bookingData.car_id,
        coupon_code: this.state.couponCode,
        delivery_location: delivery_location,
        latitude: latitude,
        longitude: longitude,
        car_coverage_level: localStorage.carCoverageLevel
          ? localStorage.carCoverageLevel
          : 1,
        timeZoneId: this.props.timeZoneId
      };
      const searchParams = queryString.parse(history.location.search);
      searchParams.couponCode = this.state.couponCode;
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(searchParams)
      });
      if (
        searchParams.dr_location &&
        searchParams.dr_lat &&
        searchParams.dr_lng
      ) {
        filterdData.dropoff_location = searchParams.dr_location;
        filterdData.dropoff_latitude = searchParams.dr_lat;
        filterdData.dropoff_longitude = searchParams.dr_lng;
        filterdData.is_offer_dropoff = true;
      }
      dispatch(getBookingData(filterdData));
    }
  }
  removeCouponCode() {
    const {
      dispatch,
      bookingData,
      latitude,
      longitude,
      delivery_location,
      fromDate,
      toDate,
      history
    } = this.props;

    this.setState({ couponCode: "", addPromo: false });
    const filterdData = {
      from_date: fromDate,
      to_date: toDate,
      car_id: bookingData.car_id,
      delivery_location: delivery_location,
      latitude: latitude,
      longitude: longitude,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: this.props.timeZoneId
    };

    if (bookingData.applied_coupon_code) {
      filterdData.coupon_removed = true;
    }

    const searchParams = queryString.parse(history.location.search);
    if (
      searchParams.dr_location &&
      searchParams.dr_lat &&
      searchParams.dr_lng
    ) {
      filterdData.dropoff_location = searchParams.dr_location;
      filterdData.dropoff_latitude = searchParams.dr_lat;
      filterdData.dropoff_longitude = searchParams.dr_lng;
      filterdData.is_offer_dropoff = true;
    }
    if (searchParams.couponCode) {
      delete searchParams.couponCode;
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify(searchParams)
      });
    }

    dispatch(getBookingData(filterdData));
  }

  errors() {
    const { user, bookingData } = this.props;

    if (
      user &&
      user.id &&
      user.user_can_add_booking["renting_status"] === false
    ) {
      return (
        <div className="row">
          <div className="invoice-row clearfix">
            <div className="col-md-12 pad-remove-left pad-remove-right">
              <div className="messages-wrapper">
                <div className="notification error-message">
                  <div className="notification-inner">
                    <img
                      className="img-responsive pic"
                      src="/images/checkout/exclamation-icon-red.png"
                      alt="Image-icon"
                    />
                    <span className="error-notification-cap-lg">
                      {user.user_can_add_booking["renting_message"]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (bookingData && bookingData.car_availability == false) {
      return (
        <div className="row">
          <div className="invoice-row clearfix">
            <div className="col-md-12 pad-remove-left pad-remove-right">
              <div className="messages-wrapper">
                <div className="notification error-message">
                  <div className="notification-inner">
                    <LazyImage
                      className="img-responsive pic"
                      src="/images/checkout/exclamation-icon-red.png"
                      alt="Image - icon"
                    />
                    <span className="error-notification-cap-lg">
                      {bookingData.availability_message &&
                        bookingData.availability_message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.error) {
      return (
        <div className="row">
          <div className="invoice-row clearfix">
            <div className="col-md-12 pad-remove-left pad-remove-right">
              <div className="messages-wrapper">
                <div className="notification error-message">
                  <div className="notification-inner">
                    <LazyImage
                      className="img-responsive pic"
                      src="/images/checkout/exclamation-icon-red.png"
                      alt="Image"
                    />
                    <span className="error-notification-cap-lg">
                      {this.state.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  selectCreditCard = () => {
    const { user } = this.props;
    if (user.credit_card_details) {
      return user.credit_card_details.map(item => {
        let iconPath = "";
        if (item.type === "Visa") {
          iconPath = "/images/profilev2/card-visa.svg";
        } else if (item.type === "Amex") {
          iconPath = "/images/profilev2/card-amex.svg";
        } else if (item.type === "Mastercard") {
          iconPath = "/images/profilev2/master-icon.png";
        } else if (item.type === "American Express") {
          iconPath = "/images/profilev2/american-express-icon.png";
        } else if (item.type === "JCB") {
          iconPath = "/images/profilev2/jcb-icon.png";
        } else if (item.type === "Discover") {
          iconPath = "/images/profilev2/discover-icon.png";
        } else if (item.type === "Diners Club") {
          iconPath = "/images/profilev2/dinners-club-icon.png";
        } else {
          iconPath = "/images/profilev2/card-visa.svg";
        }
        return (
          <Option
            value={item.id}
            className="credit-cards-dropdown-item"
            key={item.id}
          >
            <img src={iconPath} />
            {item.number}
          </Option>
        );
      });
    }
  };

  addBooking = async couponCode => {
    const {
      dispatch,
      car,
      fromDate,
      toDate,
      delivery_location,
      latitude,
      longitude,
      freeDeliveryLocationId,
      cookies,
      history
    } = this.props;
    if (this.state.submitting === true) {
      return false;
    }
    this.setState({ submitting: true });

    ReactPixel.track("Purchase", {
      content_name: car.name,
      content_ids: car.id,
      content_type: "product",
      value: parseFloat(car.daily_rate).toFixed(2),
      currency: "USD",
      contents: [{ ids: car.id, quantity: 1 }],
      product_catalog_id: PRODUCT_CATALOG_ID
    });
    try {
      const bookingData = {
        car_id: car.id,
        from_date: fromDate,
        to_date: toDate,
        car_coverage_level: localStorage.carCoverageLevel
          ? localStorage.carCoverageLevel
          : 1,
        timeZoneId: this.props.timeZoneId,
        card_id:
          this.state.selectedCard != null ? this.state.selectedCard : null,
        delivery_option: this.props.bookingData.delivery_option,
        offer_delivery: this.props.bookingData.offer_delivery
      };
      if (delivery_location) {
        bookingData.delivery_location = delivery_location;
        bookingData.latitude = latitude;
        bookingData.longitude = longitude;
      }
      if (freeDeliveryLocationId) {
        if (freeDeliveryLocationId != 0) {
          bookingData.free_delivery_location_id = freeDeliveryLocationId;
        }
      }
      if (couponCode) {
        bookingData.coupon_code = couponCode;
      }

      /** Drop off data */

      const searchParams = queryString.parse(history.location.search);

      if (
        searchParams.dr_location &&
        searchParams.dr_lat &&
        searchParams.dr_lng
      ) {
        bookingData.dropoff_location = searchParams.dr_location;
        bookingData.dropoff_latitude = searchParams.dr_lat;
        bookingData.dropoff_longitude = searchParams.dr_lng;
        bookingData.is_offer_dropoff = true;
      }
      if (searchParams.dropoff_same_as_delivery) {
        if (searchParams.dropoff_same_as_delivery == "true") {
          bookingData.dropoff_same_as_delivery = true;
        } else {
          bookingData.dropoff_same_as_delivery = false;
        }
      }
      /** Google analytics code  */
      if (cookies && cookies.cookies && cookies.cookies._ga) {
        bookingData.ga_id = cookies.cookies._ga;
      }

      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "bookings/",
        bookingData,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );

      if (!response.data.error) {
        localStorage.removeItem("__tripDurationData");
        this.setState(
          {
            paymentSuccess: true,
            submitting: false,
            booking_id: response.data.booking.id
          },
          () => {
            postGtag(
              response.data.booking.amount_charged,
              response.data.booking.number
            );
          }
        );
        dispatch(getLoggedInUser(false));
        let path = window.location.pathname;
        dispatch({
          type: GET_BOOKING_DATA,
          payload: {
            item_price: null,
            delivery_charge: null,
            amount_charged: null,
            tax_amount: null,
            tax: null,
            car_coverage_level: 1,
            car_coverage_amount: null,
            car_availability: true
          }
        });
      }
    } catch (error) {
      console.log("error", error);
      this.props.dispatch(authFail(error));
      if (error.response) {
        this.setState({
          error: true,
          submitting: false,
          message: error.response.data.message
        });
      }
    }
  };

  setPriceBreakDownLink = () => {
    const { bookingData } = this.props;
    if (
      bookingData.item_price_break_down &&
      bookingData.item_price_break_down.length
    ) {
      return <a onClick={() => this._toggleModal("price-calender")}>View</a>;
    } else {
      return null;
    }
  };

  render() {
    const {
      fromDate,
      toDate,
      bookingData,
      user,
      carCoverageLevels,
      history
    } = this.props;
    const invalidCoupon = this.state.invalidCoupon;

    const { checkedTermsAndConditions, selectedCard } = this.state;

    return (
      <div className="confirm-pay-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="page-sub-title">
              Please confirm your payment information and pay
            </div>
          </div>
        </div>
        {bookingData ? (
          <Fragment>
            {bookingData.daily_rate_per_day ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      Daily rate {this.setPriceBreakDownLink()}
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      $ {bookingData.daily_rate_per_day}/day
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {bookingData.car_coverage_amount ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      Car Coverage
                      <Tooltip>
                        <div style={{ marginBottom: "10px" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#000",
                              fontFamily: "Poppins"
                            }}
                          >
                            {carCoverageLevels.length > 0 &&
                              carCoverageLevels[0].title}
                          </div>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#999999",
                              fontFamily: "Poppins"
                            }}
                          >
                            {carCoverageLevels.length > 0 &&
                              carCoverageLevels[0].description}
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      $ {bookingData.car_coverage_amount_per_day}/day
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {bookingData.is_service_fee_per_day_show &&
            bookingData.service_fee_per_day &&
            bookingData.service_fee_per_day != 0.0 ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      Service fee
                      <Tooltip>
                        <div style={{ marginBottom: "10px" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#000",
                              fontFamily: "Poppins"
                            }}
                          >
                            Service fee
                          </div>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "500",
                              color: "#999999",
                              fontFamily: "Poppins"
                            }}
                          >
                            This fee helps us keep our community highly secure
                            and provide services like customer support to you.
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      $ {bookingData.service_fee_per_day}/day
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {bookingData.young_driver_fee_per_day != "0.00" ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">Young Driver Fee</div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      $ {bookingData.young_driver_fee_per_day}/day
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {bookingData.total_per_day ? (
              <div className="row row-seperate">
                <div className="invoice-solid-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      <strong>Total per day</strong>
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      <strong> $ {bookingData.total_per_day}/day </strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {bookingData.number_of_dates && bookingData.total_trip_price ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      Total {bookingData.number_of_dates} day trip price
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      $ {bookingData.total_trip_price}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {bookingData.isDelivery === true ||
            bookingData.isDropOff === true ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">Delivery fee</div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      {bookingData.total_delivery_amount == 0 ? (
                        "Free"
                      ) : (
                        <Fragment>
                          $ {bookingData.total_delivery_amount}
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {bookingData.discount_amount > 0 ? (
              <div className="row">
                <div className="invoice-row clearfix">
                  <div className="col-xs-8 pad-remove-left">
                    <div className="cp-text">
                      Discount ({bookingData.car_discount} %)
                    </div>
                  </div>
                  <div className="col-xs-4 text-right pad-remove-right">
                    <div className="cp-text">
                      - $ {bookingData.discount_amount}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {bookingData.coupon_use && this.state.couponCode && (
              <div className="row promo-deduc">
                <div className="col-xs-8">
                  <div className="cp-text">Promotional Deduction</div>
                </div>
                <div className="col-xs-4 text-right">
                  <div className="cp-text">
                    - $ {bookingData.coupon_amount}{" "}
                  </div>
                </div>
              </div>
            )}
            {bookingData.total_ref_deduct != "0.00" && !bookingData.coupon_use && (
              <div className="row promo-deduc">
                <div className="col-xs-8">
                  <div className="cp-text">Car credit</div>
                </div>
                <div className="col-xs-4 text-right">
                  <div className="cp-text">
                    - $ {bookingData.total_ref_deduct}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="invoice-row clearfix">
                {/* Promo Code: */}
                <div className="row">
                  <div className="col-xs-12">
                    {!this.state.addPromo ? (
                      <button
                        className="btn add-new-btn"
                        onClick={() => this.setState({ addPromo: true })}
                      >
                        <span>
                          <LazyImage
                            className="img-responsive"
                            src="/images/checkout/add-new.png"
                          />
                        </span>
                        Add promo code
                      </button>
                    ) : (
                      <div className="row">
                        <div className="col-xs-12 col-sm-5">
                          <div className="input-group custom-search-form">
                            <input
                              type="text"
                              name="couponCode"
                              autoComplete="off"
                              placeholder="PROMO CODE"
                              className="form-control couponCode-input"
                              value={this.state.couponCode}
                              onChange={e => {
                                this.setState({
                                  couponCode: e.target.value,
                                  isCouponCodeRequired: false
                                });
                              }}
                              disabled={bookingData.coupon_use ? true : false}
                            />
                            <span className="input-group-btn">
                              <button
                                className="btn btn-apply"
                                type="button"
                                onClick={() => {
                                  !bookingData.coupon_use
                                    ? this.setCouponCode()
                                    : this.removeCouponCode();
                                }}
                              >
                                <a>
                                  {" "}
                                  {!bookingData.coupon_use
                                    ? "Apply"
                                    : "Remove"}{" "}
                                </a>
                              </button>
                            </span>
                          </div>
                        </div>
                        {invalidCoupon && (
                          <div className="col-xs-12 col-sm-7">
                            <div className="messages-wrapper checkout-error-promo">
                              <div className="notification error-message">
                                <div className="notification-inner">
                                  <LazyImage
                                    className="img-responsive pic"
                                    src="/images/checkout/exclamation-icon-red.png"
                                    alt="Image"
                                  />
                                  <span className="error-notification-cap-lg">
                                    {bookingData.coupon_error}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {this.state.isCouponCodeRequired && (
                          <div className="col-xs-12 col-sm-5">
                            <div className="messages-wrapper">
                              <div className="notification error-message">
                                <div className="notification-inner">
                                  <LazyImage
                                    className="img-responsive pic"
                                    src="/images/checkout/exclamation-icon-red.png"
                                    alt="Image"
                                  />
                                  <span className="error-notification-cap-lg">
                                    Coupon code cannot be empty.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-seperate total-row">
              <div className="invoice-row total-row clearfix">
                <div className="col-xs-8 pad-remove-left">
                  <div className="cp-text">
                    <strong>Trip total</strong>
                  </div>
                </div>
                <div className="col-xs-4 total-col text-right pad-remove-right">
                  <div className="cp-text">
                    <strong>$ {bookingData.amount_charged}</strong>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : null}
        <div className="row creditcard-section">
          <div className="invoice-row credit-card-rowset clearfix">
            <div className="credit-card-row">
              <div className="cp-text">Credit card number</div>
              <div>
                {user.credit_card_details &&
                user.credit_card_details.length > 1 ? (
                  <Select
                    className="credit-cards-dropdown"
                    optionFilterProp="children"
                    value={selectedCard}
                    onChange={e => {
                      this.setState({
                        selectedCard: e,
                        error: false,
                        message: ""
                      });
                    }}
                  >
                    {this.selectCreditCard()}
                  </Select>
                ) : (
                  <div className="cp-text">
                    {user.credit_card_details &&
                      user.credit_card_details.map((i, key) => {
                        return (
                          i.status == 1 && <div key={key}>({i.number})</div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <div className="col-xs-12 pad-remove-left pad-remove-right">
              <div className="row add-new-card-wrapper">
                <div className="col-xs-8">
                  <button
                    className="btn add-new-btn"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      this.props.addNewCreditCard(true);
                    }}
                  >
                    <span>
                      <LazyImage
                        className="img-responsive"
                        src="/images/checkout/add-new.png"
                      />
                    </span>
                    Add a new credit card
                  </button>
                </div>
                <div className="col-xs-4 text-right">
                  <div className="credit-cards-wrapper">
                    <LazyImage
                      className="img-responsive"
                      width="150px"
                      src={
                        "https://cdn.rydecars.com/Eranda/Credit+card+logos.jpeg"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row accept-terms">
          <div className="invoice-row">
            <TermsConditionCheckbox
              onChange={e => {
                this.setState({
                  checkedTermsAndConditions: e
                });
              }}
              value={checkedTermsAndConditions}
            />
          </div>
        </div>

        {this.errors()}
        {/* Bottom buttons - Start */}
        <div className="checkout-buttons-wrapper">
          <div className="flex-container">
            <button
              className="checkout-buttons back-btn"
              onClick={() => {
                history.push("/");
              }}
            >
              Cancel
            </button>
            <button
              className={
                invalidCoupon ||
                !checkedTermsAndConditions ||
                user.user_can_add_booking["renting_status"] === false
                  ? "checkout-buttons submit-btn-preloder-wrapper continue-btn btn-continue-disabled"
                  : "checkout-buttons submit-btn-preloder-wrapper continue-btn "
              }
              onClick={() => this.addBooking(this.state.couponCode)}
              disabled={
                invalidCoupon ||
                !checkedTermsAndConditions ||
                user.user_can_add_booking["renting_status"] === false
              }
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
              PAY
            </button>
          </div>
        </div>
        {/* Bottom buttons - End */}
        {/*Price Calender Popup*/}
        {this.state.showCalender == true && (
          <Modal
            isOpen={this.state.showCalender}
            onRequestClose={() => this.setState({ showCalender: false })}
            shouldCloseOnOverlayClick={true}
            contentLabel="Price Calender"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="share-this-car-popup checkout-popup">
              <div className="close-popup">
                <span
                  className="icon-cancel"
                  onClick={() => this.setState({ showCalender: false })}
                />
              </div>
              <CalenderModel
                itemPriceBreakDown={bookingData.item_price_break_down}
                startDate={moment(fromDate, "YYYY-MM-DD HH:mm").format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(toDate, "YYYY-MM-DD HH:mm").format(
                  "YYYY-MM-DD"
                )}
              />
            </div>
          </Modal>
        )}

        <Modal
          isOpen={this.state.paymentSuccess}
          onRequestClose={this.handleCloseModalLarge}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="payment-success-popup checkout-popup">
            <img
              className="img-responsive success"
              src="/images/checkout/success-icon-green.png"
            />
            <div className="ps-title">Payment success</div>
            <p>
              Your payment of $ {bookingData.amount_charged} was successfully
              completed
            </p>
            {this.state.booking_id && (
              <button
                className="checkout-buttons continue-btn"
                onClick={() => {
                  history.push(`/booking/${this.state.booking_id}/new`);
                }}
              >
                CONTINUE
              </button>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}
export default withRouter(withCookies(Checkout));
