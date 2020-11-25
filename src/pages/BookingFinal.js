import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import queryString from "query-string";
import { getBookingData, getMultipleCards } from "../actions/BookingActions";
import {
  fetchCar,
  getUsStates,
  getCarCoverageLevels
} from "../actions/CarActions";
import { getLoggedInUser } from "../actions/UserActions";
import checkAuth from "../components/requireAuth";
import UserInformationForBooking from "../components/booking/UserInformationForBooking";
import StripePaymentForm from "../components/credit-card/StripePaymentForm";
import SquarePayment from "../components/credit-card/SquarePayment";
import Checkout from "../components/booking/Checkout";
import CheckoutSummary from "../components/booking/CheckoutSummary";
import MainNav from "../components/layouts/MainNav";
import MainFooter from "../components/layouts/MainFooter";

class BookingFinal extends Component {
  constructor(props) {
    super(props);
    const { user, match } = props;
    let fromDate = moment(
      moment(match.params.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        match.params.fromTime
    ).format("YYYY-MM-DD HH:mm");
    const toDate = moment(
      moment(match.params.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        match.params.toTime
    ).format("YYYY-MM-DD HH:mm");
    this.state = {
      from: moment(match.params.from, "MM-DD-YYYY"),
      fromTime: match.params.fromTime,
      to: moment(match.params.to, "MM-DD-YYYY"),
      toTime: match.params.toTime,
      delivery_location: match.params.deliveryLocation
        ? match.params.deliveryLocation
        : null,
      latitude: match.params.lat ? match.params.lat : null,
      longitude: match.params.lng ? match.params.lng : null,
      fromDate: fromDate,
      toDate: toDate,
      freeDeliveryLocationId: match.params.freeDeliveryLocationId
        ? match.params.freeDeliveryLocationId
        : null,
      addNewCreditCard: false
    };
  }

  componentWillMount() {
    const { dispatch, usStates, match, history } = this.props;
    dispatch(getLoggedInUser(false));
    this.props.dispatch(getCarCoverageLevels());
    if (!this.props.car) {
      dispatch(fetchCar(match.params.carId));
    }
    if (usStates.length == 0) {
      dispatch(getUsStates());
    }
    dispatch(getMultipleCards());

    const filterdData = {
      from_date: moment(
        match.params.from + " " + match.params.fromTime,
        "MM-DD-YYYY HH:mm:s a"
      ).format("YYYY-MM-DD HH:mm:ss"),
      to_date: moment(
        match.params.to + " " + match.params.toTime,
        "MM-DD-YYYY HH:mm:s a"
      ).format("YYYY-MM-DD HH:mm:ss"),
      delivery_location: this.state.delivery_location,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      car_id: match.params.carId,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: this.props.timeZoneId
    };

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
      filterdData.coupon_code = searchParams.couponCode;
    }
    dispatch(getBookingData(filterdData));
  }

  isPersonalInfoComplete() {
    const { user } = this.props;
    if (user) {
      if (
        user.first_name &&
        user.last_name &&
        user.email &&
        user.date_of_birth &&
        user.phone_number &&
        user.street_address &&
        user.state &&
        user.zip_code &&
        (user.profile_image || user.profile_image_thumb) &&
        (user.driving_license_number &&
          user.driving_license_expiration &&
          user.license_issued_state &&
          user.license_issued_country) &&
        user.verified_phone == 1
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  renderPage = () => {
    const { user, usStates, car, bookingData, carCoverageLevels } = this.props;
    if (user.id == null) {
      return false;
    }
    if (this.state.addNewCreditCard) {
      return (
        <StripePaymentForm
          usStates={usStates}
          addNewCreditCard={() =>
            this.setState({ addNewCreditCard: !this.state.addNewCreditCard })
          }
          type={"NEW-PROFILE"}
        />
      );
    }
    if (!this.isPersonalInfoComplete()) {
      return <UserInformationForBooking />;
    } else if (user.stripe_sign_up) {
      return (
        <StripePaymentForm
          usStates={usStates}
          addNewCreditCard={val => this.setState({ addNewCreditCard: val })}
          type={"BOOKING"}
        />
      );
    } else if (user.square_sign_up) {
      return <SquarePayment user={user} />;
    } else {
      return (
        <Checkout
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
          timeZoneId={this.props.timeZoneId}
          user={user}
          dispatch={this.props.dispatch}
          bookingData={bookingData}
          delivery_location={this.state.delivery_location}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          car={car}
          carCoverageLevels={carCoverageLevels}
          freeDeliveryLocationId={this.state.freeDeliveryLocationId}
          addNewCreditCard={val => this.setState({ addNewCreditCard: val })}
          multipleCreditCard={this.props.multipleCreditCard}
        />
      );
    }
  };

  render() {
    const {
      user,
      car,
      bookingData,
      match,
      history,
      carCoverageLevels
    } = this.props;

    return (
      <Fragment>
        <MainNav />
        <div className="checkout-outer">
          <div className="car-view container">
            <div className="row">
              <div className="col-md-12">
                <ul className="list-inline page-breadcrumb">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <span className="icon-right-arrow" />
                  </li>
                  <li>
                    <a onClick={() => history.go(-2)}>{car && car.car_name}</a>
                  </li>
                  <li>
                    <span className="icon-right-arrow" />
                  </li>
                  <li>
                    <a onClick={() => history.goBack()}>Delivery options</a>
                  </li>
                  <li>
                    <span className="icon-right-arrow" />
                  </li>
                  <li className="stay">
                    {!this.state.addNewCreditCard &&
                    this.isPersonalInfoComplete() &&
                    !user.stripe_sign_up &&
                    !user.square_sign_up
                      ? "Confirm and pay"
                      : "Personal information"}
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                {/* Page headers */}
                <div className="page-title-header">
                  <h1 className="page-title">
                    {!this.state.addNewCreditCard &&
                    this.isPersonalInfoComplete() &&
                    !user.stripe_sign_up &&
                    !user.square_sign_up
                      ? "Confirm and pay"
                      : "Personal information"}
                  </h1>
                </div>
                <div className="booking-info-left">{this.renderPage()}</div>
              </div>
              <div className="col-md-4">
                <CheckoutSummary
                  car={car}
                  fromDate={match.params.from}
                  fromTime={match.params.fromTime}
                  toDate={match.params.to}
                  toTime={match.params.toTime}
                  bookingData={bookingData}
                  hidePricebreakdown={
                    !this.isPersonalInfoComplete() ||
                    this.state.addNewCreditCard ||
                    user.stripe_sign_up ||
                    user.square_sign_up
                      ? false
                      : true
                  }
                  carCoverageLevels={carCoverageLevels}
                />
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  car: state.car.car_v2,
  user: state.user.user,
  bookingData: state.booking.bookingData,
  usStates: state.car.usStates,
  carCoverageLevels: state.car.carCoverageLevels,
  timeZoneId: state.common.timeZoneId,
  multipleCreditCard: state.booking.multipleCreditCard
});
export default connect(mapStateToProps)(checkAuth(BookingFinal));
