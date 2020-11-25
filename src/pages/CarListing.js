import React, { Component, Fragment, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import _ from "lodash";
import {
  getRegisteringCar,
  getYears,
  getUsStates,
  getLastIncompleateCar
} from "../actions/CarActions";
import { getLoggedInUser } from "../actions/UserActions";
import { REGISTERED_CAR } from "../actions/ActionTypes";

import StepOne from "../components/car/listing-steps/stepOne";
import StepTwo from "../components/car/listing-steps/stepTwo";
import StepThree from "../components/car/listing-steps/stepThree";
import StepFour from "../components/car/listing-steps/stepFour";
import StepFive from "../components/car/listing-steps/stepFive";
import StepCarOwnersOnly from "../components/car/listing-steps/stepCarOwnersOnly";

import MainNav from "../components/layouts/MainNav";
import InnerpageHeader from "../components/layouts/InnerPageHeader";
import checkAuth from "../components/requireAuth";
import Footer from "../components/layouts/MainFooter";
import PreLoader from "../components/preloaders/preloaders";

class CarListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1 /* Change Value for static tab view */
    };
  }

  componentDidMount() {
    const { dispatch, match, car } = this.props;
    dispatch(getYears());
    dispatch(getUsStates());
    dispatch(getLastIncompleateCar());
    if (match.params.id) {
      dispatch(getRegisteringCar(match.params.id));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    const { dispatch } = this.props;

    if (match.params.id != this.props.match.params.id) {
      dispatch(getRegisteringCar(match.params.id));
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (prevProps.user == this.props.user) {
      dispatch(getLoggedInUser());
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: REGISTERED_CAR, payload: null });
  }

  setTabContent = car => {
    const { tabIndex } = this.state;
    switch (tabIndex) {
      case 1:
        return <StepOne loadNext={this.loadNext} car={car} />;
      case 2:
        return (
          <StepTwo
            loadNext={this.loadNext}
            loadPrevious={this.loadPrevious}
            car={car}
          />
        );
      case 3:
        return (
          <StepCarOwnersOnly
            loadNext={this.loadNext}
            loadPrevious={this.loadPrevious}
          />
        );

      case 4:
        return (
          <StepThree
            loadNext={this.loadNext}
            loadPrevious={this.loadPrevious}
            car={car}
          />
        );
      case 5:
        return (
          <StepFour
            loadNext={this.loadNext}
            loadPrevious={this.loadPrevious}
            car={car}
          />
        );
      case 6:
        return <StepFive loadPrevious={this.loadPrevious} car={car} />;
      default:
        break;
    }
  };

  loadNext = () => {
    const { tabIndex } = this.state;
    const { user } = this.props;
    let add = 1;
    window.scrollTo(0, 0);
    if (tabIndex == 1 && this.checkUserProfileIsCompleate()) {
      add = 2;
    }

    if (tabIndex == 1 && user.stripe_connect_account_id != null) {
      add = 3;
    }

    this.setState({ tabIndex: this.state.tabIndex + add });
  };

  loadPrevious = () => {
    const { tabIndex } = this.state;
    const { user } = this.props;
    let add = -1;
    window.scrollTo(0, 0);
    if (tabIndex == 3 && this.checkUserProfileIsCompleate()) {
      add = -2;
    }

    if (tabIndex == 4) {
      if (user) {
        if (user.stripe_connect_account_id != null) {
          add = -3;
        }
      }
    }

    this.setState({ tabIndex: this.state.tabIndex + add });
  };

  checkUserProfileIsCompleate = () => {
    const {
      first_name,
      last_name,
      date_of_birth,
      license_issued_state,
      driving_license_number,
      driving_license_expiration,
      phone_number,
      profile_image,
      verified_phone,
      street_address,
      state,
      city,
      zip_code
    } = this.props.user;
    if (
      first_name &&
      last_name &&
      date_of_birth &&
      street_address &&
      city &&
      state &&
      zip_code &&
      license_issued_state &&
      driving_license_number &&
      driving_license_expiration &&
      phone_number &&
      profile_image &&
      verified_phone === 1
    ) {
      return true;
    } else {
      return false;
    }
  };

  setCar = car => {
    if (!_.isEmpty(car)) {
      return {
        id: car.id,
        location: car.location,
        lat: car.latitude,
        lng: car.longitude,
        year: car.year,
        make_id: car.car_make.id,
        model_id: car.car_model.id,
        trim_id: car.trim.id,
        transmission: car.transmission,
        type: car.car_type,
        odometer: car.odometer,

        rent_car_longest: car.rent_car_longest,
        rent_car_shortest: car.rent_car_shortest,
        time_to_confirm: car.time_to_confirm,
        miles_allowed_per_day: car.miles_allowed_per_day,
        miles_allowed_per_week: car.miles_allowed_per_week,
        miles_allowed_per_month: car.miles_allowed_per_month,

        license_plate_number: car.license_plate_number,
        description: car.description,
        features: this.setFeaturs(car.features),
        car_photo: car.car_photo,
        daily_rate: car.daily_rate,
        discount_days: car.discount_days,
        discount: car.discount,
        delivery_option: car.delivery_option,
        car_free_delivery_location: this.setDeliveryLocations(
          car.free_dilivery_locations
        ),
        free_delivery_locations: car.free_dilivery_locations.map(location => {
          return location.id;
        }),
        multiple_discounts: car.multiple_discounts
          ? car.multiple_discounts
          : [],
        state: car.state,
        offer_delivery: car.offer_delivery,
        offer_dropoff_location: car.offer_dropoff_location
      };
    } else {
      return null;
    }
  };

  setDeliveryLocations = deliveryLocations => {
    if (deliveryLocations && deliveryLocations.length > 0) {
      let i = [];

      for (let index = 0; index < deliveryLocations.length; index++) {
        i.push(deliveryLocations[index].id);
      }
      return i;
    } else {
      return [];
    }
  };

  setFeaturs = features => {
    if (features && features.length > 0) {
      let i = [];
      for (let index = 0; index < features.length; index++) {
        i.push(features[index].id);
      }
      return i;
    } else {
      return [];
    }
  };

  render() {
    const { tabIndex } = this.state;
    const { user, car, incompleteCar } = this.props;

    let carObj = this.setCar(car);

    return (
      <Fragment>
        <MainNav />
        <InnerpageHeader header="LIST MY CAR" title="" />

        <div className="car-create car-view container">
          {user.id && (
            <Fragment>
              <h2 className="innerpage-headline">LIST MY CAR FOR RYDE</h2>
              {user.id &&
              user.user_can_add_booking["listing_status"] === false ? (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="alert alert-warning">
                      <strong /> {user.user_can_add_booking["listing_message"]}
                    </div>
                  </div>
                </div>
              ) : (
                <Fragment>
                  {incompleteCar &&
                  !_.isEmpty(incompleteCar) &&
                  !this.props.match.params.id ? (
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="alert alert-info">
                          Hi, <strong> {user.first_name}</strong> You have a
                          incomplete car listing . Do you want to{" "}
                          <strong>
                            {" "}
                            <Link to={"/car-create/" + incompleteCar.id}>
                              continue
                            </Link>
                          </strong>{" "}
                          ?
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <div className="tabs list-tabs">
                      <div className="tab-buttons-panel">
                        <a
                          className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                            1 && "btn-success"}`}
                        >
                          <span>
                            Car <br />
                            info
                          </span>
                        </a>
                        {this.checkUserProfileIsCompleate() === false && (
                          <a
                            className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                              2 && "btn-success"}`}
                          >
                            <span>
                              Your <br />
                              info
                            </span>
                          </a>
                        )}
                        {user && user.stripe_connect_account_id == null && (
                          <a
                            className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                              3 && "btn-success"}`}
                          >
                            <span>Car owners only</span>
                          </a>
                        )}
                        <a
                          className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                            4 && "btn-success"}`}
                        >
                          <span>
                            Your <br />
                            preferences
                          </span>
                        </a>
                        <a
                          className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                            5 && "btn-success"}`}
                        >
                          <span>Detail</span>
                        </a>
                        <a
                          className={`btn btn-default tab-buttons tab-middle-buttons pull-left ${tabIndex ==
                            6 && "btn-success"}`}
                        >
                          <span>
                            Car <br />
                            photos
                          </span>
                        </a>
                      </div>
                      <div className="car-form">
                        {this.setTabContent(carObj)}
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>

        <Suspense fallback={<PreLoader />}>
          <Footer />
        </Suspense>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  car: state.car.registeredCar,
  incompleteCar: state.car.userLastIncompleteCar
});

export default withRouter(connect(mapStateToProps)(checkAuth(CarListing)));
