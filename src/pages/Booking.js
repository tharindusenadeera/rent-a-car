import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Rating from "react-rating";
import Modal from "react-modal";
import Image from "react-shimmer";
import queryString from "query-string";
import {
  TRIP_IS_CANCELED,
  TRIP_IS_PENDING,
  TRIP_IS_CONFIRM,
  TRIP_IS_ONTRIP,
  TRIP_IS_END,
  TRIP_IS_PROCESSING
} from "../consts/consts";
import {
  imageModel,
  defaultModelPopup,
  defaultMobileModelPopup
} from "../consts/consts";
import { fetchAdvancePrice, getCarCoverageLevels } from "../actions/CarActions";
import axios from "axios";
import moment from "moment-timezone";
import TripChangeForm from "../components/booking/TripChangeForm";
import Receipt from "../components/booking/Receipt";
import ExperienceForm from "../components/experience/ExperienceForm";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RatingForm from "../components/rating/RatingForm";
import checkAuth from "../components/requireAuth";
import checkPermission from "../components/requirePermission";
import { fetchRatingCategories } from "../actions/UserActions";
import ViewRequest from "../components/extracharges/ViewRequest";
import ExtrachargeForm from "../components/extracharges/ExtrachargeForm";
import { ConfirmationButton } from "../components/comman";
import { bookingReview } from "../actions/BookingActions";
import { isMobileOnly } from "react-device-detect";
import MainNav from "../components/layouts/MainNav";
import MainFooter from "../components/layouts/MainFooter";
import PreLoader from "../components/preloaders/preloaders";
import CheckoutPhotos from "../components/booking/CheckoutPhotos";
import { ACCESSDENIED } from "../actions/ActionTypes";
import { authFail } from "../actions/AuthAction";

Modal.setAppElement("#root");

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booking: null,
      showModal: false,
      modelView: "",
      showExperincesModal: false,
      img: "",
      error: false,
      errorMessage: "",
      selectedIndex: 0,
      showBookingRate: false
    };
  }

  componentWillMount() {
    this.fetchBooking();
    this.props.dispatch(fetchRatingCategories());
    this.props.dispatch(getCarCoverageLevels());
    this.getDefaltActivationKey();
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.status == "new") {
      setTimeout(() => {
        this.setState({ showBookingRate: true });
      }, 2000);
    }
  }

  componentDidUpdate(prevProps) {
    const { unreadTabData } = this.props;

    if (unreadTabData != prevProps.unreadTabData) {
      this.fetchBooking(false);
      this.getDefaltActivationKey();
    }

    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchBooking();
    }
  }

  _toggleModal = (modelView = null) =>
    this.setState({ showModal: !this.state.showModal, modelView: modelView });

  _loadingUp = () => this.setState({ submitting: true });
  _loadingDwon = () => this.setState({ submitting: false });

  fetchBooking = async (loading = true) => {
    try {
      loading && this._loadingUp();
      const { dispatch, match } = this.props;
      const response = await await axios.get(
        process.env.REACT_APP_API_URL + "bookings/" + match.params.id,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.setState({ booking: response.data.booking }, state => {
          this._loadingDwon();
        });
        dispatch({ type: ACCESSDENIED, payload: false });
        dispatch(
          fetchAdvancePrice(
            response.data.booking.car.id,
            response.data.booking.id
          )
        );
      }
    } catch (error) {
      const { dispatch } = this.props;
      this._loadingDwon();
      this.props.dispatch(authFail(error));
      if (
        error.response &&
        error.response.data &&
        error.response.data.status_code === 403
      ) {
        dispatch({ type: ACCESSDENIED, payload: true });
      }

      if (error.response) {
        this.setState(
          { error: true, errorMessage: error.response.data.message },
          () => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 5000);
          }
        );
      }
    }
  };

  confirmBooking = async id => {
    try {
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "bookings/confirm/",
        { bookingId: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.error) {
        this.setState({ booking: response.data.booking });
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState(
        {
          submitting: false,
          error: true,
          errorMessage: error.response.data.message
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  cancelBooking = async id => {
    try {
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "bookings/cancel",
        { bookingId: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.error) {
        this.setState({ booking: response.data.booking });
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({ submitting: false });
      this.setState(
        { error: true, errorMessage: error.response.data.message },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  setButton() {
    const { booking } = this.state;
    const { history } = this.props;
    if (booking) {
      return (
        <div className="buttons-wrap">
          {booking.btn.btn_confirm && (
            <ConfirmationButton
              buttonText="Confirm Trip"
              confirmationTitle="Are you sure to confirm this booking?"
              className="bt-button main-btn"
              onClick={() => this.confirmBooking(booking.id)}
            />
          )}
          {booking.btn.btn_checkout && (
            <div className="bookchng_submit">
              <button
                className="bt-button main-btn"
                onClick={() => {
                  history.push(`/booking-checkout/${booking.id}`);
                }}
              >
                Checkout
              </button>
            </div>
          )}
          {booking.btn.btn_edit && (
            <div className="bookchng_submit">
              <button
                className="bt-button main-btn"
                onClick={() => this._toggleModal("tripChange")}
              >
                Change Trip
              </button>
            </div>
          )}
          {booking.btn.btn_decline && (
            <ConfirmationButton
              buttonText="Cancel Trip"
              confirmationTitle="Are you sure to cancel this request?"
              className="bt-button cancel-btn"
              onClick={() => this.cancelBooking(booking.id)}
            />
          )}
          {booking.btn.btn_cancel && (
            <ConfirmationButton
              buttonText="Cancel Trip"
              confirmationTitle="Are you sure to cancel this request?"
              className="bt-button cancel-btn"
              onClick={() => this.cancelBooking(booking.id)}
            />
          )}
        </div>
      );
    } else {
      return null;
    }
  }

  renderStatusIcon() {
    const { booking } = this.state;
    if (booking) {
      if (booking.status == TRIP_IS_PENDING) {
        return <span className="status pending">Pending</span>;
      } else if (booking.status == TRIP_IS_CONFIRM) {
        return <span className="status confirmed">Confirmed</span>;
      } else if (booking.status == TRIP_IS_ONTRIP) {
        return <span className="status ontrip">On Trip</span>;
      } else if (booking.status == TRIP_IS_END) {
        return <span className="status completed">Completed</span>;
      } else if (booking.status == TRIP_IS_CANCELED) {
        return <span className="status canceled">Canceled</span>;
      } else {
        return null;
      }
    }
  }

  getTotal = () => {
    const { booking } = this.state;
    if (booking) {
      if (booking.btn.user_type == "renter") {
        return booking.amount_charged;
      } else {
        return booking.car_owner_amount;
      }
    }
  };

  acceptChangeRequest = async id => {
    try {
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "booking-change/confirm",
        { booking_changed_id: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.error) {
        this.fetchBooking();
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState(
        {
          submitting: false,
          error: true,
          errorMessage: error.response.data.message
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  rejectChangeRequest = async id => {
    try {
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "booking-change/cancel",
        { booking_changed_id: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.error) {
        this.fetchBooking();
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState(
        {
          submitting: false,
          error: true,
          errorMessage: error.response.data.message
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  cancelChangeRequest = async id => {
    try {
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "booking-change/cancel/renter",
        { booking_changed_id: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.error) {
        this.fetchBooking();
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState(
        {
          submitting: false,
          error: true,
          errorMessage: error.response.data.message
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  getUrlDatObject = () => {
    const { booking } = this.state;
    const detailable_id = booking.id;
    const car_name = booking && booking.car.car_name;
    const from_date =
      booking && moment(booking.from_date, "YYYY-MM-DD HH:mm:ss");
    const to_date = booking && moment(booking.to_date, "YYYY-MM-DD HH:mm:ss");
    const number = booking.number;
    const car_photo = booking.car.car_photo[0].image_path;

    let participant_name, profile_image, profile_image_thumb;
    if (booking.btn.user_type == "renter") {
      profile_image_thumb = booking.car.car_owner.profile_image_thumb;
      profile_image = booking.car.car_owner.profile_image;
      participant_name = booking.car.car_owner.first_name;
    } else {
      profile_image_thumb = booking.user.profile_image_thumb;
      profile_image = booking.user.profile_image;
      participant_name = booking.user.first_name;
    }

    return {
      detailable_id,
      car_name,
      car_photo,
      from_date,
      id: null,
      number,
      to_date,
      participant_name,
      profile_image,
      profile_image_thumb
    };
  };

  makeUserSection = () => {
    const { booking } = this.state;
    if (booking) {
      if (booking.btn.user_type == "renter") {
        return (
          <div className="bt-right">
            <div className="car-owner-wrapper">
              <div className="car-owner-left">
                <Image
                  className="img-responsive img-circle"
                  src={booking.car.car_owner.profile_image_thumb}
                  alt="Image"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="car-owner-right">
                <div className="owner-name">
                  <Link to={"/profile/" + booking.car.user_id}>
                    <span className="bold-label">
                      {booking.car.car_owner.first_name}
                    </span>
                  </Link>
                </div>
                <div className="owner-since">
                  Member Since{" "}
                  {moment(booking.car.car_owner.created_at).format(
                    "MMMM - YYYY"
                  )}
                </div>
                {booking.car.car_owner.user_rating ? (
                  <div className="owner-rating">
                    <Rating
                      emptySymbol="fa fa-star-o fa-2x"
                      fullSymbol="fa fa-star fa-2x"
                      //fractions={2}
                      initialRating={parseInt(
                        booking.car.car_owner.user_rating
                      )}
                      readonly
                    />
                  </div>
                ) : null}
                <div className="owner-mesg">
                  <Link
                    className="owner-mesg-inner"
                    to={{
                      pathname: `/my-profile/message-center/${booking.id}`,
                      search: queryString.stringify(this.getUrlDatObject())
                    }}
                  >
                    <span className="icon-chat" />
                    <span>Message Owner</span>
                  </Link>

                  {booking.status != TRIP_IS_CANCELED &&
                    booking.status != TRIP_IS_PENDING && (
                      <div className="owner-mesg-inner phone-number" to="">
                        <img
                          src="/images/phone-call.png"
                          className="img-responsive"
                          alt="Image"
                        />
                        <a href={`tel:${booking.car.car_owner.phone_number}`}>
                          {booking.car.car_owner.phone_number}
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="bt-right">
            <div className="car-owner-wrapper">
              <div className="car-owner-left">
                <Image
                  className="img-responsive img-circle"
                  src={booking.user.profile_image_thumb}
                  alt="Image"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="car-owner-right">
                <div className="owner-name">
                  <Link to={"/profile/" + booking.user_id}>
                    <span className="bold-label">
                      {booking.user.first_name}
                    </span>
                  </Link>
                </div>
                <div className="owner-since">
                  Member Since{" "}
                  {moment(booking.user.created_at).format("MMMM - YYYY")}
                </div>
                {booking.user.user_rating ? (
                  <div className="owner-rating">
                    <Rating
                      emptySymbol="fa fa-star-o fa-2x"
                      fullSymbol="fa fa-star fa-2x"
                      fractions={2}
                      initialRating={parseInt(booking.user.user_rating)}
                      readonly
                    />
                  </div>
                ) : null}
                <div className="owner-mesg">
                  <Link
                    className="owner-mesg-inner"
                    to={{
                      pathname: `/my-profile/message-center/${booking.id}`,
                      search: queryString.stringify(this.getUrlDatObject())
                    }}
                  >
                    <span className="icon-chat" />
                    <span>Message Renter</span>
                  </Link>

                  {booking.status != TRIP_IS_CANCELED &&
                    booking.status != TRIP_IS_PENDING && (
                      <div className="owner-mesg-inner phone-number" to="">
                        <img
                          className="img-responsive"
                          src="../images/phone-call.svg"
                          alt="Image"
                        />
                        <a href={`tel:${booking.user.phone_number}`}>
                          {booking.user.phone_number}
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };

  _delivery = () => {
    const { booking } = this.state;
    if (!booking) {
      return false;
    }
    if (
      (booking.btn.user_type == "renter" &&
        booking.status != TRIP_IS_PENDING &&
        booking.status != TRIP_IS_PROCESSING) ||
      booking.delivery_location_method.type != "PICK UP LOCATION"
    ) {
      return (
        <div className="bt-car-info-sep">
          <div className="label-sm">
            <span className="bold-label">
              {booking.delivery_location_method.type}
            </span>
          </div>
          <p>{booking.delivery_location_method.location}</p>
        </div>
      );
    } else if (booking.btn.user_type != "renter") {
      return (
        <div className="bt-car-info-sep">
          <div className="label-sm">
            <span className="bold-label">
              {booking.delivery_location_method.type}
            </span>
          </div>
          <p>{booking.delivery_location_method.location}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  getNumberOfPendingExtraRequest = () => {
    const { booking } = this.state;
    if (booking && booking.tickets && booking.tickets.length > 0) {
      let result = booking.tickets.filter(ticket => {
        return ticket.status == 1;
      });
      return result.length;
    } else {
      return 0;
    }
  };

  temp(para) {
    this.props.dispatch(para);
  }

  getDefaltActivationKey = () => {
    const { history } = this.props;
    const queryData = queryString.parse(history.location.search);

    if (queryData) {
      if (queryData.data == "viewRequest") {
        if (queryData.userType == "renter") {
          this.setState({ selectedIndex: 1 });
        }
        if (queryData.userType == "owner") {
          this.setState({ selectedIndex: 2 });
        }
      }
    }
  };

  render() {
    const { booking } = this.state;
    const { reting_categories, car, carCoverageLevels } = this.props;
    const carName = booking && booking.car.car_name;
    const startDate =
      booking && moment(booking.from_date, "YYYY-MM-DD HH:mm:ss");
    const endDate = booking && moment(booking.to_date, "YYYY-MM-DD HH:mm:ss");
    let extraPhotos = [];

    if (
      booking &&
      booking.car_checkout_detail &&
      booking.car_checkout_detail.extra
    ) {
      extraPhotos = JSON.parse(booking.car_checkout_detail.extra);
    }

    return (
      <Fragment>
        <MainNav />
        <div className="container booked-trip-wrapper">
          {this.state.submitting && <PreLoader />}
          {this.state.submitting && <div className="preloader" />}
          <div className="row">
            <div className="col-xs-12 col-sm-7 col-md-7 col-lg-7">
              <div className="page-header-wrapper">
                <h1>
                  <span className="bold-label">Booked</span> Trip
                </h1>
                {this.renderStatusIcon()}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-7 col-md-7 col-lg-7 bt-left">
              <div className="bt-car-image">
                {/* <img
                  className="img-responsive"
                  src={booking && booking.car.car_photo[0].image_path}
                  alt="Image"
                /> */}
                {booking && (
                  <Image
                    className="img-responsive"
                    src={booking.car.car_photo[0].image_path}
                    alt="Image"
                    width={650}
                    height={400}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="visible-xs">
                {booking && booking.edit_request && (
                  <p className="status-note confirmed-note">
                    Pending extention
                  </p>
                )}

                {booking &&
                  booking.user_type == "renter" &&
                  booking.cancel_within_hours && (
                    <div className="respond-time-wrapper">
                      <img src="/images/clock-icon.svg" alt="Clock Icon" />
                      <span>{booking.cancel_within_hours}</span>
                    </div>
                  )}

                {booking &&
                  booking.user_type == "owner" &&
                  booking.cancel_within_hours && (
                    <div className="respond-time-wrapper">
                      <img src="/images/clock-icon.svg" alt="Clock Icon" />
                      <span>{booking.cancel_within_hours}</span>
                    </div>
                  )}

                <h2 className="car-name">{carName}</h2>
                <hr />

                {booking && booking.edit_request ? (
                  <div>
                    <div className="dates-wrap dates-wrap-old">
                      <div className="dates-left date">
                        {moment(
                          booking.edit_request.previous_from_date,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("ddd, MMM D")}
                        <div className="label-sm">
                          {booking &&
                            moment(
                              booking.edit_request.previous_from_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                        </div>
                      </div>
                      <div className="dates-center">
                        <img
                          className="img-responsive arrow-icon"
                          src="/images/arrow-icon-new.png"
                          alt="Image"
                        />
                      </div>
                      <div className="dates-right date">
                        {moment(
                          booking.edit_request.previous_to_date,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("ddd, MMM D")}
                        <div className="label-sm">
                          {booking &&
                            moment(
                              booking.edit_request.previous_to_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="dates-wrap-new">
                      {/* <div className="label-sm">
                                    <span className="bold-label">New</span> Dates</div> */}
                      <div className="dates-wrap">
                        <div className="dates-left date">
                          {moment(
                            booking.edit_request.from_date,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("ddd, MMM D")}
                          <div className="label-sm">
                            {moment(
                              booking.edit_request.from_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                          </div>
                        </div>
                        <div className="dates-center">
                          <img
                            className="img-responsive arrow-icon"
                            src="/images/arrow-icon-new.png"
                            alt="Image"
                          />
                        </div>
                        <div className="dates-right date">
                          {moment(
                            booking.edit_request.to_date,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("ddd, MMM D")}
                          <div className="label-sm">
                            {moment(
                              booking.edit_request.to_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="amount-wrap-new">
                      <div className="label-sm">
                        <span className="bold-label">TOTAL</span> AMOUNT
                      </div>
                      <div className="amount-wrap">
                        <div className="dates-left date">
                          <div className="amount previous-amount">
                            $ {booking.edit_request.previous_car_owner_amount}
                          </div>
                        </div>
                        <div className="dates-center" />
                        <div className="dates-right date">
                          <div className="amount">
                            $ {booking.edit_request.changed_car_owner_amount}
                          </div>
                        </div>
                      </div>
                    </div>
                    {booking && booking.btn.user_type == "renter" ? (
                      <div className="buttons-wrap">
                        <ConfirmationButton
                          buttonText="Cancel Request"
                          confirmationTitle="Are you sure to cancel this request?"
                          className="bt-button cancel-btn"
                          onClick={() =>
                            this.cancelChangeRequest(booking.edit_request.id)
                          }
                        />
                      </div>
                    ) : (
                      <div className="buttons-wrap">
                        <button
                          className="bt-button main-btn"
                          onClick={() =>
                            this.acceptChangeRequest(booking.edit_request.id)
                          }
                        >
                          Accept Request
                        </button>
                        <button
                          className="bt-button cancel-btn"
                          onClick={() =>
                            this.rejectChangeRequest(booking.edit_request.id)
                          }
                        >
                          Decline Request
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="dates-wrap">
                      <div className="dates-left date">
                        {startDate && startDate.format("ddd, MMM D")}
                        <div className="label-sm">
                          {startDate && startDate.format("h:mm a")}
                        </div>
                      </div>
                      <div className="dates-center">
                        <img
                          className="img-responsive arrow-icon"
                          src="/images/arrow-icon-new.png"
                          alt="Image"
                        />
                      </div>
                      <div className="dates-right date">
                        {endDate && endDate.format("ddd, MMM D")}
                        <div className="label-sm">
                          {endDate && endDate.format("h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="amount-wrap">
                      <div className="amount-inner">
                        <div className="dates-left date">
                          <div className="label-sm">
                            <span className="bold-label">TOTAL</span> AMOUNT
                          </div>
                          <div className="amount">$ {this.getTotal()}</div>
                        </div>
                        {booking && booking.receipt_availability && (
                          <a
                            className="receipt-link"
                            onClick={() => this._toggleModal("receipt")}
                          >
                            <span className="icon-request-icon" /> VIEW RECEIPT
                          </a>
                        )}
                      </div>
                    </div>
                    {this.setButton()}
                  </div>
                )}

                {/* <hr/> */}
              </div>

              <Tabs
                selectedIndex={this.state.selectedIndex}
                onSelect={index => this.setState({ selectedIndex: index })}
              >
                <TabList>
                  <Tab>
                    <span className="icon-document-icon tab-icon hidden-xs hidden-sm" />{" "}
                    Info
                  </Tab>
                  {booking &&
                    booking.btn.user_type == "owner" &&
                    booking.status == TRIP_IS_END && (
                      <Tab>
                        <span className="icon-request-icon tab-icon hidden-xs hidden-sm" />{" "}
                        Request Extra Charges
                      </Tab>
                    )}
                  {booking && booking.tickets && booking.tickets.length > 0 && (
                    <Tab className="request-notification">
                      <span className="icon-request-icon tab-icon hidden-xs hidden-sm" />{" "}
                      View Request{" "}
                      {this.getNumberOfPendingExtraRequest() > 0 && (
                        <span className="request-notification-label">
                          {this.getNumberOfPendingExtraRequest()}
                        </span>
                      )}
                    </Tab>
                  )}
                </TabList>
                <TabPanel>
                  <div className="bt-car-info">
                    <div className="bt-car-info-sep">
                      <div className="label-sm">
                        RESERVATION ID :{" "}
                        <span className="bold-label">
                          {booking && booking.number}
                        </span>
                      </div>
                    </div>
                    {this._delivery()}

                    {booking &&
                      booking.booking_details.pickup_instructions &&
                      booking.booking_details.pickup_instructions != "" && (
                        <div className="bt-car-info-sep">
                          <div className="label-sm">
                            <span className="bold-label">
                              PICKUP INSTRUCTIONS
                            </span>
                          </div>
                          <p>{booking.booking_details.pickup_instructions}</p>
                        </div>
                      )}

                    {/* Drop off location - Start */}
                    {/* Requirement : If renter choose drop off location this should show to owner */}
                    {booking && booking.dropoff_location && (
                      <div className="bt-car-info-sep">
                        <div className="label-sm">
                          <span className="bold-label">DROP-OFF LOCATION</span>
                        </div>
                        <p>{booking.dropoff_location}</p>
                      </div>
                    )}
                    {/* Drop off location - End */}

                    {booking && booking.miles_included != 0 && (
                      <div className="bt-car-info-sep">
                        <div className="label-sm">
                          <span className="bold-label">MILES INCLUDED</span>
                        </div>
                        <p>{booking && booking.miles_included} miles</p>
                      </div>
                    )}
                  </div>

                  {booking &&
                    booking.car_checkout_photo &&
                    booking.car_checkout_photo.length > 0 && (
                      <CheckoutPhotos
                        car_checkout_photo={booking.car_checkout_photo}
                      />
                    )}
                </TabPanel>
                {booking &&
                  booking.btn.user_type == "owner" &&
                  booking.status == TRIP_IS_END && (
                    <TabPanel>
                      {/* <p>Request Extra Charges</p> */}
                      <ExtrachargeForm
                        loadViewTab={number =>
                          this.setState({ selectedIndex: number })
                        }
                        booking={this.state.booking}
                        _loadingUp={this._loadingUp}
                        _loadingDwon={this._loadingDwon}
                        fetchBooking={this.fetchBooking}
                      />
                    </TabPanel>
                  )}
                {booking && booking.tickets && booking.tickets.length > 0 && (
                  <TabPanel>
                    {/* <p>View Request</p> */}
                    <ViewRequest
                      booking={this.state.booking}
                      _loadingUp={this._loadingUp}
                      _loadingDwon={this._loadingDwon}
                      fetchBooking={this.fetchBooking}
                    />
                  </TabPanel>
                )}
              </Tabs>
            </div>
            <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5 bt-right">
              {/* <div className="bt-car-info visible-xs">
                            <div className="bt-car-info-sep">
                                <div className="label-sm">RESERVATION ID : <span className="bold-label">{booking && booking.number}</span></div>
                            </div>
                            <div className="bt-car-info-sep">
                                <div className="label-sm"><span className="bold-label">
                                    {booking && booking.delivery_location_method.type}
                                </span></div>
                                <p>
                                    {booking && booking.delivery_location_method.location}
                                </p>
                            </div>
                            <div className="bt-car-info-sep">
                                <div className="label-sm"><span className="bold-label">MILES INCLUDED</span></div>
                                <p>{booking && booking.miles_included} miles</p>
                            </div>
                        </div> */}

              <div className="hidden-xs">
                {booking && booking.edit_request && (
                  <p className="status-note confirmed-note">
                    Pending extention
                  </p>
                )}

                {booking &&
                  booking.user_type == "renter" &&
                  booking.cancel_within_hours && (
                    <div className="respond-time-wrapper">
                      <img src="/images/clock-icon.svg" alt="Clock Icon" />
                      <span>{booking.cancel_within_hours}</span>
                    </div>
                  )}

                {booking &&
                  booking.user_type == "owner" &&
                  booking.cancel_within_hours && (
                    <div className="respond-time-wrapper">
                      <img src="/images/clock-icon.svg" alt="Clock Icon" />
                      <span>{booking.cancel_within_hours}</span>
                    </div>
                  )}

                <h2 className="car-name">{carName}</h2>
                <hr />

                {booking && booking.edit_request ? (
                  <div>
                    <div className="dates-wrap dates-wrap-old">
                      <div className="dates-left date">
                        {moment(
                          booking.edit_request.previous_from_date,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("ddd, MMM D")}
                        <div className="label-sm">
                          {moment(
                            booking.edit_request.previous_from_date,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("h:mm a")}
                        </div>
                      </div>
                      <div className="dates-center">
                        <img
                          className="img-responsive arrow-icon"
                          src="/images/arrow-icon-new.png"
                          alt="Image"
                        />
                      </div>
                      <div className="dates-right date">
                        <div className="dates-right-inner">
                          {moment(
                            booking.edit_request.previous_to_date,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("ddd, MMM D")}
                          <div className="label-sm">
                            {moment(
                              booking.edit_request.previous_to_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dates-wrap-new">
                      {/* <div className="label-sm">
                                    <span className="bold-label">New</span> Dates</div> */}
                      <div className="dates-wrap">
                        <div className="dates-left date">
                          {moment(
                            booking.edit_request.from_date,
                            "YYYY-MM-DD HH:mm:ss"
                          ).format("ddd, MMM D")}
                          <div className="label-sm">
                            {moment(
                              booking.edit_request.from_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("h:mm a")}
                          </div>
                        </div>
                        <div className="dates-center">
                          <img
                            className="img-responsive arrow-icon"
                            src="/images/arrow-icon-new.png"
                            alt="Image"
                          />
                        </div>
                        <div className="dates-right date">
                          <div className="dates-right-inner">
                            {moment(
                              booking.edit_request.to_date,
                              "YYYY-MM-DD HH:mm:ss"
                            ).format("ddd, MMM D")}
                            <div className="label-sm">
                              {moment(
                                booking.edit_request.to_date,
                                "YYYY-MM-DD HH:mm:ss"
                              ).format("h:mm a")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {booking && booking.btn.user_type == "renter" ? (
                      <div className="amount-wrap-new">
                        <div className="label-sm">
                          <span className="bold-label">TOTAL</span> AMOUNT
                        </div>
                        <div className="amount-wrap">
                          <div className="dates-left date">
                            <div className="amount previous-amount">
                              $ {booking.edit_request.previous_amount}
                            </div>
                          </div>
                          <div className="dates-center" />
                          <div className="dates-right date">
                            <div className="amount">
                              ${" "}
                              {booking.edit_request.amount_charged &&
                                booking.edit_request.amount_charged}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="amount-wrap-new">
                        <div className="label-sm">
                          <span className="bold-label">TOTAL</span> AMOUNT
                        </div>
                        <div className="amount-wrap">
                          <div className="dates-left date">
                            <div className="amount previous-amount">
                              $ {booking.edit_request.previous_car_owner_amount}
                            </div>
                          </div>
                          <div className="dates-center" />
                          <div className="dates-right date">
                            <div className="amount">
                              $ {booking.edit_request.changed_car_owner_amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {booking.edit_request.description && (
                      <div className="change-description-wrapper">
                        <div className="cd-title">Note</div>
                        {booking.edit_request.description}
                      </div>
                    )}

                    {booking && booking.btn.user_type == "renter" ? (
                      <div className="buttons-wrap">
                        <ConfirmationButton
                          buttonText="Cancel Request"
                          confirmationTitle="Are you sure to cancel this request?"
                          className="bt-button cancel-btn"
                          onClick={() =>
                            this.cancelChangeRequest(booking.edit_request.id)
                          }
                        />
                      </div>
                    ) : (
                      <div className="buttons-wrap">
                        <button
                          className="bt-button main-btn"
                          onClick={() =>
                            this.acceptChangeRequest(booking.edit_request.id)
                          }
                        >
                          Accept Request
                        </button>
                        <button
                          className="bt-button cancel-btn"
                          onClick={() =>
                            this.rejectChangeRequest(booking.edit_request.id)
                          }
                        >
                          Decline Request
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="dates-wrap">
                      <div className="dates-left date">
                        {startDate && startDate.format("ddd, MMM D")}
                        <div className="label-sm">
                          {startDate && startDate.format("h:mm a")}
                        </div>
                      </div>
                      <div className="dates-center">
                        <img
                          className="img-responsive arrow-icon"
                          src="/images/arrow-icon-new.png"
                          alt="Image"
                        />
                      </div>
                      <div className="dates-right date">
                        {endDate && endDate.format("ddd, MMM D")}
                        <div className="label-sm">
                          {endDate && endDate.format("h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="amount-wrap">
                      <div className="amount-inner">
                        <div className="dates-left date">
                          <div className="label-sm">
                            <span className="bold-label">TOTAL</span> AMOUNT
                          </div>
                          <div className="amount">$ {this.getTotal()}</div>
                        </div>
                        {(booking && booking.status == TRIP_IS_END) ||
                          (booking && booking.btn.user_type == "renter" && (
                            <a
                              className="receipt-link"
                              onClick={() => this._toggleModal("receipt")}
                            >
                              <span className="icon-request-icon" /> View
                              receipt
                            </a>
                          ))}
                        {booking &&
                          booking.btn.user_type == "owner" &&
                          booking.receipt_availability && (
                            <a
                              className="receipt-link"
                              onClick={() => this._toggleModal("receipt")}
                            >
                              <span className="icon-request-icon" /> View
                              receipt
                            </a>
                          )}
                      </div>
                    </div>
                    {this.setButton()}
                  </div>
                )}
              </div>
              {this.state.error ? (
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
              ) : null}

              <hr />
              {this.makeUserSection()}
              {booking &&
                (booking.status == TRIP_IS_ONTRIP ||
                  booking.status == TRIP_IS_END) &&
                booking.btn.user_type &&
                booking.btn.user_type == "renter" && (
                  <div className="share-experience-section">
                    <hr />
                    <button
                      onClick={() =>
                        this.setState({ showExperincesModal: true })
                      }
                      className="share-button"
                    >
                      <span className="icon-share" /> SHARE YOUR EXPERIENCE
                    </button>
                  </div>
                )}
            </div>
          </div>
          <ExperienceForm
            bookingId={booking && booking.id}
            showExperincesModal={this.state.showExperincesModal}
            shouldCloseOnOverlayClick={true}
            onRequestClose={() => this.setState({ showExperincesModal: false })}
          />

          {this.state.modelView == "checkoutPhotoView" && (
            <Modal
              isOpen={this.state.showModal}
              onRequestClose={() => this.setState({ showModal: false })}
              shouldCloseOnOverlayClick={true}
              contentLabel="Modal"
              style={imageModel}
            >
              {this.state.modelView == "checkoutPhotoView" && booking && (
                <img width="100%" src={this.state.img} />
              )}
            </Modal>
          )}

          <Modal
            isOpen={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            {this.state.modelView == "tripChange" && booking && (
              <TripChangeForm
                _toggleModal={this._toggleModal}
                booking={booking && booking}
                fetchBooking={this.fetchBooking}
                calendarPrices={
                  car && car.advane_prices ? car.advane_prices : []
                }
                carCoverageLevels={carCoverageLevels}
              />
            )}
            {this.state.modelView == "receipt" && booking && (
              <Receipt
                _toggleModal={this._toggleModal}
                booking={booking && booking}
                carCoverageLevels={carCoverageLevels}
              />
            )}
          </Modal>

          {/* How easy was the booking popup */}
          <Modal
            isOpen={this.state.showBookingRate}
            onRequestClose={this.handleCloseModalLarge}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="payment-success-popup checkout-popup">
              <div className="ps-title">How easy was the booking?</div>
              <div className="flex-container">
                <button
                  className="very-easy-btn face-buttons"
                  onClick={() => {
                    booking &&
                      this.props.dispatch(bookingReview(1, booking.id));
                    this.setState({ showBookingRate: false });
                    this.props.history.push(`/booking/${booking.id}`);
                  }}
                >
                  <img
                    className="img-responsive"
                    src="/images/checkout/very-easy-face.png"
                  />
                  Very easy
                </button>
                <button
                  className="okay-btn face-buttons"
                  onClick={() => {
                    booking &&
                      this.props.dispatch(bookingReview(2, booking.id));
                    this.setState({ showBookingRate: false });
                    this.props.history.push(`/booking/${booking.id}`);
                  }}
                >
                  <img
                    className="img-responsive"
                    src="/images/checkout/okay-face.png"
                  />
                  Okay
                </button>
                <button
                  className="not-really-btn face-buttons"
                  onClick={() => {
                    booking &&
                      this.props.dispatch(bookingReview(3, booking.id));
                    this.setState({ showBookingRate: false });
                    this.props.history.push(`/booking/${booking.id}`);
                  }}
                >
                  <img
                    className="img-responsive"
                    src="/images/checkout/not-really-face.png"
                  />
                  Not really
                </button>
              </div>
            </div>
          </Modal>

          {/* Rating - Start */}
          {reting_categories && booking && booking.is_available_for_rating && (
            <RatingForm
              booking={booking}
              reting_categories={reting_categories}
              fetchBooking={this.fetchBooking}
            />
          )}

          {/* Rating - End */}
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    reting_categories: state.user.reting_categories,
    car: state.car.car_v2,
    unreadTabData: state.profile.unreadTabData,
    carCoverageLevels: state.car.carCoverageLevels
  };
};
export default connect(mapStateToProps)(
  withRouter(checkAuth(checkPermission(Booking)))
);
