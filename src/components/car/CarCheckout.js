import React, { Component } from "react";
import { connect } from "react-redux";
import InnerpageHeader from "../layouts/InnerPageHeader";
import TripSummaryWidget from "../car/TripSummaryWidget";
import ProfileForm from "../user/ProfileForm";
import CarOwnerWidget from "../car/CarOwnerWidget";
import {
  getCar,
  getUsStates,
  getCarPrice,
  getCarDelivaryPrice,
  getCarDiscount
} from "../../actions/CarActions";
import {
  updateProfile,
  getUserBalance,
  uploadProfilePic
} from "../../actions/UserActions";
import { addBooking, getBookingData } from "../../actions/BookingActions";
import DateTime from "react-datetime";
import Checkout from "../booking/Checkout";
import moment from "moment";
import FileUpload from "../user/FileUpload";
import AvatarCropper from "react-avatar-cropper";
import checkAuth from "../requireAuth";

class CarCheckout extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      from: moment(props.params.from, "MM-DD-YYYY"),
      fromTime: props.params.fromTime,
      to: moment(props.params.to, "MM-DD-YYYY"),
      toTime: props.params.toTime,
      delivery_location: props.params.deliveryLocation,
      latitude: props.params.lat,
      longitude: props.params.lng,
      isInternational: false,
      cropperOpen: false,
      img: null,
      index: 0,
      croppedImg: user.profile_image
        ? user.profile_image
        : "/images/defaultprofile.jpg"
    };
    this.addBooking = this.addBooking.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.handleInternational = this.handleInternational.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { fromTime, toTime } = this.state;
    dispatch(getCar(this.props.params.carId));
    const data = {
      from: this.state.from.format("YYYY-MM-DD") + " " + fromTime,
      to: this.state.to.format("YYYY-MM-DD") + " " + toTime
    };

    const fromDate = this.state.from.format("YYYY-MM-DD") + " " + fromTime;
    const toDate = this.state.to.format("YYYY-MM-DD") + " " + this.state.toTime;

    dispatch(getCarDiscount(data, this.props.params.carId));
    dispatch(getUsStates());
    dispatch(getUserBalance());
    dispatch(
      getBookingData({
        from_date: moment(
          this.props.params.from + " " + this.props.params.fromTime,
          "MM-DD-YYYY HH:mm:s a"
        ).format("YYYY-MM-DD HH:mm:ss"),
        to_date: moment(
          this.props.params.to + " " + this.props.params.toTime,
          "MM-DD-YYYY HH:mm:s a"
        ).format("YYYY-MM-DD HH:mm:ss"),
        delivery_location: this.state.delivery_location,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        car_id: this.props.params.carId,
        car_coverage_level: localStorage.carCoverageLevel
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.country == "United States" || !nextProps.user.country) {
      this.setState({ isInternational: false });
    } else {
      this.setState({ isInternational: true });
    }

    if (
      nextProps.user.profile_image &&
      this.props.user.profile_image != nextProps.user.profile_image
    ) {
      this.setState({ croppedImg: nextProps.user.profile_image });
    }
  }

  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }
  handleCrop(dataURI) {
    // send the cropped image to the server
    const { dispatch } = this.props;
    dispatch(uploadProfilePic(dataURI));

    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI
    });
  }
  handleRequestHide() {
    this.setState({
      cropperOpen: false
    });
  }

  generateInitialValues(initialValues) {
    return {
      ...initialValues,
      date_of_birth: moment(initialValues.date_of_birth).format("MM-DD-YYYY"),
      driving_license_expiration: moment(
        initialValues.driving_license_expiration
      ).format("MM-DD-YYYY")
    };
  }

  handleInternational() {
    this.setState({ isInternational: !this.state.isInternational });
  }

  addBooking(couponCode) {
    const { dispatch, car } = this.props;
    const { fromTime, toTime } = this.state;
    const bookingData = {
      car_id: car.id,
      from_date: this.state.from.format("YYYY-MM-DD") + " " + fromTime,
      to_date: this.state.to.format("YYYY-MM-DD") + " " + toTime,
      car_coverage_level: localStorage.carCoverageLevel
    };
    if (this.props.params.deliveryLocation) {
      bookingData.delivery_location = this.props.params.deliveryLocation;
      bookingData.latitude = this.props.params.lat;
      bookingData.longitude = this.props.params.lng;
    }
    if (this.props.params.freeDeliveryLocationId) {
      if (this.props.params.freeDeliveryLocationId != 0) {
        bookingData.free_delivery_location_id = this.props.params.freeDeliveryLocationId;
      }
    }

    if (couponCode) {
      bookingData.coupon_code = couponCode;
    }
    dispatch(addBooking(bookingData));
  }

  verifyUser(data) {
    const { dispatch } = this.props;
    dispatch(updateProfile(data));
  }

  render() {
    const {
      user,
      car,
      usStates,
      tripPrice,
      carDelivaryPrice,
      booking,
      showBookingReview,
      transactionFailed,
      carDiscount,
      creditCardVerifaction,
      carAvailability,
      tax,
      couponCodeAvailability,
      couponCodeValidity,
      bookingData,
      userBalance,
      dispatch
    } = this.props;
    const formatedInitialValues = this.generateInitialValues(user);
    return (
      <div>
        <InnerpageHeader header="CAR DETAILS" title="" />
        <div className="car-view container">
          <div className="row">
            <div className="col-sm-12 ">
              <h2 className="innerpage-headline">CAR DETAILS</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <TripSummaryWidget
                car={car}
                from={this.props.params.from}
                fromTime={this.props.params.fromTime}
                to={this.props.params.to}
                toTime={this.props.params.toTime}
                tripPrice={tripPrice}
                carDelivaryPrice={carDelivaryPrice}
                carDiscount={carDiscount}
                bookingData={bookingData}
              />
              <CarOwnerWidget user={car} />
            </div>
            <div className="col-md-8">
              <div className="well well-sm title-bar">
                <div className="row">
                  <div className="col-sm-8">
                    <h4>
                      {car.year} {car.car_make.name} {car.car_model.name}
                    </h4>
                  </div>
                  <div className="col-sm-4" />
                </div>
              </div>
              <div className="panel panel-pay">
                <div className="panel-body car-form">
                  {creditCardVerifaction && user.verified_phone ? (
                    <Checkout
                      from={this.state.from}
                      fromTime={this.state.fromTime}
                      to={this.state.to}
                      toTime={this.state.toTime}
                      timeZoneId={this.props.timeZoneId}
                      tripPrice={tripPrice}
                      carDelivaryPrice={carDelivaryPrice}
                      carDiscount={carDiscount}
                      booking={booking}
                      dispatch={dispatch}
                      user={user}
                      addBooking={this.addBooking}
                      showBookingReview={showBookingReview}
                      carAvailability={carAvailability}
                      transactionFailed={transactionFailed}
                      tax={tax}
                      couponCodeAvailability={couponCodeAvailability}
                      dispatch={this.props.dispatch}
                      couponCodeValidity={couponCodeValidity}
                      bookingData={bookingData}
                      delivery_location={this.state.delivery_location}
                      latitude={this.state.latitude}
                      longitude={this.state.longitude}
                      car={car}
                    />
                  ) : user.id != null ? (
                    <div>
                      <div className="checkout-profile-pic">
                        <div className="row">
                          <div className="col-md-8 col-md-offset-2 text-center">
                            <div className="profile-image-wrapper">
                              {this.state.croppedImg ==
                              "/images/defaultprofile.jpg" ? (
                                <p className="text-error lead">
                                  Please add a profile picture so hosts and
                                  guest can recognize each other <br />
                                </p>
                              ) : null}
                              <div className="avatar-photo">
                                <FileUpload
                                  handleFileChange={this.handleFileChange}
                                />
                                <img
                                  className="img-responsive img-circle"
                                  src={this.state.croppedImg}
                                />
                                <p className="link">Change Photo</p>
                              </div>
                              {this.state.cropperOpen && (
                                <AvatarCropper
                                  onRequestHide={this.handleRequestHide}
                                  cropperOpen={this.state.cropperOpen}
                                  onCrop={this.handleCrop}
                                  image={this.state.img}
                                  width={328}
                                  height={328}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ProfileForm
                        onSubmit={updateProfile}
                        isInternational={this.state.isInternational}
                        profilePicUploaded={
                          this.state.croppedImg == "/images/defaultprofile.jpg"
                            ? false
                            : true
                        }
                        handleInternational={this.handleInternational}
                        usStates={usStates}
                        initialValues={formatedInitialValues}
                        addBooking={this.verifyUser}
                        creditCard={user.credit_card}
                        user={user}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  car: state.car.car,
  user: state.user.user,
  bookingData: state.booking.bookingData,
  usStates: state.car.usStates,
  creditCardVerifaction: state.user.creditCardVerifaction,
  showBookingReview: state.booking.showBookingReview,
  transactionFailed: state.booking.transactionFailed,
  booking: state.booking.booking,
  timeZoneId: state.common.timeZoneId
});
export default connect(mapStateToProps)(checkAuth(CarCheckout));
