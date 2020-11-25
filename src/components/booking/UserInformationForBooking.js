import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import checkAuth from "../requireAuth";
import axios from "axios";
import { VERIFY_PHONE_NUMBER } from "../../actions/ActionTypes";
import {
  resendPhoneVerificationCode,
  getLoggedInUser
} from "../../actions/UserActions";
import moment from "moment";
import { uploadProfilePicV2 } from "../../actions/UserActions";
import PhoneVerification from "../../components/verifications/PhoneVerification";
import TextInput from "../../form-components/TextInput";
import SelectInput from "../../form-components/SelectInput";
import TelInput from "../../form-components/TelInput";
import DateTextInput from "../../form-components/DateTextInput";
import RydeAvatar from "../file-processing/lib/Avatar";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { authFail } from "../../actions/AuthAction";

class UserInformationForBooking extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      streetAddress: "",
      state: "",
      city: "",
      zipCode: "",
      drivingLicenseNumber: "",
      drivingLicenseExpiration: "",
      licenseIssuedState: "",
      licenseIssuedCountry: "",
      error: false,
      message: "",
      success: false,
      profile_image: "",
      validating: false,
      profile_img_error: {},
      isCropped: false,
      submitting: false,
      rendering: ""
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.setUserData(user);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user && !this.state.isCropped) {
      this.setUserData(nextProps.user);
    }
    if (
      nextProps.newPhoneVerificationCode &&
      nextProps.newPhoneVerificationCode.error
    ) {
      this.setState(
        { error: true, message: nextProps.newPhoneVerificationCode.message },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  }

  setUserData = user => {
    this.setState({
      firstName: user.first_name ? user.first_name : "",
      lastName: user.last_name ? user.last_name : "",
      email: user.email ? user.email : "",
      phoneNumber: user.phone_number,
      dateOfBirth: moment(user.date_of_birth, "YYYY-MM-DD").isValid()
        ? moment(user.date_of_birth, "YYYY-MM-DD").format("MM-DD-YYYY")
        : "",
      streetAddress: user.street_address ? user.street_address : "",
      state: user.state ? user.state : "",
      city: user.city ? user.city : "",
      zipCode: user.zip_code ? user.zip_code : "",
      profile_image: user.profile_image_thumb
        ? user.profile_image_thumb
        : "/images/defaultprofile.jpg",
      drivingLicenseNumber: user.driving_license_number
        ? user.driving_license_number
        : "",
      drivingLicenseExpiration: moment(
        user.driving_license_expiration,
        "YYYY-MM-DD"
      ).isValid()
        ? moment(user.driving_license_expiration, "YYYY-MM-DD").format(
            "MM-DD-YYYY"
          )
        : "",
      licenseIssuedState: user.license_issued_state
        ? user.license_issued_state
        : "",
      licenseIssuedCountry: user.license_issued_country
        ? user.license_issued_country
        : "",
      cropperOpen: false
    });
  };

  updateUserProfile = async () => {
    try {
      if (!this.beforeSubmit()) {
        return false;
      }

      this.setState({ submitting: true });

      let dle = null;
      let dob = null;

      if (
        moment(this.state.dateOfBirth, "MM-DD-YYYY").format("MM-DD-YYYY") ==
        this.state.dateOfBirth
      ) {
        dob = moment(this.state.dateOfBirth, "MM-DD-YYYY").format("YYYY-MM-DD");
      } else if (
        moment(this.state.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD") ==
        this.state.dateOfBirth
      ) {
        dob = moment(this.state.dateOfBirth, "YYYY-MM-DD").format("YYYY-MM-DD");
      }

      if (
        moment(this.state.drivingLicenseExpiration, "MM-DD-YYYY").format(
          "MM-DD-YYYY"
        ) == this.state.drivingLicenseExpiration
      ) {
        dle = moment(this.state.drivingLicenseExpiration, "MM-DD-YYYY").format(
          "YYYY-MM-DD"
        );
      } else if (
        moment(this.state.drivingLicenseExpiration, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        ) == this.state.drivingLicenseExpiration
      ) {
        dle = moment(this.state.drivingLicenseExpiration, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
      }

      let dateOfBirth = dob;
      let drivingLicenseExpiration = dle;

      let user = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        phone_number: this.state.phoneNumber,
        date_of_birth: dateOfBirth,
        street_address: this.state.streetAddress,
        state: this.state.state,
        city: this.state.city,
        zip_code: this.state.zipCode,
        driving_license_number: this.state.drivingLicenseNumber,
        driving_license_expiration: drivingLicenseExpiration,
        license_issued_state: this.state.licenseIssuedState,
        license_issued_country: this.state.licenseIssuedCountry
      };

      const response = await await axios.patch(
        process.env.REACT_APP_API_URL + "users/" + this.props.user.id,
        user,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        if (response.data.response.verified_phone == 0) {
          let data = {
            email: this.state.email,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            phone_number: this.state.phoneNumber,
            type: "PROFILE"
          };
          this.props.dispatch(
            resendPhoneVerificationCode(data, this.state.phoneNumber)
          );
          this.props.dispatch({ type: VERIFY_PHONE_NUMBER, payload: data });
        } else {
          this.setState(
            {
              success: true,
              error: false,
              message: response.data.message,
              submitting: false
            },
            state => {
              // this.props.dispatch({
              //     type: GET_LOGGED_IN_USER,
              //     payload: response.data.response
              // })
              this.props.dispatch(getLoggedInUser(false));
            }
          );
        }
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      if (error.response.data) {
        this.setState(
          {
            error: true,
            submitting: false,
            message: error.response.data.message
          },
          state => {
            setTimeout(() => {
              this.setState({
                error: false,
                errorMessage: ""
              });
            }, 5000);
          }
        );
      }
      return false;
    }
  };

  isValidDate = dateString => {
    var date = moment(dateString, "MM-DD-YYYY").format("MM-DD-YYYY");
    var regEx = /^\d{2}-\d{2}-\d{4}$/;
    var valid = date.match(regEx) != null;
    if (valid) {
      var elements = date.split("-");
      if (
        parseInt(elements[0]) <= 12 &&
        parseInt(elements[1]) <= 31 &&
        parseInt(elements[2]) <= 3000
      ) {
        return true;
      }
    }
  };

  isPastDate = dateString => {
    var now = moment().format("YYYY-MM-DD");
    var date = moment(dateString, "MM-DD-YYYY").format("YYYY-MM-DD");

    if (moment(date).isAfter(now)) {
      return true;
    }
  };

  isDateBefore(dateString) {
    var now = moment().format("YYYY-MM-DD");
    var date = moment(dateString, "MM-DD-YYYY").format("YYYY-MM-DD");
    if (moment(now).isAfter(date)) {
      return true;
    }
  }

  _validate = () => {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      streetAddress,
      city,
      zipCode,
      state,
      drivingLicenseNumber,
      drivingLicenseExpiration,
      licenseIssuedCountry,
      licenseIssuedState,
      validating,
      profile_image,
      phoneNumber
    } = this.state;

    const errors = {};
    if (!firstName) {
      errors.firstName = "First name required";
    }
    if (!lastName) {
      errors.lastName = "Last name required";
    }
    if (!email) {
      errors.lastName = "Email required";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number required";
    }

    if (phoneNumber && phoneNumber.length !== 12) {
      errors.phoneNumber = "Invalid phone number";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of birth required";
    } else if (!moment(dateOfBirth, "MM-DD-YYYY").isValid() && validating) {
      errors.dateOfBirth = "Invalid date format";
    }

    if (!drivingLicenseExpiration) {
      errors.drivingLicenseExpiration = "Driving license expiration required";
    } else if (
      !moment(drivingLicenseExpiration, "MM-DD-YYYY").isValid() &&
      validating
    ) {
      errors.drivingLicenseExpiration = "Invalid date format";
    }

    if (!streetAddress) {
      errors.streetAddress = "Street address required";
    }
    if (!city) {
      errors.city = "City required";
    }
    if (!zipCode) {
      errors.zipCode = "Zip code required";
    }
    if (!state) {
      errors.state = "State is required";
    }
    if (!licenseIssuedState) {
      errors.licenseIssuedState = "License issued state is required";
    }
    if (!drivingLicenseNumber) {
      errors.drivingLicenseNumber = "Driving license number required";
    }
    if (!licenseIssuedCountry) {
      errors.licenseIssuedCountry = "License issued country required";
    }

    if (!profile_image) {
      errors.profileImage = "Profile image is required";
    }

    return errors;
  };

  _makeUsStateArray = () => {
    const { usStates } = this.props;
    if (usStates) {
      return usStates.map(i => {
        return {
          key: i.code,
          value: i.name
        };
      });
    }
  };
  beforeSubmit = () => {
    this.setState({ validating: true });
    let validator = this._validate();
    if (JSON.stringify(validator) !== "{}") {
      return false;
    }
    if (!this.state.phoneNumber) {
      this.setState(
        { error: true, message: "Phone Number required", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (!this.props.user.date_of_birth && !this.state.dateOfBirth) {
      this.setState(
        { error: true, message: "Date Of Birth required", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (
      !this.props.user.date_of_birth &&
      !this.isValidDate(this.state.dateOfBirth)
    ) {
      this.setState(
        { error: true, message: "Invalid Date of Birth", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (
      !this.props.user.date_of_birth &&
      this.isPastDate(this.state.dateOfBirth)
    ) {
      this.setState(
        { error: true, message: "Invalid Date of Birth", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (!this.state.state) {
      this.setState(
        { error: true, message: "State required", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (this.state.profile_image == "/images/defaultprofile.jpg") {
      this.setState(
        { error: true, message: "Profile Image required", validating: false },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (
      !this.props.user.driving_license_expiration &&
      !this.state.drivingLicenseExpiration
    ) {
      this.setState(
        {
          error: true,
          message: "Driving License Expiration required",
          validating: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (
      !this.props.user.driving_license_expiration &&
      !this.isValidDate(this.state.drivingLicenseExpiration)
    ) {
      this.setState(
        {
          error: true,
          message: "Invalid Driving License Expiration Date",
          validating: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (
      !this.props.user.driving_license_expiration &&
      this.isDateBefore(this.state.drivingLicenseExpiration)
    ) {
      this.setState(
        {
          error: true,
          message: "Invalid Driving License Expiration Date",
          validating: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (!this.state.licenseIssuedState) {
      this.setState(
        {
          error: true,
          message: "License Issued State required",
          validating: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else if (!this.state.licenseIssuedCountry) {
      this.setState(
        {
          error: true,
          message: "License Issued Country required",
          validating: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    }
    return true;
  };

  handleRequestHide = () => {
    this.setState({ cropperOpen: false });
  };

  setNewPhoneNumber = phoneNumber => {
    this.setState({ phoneNumber: phoneNumber == "(" ? "" : phoneNumber });
  };

  getUploadedFiles = data => {
    const { dispatch } = this.props;
    this.setState({
      profile_image: data[0].location,
      isCropped: true,
      rendering: ""
    });
    dispatch(uploadProfilePicV2(data[0].location));
  };

  onUploadError = err => {
    this.setState({ profile_img_error: err });
  };

  render() {
    const { user, usStates, verifyPhone, history } = this.props;
    const { profile_img_error } = this.state;
    return (
      <div className="booking-user-info-wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="page-sub-title">
              Please update your personal information here
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="profcomp-avatar">
              <RydeAvatar
                cropper
                folder={`profile/${user.id}`}
                onUpload={this.getUploadedFiles}
                onError={this.onUploadError}
                _errors={{
                  isError: profile_img_error.is_error ? true : false,
                  message: ""
                }}
                img={
                  user && user.profile_image_thumb
                    ? user.profile_image_thumb
                    : null
                }
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  First name <span className="fields-requred">*</span>
                </label>
                {user && user.first_name ? (
                  <input
                    type="text"
                    value={user.first_name}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <TextInput
                    type="text"
                    name="firstName"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.firstName}
                    onChange={e => this.setState({ firstName: e.target.value })}
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>
              <div className="col-md-6 fields-sep">
                <label>
                  Last name <span className="fields-requred">*</span>
                </label>
                {user && user.last_name ? (
                  <input
                    type="text"
                    value={user.last_name}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <TextInput
                    type="text"
                    name="lastName"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.lastName}
                    onChange={e => this.setState({ lastName: e.target.value })}
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  Email <span className="fields-requred">*</span>
                </label>
                {user && user.email ? (
                  <input
                    type="text"
                    value={user.email}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <TextInput
                    type="email"
                    name="email"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>

              <div className="col-md-6 fields-sep">
                <label>
                  Phone number <span className="fields-requred">*</span>
                </label>
                <TelInput
                  name="phoneNumber"
                  label={false}
                  validate={() => this._validate()}
                  onChange={e => this.setNewPhoneNumber(e)}
                  value={this.state.phoneNumber}
                  onBlurValidator={true}
                  errorFnc={() => {
                    if (this.state.validating) {
                      if (!this.state.phoneNumber) {
                        return "Phone number required";
                      }
                      if (
                        this.state.phoneNumber &&
                        this.state.phoneNumber.length !== 12
                      ) {
                        return "Invalid phone number";
                      }
                    }
                  }}
                  initalNumber={
                    user && user.phone_number ? user.phone_number : ""
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  Date of birth <span className="fields-requred">*</span>
                </label>
                {user && user.date_of_birth ? (
                  <input
                    type="text"
                    value={moment(user.date_of_birth).format("MM-DD-YYYY")}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <DateTextInput
                    placeholder="MM-DD-YYYY"
                    type="text"
                    name="dateOfBirth"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.dateOfBirth}
                    onChange={e =>
                      this.setState({ dateOfBirth: e.target.value })
                    }
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>
              <div className="col-md-6 fields-sep">
                <label>
                  Street address <span className="fields-requred">*</span>
                </label>
                <TextInput
                  type="text"
                  name="streetAddress"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.validating}
                  value={this.state.streetAddress}
                  onChange={e =>
                    this.setState({ streetAddress: e.target.value })
                  }
                  className="form-control form-control-sm input-sm"
                  placeholder="Type street address here"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  City <span className="fields-requred">*</span>
                </label>
                <TextInput
                  type="text"
                  name="city"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.validating}
                  value={this.state.city}
                  onChange={e => this.setState({ city: e.target.value })}
                  className="form-control form-control-sm input-sm"
                  placeholder="Type city here"
                />
              </div>
              <div className="col-md-6 fields-sep">
                <label>
                  Zip code <span className="fields-requred">*</span>
                </label>
                <TextInput
                  type="number"
                  name="zipCode"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.validating}
                  value={this.state.zipCode}
                  onChange={e => this.setState({ zipCode: e.target.value })}
                  className="form-control form-control-sm input-sm"
                  placeholder="Type zip code here"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  State <span className="fields-requred">*</span>
                </label>
                <div className="select-outer">
                  <SelectInput
                    validate={() => this._validate()}
                    className="form-control form-control-sm form-select input-sm"
                    value={this.state.state}
                    prompt="Select"
                    required={true}
                    submitting={this.state.validating}
                    data={this._makeUsStateArray()}
                    id="state"
                    name="state"
                    onChange={e => this.setState({ state: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />

        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <div className="page-sub-title">Driver license information</div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  Driver license number{" "}
                  <span className="fields-requred">*</span>
                </label>
                {user && user.driving_license_number ? (
                  <input
                    type="text"
                    value={user.driving_license_number}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <TextInput
                    type="text"
                    name="drivingLicenseNumber"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.drivingLicenseNumber}
                    onChange={e =>
                      this.setState({ drivingLicenseNumber: e.target.value })
                    }
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>
              <div className="col-md-6 fields-sep">
                <label>
                  Expiration <span className="fields-requred">*</span>
                </label>
                {user && user.driving_license_expiration ? (
                  <input
                    type="text"
                    value={moment(user.driving_license_expiration).format(
                      "MM-DD-YYYY"
                    )}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <DateTextInput
                    className="form-control form-control-sm input-sm"
                    placeholder="MM-DD-YYYY"
                    type="text"
                    name="drivingLicenseExpiration"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.drivingLicenseExpiration}
                    onChange={e =>
                      this.setState({
                        drivingLicenseExpiration: e.target.value
                      })
                    }
                    id="input-id"
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 fields-sep">
                <label>
                  License issued state <span className="fields-requred">*</span>
                </label>
                {user && user.license_issued_state ? (
                  <div className="select-outer disabled-outer">
                    <select
                      className="form-control form-control-sm input-sm disabled"
                      readOnly={true}
                      value={this.state.licenseIssuedState}
                      onChange={e =>
                        this.setState({ licenseIssuedState: e.target.value })
                      }
                    >
                      {usStates.map(state => {
                        return (
                          this.state.licenseIssuedState == state.code && (
                            <option key={state.code} value={state.code}>
                              {state.name}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                ) : (
                  <div className="select-outer">
                    <SelectInput
                      validate={() => this._validate()}
                      required={true}
                      prompt="Select"
                      submitting={this.state.validating}
                      className="form-control form-control-sm form-select input-sm"
                      data={this._makeUsStateArray()}
                      value={this.state.licenseIssuedState}
                      id="licenseIssuedState"
                      name="licenseIssuedState"
                      onChange={e =>
                        this.setState({ licenseIssuedState: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
              <div className="col-md-6 fields-sep">
                <label>
                  License issued country{" "}
                  <span className="fields-requred">*</span>
                </label>
                {user && user.license_issued_country ? (
                  <input
                    type="text"
                    value={user.license_issued_country}
                    className="form-control form-control-sm input-sm disabled"
                    readOnly={true}
                  />
                ) : (
                  <TextInput
                    type="text"
                    name="licenseIssuedCountry"
                    validate={() => this._validate()}
                    required={true}
                    submitting={this.state.validating}
                    value={this.state.licenseIssuedCountry}
                    onChange={e =>
                      this.setState({ licenseIssuedCountry: e.target.value })
                    }
                    className="form-control form-control-sm input-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {this.state.success && (
              <div className="messages-wrapper">
                <div className="notification success-message">
                  <span className="success-notification-cap-lg">
                    Thank you.
                  </span>
                  <span className="success-notification-cap-sm">
                    {this.state.message}
                  </span>
                </div>
              </div>
            )}
            {this.state.error && (
              <div className="messages-wrapper">
                <div className="notification error-message">
                  <div className="notification-inner">
                    <img
                      className="img-responsive pic"
                      src="/images/error-icon.svg"
                      alt="icon"
                    />
                    <span className="error-notification-cap-lg">
                      {this.state.message}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <PhoneVerification signupFormData={verifyPhone} isOpen={verifyPhone} />
        {/* <div className="row">
                    <div className="col-md-12">
                        <button type="submit" className="btn btn-success save-btn pull-right" onClick={ () => {this.updateUserProfile()} }>Save & continue</button>
                    </div>
                </div> */}

        {/* Bottom buttons - Start */}
        <div className="checkout-buttons-wrapper">
          <div className="flex-container">
            <button
              className="checkout-buttons back-btn"
              onClick={() => history.goBack()}
            >
              <span className="icon-left-arrow" /> BACK
            </button>
            <button
              className="checkout-buttons continue-btn"
              onClick={() => {
                this.updateUserProfile();
              }}
            >
              {this.state.submitting === true && (
                <div className="submit-btn-preloder">
                  <PreloaderIcon
                    loader={Oval}
                    size={20}
                    strokeWidth={8} // min: 1, max: 50
                    strokeColor="#fff"
                    duration={800}
                  />
                </div>
              )}
              SAVE & CONTINUE
            </button>
          </div>
        </div>
        {/* Bottom buttons - End */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user.user,
  bookingData: state.booking.bookingData,
  usStates: state.car.usStates,
  verifyPhone: state.user.verifyPhoneNumber,
  newPhoneVerificationCode: state.user.newPhoneVerificationCode
});
export default withRouter(
  connect(mapStateToProps)(checkAuth(UserInformationForBooking))
);
