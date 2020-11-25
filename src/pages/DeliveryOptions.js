import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { Radio } from "antd";
import "antd/lib/radio/style/index.css";
import queryString from "query-string";
import { fetchCar, getCarCoverageLevels } from "../actions/CarActions";
import checkAuth from "../components/requireAuth";
import { getBookingData } from "../actions/BookingActions";
import CheckoutSummary from "../components/booking/CheckoutSummary";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import MainNav from "../components/layouts/MainNav";
import MainFooter from "../components/layouts/MainFooter";

const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};

const LOCATION_IS_DELIVERY = 1;
const LOCATION_IS_DROPOFF = 2;

const PICKUP_IS_OWNERS_LOCATION = 0;
const PICKUP_IS_FREE_DELIVERY_LOCATION = 1;
const PICKUP_IS_DELIVERY_LOCATION = 2;
class DeliveryOptions extends Component {
  constructor(props) {
    super(props);
    const { match, history } = props;
    const searchData = queryString.parse(history.location.search);
    const handleDropoff = searchData => {
      if (searchData.isDropOffSame == "true") {
        return true;
      } else if (searchData.isDropOffSame == "false") {
        return false;
      } else {
        return null;
      }
    };

    this.state = {
      from: moment(match.params.from, "MM-DD-YYYY"),
      fromTime: match.params.fromTime,
      to: moment(match.params.to, "MM-DD-YYYY"),
      toTime: match.params.toTime,
      delivery_location: searchData.delivery_location
        ? searchData.delivery_location
        : "",
      lat: searchData.lat ? searchData.lat : "",
      lng: searchData.lng ? searchData.lng : "",
      isDeliveryChargeLoading: false,
      deliveryCharge: 0.0,
      deliveryMethod: searchData.deliveryMethod
        ? parseInt(searchData.deliveryMethod)
        : 0,
      free_deliver_location_id: searchData.free_deliver_location_id
        ? searchData.free_deliver_location_id
        : "",
      fromDateTime: moment(
        match.params.from + " " + match.params.fromTime,
        "MM-DD-YYYY HH:mm:s a"
      ).format("YYYY-MM-DD HH:mm:ss"),
      toDateTime: moment(
        match.params.to + " " + match.params.toTime,
        "MM-DD-YYYY HH:mm:s a"
      ).format("YYYY-MM-DD HH:mm:ss"),
      isFreeDeliveryFieldError: "",
      isDeliveryLocationFieldError: "",
      isNotDelivery: false,
      isDropOffSame: handleDropoff(searchData),
      dropOffLocation: searchData.dropOffLocation
        ? searchData.dropOffLocation
        : "",
      dropOffLocationError: "",
      dropOffError: null,
      dropLat: "",
      dropLng: "",
      isDropOffChargeLoading: false
    };
    this.onChangeDeliveryMethod = this.onChangeDeliveryMethod.bind(this);
    this.onChangePlacesAutocomplete = this.onChangePlacesAutocomplete.bind(
      this
    );
    this.addDeliveryLocation = this.addDeliveryLocation.bind(this);
  }

  componentWillMount() {
    const { dispatch, car, match } = this.props;
    dispatch(getCarCoverageLevels());
    dispatch(
      fetchCar(
        match.params.carId,
        !car || (car && match.params.carId != car.id) ? true : false
      )
    );

    dispatch(
      getBookingData({
        active_page: "delivery",
        from_date: this.state.fromDateTime,
        to_date: this.state.toDateTime,
        car_id: match.params.carId,
        car_coverage_level: localStorage.carCoverageLevel
          ? localStorage.carCoverageLevel
          : 1,
        timeZoneId: this.props.timeZoneId
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.bookingData.delivery_charge !==
      nextProps.bookingData.delivery_charge
    ) {
      if (
        this.state.deliveryMethod === PICKUP_IS_DELIVERY_LOCATION &&
        nextProps.bookingData
      ) {
        this.setState({
          isDeliveryChargeLoading: false,
          deliveryCharge: nextProps.bookingData.delivery_charge
        });
      }
    } else {
      this.setState({ deliveryCharge: 0.0, isDeliveryChargeLoading: false });
    }

    if (
      nextProps.bookingData.isDelivery == false &&
      nextProps.bookingData.delivery_message
    ) {
      this.setState({ isNotDelivery: true });
    } else {
      this.setState({ isNotDelivery: false });
    }

    if (
      nextProps.car &&
      this.props.car &&
      nextProps.car.offer_dropoff_location !==
        this.props.car.offer_dropoff_location
    ) {
      this.setState({
        isDropOffSame:
          nextProps.car && nextProps.car.offer_dropoff_location ? "" : true
      });
    } else {
      this.setState({ isDropOffChargeLoading: false });
    }
  }

  componentDidMount() {
    const { history } = this.props;
    const searchData = queryString.parse(history.location.search);

    if (searchData) {
      this._fetchBookingData();
    }
  }

  handleAddressSelect = (location, type) => {
    const {
      isDropOffSame,
      dropOffLocation,
      dropLat,
      dropLng,
      isDropOffChargeLoading
    } = this.state;
    if (type === LOCATION_IS_DELIVERY) {
      this.setState({
        delivery_location: location,
        deliveryMethod: PICKUP_IS_DELIVERY_LOCATION,
        isDeliveryChargeLoading: true
      });
    }
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        if (type === LOCATION_IS_DELIVERY) {
          this.setState(
            {
              delivery_location: location,
              lat: latLng.lat,
              lng: latLng.lng,
              dropOffLocation: isDropOffSame ? location : dropOffLocation,
              dropLat: isDropOffSame ? latLng.lat : dropLat,
              dropLng: isDropOffSame ? latLng.lng : dropLng,
              isDropOffChargeLoading: isDropOffSame
                ? true
                : isDropOffChargeLoading
            },
            () => {
              this._fetchBookingData();
              this.changeUrlParams();
            }
          );
        }
        if (type === LOCATION_IS_DROPOFF) {
          this.setState(
            {
              dropOffLocation: location,
              dropLat: latLng.lat,
              dropLng: latLng.lng,
              isDropOffChargeLoading: true
            },
            () => {
              this._fetchBookingData();
              this.changeUrlParams();
            }
          );
        }
      });
  };

  _fetchBookingData = () => {
    const { dispatch, match } = this.props;
    const {
      isDropOffSame,
      dropOffLocation,
      dropLat,
      dropLng,
      deliveryMethod,
      delivery_location,
      lat,
      lng
    } = this.state;
    let fromDate = moment(
      moment(match.params.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        match.params.fromTime
    );
    let toDate = moment(
      moment(match.params.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        match.params.toTime
    );
    const filterdData = {
      from_date: moment(fromDate).format("YYYY-MM-DD HH:mm"),
      to_date: moment(toDate).format("YYYY-MM-DD HH:mm"),
      delivery_location: delivery_location,
      latitude: lat,
      longitude: lng,
      car_id: match.params.carId,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: this.props.timeZoneId
    };

    if (isDropOffSame === false && dropLat && dropLng && dropOffLocation) {
      filterdData.dropoff_location = dropOffLocation;
      filterdData.dropoff_latitude = dropLat;
      filterdData.dropoff_longitude = dropLng;
      filterdData.is_offer_dropoff = true;
    }

    if (
      isDropOffSame === true &&
      deliveryMethod == PICKUP_IS_DELIVERY_LOCATION
    ) {
      filterdData.dropoff_location = delivery_location;
      filterdData.dropoff_latitude = lat;
      filterdData.dropoff_longitude = lng;
      filterdData.is_offer_dropoff = true;
    }

    dispatch(getBookingData(filterdData));
  };

  onChangeDeliveryMethod(e) {
    const { history, match } = this.props;

    if (e.target.value == PICKUP_IS_OWNERS_LOCATION) {
      this.setState(
        {
          deliveryMethod: parseInt(e.target.value),
          free_deliver_location_id: "",
          delivery_location: "",
          isFreeDeliveryFieldError: "",
          isDeliveryLocationFieldError: "",
          dropOffLocation: ""
        },
        () => {
          this._fetchBookingData();
          this.changeUrlParams();
        }
      );
    } else if (e.target.value == PICKUP_IS_FREE_DELIVERY_LOCATION) {
      this.setState(
        {
          delivery_location: "",
          deliveryMethod: parseInt(e.target.value),
          isFreeDeliveryFieldError: "",
          isDeliveryLocationFieldError: "",
          dropOffLocation: ""
        },
        () => {
          this._fetchBookingData();
          this.changeUrlParams();
        }
      );
      history.push(
        `/car-delivery/${match.params.carId}/${match.params.from}/${match.params.fromTime}/${match.params.to}/${match.params.toTime}`
      );
    } else if (e.target.value == PICKUP_IS_DELIVERY_LOCATION) {
      this.setState(
        {
          deliveryMethod: parseInt(e.target.value),
          isFreeDeliveryFieldError: "",
          isDeliveryLocationFieldError: "",
          dropOffLocation: ""
        },
        () => {
          this._fetchBookingData();
          this.changeUrlParams();
        }
      );
      if (this.state.delivery_location) {
        this.handleAddressSelect(
          this.state.delivery_location,
          LOCATION_IS_DELIVERY
        );
      }
    }
  }

  onChangePlacesAutocomplete(delivery_location) {
    this.setState({
      delivery_location: delivery_location,
      deliveryMethod: PICKUP_IS_DELIVERY_LOCATION,
      free_deliver_location_id: ""
    });
  }

  addDeliveryLocation() {
    const {
      delivery_location,
      dropOffLocation,
      isDropOffSame,
      dropLat,
      dropLng
    } = this.state;
    const { history, car, match } = this.props;
    if (
      this.state.deliveryMethod == PICKUP_IS_FREE_DELIVERY_LOCATION &&
      this.state.free_deliver_location_id === ""
    ) {
      this.setState({ isFreeDeliveryFieldError: "fields-error" });
      return null;
    } else if (
      this.state.deliveryMethod == PICKUP_IS_DELIVERY_LOCATION &&
      this.state.delivery_location === ""
    ) {
      this.setState({ isDeliveryLocationFieldError: "fields-error" });
      return null;
    }

    if (car && car.offer_dropoff_location && isDropOffSame === null) {
      this.setState({ dropOffError: true });
      return;
    } else {
      this.setState({ dropOffError: false });
    }
    if (
      car &&
      car.offer_dropoff_location &&
      isDropOffSame === false &&
      !dropOffLocation
    ) {
      this.setState({ dropOffLocationError: true });
      return false;
    }
    const search = {};
    if (isDropOffSame === false) {
      search.dr_location = dropOffLocation;
      search.dr_lat = dropLat;
      search.dr_lng = dropLng;
      search.dropoff_same_as_delivery = false;
    }

    if (isDropOffSame === true) {
      search.dropoff_same_as_delivery = true;
    }

    if (this.state.deliveryMethod == PICKUP_IS_FREE_DELIVERY_LOCATION) {
      history.push({
        pathname: `/car-checkout/${match.params.carId}/${match.params.from}/${match.params.fromTime}/${match.params.to}/${match.params.toTime}/${this.state.free_deliver_location_id}`,
        search: queryString.stringify(search)
      });
    } else if (this.state.deliveryMethod == PICKUP_IS_DELIVERY_LOCATION) {
      geocodeByAddress(delivery_location)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          if (isDropOffSame === true) {
            search.dr_location = delivery_location;
            search.dr_lat = latLng.lat;
            search.dr_lng = latLng.lng;
          }
          history.push({
            pathname: `/car-checkout/${match.params.carId}/${
              match.params.from
            }/${match.params.fromTime}/${match.params.to}/${
              match.params.toTime
            }/${0}/${delivery_location}/${latLng.lat}/${latLng.lng}`,
            search: queryString.stringify(search)
          });
        });
    } else {
      // if car present location is the delivery location we are not passing that data
      history.push({
        pathname: `/car-checkout/${match.params.carId}/${match.params.from}/${match.params.fromTime}/${match.params.to}/${match.params.toTime}`,
        search: queryString.stringify(search)
      });
    }
  }

  changeUrlParams = () => {
    const { history } = this.props;

    const {
      deliveryMethod,
      delivery_location,
      lat,
      lng,
      free_deliver_location_id,
      isDropOffSame,
      dropOffLocation
    } = this.state;

    history.replace({
      search: queryString.stringify({
        deliveryMethod,
        delivery_location,
        lat,
        lng,
        free_deliver_location_id,
        isDropOffSame,
        dropOffLocation
      })
    });
  };

  setSameDropOff = () => {
    const {
      deliveryMethod,
      free_deliver_location_id,
      dropOffLocation
    } = this.state;
    const { car, bookingData } = this.props;

    switch (deliveryMethod) {
      case PICKUP_IS_OWNERS_LOCATION:
        return (
          <Fragment>
            <div className="font-16-regular del-text-gap-bottom">
              {car && car.user.first_name} will meet you at
            </div>
            <div className="font-16-regular text-color-green">
              kkkkk
              {car && car.car_location ? car.car_location : "Not available"}
            </div>
          </Fragment>
        );

      case PICKUP_IS_FREE_DELIVERY_LOCATION:
        if (free_deliver_location_id && bookingData.free_delivery_locations) {
          return _.map(bookingData.free_delivery_locations, (val, index) => {
            if (index == free_deliver_location_id) {
              return (
                <Fragment key={index}>
                  <div className="font-16-regular del-text-gap-bottom">
                    {car && car.user.first_name} will meet you at
                  </div>
                  <div className="font-16-regular text-color-green">{val}</div>
                </Fragment>
              );
            }
          });
        }
        break;
      case PICKUP_IS_DELIVERY_LOCATION:
        if (!dropOffLocation) {
          return <Fragment />;
        }
        return (
          <Fragment>
            <div className="font-16-regular del-text-gap-bottom">
              {car && car.user.first_name} will meet you at
            </div>
            <div className="row same-loc-with-price">
              <div className="col-md-12">
                <div className="font-16-regular ">
                  <span className="text-color-green">{dropOffLocation}</span>
                  <span className="pickup-location-price">
                    {bookingData && !bookingData.delivery_option_message && (
                      <Fragment>{"$ " + bookingData.dropoff_charge}</Fragment>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <p className="padding-left-remove del-label-gap-top">
                  {bookingData && bookingData.delivery_option_message
                    ? bookingData.delivery_option_message
                    : "$5 per mile up to maximum 25 miles"}
                </p>
              </div>
            </div>
          </Fragment>
        );
      default:
        return <Fragment />;
    }
  };

  render() {
    const {
      bookingData,
      car,
      user,
      history,
      match,
      carCoverageLevels,
      isFetching
    } = this.props;
    const options = {
      location: new window.google.maps.LatLng(34.0522, -118.243),
      radius: 2000,
      route: "Los Angeles County",
      componentRestrictions: {
        country: "us"
      }
    };

    return (
      <Fragment>
        <MainNav />
        <div className="checkout-outer delivery-options-outer">
          {/* Car more info - Start */}
          <section className="more-info-section">
            <div className="container">
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
                      <a onClick={() => history.goBack()}>
                        {car && car.car_name}
                      </a>
                    </li>
                    <li>
                      <span className="icon-right-arrow" />
                    </li>
                    <li className="stay">Delivery options</li>
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="page-title-header">
                    <h1 className="page-title">Delivery options</h1>
                  </div>
                  {/* Delivery options - Start */}
                  <div className="car-delivery-section">
                    <div className="page-sub-title">
                      {user.first_name}, Let us know your vehicle delivery
                      preferences:
                    </div>

                    <h2 className="car-info-head">
                      {`Meet ${car &&
                        car.user.first_name} and coordinate pick-up ${
                        car && !car.offer_dropoff_location ? "& drop-off" : ""
                      }  `}
                    </h2>
                    <div className="delivery-option-inner">
                      <label className="checkbox-inline checkbox-custom">
                        {car && car.car_location
                          ? car.car_location
                          : "Not available"}
                        <input
                          type="radio"
                          name="pick_up_location"
                          id="pick_up_location"
                          onChange={e => {
                            this.onChangeDeliveryMethod(e);
                          }}
                          value={PICKUP_IS_OWNERS_LOCATION}
                          checked={
                            this.state.deliveryMethod ==
                            PICKUP_IS_OWNERS_LOCATION
                          }
                        />
                        <span className="checkmark" />
                      </label>

                      {car &&
                      car.pickup_instructions &&
                      car.pickup_instructions != "" ? (
                        <div>
                          <h5>Pick up instructions:</h5>
                          <p>{car && car.pickup_instructions}</p>
                        </div>
                      ) : null}
                    </div>

                    {bookingData.free_delivery_availability ? (
                      <div>
                        <h2 className="car-info-head">
                          Have {car && car.user.first_name} deliver to a
                          pre-designated location, for free
                        </h2>
                        <div className="delivery-option-inner">
                          <label className="checkbox-inline checkbox-custom">
                            Available free delivery locations
                            <input
                              type="radio"
                              checked={
                                this.state.deliveryMethod ==
                                PICKUP_IS_FREE_DELIVERY_LOCATION
                              }
                              onChange={e => {
                                this.onChangeDeliveryMethod(e);
                              }}
                              name="radio_free_delivery"
                              value={PICKUP_IS_FREE_DELIVERY_LOCATION}
                            />
                            <span className="checkmark" />
                          </label>
                          {car && !car.offer_dropoff_location ? (
                            <p style={{ marginBottom: 15 }}>
                              (This car does not offer custom drop off. Your
                              drop off will be at original location of the car)
                            </p>
                          ) : null}
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                className={
                                  "form-group " +
                                  this.state.isFreeDeliveryFieldError
                                }
                              >
                                <div className="cd-date-picker">
                                  <select
                                    className="form-control form-select"
                                    onChange={e => {
                                      this.setState(
                                        {
                                          free_deliver_location_id:
                                            e.target.value,
                                          deliveryMethod: PICKUP_IS_FREE_DELIVERY_LOCATION,
                                          delivery_location: "",
                                          isFreeDeliveryFieldError: "",
                                          lat: "",
                                          lng: ""
                                        },
                                        () => this.changeUrlParams(),
                                        this._fetchBookingData()
                                      );
                                    }}
                                    value={this.state.free_deliver_location_id}
                                  >
                                    <option value="">Select option</option>
                                    {_.map(
                                      bookingData.free_delivery_locations,
                                      (option, key) => {
                                        return (
                                          <option value={key} key={key}>
                                            {option}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                  <span className="icon-down-arrow select-drop-down" />
                                </div>
                              </div>
                              {this.state.isFreeDeliveryFieldError !== "" ? (
                                <p className="fields-error-text-bottom">
                                  Please select a pre-designated location.
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {car &&
                    car.delivery_option_id &&
                    car.delivery_option_id !== -1 ? (
                      <div>
                        <h2 className="car-info-head">
                          Have {car && car.user.first_name} deliver to an exact
                          location
                        </h2>
                        <div className="delivery-option-inner">
                          <label className="checkbox-inline checkbox-custom">
                            {car && car.user.first_name} will meet you at a
                            location you choose
                            <input
                              type="radio"
                              checked={
                                this.state.deliveryMethod ==
                                PICKUP_IS_DELIVERY_LOCATION
                              }
                              onChange={e => {
                                this.onChangeDeliveryMethod(e);
                              }}
                              name="radio_delivery_location"
                              value={PICKUP_IS_DELIVERY_LOCATION}
                            />
                            <span className="checkmark" />
                          </label>
                          {car && !car.offer_dropoff_location ? (
                            <p style={{ marginBottom: 15 }}>
                              (This car does not offer custom drop off. Your
                              drop off will be at original location of the car)
                            </p>
                          ) : null}
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                className={
                                  "form-group border-bottom-none" +
                                  this.state.isDeliveryLocationFieldError
                                }
                              >
                                <div className="cd-date-picker">
                                  <PlacesAutocomplete
                                    value={this.state.delivery_location}
                                    onChange={this.onChangePlacesAutocomplete}
                                    onSelect={e =>
                                      this.handleAddressSelect(
                                        e,
                                        LOCATION_IS_DELIVERY
                                      )
                                    }
                                    searchOptions={options}
                                  >
                                    {({
                                      getInputProps,
                                      getSuggestionItemProps,
                                      suggestions,
                                      loading
                                    }) => (
                                      <div className="autocomplete-root">
                                        <input
                                          {...getInputProps({
                                            placeholder: "Pickup location",
                                            className: "SC_drawer_textfield_dmg"
                                          })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                          {loading && (
                                            <div className="load-icon">
                                              <img src="/images/img_loading.gif" />
                                              Loading ...
                                            </div>
                                          )}
                                          {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                              ? "suggestion-item--active"
                                              : "suggestion-item";
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                              ? {
                                                  backgroundColor: "#fafafa",
                                                  cursor: "pointer"
                                                }
                                              : {
                                                  backgroundColor: "#ffffff",
                                                  cursor: "pointer"
                                                };
                                            return (
                                              <div
                                                {...getSuggestionItemProps(
                                                  suggestion,
                                                  {
                                                    className,
                                                    style
                                                  }
                                                )}
                                              >
                                                <span>
                                                  {suggestion.description}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </PlacesAutocomplete>
                                  {/* <span className="icon-down-arrow select-drop-down"></span> */}
                                </div>
                              </div>
                            </div>
                            {bookingData &&
                              !bookingData.delivery_option_message && (
                                <div className="col-md-4">
                                  <span className="pickup-location-price">
                                    {this.state.isDeliveryChargeLoading ===
                                    true ? (
                                      "Calculating..."
                                    ) : (
                                      <Fragment>
                                        {!this.state.isNotDelivery &&
                                        bookingData.delivery_charge ? (
                                          `$ ${bookingData.delivery_charge}`
                                        ) : (
                                          <Fragment />
                                        )}
                                      </Fragment>
                                    )}
                                  </span>
                                </div>
                              )}
                          </div>
                          {this.state.isDeliveryLocationFieldError !== "" &&
                          this.state.delivery_location == "" ? (
                            <p className="fields-error-text-bottom">
                              Please select a delivery location
                            </p>
                          ) : null}
                          <p>
                            <span className="strong-tag" />
                            {car && (
                              <Fragment>
                                {bookingData &&
                                bookingData.delivery_option_message ? (
                                  bookingData.delivery_option_message
                                ) : (
                                  <Fragment>
                                    {car.delivery_option_array &&
                                    car.delivery_option_array.length >= 2 ? (
                                      <Fragment>
                                        <b>{car.delivery_option_array[0]}</b>
                                        {car.delivery_option_array[1]}
                                      </Fragment>
                                    ) : (
                                      car.delivery_option
                                    )}
                                  </Fragment>
                                )}
                              </Fragment>
                            )}
                          </p>

                          {this.state.isNotDelivery && (
                            <div className="messages-wrapper">
                              <div className="notification error-message">
                                <div className="notification-inner">
                                  <img
                                    className="img-responsive pic"
                                    src="/images/error-icon.svg"
                                    alt="Image"
                                  />
                                  <span className="error-notification-cap-lg">
                                    {bookingData.delivery_message}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {/* Drop-off - Start */}
                    {car && car.offer_dropoff_location ? (
                      <div className="delivery-option-inner delivery-drop-off">
                        <div>
                          <div className="flex-container section-gap-bottom">
                            <h2 className="font-14-semibold del-label-gap-right">
                              Is your drop off location the same ?
                            </h2>

                            <div className="flex-container">
                              <Radio.Group
                                onChange={val => {
                                  if (val.target.value === true) {
                                    if (
                                      this.state.deliveryMethod ==
                                      PICKUP_IS_DELIVERY_LOCATION
                                    ) {
                                      this.setState(
                                        {
                                          dropOffLocation: this.state
                                            .delivery_location,
                                          dropLat: this.state.lat,
                                          dropLng: this.state.lng,
                                          dropOffError: null
                                        },
                                        () => this._fetchBookingData()
                                      );
                                    } else {
                                      this.setState({
                                        dropOffLocation: "",
                                        dropLat: "",
                                        dropLng: "",
                                        dropOffError: null
                                      });
                                    }
                                  } else {
                                    this.setState(
                                      {
                                        dropOffLocation: "",
                                        dropLat: "",
                                        dropLng: ""
                                      },
                                      () => this._fetchBookingData()
                                    );
                                  }
                                  this.setState(
                                    {
                                      isDropOffSame: val.target.value
                                    },
                                    () => this.changeUrlParams()
                                    //this._fetchBookingData()
                                  );
                                }}
                                value={this.state.isDropOffSame}
                              >
                                <Radio style={radioStyle} value={true}>
                                  Yes
                                </Radio>
                                <Radio style={radioStyle} value={false}>
                                  No
                                </Radio>
                              </Radio.Group>
                            </div>
                          </div>

                          {this.state.isDropOffSame === true &&
                            this.setSameDropOff()}
                          {this.state.isDropOffSame === false && (
                            <Fragment>
                              <div className="font-16-regular">
                                {car && car.user.first_name} will meet you at a
                                location you choose
                              </div>
                              <div className="row">
                                <div className="col-md-8">
                                  <div
                                    className={
                                      "form-group form-group-indent-none border-bottom-none" +
                                      this.state.isDeliveryLocationFieldError
                                    }
                                  >
                                    <div className="cd-date-picker">
                                      <PlacesAutocomplete
                                        value={this.state.dropOffLocation}
                                        onChange={dropOffLocation =>
                                          this.setState(
                                            {
                                              dropOffLocation,
                                              dropOffLocationError: false
                                            },
                                            () => this.changeUrlParams()
                                          )
                                        }
                                        onSelect={e =>
                                          this.handleAddressSelect(
                                            e,
                                            LOCATION_IS_DROPOFF
                                          )
                                        }
                                        searchOptions={options}
                                      >
                                        {({
                                          getInputProps,
                                          getSuggestionItemProps,
                                          suggestions,
                                          loading
                                        }) => (
                                          <div className="autocomplete-root">
                                            <input
                                              {...getInputProps({
                                                placeholder:
                                                  "Drop off location",
                                                className:
                                                  "SC_drawer_textfield_dmg"
                                              })}
                                            />
                                            <div className="autocomplete-dropdown-container delivery-section">
                                              {loading && (
                                                <div className="load-icon">
                                                  <img src="/images/img_loading.gif" />
                                                  Loading ...
                                                </div>
                                              )}
                                              {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                  ? "suggestion-item--active"
                                                  : "suggestion-item";
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                  ? {
                                                      backgroundColor:
                                                        "#fafafa",
                                                      cursor: "pointer"
                                                    }
                                                  : {
                                                      backgroundColor:
                                                        "#ffffff",
                                                      cursor: "pointer"
                                                    };
                                                return (
                                                  <div
                                                    {...getSuggestionItemProps(
                                                      suggestion,
                                                      {
                                                        className,
                                                        style
                                                      }
                                                    )}
                                                  >
                                                    <span>
                                                      {suggestion.description}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </PlacesAutocomplete>
                                    </div>
                                    {this.state.dropOffLocationError ===
                                      true && (
                                      <p
                                        className="fields-error-text-bottom padding-left-remove"
                                        style={{ marginTop: 15 }}
                                      >
                                        Please select the drop off location
                                      </p>
                                    )}
                                    {bookingData &&
                                      bookingData.isDropOff === false && (
                                        <Fragment>
                                          <div className="messages-wrapper">
                                            <div className="notification error-message">
                                              <div className="notification-inner">
                                                <img
                                                  className="img-responsive pic"
                                                  src="/images/error-icon.svg"
                                                  alt="Image"
                                                />
                                                <span className="error-notification-cap-lg">
                                                  {bookingData.dropoff_message}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </Fragment>
                                      )}
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <span className="pickup-location-price">
                                    {/* {bookingData.isDropOff === true &&
                                      "$ " + bookingData.dropoff_charge} */}
                                    {this.state.isDropOffChargeLoading === true
                                      ? "Calculating..."
                                      : bookingData.isDropOff === true &&
                                        "$ " + bookingData.dropoff_charge}
                                  </span>
                                </div>
                              </div>
                              <p className="padding-left-remove">
                                {bookingData &&
                                bookingData.delivery_option_message
                                  ? bookingData.delivery_option_message
                                  : "$5 per mile up to maximum 25 miles"}
                              </p>
                            </Fragment>
                          )}
                        </div>

                        {this.state.dropOffError === true && (
                          <p className="fields-error-text-bottom padding-left-remove">
                            Please select the drop off location
                          </p>
                        )}
                      </div>
                    ) : null}
                    {/* Drop-off - End */}
                  </div>
                  {/* Delivery options - End */}
                  {/* Bottom buttons - Start */}
                  <div className="checkout-buttons-wrapper">
                    <div className="flex-container">
                      <button
                        className="checkout-buttons back-btn"
                        onClick={history.goBack}
                      >
                        <span className="icon-left-arrow" /> BACK
                      </button>
                      <button
                        className={
                          this.state.isNotDelivery ||
                          bookingData.isDropOff === false
                            ? "checkout-buttons continue-btn btn-continue-disabled"
                            : "checkout-buttons continue-btn"
                        }
                        onClick={this.addDeliveryLocation}
                        disabled={
                          isFetching ||
                          this.state.isNotDelivery ||
                          bookingData.isDropOff === false ||
                          this.state.isDropOffChargeLoading === true
                            ? true
                            : false
                        }
                      >
                        CONTINUE
                      </button>
                      <div className="wont-charged-text">
                        You won’t be charged yet
                      </div>
                    </div>
                  </div>
                  {/* Bottom buttons - End */}
                </div>
                <div className="col-md-4">
                  <CheckoutSummary
                    car={car}
                    fromDate={match.params.from}
                    fromTime={match.params.fromTime}
                    toDate={match.params.to}
                    toTime={match.params.toTime}
                    bookingData={bookingData}
                    hidePricebreakdown={false}
                    carCoverageLevels={carCoverageLevels}
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Car more info - End */}
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  car: state.car.car_v2,
  bookingData: state.booking.bookingData,
  timeZoneId: state.common.timeZoneId,
  carCoverageLevels: state.car.carCoverageLevels,
  isFetching: state.common.isFetching
});

export default withRouter(connect(mapStateToProps)(checkAuth(DeliveryOptions)));
