import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getRegisteringCar } from "../actions/CarActions";
import { toggleDrawer } from "../actions/CommenActions";
import {
  confirmTimeArray,
  carRentShortest,
  carRentLongest,
  milesPerDay,
  milesPerWeek,
  milesPerMonth,
  offerFreeDeliveryOptions,
  defaultModelPopup,
  defaultMobileModelPopup
} from "../consts/consts";
import { carProtectionModal } from "../consts/modalStyles";
import Modal from "react-modal";
import CarProtectionLevels from "../components/car/CarProtectionLevels";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { Radio, Checkbox, Row, Col } from "antd";
import _ from "lodash";
import Axios from "axios";
import NumberFormat from "react-number-format";
import { Upload } from "../components/file-processing/index";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { isMobileOnly } from "react-device-detect";
import DeliveryDurationFiled from "../components/car/listing-steps/subcomponents/DeliveryDurationField";
import "antd/lib/radio/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/grid/style/index.css";
import "antd/lib/switch/style/index.css";
import { authFail } from "../actions/AuthAction";

class UpdateForm extends Component {
  constructor(props) {
    super(props);
    const { initialValues } = props;
    this.state = {
      id: initialValues.id,
      location: initialValues.location,
      lat: initialValues.latitude,
      lng: initialValues.longitude,
      car_rent_shortest: initialValues.rent_car_shortest,
      car_rent_longest: initialValues.rent_car_longest,
      miles_allowed_per_day: initialValues.miles_allowed_per_day,
      miles_allowed_per_month: initialValues.miles_allowed_per_month,
      miles_allowed_per_week: initialValues.miles_allowed_per_week,
      time_to_confirm: initialValues.time_to_confirm,
      delivery_option: initialValues.delivery_option,
      free_delivery_locations: initialValues.car_free_delivery_location,
      daily_rate: initialValues.daily_rate,
      discount_daily: initialValues.discount_daily,
      discount_monthly: initialValues.discount_monthly,
      discount_weekly: initialValues.discount_weekly,
      car_features: initialValues.features,
      description: initialValues.description,
      pickup_instructions: initialValues.pickup_instructions,
      offer_dropoff_location:
        initialValues.offer_dropoff_location == 0 ? false : true,
      initialPhotos: this.setPhotos(initialValues.car_photo),
      errObj: {},
      photosCount: initialValues.car_photo.length,
      profile_image_index: null,
      isLoading: false,
      showModal: false,
      deletedImgList: [],
      offer_delivery: initialValues.offer_delivery,
      error: ""
    };
  }

  componentDidMount() {
    this.props.dispatch(toggleDrawer());
  }

  setPhotos = files => {
    if (files) {
      return files.map(file => {
        return {
          id: file.id,
          image_path: file.image_path,
          status: file.status
        };
      });
    }
    return [];
  };

  odometerValues() {
    const { initialValues } = this.props;
    if (initialValues.odometer) {
      if (initialValues.odometer == "0 - 20000") {
        return "0 - 20K";
      } else if (initialValues.odometer == "20001 - 40000") {
        return "20K - 40K";
      } else if (initialValues.odometer == "40001 - 60000") {
        return "40K - 60K";
      } else if (initialValues.odometer == "60001 - 80000") {
        return "60K - 80K";
      } else if (initialValues.odometer == "80001 - 100000") {
        return "80K - 100K";
      } else if (initialValues.odometer == "100001 - 120000") {
        return "100K - 120K";
      } else if (initialValues.odometer == "over 1200001") {
        return "Over 1200K";
      }
    }
  }

  setDeliveryPotions = () => {
    const { delivery_options } = this.props;
    return _.values(delivery_options).map(option => {
      return {
        id: _.invert(delivery_options)[option],
        value: option
      };
    });
  };

  handleLocationSelect = location => {
    this.setState({ location });
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ lat: latLng.lat, lng: latLng.lng });
      })
      .catch(error => console.error("Error", error));
  };

  offerFreeDeliveryOptions() {
    return offerFreeDeliveryOptions.map(i => {
      return (
        <option key={i.key} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  validateForm = (data, attachmentsCount) => {
    const { discount_daily, discount_weekly, discount_monthly } = this.state;
    let errors = {};
    if (!data.daily_rate) {
      errors.daily_rate = "Daily Rate is required!";
    }
    if (data.daily_rate && data.daily_rate === 0.0) {
      errors.daily_rate = "Daily Rate is required!";
    }
    if (discount_daily < 0 || discount_daily > 99.99) {
      errors.discount_daily = "Invalid percentage!";
    }
    if (discount_weekly < 0 || discount_weekly > 99.99) {
      errors.discount_weekly = "Invalid percentage!";
    }
    if (discount_monthly < 0 || discount_monthly > 99.99) {
      errors.discount_monthly = "Invalid percentage!";
    }
    if (!data.description) {
      errors.description = "Description is required!";
    } else if (data.description.length < 25) {
      errors.description = "Description must be minimum 25 characters!";
    }
    if (attachmentsCount < 4) {
      errors.car_photos = "Minimun 4 photos are required!";
    }

    return errors;
  };

  saveChanges = (attachments, attachmentCount = 0) => {
    const {
      id,
      car_rent_shortest,
      car_rent_longest,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      time_to_confirm,
      delivery_option,
      free_delivery_locations,
      daily_rate,
      discount_daily,
      discount_weekly,
      discount_monthly,
      car_features,
      description,
      pickup_instructions,
      location,
      lat,
      lng,
      profile_image_index,
      offer_dropoff_location,
      deletedImgList,
      offer_delivery
    } = this.state;

    const data = {
      location,
      latitude: lat,
      longitude: lng,
      rent_car_longest: car_rent_longest,
      rent_car_shortest: car_rent_shortest,
      time_to_confirm,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      daily_rate,
      description,
      pickup_instructions,
      delivery_option,
      car_free_delivery_location: free_delivery_locations,
      features: car_features,
      offer_delivery
    };

    if (offer_dropoff_location) {
      data.offer_dropoff_location = 1;
    } else {
      data.offer_dropoff_location = 0;
    }

    let multiDiscount = [];
    multiDiscount.push({
      discount: discount_daily,
      discount_days: 1
    });
    multiDiscount.push({
      discount: discount_weekly,
      discount_days: 2
    });
    multiDiscount.push({
      discount: discount_monthly,
      discount_days: 3
    });

    if (multiDiscount.length > 0) {
      data.multiple_discounts = multiDiscount;
    }

    const errors = this.validateForm(data, attachmentCount);

    this.setState({
      isLoading: true
    });

    if (!Object.keys(errors).length) {
      if (attachments.length > 0 || deletedImgList.length > 0) {
        const data = {
          car_id: id,
          images: { uploaded: attachments, removed: deletedImgList }
        };
        if (profile_image_index) {
          data.profile_image_index = attachments.findIndex(i => {
            return profile_image_index == i;
          });
        }

        Axios.post(`${process.env.REACT_APP_API_URL}v4/car-photos`, data, {
          headers: {
            Authorization: localStorage.access_token
          }
        })
          .then(() => {})
          .catch(err => {
            this.props.dispatch(authFail(err));
            console.log("err", err);
          });
      }

      Axios.post(
        `${process.env.REACT_APP_API_URL}v2/car/edit-mobile/${id}`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
        .then(res => {
          if (!res.data.error) {
            this.props.dispatch(getRegisteringCar(id));
            this.props.dispatch(toggleDrawer());
            this.setState({
              isLoading: false,
              showModal: true
            });
          }
        })
        .catch(error => {
          this.props.dispatch(authFail(error));
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            this.setState({
              error: error.response.data.message,
              isLoading: false
            });
            setTimeout(() => {
              this.setState({ error: "" });
            }, 7000);
          }
        });
    } else {
      this.setState({ errObj: errors, isLoading: false });
    }
  };

  renderSubmitButton = (attachment, attachmentCount) => {
    const { errObj, isLoading, error } = this.state;
    return (
      <div className="row">
        <div className="GC_form_error">{error && <span> {error} </span>}</div>
        <div className="col-md-2 col-md-offset-5 col-xs-12">
          {errObj.car_photos && (
            <div className="GC_form_error">{errObj.car_photos}</div>
          )}

          <button
            className="List_submit_btn col-md-12"
            onClick={() => {
              this.saveChanges(attachment, attachmentCount);
            }}
          >
            {isLoading && (
              <div>
                <PreloaderIcon
                  style={{ marginRight: "5px" }}
                  loader={Oval}
                  size={20}
                  strokeWidth={8} // min: 1, max: 50
                  strokeColor="#fff"
                  duration={800}
                />
              </div>
            )}
            Save
          </button>
        </div>
      </div>
    );
  };

  removeUploadImage = id => {
    const { deletedImgList, initialPhotos } = this.state;
    deletedImgList.push(id);
    const newArray = initialPhotos.filter(img => {
      return img.id !== id;
    });
    this.setState({ deletedImgList, initialPhotos: newArray });
    return new Promise((resolve, reject) => {
      resolve({ data: { error: false } });
    });
  };

  setProfileImage = file => {
    if (!file.isNew) {
      Axios.post(
        `${process.env.REACT_APP_API_URL}car-photos/mark-as-main-image/${file.uid}`,
        { status: 1 },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
        .then(res => {})
        .catch(e => {
          this.props.dispatch(authFail(e));
        });
    } else {
      this.setState({ profile_image_index: file.key });
    }
  };
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

  render() {
    const {
      initialValues,
      showCarProtectionModal,
      car,
      showCarProtection,
      handleCloseModal,
      carProtectionLevels,
      changeProtectionLevel,
      freeDeliveryLoations,
      features
    } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };
    const {
      car_rent_shortest,
      car_rent_longest,
      miles_allowed_per_day,
      miles_allowed_per_week,
      miles_allowed_per_month,
      time_to_confirm,
      delivery_option,
      free_delivery_locations,
      daily_rate,
      discount_daily,
      discount_weekly,
      discount_monthly,
      car_features,
      description,
      pickup_instructions,
      location,
      initialPhotos,
      errObj,
      offer_delivery,
      offer_dropoff_location
    } = this.state;

    return (
      <div className="row">
        <div className="col-sm-12 car-form car-update">
          <div className="car-update-header">
            <h2>Your {car.car_name}</h2>
          </div>
          <div className="car-update-form-wrapper">
            <div className="form-horizontal">
              <div className="form-header" />
              <div className="form-group-set">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label>Location</label>
                      <PlacesAutocomplete
                        value={location}
                        onChange={location => {
                          this.setState({ location });
                        }}
                        onSelect={this.handleLocationSelect}
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
                                placeholder: "Enter your location here*",
                                className: errObj.location
                                  ? "SC_drawer_textfield_dmg error"
                                  : "SC_drawer_textfield_dmg cruptd-nohover"
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
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style
                                    })}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Year</label>
                      <p className="car-form-txt">{car.year}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Make</label>
                      <p className="car-form-txt">{car.car_make.name}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Model</label>
                      <p className="car-form-txt">{car.car_model.name}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Trim</label>
                      <p className="car-form-txt">
                        {car.trim && car.trim.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Type</label>
                      <p className="car-form-txt">
                        {car.car_type && car.car_type}
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Odometer</label>
                      <p className="car-form-txt">{this.odometerValues()}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Transmission</label>
                      <p className="car-form-txt">
                        {car.transmission ? "Automatic" : "Manual"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-header">Preferences</div>
              <div className="form-group-set">
                <div className="row">
                  <div className="col-sm-4">
                    <h5>Rental Period</h5>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Minimum</label>
                          <select
                            className="form-control"
                            onChange={e =>
                              this.setState({
                                car_rent_shortest: e.target.value
                              })
                            }
                            value={car_rent_shortest}
                          >
                            {carRentShortest.map((period, index) => {
                              return (
                                <option key={index} value={period.value}>
                                  {period.value}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Maximum</label>
                          <select
                            className="form-control"
                            onChange={e =>
                              this.setState({
                                car_rent_longest: e.target.value
                              })
                            }
                            value={car_rent_longest}
                          >
                            {carRentLongest.map((time, index) => {
                              return (
                                <option key={index} value={time.value}>
                                  {time.value}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <h5>Miles Allowed Per</h5>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Day</label>
                          <select
                            className="form-control"
                            value={miles_allowed_per_day}
                            onChange={e =>
                              this.setState({
                                miles_allowed_per_day: e.target.value,
                                miles_allowed_per_week:
                                  e.target.value == "Unlimited"
                                    ? "Unlimited"
                                    : miles_allowed_per_week,
                                miles_allowed_per_month:
                                  e.target.value == "Unlimited"
                                    ? "Unlimited"
                                    : miles_allowed_per_month
                              })
                            }
                          >
                            {milesPerDay.map((days, index) => {
                              return (
                                <option key={index} value={days.value}>
                                  {days.value}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Week</label>
                          <select
                            className="form-control"
                            onChange={e =>
                              this.setState({
                                miles_allowed_per_week: e.target.value,
                                miles_allowed_per_month:
                                  e.target.value == "Unlimited"
                                    ? "Unlimited"
                                    : miles_allowed_per_month
                              })
                            }
                            value={miles_allowed_per_week}
                          >
                            {this.milesPerWeek()}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Month</label>
                          <select
                            className="form-control"
                            onChange={e =>
                              this.setState({
                                miles_allowed_per_month: e.target.value
                              })
                            }
                            value={miles_allowed_per_month}
                          >
                            {this.milesPerMonth()}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Advance Notice Time to Confirm</label>
                          <select
                            className="form-control"
                            onChange={e =>
                              this.setState({ time_to_confirm: e.target.value })
                            }
                            value={time_to_confirm}
                          >
                            {confirmTimeArray.map((confirmTime, index) => {
                              return (
                                <option key={index} value={confirmTime.value}>
                                  {confirmTime.value}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-sep">
                  <div className="form-group">
                    <label className="control-label col-sm-3  col-xs-12 offer-del">
                      Offer delivery & drop off
                    </label>
                    <div className="col-sm-9">
                      <div className="caredit_radioset">
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
                                value={option.id}
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
                                          offer_delivery={offer_delivery}
                                          onChange={offer_delivery =>
                                            this.setState({ offer_delivery })
                                          }
                                        />

                                        <div className="section-devider" />

                                        <Checkbox
                                          className="offer-deliver-option"
                                          checked={offer_dropoff_location}
                                          onChange={e =>
                                            this.setState({
                                              offer_dropoff_location:
                                                e.target.checked
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
                                                Select this to offer drop-off at
                                                a location convenient to the
                                                renter. You earn $5 per mile up
                                                to 25 miles. The delivery miles
                                                are calculated from the location
                                                of the car.
                                              </Fragment>
                                            ) : (
                                              <Fragment>
                                                Select this to offer drop-off at
                                                a location convenient to the
                                                renter. ​
                                                <span className="strong-tag">
                                                  Delivery distance is
                                                  calculated from the location
                                                  of the car.
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
                                              offer_dropoff_location:
                                                e.target.checked
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
                                            Select this to offer drop-off at a
                                            location convenient to the renter.
                                            You earn $5 per mile up to 25 miles.
                                            The delivery miles are calculated
                                            from the location of the car.
                                          </p>
                                        </div>
                                      </Fragment>
                                    )}
                                </div>

                                {/* Offer delivery funtion */}
                              </Radio>
                            );
                          })}
                        </Radio.Group>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row row-sep">
                  <div className="form-group">
                    <label className="control-label col-sm-3 col-xs-12">
                      Offer Free Delivery To
                    </label>
                    <div className="col-sm-9">
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={values =>
                          this.setState({
                            free_delivery_locations: values
                          })
                        }
                        defaultValue={free_delivery_locations}
                      >
                        <Row>
                          {freeDeliveryLoations.map((location, key) => {
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
                      <div className="info-message-box margin-top-0">
                        <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
                        <p>
                          Offering more delivery options will attract more trips
                          for your car.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>License plate number</label>
                      <p className="car-form-txt">
                        {car.license_plate_number}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>State</label>
                      <p className="car-form-txt">{car.state} </p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Daily Rate</label>
                      <NumberFormat
                        value={daily_rate ? daily_rate : ""}
                        thousandSeparator={true}
                        prefix={"$"}
                        decimalScale={2}
                        onValueChange={values => {
                          const { floatValue } = values;
                          this.setState({ daily_rate: floatValue });
                          delete errObj.daily_rate;
                        }}
                      />
                      {errObj.daily_rate && (
                        <div className="GC_form_error">{errObj.daily_rate}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <label className="control-label">
                      Weekly/Monthly discount
                    </label>
                    <div className="row">
                      <div className="col-sm-4">
                        <label>3 Days</label>
                        <div className="form-group">
                          <NumberFormat
                            value={discount_daily ? discount_daily : ""}
                            suffix={"%"}
                            decimalScale={2}
                            onValueChange={values => {
                              const { floatValue } = values;
                              const decimal = Math.floor(floatValue);
                              if (decimal > 0 && decimal < 100) {
                                this.setState({ discount_daily: floatValue });
                              } else {
                                this.setState({
                                  discount_daily: 0
                                });
                              }
                              delete errObj.discount_daily;
                            }}
                          />
                          {errObj.discount_daily && (
                            <div className="GC_form_error">
                              {errObj.discount_daily}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <label>Weekly</label>
                        <div className="form-group">
                          <NumberFormat
                            value={discount_weekly ? discount_weekly : ""}
                            suffix={"%"}
                            decimalScale={2}
                            onValueChange={values => {
                              const { floatValue } = values;
                              const decimal = Math.floor(floatValue);
                              if (decimal > 0 && decimal < 100) {
                                this.setState({ discount_weekly: floatValue });
                              } else {
                                this.setState({
                                  discount_weekly: 0
                                });
                              }
                              delete errObj.discount_weekly;
                            }}
                          />
                          {errObj.discount_weekly && (
                            <div className="GC_form_error">
                              {errObj.discount_weekly}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <label>Monthly</label>
                        <div className="form-group">
                          <NumberFormat
                            value={discount_monthly ? discount_monthly : ""}
                            suffix={"%"}
                            decimalScale={2}
                            onValueChange={values => {
                              const { floatValue } = values;
                              const decimal = Math.floor(floatValue);
                              if (decimal > 0 && decimal < 100) {
                                this.setState({ discount_monthly: floatValue });
                              } else {
                                this.setState({
                                  discount_monthly: 0
                                });
                              }
                            }}
                          />
                          {errObj.discount_monthly && (
                            <div className="GC_form_error">
                              {errObj.discount_monthly}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="control-label">Features</label>
                      <div>
                        <Checkbox.Group
                          style={{ width: "100%" }}
                          onChange={values =>
                            this.setState({ car_features: values })
                          }
                          defaultValue={car_features}
                        >
                          <Row>
                            {features.map((feature, key) => {
                              return (
                                <Col span={4} key={key}>
                                  <Checkbox value={feature.id}>
                                    {feature.name}
                                  </Checkbox>
                                </Col>
                              );
                            })}
                          </Row>
                        </Checkbox.Group>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label className="control-label">
                        Car protection level
                      </label>
                      <p className="car-form-txt">
                        {initialValues &&
                          initialValues.currentProtectionLevel.title}
                      </p>
                      <a onClick={showCarProtection}>Change</a>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label>Car Description</label>
                      <textarea
                        className="form-control"
                        value={description}
                        onChange={e => {
                          this.setState({ description: e.target.value });
                          delete errObj.description;
                        }}
                      />
                      {errObj.description && (
                        <div className="GC_form_error">
                          {errObj.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label>Pick up instructions</label>
                      <textarea
                        className="form-control"
                        value={pickup_instructions ? pickup_instructions : ""}
                        onChange={e =>
                          this.setState({ pickup_instructions: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-header">
                <label>Car Photos</label>
              </div>

              <Upload
                initialValues={initialPhotos}
                renderSubmitButton={this.renderSubmitButton}
                folder="tmp/car"
                removeUploadImage={this.removeUploadImage}
                multipleUploads={true}
                setCustomPrivew={this.setCustomPrivew}
                setProfileImage={this.setProfileImage}
                enableProfileImageFeature={true}
              />
            </div>
          </div>

          <Modal
            className="protection-modal"
            isOpen={showCarProtectionModal}
            contentLabel="Modal"
            style={carProtectionModal}
            shouldCloseOnOverlayClick={true}
            onRequestClose={handleCloseModal}
          >
            <CarProtectionLevels
              carProtectionLevels={carProtectionLevels}
              changeProtectionLevel={changeProtectionLevel}
              currentProtectionLevel={
                initialValues && initialValues.currentProtectionLevel.value
              }
              carId={car.id}
            />
          </Modal>

          <Modal
            isOpen={this.state.showModal}
            onRequestClose={() => this.setState({ showModal: false })}
            contentLabel="Modal"
            shouldCloseOnOverlayClick={false}
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="sign-up-popup congratulations-popup">
              <div className="icon">
                <img src="/images/checkout/success-icon-green.png" />
              </div>
              <div className="header">
                Changes have saved <br />
                for further trips
              </div>
              <div className="btn">
                <button
                  className="btn SC_btn_submit"
                  onClick={() => {
                    this.setState({ showModal: false });
                    this.props.history.goBack();
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  delivery_options: state.car.delivery_options
});

export default withRouter(connect(mapStateToProps)(UpdateForm));
