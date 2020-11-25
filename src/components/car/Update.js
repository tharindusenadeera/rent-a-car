import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import InnerpageHeader from "../layouts/InnerPageHeader";
import UpdateForm from "../../pages/UpdateForm";
import moment from "moment";
import {
  getFeatures,
  getUsStates,
  getCarProtectionLevels,
  getCar,
  getDeliveryOptions,
  getFreeDeliveryLocations,
  updateCar,
  changeCarProtectionLevel,
  getRegisteredCarForEdit
} from "../../actions/CarActions";
import PreLoader from "../preloaders/preloaders";
import checkAuth from "../requireAuth";

class Update extends Component {
  constructor() {
    super();
    this.state = {
      showCarProtectionModal: false
    };
    this.editCar = this.editCar.bind(this);
    this.changeProtectionLevel = this.changeProtectionLevel.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.showCarProtection = this.showCarProtection.bind(this);
  }

  componentWillMount() {
    const { history } = this.props;
    if (!localStorage.access_token) {
      history.push("/login");
    } else {
      const { dispatch, car, match } = this.props;
      dispatch(getCarProtectionLevels());
      dispatch(getDeliveryOptions());
      dispatch(getUsStates());
      dispatch(getFeatures());
      dispatch(getFreeDeliveryLocations(match.params.id));
      dispatch(getRegisteredCarForEdit(match.params.id));
      dispatch(getCar(match.params.id));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
  }

  handleCloseModal() {
    this.setState({ showCarProtectionModal: false });
  }

  showCarProtection() {
    this.setState({ showCarProtectionModal: true });
  }

  changeProtectionLevel(selectedProtectionLevel) {
    const { dispatch, car } = this.props;
    dispatch(changeCarProtectionLevel(selectedProtectionLevel, car.id));
    this.handleCloseModal();
  }

  editCar(data) {
    const { dispatch } = this.props;

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
    delete data.discount_daily;
    delete data.discount_weekly;
    delete data.discount_monthly;
    dispatch(updateCar(data));
  }

  initialValues(car, user, carDetails) {
    let title = "80 % of the protection covers the ...";
    let value = 80;
    if (
      carDetails.car_protection_change_log &&
      carDetails.car_protection_change_log.length &&
      carDetails.car_protection_change_log != "undefined" &&
      carDetails.car_protection_change_log[0].car_protection_level
    ) {
      title =
        carDetails.car_protection_change_log[0].car_protection_level.title;
      value =
        carDetails.car_protection_change_log[0].car_protection_level.value;
    }

    if (this.props.match.params.id && car.id && user.id) {
      const feature = car.features.map(fet => {
        return fet.id;
      });
      const freeDelivery = car.free_dilivery_locations.map(fet => {
        return fet.id;
      });

      let dailyDiscount = "";
      let weeklyDiscount = "";
      let monthlyDiscount = "";

      if (car.multiple_discounts)
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

      return {
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
        date_of_birth: moment(user.date_of_birth).format("MM-DD-YYYY"),
        license_issued_state: user.license_issued_state,
        driving_license_number: user.driving_license_number,
        rent_car_shortest: car.rent_car_shortest,
        rent_car_longest: car.rent_car_longest,
        time_to_confirm: car.time_to_confirm,
        miles_allowed_per_day: car.miles_allowed_per_day,
        miles_allowed_per_week: car.miles_allowed_per_week,
        miles_allowed_per_month: car.miles_allowed_per_month,
        delivery_option: car.delivery_option
          ? car.delivery_option.toString()
          : null,
        offer_free_delivery: car.offer_free_delivery,
        car_free_delivery_location: freeDelivery,
        license_plate_number: car.license_plate_number,
        state: car.state,
        daily_rate: car.daily_rate,
        // discount: car.discount,
        // discount_days: car.discount_days,
        discount_daily: dailyDiscount,
        discount_weekly: weeklyDiscount,
        discount_monthly: monthlyDiscount,
        description: car.description,
        pickup_instructions: car.pickup_instructions,
        features: feature,
        car_photo: car.car_photo,
        offer_dropoff_location: car.offer_dropoff_location,
        offer_delivery: car.offer_delivery,
        currentProtectionLevel: {
          title: title,
          value: value
        }
      };
    } else {
      return null;
    }
  }

  render() {
    const {
      usStates,
      delivery_options,
      free_delivery_loations,
      features,
      car,
      user,
      carProtectionLevels,
      carDetails,
      fetching
    } = this.props;

    return (
      <Fragment>
        <MainNav />
        <InnerpageHeader header="EDIT YOUR CAR" title="" />
        {fetching ? (
          <div className="car-edit-spin">
            <PreLoader />
          </div>
        ) : null}
        <div className="car-create car-view container">
          {car &&
          car.id &&
          car.id == this.props.match.params.id &&
          carProtectionLevels.length &&
          this.initialValues(car, user, carDetails) ? (
            <UpdateForm
              car={carDetails}
              usStates={usStates}
              features={features}
              onSubmit={this.editCar}
              freeDeliveryLoations={free_delivery_loations}
              initialValues={this.initialValues(car, user, carDetails)}
              delivery_options={delivery_options}
              carProtectionLevels={carProtectionLevels}
              changeProtectionLevel={this.changeProtectionLevel}
              showCarProtection={this.showCarProtection}
              handleCloseModal={this.handleCloseModal}
              showCarProtectionModal={this.state.showCarProtectionModal}
            />
          ) : (
            <Fragment />
          )}
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user.user,
  makes: state.car.makes,
  carModels: state.car.carModels,
  trims: state.car.trims,
  features: state.car.features,
  usStates: state.car.usStates,
  fetching: state.car.fetching,
  car: state.car.registeredCarForEdit,
  carDetails: state.car.car,
  delivery_options: state.car.delivery_options,
  free_delivery_loations: state.car.free_delivery_loations,
  carProtectionLevels: state.car.carProtectionLevels
});

export default withRouter(connect(mapStateToProps)(checkAuth(Update)));
