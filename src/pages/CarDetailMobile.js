import "react-dates/initialize";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import queryString from "query-string";
import moment from "moment-timezone";
import ReactPixel from "react-facebook-pixel";
import {
  CAR_V2,
  DONE_FETCHING,
  TRANSACTION_FAILED,
  DONE_FETCHING_V2,
  IS_FETCHING_V2
} from "../actions/ActionTypes";
import { CarSearchHeaderFilter } from "../components/organisms/car-header-filter";
import { HamburgerMenu } from "../components/organisms/hamburger-menu";
import { AddFavourite } from "../components/organisms/add-to-favourite";
import { fetchSimilarCars } from "../actions/CarActions";
import { fetchCar, fetchAuthCar } from "../api/car";
import { fetchTimeZone } from "../actions/CommenActions";
import ShareOn from "../components/organisms/share-on/lib";
import { CarDetailIntro } from "../components/organisms/car-detail-intro";
import { authFail } from "../actions/AuthAction";
import {
  MilesIncludedCarDetail,
  DeliveryOption,
  CarLocation,
  MainCarousel,
  MobileCalendar,
  CarOffers,
  CarFeaturesSection,
  Reviews,
  Reserve
} from "../components/organisms/car-detail/";
import { CarCoverageInfo } from "../components/organisms/car-coverage-info";
import HostInfo from "../components/organisms/host-info/lib";
import { FeaturedRydeCarousel } from "../components/organisms/featured-ryde-carousel";
import { DescriptionSection } from "../components/molecules";
import { PRODUCT_CATALOG_ID } from "../consts/consts.js";
import { fetchAuthBookingData, saveUserDataInCarDetails } from "../api/trips";
import {
  getBookingData,
  getBookingDataAuth,
  setTripsData
} from "../api/booking";
import "../Revamp2019.css";
class CarDetailMobile extends Component {
  constructor(props) {
    super(props);
    const { history, match } = props;
    const queryData = queryString.parse(history.location.search);
    this.state = {
      showModal: false,
      routeData: queryData,
      value: 1,
      car_id: match.params.id,
      from: moment(
        queryData.from + " " + queryData.fromTime,
        "MM-DD-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm"),
      to: moment(
        queryData.to + " " + queryData.toTime,
        "MM-DD-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm"),
      fromTime: moment(queryData.from).format("HH:mm"),
      toTime: moment(queryData.to).format("HH:mm")
    };
  }

  componentWillMount() {
    const { car_id } = this.state;
    const { dispatch, car, authenticated } = this.props;
    const submittedData = localStorage.promotion_a_data;
    let fetchParams = {};
    if (submittedData && authenticated === false) {
      let localData = JSON.parse(submittedData);
      if (localData.email) {
        fetchParams.email = localData.email;
      }
    }
    if (localStorage.access_token) {
      fetchAuthCar(
        car_id,
        !car || (car && car.id != car_id) ? true : false,
        fetchParams
      )
        .then(response => {
          dispatch({ type: CAR_V2, payload: response.data.car });
          dispatch(
            fetchTimeZone(
              response.data.car.latitude,
              response.data.car.longitude
            )
          );
          dispatch({ type: DONE_FETCHING });
        })
        .catch(e => dispatch(authFail(e)));
    } else {
      fetchCar(
        car_id,
        !car || (car && car.id != car_id) ? true : false,
        fetchParams
      )
        .then(response => {
          dispatch({ type: CAR_V2, payload: response.data.car });
          dispatch(
            fetchTimeZone(
              response.data.car.latitude,
              response.data.car.longitude
            )
          );
          dispatch({ type: DONE_FETCHING });
        })
        .catch({});
    }
    dispatch(fetchSimilarCars(car_id));
  }

  componentDidMount() {
    this._fetchBookingData();
    ReactPixel.pageView();
  }

  componentDidUpdate(prevProps) {
    const { user, car } = this.props;
    if (prevProps.car == null && car != prevProps.car) {
      var car_id = car.id;
      car_id = String(car_id);
      ReactPixel.track("ViewContent", {
        content_name: car.car_name,
        content_ids: car_id,
        content_type: "product",
        value: car.daily_rate,
        currency: "USD",
        contents: [{ id: car.id, quantity: 2 }],
        product_catalog_id: PRODUCT_CATALOG_ID
      });
    }

    if (prevProps.car == null && car != prevProps.car && user && user.id) {
      setTimeout(() => {
        saveUserDataInCarDetails(car.id);
      }, 3000);
    }
  }

  _filteredData = () => {
    const { from, to } = this.state;
    const { match, timeZoneId } = this.props;
    return {
      from_date: moment(from).format("YYYY-MM-DD HH:mm"),
      to_date: moment(to).format("YYYY-MM-DD HH:mm"),
      car_id: match.params.id,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: timeZoneId
    };
  };

  reserveCar = () => {
    console.log("test");

    const { history, match, bookingData } = this.props;
    const { from, fromTime, to, toTime } = queryString.parse(
      history.location.search
    );

    ReactPixel.track("InitiateCheckout", {
      content_ids: bookingData.car_id,
      value: bookingData.daily_rate_per_day,
      currency: "USD",
      contents: [{ id: bookingData.car_id, quantity: 1 }],
      num_items: 1,
      content_type: "product"
    });

    history.push(
      `/car-delivery/${match.params.id}/${from}/${fromTime}/${to}/${toTime}`
    );
  };

  afterLogin = () => {
    return fetchAuthBookingData(this._filteredData());
  };

  getTimeZoneId = () => {
    const { history } = this.props;
    const searchQuery = queryString.parse(history.location.search);
    if (searchQuery.timeZoneId) {
      return searchQuery.timeZoneId;
    }
    return this.props.timeZoneId;
  };

  _fetchBookingData = () => {
    const { dispatch, authenticated } = this.props;
    dispatch({ type: IS_FETCHING_V2 });
    if (authenticated == true) {
      dispatch(getBookingDataAuth(this._filteredData(), "details"))
        .then(response => {
          dispatch({ type: TRANSACTION_FAILED, payload: "" });

          localStorage.setItem(
            "__tripDurationData",
            JSON.stringify({
              id: response.data.data.car_id,
              option: response.data.data.delivery_option,
              offerdelivery: response.data.data.offer_delivery,
              date: moment().format("YYYY-MM-DD HH:mm")
            })
          );
          dispatch(setTripsData(response.data.data));
          dispatch({ type: DONE_FETCHING_V2 });
        })
        .catch({});
    } else {
      dispatch(getBookingData(this._filteredData(), "details"))
        .then(response => {
          dispatch({ type: TRANSACTION_FAILED, payload: "" });
          localStorage.setItem(
            "__tripDurationData",
            JSON.stringify({
              id: response.data.data.car_id,
              option: response.data.data.delivery_option,
              offerdelivery: response.data.data.offer_delivery,
              date: moment().format("YYYY-MM-DD HH:mm")
            })
          );

          dispatch(setTripsData(response.data.data));
          dispatch({ type: DONE_FETCHING_V2 });
        })
        .catch({});
    }
  };

  _changeUrl = data => {
    const { from, to } = this.state;
    const { history } = this.props;
    if (data.location) {
      history.push({
        pathname: "/cars",
        search: queryString.stringify({
          location: data.location,
          lat: data.lat,
          lng: data.lng,
          from: moment(from).format("MM-DD-YYYY"),
          to: moment(to).format("MM-DD-YYYY"),
          fromTime: moment(from).format("HH:mm"),
          toTime: moment(to).format("HH:mm")
        })
      });
    } else if (data.from && data.to) {
      this.setState({ from: data.from, to: data.to }, () =>
        this._fetchBookingData()
      );
    } else if (data.from) {
      this.setState({ from: data.from }, () => this._fetchBookingData());
    } else if (data.to) {
      this.setState({ to: data.to }, () => this._fetchBookingData());
    }
  };

  render() {
    const { routeData, car_id, from, to, fromTime, toTime } = this.state;
    const {
      car,
      authenticated,
      history,
      match,
      bookingData,
      isFetching
    } = this.props;

    return (
      <div className="wrapper">
        <header className="header">
          <div className="brand">
            <Link to="/">
              <img src="/images/ryde-logo.png" className="logo" />
            </Link>
          </div>
          {routeData.location ? (
            <div className="search">
              <CarSearchHeaderFilter
                routeData={routeData}
                _changeUrl={this._changeUrl}
                _fetchBookingData={this._fetchBookingData}
                source={"detail"}
              />
            </div>
          ) : null}

          <HamburgerMenu />
        </header>

        <div className="car-carousal">
          <MainCarousel car={car && car} />
          <div className="car-carousal-icon-bar flex-default">
            <AddFavourite
              carId={car_id}
              favourite={car && car.is_auth_user_favorite_car}
              userId={authenticated}
            />
            <ShareOn car={car && car} />
          </div>
        </div>
        <div className="content-page">
          <CarDetailIntro car={car && car} />
          {!routeData.location ? (
            <div className="inner-z">
              <MobileCalendar
                timeZoneId={this.getTimeZoneId()}
                history={history}
                _fetchBookingData={this._fetchBookingData}
                match={match}
                authenticated={authenticated}
                source="details"
              />
            </div>
          ) : null}

          <CarOffers car={car} location={routeData.location} />
          <DeliveryOption car={car} bookingData={bookingData} />
          <CarCoverageInfo />
          <CarFeaturesSection features={car && car.features} car={car} />
          <MilesIncludedCarDetail car={car && car} />
          {car && car.description ? (
            <div className="detail-card inner">
              <DescriptionSection
                title={"Description"}
                description={car && car.description}
              />
            </div>
          ) : null}

          <HostInfo host={car} />
          {car ? <Reviews id={car.id} car={car} /> : <Fragment />}
          <CarLocation car={car && car} />
          <FeaturedRydeCarousel
            car_id={car_id}
            from={from}
            to={to}
            fromTime={fromTime}
            toTime={toTime}
            authenticated={authenticated}
          />
        </div>
        <Reserve
          bookingData={bookingData}
          reserveCar={this.reserveCar}
          authenticated={authenticated}
          afterLogin={this.afterLogin}
          isLoading={isFetching}
        />
        <div className="footer"></div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  bookingData: state.booking.bookingData,
  user: state.user.user,
  car: state.car.car_v2,
  timeZoneId: state.common.timeZoneId,
  authenticated: state.user.authenticated,
  isFetching: state.common.isFetching
});

export default connect(mapStateToProps)(withRouter(CarDetailMobile));
