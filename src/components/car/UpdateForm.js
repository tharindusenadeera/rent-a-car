import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import _ from "lodash";
import { carProtectionModal } from "../../consts/modalStyles";
import PlacesAutocomplete, {
  geocodeByAddress
} from "react-places-autocomplete";
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  arrayRemove,
  arrayPush
} from "redux-form";
import {
  confirmTimeArray,
  carRentShortest,
  carRentLongest,
  milesPerDay,
  milesPerWeek,
  milesPerMonth,
  offerFreeDeliveryOptions,
  offerFreeDeliveryToAirport
} from "../../consts/consts";
import Dropzone from "react-dropzone";
import CheckboxGroup from "../../form-components/CheckboxGroup";
import CarProtectionLevels from "./CarProtectionLevels";
import {
  carPhotoUpload,
  carPhotoDelete,
  markAsMainImage
} from "../../actions/CarActions";
import { carUpdatePhoto } from "../../consts/modalStyles";
import { Upload } from "../file-processing/";

const uploadImage = (file, files, field, filesToUpload) => {
  field.dispatchAction(arrayPush("car-update", "carPhotos", file));
  // save to back end
  const data = {
    car_id: field.carId,
    car_photo: file,
    photo_key: file.lastModified
  };
  field.dispatchAction(carPhotoUpload(data));
};

class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: props.initialValues.year,
      make: props.initialValues.car_make,
      carModel: props.initialValues.car_model,
      offerFreeDelivery: false,
      trim: props.initialValues.trim,
      carPopUp: false,
      carPhoto: "",
      mainImageId: null
    };
    this.getLatLong = this.getLatLong.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.markMainImage = this.markMainImage.bind(this);
  }
  componentWillMount() {
    if (this.props.initialValues) {
      this.props.initialValues.car_photo.forEach(photo => {
        if (photo["status"] == 1) {
          this.setState({
            mainImageId: photo["id"]
          });
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initialValues } = nextProps;
    if (
      initialValues &&
      nextProps.initialValues.car_free_delivery_location.length &&
      nextProps.initialValues.offer_free_delivery
    ) {
      this.setState({ offerFreeDelivery: true });
    }
  }

  getLatLong(e) {
    const { dispatch } = this.props;
    if (e) {
      geocodeByAddress(e, (err, { lat, lng }, results) => {
        dispatch(change("car-update", "location", e));
        dispatch(change("car-update", "latitude", lat));
        dispatch(change("car-update", "longitude", lng));

        const zipCode =
          results[0].address_components[
            results[0].address_components.length - 1
          ].long_name;
        dispatch(change("car-update", "car_zip_code", zipCode));
      });
    } else {
      dispatch(change("car-update", "location", e));
    }
  }

  offerFreeDelivery() {
    if (this.state.offerFreeDelivery) {
      this.props.dispatch(
        change("car-update", "car_free_delivery_location", [])
      );
      this.props.dispatch(change("car-update", "offer_free_delivery", ""));
    }
    this.setState({ offerFreeDelivery: !this.state.offerFreeDelivery });
  }

  renderFieldSelect = ({
    input,
    label,
    options,
    placeholder,
    className,
    meta: { touched, error }
  }) => (
    <div className="form-group">
      {label != "empty" ? <label>{label}</label> : ""}
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
  removeImage(index, id) {
    const { dispatch, car } = this.props;
    dispatch(arrayRemove("car-update", "carPhotos", index));
    dispatch(carPhotoDelete(id, car.id));
  }
  placesField({ input, type, getLatLong, meta: { touched, error } }) {
    return (
      <div>
        <PlacesAutocomplete
          {...input}
          type={type}
          placeholder=""
          onSelect={getLatLong}
        />
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    );
  }
  renderField({ input, type, className, meta: { touched, error } }) {
    return (
      <div>
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
  renderTextarea({ input, className, meta: { touched, error } }) {
    return (
      <div>
        <textarea
          {...input}
          className={className}
          autoComplete="off"
          rows="6"
        />
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    );
  }
  renderDropzoneInput(field) {
    const files = field.input.value;
    return (
      <div className="car-upload-thumb">
        <Dropzone
          id="myDropzone"
          className="dropzone"
          name={field.name}
          onDrop={(filesToUpload, e) => {
            filesToUpload.forEach(file => {
              return uploadImage(file, files, field);
            });
          }}
        />
      </div>
    );
  }
  carRentShortest() {
    return carRentShortest.map(shotesTime => {
      return (
        <option key={shotesTime.value} value={shotesTime.value}>
          {shotesTime.value}
        </option>
      );
    });
  }
  carRentLongest() {
    return carRentLongest.map(longestTime => {
      return (
        <option key={longestTime.value} value={longestTime.value}>
          {longestTime.value}
        </option>
      );
    });
  }
  confirmTime() {
    return confirmTimeArray.map(confirmTime => {
      return (
        <option key={confirmTime.value} value={confirmTime.value}>
          {confirmTime.value}
        </option>
      );
    });
  }
  milesPerDay() {
    return milesPerDay.map(i => {
      return (
        <option key={i.value} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  milesPerWeek() {
    return milesPerWeek.map(i => {
      return (
        <option key={i.value} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  milesPerMonth() {
    return milesPerMonth.map(i => {
      return (
        <option key={i.value} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  offerFreeDeliveryOptions() {
    return offerFreeDeliveryOptions.map(i => {
      return (
        <option key={i.key} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  offerFreeDeliveryToAirport() {
    return offerFreeDeliveryToAirport.map(i => {
      return (
        <option key={i.key} value={i.value}>
          {i.value}
        </option>
      );
    });
  }

  usStatesList(usStates) {
    return usStates.map(state => {
      return (
        <option key={state.code} value={state.code}>
          {state.name}
        </option>
      );
    });
  }

  setFeartures(features) {
    return features.map(feature => {
      return {
        label: feature.name,
        value: feature.id
      };
    });
  }

  getFreeDeliverys(locations) {
    return locations.map(location => {
      return {
        label: location.name,
        value: location.id
      };
    });
  }

  handleCloseModal() {
    this.setState({ carPopUp: false });
  }

  odometerValues() {
    const { car } = this.props;
    if (car.odometer) {
      if (car.odometer == "0 - 20000") {
        return "0 - 20K";
      } else if (car.odometer == "20001 - 40000") {
        return "20K - 40K";
      } else if (car.odometer == "40001 - 60000") {
        return "40K - 60K";
      } else if (car.odometer == "60001 - 80000") {
        return "60K - 80K";
      } else if (car.odometer == "80001 - 100000") {
        return "80K - 100K";
      } else if (car.odometer == "100001 - 120000") {
        return "100K - 120K";
      } else if (car.odometer == "over 1200001") {
        return "Over 1200K";
      }
    }
  }

  markMainImage(id) {
    const { dispatch } = this.props;
    dispatch(
      markAsMainImage({
        id: id,
        status: 1
      })
    );
    this.setState({ mainImageId: id });
  }

  render() {
    const {
      initialValues,
      error,
      delivery_options,
      showCarProtectionModal,
      car,
      showCarProtection,
      handleCloseModal,
      carProtectionLevels,
      changeProtectionLevel,
      free_delivery_loations,
      features,
      handleSubmit
    } = this.props;

    // console.log("car.car_photo", car.car_photo);

    return (
      <div className="row">
        <div className="col-sm-12 car-form car-update">
          <div className="car-update-header">
            <h2>
              Your {car.year} {car.car_make.name} {car.car_model.name}{" "}
            </h2>
          </div>
          <div className="car-update-form-wrapper">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <div className="form-header" />
              <div className="form-group-set">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label>Location</label>
                      <Field
                        component={this.placesField}
                        type="text"
                        label="Location"
                        className="form-control"
                        name="location"
                        getLatLong={this.getLatLong}
                      />
                      <Field
                        component="input"
                        type="hidden"
                        name="latitude"
                        className="form-control1"
                      />
                      <Field
                        component="input"
                        type="hidden"
                        name="longitude"
                        className="form-control1"
                      />
                      <Field
                        component="input"
                        type="hidden"
                        name="car_zip_code"
                        className="form-control1"
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Year</label>
                      <p>{car.year}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Make</label>
                      <p>{car.car_make.name}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Model</label>
                      <p>{car.car_model.name}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Trim</label>
                      <p>{car.trim && car.trim.name}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Type</label>
                      <p>{car.car_type}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Odometer</label>
                      <p>{this.odometerValues()}</p>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <label>Transmission</label>
                      <p>{car.transmission ? "Automatic" : "Manual"}</p>
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
                          <Field
                            component={this.renderSelectField}
                            label="empty"
                            placeholder="Shortest"
                            name="rent_car_shortest"
                            className="form-control"
                          >
                            {this.carRentShortest()}
                          </Field>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Maximum</label>
                          <Field
                            component={this.renderSelectField}
                            label="empty"
                            placeholder="Longest"
                            name="rent_car_longest"
                            className="form-control"
                          >
                            {this.carRentLongest()}
                          </Field>
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
                          <Field
                            component={this.renderSelectField}
                            type="select"
                            label="empty"
                            placeholder="Day"
                            name="miles_allowed_per_day"
                            className="form-control"
                          >
                            {this.milesPerDay()}
                          </Field>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Week</label>
                          <Field
                            component={this.renderSelectField}
                            type="select"
                            label="empty"
                            placeholder="Week"
                            name="miles_allowed_per_week"
                            className="form-control"
                          >
                            {this.milesPerWeek()}
                          </Field>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <label>Month</label>
                          <Field
                            component={this.renderSelectField}
                            type="select"
                            label="empty"
                            placeholder="Month"
                            name="miles_allowed_per_month"
                            className="form-control"
                          >
                            {this.milesPerMonth()}
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <label className="control-label">
                      Advance Notice Time to Confirm
                    </label>
                  </div>
                  <div className="col-sm-2">
                    <Field
                      component={this.renderSelectField}
                      type="select"
                      label="empty"
                      placeholder="Select notice time to confirm"
                      name="time_to_confirm"
                      className="form-control"
                    >
                      {this.confirmTime()}
                    </Field>
                  </div>
                </div>
                <div className="row row-sep">
                  <div className="form-group">
                    <label className="control-label col-sm-3 offer-del">
                      Offer Delivery
                    </label>
                    {/*<div className="col-sm-6">
                                            <div className="text-left control-label"> <label > Car is  available for</label></div>
                                        </div>*/}
                    <div className="col-sm-9">
                      {_.map(delivery_options, (option, key) => {
                        return (
                          <div className="form-group" key={"1" + key}>
                            <div className="" key={"2" + key}>
                              <div className="row" key={"3" + key}>
                                <div className="col-sm-1" key={"4" + key}>
                                  <Field
                                    component="input"
                                    type="radio"
                                    id={"delivery_option-" + key}
                                    key={key}
                                    name="delivery_option"
                                    value={key}
                                  />
                                </div>
                                <div className="col-sm-10" key={"5" + key}>
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
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* <div className='form-group'>
                                        <label className="control-label col-sm-3">Offer Free Delivery</label>
                                        <div className="col-xs-6">
                                            <Field component="input" type="checkbox" id='offerFreeDelivery'
                                            name="offerFreeDelivery"
                                            checked={this.state.offerFreeDelivery}
                                            onChange={ this.offerFreeDelivery }  />
                                        </div>
                                    </div> */}
                <div className="row">
                  <div className="col-sm-3">
                    <label className="control-label">
                      Offer Free Delivery To
                    </label>
                  </div>
                  <div className="col-sm-9">
                    <CheckboxGroup
                      name="car_free_delivery_location"
                      options={this.getFreeDeliverys(free_delivery_loations)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3">
                    <label className="control-label">Offer Free Delivery</label>
                  </div>
                  <div className="col-sm-4">
                    <Field
                      component={this.renderFieldSelect}
                      type="select"
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
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>License plate number</label>
                    <p>{initialValues.license_plate_number} </p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>State</label>
                    <p>{initialValues.state} </p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label>Daily Rate</label>
                    <Field
                      component={this.renderField}
                      type="text"
                      name="daily_rate"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label className="control-label">
                    Weekly/Monthly discount
                  </label>
                  {/* <div className="row">
                          <div className="col-sm-6">
                              <div className="form-group">
                                  <Field  component={this.renderField} type="text"  name="discount"  className="form-control"/>
                              </div>
                          </div>
                          <div className="col-sm-6">
                              <div className="form-group">
                                  <Field  component={this.renderSelectField} type="text"  name="discount_days"   className="form-control">
                                      {this.discountConditions()}
                                  </Field>
                              </div>
                          </div>
                      </div> */}
                </div>

                <div className="col-sm-3">
                  <div className="form-group">
                    <label> 3 Days </label>
                    <Field
                      component={this.renderField}
                      type="text"
                      name="discount_daily"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-sm-3">
                  <div className="form-group">
                    <label> Weekly </label>
                    <Field
                      component={this.renderField}
                      type="text"
                      name="discount_weekly"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-sm-3">
                  <div className="form-group">
                    <label> Monthly </label>
                    <Field
                      component={this.renderField}
                      type="text"
                      name="discount_monthly"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Features</label>
                    <CheckboxGroup
                      name="features"
                      options={this.setFeartures(features)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label>Car protection level</label>
                    <p>{initialValues.currentProtectionLevel.title}</p>
                    <a onClick={showCarProtection}>Change</a>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Car Description</label>
                    <Field
                      component={this.renderTextarea}
                      type="textarea"
                      name="description"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Pick up instructions</label>
                    <Field
                      component={this.renderTextarea}
                      type="textarea"
                      name="pickup_instructions"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="form-header">Car Photos</div>
              {/*new car photo upload*/}
              <Upload initialValues={car.car_photo} />
            </form>
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
                  initialValues.currentProtectionLevel.value
                }
                carId={car.id}
              />
            </Modal>
            <Modal
              isOpen={this.state.carPopUp}
              onRequestClose={this.handleCloseModal}
              contentLabel="carModal"
              shouldCloseOnOverlayClick={true}
              style={carUpdatePhoto}
            >
              <img className="popUpCarImage" src={this.state.carPhoto} />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  if (!values.location) {
    errors.location = "Required";
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
  if (!values.shortest) {
    errors.shortest = "Required";
  }
  if (!values.longest) {
    errors.longest = "Required";
  }
  if (!values.confirmTime) {
    errors.confirmTime = "Required";
  }
  if (!values.milesPerDay) {
    errors.milesPerDay = "Required";
  }
  if (!values.milesPerWeek) {
    errors.milesPerWeek = "Required";
  }
  if (!values.milesPerMonth) {
    errors.milesPerMonth = "Required";
  }
  if (!values.licensePlateNumber) {
    errors.licensePlateNumber = "Required";
  }
  if (!values.state) {
    errors.state = "Required";
  }
  if (!values.dailyRate) {
    errors.dailyRate = "Required";
  }
  if (values.description != undefined && values.description.length < 25) {
    errors.carDescription = "Description must be minimum 25 characters";
  }
  if (
    (values.discount_daily && values.discount_daily < 1) ||
    values.discount_daily > 99.99
  ) {
    errors.discount_daily = "Invalid percentage.!";
  }
  if (
    (values.discount_weekly && values.discount_weekly < 1) ||
    values.discount_weekly > 99.99
  ) {
    errors.discount_weekly = "Invalid percentage.!";
  }
  if (
    (values.discount_monthly && values.discount_monthly < 1) ||
    values.discount_monthly > 99.99
  ) {
    errors.discount_monthly = "Invalid percentage.!";
  }
  return errors;
};

UpdateForm = reduxForm({
  form: "car-update",
  validate,
  forceUnregisterOnUnmount: true
})(UpdateForm);

const selector = formValueSelector("car-update");
UpdateForm = connect(state => {
  const carPhotos = selector(state, "carPhotos");
  return {
    carPhotos: carPhotos ? carPhotos : [],
    carPhotoUpload: state.car.carPhotoUpload
  };
})(UpdateForm);

export default UpdateForm;
