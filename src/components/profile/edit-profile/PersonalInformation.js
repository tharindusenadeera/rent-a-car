import React from "react";
import moment from "moment";
import { Input, Select } from "antd";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import MaskedTextInput from "react-text-mask";
import { updateProfile } from "../../../actions/ProfileActions";
import { UPDATE_SUCCESS, UPDATE_ERROR } from "../../../actions/ActionTypes";
import TelInput from "../../../form-components/TelInput";

const Option = Select.Option;

class PersonalInformation extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      error: false,
      success: false,
      message: "",
      first_name: user.first_name,
      last_name: user.last_name,
      date_of_birth: user.date_of_birth
        ? moment(user.date_of_birth).format("MM-DD-YYYY")
        : null,
      phone_number: user.phone_number,
      email: user.email,
      street_address: user.street_address,
      state: user.state,
      city: user.city,
      zip_code: user.zip_code,
      driving_license_number: user.driving_license_number,
      driving_license_expiration: user.driving_license_expiration
        ? moment(user.driving_license_expiration).format("MM-DD-YYYY")
        : null,
      license_issued_state: user.license_issued_state,
      tab: "PersonalInformation",
      stateAutoFocuse: false,
      errorMessage: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.success && prevProps.success === "") {
      this.setState(
        { success: true, message: this.props.success, submitting: false },
        () => {
          setTimeout(() => {
            this.setState({ success: false, message: "" }, state => {
              this.props.dispatch({ type: UPDATE_SUCCESS, payload: "" });
            });
          }, 2000);
        }
      );
    }

    if (this.props.error && prevProps.error === "") {
      this.setState(
        { error: true, message: this.props.error, submitting: false },
        () => {
          setTimeout(() => {
            this.setState({ error: false, message: "" }, state => {
              this.props.dispatch({ type: UPDATE_ERROR, payload: "" });
            });
          }, 2000);
        }
      );
    }

    if (this.props.user !== prevProps.user) {
      this.setInitialData(this.props.user);
    }
  }

  setInitialData(user) {
    this.setState({
      submitting: false,
      first_name: user.first_name,
      last_name: user.last_name,
      date_of_birth:
        user.date_of_birth &&
        moment(user.date_of_birth, "YYYY-MM-DD HH:mm:ss").format("MM-DD-YYYY"),
      phone_number: user.phone_number ? user.phone_number : "",
      email: user.email,
      street_address: user.street_address,
      state: user.state,
      city: user.city,
      zip_code: user.zip_code,
      driving_license_number: user.driving_license_number,
      driving_license_expiration: user.driving_license_expiration
        ? moment(user.driving_license_expiration).format("MM-DD-YYYY")
        : null,
      license_issued_state: user.license_issued_state
    });
  }

  isValidDate = dateString => moment(dateString, "MM-DD-YYYY").isValid();

  isAfterDate(dateString) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    let valid = moment(dateString, "MM-DD-YYYY").format("YYYY-MM-DD HH:mm:ss");
    if (moment(now).isAfter(valid)) {
      return true;
    }
  }

  isBeforeDate(dateString) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    let valid = moment(dateString, "MM-DD-YYYY").format("YYYY-MM-DD HH:mm:ss");
    if (moment(now).isBefore(valid)) {
      return true;
    }
  }

  validateForm() {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      street_address,
      state,
      city,
      zip_code,
      driving_license_number,
      driving_license_expiration,
      license_issued_state
    } = this.state;

    if (first_name === "" || first_name === null) {
      this.setState({ error: true });
      return false;
    } else if (last_name === "" || last_name === null) {
      this.setState({ error: true });
      return false;
    } else if (date_of_birth === "" || date_of_birth === null) {
      this.setState({ error: true });
      return false;
    } else if (phone_number === "" || phone_number === null) {
      this.setState({ error: true });
      return false;
    } else if (phone_number.length !== 12) {
      this.setState({ error: true });
      return false;
    } else if (street_address === "" || street_address === null) {
      this.setState({ error: true });
      return false;
    } else if (state === "" || state === null) {
      this.setState({ error: true });
      return false;
    } else if (city === "" || city === null) {
      this.setState({ error: true });
      return false;
    } else if (zip_code === "" || zip_code === null) {
      this.setState({ error: true });
      return false;
    } else if (
      driving_license_number === "" ||
      driving_license_number === null
    ) {
      this.setState({ error: true });
      return false;
    } else if (
      driving_license_expiration === "" ||
      driving_license_expiration === null
    ) {
      this.setState({ error: true });
      return false;
    } else if (license_issued_state === "" || license_issued_state === null) {
      this.setState({ error: true });
      return false;
    } else if (!this.isValidDate(date_of_birth)) {
      this.setState({ error: true }, () => {
        this.props.dispatch({
          type: UPDATE_ERROR,
          payload: "Invalid date of birth"
        });
      });
      return false;
    } else if (this.isBeforeDate(date_of_birth)) {
      this.setState({ error: true }, () => {
        this.props.dispatch({
          type: UPDATE_ERROR,
          payload: "Invalid date of birth"
        });
      });
      return false;
    } else if (!this.isValidDate(driving_license_expiration)) {
      this.setState({ error: true }, () => {
        this.props.dispatch({
          type: UPDATE_ERROR,
          payload: "Invalid Driving license expiration"
        });
      });
      return false;
    } else if (this.isAfterDate(driving_license_expiration)) {
      this.setState({ error: true }, () => {
        this.props.dispatch({
          type: UPDATE_ERROR,
          payload: "Invalid Driving license expiration"
        });
      });
      return false;
    } else if (driving_license_number.length > 20) {
      this.setState({ error: true }, () => {
        this.props.dispatch({
          type: UPDATE_ERROR,
          payload: "Invalid driving license number"
        });
      });
      return false;
    } else {
      this.setState({ error: false, submitting: true }, () => {
        this.handleSaveProfile();
      });
    }
  }

  handlePhoneNumber = phone_number => {
    this.setState({ phone_number });
  };

  handleSaveProfile() {
    const { dispatch, user } = this.props;
    const {
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      street_address,
      state,
      city,
      zip_code,
      driving_license_number,
      driving_license_expiration,
      license_issued_state,
      email,
      tab
    } = this.state;

    let data = {
      id: user.id,
      first_name,
      last_name,
      date_of_birth: moment(date_of_birth, "MM-DD-YYYY").format("YYYY-MM-DD"),
      phone_number: phone_number,
      street_address,
      state,
      city,
      zip_code,
      driving_license_number,
      driving_license_expiration: moment(
        driving_license_expiration,
        "MM-DD-YYYY"
      ).format("YYYY-MM-DD"),
      license_issued_state,
      email,
      tab
    };
    dispatch(updateProfile(data));
  }

  render() {
    const { usStates, user } = this.props;

    const {
      error,
      success,
      message,
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      email,
      street_address,
      state,
      city,
      zip_code,
      driving_license_number,
      driving_license_expiration,
      license_issued_state
    } = this.state;

    const completeStatus =
      user.first_name &&
      user.last_name &&
      user.date_of_birth &&
      user.phone_number &&
      user.email &&
      user.street_address &&
      user.state &&
      user.city &&
      user.zip_code
        ? true
        : false;

    const mask = [/\d/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
    return (
      <AccordionItem>
        <AccordionItemTitle>
          <h3 className="u-position-relative">
            Personal information
            <div className="Prof_list_complete">
              {completeStatus && (
                <img src="/images/profilev2/icon-correct.svg" />
              )}
            </div>
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>

        <AccordionItemBody>
          <div className="Prof_form_details_box personal">
            {/* Need to Fill Details */}
            <div className="row">
              {!user.first_name ? (
                <div className="col-md-6">
                  <div className="text_field">
                    {first_name && (
                      <label>
                        First Name
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="First name *"
                      className={error && !first_name ? "error" : " "}
                      value={first_name}
                      onChange={e =>
                        this.setState({
                          last_name: e.target.value
                        })
                      }
                    />
                    {error && !first_name && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="col-md-6 Prof_form_details filled">
                  <div className="row text_field">
                    <div className="col-md-4 title">First name</div>
                    <div className="col-md-8 txt">{first_name}</div>
                  </div>
                </div>
              )}

              {/* user last name */}
              {!user.last_name ? (
                <div className="col-md-6">
                  <div className="text_field">
                    {last_name && (
                      <label>
                        Last Name
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="Last name *"
                      className={error && !last_name ? "error" : " "}
                      value={last_name}
                      onChange={e =>
                        this.setState({
                          last_name: e.target.value
                        })
                      }
                    />
                    {error && !last_name && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row text_field">
                    <div className="col-md-4 title">Last name</div>
                    <div className="col-md-8 txt">{last_name}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              {email ? (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-4 title">Email</div>
                    <div className="col-md-8 txt">{email}</div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="text_field Prof_phoneno">
                  <label>
                    Phone number
                    <span className="fields-requred">*</span>
                  </label>
                  <TelInput
                    initalNumber={user.phone_number ? user.phone_number : ""}
                    value={phone_number ? phone_number : ""}
                    onChange={e => this.handlePhoneNumber(e)}
                    label={false}
                  />
                  {error && !phone_number && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                  {error && phone_number && phone_number.length !== 12 && (
                    <div className="Prof_error_txt">Invalid phone number</div>
                  )}
                </div>
              </div>

              {!user.date_of_birth ? (
                <div className="col-md-6">
                  <div className="text_field">
                    <label>
                      Date of Birth
                      <span className="fields-requred">*</span>
                    </label>
                    <MaskedTextInput
                      mask={mask}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="MM-DD-YYYY"
                      guide={false}
                      value={date_of_birth}
                      className={[
                        "form-control input-sm dob_text_field ",
                        error && !date_of_birth ? " error" : ""
                      ]}
                      onChange={e =>
                        this.setState({
                          date_of_birth: e.target.value
                        })
                      }
                    />
                    {error && !date_of_birth && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-4 title">Date of birth</div>
                    <div className="col-md-8 txt">{date_of_birth}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="text_field">
                  {street_address && (
                    <label>
                      Street Address
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    placeholder="Street address  *"
                    value={street_address}
                    onChange={e =>
                      this.setState({
                        street_address: e.target.value
                      })
                    }
                    className={error && !street_address ? "error" : " "}
                  />
                  {error && !street_address && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="text_field">
                  {state && (
                    <label>
                      State
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Select
                    showSearch
                    placeholder="State *"
                    optionFilterProp="children"
                    className={error && !state ? "error" : " "}
                    value={state ? state : undefined}
                    onFocus={() => this.setState({ stateAutoFocuse: true })}
                    autoFocus={this.state.stateAutoFocuse}
                    onChange={e =>
                      this.setState({
                        state: e
                      })
                    }
                  >
                    {usStates &&
                      usStates.map((item, index) => {
                        return (
                          <Option key={index} value={item.code}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>

                  {error && !state && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="text_field">
                  {city && (
                    <label>
                      City
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    placeholder="City *"
                    className={error && !city ? "error" : " "}
                    value={city}
                    onChange={e =>
                      this.setState({
                        city: e.target.value
                      })
                    }
                  />
                  {error && !city && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="text_field">
                  {zip_code && (
                    <label>
                      Zip code <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    pattern="[0-9]*"
                    placeholder="Zip code *"
                    className={error && !zip_code ? "error" : " "}
                    value={zip_code}
                    onChange={e => {
                      this.setState({
                        zip_code: e.target.validity.valid
                          ? e.target.value
                          : zip_code
                      });
                    }}
                  />
                  {error && !zip_code && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              {!user.driving_license_number ? (
                <div className="col-md-6">
                  <div className="text_field">
                    {driving_license_number && (
                      <label>
                        Driving License Number
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="Driver license number *"
                      value={driving_license_number}
                      onChange={e =>
                        this.setState({
                          driving_license_number: e.target.value
                        })
                      }
                      className={
                        error && !driving_license_number ? "error" : ""
                      }
                    />
                    {error && !driving_license_number && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : null}

              {!user.driving_license_expiration ? (
                <div className="col-md-6">
                  <div className="text_field">
                    <label>
                      Driving license expiration
                      <span className="fields-requred">*</span>
                    </label>
                    <MaskedTextInput
                      mask={mask}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="MM-DD-YYYY"
                      guide={false}
                      className={[
                        "form-control input-sm dob_text_field ",
                        error && !driving_license_expiration
                          ? " error"
                          : " form-control input-sm dob_text_field"
                      ]}
                      value={driving_license_expiration}
                      onChange={e =>
                        this.setState({
                          driving_license_expiration: e.target.value
                        })
                      }
                    />
                    {error && !driving_license_expiration && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="row">
              {!user.license_issued_state ? (
                <div className="col-md-6">
                  <div className="text_field">
                    <Select
                      showSearch
                      placeholder="License issued state *"
                      optionFilterProp="children"
                      value={
                        license_issued_state ? license_issued_state : undefined
                      }
                      onChange={e =>
                        this.setState({
                          license_issued_state: e
                        })
                      }
                      className={error && !license_issued_state ? "error" : ""}
                    >
                      {usStates &&
                        usStates.map((item, index) => {
                          return (
                            <Option key={index} value={item.code}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                    {error && !license_issued_state && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            {success && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box success">
                    <img src="/images/profilev2/message_icon_sucess.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}

            {error && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box failed">
                    <img src="/images/profilev2/message_icon_failed.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-sm-12">
                <div className="Prof_btn_box">
                  {/* <button className="Prof_btn Prof_btn_cancel">CANCEL</button> */}
                  <button
                    type="submit"
                    className="Prof_btn Prof_btn_submit"
                    onClick={() => this.validateForm()}
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
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AccordionItemBody>
      </AccordionItem>
    );
  }
}
export default PersonalInformation;
