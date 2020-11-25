import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import moment from "moment";
import MaskedTextInput from "react-text-mask";
import TelInput from "../../../form-components/TelInput";
import axios from "axios";
import RydeAvatar from "../../file-processing/lib/Avatar";
import {
  getLoggedInUser,
  resendPhoneVerificationCode
} from "../../../actions/UserActions";
import ApiError from "./ApiError";
import PhoneVerification from "../../verifications/PhoneVerification";
import * as Type from "../../../actions/ActionTypes";
import { authFail } from "../../../actions/AuthAction";

const mask = [/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

class StepTwo extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      license_issued_state: "",
      driving_license_number: "",
      driving_license_expiration: "",
      phone_number: "",
      error: false,
      errorMessage: "",
      cropperOpen: false,
      profile_image: user.profile_image ? user.profile_image : "",
      index: 0,
      profile_img_error: {},
      submitting: false,
      phoneVerificationIsOpen: false,
      rendering: "",
      street_address: "",
      city: "",
      person_state: "",
      zip_code: ""
    };
  }

  componentWillMount() {
    this.setInitialValues();
  }

  componentWillReceiveProps(nextProps) {
    this.setInitialValues(nextProps);
  }

  formatPhoneNumber = data => {
    return data.toString().replace(/[^+\d]+/g, "");
  };

  uploadProfile = imgUrl => {
    const { dispatch } = this.props;
    const data = {
      profile_image: imgUrl
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}v2/profile/pic_upload`, data, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(() => {
        dispatch({
          type: Type.PROFILE_PIC_UPDATE_SUCCESS,
          payload: "Photo Upload Success"
        });
      })
      .catch(() => {
        dispatch({ type: Type.DONE_FETCHING });
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

  handleSave = async () => {
    this.setState({ submitting: true });
    const { user, dispatch } = this.props;
    const {
      first_name,
      last_name,
      date_of_birth,
      license_issued_state,
      driving_license_number,
      driving_license_expiration,
      phone_number,
      profile_image,
      street_address,
      city,
      person_state,
      zip_code
    } = this.state;

    if (
      !first_name ||
      !last_name ||
      !date_of_birth ||
      !license_issued_state ||
      !driving_license_number ||
      !driving_license_expiration ||
      !phone_number ||
      (phone_number && phone_number.length !== 12) ||
      !profile_image ||
      !street_address ||
      !city ||
      !person_state ||
      !zip_code ||
      !moment(date_of_birth, "MM-DD-YYYY").isValid()
    ) {
      this.setState({ error: true, submitting: false }, () => {
        this.focusToError([
          { first_name },
          { last_name },
          { license_issued_state },
          // { date_of_birth },
          { driving_license_number },
          { driving_license_expiration },
          { phone_number },
          { street_address },
          { city },
          { person_state },
          { zip_code }
        ]);
      });
      return false;
    }

    let data = {
      first_name,
      last_name,
      date_of_birth: moment(date_of_birth, "MM-DD-YYYY").format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      license_issued_state,
      driving_license_number,
      driving_license_expiration: moment(
        driving_license_expiration,
        "MM-DD-YYYY"
      ).format("YYYY-MM-DD HH:mm:ss"),
      phone_number: phone_number,
      street_address: street_address,
      city: city,
      state: person_state,
      zip_code: zip_code
    };

    try {
      const response = await await axios.patch(
        `${process.env.REACT_APP_API_URL}users/${this.props.user.id}`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        if (response.data.response.verified_phone === 0) {
          let data = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: this.formatPhoneNumber(phone_number),
            type: "PROFILE"
          };
          dispatch(resendPhoneVerificationCode(data, phone_number));
          this.setState({ phoneVerificationIsOpen: true });
        }
        if (response.data.response.verified_phone === 1) {
          dispatch(getLoggedInUser(false));
          this.setState({ submitting: false });
          this.props.loadNext();
        }
      } else {
        this.setState({
          error: true,
          errorMessage: response.data.message,
          submitting: false
        });
      }
    } catch (error) {
      dispatch(authFail(error));
      this.setState({
        error: true,
        errorMessage: error.response.data.message,
        submitting: false
      });
    }
  };

  getUploadedFiles = data => {
    this.setState({ profile_image: data[0].location }, () => {
      this.uploadProfile(data[0].location);
    });
  };

  onUploadError = err => {
    this.setState({ profile_img_error: err });
  };

  handleVerificationSuccess = () => {
    this.setState({ phoneVerificationIsOpen: false, submitting: false });
    this.setState({ submitting: false });
    this.props.loadNext();
  };

  handleRender(e) {
    this.setState({
      rendering: e
    });
  }

  keyDownHandle = e => {
    if (e.which == 43 || e.which == 45) {
      e.preventDefault();
    }
  };

  render() {
    const { loadPrevious, usStates, user } = this.props;
    const {
      first_name,
      last_name,
      date_of_birth,
      license_issued_state,
      driving_license_number,
      driving_license_expiration,
      phone_number,
      profile_image,
      error,
      profile_img_error,
      street_address,
      city,
      person_state,
      zip_code
    } = this.state;

    const defaultAvatar = (
      <div className="profile-image-wrapper">
        <div className="avatar-photo">
          <div className="avatar-edit">
            <span>Upload</span>
            <i className="fa fa-camera" />
          </div>
          <img
            src={profile_image ? profile_image : "/images/defaultprofile.jpg"}
            width="100%"
          />
        </div>
      </div>
    );

    let verificationData = {
      phone_number: phone_number && this.formatPhoneNumber(phone_number),
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      type: "PROFILE"
    };
    // console.log("date_of_birth", moment(date_of_birth, "MM-DD-YYYY").isValid());
    return (
      <Fragment>
        <div className="form-horizontal">
          <br />
          <h4 className="center">Your information</h4>
          <br />

          <h6 className="center ash-color-text">Upload your photo</h6>
          <div className="row">
            <div className="col-md-12">
              <div className="profcomp-avatar">
                <RydeAvatar
                  cropper
                  folder={`profile/${user.id}`}
                  onUpload={this.getUploadedFiles}
                  uploadBtn={defaultAvatar}
                  onError={this.onUploadError}
                  _errors={{
                    isError: profile_img_error.is_error ? true : false,
                    message: ""
                  }}
                  img={profile_image ? profile_image : null}
                />

                {error && !profile_image && (
                  <span style={{ color: "red", fontSize: 10 }}>
                    Image Required
                  </span>
                )}
                {profile_img_error.is_error && (
                  <div className="GC_form_error">
                    {profile_img_error.message && profile_img_error.message}
                  </div>
                )}
              </div>
              <h6 className="center">Drag an image here or Click to upload</h6>
              <br />
              <div className="form-group">
                <label className="control-label col-sm-3">First Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    value={first_name}
                    disabled={this.props.user.first_name}
                    onChange={e =>
                      this.setState({ first_name: e.target.value })
                    }
                    ref={ref => (this.first_name = ref)}
                  />
                  {error && !first_name && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">Last Name</label>
                <div className="col-sm-9">
                  <input
                    className={
                      error && !last_name
                        ? "form-control error"
                        : "form-control"
                    }
                    type="text"
                    value={last_name}
                    disabled={this.props.user.last_name}
                    onChange={e => this.setState({ last_name: e.target.value })}
                    ref={ref => (this.last_name = ref)}
                  />
                  {error && !last_name && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">Date of Birth</label>
                <div
                  className="col-sm-9"
                  ref={ref => (this.date_of_birth = ref)}
                >
                  <MaskedTextInput
                    mask={mask}
                    className={
                      error &&
                      (!date_of_birth ||
                        !moment(date_of_birth, "MM-DD-YYYY").isValid())
                        ? "form-control form-control-sm input-sm error"
                        : "form-control form-control-sm input-sm"
                    }
                    placeholder="MM-DD-YYYY"
                    guide={true}
                    value={date_of_birth}
                    disabled={this.props.user.date_of_birth}
                    onChange={e =>
                      this.setState({ date_of_birth: e.target.value })
                    }
                    type="text"
                    ref={ref => (this.date_of_birth = ref)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {error && !date_of_birth && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                  {error &&
                    date_of_birth &&
                    !moment(date_of_birth, "MM-DD-YYYY").isValid() && (
                      <span style={{ color: "red", fontSize: 10 }}>
                        Invalid date
                      </span>
                    )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">Street Address</label>
                <div className="col-sm-9">
                  <input
                    className={
                      error && !street_address
                        ? "form-control error"
                        : "form-control"
                    }
                    type="text"
                    value={street_address}
                    disabled={this.props.user.street_address}
                    onChange={e =>
                      this.setState({ street_address: e.target.value })
                    }
                    ref={ref => (this.street_address = ref)}
                  />
                  {error && !street_address && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">City</label>
                <div className="col-sm-9">
                  <input
                    className={
                      error && !city ? "form-control error" : "form-control"
                    }
                    type="text"
                    value={city}
                    disabled={this.props.user.city}
                    onChange={e => this.setState({ city: e.target.value })}
                    ref={ref => (this.city = ref)}
                  />
                  {error && !city && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">State</label>
                <div className="col-sm-9">
                  <select
                    className={
                      error && !person_state
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    name="state"
                    value={person_state}
                    disabled={this.props.user.state}
                    onChange={e =>
                      this.setState({ person_state: e.target.value })
                    }
                    ref={ref => (this.person_state = ref)}
                  >
                    <option />
                    {usStates &&
                      usStates.map((item, index) => {
                        return (
                          <option key={index} value={item.code}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">Zip Code</label>
                <div className="col-sm-9">
                  <input
                    className={
                      error && !zip_code ? "form-control error" : "form-control"
                    }
                    type="number"
                    value={zip_code}
                    disabled={this.props.user.zip_code}
                    onChange={e =>
                      this.setState({
                        zip_code: e.target.value.replace(/\W|^/g, "")
                      })
                    }
                    onKeyPress={e => this.keyDownHandle(e)}
                    ref={ref => (this.zip_code = ref)}
                  />
                  {error && !zip_code && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">
                  License issued state
                </label>
                <div className="col-sm-9">
                  <select
                    className={
                      error && !license_issued_state
                        ? "listFormInput error"
                        : "listFormInput"
                    }
                    name="trim_id"
                    value={license_issued_state}
                    disabled={this.props.user.license_issued_state}
                    onChange={e =>
                      this.setState({ license_issued_state: e.target.value })
                    }
                    ref={ref => (this.license_issued_state = ref)}
                  >
                    <option />
                    {usStates &&
                      usStates.map((item, index) => {
                        return (
                          <option key={index} value={item.code}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                  {error && !license_issued_state && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">
                  Driver License Number
                </label>
                <div className="col-sm-9">
                  <input
                    className={
                      error && !driving_license_number
                        ? "listFormInput error"
                        : ""
                    }
                    type="text"
                    value={driving_license_number}
                    disabled={this.props.user.driving_license_number}
                    onChange={e =>
                      this.setState({
                        driving_license_number: e.target.value.replace(
                          /[^\w\s]/gi,
                          ""
                        )
                      })
                    }
                    onKeyPress={e => this.keyDownHandle(e)}
                    ref={ref => (this.driving_license_number = ref)}
                  />
                  {error && !driving_license_number && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">
                  Driving License Expiration
                </label>
                <div
                  className="col-sm-9"
                  ref={ref => (this.driving_license_expiration = ref)}
                >
                  <MaskedTextInput
                    mask={mask}
                    className={
                      error && !driving_license_expiration
                        ? "form-control form-control-sm input-sm error"
                        : "form-control form-control-sm input-sm"
                    }
                    placeholder="MM-DD-YYYY"
                    guide={true}
                    value={driving_license_expiration}
                    disabled={this.props.user.driving_license_expiration}
                    onChange={e =>
                      this.setState({
                        driving_license_expiration: e.target.value
                      })
                    }
                    type="text"
                    ref={ref => (this.driving_license_expiration = ref)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {error && !driving_license_expiration && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-3">Phone Number</label>
                <div className="col-sm-9">
                  <TelInput
                    initalNumber={user.phone_number ? user.phone_number : ""}
                    label={false}
                    value={phone_number}
                    onChange={phone_number => this.setState({ phone_number })}
                    ref={ref => (this.phone_number = ref)}
                  />

                  {error && !phone_number && (
                    <span style={{ color: "red", fontSize: 10 }}>Required</span>
                  )}
                  {error && phone_number && phone_number.length !== 12 && (
                    <span style={{ color: "red", fontSize: 10 }}>
                      Invalid phone number
                    </span>
                  )}
                </div>
              </div>
            </div>
            {this.state.error && this.state.errorMessage && (
              <div className="row">
                <div className="col-sm-offset-3 col-sm-9">
                  <ApiError>{this.state.errorMessage}</ApiError>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-12">
                <div className="List_button_wrapper">
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
                    onClick={() => this.handleSave()}
                    disabled={this.state.submitting === true}
                  >
                    {this.state.submitting === true && (
                      <div style={{ paddingRight: "5px" }}>
                        <PreloaderIcon
                          loader={Oval}
                          size={20}
                          strokeWidth={8} // min: 1, max: 50
                          strokeColor="#fff"
                          duration={800}
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
        <PhoneVerification
          signupFormData={verificationData}
          isOpen={this.state.phoneVerificationIsOpen}
          onCloseModal={() =>
            this.setState({ phoneVerificationIsOpen: false, submitting: false })
          }
          onSuccess={this.handleVerificationSuccess}
        />
      </Fragment>
    );
  }

  setInitialValues = nextProps => {
    const { user } = nextProps ? nextProps : this.props;
    if (user.id) {
      const {
        first_name,
        last_name,
        date_of_birth,
        license_issued_state,
        driving_license_number,
        driving_license_expiration,
        phone_number,
        profile_image,
        street_address,
        city,
        state,
        zip_code
      } = user;
      this.setState({
        first_name: first_name ? first_name : "",
        last_name: last_name ? last_name : "",
        date_of_birth:
          date_of_birth &&
          moment(date_of_birth, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY"),
        street_address: street_address ? street_address : "",
        city: city ? city : "",
        person_state: state ? state : "",
        zip_code: zip_code ? zip_code : "",
        license_issued_state: license_issued_state ? license_issued_state : "",
        driving_license_number: driving_license_number
          ? driving_license_number
          : "",
        driving_license_expiration:
          driving_license_expiration &&
          moment(driving_license_expiration, "YYYY-MM-DD HH:mm:ss").format(
            "MM-DD-YYYY"
          ),
        phone_number: phone_number ? phone_number : "",
        profile_image
      });
    }
  };
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    usStates: state.car.usStates
  };
};

export default connect(mapStateToProps)(StepTwo);
