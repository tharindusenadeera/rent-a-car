import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { initialize } from "redux-form";
import _ from "lodash";
import {
  CAR_REGISTRATION_PAGE,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_ERROR
} from "../../actions/ActionTypes";
import {
  getRegisteringCar,
  getYears,
  getFeatures,
  getUsStates,
  registerCar,
  resetRegisterCar,
  getDeliveryOptions,
  getFreeDeliveryLocations,
  getLastIncompleateCar
} from "../../actions/CarActions";
import moment from "moment";
import EligibilityForm from "./EligibilityForm";
import PersonalInfoForm from "./PersonalInfoForm";
import AvailabilityForm from "./AvailabilityForm";
import DetailsForm from "./DetailsForm";
import CarPhotosForm from "./CarPhotosForm";
import InnerpageHeader from "../layouts/InnerPageHeader";
import { updateProfile } from "../../actions/UserActions";
import checkAuth from "../requireAuth";
import MainNav from "../layouts/MainNav";
import PreLoader from "../preloaders/preloaders";
import Footer from "../layouts/MainFooter";

class Create extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.carRegister = this.carRegister.bind(this);
    this.state = {
      page: 1,
      personalInfoFormNeed: null,
      tabNumbers: {}
    };
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch(getYears());
    dispatch(getUsStates());
    dispatch(getFeatures());
    dispatch(getDeliveryOptions());
    if (match.params.id) {
      dispatch(getFreeDeliveryLocations(match.params.id));
      dispatch(getRegisteringCar(match.params.id));
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetRegisterCar());
    dispatch({ type: USER_UPDATE_SUCCESS, payload: "" });
    dispatch({ type: USER_UPDATE_ERROR, payload: "" });
    dispatch(initialize("car-registration-1"));
    dispatch(initialize("car-registration-2"));
    dispatch(initialize("car-registration-3"));
    dispatch(initialize("car-registration-4"));
    dispatch(initialize("car-registration-5"));
    dispatch({ type: CAR_REGISTRATION_PAGE, payload: 1 });
  }

  componentDidMount() {
    const { dispatch, user } = this.props;
    dispatch(getLastIncompleateCar());
    if (
      user.first_name &&
      user.last_name &&
      user.date_of_birth &&
      user.license_issued_state &&
      user.driving_license_number &&
      user.verified_phone == 1
    ) {
      this.setState({
        personalInfoFormNeed: false,
        tabNumbers: {
          carInfo: 1,
          yourPreferences: 2,
          details: 3,
          carPhotos: 4
        }
      });
    } else {
      this.setState({
        personalInfoFormNeed: true,
        tabNumbers: {
          carInfo: 1,
          yourInfo: 2,
          yourPreferences: 3,
          details: 4,
          carPhotos: 5
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match, dispatch, pageId } = nextProps;
    if (pageId != this.props.pageId) {
      this.setState({ page: nextProps.pageId });
    }
    if (match.params.id != this.props.match.params.id) {
      dispatch(getYears());
      dispatch(getUsStates());
      dispatch(getFeatures());
      // dispatch(getDeliveryOptions());
      dispatch(getFreeDeliveryLocations(match.params.id));
      if (match.params.id) {
        dispatch(getRegisteringCar(match.params.id));
      }
    }
  }

  nextPage() {
    const { dispatch } = this.props;
    dispatch({ type: CAR_REGISTRATION_PAGE, payload: this.state.page + 1 });
  }
  previousPage() {
    const { dispatch } = this.props;
    dispatch({ type: CAR_REGISTRATION_PAGE, payload: this.state.page - 1 });
  }

  carRegister(data, dispatch, props) {
    dispatch({ type: USER_UPDATE_SUCCESS, payload: "" });
    dispatch({ type: USER_UPDATE_ERROR, payload: "" });
    const { tabNumbers, personalInfoFormNeed } = this.state;
    let id = null;
    if (data.id) {
      id = data.id;
    } else if (this.props.match.params.id) {
      id = this.props.match.params.id;
    }
    const car = {
      id: id,
      year: data.year,
      car_make: data.car_make,
      car_model: data.car_model,
      trim: data.trim
    };
    const user = {};

    let multiple_discounts = [];

    if (data.discount_daily) {
      multiple_discounts.push({
        discount: data.discount_daily,
        discount_days: 1
      });
    }
    if (data.discount_weekly) {
      multiple_discounts.push({
        discount: data.discount_weekly,
        discount_days: 2
      });
    }
    if (data.discount_monthly) {
      multiple_discounts.push({
        discount: data.discount_monthly,
        discount_days: 3
      });
    }

    data.multiple_discounts = multiple_discounts;

    if (this.state.page == tabNumbers.carInfo) {
      car.location = data.location;
      car.latitude = data.latitude;
      car.longitude = data.longitude;
      car.car_type = data.car_type;
      car.odometer = data.odometer;
      car.transmission = data.transmission;
      return dispatch(
        registerCar(
          car,
          personalInfoFormNeed
            ? tabNumbers.yourInfo
            : tabNumbers.yourPreferences
        )
      );
    } else if (personalInfoFormNeed && this.state.page == tabNumbers.yourInfo) {
      user.email = this.props.user.email;
      user.id = data.user_id;
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.date_of_birth = data.date_of_birth;
      user.license_issued_state = data.license_issued_state;
      user.driving_license_number = data.driving_license_number;
      user.driving_license_expiration = data.driving_license_expiration;
      user.phone_number = data.phone_number;
      return dispatch(updateProfile(user, props));
    } else if (this.state.page == tabNumbers.yourPreferences) {
      car.rent_car_shortest = data.rent_car_shortest;
      car.rent_car_longest = data.rent_car_longest;
      car.time_to_confirm = data.time_to_confirm;
      car.miles_allowed_per_day = data.miles_allowed_per_day;
      car.miles_allowed_per_week = data.miles_allowed_per_week;
      car.miles_allowed_per_month = data.miles_allowed_per_month;
      car.delivery_option = data.delivery_option;
      car.offer_free_delivery = data.offer_free_delivery;
      car.car_free_delivery_location = data.car_free_delivery_location;
      return dispatch(registerCar(car, tabNumbers.details));
    } else if (this.state.page == tabNumbers.details) {
      car.license_plate_number = data.license_plate_number;
      car.state = data.state;
      car.daily_rate = data.daily_rate;
      // car.discount = data.discount;
      // car.discount_days = data.discount_days;
      car.multiple_discounts = data.multiple_discounts;
      car.description = data.description;
      car.features = data.features;
      return dispatch(registerCar(car, tabNumbers.carPhotos));
    } else if (this.state.page == tabNumbers.carPhotos) {
      if (car.id || id) {
        car.id = id;
        car.status = 0;
        return dispatch(registerCar(car, 6));
      }
    }
  }

  initialValues(car, user) {
    if (this.props.match.params.id && car.id && user.id) {
      const feature = car.features.map(fet => {
        return fet.id;
      });
      const freeDelivery = car.free_dilivery_locations.map(fet => {
        return fet.id;
      });

      let dailyDiscount, weeklyDiscount, monthlyDiscount;

      car.multiple_discounts &&
        car.multiple_discounts.find(discount => {
          if (discount.discount_days === 1) {
            dailyDiscount = discount.discount;
          }
          if (discount.discount_days === 2) {
            weeklyDiscount = discount.discount;
          }
          if (discount.discount_days === 3) {
            monthlyDiscount = discount.discount;
          }
        });

      const offerFreeDelivery =
        car && car.offer_free_delivery === "0"
          ? "3 Days"
          : car.offer_free_delivery;

      return {
        // 1 st page car data
        id: car.id,
        location: car.location,
        latitude: car.latitude,
        longitude: car.longitude,
        year: car.year,
        car_make: car.car_make.id,
        car_model: car.car_model.id,
        trim: car.trim.id,
        car_type: car.car_type,
        odometer: car.odometer,
        transmission: car.transmission.toString(),
        // 2nd Page user data
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth
          ? moment(user.date_of_birth).format("MM-DD-YYYY")
          : null,
        driving_license_expiration: user.driving_license_expiration
          ? moment(user.driving_license_expiration).format("MM-DD-YYYY")
          : null,
        license_issued_state: user.license_issued_state,
        driving_license_number: user.driving_license_number,
        email: user.email,
        phone_number: user.phone_number,
        verified_phone: user.verified_phone,
        user_can_add_booking: user.user_can_add_booking,
        profile_image: user.profile_image,
        // 3 rd page car data
        rent_car_shortest: car.rent_car_shortest,
        rent_car_longest: car.rent_car_longest,
        time_to_confirm: car.time_to_confirm,
        miles_allowed_per_day: car.miles_allowed_per_day,
        miles_allowed_per_week: car.miles_allowed_per_week,
        miles_allowed_per_month: car.miles_allowed_per_month,
        delivery_option: car.delivery_option
          ? car.delivery_option.toString()
          : null,
        offer_free_delivery: offerFreeDelivery,
        car_free_delivery_location: freeDelivery,
        email: user.email,
        phone_number: user.phone_number,
        verified_phone: user.verified_phone,
        // 4 th page car data
        license_plate_number: car.license_plate_number,
        state: car.state,
        daily_rate: car.daily_rate,
        discount: car.discount,
        discount_days: car.discount_days,
        discount_daily: dailyDiscount,
        discount_weekly: weeklyDiscount,
        discount_monthly: monthlyDiscount,
        description: car.description,
        features: feature,
        car_photo: car.car_photo
      };
    }
  }

  render() {
    const {
      registeredCar,
      years,
      usStates,
      user,
      features,
      makes,
      trims,
      carModels,
      carModelsForMake,
      fetching,
      delivery_options,
      free_delivery_loations,
      verifyPhone,
      incompleteCar,
      userUpdateError
    } = this.props;
    const { page } = this.state;
    const initialValues = this.initialValues(registeredCar, user);
    const { tabNumbers, personalInfoFormNeed } = this.state;
    let tabStyle = {};
    if (!personalInfoFormNeed) {
      tabStyle = { width: "24.7%" };
    }

    return (
      <Fragment>
        <MainNav />
        <InnerpageHeader header="LIST MY CAR" title="" />
        <div className="car-create car-view container">
          <h2 className="innerpage-headline">LIST MY CAR FOR RYDE</h2>

          {incompleteCar &&
          !_.isEmpty(incompleteCar) &&
          !this.props.match.params.id ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="alert alert-info">
                  Hi, <strong> {user.first_name}</strong> You have a incomplete
                  Car Listing . Do you want to{" "}
                  <strong>
                    {" "}
                    <Link to={"/car/create/" + incompleteCar.id}>Continue</Link>
                  </strong>{" "}
                  ?
                </div>
              </div>
            </div>
          ) : null}
          {user.id ? (
            <div>
              {user.user_can_add_booking["listing_status"] === true ||
              user.user_can_add_booking["age"] == 0 ? (
                <div className="tabs list-tabs">
                  <div className="tab-buttons-panel">
                    <a
                      className={
                        page === tabNumbers.carInfo
                          ? "btn btn-default tab-buttons tab-middle-buttons pull-left"
                          : "btn btn-success tab-middle-buttons tab-buttons pull-left"
                      }
                      style={tabStyle}
                    >
                      {" "}
                      <span>
                        Car
                        <br /> info
                      </span>
                    </a>
                    {this.state.personalInfoFormNeed ? (
                      <a
                        className={
                          page === tabNumbers.yourInfo
                            ? "btn btn-default tab-buttons tab-middle-buttons"
                            : "btn btn-success tab-buttons tab-middle-buttons"
                        }
                        style={tabStyle}
                      >
                        <div className="tb1">
                          <span>
                            Your
                            <br /> Info
                          </span>
                        </div>
                      </a>
                    ) : null}
                    <a
                      className={
                        page === tabNumbers.yourPreferences
                          ? "btn btn-default tab-buttons tab-middle-buttons"
                          : "btn btn-success tab-buttons tab-middle-buttons"
                      }
                      style={tabStyle}
                    >
                      <span>
                        Your
                        <br /> Preferences
                      </span>
                    </a>
                    <a
                      className={
                        page === tabNumbers.details
                          ? "btn btn-default tab-buttons"
                          : "btn btn-success tab-buttons "
                      }
                      style={tabStyle}
                    >
                      <span>Details</span>
                    </a>
                    <a
                      className={
                        page === tabNumbers.carPhotos
                          ? "btn btn-default tab-buttons pull-right"
                          : "btn btn-success tab-buttons pull-right"
                      }
                      style={tabStyle}
                    >
                      <span>
                        Car
                        <br /> Photos
                      </span>
                    </a>
                  </div>
                  <div className="car-form">
                    {page === tabNumbers.carInfo && user.id != null && (
                      <EligibilityForm
                        initialValues={initialValues}
                        years={years}
                        makes={makes}
                        carModels={carModels}
                        trims={trims}
                        onSubmit={this.carRegister}
                        carModelsForMake={carModelsForMake}
                        nextPage={this.nextPage}
                      />
                    )}
                    {page === tabNumbers.yourInfo &&
                      this.state.personalInfoFormNeed && (
                        <PersonalInfoForm
                          initialValues={initialValues}
                          usStates={usStates}
                          user={user}
                          profilePicUploaded={true}
                          previousPage={this.previousPage}
                          onSubmit={this.carRegister}
                          verifyPhone={verifyPhone}
                          userUpdateError={userUpdateError}
                          nextPage={this.nextPage}
                        />
                      )}
                    {page === tabNumbers.yourPreferences && (
                      <AvailabilityForm
                        initialValues={initialValues}
                        previousPage={this.previousPage}
                        delivery_options={delivery_options}
                        free_delivery_loations={free_delivery_loations}
                        onSubmit={this.carRegister}
                        verifyPhone={verifyPhone}
                        nextPage={this.nextPage}
                      />
                    )}
                    {page === tabNumbers.details && (
                      <DetailsForm
                        initialValues={initialValues}
                        features={features}
                        usStates={usStates}
                        previousPage={this.previousPage}
                        onSubmit={this.carRegister}
                        nextPage={this.nextPage}
                      />
                    )}
                    {page === tabNumbers.carPhotos && (
                      //registeredCar.id != null && (
                      <CarPhotosForm
                        registeringCar={initialValues}
                        initialValues={initialValues}
                        initiali
                        carId={this.props.params && this.props.match.params.id}
                        fetching={fetching}
                        previousPage={this.previousPage}
                        onSubmit={this.carRegister}
                      />
                    )
                    //)
                    }
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="alert alert-warning">
                      <strong /> {user.user_can_add_booking["listing_message"]}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  features: state.car.features,
  years: state.car.years,
  usStates: state.car.usStates,
  makes: state.car.makes,
  carModels: state.car.carModels,
  trims: state.car.trims,
  carModelsForMake: state.car.carModelsForMake,
  fetching: state.car.fetching,
  delivery_options: state.car.delivery_options,
  free_delivery_loations: state.car.free_delivery_loations,
  registeredCar: state.car.registeredCar,
  pageId: state.car.pageId,
  incompleteCar: state.car.userLastIncompleteCar,
  verifyPhone: state.user.verifyPhoneNumber,
  userUpdateError: state.user.userUpdateError
});

export default connect(mapStateToProps)(checkAuth(withRouter(Create)));
