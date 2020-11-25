import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import { discountConditions } from "../../../consts/consts";
import { Checkbox, Row, Col } from "antd";
import { getFeatures, getRegisteringCar } from "../../../actions/CarActions";
import NumberFormat from "react-number-format";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/grid/style/index.css";
import { authFail } from "../../../actions/AuthAction";

class StepFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      license_plate_number: "",
      description: "",
      features: "",
      daily_rate: "",
      discount_days: "",
      state: "",
      discount_daily: "",
      discount_weekly: "",
      discount_monthly: " ",
      errObj: {},
      error: false,
      message: "",
      submitting: false
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getFeatures());
  }

  componentDidMount() {
    const { car } = this.props;
    this.setInitialData(car);
  }

  componentWillReceiveProps(nextProps) {
    const { car } = this.props;
    if (nextProps.car != car) {
      this.setInitialData(this.setInitialData(nextProps.car));
    }
  }

  setInitialData = car => {
    if (!car) {
      return false;
    }

    const {
      license_plate_number,
      description,
      daily_rate,
      discount_days,
      multiple_discounts,
      features,
      state
    } = car;
    this.setState({
      license_plate_number,
      description,
      daily_rate,
      discount_days,
      discount_daily: multiple_discounts.find(i => {
        return i.discount_days == 1;
      })
        ? multiple_discounts.find(i => {
            return i.discount_days == 1;
          }).discount
        : "",
      discount_weekly: multiple_discounts.find(i => {
        return i.discount_days == 2;
      })
        ? multiple_discounts.find(i => {
            return i.discount_days == 2;
          }).discount
        : "",
      discount_monthly: multiple_discounts.find(i => {
        return i.discount_days == 3;
      })
        ? multiple_discounts.find(i => {
            return i.discount_days == 3;
          }).discount
        : "",
      features,
      state
    });
  };

  discountConditions() {
    return discountConditions.map(i => {
      return (
        <option key={i.key} value={i.key}>
          {i.value}
        </option>
      );
    });
  }

  usStates() {
    const { usStates } = this.props;
    return usStates.map((item, index) => {
      return (
        <option key={index} value={item.code}>
          {item.name}
        </option>
      );
    });
  }

  validateForm = data => {
    let errors = {};
    if (data.daily_rate && data.daily_rate <= 0) {
      errors.daily_rate = "Daily rate invalid";
    } else if (!data.description) {
      errors.description = "Description is required!";
    } else if (data.description.length < 25) {
      errors.description = "Description must be minimum 25 characters!";
    }

    return errors;
  };

  focusToError = fields => {
    for (let index = 0; index < fields.length; index++) {
      for (let [key, value] of Object.entries(fields[index])) {
        if (!value) {
          if (key == "daily_rate" && value <= 0) {
            this[key].focus();
          }
          this[key].focus();
          return false;
        }
      }
    }
  };

  formSubmit = async () => {
    const { loadNext, dispatch, history, match } = this.props;

    const {
      license_plate_number,
      description,
      daily_rate,
      discount_daily,
      discount_weekly,
      discount_monthly,
      state,
      features
    } = this.state;

    if (
      !license_plate_number ||
      !state ||
      (!daily_rate || daily_rate < 0) ||
      !description
    ) {
      this.setState({ error: true, submitting: false }, () => {
        var _state;
        if (state) {
          _state = this._state;
        }
        this.focusToError([
          { license_plate_number },
          { _state },
          { daily_rate },
          { description }
        ]);
      });
      return false;
    }

    const obj = {
      license_plate_number: license_plate_number,
      daily_rate: daily_rate,
      state: state,
      description: description,
      features: features
    };

    let multiDiscount = [];
    if (discount_daily) {
      multiDiscount.push({
        discount: discount_daily,
        discount_days: 1
      });
    }
    if (discount_weekly) {
      multiDiscount.push({
        discount: discount_weekly,
        discount_days: 2
      });
    }
    if (discount_monthly) {
      multiDiscount.push({
        discount: discount_monthly,
        discount_days: 3
      });
    }

    if (multiDiscount.length > 0) {
      obj.multiple_discounts = multiDiscount;
    }
    const errors = this.validateForm(obj);

    if (!Object.keys(errors).length) {
      this.setState({ submitting: true });
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
        dispatch(authFail(error));
      }
    } else {
      this.setState({ errObj: errors });
    }
  };

  render() {
    const { loadPrevious, car_features, car } = this.props;

    const {
      license_plate_number,
      description,
      daily_rate,
      discount_daily,
      discount_weekly,
      discount_monthly,
      features,
      errObj,
      state,
      error
    } = this.state;

    return (
      <div>
        <div className="form-horizontal">
          <br />
          <h4 className="center">Car registration details</h4>
          <br />

          <div className="form-group">
            <label className="control-label col-sm-3">
              License plate number <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-6">
              <input
                type="text"
                className={
                  error && !license_plate_number
                    ? "form-control error"
                    : "form-control"
                }
                value={license_plate_number}
                onChange={e =>
                  this.setState({
                    license_plate_number: e.target.value
                  })
                }
                ref={ref => (this.license_plate_number = ref)}
              />
              {error && !license_plate_number && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3">
              State <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-6">
              <select
                className={
                  error && !state ? "form-control error" : "form-control"
                }
                value={state}
                onChange={e =>
                  this.setState({
                    state: e.target.value
                  })
                }
                ref={ref => (this._state = ref)}
              >
                <option />
                {this.usStates()}
              </select>
              {error && !state && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3">
              Daily rate <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-3">
              <NumberFormat
                className={
                  (error && !daily_rate) || daily_rate <= 0
                    ? "car-list-numlist error"
                    : "form-control car-list-numlist"
                }
                value={daily_rate ? daily_rate : ""}
                thousandSeparator={true}
                prefix={"$ "}
                decimalScale={2}
                allowNegative={false}
                onValueChange={values => {
                  const { floatValue } = values;
                  this.setState({ daily_rate: floatValue });
                  delete errObj.daily_rate;
                }}
                getInputRef={ref => (this.daily_rate = ref)}
              />
              {((error && !daily_rate) || daily_rate <= 0) && (
                <span style={{ color: "red", fontSize: 10 }}>Required</span>
              )}
            </div>
            <div className="col-sm-3 checkbox" />
          </div>

          <div className="row form-group">
            <div className="col-sm-3">
              <label className="control-label">
                Weekly / Monthly discount (%)
              </label>
            </div>
            <div className="col-sm-9">
              <div className="row">
                <div className="col-sm-4">
                  <label className="car-list-numlist-title">
                    {" "}
                    Over 3 days{" "}
                  </label>
                  <NumberFormat
                    value={discount_daily ? discount_daily : ""}
                    suffix={"%"}
                    decimalScale={2}
                    inputMode="numeric"
                    allowNegative={false}
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
                    <div className="GC_form_error">{errObj.discount_daily}</div>
                  )}
                </div>
                <div className="col-sm-4">
                  <label className="car-list-numlist-title">
                    {" "}
                    Over weekly{" "}
                  </label>
                  <NumberFormat
                    value={discount_weekly ? discount_weekly : ""}
                    suffix={"%"}
                    decimalScale={2}
                    inputMode="numeric"
                    allowNegative={false}
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
                <div className="col-sm-4">
                  <label className="car-list-numlist-title">
                    {" "}
                    Over monthly{" "}
                  </label>
                  <NumberFormat
                    value={discount_monthly ? discount_monthly : ""}
                    suffix={"%"}
                    decimalScale={2}
                    inputMode="numeric"
                    allowNegative={false}
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

          <div className="form-group">
            <label className="control-label col-sm-3">
              Car description <span className="form_req_star">*</span>
            </label>
            <div className="col-sm-9">
              <textarea
                className={
                  error && !description ? "form-control error" : "form-control"
                }
                value={description}
                onChange={e =>
                  this.setState({
                    description: e.target.value
                  })
                }
                placeholder="Tell People About Your Car."
                ref={ref => (this.description = ref)}
              />
              {errObj.description && (
                <div className="GC_form_error">{errObj.description}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-3">Features</label>
            <div className="col-sm-9">
              <Checkbox.Group
                className="label-group"
                style={{ width: "100%" }}
                //  defaultValue={features}
                value={features}
                onChange={values => this.setState({ features: values })}
              >
                <Row>
                  {car_features.map((feature, key) => {
                    return (
                      <Col span={4} key={key}>
                        <Checkbox value={feature.id}>{feature.name}</Checkbox>
                      </Col>
                    );
                  })}
                </Row>
              </Checkbox.Group>
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
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.user,
    car_features: state.car.features,
    usStates: state.car.usStates
  };
};

export default withRouter(connect(mapStateToProps)(StepFour));
