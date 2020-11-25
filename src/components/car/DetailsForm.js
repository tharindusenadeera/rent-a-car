import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import NumericInput from "react-numeric-input";
import CheckboxGroup from "../../form-components/CheckboxGroup";

class DetailsForm extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.submitSucceeded) {
      this.props.clearSubmit();
      this.props.nextPage();
    }
  }
  renderField = ({ input, type, className, meta: { touched, error } }) => (
    <div>
      <input {...input} className={className} type={type} autoComplete="off" />
      {touched &&
        error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
    </div>
  );

  renderFieldTextarea = ({ input, className, meta: { touched, error } }) => (
    <div>
      <textarea {...input} className={className} autoComplete="off" />
      {touched &&
        error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
    </div>
  );

  renderFieldSelect = ({
    input,
    label,
    options,
    className,
    meta: { touched, error }
  }) => (
    <div className="form-group">
      <label className="control-label col-sm-3">{label}</label>
      <div className="col-sm-9">
        <select {...input} className={className}>
          <option key="" value="">
            Condition
          </option>
          {options.map(option => {
            return (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            );
          })}
        </select>
        {touched &&
          error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
      </div>
    </div>
  );

  renderSelectField = ({
    input,
    className,
    meta: { touched, error },
    children
  }) => {
    return (
      <div>
        <select {...input} className={className}>
          <option value="" />
          {children}
        </select>
        {touched &&
          error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
      </div>
    );
  };

  renderNumberField = ({ input, meta: { touched, error }, children }) => {
    return (
      <div>
        <NumericInput min={0} step={10} precision={2} {...input} />{" "}
        {touched &&
          error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
      </div>
    );
  };

  percentageFormat = num => {
    return num + "%";
  };

  renderPercentageField = ({ input, meta: { touched, error }, children }) => {
    return (
      <div>
        {/* <NumericInput min={0} max={100} step={5} precision={2} {...input} format={this.percentageFormat} /> */}
        <NumericInput min={0} max={99.99} step={5} precision={2} {...input} />
        <br />
        {touched &&
          error && <span style={{ color: "red", fontSize: 10 }}>{error}</span>}
      </div>
    );
  };
  setFeartures(features) {
    return features.map(feature => {
      return {
        label: feature.name,
        value: feature.id
      };
    });
  }

  render() {
    const {
      handleSubmit,
      previousPage,
      features,
      usStates,
      error
    } = this.props;
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <br />
        <h4 className="center">Car registration Details</h4>
        <br />
        <div className="form-group">
          <label className="control-label col-sm-3">License Plate Number</label>
          <div className="col-sm-6">
            <Field
              component={this.renderField}
              type="text"
              name="license_plate_number"
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">State</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Mode"
              name="state"
              className="form-control"
            >
              {usStates.map(state => {
                return (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                );
              })}
            </Field>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-3">Daily Rate $</label>
          <div className="col-sm-3">
            <Field
              component={this.renderNumberField}
              type="text"
              name="daily_rate"
              className="form-control"
            />
          </div>
          <div className="col-sm-3 checkbox" />
        </div>

        <div className="row form-group">
          <div className="col-sm-3">
            <label className="control-label">Weekly/Monthly discount %</label>
          </div>
          <div className="col-sm-9">
            <div className="row">
              <div className="col-sm-4">
                <label> over 3 Days </label>
                <Field
                  component={this.renderPercentageField}
                  type="text"
                  name="discount_daily"
                  className="form-control"
                />
              </div>
              <div className="col-sm-4">
                <label> over Weekly </label>
                <Field
                  component={this.renderPercentageField}
                  type="text"
                  name="discount_weekly"
                  className="form-control"
                />
              </div>
              <div className="col-sm-4">
                <label> over Monthly </label>
                <Field
                  component={this.renderPercentageField}
                  type="text"
                  name="discount_monthly"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="control-label col-sm-3">Car Description</label>
          <div className="col-sm-6">
            <Field
              component={this.renderFieldTextarea}
              type="textarea"
              name="description"
              className="form-control"
            />
            <p>Tell People About Your Car.</p>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Features</label>
          <div className="col-sm-6">
            <CheckboxGroup
              name="features"
              options={this.setFeartures(features)}
            />
          </div>
        </div>
        {error ? (
          <div className="form-group">
            <div className="col-sm-6 col-sm-offset-3">
              <div className="alert alert-danger">
                <strong>Error!</strong> {error}
              </div>
            </div>
          </div>
        ) : null}
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
              type="submit"
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
  if (!values.license_plate_number) {
    errors.license_plate_number = "Required";
  }
  if (!values.state) {
    errors.state = "Required";
  }
  if (!values.daily_rate) {
    errors.daily_rate = "Required";
  }
  if (values.daily_rate && values.daily_rate == 0.0) {
    errors.daily_rate = "Required";
  }
  if (
    (values.discount_daily && values.discount_daily < 0.0) ||
    values.discount_daily > 99.99
  ) {
    errors.discount_daily = "Invalid percentage.!";
  }
  if (
    (values.discount_weekly && values.discount_weekly < 0.0) ||
    values.discount_weekly > 99.99
  ) {
    errors.discount_weekly = "Invalid percentage.!";
  }
  if (
    (values.discount_monthly && values.discount_monthly < 0.0) ||
    values.discount_monthly > 99.99
  ) {
    errors.discount_monthly = "Invalid percentage.!";
  }
  if (!values.description) {
    errors.description = "Required";
  }
  if (values.description != undefined && values.description.length < 25) {
    errors.description = "Description must be minimum 25 characters";
  }
  return errors;
};

export default reduxForm({
  form: "car-registration-4",
  destroyOnUnmount: false,
  validate
})(DetailsForm);
