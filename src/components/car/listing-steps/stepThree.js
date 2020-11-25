import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import { Radio, Checkbox, Row, Col } from "antd";
import {
  getFeatures,
  getDeliveryOptions,
  getFreeDeliveryLocationsforCarListing,
  getRegisteringCar
} from "../../../actions/CarActions";
import {
  confirmTimeArray,
  carRentShortest,
  carRentLongest,
  milesPerDay,
  milesPerWeek,
  milesPerMonth
} from "../../../consts/consts";
import DeliveryDurationFiled from "./subcomponents/DeliveryDurationField";
import _ from "lodash";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import "antd/lib/radio/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/switch/style/index.css";
import "antd/lib/grid/style/index.css";
import { authFail } from "../../../actions/AuthAction";

class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rent_car_longest: "",
      rent_car_shortest: "",
      time_to_confirm: "",
      miles_allowed_per_day: "",
      miles_allowed_per_week: "",
      miles_allowed_per_month: "",
      delivery_option: -1,
      free_delivery_locations: [],
      offer_delivery: "",
      offer_dropoff_location: false,
      error: false,
      message: "",
      submitting: false
    };
  }

  componentDidMount() {
    const { dispatch, car } = this.props;
    dispatch(getDeliveryOptions());
    dispatch(getFeatures());
    dispatch(getFreeDeliveryLocationsforCarListing());
    this.setInitialData(car);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.car) {
      this.setInitialData(nextProps.car);
    }
  }

  handleShort = e => {
    this.setState({
      shortest: e.target.value
    });
  };

  handleLong = e => {
    this.setState({
      longest: e.target.value
    });
  };

  handleTime = e => {
    this.setState({
      time: e.target.value
    });
  };

  handleDays = e => {
    this.setState({
      day: e.target.value
    });
  };

  handleWeek = e => {
    this.setState({
      week: e.target.value
    });
  };

  handleMonth = e => {
    this.setState({
      month: e.target.value
    });
  };

  milePerDay() {
    return milesPerDay.map((index, key) => {
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  }

  milesPerWeek = () => {
    const { miles_allowed_per_day } = this.state;
    return milesPerWeek.map((index, key) => {
      if (miles_allowed_per_day == "Unlimited") {
        if (index.value != "Unlimited") {
          return false;
        }
      }
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  };

  milesPerMonth = () => {
    const { miles_allowed_per_day, miles_allowed_per_week } = this.state;
    return milesPerMonth.map((index, key) => {
      if (
        miles_allowed_per_day == "Unlimited" ||
        miles_allowed_per_week == "Unlimited"
      ) {
        if (index.value != "Unlimited") {
          return false;
        }
      }
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  };

  advancedNoticeTime() {
    return confirmTimeArray.map((index, key) => {
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  }

  shortestPeriod() {
    return carRentShortest.map((index, key) => {
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  }

  longestPeriod() {
    return carRentLongest.map((index, key) => {
      return (
        <option key={key} value={index.value}>
          {index.value}
        </option>
      );
    });
  }

  setDeliveryPotions = () => {
    const { car_delivery_options } = this.props;

    return _.values(car_delivery_options).map(option => {
      return {
        id: _.invert(car_delivery_options)[option],
        value: option
      };
    });
  };

  focusToError = fileds => {
    for (let index = 0; index < fileds.length; index++) {
      for (let [key, value] of Object.entries(fileds[index])) {
        if (!value) {
          this[key].focus();
          return false;
        }
      }
    }
  };

  formSubmit = async () => {
    const { loadNext, dispatch, history, match } = this.props;
    this.setState({ submitting: true });

    const {
      rent_car_longest,
      rent_car_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      delivery_option,
      free_delivery_locations,
      offer_dropoff_location,
      offer_delivery
    } = this.state;

    if (
      !rent_car_longest ||
      !rent_car_shortest ||
      !time_to_confirm ||
      !miles_allowed_per_day ||
      !miles_allowed_per_week ||
      !miles_allowed_per_month ||
      !delivery_option ||
      offer_delivery == "0" ||
      offer_delivery == ""
    ) {
      this.setState({ error: true, submitting: false }, () => {
        this.focusToError([
          { rent_car_shortest },
          { rent_car_longest },
          { time_to_confirm },
          { miles_allowed_per_day },
          { miles_allowed_per_week },
          { miles_allowed_per_month }
        ]);
      });
      return false;
    }

    let offerDelivery = offer_delivery == "None" ? null : offer_delivery;

    const obj = {
      rent_car_longest,
      rent_car_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      delivery_option,
      offer_delivery: delivery_option != -1 ? offerDelivery : null,
      car_free_delivery_location: free_delivery_locations
    };

    if (offer_dropoff_location) {
      obj.offer_dropoff_location = 1;
    } else {
      obj.offer_dropoff_location = 0;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}v2/car/edit-mobile/${match.params.id}`,
        obj,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        dispatch(getRegisteringCar(response.data.car.id));
        this.setState({ submitting: false });
        history.push("/car-create/" + response.data.car.id);
        loadNext();
      }
    } catch (error) {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { loadPrevious, freeDeliveryLocations } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    const {
      rent_car_longest,
      rent_car_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      delivery_option,
      free_delivery_locations,
      offer_delivery,
      error,
      offer_dropoff_location
    } = this.state;

    return (
      <Fragment>
        <div className="form-horizontal">
          <br />
          <h4 className="center">Your preferences</h4>
          <br />

          <div className="form-group">
            <label className="control-label col-sm-3">
              Rental period preferred <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-4">
              <select
                className={
                  error && !rent_car_shortest
                    ? "listFormInput error"
                    : "listFormInput"
                }
                value={rent_car_shortest}
                onChange={e =>
                  this.setState({ rent_car_shortest: e.target.value })
                }
                ref={ref => (this.rent_car_shortest = ref)}
              >
                <option value=""> Shortest </option>
                {this.shortestPeriod()}
              </select>
              {error && !rent_car_shortest && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
            <div className="col-sm-4">
              <select
                className={
                  error && !rent_car_longest
                    ? "listFormInput error"
                    : "listFormInput"
                }
                value={rent_car_longest}
                onChange={e =>
                  this.setState({ rent_car_longest: e.target.value })
                }
                ref={ref => (this.rent_car_longest = ref)}
              >
                <option value=""> Longest </option>
                {this.longestPeriod()}
              </select>
              {error && !rent_car_longest && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3">
              Advance notice time to confirm{" "}
              <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-4">
              <select
                value={time_to_confirm}
                onChange={e =>
                  this.setState({ time_to_confirm: e.target.value })
                }
                className={
                  error && !time_to_confirm
                    ? "listFormInput error"
                    : "listFormInput"
                }
                ref={ref => (this.time_to_confirm = ref)}
              >
                <option />
                {this.advancedNoticeTime()}
              </select>
              {error && !time_to_confirm && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">
              Miles allowed per <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-3">
              <select
                value={miles_allowed_per_day}
                onChange={e =>
                  this.setState({
                    miles_allowed_per_day: e.target.value,
                    miles_allowed_per_week:
                      e.target.value == "Unlimited"
                        ? ""
                        : miles_allowed_per_week,
                    miles_allowed_per_month:
                      e.target.value == "Unlimited"
                        ? ""
                        : miles_allowed_per_month
                  })
                }
                className={
                  error && !miles_allowed_per_day
                    ? "listFormInput error"
                    : "listFormInput"
                }
                ref={ref => (this.miles_allowed_per_day = ref)}
              >
                <option value=""> Day </option>
                {this.milePerDay()}
              </select>
              {error && !miles_allowed_per_day && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
            <div className="col-sm-3">
              <select
                value={miles_allowed_per_week}
                onChange={e =>
                  this.setState({
                    miles_allowed_per_week: e.target.value,
                    miles_allowed_per_month:
                      e.target.value == "Unlimited"
                        ? ""
                        : miles_allowed_per_month
                  })
                }
                className={
                  error && !miles_allowed_per_week
                    ? "listFormInput error"
                    : "listFormInput"
                }
                ref={ref => (this.miles_allowed_per_week = ref)}
              >
                <option value=""> Week </option>
                {this.milesPerWeek()}
              </select>
              {error && !miles_allowed_per_week && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
            <div className="col-sm-3">
              <select
                value={miles_allowed_per_month}
                onChange={e =>
                  this.setState({ miles_allowed_per_month: e.target.value })
                }
                className={
                  error && !miles_allowed_per_month
                    ? "listFormInput error"
                    : "listFormInput"
                }
                ref={ref => (this.miles_allowed_per_month = ref)}
              >
                <option value=""> Month </option>
                {this.milesPerMonth()}
              </select>
              {error && !miles_allowed_per_month && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3">
              Offer delivery & drop off <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-9">
              <Radio.Group
                onChange={e => {
                  this.setState({
                    delivery_option: e.target.value,
                    offer_delivery: null,
                    offer_dropoff_location: false
                  });
                }}
                value={delivery_option}
              >
                {this.setDeliveryPotions().map((option, key) => {
                  return (
                    <Radio
                      style={radioStyle}
                      key={key}
                      value={parseInt(option.id)}
                      className="car-create-offer-d"
                    >
                      {option.value}
                      {/* Offer delivery funtion */}
                      <div className="offer-deliver-outer">
                        {delivery_option &&
                          delivery_option == parseInt(option.id) &&
                          delivery_option != -1 && (
                            <Fragment>
                              <DeliveryDurationFiled
                                onChange={offer_delivery =>
                                  this.setState({ offer_delivery })
                                }
                                offer_delivery={offer_delivery}
                              />
                              <div className="section-devider" />
                              <Checkbox
                                className="offer-deliver-option"
                                checked={offer_dropoff_location}
                                onChange={e =>
                                  this.setState({
                                    offer_dropoff_location: e.target.checked
                                  })
                                }
                              >
                                <span className="option-title">
                                  Offer drop-off
                                </span>
                              </Checkbox>

                              <div className="info-message-box">
                                <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
                                <p>
                                  {!offer_delivery ? (
                                    <Fragment>
                                      Select this to offer drop-off at a
                                      location convenient to the renter. You
                                      earn $5 per mile up to 25 miles. The
                                      delivery miles are calculated from the
                                      location of the car.
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      Select this to offer drop-off at a
                                      location convenient to the renter.&nbsp;
                                      <span className="strong-tag">
                                        Delivery distance is calculated from the
                                        location of the car.
                                      </span>
                                    </Fragment>
                                  )}
                                </p>
                              </div>
                            </Fragment>
                          )}

                        {delivery_option &&
                          delivery_option == parseInt(option.id) &&
                          delivery_option == -1 && (
                            <Fragment>
                              <Checkbox
                                className="offer-deliver-option"
                                checked={offer_dropoff_location}
                                onChange={e =>
                                  this.setState({
                                    offer_dropoff_location: e.target.checked
                                  })
                                }
                              >
                                <span className="option-title">
                                  Offer drop-off
                                </span>
                              </Checkbox>

                              <div className="info-message-box">
                                <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
                                <p>
                                  Select this to offer drop-off at a location
                                  convenient to the renter. You earn $5 per mile
                                  up to 25 miles. The delivery miles are
                                  calculated from the location of the car.
                                </p>
                              </div>
                            </Fragment>
                          )}
                        {error &&
                        delivery_option &&
                        delivery_option == parseInt(option.id) &&
                        (offer_delivery == "0" || offer_delivery == "") ? (
                          <span style={{ color: "red", fontSize: 10 }}>
                            Required
                          </span>
                        ) : (
                          <Fragment />
                        )}
                      </div>
                      {/* Offer delivery funtion */}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
          </div>
          <div className="form-group">
            <div className="car-create-offer-x margin-top-15">
              <div className="row">
                <div className="col-md-3 col-xs-12">
                  <label className="control-label">Offer free delivery</label>
                </div>
                <div className="col-md-9 col-xs-12">
                  <div className="check-box offer-deliver-checklist">
                    <Checkbox.Group
                      style={{ width: "100%" }}
                      onChange={values =>
                        this.setState({ free_delivery_locations: values })
                      }
                      value={free_delivery_locations}
                    >
                      <Row>
                        {freeDeliveryLocations.map((location, key) => {
                          return (
                            <Col span={4} key={key}>
                              <Checkbox
                                value={location.id}
                                className="car-list-checkbox"
                              >
                                {location.name}
                              </Checkbox>
                            </Col>
                          );
                        })}
                      </Row>
                    </Checkbox.Group>
                  </div>
                  <div className="info-message-box margin-top-0">
                    <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
                    <p>
                      Offering more delivery options will attract more trips for
                      your car.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="List_outer_wrapper">
              <div className="List_button_wrapper">
                <div className="List_button-box">
                  <button
                    type="button"
                    className="List_back_btn"
                    onClick={() => loadPrevious()}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="List_submit_btn"
                    onClick={() => this.formSubmit()}
                    disabled={this.state.submitting === true}
                  >
                    {this.state.submitting === true && (
                      <div style={{ paddingRight: "5px", paddingTop: "2px" }}>
                        <PreloaderIcon
                          loader={Oval}
                          size={20}
                          strokeWidth={8} // min: 1, max: 50
                          strokeColor="#fff"
                          duration={800}
                          style={{
                            float: "left"
                          }}
                        />
                      </div>
                    )}
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  setInitialData = car => {
    if (!car) {
      return false;
    }

    const {
      rent_car_longest,
      rent_car_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      delivery_option,
      car_free_delivery_location,
      offer_delivery,
      offer_dropoff_location,
      free_delivery_locations
    } = car;

    this.setState({
      rent_car_longest,
      rent_car_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      delivery_option: delivery_option ? delivery_option : -1,
      free_delivery_locations: free_delivery_locations,
      offer_delivery,
      offer_dropoff_location: offer_dropoff_location == 0 ? false : true
    });
  };
}
const mapStateToProps = state => ({
  user: state.user.user,
  features: state.car.features,
  usStates: state.car.usStates,
  fetching: state.car.fetching,
  freeDeliveryLocations: state.car.freeDeliveryLocations,
  car_delivery_options: state.car.delivery_options
});

export default withRouter(connect(mapStateToProps)(StepThree));
