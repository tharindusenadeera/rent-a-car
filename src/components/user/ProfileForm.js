import React, { Component } from "react";
import moment from "moment";
import ReactTelephoneInput from "react-telephone-input/lib/withStyles";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector, change } from "redux-form";
import PhoneVerification from "../../components/verifications/PhoneVerification";
import CreditCardForm from "./CreditCardForm";
import MaskedTextInput from "react-text-mask";
import { countryList } from "../../consts/consts";
import axios from "axios";
import Select from "react-select";
//import "react-select/dist/react-select.css";
import { getLoggedInUser } from "../../actions/UserActions";
import { USER_UPDATE_SUCCESS } from "../../actions/ActionTypes";

const renderField = ({
  input,
  label,
  placeholder,
  type,
  className,
  disabled = false,
  meta: { touched, error }
}) => {
  return (
    <div className="form-group">
      <label className="col-sm-4 control-label">{label}</label>
      <div className="col-sm-8">
        <input
          {...input}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          type={type}
          autoComplete="off"
        />
        {touched && error && (
          <span style={{ color: "red", fontSize: 10 }}>{error}</span>
        )}
      </div>
    </div>
  );
};

const renderFieldTextarea = ({
  input,
  className,
  meta: { touched, error }
}) => {
  return (
    <div>
      <textarea
        {...input}
        className={className}
        autoComplete="off"
        placeholder="Tell People About Your Self."
      />
      {touched && error && (
        <span style={{ color: "red", fontSize: 10 }}>{error}</span>
      )}
    </div>
  );
};

const renderDateField = ({ input, label, meta: { touched, error } }) => {
  return (
    <div className="form-group">
      <label className="control-label col-sm-4">{label}</label>
      <div className="col-sm-8">
        <MaskedTextInput
          mask={[/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]}
          className="form-control input-sm"
          placeholder="MM-DD-YYYY"
          guide={false}
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

const renderTelInput = ({ input, meta: { touched, error } }) => {
  return (
    <div className="form-group">
      <label className="control-label col-sm-4">Phone Number</label>
      <div className="col-sm-8">
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

const renderSelectField = ({
  input,
  className,
  disabled,
  meta: { touched, error },
  children
}) => {
  return (
    <div className="col-sm-8">
      <select {...input} disabled={disabled} className={className}>
        <option value="" />
        {children}
      </select>
      {touched && error && (
        <span style={{ color: "red", fontSize: 10 }}>{error}</span>
      )}
    </div>
  );
};

class ProfileForm extends Component {
  constructor() {
    super();
    this.state = {
      success: false,
      error: false,
      errorMessage: "",
      successMessage: "",
      showCreditCardForm: false,
      languagesList: [],
      selectedLanguages: []
    };
  }

  componentWillMount = async () => {
    try {
      const languages = await await axios.get(
        process.env.REACT_APP_API_URL + "languages",
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!languages.data.error) {
        this.setState({ languagesList: languages.data.feature });
      }
    } catch (error) {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues.credit_card) {
      this.setState({ showCreditCardForm: false });
    }
    if (
      nextProps.newPhoneVerificationCode &&
      nextProps.newPhoneVerificationCode.error
    ) {
      this.setState(
        {
          error: true,
          errorMessage: nextProps.newPhoneVerificationCode.message
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
    if (nextProps.error) {
      this.setState({ error: true, errorMessage: nextProps.error }, state => {
        setTimeout(() => {
          this.setState({ error: false, errorMessage: "" });
        }, 5000);
      });
    }
    if (nextProps.userUpdateSuccess) {
      this.setState(
        { success: true, successMessage: nextProps.userUpdateSuccess },
        state => {
          setTimeout(() => {
            this.setState({ success: false, successMessage: "" });
          }, 5000);
          this.props.dispatch({ type: USER_UPDATE_SUCCESS, payload: "" });
        }
      );
    }
  }

  handleChange = async selectedOption => {
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "add-language",
        { id: selectedOption },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch(getLoggedInUser());
      }
    } catch (error) {}
  };

  languagesList = () => {
    const { languagesList } = this.state;

    const languageArray = languagesList.map(language => {
      return { value: "" + language.id, label: language.name };
    });
    return languageArray;
  };

  _removeLanguaage = async id => {
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "remove-language",
        { id: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch(getLoggedInUser());
      }
    } catch (error) {}
  };

  enableConfirm() {
    const { initialValues, profile } = this.props;

    if (
      !initialValues.customer_profile_id &&
      !initialValues.payment_profiles_id &&
      !profile
    ) {
      this.setState(
        {
          error: true,
          errorMessage: "Please add a credit card to complete your booking"
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    } else {
      this.props.handleSubmit();
    }
  }
  render() {
    const {
      handleSubmit,
      initialValues,
      isInternational,
      profile,
      user,
      usStates,
      creditCardError,
      verifyPhone
    } = this.props;
    const fieldDisabled = isInternational ? false : true;
    if (initialValues.date_of_birth == "Invalid date") {
      initialValues.date_of_birth = null;
    }
    if (initialValues.driving_license_expiration == "Invalid date") {
      initialValues.driving_license_expiration = null;
    }
    return (
      <div className="row">
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="col-sm-10">
            <div className="">
              <h4>PERSONAL INFORMATION</h4>
            </div>
            <br />
          </div>
          <div className="row">
            <div className="col-sm-6">
              {!initialValues.first_name ? (
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="First Name"
                  type="text"
                  name="first_name"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">First Name</label>
                  <div className="col-sm-8">{initialValues.first_name}</div>
                </div>
              )}
            </div>
            <div className="col-sm-6">
              {!initialValues.last_name ? (
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Last Name"
                  type="text"
                  name="last_name"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">Last Name</label>
                  <div className="col-sm-8">{initialValues.last_name}</div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              {!initialValues.date_of_birth ? (
                <Field
                  component={renderDateField}
                  className="form-control input-sm"
                  placeholder="MM-DD-YYYY"
                  label="Date of Birth"
                  type="text"
                  name="date_of_birth"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 " placeholder="MM-DD-YYYY">
                    Date of Birth
                  </label>
                  <div className="col-sm-8">{initialValues.date_of_birth}</div>
                </div>
              )}
            </div>
            <div className="col-sm-6">
              {!initialValues.email ? (
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Email"
                  type="text"
                  name="email"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">Email</label>
                  <div className="col-sm-8">{initialValues.email}</div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              {!initialValues.license_issued_state ? (
                <div className="form-group">
                  {!isInternational ? (
                    <div>
                      <label className="control-label col-sm-4">
                        License Issued State
                      </label>
                      <Field
                        component={renderSelectField}
                        propmt="Select State"
                        name="license_issued_state"
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
                  ) : (
                    <Field
                      component={renderField}
                      type="text"
                      name="license_issued_state"
                      label="License Issued State"
                      className="form-control input-sm"
                    />
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">License Issued State</label>
                  <div className="col-sm-8">
                    {initialValues.license_issued_state}
                  </div>
                </div>
              )}
            </div>
            <div className="col-sm-6">
              {!initialValues.license_issued_country ? (
                <div className="form-group">
                  <label className="control-label col-sm-4">
                    License Issued Country
                  </label>
                  <Field
                    disabled={fieldDisabled}
                    test="test"
                    component={renderSelectField}
                    className="form-control"
                    label="License Issued Country"
                    name="license_issued_country"
                  >
                    {countryList.map(country => {
                      return (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      );
                    })}
                  </Field>
                </div>
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">License Issued Country</label>
                  <div className="col-sm-8">
                    {initialValues.license_issued_country}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              {!initialValues.driving_license_number ? (
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Driver License Number"
                  type="text"
                  name="driving_license_number"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">Driver License Number</label>
                  <div className="col-sm-8">
                    {initialValues.driving_license_number}
                  </div>
                </div>
              )}
            </div>
            <div className="col-sm-6">
              {!initialValues.driving_license_expiration ? (
                <Field
                  component={renderDateField}
                  placeholder="MM-DD-YYYY"
                  type="text"
                  label="Expiration"
                  name="driving_license_expiration"
                  className="form-control input-sm"
                />
              ) : (
                <div className="form-group">
                  <label className="col-sm-4 ">Expiration</label>
                  <div className="col-sm-8">
                    {initialValues.driving_license_expiration}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <label className="control-label">About</label>
            </div>
            <div className="col-sm-10">
              <Field
                component={renderFieldTextarea}
                className="form-control"
                label="User Bio"
                type="textarea"
                name="bio"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <div>
                  <label className="control-label col-sm-4">Languages</label>
                  <div
                    className="col-sm-12"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    <Select
                      name="form-field-name"
                      className=""
                      onChange={e => {
                        this.handleChange(e.value);
                      }}
                      options={this.languagesList()}
                    />
                  </div>
                  <div>
                    {user &&
                      user.languages &&
                      user.languages.map(lng => {
                        return (
                          <span
                            key={lng.id}
                            style={{
                              display: "inline-block",
                              margin: 5,
                              backgroundColor: "#f46b4b",
                              color: "#fff",
                              padding: 5,
                              borderRadius: 50
                            }}
                          >
                            {lng.name}
                            <span
                              onClick={() => {
                                this._removeLanguaage(lng.id);
                              }}
                              style={{ cursor: "pointer", paddingLeft: 10 }}
                              className="glyphicon glyphicon-remove-circle"
                              aria-hidden="true"
                            />
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Field
                component={renderField}
                className="form-control input-sm"
                label="School"
                type="text"
                name="school"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <Field
                component={renderField}
                className="form-control input-sm"
                label="Street Address"
                type="text"
                name="street_address"
              />
            </div>
            <div className="col-sm-6">
              <Field
                component={renderField}
                className="form-control input-sm"
                label="City"
                type="text"
                name="city"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                {!isInternational ? (
                  <div>
                    <label className="control-label col-sm-4">State</label>
                    <Field
                      component={renderSelectField}
                      propmt="Select State"
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
                ) : (
                  <Field
                    component={renderField}
                    type="text"
                    name="state"
                    label="State"
                    className="form-control input-sm"
                  />
                )}
              </div>
            </div>
            <div className="col-sm-6">
              <Field
                component={renderField}
                className="form-control input-sm"
                label="Zip Code"
                type="text"
                name="zip_code"
              />
            </div>
          </div>
          {isInternational && (
            <div className="row">
              <div className="col-sm-6">
                <label className="control-label col-sm-4">Country</label>
                <Field
                  component={renderSelectField}
                  propmt="Country"
                  name="country"
                  className="form-control"
                >
                  {countryList.map(country => {
                    return (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    );
                  })}
                </Field>
              </div>
              <div className="col-sm-6" />
            </div>
          )}
          <div className="row">
            <div className="col-sm-6">
              <Field
                name="phone_number"
                className="form-control input-sm"
                component={renderTelInput}
                type="text"
              />
            </div>
            <div className="col-sm-6">
              <Field
                component={renderField}
                className="form-control input-sm"
                label="Work"
                type="text"
                name="work"
              />
            </div>
          </div>
          {profile && (
            <div className="row">
              <div className="col-sm-6">
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Routing Number"
                  type="text"
                  name="routing_number"
                  placeholder="This is for Car Owners only"
                />
              </div>
              <div className="col-sm-6" />
            </div>
          )}
          {profile && (
            <div className="row">
              <div className="col-sm-6">
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Bank Account number"
                  type="text"
                  name="bank_account_number"
                  placeholder="This is for Car Owners only"
                />
              </div>
              <div className="col-sm-6">
                <Field
                  component={renderField}
                  className="form-control input-sm"
                  label="Re-Enter Account No"
                  type="text"
                  name="re_enter_account_number"
                  placeholder="This is for Car Owners only"
                />
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-sm-4">
              {initialValues.credit_card && (
                <strong> Credit Card - {initialValues.credit_card} </strong>
              )}
            </div>
          </div>
          {!initialValues.credit_card && (
            <div className="row">
              <div className="col-sm-4">
                <img
                  className="img-responsive"
                  src={"https://cdn.rydecars.com/Eranda/Credit+card+logos.jpeg"}
                />
              </div>
            </div>
          )}
          <br />
          <div className="row">
            <div className="col-md-12 clearfix">
              <a
                className="btn btn-success pull-left"
                onClick={() => {
                  this.setState({ showCreditCardForm: true });
                }}
              >
                {" "}
                {initialValues.credit_card
                  ? "Change Credit Card"
                  : "Add Credit Card"}
              </a>
              {profile ? (
                <button
                  type="submit"
                  className="btn btn-danger pull-right"
                  disabled={
                    !initialValues.customer_profile_id &&
                    !initialValues.payment_profiles_id &&
                    !profile
                      ? true
                      : false
                  }
                >
                  Save
                </button>
              ) : (
                <div>
                  {initialValues.user_can_add_booking["renting_status"] ===
                    true || initialValues.user_can_add_booking["age"] == 0 ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger pull-right"
                        disabled={false}
                        onClick={() => {
                          initialValues && initialValues.square_sign_up
                            ? this.setState({
                                showCreditCardForm: !this.state
                                  .showCreditCardForm
                              })
                            : this.enableConfirm();
                        }}
                      >
                        Save and Continue
                      </button>
                      <br />
                      <p className="pull-left">
                        This is to confirm your information - you will not be
                        charged
                      </p>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="messages-wrapper">
                          <div className="notification error-message">
                            <div className="notification-inner">
                              <img
                                className="img-responsive pic"
                                src="/images/error-icon.svg"
                                alt="Image"
                              />
                              <span className="error-notification-cap-lg">
                                {
                                  initialValues.user_can_add_booking[
                                    "renting_message"
                                  ]
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {this.state.error ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="messages-wrapper">
                  <div className="notification error-message">
                    <div className="notification-inner">
                      <img
                        className="img-responsive pic"
                        src="/images/error-icon.svg"
                        alt="Image"
                      />
                      <span className="error-notification-cap-lg">
                        {this.state.errorMessage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.success ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="messages-wrapper">
                  <div className="notification success-message">
                    <span className="success-notification-cap-sm">
                      {this.state.successMessage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </form>
        {/* <VerifyPhone /> */}
        <PhoneVerification signupFormData={verifyPhone} isOpen={verifyPhone} />
        {this.state.showCreditCardForm && (
          <CreditCardForm
            showCreditCardForm={this.state.showCreditCardForm}
            handleCloseModal={() => {
              this.setState({ showCreditCardForm: false });
            }}
            usStates={usStates}
            isInternational={isInternational}
            creditCard={
              initialValues.credit_card ? initialValues.credit_card : ""
            }
            creditCardError={creditCardError}
          />
        )}
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

const validate = (values, props) => {
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
  if (!values.driving_license_expiration) {
    errors.driving_license_expiration = "Required";
  }
  if (values.driving_license_expiration) {
    if (!isValidDate(values.driving_license_expiration)) {
      errors.driving_license_expiration = "Invalid Date Format";
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
  if (values.date_of_birth && isValidDate(values.date_of_birth)) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    let dob = moment(values.date_of_birth, "MM-DD-YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    if (moment(now).isBefore(dob)) {
      errors.date_of_birth = "Invalid Date";
    }
  }
  if (!values.email) {
    errors.email = "Required";
  }
  if (!values.license_issued_state) {
    errors.license_issued_state = "Required";
  }
  if (!values.license_issued_country) {
    errors.license_issued_country = "Required";
  }
  if (!values.driving_license_number) {
    errors.driving_license_number = "Required";
  }

  if (!values.city) {
    errors.city = "Required";
  }
  if (!values.street_address) {
    errors.street_address = "Required";
  }
  if (!values.state) {
    errors.state = "Required";
  }
  if (!values.street_address) {
    errors.street_address = "Required";
  }
  if (!values.zip_code) {
    errors.zip_code = "Required";
  }
  if (!values.country) {
    errors.country = "Required";
  }
  if (!values.phone_number) {
    errors.phone_number = "Required";
  }
  if (values.phone_number && values.phone_number.length < 8) {
    errors.phone_number = "Invalid Phone Number";
  }
  if (!values.credit_card_first_name) {
    errors.credit_card_first_name = "Required";
  }
  if (!values.credit_card_last_name) {
    errors.credit_card_last_name = "Required";
  }
  if (!values.credit_card_number && !props.initialValues.credit_card) {
    errors.credit_card_number = "Required";
  }
  if (!values.credit_card_type && !props.initialValues.credit_card) {
    errors.credit_card_type = "Required";
  }
  if (!values.credit_card_expiry_year) {
    errors.credit_card_expiry_year = "Required";
  }
  if (!values.credit_card_expiry_month) {
    errors.credit_card_expiry_month = "Required";
  }
  if (!values.credit_card_ccv && !props.initialValues.credit_card) {
    errors.credit_card_ccv = "Required";
  }
  if (!values.credit_card_street_address) {
    errors.credit_card_street_address = "Required";
  }
  if (!values.credit_card_city) {
    errors.credit_card_city = "Required";
  }
  if (!values.credit_card_state) {
    errors.credit_card_state = "Required";
  }
  if (!values.credit_card_zip_code) {
    errors.credit_card_zip_code = "Required";
  }
  if (!values.credit_card_country) {
    errors.credit_card_country = "Required";
  }
  if (!values.bio) {
    errors.bio = "Required";
  }
  // if (!values.school) {
  //     errors.school = 'Required'
  // }
  // if (!values.work) {
  //     errors.work = 'Required'
  // }
  if (
    values.re_enter_account_number != values.bank_account_number &&
    values.bank_account_number != props.initialValues.bank_account_number &&
    values.bank_account_number != ""
  ) {
    errors.re_enter_account_number = "Does not match";
  }
  return errors;
};

// Decorate with redux-form
ProfileForm = reduxForm({
  form: "edit_profile",
  validate
})(ProfileForm);

// Decorate with connect to read form values
const selector = formValueSelector("edit_profile"); // <-- same as form name
ProfileForm = connect(state => {
  const streetAddress = selector(state, "street_address");
  const city = selector(state, "city");
  const stateAddress = selector(state, "state");
  const zipCode = selector(state, "zip_code");
  const country = selector(state, "country");
  return {
    userUpdateSuccess: state.user.userUpdateSuccess,
    verifyPhone: state.user.verifyPhoneNumber,
    newPhoneVerificationCode: state.user.newPhoneVerificationCode,
    streetAddress,
    city,
    stateAddress,
    zipCode,
    country
  };
})(ProfileForm);

export default ProfileForm;
