import React, { Component } from "react";
import { Field, reduxForm, change } from "redux-form";
import _ from "lodash";
import CheckboxGroup from "../../form-components/CheckboxGroup";
import {
  confirmTimeArray,
  carRentShortest,
  carRentLongest,
  milesPerDay,
  milesPerWeek,
  milesPerMonth,
  offerFreeDeliveryOptions
} from "../../consts/consts";
import PhoneVerification from "../../components/verifications/PhoneVerification";
import { updateProfile } from "../../actions/UserActions";

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (var i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
};

class AvailabilityForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offerFreeDelivery: false,
      showPopUp: false
    };
    this.offerFreeDelivery = this.offerFreeDelivery.bind(this);
  }

  componentDidMount() {
    const { initialValues } = this.props;
    if (
      initialValues &&
      initialValues.car_free_delivery_location.length &&
      initialValues.offer_free_delivery
    ) {
      this.setState({ offerFreeDelivery: true });
    } else if (initialValues) {
      this.setState({ offerFreeDelivery: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentInitialValues = this.props.initialValues;
    const { initialValues } = nextProps;

    if (
      nextProps.initialValues &&
      nextProps.initialValues.car_free_delivery_location.length &&
      nextProps.initialValues.offer_free_delivery
    ) {
      this.setState({ offerFreeDelivery: true });
    }

    if (nextProps.initialValues.verified_phone == 1) {
      this.setState({ showPopUp: false });
    }
    if (nextProps.verifyPhone && this.state.showPopUp == false) {
      this.setState({ showPopUp: true });
    }
  }

  getFreeDeliverys(locations) {
    return locations.map(location => {
      return {
        label: location.name,
        value: location.id
      };
    });
  }

  renderField = ({
    input,
    label,
    name,
    options,
    placeholder,
    type,
    className,
    meta: { touched, error }
  }) => (
    <div className="form-group">
      {label != "empty" ? (
        <label className="control-label col-sm-3">{label}</label>
      ) : (
        ""
      )}
      <div className={label === "empty" ? "col-sm-12" : "col-sm-8"}>
        <select {...input} className={className}>
          <option value="">{placeholder}</option>
          {options.map(option => {
            return <option key={option.value}>{option.value}</option>;
          })}
        </select>
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    </div>
  );

  renderFieldWithOtherText = ({
    input,
    label,
    name,
    options,
    placeholder,
    otherText = null,
    type,
    className,
    meta: { touched, error }
  }) => (
    <div className="form-group">
      {label != "empty" ? (
        <label className="control-label col-sm-3">{label}</label>
      ) : (
        ""
      )}
      <div className="col-sm-4">
        <select {...input} className={className}>
          <option value="">{placeholder}</option>
          {options.map(option => {
            return <option key={option.value}>{option.value}</option>;
          })}
        </select>
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
      <div className="col-sm-5">
        <label className="control-label">{otherText}</label>
      </div>
    </div>
  );

  offerFreeDelivery() {
    if (this.state.offerFreeDelivery) {
      this.props.dispatch(
        change("car-registration-3", "car_free_delivery_location", [])
      );
      this.props.dispatch(
        change("car-registration-3", "offer_free_delivery", "")
      );
    }

    this.setState({ offerFreeDelivery: !this.state.offerFreeDelivery });
  }

  handleSave() {
    if (
      this.props.verifyPhone &&
      this.props.initialValues.verified_phone == 0
    ) {
      const user = [];
      user.email = this.props.initialValues.email;
      user.id = this.props.initialValues.user_id;
      user.first_name = this.props.initialValues.first_name;
      user.last_name = this.props.initialValues.last_name;
      user.date_of_birth = this.props.initialValues.date_of_birth;
      user.license_issued_state = this.props.initialValues.license_issued_state;
      user.driving_license_number = this.props.initialValues.driving_license_number;
      user.driving_license_expiration = this.props.initialValues.driving_license_expiration;
      user.phone_number = this.props.initialValues.phone_number;
      updateProfile(user, this.props.dispatch);
    } else {
      this.props.handleSubmit();
    }
  }

  render() {
    const {
      initialValues,
      handleSubmit,
      previousPage,
      delivery_options,
      free_delivery_loations,
      error
    } = this.props;
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <br />
        <h4 className="center">Your Preferences</h4>
        <br />
        <div className="form-group">
          <label className="control-label col-sm-3">
            Rental period preferred
          </label>
          <div className="col-sm-4">
            <Field
              component={this.renderField}
              type="select"
              label="empty"
              placeholder="Shortest"
              name="rent_car_shortest"
              options={carRentShortest}
              className="form-control"
            />
          </div>
          <div className="col-sm-4">
            <Field
              component={this.renderField}
              type="select"
              label="empty"
              placeholder="Longest"
              name="rent_car_longest"
              options={carRentLongest}
              className="form-control"
            />
          </div>
        </div>

        <Field
          component={this.renderField}
          type="select"
          label="Advance notice time to confirm"
          name="time_to_confirm"
          options={confirmTimeArray}
          className="form-control"
        />
        <div className="form-group">
          <label className="control-label col-sm-3">Miles Allowed Per</label>
          <div className="col-sm-3">
            <Field
              component={this.renderField}
              type="select"
              label="empty"
              placeholder="Day"
              name="miles_allowed_per_day"
              options={milesPerDay}
              className="form-control"
            />
          </div>
          <div className="col-sm-2">
            <Field
              component={this.renderField}
              type="select"
              label="empty"
              placeholder="Week"
              name="miles_allowed_per_week"
              options={milesPerWeek}
              className="form-control"
            />
          </div>
          <div className="col-sm-3">
            <Field
              component={this.renderField}
              type="select"
              label="empty"
              placeholder="Month"
              name="miles_allowed_per_month"
              options={milesPerMonth}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-3 offer-del">
            Offer Delivery
          </label>
          {/*
            <div className="col-sm-6">
              <div className="text-left control-label"> <label > Car is  available for</label></div>
            </div>
          */}
          <div className="col-sm-9">
            {_.map(delivery_options, (option, key) => {
              return (
                <div className="" key={"1" + key}>
                  <div className="" key={"2" + key}>
                    <div className="row" key={"3" + key}>
                      <div className="col-sm-12" key={"4" + key}>
                        <div className="field-labels">
                          <div>
                            <Field
                              component="input"
                              type="radio"
                              id={"delivery_option-" + key}
                              key={key}
                              name="delivery_option"
                              value={key}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={"delivery_option-" + key}
                              key={"6" + option.id}
                            >
                              {option}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <div className="car-create-offer-x">
            <div className="row">
              <div className="col-md-3 col-xs-6">
                <label className="control-label">Offer Free Delivery</label>
              </div>
              <div className="col-md-9 col-xs-6">
                <div className="check-box">
                <Field
                  component="input"
                  type="checkbox"
                  id="offerFreeDelivery"
                  name="offerFreeDelivery"
                  checked={this.state.offerFreeDelivery}
                  onChange={this.offerFreeDelivery}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.offerFreeDelivery && (
          <div>
            <div className="form-group">
              <label className="control-label col-sm-3">
                Offer Free Delivery To
              </label>
              <div className="col-sm-9">
                <CheckboxGroup
                  name="car_free_delivery_location"
                  options={this.getFreeDeliverys(free_delivery_loations)}
                />
              </div>
            </div>
            <Field
              component={this.renderFieldWithOtherText}
              type="select"
              label="Offer Free Delivery"
              name="offer_free_delivery"
              options={offerFreeDeliveryOptions}
              className="form-control"
              otherText="and over"
            />
            {error ? (
              <div className="form-group">
                <div className="col-sm-6 col-sm-offset-3">
                  <div className="alert alert-danger">
                    <strong>Error!</strong> {error}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
        {this.state.showPopUp && (
          <PhoneVerification
            signupFormData={this.props.verifyPhone}
            isOpen={this.state.showPopUp}
          />
        )}
        <div className="row">
          <div className="col-xs-6">
            <button
              type="button"
              onClick={previousPage}
              className="btn btn-default pull-right form-btn"
            >
              Back
            </button>
          </div>
          <div className="col-xs-6">
            <button
              type="button"
              onClick={() => {
                this.handleSave();
              }}
              className="btn btn-success pull-left form-btn"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    );
  }
}
const validate = values => {
  const errors = {};
  if (!values.rent_car_shortest) {
    errors.rent_car_shortest = "Required";
  }
  if (!values.rent_car_longest) {
    errors.rent_car_longest = "Required";
  }
  if (!values.time_to_confirm) {
    errors.time_to_confirm = "Required";
  }
  if (!values.miles_allowed_per_day) {
    errors.miles_allowed_per_day = "Required";
  }
  if (!values.miles_allowed_per_week) {
    errors.miles_allowed_per_week = "Required";
  }
  if (!values.miles_allowed_per_month) {
    errors.miles_allowed_per_month = "Required";
  }
  if (
    values.offerFreeDelivery &&
    values.car_free_delivery_location.length == 0
  ) {
    errors.car_free_delivery_location = "Required";
  }
  if (
    values.offerFreeDelivery &&
    values.car_free_delivery_location.length &&
    values.offer_free_delivery == ""
  ) {
    errors.offer_free_delivery = "Required";
  }
  return errors;
};

export default reduxForm({
  form: "car-registration-3",
  destroyOnUnmount: false,
  validate
})(AvailabilityForm);
