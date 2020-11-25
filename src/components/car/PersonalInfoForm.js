import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {
  //uploadProfilePic,
  uploadProfilePicV2
} from "../../actions/UserActions";
import MaskedTextInput from "react-text-mask";
import ReactTelephoneInput from "react-telephone-input/lib/withStyles";
import moment from "moment";
import RydeAvatar from "../file-processing/lib/Avatar";

class PersonalInfoForm extends Component {
  constructor(props) {
    super(props);
    const { initialValues } = props;
    this.state = {
      error: false,
      errorMessage: "",
      cropperOpen: false,
      img: null,
      index: 0,
      croppedImg: initialValues.profile_image
        ? initialValues.profile_image
        : "/images/defaultprofile.jpg",
      profile_img_error: {}
    };
    //this.handleCrop = this.handleCrop.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.initialValues.profile_image ||
      nextProps.initialValues.profile_image == "/images/defaultprofile.jpg"
    ) {
      this.setState(
        { error: true, errorMessage: "Please upload your profile photo" },
        () => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    }

    if (nextProps.error) {
      this.setState({ error: true, errorMessage: nextProps.error }, () => {
        setTimeout(() => {
          this.setState({ error: false, errorMessage: "" });
        }, 5000);
      });
      return false;
    }

    if (nextProps.userUpdateError) {
      this.setState(
        { error: true, errorMessage: nextProps.userUpdateError },
        () => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    }

    if (nextProps.submitSucceeded) {
      this.props.nextPage();
    }
  }

  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }

  // handleCrop(dataURI) {
  //   // send the cropped image to the server
  //   const { dispatch } = this.props;
  //   dispatch(uploadProfilePic(dataURI));

  //   this.setState({
  //     cropperOpen: false,
  //     img: null,
  //     croppedImg: dataURI
  //   });
  // }

  handleRequestHide() {
    this.setState({ cropperOpen: false });
  }

  renderField = ({
    input,
    label,
    type,
    className,
    disabled,
    placeholder,
    meta: { touched, error }
  }) => {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          <input
            {...input}
            className={className}
            type={type}
            autoComplete="off"
            placeholder={placeholder}
            disabled={disabled}
          />
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  };

  renderDateField = ({ input, label, disabled, meta: { touched, error } }) => {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          <MaskedTextInput
            mask={[/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
            className="form-control input-sm"
            placeholder="MM-DD-YYYY"
            guide={false}
            disabled={disabled}
            {...input}
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            id="my-input-id"
          />
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  };
  renderSelectField = ({
    input,
    label,
    className,
    disabled,
    meta: { touched, error },
    children
  }) => {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          <select {...input} disabled={disabled} className={className}>
            <option value="" />
            {children}
          </select>
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  };

  renderTelInput = ({ input, meta: { touched, error } }) => {
    return (
      <div className="form-group">
        <label className="control-label col-sm-3">Phone Number</label>
        <div className="col-sm-9">
          <ReactTelephoneInput
            autoFormat={true}
            defaultCountry="us"
            {...input}
            initialValue="+1"
            flagsImagePath="/flags.png"
          />
          {touched && error && (
            <span style={{ color: "red", fontSize: 10 }}>{error}</span>
          )}
        </div>
      </div>
    );
  };

  getUploadedFiles = data => {
    const { dispatch } = this.props;
    dispatch(uploadProfilePicV2(data[0].location));
  };

  onUploadError = err => {
    this.setState({ profile_img_error: err });
  };

  render() {
    const { handleSubmit, previousPage, initialValues, usStates } = this.props;
    const { profile_img_error } = this.state;

    const defaultAvatar = (
      <div className="profile-image-wrapper">
        <div className="avatar-photo">
          <div className="avatar-edit">
            <span>Upload</span>
            <i className="fa fa-camera" />
          </div>
          <img src={this.state.croppedImg} width="100%" />
        </div>
      </div>
    );

    return (
      <div>
        <form onSubmit={handleSubmit} className="form-horizontal">
          <br />
          <h4 className="center">Your Information</h4>
          <br />
          <h5 className="center">
            Please enter your personal infromation here{" "}
          </h5>
          <h6 className="center ash-color-text">Upload your photo</h6>
          <div className="row">
            <div className="col-md-12">
              <div className="profcomp-avatar">
                <RydeAvatar
                  cropper
                  folder={`profile/${initialValues.id}`}
                  onUpload={this.getUploadedFiles}
                  uploadBtn={defaultAvatar}
                  onError={this.onUploadError}
                />
                {profile_img_error.is_error && (
                  <div className="GC_form_error">
                    {profile_img_error.message && profile_img_error.message}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="col-md-2 col-md-offset-5">
              <div className="profile-image-wrapper">
                <div className="avatar-photo">
                  <FileUpload handleFileChange={this.handleFileChange} />
                  <div className="avatar-edit">
                    <span>Upload</span>
                    <i className="fa fa-camera" />
                  </div>
                  <img src={this.state.croppedImg} width="100%" />
                </div>
                {this.state.cropperOpen && (
                  <AvatarCropper
                    onRequestHide={this.handleRequestHide}
                    cropperOpen={this.state.cropperOpen}
                    onCrop={this.handleCrop}
                    image={this.state.img}
                    width={328}
                    height={328}
                  />
                )}
              </div>
            </div> */}
          </div>
          <h6 className="center">Drag an image here or Click to upload</h6>
          <br />
          <Field
            component={this.renderField}
            type="text"
            disabled={this.props.initialValues.first_name ? true : false}
            label="First Name"
            name="first_name"
            className="form-control"
          />
          <Field
            component={this.renderField}
            disabled={this.props.initialValues.last_name ? true : false}
            type="text"
            label="Last Name"
            name="last_name"
            className="form-control"
          />
          <Field
            component={this.renderDateField}
            disabled={this.props.initialValues.date_of_birth ? true : false}
            type="text"
            placeholder="MM-DD-YYYY"
            label="Date of Birth"
            name="date_of_birth"
            className="form-control"
          />
          <Field
            component={this.renderSelectField}
            disabled={
              this.props.initialValues.license_issued_state ? true : false
            }
            propmt="Select State"
            name="license_issued_state"
            label="License issued state"
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

          <Field
            component={this.renderField}
            disabled={
              this.props.initialValues.driving_license_number ? true : false
            }
            type="text"
            label="Driver License Number"
            name="driving_license_number"
            className="form-control"
          />

          <Field
            component={this.renderDateField}
            disabled={
              this.props.initialValues.driving_license_expiration ? true : false
            }
            type="text"
            placeholder="MM-DD-YYYY"
            label="Driving License Expiration"
            name="driving_license_expiration"
            className="form-control"
          />

          <Field
            name="phone_number"
            className="form-control"
            component={this.renderTelInput}
            type="text"
          />

          {!initialValues.profile_image && !this.state.error && (
            <div className="form-group">
              <div className="col-sm-6 col-sm-offset-3">
                <div className="alert alert-danger">
                  Please upload your profile photo
                </div>
              </div>
            </div>
          )}

          {this.state.error && (
            <div className="form-group">
              <div className="col-sm-6 col-sm-offset-3">
                <div className="alert alert-danger">
                  {this.state.errorMessage}
                </div>
              </div>
            </div>
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
                type="submit"
                className="btn btn-success pull-left form-btn"
                disabled={!initialValues.profile_image ? true : false}
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function isValidDate(dateString) {
  var regEx = /^\d{2}-\d{2}-\d{4}$/;
  var valid = dateString.match(regEx) != null;
  if (valid) {
    var elements = dateString.split("-");
    if (
      parseInt(elements[0]) <= 12 &&
      parseInt(elements[1]) <= 31 &&
      parseInt(elements[2]) <= 3000
    ) {
      return true;
    }
  }
}
const validate = values => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = "Required";
  }
  if (!values.last_name) {
    errors.last_name = "Required";
  }
  if (!values.date_of_birth) {
    errors.date_of_birth = "Required";
  }
  if (values.date_of_birth) {
    if (!isValidDate(values.date_of_birth)) {
      errors.date_of_birth = "Invalid Date Format";
    }
  }
  if (!values.license_issued_state) {
    errors.license_issued_state = "Required";
  }
  if (!values.driving_license_number) {
    errors.driving_license_number = "Required";
  }
  if (!values.phone_number) {
    errors.phone_number = "Required";
  }
  if (values.phone_number && values.phone_number.length < 8) {
    errors.phone_number = "Invalid Phone Number";
  }
  if (values.driving_license_expiration) {
    if (!isValidDate(values.driving_license_expiration)) {
      errors.driving_license_expiration = "Invalid Date Format";
    }
  }

  if (values.date_of_birth && isValidDate(values.date_of_birth)) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    let dob = moment(values.date_of_birth, "MM-DD-YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    if (moment(now).isBefore(dob)) {
      errors.date_of_birth = "Invalid Date";
    }
  }

  if (
    values.driving_license_expiration &&
    isValidDate(values.driving_license_expiration)
  ) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    let drivingLicenseExpiration = moment(
      values.driving_license_expiration,
      "MM-DD-YYYY"
    ).format("YYYY-MM-DD HH:mm:ss");

    if (moment(now).isAfter(drivingLicenseExpiration)) {
      errors.driving_license_expiration = "Invalid Date";
    }
  }

  return errors;
};

PersonalInfoForm = reduxForm({
  form: "car-registration-2",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(PersonalInfoForm);

const selector = formValueSelector("car-registration-2");
PersonalInfoForm = connect(state => {
  const profileImage = selector(state, "profileImage");
  return {
    profileImage
  };
})(PersonalInfoForm);

export default PersonalInfoForm;
