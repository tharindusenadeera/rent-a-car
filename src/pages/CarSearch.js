import React, { Component, Fragment, lazy, Suspense } from "react";
import { connect } from "react-redux";
import Rating from "react-rating";
import Modal from "react-modal";
import "react-lazy-load-image-component/src/effects/blur.css";
import queryString from "query-string";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../consts/consts.js";
import { isMobileOnly, isMobile } from "react-device-detect";
import Collapsible from "react-collapsible";
import Helmet from "react-helmet";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import Switch from "react-switch";
import moment from "moment-timezone";
import { Link, withRouter } from "react-router-dom";
import { LazyImage } from "../components/comman";
import { milesPerDay, carTypes } from "../consts/consts";
import { getCarMakes, getFeatures } from "../actions/CarActions";
import MainFilterMobile from "../components/car/CarMainFilterMobile";
import MoreFiltersMobile from "../components/car/CarMoreFilterMobile";
import { fetchTimeZone } from "../actions/CommenActions";
import MainNav from "../components/layouts/MainNav";
import UserAuthModel from "../components/forms/UserAuthModel";
import PromotionBanner from "../components/home-page-components/banners/PromotionBanner";
import { authFail } from "../actions/AuthAction.js";
import { GET_LOGGED_IN_USER } from "../actions/ActionTypes";
import PreLoader from "../components/preloaders/preloaders.js";

const MainFilterWeb = lazy(() => import("../components/car/CarMainFilterWeb"));
const MoreFiltersWeb = lazy(() => import("../components/car/CarMoreFilterWeb"));
const CarListMapView = lazy(() => import("../components/car/CarListMapView"));
const MainFooter = lazy(() => import("../components/layouts/MainFooter"));

class CarSearch extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const queryData = queryString.parse(history.location.search);

    const caliDateTime = moment()
      .add(3, "hours")
      .tz(props.timeZoneId);
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");

    let fromDate = moment(
      moment(queryData.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        queryData.fromTime
    );

    if (caliDateTime.isAfter(fromDate)) {
      fromDate = moment(
        caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
      );
    }

    const toDate = moment(
      moment(queryData.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        queryData.toTime
    );
    const roundedNow = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );

    //setup calendar min from date
    const caliFromDateTime = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD");
    const caliFromDateTimeNoon = moment(caliFromDateTime)
      .startOf("day")
      .add(12, "hours");
    const caliFromDateTimeMidNight = moment(caliFromDateTime).endOf("day");
    const calendarFromDate =
      caliFromDateTime > caliFromDateTimeNoon &&
      caliFromDateTime < caliFromDateTimeMidNight
        ? moment(caliFromDateTime).subtract(1, "days")
        : moment(caliFromDateTime);

    this.state = {
      showModelPopUp: false,
      showMapview: false,
      moreFilter: false,

      address: queryData.location,
      county: null,
      lat: queryData.lat,
      lng: queryData.lng,
      from: fromDate,
      minFrom: calendarFromDate,
      to: toDate,
      minTo: "",
      roundedNow: roundedNow,
      filters: {},

      carType: "",
      priceRange: { min: 0, max: 2000 },
      makeId:
        queryData.makeId || queryData.makeId !== "all" ? queryData.makeId : "",
      transmission: "",
      distancePerDay: "",
      yearRange: { min: 1994, max: new Date().getFullYear() + 1 },
      deliveryLocations: [],
      deliveryLocationId: "",
      selectedFeatures: [],

      tracks: [],
      hasMoreItems: true,
      nextHref: null,
      initialLoad: false,
      pageStart: 0,
      latsPage: 0,
      totalResults: 0,
      totalPages: 0,
      isReset: false,

      filtered_search: false,
      favorite_cars: [],
      showModelPopUpAuthentication: false
    };
    this.loadItems = this.loadItems.bind(this);
  }

  componentWillMount() {
    const { from, to, minFrom, lat, lng, address } = this.state;
    this.fetchGeocodeByAddress(address);
    const { dispatch } = this.props;

    dispatch(fetchTimeZone(lat, lng));

    let toDate = to;
    let fromDate = from;
    if (from.isAfter(toDate) || from.isSame(toDate)) {
      toDate = moment(from).add(3, "days");

      this.setState({ to: toDate }, () => {
        this._chagenUrl();
      });
    }
    if (minFrom.isAfter(fromDate) || minFrom.isSame(fromDate)) {
      fromDate = minFrom;
      this.setState({ from: fromDate }, () => {
        this._chagenUrl();
      });
    }
  }

  componentDidMount() {
    const { dispatch, carMakes, features, history } = this.props;
    const queryData = queryString.parse(history.location.search);
    if (carMakes.length == 0) {
      dispatch(getCarMakes("registered-makes"));
    }
    if (features.length == 0) {
      dispatch(getFeatures());
    }
    this.fetchSearchDelivery();
    if (
      this.props.carMakes &&
      this.props.carMakes.length > 0 &&
      queryData.makeId != "all"
    ) {
      let filters = this.state.filters;
      let value = this.props.carMakes.filter(item => {
        return item.id == queryData.makeId;
      });
      if (queryData.makeId && value.length) {
        filters.makeId = value[0]["name"];
      }
      this.setState({
        makeId: queryData.makeId,
        filters: filters
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;
    const queryData = queryString.parse(history.location.search);
    if (
      nextProps.carMakes &&
      nextProps.carMakes.length > 0 &&
      queryData.makeId
    ) {
      let filters = this.state.filters;
      let value = nextProps.carMakes.filter(item => {
        return item.id == queryData.makeId;
      });
      if (queryData.makeId && value.length) {
        filters.makeId = value[0]["name"];
      }
      this.setState({
        makeId: queryData.makeId,
        filters: filters
      });
    }
    if (nextProps.timeZoneId != this.props.timeZoneId) {
      // console.log("this.props.timeZoneId", this.props.timeZoneId);
      // console.log("nextProps.timeZoneId", nextProps.timeZoneId);
      // console.log("------------------------------");
      // this.setInitalTimes(nextProps.timeZoneId);
    }
  }

  setInitalTimes = timeZoneId => {
    const { history } = this.props;
    const queryData = queryString.parse(history.location.search);

    let userDateTime = moment().add(3, "hours");

    if (timeZoneId) {
      userDateTime = moment()
        .add(3, "hours")
        .tz(timeZoneId);
    }
    const remainder = 30 - (userDateTime.minute() % 30);
    const timeToDisplay = moment(userDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");
    let fromDate = moment(
      moment(queryData.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        queryData.fromTime
    );
    const roundedNow = moment(
      userDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );

    const toDate = moment(
      moment(queryData.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        queryData.toTime
    );

    const minFrom = moment(userDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD");
    let fDClone = fromDate.clone();
    let minToDate = moment(fDClone.add(3, "hours")).format("YYYY-MM-DD");

    this.setState({
      from: fromDate,
      minFrom: minFrom,
      minTo: minToDate,
      roundedNow: roundedNow,
      to: toDate
    });
  };

  fetchSearchDelivery = async () => {
    try {
      const { lat, lng } = this.state;
      const response = await await axios.get(
        process.env.REACT_APP_API_URL + "car/delivery",
        {
          params: {
            lat: lat,
            lng: lng
          }
        }
      );
      if (!response.data.error) {
        this.setState({ deliveryLocations: response.data.delivery });
      }
    } catch (error) {
      console.log(error);
    }
  };

  onChangeAddress = address => {
    this.setState({ address: address, filtered_search: true });
    const { dispatch } = this.props;
    this.fetchGeocodeByAddress(address, latLng => {
      const { lat, lng } = latLng;
      this.setState({ lat: lat, lng: lng }, () => {
        dispatch(fetchTimeZone(lat, lng));
        this._chagenUrl();
        this.fetchSearchDelivery();
      });
    });
  };

  fetchGeocodeByAddress = (address, callBack = null) => {
    geocodeByAddress(address).then(results => {
      const address_components = results[0].address_components;

      let county = address_components.find(i => {
        return i.types.find(j => {
          return j == "administrative_area_level_2";
        });
      });
      if (county) {
        let countryName = county.long_name.split("County");
        if (countryName) {
          this.setState({ county: countryName[0] });
        }
      }
      getLatLng(results[0]).then(latLng => {
        if (callBack) callBack(latLng);
      });
    });
  };

  handleDateChangeFrom = from => {
    // check if the to date is smaller that this value if so add three more days and set it
    const fromDate = moment(
      moment(from).format("YYYY-MM-DD") +
        " " +
        moment(this.state.from).format("HH:mm")
    );
    const toDate = moment(fromDate).add(3, "days");
    this.setState({ from: fromDate, to: toDate }, () => {
      this._chagenUrl();
    });
  };

  handleDateChangeTo = to => {
    let toDate = moment(
      moment(to).format("YYYY-MM-DD") +
        " " +
        moment(this.state.to).format("HH:mm")
    );
    let duration = moment.duration(toDate.diff(this.state.from));
    let hours = duration.asHours();
    if (hours <= 3) {
      this.setState({ to: moment(toDate).add(3, "hours") }, () => {
        this._chagenUrl();
      });
    } else {
      this.setState({ to: toDate }, () => {
        this._chagenUrl();
      });
    }
  };

  handleTimeChangeFrom = e => {
    let fromDate = moment(
      moment(this.state.from).format("YYYY-MM-DD") + " " + e.target.value
    );
    if (fromDate.isAfter(this.state.to) || fromDate.isSame(this.state.to)) {
      let to = moment(
        moment(this.state.to).format("YYYY-MM-DD") + " " + e.target.value
      ).add(3, "days");
      this.setState({ from: fromDate, to: to }, () => {
        this._chagenUrl();
      });
    } else {
      this.setState({ from: fromDate }, () => {
        this._chagenUrl();
      });
    }
  };

  handleTimeChangeTo = e => {
    let toDate = moment(
      moment(this.state.to).format("YYYY-MM-DD") + " " + e.target.value
    );
    this.setState({ to: toDate }, () => {
      this._chagenUrl();
    });
  };

  _timeMaker = (selectedTime, isToTime) => {
    const from = moment(this.state.from);
    const to = moment(this.state.to);
    const minFrom = this.state.roundedNow;
    const minTo = moment(
      from.format("YYYY-MM-DD") + " " + moment(this.state.from).format("HH:mm")
    ).add(3, "hours");
    let startDate;
    let endDate;
    if (!isToTime) {
      startDate = minFrom;
      endDate = moment(moment(from).format("YYYY-MM-DD") + " " + selectedTime);
    } else {
      startDate = minTo;
      endDate = moment(moment(to).format("YYYY-MM-DD") + " " + selectedTime);
    }
    if (startDate.isAfter(endDate)) {
      return true;
    } else {
      return false;
    }
  };

  _chagenUrl = () => {
    const { address, lat, lng, from, to } = this.state;
    const { history } = this.props;
    history.push({
      pathname: "/cars",
      search: queryString.stringify({
        location: address,
        lat: lat,
        lng: lng,
        from: moment(from).format("MM-DD-YYYY"),
        to: moment(to).format("MM-DD-YYYY"),
        fromTime: moment(from).format("HH:mm"),
        toTime: moment(to).format("HH:mm")
      })
    });
  };

  _onChangeFeatures = (e, id) => {
    let filters = this.state.filters;
    let checked = this.state.selectedFeatures;
    if (e.target.checked) {
      checked.push(id);
    } else {
      checked = this.state.selectedFeatures.filter(item => {
        return item !== id;
      });
    }
    filters.features = checked;
    this.setState({ selectedFeatures: checked });
  };
  _getFilteredData = (address = null, lat = null, lng = null) => {
    const {
      from,
      to,
      carType,
      selectedFeatures,
      makeId,
      transmission,
      deliveryLocationId,
      yearRange,
      distancePerDay,
      priceRange,
      county,
      filtered_search
    } = this.state;
    const fromDate = moment(from).format("YYYY-MM-DD HH:mm:ss");
    const toDate = moment(to).format("YYYY-MM-DD HH:mm:ss");
    let data = {
      from: fromDate,
      to: toDate,
      timeZoneId: this.props.timeZoneId,
      priceRange: priceRange ? JSON.stringify(priceRange) : null,
      yearRange: yearRange ? JSON.stringify(yearRange) : null
    };
    if (transmission) {
      data.transmission = transmission;
    }
    if (makeId && makeId != "all") {
      data.makeId = makeId;
    }
    if (distancePerDay) {
      data.distancePerDay = distancePerDay;
    }
    if (carType) {
      data.carType = carType;
    }
    if (deliveryLocationId) {
      data.delivery = deliveryLocationId;
    }
    if (address && lat && lng) {
      data.location = address;
      data.lat = lat;
      data.lng = lng;
    } else {
      data.location = this.state.address;
      data.lat = this.state.lat;
      data.lng = this.state.lng;
    }
    if (selectedFeatures.length > 0) {
      data.features = selectedFeatures;
    }
    if (county) {
      data.county = county;
    }
    if (filtered_search) {
      data.filtered_search = filtered_search;
    }
    const submittedData = localStorage.promotion_a_data;
    if (submittedData) {
      let localData = JSON.parse(submittedData);
      if (localData.email) {
        data.email = localData.email;
      }
    }

    return data;
  };
  _onLocationChange = e => this.setState({ address: e });

  _onChangeCarTypes = e => {
    let filters = this.state.filters;

    if (e.target.value) {
      filters.carType = e.target.value;
    } else {
      delete filters["carType"];
    }
    this.setState({ carType: e.target.value, filters: filters });
  };

  _onChangePriceRange = e => {
    let filters = this.state.filters;
    e.max = e.max > 2000 ? 2000 : e.max;
    filters.priceRange = "$ " + e.min + " - $ " + e.max;
    this.setState({ priceRange: { min: e.min, max: e.max } });
  };

  _onChangeCarMakes = e => {
    let filters = this.state.filters;
    let value = this.props.carMakes.filter(item => {
      return item.id == e.target.value;
    });
    if (e.target.value) {
      filters.makeId = value[0]["name"];
    } else {
      delete filters["makeId"];
    }
    this.setState({ makeId: e.target.value, filters: filters });
  };

  _onChangeTransmission = e => {
    let filters = this.state.filters;
    let value = [{ 1: "Automatic" }, { 0: "Manual" }].filter(item => {
      return Object.keys(item) == e.target.value;
    });
    if (e.target.value) {
      filters.transmission = Object.values(value[0])[0];
    } else {
      delete filters["transmission"];
    }
    this.setState({ transmission: e.target.value, filters: filters });
  };

  _onChangeMilesPerDay = e => {
    let filters = this.state.filters;
    if (e.target.value) {
      filters.distancePerDay = e.target.value;
    } else {
      delete filters["distancePerDay"];
    }
    this.setState({ distancePerDay: e.target.value, filters: filters });
  };

  _onChangeYearRange = e => {
    let filters = this.state.filters;
    filters.yearRange = e.min + " - " + e.max;
    this.setState({ yearRange: { min: e.min, max: e.max }, filters: filters });
  };

  _onChangeDeliveryLocation = e => {
    let filters = this.state.filters;
    let value = this.state.deliveryLocations.filter(item => {
      return item.id == e.target.value;
    });
    if (e.target.value) {
      filters.deliveryLocationId = value[0]["name"];
    } else {
      delete filters["deliveryLocationId"];
    }

    this.setState({ deliveryLocationId: e.target.value, filters: filters });
  };

  openMapViwe = () => {
    if (this.state.showMapview) {
      this.setState({ showMapview: !this.state.showMapview });
    } else {
      this.setState({ showMapview: !this.state.showMapview });
    }
  };

  submitForm = () => {
    const { address, lat, lng } = this.state;
    const { authenticated } = this.props;
    if (!address) {
      return false;
    }

    localStorage.setItem("_source_location", address);
    localStorage.setItem("_source_lat", lat);
    localStorage.setItem("_source_lng", lng);

    this.setState({
      tracks: [],
      hasMoreItems: true,
      latsPage: 0,
      totalResults: 0,
      isReset: true
    });
    if (!authenticated) {
      // User Search Data into localStorage
      let searchDataArray = [];
      let searchData = { location: address, latitude: lat, longitude: lng };
      if (!localStorage.getItem("searchData")) {
        searchDataArray.push(searchData);
        localStorage.setItem("searchData", JSON.stringify(searchDataArray));
      } else {
        searchDataArray = JSON.parse(localStorage.getItem("searchData"));
        const isDuplicated = searchDataArray.some(
          data => data.location === searchData.location
        );
        if (!isDuplicated) {
          searchDataArray.push(searchData);
          localStorage.setItem("searchData", JSON.stringify(searchDataArray));
        }
      }
    }
  };

  loadItems() {
    const { from, to, minFrom, latsPage } = this.state;
    const { user, dispatch } = this.props;
    let toDate = to;
    let fromDate = from;
    if (!this.state.hasMoreItems) {
      return false;
    }

    if (moment(from).isAfter(toDate) || moment(from).isSame(toDate)) {
      toDate = moment(from).add(3, "hours");
      this.setState({ to: toDate }, () => {
        this._chagenUrl();
      });
    }

    if (moment(minFrom).isAfter(fromDate) || moment(minFrom).isSame(fromDate)) {
      fromDate = minFrom;
      this.setState({ from: fromDate }, () => {
        this._chagenUrl();
      });
    }
    var queryString = this._getFilteredData();

    queryString.page = latsPage + 1;
    let url = "";
    if (user && user.id) {
      url = process.env.REACT_APP_API_URL + "v2/auth/cars?include=user";
    } else {
      url = process.env.REACT_APP_API_URL + "v2/cars?include=user";
    }
    axios
      .get(url, {
        params: queryString,
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        if (!response.data.error) {
          let track = this.state.tracks;
          if (response.data.cars.data.length > 0) {
            response.data.cars.data.map(i => {
              track.push(i);
            });

            this.setState({
              tracks: [...new Set(track)],
              hasMoreItems: true,
              latsPage: response.data.cars.meta.pagination.current_page,
              totalResults: response.data.cars.meta.pagination.total,
              totalPages: response.data.cars.meta.pagination.total_pages
            });
          } else {
            this.setState({
              hasMoreItems: false
            });
          }
        }
      })
      .catch(e => {
        dispatch(authFail(e));
        dispatch({
          type: GET_LOGGED_IN_USER,
          payload: { id: null, first_name: null }
        });
        this.loadItems();
      });
  }

  loadMoreForMap = () => {
    if (this.state.hasMoreItems && this.state.showMapview) {
      this.loadItems(this.state.latsPage);
    }
  };

  _toggleFavorites = async (id, isRemove) => {
    try {
      const { user } = this.props;
      let checked = this.state.favorite_cars;
      if (!isRemove) {
        checked.push(id);
      } else {
        checked = this.state.favorite_cars.filter(item => {
          return item !== id;
        });
      }
      this.setState({
        favorite_cars: checked
      });

      if (user.id) {
        const response = await await axios.post(
          process.env.REACT_APP_API_URL + `add-to-favorite`,
          { car_id: id },
          {
            headers: {
              Authorization: localStorage.access_token
            }
          }
        );
      } else {
        this.setState({ showModelPopUpAuthentication: true });
      }
    } catch (error) {
      console.log(error.response.status == 401);

      this.props.dispatch(authFail(error));
    }
  };

  _item = car => {
    const { from, to } = this.state;

    return (
      <div className="track col-xs-12 col-sm-6 col-md-4 col-lg-4">
        <div className="car-list-item-wrapper">
          {/* full div should be clickable */}

          <div className="cli-car-image">
            {car.is_insurance_discounted == true && (
              <LazyImage
                className="offer-badge-thum"
                src="/images/offers/offer-badge-thum.svg"
                height="69"
                width="88"
              />
            )}
            {/* --------------- Coupon Icons - Start -------------*/}
            {car.december_promotion === 1 && (
              <LazyImage
                className="coupon-badge-thum"
                src="https://cdn.rydecars.com/static-images/gift-coupon-30.svg"
                height="69"
                width="88"
              />
            )}
            {car.december_promotion === 2 && (
              <LazyImage
                className="coupon-badge-thum"
                src="https://cdn.rydecars.com/static-images/gift-coupon-40.svg"
                height="69"
                width="88"
              />
            )}
            {car.december_promotion === 3 && (
              <LazyImage
                className="coupon-badge-thum"
                src="https://cdn.rydecars.com/static-images/gift-coupon-75.svg"
                height="69"
                width="88"
              />
            )}
            {/* ---------------- Coupon Icons - End --------------*/}
            <Link
              target="_blank"
              to={{
                pathname: `/car/${car.name}/${car.id}`,
                search: queryString.stringify({
                  from: moment(from).format("MM-DD-YYYY"),
                  fromTime: moment(from).format("HH:mm"),
                  to: moment(to).format("MM-DD-YYYY"),
                  toTime: moment(to).format("HH:mm"),
                  timeZoneId: this.props.timeZoneId,
                  _from: "cardetails"
                })
              }}
            >
              <LazyImage
                withloader="content-loader"
                className="img-responsive img-rounded"
                src={car.car_photos.data.image_thumb}
                width={400}
                height={248}
              />
            </Link>
            {this.props.user.id == null && (
              <button onClick={() => this._toggleFavorites()}>
                <span className="icon-set-one-like icon-heart-click" />
              </button>
            )}

            {this.props.user && this.props.user.id && (
              <button
                onClick={() =>
                  this._toggleFavorites(
                    car.id,
                    car.is_auth_user_favorite_car ||
                      this.state.favorite_cars.includes(car.id)
                      ? true
                      : false
                  )
                }
              >
                {car.is_auth_user_favorite_car ||
                this.state.favorite_cars.includes(car.id) ? (
                  <span className="icon-set-one-like-filled" />
                ) : (
                  <span className="icon-set-one-like icon-heart-click" />
                )}
              </button>
            )}
          </div>

          <div className="cli-car-info">
            <div className="cli-car-name-outer">
              <Link
                className="cli-car-name"
                target="_blank"
                to={{
                  pathname: `/car/${car.name}/${car.id}`,
                  search: queryString.stringify({
                    from: moment(from).format("MM-DD-YYYY"),
                    fromTime: moment(from).format("HH:mm"),
                    to: moment(to).format("MM-DD-YYYY"),
                    toTime: moment(to).format("HH:mm"),
                    timeZoneId: this.props.timeZoneId,
                    _from: "cardetails"
                  })
                }}
              >
                {car.car_name}
              </Link>
            </div>
            <div className="cli-car-price">
              $ {car.daily_rate} <span>per day</span>
            </div>
          </div>
          <div className="cli-car-owner-info">
            <div className="cli-car-owner-innner cli-hori-sep">
              <Link target="_blank" to={`/profile/${car.user.data.id}`}>
                <div className="cli-car-owner-image">
                  <LazyImage
                    className="img-circle cli-owner"
                    src={
                      car.user.data.profile_image_thumb
                        ? car.user.data.profile_image_thumb
                        : "/images/defaultprofile.jpg"
                    }
                    width={30}
                    height={30}
                  />
                  <LazyImage
                    width={15}
                    height={15}
                    className="cli-owner-verify"
                    src="/images/checkout/verify-sm-icon.png"
                  />
                </div>
              </Link>
              <Link
                className="cli-car-owner-name"
                target="_blank"
                to={`/profile/${car.user.data.id}`}
              >
                {car.user.data.first_name}
              </Link>
            </div>
            {car.car_rating > 0 && (
              <div className="cli-car-rating cli-hori-sep">
                <Rating
                  emptySymbol="fa fa-star-o"
                  fullSymbol="fa fa-star"
                  fractions={2}
                  readonly
                  initialRating={
                    parseFloat(car.car_rating) ? parseFloat(car.car_rating) : 0
                  }
                />
              </div>
            )}
            {car.trip_count > 0 ? (
              <div className="cli-car-trips cli-hori-sep">
                <span className="trips-count">{car.trip_count}</span> trip
                {car.trip_count > 1 && "s"}
              </div>
            ) : (
              <div className="cli-car-trips cli-hori-sep">
                <span className="trips-count">New Listing</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  _toggleMobileFilterModal = () =>
    this.setState({ showModelPopUp: !this.state.showModelPopUp });

  _removeFilter = (key, id = null) => {
    let filters = this.state.filters;
    if (key == "features" && id) {
      let newFeaturesFilters = filters["features"].filter(i => {
        return i != id;
      });
      filters["features"] = newFeaturesFilters;
      if (newFeaturesFilters.length == 0) {
        delete filters[key];
      }
      this.setState({ selectedFeatures: newFeaturesFilters });
    } else {
      delete filters[key];
    }

    let val = "";
    if (key == "yearRange") {
      val = { min: 1994, max: new Date().getFullYear() + 1 };
    }
    if (key == "priceRange") {
      val = { min: 0, max: 2000 };
    }
    this.setState({ filters: filters, [key]: val }, state => {
      this.submitForm();
    });
  };

  render() {
    var obj = this.state.filters;
    var filters = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
    });

    var items = [];
    var privios = [];
    this.state.tracks.map((track, i) => {
      if (!privios.includes(track.id)) {
        items.push(
          <div className="track" key={i}>
            {this._item(track)}
          </div>
        );
      }
      privios.push(track.id);
    });
    const loader = (
      <div className="loader row" key={11}>
        <img className="infinite-loader-img" src="/images/pre.gif" />
      </div>
    );

    return (
      <Fragment>
        <Helmet
          title={this.state.address + " Car Rental Results"}
          meta={[
            {
              name: "description",
              content: this.state.address + " Car Rental Results"
            }
          ]}
        />
        <MainNav />
        <div className="car-search-outer">
          <div className="search-box-form-fixed">
            <div className="container">
              <div className="search-box-form">
                <div className="row">
                  {/* Maing filter mobile start   */}
                  <div className="main-search-mobile-wrapper visible-xs visible-sm">
                    <MainFilterMobile
                      location={{
                        address: this.state.address,
                        lat: this.state.lat,
                        lng: this.state.lng
                      }}
                      tripData={{
                        fromDate: this.state.from,
                        fromTime: moment(this.state.from).format("HH:mm"),
                        minFromDate: this.state.minFrom,
                        toDate: this.state.to,
                        toTime: moment(this.state.to).format("HH:mm"),
                        minToDate: moment(this.state.from).add(3, "hours")
                      }}
                      handleDateChangeFrom={from =>
                        this.handleDateChangeFrom(from)
                      }
                      handleDateChangeTo={to => this.handleDateChangeTo(to)}
                      onLocationChange={e => this._onLocationChange(e)}
                      _timeMaker={(selectedTime, isToTime) =>
                        this._timeMaker(selectedTime, isToTime)
                      }
                      handleTimeChangeFrom={e => this.handleTimeChangeFrom(e)}
                      handleTimeChangeTo={e => this.handleTimeChangeTo(e)}
                      onChangeAddress={e => this.onChangeAddress(e)}
                      submitForm={this.submitForm}
                      _toggleMobileFilterModal={this._toggleMobileFilterModal}
                      onMoreFilterClick={() => {
                        this.setState({ moreFilter: !this.state.moreFilter });
                      }}
                      numberOfFilters={filters.length}
                      openMapViwe={() => this.openMapViwe()}
                      showMapview={this.state.showMapview}
                    />
                  </div>

                  <div className="hidden-xs hidden-sm">
                    <Suspense fallback={<PreLoader />}>
                      <MainFilterWeb
                        location={{
                          address: this.state.address,
                          lat: this.state.lat,
                          lng: this.state.lng
                        }}
                        tripData={{
                          fromDate: this.state.from,
                          fromTime: moment(this.state.from).format("HH:mm"),
                          minFromDate: this.state.minFrom,
                          toDate: this.state.to,
                          toTime: moment(this.state.to).format("HH:mm"),
                          minToDate: moment(this.state.from).add(3, "hours")
                        }}
                        handleDateChangeFrom={from =>
                          this.handleDateChangeFrom(from)
                        }
                        handleDateChangeTo={to => this.handleDateChangeTo(to)}
                        onLocationChange={e => this._onLocationChange(e)}
                        _timeMaker={(selectedTime, isToTime) =>
                          this._timeMaker(selectedTime, isToTime)
                        }
                        handleTimeChangeFrom={e => this.handleTimeChangeFrom(e)}
                        handleTimeChangeTo={e => this.handleTimeChangeTo(e)}
                        onChangeAddress={e => this.onChangeAddress(e)}
                        onMoreFilterClick={() => {
                          this.setState({
                            moreFilter: !this.state.moreFilter
                          });
                        }}
                        numberOfFilters={filters.length}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Maing filter mobile end   */}
                {filters.length > 0 && (
                  <div className="row hidden-xs hidden-sm">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="search-filters-wrapper">
                        <div className="flex-container">
                          {filters.map((filter, index) => {
                            if (filter[0] == "features") {
                              return filter[1].map((f, key) => {
                                let fObj = this.props.features.find(data => {
                                  return data.id == f;
                                });
                                return (
                                  <div className="filter-container" key={key}>
                                    <span>{fObj.name}</span>
                                    <button
                                      className="ryd-default-buttons"
                                      onClick={() =>
                                        this._removeFilter(
                                          Object.values(filter)[0],
                                          fObj.id
                                        )
                                      }
                                    >
                                      <img
                                        className="filter-remove-icon"
                                        src="/images/car-search/remove-filter-icon.png"
                                      />
                                    </button>
                                  </div>
                                );
                              });
                            }
                            return (
                              <div className="filter-container" key={index}>
                                <span>{Object.values(filter)[1]}</span>
                                <button
                                  className="ryd-default-buttons"
                                  onClick={() =>
                                    this._removeFilter(Object.values(filter)[0])
                                  }
                                >
                                  <img
                                    className="filter-remove-icon"
                                    src="/images/car-search/remove-filter-icon.png"
                                  />
                                </button>
                              </div>
                            );
                          })}
                          <button
                            type="submit"
                            className="remove-filters"
                            onClick={() => {
                              filters.map(filter => {
                                if (filter[0] == "features") {
                                  filter[1].map(id => {
                                    this._removeFilter(
                                      Object.values(filter)[0],
                                      id
                                    );
                                  });
                                } else {
                                  this._removeFilter(Object.values(filter)[0]);
                                }
                              });
                            }}
                          >
                            Remove filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <Collapsible trigger="" open={this.state.moreFilter}>
                  <Suspense fallback={<PreLoader />}>
                    {" "}
                    <MoreFiltersWeb
                      onChangeCarTypes={this._onChangeCarTypes}
                      onChangePriceRange={this._onChangePriceRange}
                      onChangeCarMakes={this._onChangeCarMakes}
                      onChangeTransmission={this._onChangeTransmission}
                      onChangeMilesPerDay={this._onChangeMilesPerDay}
                      onChangeYearRange={this._onChangeYearRange}
                      onChangeDeliveryLocation={this._onChangeDeliveryLocation}
                      onChangeFeatures={this._onChangeFeatures}
                      filteringData={{
                        carType: this.state.carType,
                        priceRange: this.state.priceRange,
                        yearRange: this.state.yearRange,
                        transmission: this.state.transmission,
                        makeId: this.state.makeId,
                        deliveryLocationId: this.state.deliveryLocationId,
                        distancePerDay: this.state.distancePerDay
                      }}
                      carTypes={carTypes}
                      carMakes={this.props.carMakes}
                      milesPerDay={milesPerDay}
                      deliveryLocations={this.state.deliveryLocations}
                      features={this.props.features}
                      selectedFeatures={this.state.selectedFeatures}
                    />
                  </Suspense>
                </Collapsible>
                <div className="row hidden-xs hidden-sm">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="cars-result-wrapper">
                      <div className="flex-container">
                        <div className="flex-left">
                          <button
                            onClick={() => {
                              this.submitForm();
                              this.setState({ moreFilter: false });
                            }}
                            className="ryde-button"
                          >
                            RYDE
                          </button>
                          {/* { this.state.totalResults > 0 && <div className="cars-result">{ items.length } of { this.state.totalResults }+ Cars</div>} */}
                        </div>
                        <div className="flex-right">
                          <div className="map-switch-wrapper">
                            <span className="map-switch-text">Show map</span>
                            <span className="map-switch">
                              <Switch
                                onChange={() => this.openMapViwe()}
                                checked={this.state.showMapview}
                                id="normal-switch"
                                offColor="#C3C3C3"
                                onColor="#00C07F"
                                offHandleColor="#fff"
                                onHandleColor="#fff"
                                height={30}
                                width={60}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PromotionBanner />

          <div className="cars-list-outer">
            {!this.state.showMapview ? (
              <div className="container">
                <div className="row">
                  <div className="cars-list-inner">
                    <InfiniteScroll
                      pageStart={this.state.pageStart}
                      loadMore={e => this.loadItems(e)}
                      hasMore={this.state.hasMoreItems}
                      loader={loader}
                    >
                      <div className="tracks">{items}</div>
                    </InfiniteScroll>
                    {/* {this.state.hasMoreItems && (
                      <div className="row loader" key={11}>
                        <img src="/images/pre.gif" />
                      </div>
                    )} */}
                    {items.length == 0 && !this.state.hasMoreItems && (
                      <div className="col-md-12">
                        <div className="gery-box">
                          <h2>
                            No cars found on {this.props.match.params.location}
                          </h2>
                          <p>
                            Thanks for choosing Ryde. We will be in your city
                            soon
                          </p>
                          <hr />
                          <h4>List your RYDE & make money</h4>
                          <p>
                            Ryde straight to the bank. The advantages of listing
                            your vehicle with Ryde are numerous and highly
                            lucrative.
                            <br />
                            Click below to turn your car bills into dollar
                            bills.
                          </p>
                          <Link className="btn btn-success" to="/car-create">
                            LIST YOUR RYDE
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="map-outer">
                <Suspense fallback={<PreLoader />}>
                  {" "}
                  <CarListMapView
                    cars={this.state.tracks}
                    from={this.state.from}
                    fromTime={moment(this.state.from).format("HH:mm")}
                    toTime={moment(this.state.to).format("HH:mm")}
                    to={this.state.to}
                    loadMoreForMap={this.loadMoreForMap}
                    location={{
                      address: this.state.address,
                      lat: this.state.lat,
                      lng: this.state.lng
                    }}
                  />
                </Suspense>
              </div>
            )}
          </div>

          <Modal
            isOpen={this.state.showModelPopUp}
            onRequestClose={this.handleCloseModal}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={isMobile ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="search-filters-popup">
              <div className="popup-fixed-top-section">
                <div className="flex-container">
                  {filters.length > 0 && (
                    <button
                      className="remove-filters"
                      onClick={() => {
                        filters.map((filter, index) => {
                          this._removeFilter(Object.values(filter)[0]);
                        });
                      }}
                    >
                      Remove filters
                    </button>
                  )}
                  <div className="close-popup">
                    <span
                      className="icon-cancel"
                      onClick={() => this.setState({ showModelPopUp: false })}
                    />
                  </div>
                </div>
              </div>
              <div className="search-filters-wrapper">
                <div className="flex-container">
                  {filters.length > 0 &&
                    filters.map((filter, index) => {
                      return (
                        <div className="filter-container" key={index}>
                          <span>{Object.values(filter)[1]}</span>
                          <button
                            className="ryd-default-buttons"
                            onClick={() =>
                              this._removeFilter(Object.values(filter)[0])
                            }
                          >
                            <img
                              className="filter-remove-icon"
                              src="/images/car-search/remove-filter-icon.png"
                            />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
              <MoreFiltersMobile
                onChangeCarTypes={this._onChangeCarTypes}
                onChangePriceRange={this._onChangePriceRange}
                onChangeCarMakes={this._onChangeCarMakes}
                onChangeTransmission={this._onChangeTransmission}
                onChangeMilesPerDay={this._onChangeMilesPerDay}
                onChangeYearRange={this._onChangeYearRange}
                onChangeDeliveryLocation={this._onChangeDeliveryLocation}
                onChangeFeatures={this._onChangeFeatures}
                submitForm={this.submitForm}
                filteringData={{
                  carType: this.state.carType,
                  priceRange: this.state.priceRange,
                  yearRange: this.state.yearRange,
                  transmission: this.state.transmission,
                  makeId: this.state.makeId,
                  deliveryLocationId: this.state.deliveryLocationId,
                  distancePerDay: this.state.distancePerDay
                }}
                carTypes={carTypes}
                carMakes={this.props.carMakes}
                milesPerDay={milesPerDay}
                deliveryLocations={this.state.deliveryLocations}
                features={this.props.features}
                selectedFeatures={this.state.selectedFeatures}
                totalResults={this.state.totalResults}
                loadedCars={items.length}
                closeModal={() => this.setState({ showModelPopUp: false })}
              />
            </div>
          </Modal>
          <Modal
            isOpen={this.state.showModelPopUpAuthentication}
            onRequestClose={() => {
              this.setState({ showModelPopUpAuthentication: false });
            }}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <UserAuthModel
              stack={"checkout"}
              closeModel={() => {
                this.setState({ showModelPopUpAuthentication: false });
              }}
            />
          </Modal>
        </div>
        <MainFooter />

        {/* {match.params.cat == "cat0" && authenticated === false && (
          <EmailPopupContent submitForm={this.submitForm} />
        )} */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  filteredCar: state.car.filteredCar,
  features: state.car.features,
  carMakes: state.car.carMakes,
  carModels: state.car.carModels,
  user: state.user.user,
  authenticated: state.user.authenticated,
  timeZoneId: state.common.timeZoneId
});

export default withRouter(connect(mapStateToProps)(CarSearch));
