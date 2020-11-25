import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { withRouter } from "react-router-dom";
import { Radio } from "antd";
import {
  getModels,
  getMakes,
  getTrims,
  getRegisteringCar
} from "../../../actions/CarActions";
import {
  GET_MAKES,
  GET_CAR_MODELS,
  GET_CAR_TRIMS
} from "../../../actions/ActionTypes";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { carTypes } from "../../../consts/consts";
import "antd/lib/radio/style/index.css";
import ReactPixel from "react-facebook-pixel";
import { authFail } from "../../../actions/AuthAction";

class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      lat: "",
      lng: "",
      year: "",
      make_id: "",
      model_id: "",
      trim_id: "",
      type: "",
      odometer: "",
      error: false,
      message: "",
      submitting: false,
      transmission: 1
    };
  }

  componentDidMount() {
    this.setInitialData(this.setInitialData(this.props.car));
  }

  componentWillReceiveProps(nextProps) {
    const { car, dispatch } = this.props;
    if (nextProps.car != car) {
      //
      this.setInitialData(this.setInitialData(nextProps.car));
    }
    if (car && car.make_id != nextProps.car.make_id) {
      dispatch(getModels(nextProps.car.make_id));
    }
  }

  handleType = e => {
    this.setState({ type: e.target.value });
  };

  handleOdometer = e => {
    this.setState({
      odometer: e.target.value
    });
  };

  carTypeList = () => {
    return carTypes.map(type => {
      return (
        <option key={type.key} value={type.value}>
          {type.value}
        </option>
      );
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
    try {
      const { loadNext, dispatch, history, match } = this.props;
      this.setState({ submitting: true });

      const {
        location,
        lat,
        lng,
        year,
        make_id,
        model_id,
        type,
        odometer,
        transmission,
        trim_id
      } = this.state;

      ReactPixel.trackCustom("Started List my Ryde", {
        car_make_id: make_id,
        car_model_id: model_id
      });

      if (
        !location ||
        !year ||
        !make_id ||
        !model_id ||
        !type ||
        !odometer ||
        !trim_id
      ) {
        this.setState({ error: true, submitting: false }, () => {
          this.focusToError([
            { location },
            { year },
            { make_id },
            { model_id },
            { trim_id },
            { type },
            { odometer }
          ]);
        });
        return false;
      }
      const obj = {
        location: location,
        latitude: lat,
        longitude: lng,
        year: year,
        car_make: make_id,
        car_model: model_id,
        car_type: type,
        odometer: odometer,
        transmission: transmission,
        trim: trim_id
      };

      var url = "cars";
      if (match.params.id) {
        url = `v2/car/edit-mobile/${match.params.id}`;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${url}`,
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
        loadNext();
        history.push(`/car-create/${response.data.car.id}`);
      }
    } catch (error) {
      this.setState({ submitting: false });
      console.log("error", error);
      this.props.dispatch(authFail(error));
    }
  };

  handleSearch = location => {
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const { lat, lng } = latLng;
        this.setState({ location, lat, lng });
      });
  };

  onChangeYear = year => {
    this.setState({ year }, () => {
      year != "" ? this._fetchData() : this.clearMakeModelState();
    });
  };

  makeSelected(e) {
    this.setState({ make_id: e.target.value }, () => {
      this._fetchData();
    });
  }

  onChangeModel = model_id => {
    this.setState({ model_id }, () => {
      this._fetchData();
    });
  };

  _fetchData = () => {
    const { year, make_id, model_id } = this.state;
    const { dispatch } = this.props;
    if (year) {
      dispatch(getMakes(year));
    }
    if (year && make_id) {
      dispatch(getModels(year, make_id));
    }
    if (year && make_id && model_id) {
      dispatch(getTrims(year, make_id, model_id));
    }
  };

  makeList() {
    return this.props.makes.map(make => {
      return (
        <option key={make.makes.id} value={make.makes.id}>
          {make.makes.name}
        </option>
      );
    });
  }

  modelList() {
    return this.props.carModels.map(model => {
      return (
        <option key={model.models.id} value={model.models.id}>
          {model.models.name}
        </option>
      );
    });
  }

  trimList() {
    return this.props.trims.map(trim => {
      return (
        <option key={trim.trims.id} value={trim.trims.id}>
          {trim.trims.name}
        </option>
      );
    });
  }

  clearMakeModelState = () => {
    const { dispatch } = this.props;
    this.setState({
      make_id: "",
      model_id: "",
      trim_id: ""
    });
    dispatch({ type: GET_MAKES, payload: [] });
    dispatch({ type: GET_CAR_MODELS, payload: [] });
    dispatch({ type: GET_CAR_TRIMS, payload: [] });
  };

  render() {
    const {
      location,
      year,
      make_id,
      model_id,
      type,
      odometer,
      transmission,
      trim_id,
      error
    } = this.state;
    const { years } = this.props;

    return (
      <div className="form-horizontal">
        <br />
        <h4 className="center">Tell us about your car</h4>
        <br />

        <div className="sub-form">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="row form-row">
                <div className="col-md-4 title">
                  Location <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <PlacesAutocomplete
                    value={location}
                    onChange={location => {
                      this.setState({ location });
                    }}
                    onSelect={this.handleSearch}
                    searchOptions={{
                      location: new window.google.maps.LatLng(
                        34.0522,
                        -118.243
                      ),
                      radius: 2000,
                      route: "Los Angeles County",
                      //types: ['address'],
                      componentRestrictions: {
                        country: "us"
                      }
                    }}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading
                    }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: "",
                            className:
                              error && !location
                                ? "locationInput listFormInput error"
                                : "locationInput listFormInput"
                          })}
                          ref={ref => (this.location = ref)}
                        />
                        <div className="row expanded-location">
                          {loading && (
                            <div className="load-icon">Loading ...</div>
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
                  {error && !location && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Year <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !year ? "listFormInput error" : "listFormInput"
                    }
                    value={year}
                    onChange={e => this.onChangeYear(e.target.value)}
                    required
                    ref={ref => (this.year = ref)}
                  >
                    <option />
                    {years.map((year, index) => {
                      return (
                        <option key={index} value={year.year}>
                          {year.year}
                        </option>
                      );
                    })}
                  </select>
                  {error && !year && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Make <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !make_id
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    name="make"
                    value={make_id}
                    onChange={e => this.makeSelected(e)}
                    required
                    disabled={this.makeList().length > 0 ? false : true}
                    ref={ref => (this.make_id = ref)}
                  >
                    <option />
                    {this.makeList()}
                  </select>
                  {error && !make_id && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Model <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !model_id
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    name="model"
                    value={model_id}
                    disabled={this.modelList().length > 0 ? false : true}
                    onChange={e => this.onChangeModel(e.target.value)}
                    ref={ref => (this.model_id = ref)}
                  >
                    <option />
                    {this.modelList()}
                  </select>
                  {error && !model_id && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Trim <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !trim_id
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    name="trim_id"
                    value={trim_id}
                    disabled={this.trimList().length > 0 ? false : true}
                    onChange={e => this.setState({ trim_id: e.target.value })}
                    ref={ref => (this.trim_id = ref)}
                  >
                    <option />
                    {this.trimList()}
                  </select>
                  {error && !trim_id && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Type <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !type ? "listFormInput error" : "listFormInput"
                    }
                    onChange={e => this.handleType(e)}
                    value={type}
                    ref={ref => (this.type = ref)}
                  >
                    <option />
                    {this.carTypeList()}
                  </select>
                  {error && !type && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">
                  Odometer <span className="form_req_star">*</span>
                </div>
                <div className="col-md-8">
                  <select
                    className={
                      error && !odometer
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    onChange={e => this.handleOdometer(e)}
                    value={odometer}
                    ref={ref => (this.odometer = ref)}
                  >
                    <option />
                    <option value="0 - 20000">0 - 20K</option>
                    <option value="20001 - 40000">20K - 40K</option>
                    <option value="40001 - 60000">40K - 60K</option>
                    <option value="60001 - 80000">60K - 80K</option>
                    <option value="80001 - 100000">80K - 100K</option>
                    <option value="100001 - 120000">100K - 120K</option>
                    <option value="over 120001">over 120K </option>
                  </select>
                  {error && !odometer && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>

              <div className="row form-row">
                <div className="col-md-4 title">Transmission</div>
                <div className="col-md-8 form-custfield">
                  <Radio.Group
                    onChange={e =>
                      this.setState({ transmission: e.target.value })
                    }
                    value={transmission}
                  >
                    <Radio value={1}>Automatic</Radio>
                    <Radio value={0}>Manual</Radio>
                  </Radio.Group>
                  <br />
                  {/* {error && (transmission != 0 || transmission != 1) && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="List_outer_wrapper">
          <div className="List_button_wrapper">
            <div className="List_button-box">
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
    );
  }
  setInitialData = car => {
    if (!car) {
      return false;
    }
    const {
      location,
      lat,
      lng,
      zip_code,
      year,
      make_id,
      model_id,
      type,
      odometer,
      state,
      transmission,
      trim_id
    } = car;
    this.setState({
      location,
      lat,
      lng,
      zip_code,
      year,
      make_id,
      model_id,
      trim_id,
      type,
      odometer,
      state,
      transmission
    });
  };
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    years: state.car.years,
    makes: state.car.makes,
    carModels: state.car.carModels,
    trims: state.car.trims
  };
};

export default withRouter(connect(mapStateToProps)(StepOne));
