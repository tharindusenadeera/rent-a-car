import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import { Field, reduxForm, change } from "redux-form";
import { getMakes, getModels, getTrims } from "../../actions/CarActions";
import { carTypes } from "../../consts/consts";

class EligibilityForm extends Component {
  constructor() {
    super();
    this.state = {
      year: "",
      make: "",
      carModel: "",
      trim: "",
      error: false,
      errorMessage: ""
    };
    this.getLatLong = this.getLatLong.bind(this);
    this.modelSelected = this.modelSelected.bind(this);
    this.makeSelected = this.makeSelected.bind(this);
    this.yearSelected = this.yearSelected.bind(this);
    this.modelList = this.modelList.bind(this);
    this.trimList = this.trimList.bind(this);
    this.carTypeList = this.carTypeList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.submitSucceeded) {
      this.props.nextPage();
    } else if (nextProps.error) {
      this.setState({ error: true, errorMessage: nextProps.error }, state => {
        setTimeout(() => {
          this.setState({ error: false, errorMessage: "" });
        }, 5000);
      });
    }
  }

  getLatLong(e) {
    const { dispatch } = this.props;
    if (e) {
      geocodeByAddress(e)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
          dispatch(change("car-registration-1", "location", e));
          dispatch(change("car-registration-1", "latitude", latLng.lat));
          dispatch(change("car-registration-1", "longitude", latLng.lng));
        });

      // geocodeByAddress(e, (err, { lat, lng }, results) => {
      //   console.log("results", results);

      //   dispatch(change("car-registration-1", "location", e));
      //   dispatch(change("car-registration-1", "latitude", lat));
      //   dispatch(change("car-registration-1", "longitude", lng));
      //   let zipObj = null,
      //     stateObj = null;
      //   results[0].address_components.map(obj => {
      //     if (obj.types[0] === "postal_code") {
      //       zipObj = obj;
      //     } else if (obj.types[0] === "administrative_area_level_1") {
      //       stateObj = obj;
      //     }
      //   });
      //   const zipCode = zipObj.short_name ? zipObj.short_name : null;
      //   const state = stateObj.short_name ? stateObj.short_name : null;
      //   dispatch(change("car-registration", "car_zip_code", zipCode));

      //   if (!zipCode || !state) {
      //     this.setState({
      //       error: true,
      //       errorMessage: "Please provide a complete address"
      //     });
      //     // setTimeout(() => { this.setState({ error: false, errorMessage: ''}) }, 5000);
      //   } else {
      //     this.setState({ error: false, errorMessage: "" });
      //   }
      // });
    } else {
      dispatch(change("car-registration", "location", e));
    }
  }

  placesField({
    input,
    label,
    type,
    className,
    getLatLong,
    meta: { touched, error }
  }) {
    const options = {
      location: new window.google.maps.LatLng(34.0522, -118.243),
      radius: 2000,
      route: "Los Angeles County",
      componentRestrictions: {
        country: "us"
      },
      types: ["address"]
    };
    // console.log("input", input);

    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-6">
          {/* <PlacesAutocomplete
            {...input}
            type={type}
            placeholder=""
            onSelect={getLatLong}
            options={options}
          /> */}

          <PlacesAutocomplete
            onSelect={getLatLong}
            {...input}
            searchOptions={options}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div>
                <input
                  // {...input}
                  {...getInputProps({
                    placeholder: "",
                    className: "locationInput"
                  })}
                />
                <div className="row expanded-location">
                  {loading && <div>Loading...</div>}
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

          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  }

  renderField({ input, label, type, className, meta: { touched, error } }) {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-6">
          <input
            {...input}
            className={className}
            type={type}
            autoComplete="off"
          />
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  }

  renderTextarea({ input, label, className, meta: { touched, error } }) {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-6">
          <textarea {...input} className={className} autoComplete="off" />
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  }

  renderSelectField({ input, className, meta: { touched, error }, children }) {
    return (
      <div>
        <select {...input} className={className}>
          <option value="" />
          {children}
        </select>
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    );
  }

  renderRadioListField({ input, type, label, meta: { touched, error } }) {
    return (
      <div>
        <input {...input} type={type} />
        {label}
        <br />
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    );
  }

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

  yearSelected(e) {
    const { dispatch } = this.props;
    this.setState({ year: e.target.value });
    dispatch(getMakes(e.target.value));
  }

  makeSelected(e) {
    const { dispatch } = this.props;
    this.setState({ make: e.target.value });
    let year = this.state.year;
    if (!year) {
      year = this.props.initialValues.year;
    }
    dispatch(getModels(year, e.target.value));
  }

  modelSelected(e) {
    const { dispatch } = this.props;
    this.setState({ carModel: e.target.value });
    let year = this.state.year;
    if (!year) {
      year = this.props.initialValues.year;
    }
    dispatch(getTrims(year, this.state.make, e.target.value));
  }

  yearList() {
    return this.props.years.map(year => {
      return (
        <option key={year.year} value={year.year}>
          {year.year}
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
  carTypeList() {
    return carTypes.map(type => {
      return (
        <option key={type.key} value={type.value}>
          {type.value}
        </option>
      );
    });
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit} className="form-horizontal">
        <br />
        <h4 className="center">Tell us about your Car</h4>
        <br />
        <Field
          component={this.placesField}
          type="text"
          label="Location"
          className="form-control"
          name="location"
          getLatLong={this.getLatLong}
        />
        <Field component="input" type="hidden" name="latitude" />
        <Field component="input" type="hidden" name="longitude" />
        <Field component="input" type="hidden" name="car_zip_code" />
        <div className="form-group">
          <label className="control-label col-sm-3">Year</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Year"
              onChange={this.yearSelected}
              name="year"
              className="form-control"
            >
              {this.yearList()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Make</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Make"
              onChange={this.makeSelected}
              name="car_make"
              className="form-control"
            >
              {this.makeList()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Model</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Mode"
              onChange={this.modelSelected}
              name="car_model"
              className="form-control"
            >
              {this.modelList()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Trim</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Trim"
              name="trim"
              className="form-control"
            >
              {this.trimList()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Type</label>
          <div className="col-sm-6">
            <Field
              component={this.renderSelectField}
              propmt="Select Car Type"
              name="car_type"
              className="form-control"
            >
              {this.carTypeList()}
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Odometer</label>
          <div className="col-sm-6">
            <Field
              name="odometer"
              component={this.renderSelectField}
              propmt=""
              className="form-control"
            >
              <option value="0 - 20000">0 - 20K</option>
              <option value="20001 - 40000">20K - 40K</option>
              <option value="40001 - 60000">40K - 60K</option>
              <option value="60001 - 80000">60K - 80K</option>
              <option value="80001 - 100000">80K - 100K</option>
              <option value="100001 - 120000">100K - 120K</option>
              <option value="over 120001">over 120K </option>
            </Field>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-3">Transmission</label>
          <div className="col-sm-6">
            <label className="radio-inline">
              <Field
                component={this.renderRadioListField}
                type="radio"
                name="transmission"
                label="Automatic"
                value="1"
              />
            </label>
            <label className="radio-inline">
              <Field
                component={this.renderRadioListField}
                type="radio"
                name="transmission"
                label="Manual"
                value="0"
              />
            </label>
          </div>
        </div>
        {this.state.error ? (
          <div className="form-group">
            <div className="col-sm-6 col-sm-offset-3">
              <div className="alert alert-danger">
                <strong>Error!</strong> {this.state.errorMessage}
              </div>
            </div>
          </div>
        ) : null}
        <div className="center">
          <button
            type="submit"
            className="next form-btn btn btn-success"
            disabled={this.state.error}
          >
            Next
          </button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.location) {
    errors.location = "Required";
  }
  if (!values.latitude) {
    errors.location = "Select a valid address .!";
  }
  if (!values.longitude) {
    errors.location = "Select a valid address .!";
  }
  if (!values.year) {
    errors.year = "Required";
  }
  if (!values.car_make) {
    errors.car_make = "Required";
  }
  if (!values.car_model) {
    errors.car_model = "Required";
  }
  if (!values.trim) {
    errors.trim = "Required";
  }
  if (!values.odometer) {
    errors.odometer = "Required";
  }
  if (!values.transmission) {
    errors.transmission = "Required";
  }
  if (!values.stateOfTheCar) {
    errors.stateOfTheCar = "Required";
  }
  if (!values.car_type) {
    errors.car_type = "Required";
  }
  return errors;
};

export default reduxForm({
  form: "car-registration-1",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(EligibilityForm);
