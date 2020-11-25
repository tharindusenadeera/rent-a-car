import React, { Component, Fragment } from "react";
import moment from "moment";
import MaskedTextInput from "react-text-mask";
import JSEncrypt from "js-encript";
import { Input, Radio, Checkbox, Select, Slider } from "antd";
import { TextInput, TextArea } from "../elements";
import Upload from "../file";
import { BANK_ACCOUNT_TYPES } from "../../../../../consts/consts";
import {
  fetchMcc,
  postOwnersAccountData,
  fetchStripeDetail,
  editOwnerAccountData
} from "../../../../../api/owners";
import TelInput from "../../../../../form-components/TelInput";
import DateTextInput from "../../../../../form-components/DateTextInput";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import "antd/lib/slider/style/index.css";
import "antd/lib/input-number/style/index.css";
import "antd/lib/select/style/index.css";

const OWNERSHIP_TYPE_IS_OWNER = "owner";
const OWNERSHIP_TYPE_IS_OTHER = "other";
const { Option } = Select;

class CorporateAccount extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      account_type: "corporate",
      ownership_type: "",
      // Person data
      person_first_name: "",
      person_last_name: "",
      person_date_of_birth: "",
      person_phone_number: "",
      person_email: "",
      person_address: "",
      person_state: "",
      person_city: "",
      person_zip_code: "",
      ssn: "",
      person_relationship_title: "",
      person_ownership_percentage: 25,

      // person_relationship_type: "",
      // Company data

      company_name: "",
      mcc: "",
      company_phone_no: "",
      company_phone_no_temp: "",
      company_address: "",
      company_state: "",
      company_city: "",
      company_zip_code: "",
      business_profile_url: "",
      product_description: "",
      company_tax_id: "",
      company_vat_id: "",

      //Bank details
      bank_account_name: user.bank_account_name ? user.bank_account_name : "",
      bank_account_number: user.bank_account_number
        ? user.bank_account_number
        : "",
      bank_account_type: user.bank_account_type ? user.bank_account_type : "",
      routing_number: user.routing_number ? user.routing_number : "",
      upload_document_type: "passport",
      upload_document_front: "",
      account_agreement: false,
      mccList: [],
      submitting: false,
      errorDate: "",
      errorEmail: "",
      success: false,
      error: false,
      message: false,
      submitting: false
    };
  }

  componentDidMount() {
    fetchMcc().then(res => {
      this.setState({ mccList: res.data.mcc });
    });
    fetchStripeDetail().then(res => {
      if (res.data.details) {
        const { user } = this.props;
        this.setState({
          business_profile_url: res.data.details.business_profile_url,
          product_description: res.data.details.product_description,
          mcc: res.data.details.mcc,
          business_profile_name: res.data.details.business_profile_name,
          business_profile_url: res.data.details.business_profile_url,
          ownership_type: res.data.details.ownership_type,
          person_first_name: res.data.details.person_first_name,
          person_last_name: res.data.details.person_last_name,
          person_address: res.data.details.person_address,
          person_city: res.data.details.person_city,
          person_state: res.data.details.person_state,
          person_zip_code: res.data.details.person_zip_code,
          person_email: res.data.details.person_email,
          person_phone_number: res.data.details.person_phone_number,
          person_phone_number_temp: res.data.details.person_phone_number,
          person_date_of_birth: moment(
            res.data.details.person_date_of_birth
          ).format("MM-DD-YYYY"),
          person_relationship_title: res.data.details.person_relationship_title,
          person_relationship_type: res.data.details.person_relationship_type,
          person_ownership_percentage:
            res.data.details.person_ownership_percentage,
          company_name: res.data.details.company_name,
          company_address: res.data.details.company_address,
          company_city: res.data.details.company_city,
          company_state: res.data.details.company_state,
          company_zip_code: res.data.details.company_zip_code,
          company_tax_id: res.data.details.company_tax_id,
          company_vat_id: res.data.details.company_vat_id,
          company_phone_no: res.data.details.company_phone_no,
          company_phone_no_temp: res.data.details.company_phone_no,
          bank_account_name: res.data.details.bank_account_name,
          bank_account_number: res.data.details.bank_account_number,
          bank_account_type: res.data.details.bank_account_type,
          routing_number: res.data.details.routing_number,
          account_agreement: res.data.details.account_agreement
        });
      }
    });
  }

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

  handleOwnershipType = target => {
    const { user } = this.props;
    this.setState({ ownership_type: target }, () => {
      if (target == "owner") {
        this.setState({
          person_first_name: user.first_name,
          person_last_name: user.last_name,
          person_date_of_birth: moment(
            user.date_of_birth,
            "YYYY-MM-DD"
          ).isValid()
            ? moment(user.date_of_birth, "YYYY-MM-DD").format("MM-DD-YYYY")
            : "",
          person_phone_number: user.phone_number,
          person_email: user.email,
          person_address: user.street_address,
          person_city: user.city,
          person_zip_code: user.zip_code,
          person_state: user.state
        });
      } else {
        this.setState({
          person_first_name: "",
          person_last_name: "",
          person_date_of_birth: "",
          person_phone_number: "",
          person_email: "",
          person_address: "",
          person_city: "",
          person_zip_code: "",
          person_state: ""
        });
      }
    });
  };

  encript = data => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(process.env.REACT_APP_RSA_PUBLIC_KEY);
    var encrypted = encrypt.encrypt(data);
    return encrypted;
  };

  handleInputRange = data => {
    if (data.target.value >= 0 && data.target.value <= 100) {
      this.setState({
        person_ownership_percentage: parseInt(data.target.value)
      });
    }
  };

  keyDownHandle = e => {
    if (e.which == 43 || e.which == 45) {
      e.preventDefault();
    }
  };

  handleSubmit = () => {
    this.setState({ submitting: true });
    const { editView } = this.props;
    const {
      ownership_type,
      person_first_name,
      person_last_name,
      person_date_of_birth,
      person_phone_number,
      person_email,
      person_address,
      person_state,
      person_city,
      person_zip_code,
      person_relationship_title,
      ssn,
      mcc,
      business_profile_url,
      company_name,
      company_address,
      company_state,
      company_phone_no,
      person_ownership_percentage,
      company_city,
      company_zip_code,
      product_description,
      company_tax_id,
      company_vat_id,
      bank_account_type,
      bank_account_name,
      bank_account_number,
      routing_number,
      account_agreement,
      upload_document_type,
      account_type,
      upload_document_front
    } = this.state;

    if (!editView) {
      if (!ownership_type) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_first_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_last_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_date_of_birth) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!this.isValidDate(person_date_of_birth)) {
        this.setState(
          { errorDate: "Invalid Date", error: true, submitting: false },
          state => {
            setTimeout(() => {
              this.setState({ errorDate: "", error: false });
            }, 5000);
          }
        );
        return false;
      } else if (!person_phone_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_email) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        this.setState({ error: true, submitting: false });
        this.setState({ errorEmail: "Invalid mail" }, state => {
          setTimeout(() => {
            this.setState({ errorEmail: "" });
          }, 5000);
        });
        return false;
      } else if (!person_address) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_state) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_city) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_zip_code) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_relationship_title) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!ssn) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!business_profile_url) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_address) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_city) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_state) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_zip_code) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!product_description) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_tax_id) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_vat_id) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_type) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!routing_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!company_phone_no) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!person_ownership_percentage) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!account_agreement) {
        this.setState({ error: true, submitting: false });
        return false;
      }
    } else {
      if (!account_type) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!routing_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!account_agreement) {
        this.setState({ error: true, submitting: false });
        return false;
      }
    }

    let dob = null;

    if (
      moment(person_date_of_birth, "MM-DD-YYYY").format("MM-DD-YYYY") ==
      person_date_of_birth
    ) {
      dob = moment(person_date_of_birth, "MM-DD-YYYY").format("YYYY-MM-DD");
    } else if (
      moment(person_date_of_birth, "YYYY-MM-DD").format("YYYY-MM-DD") ==
      person_date_of_birth
    ) {
      dob = moment(person_date_of_birth, "YYYY-MM-DD").format("YYYY-MM-DD");
    }

    let newSsn = ssn
      .replace("-", "")
      .replace("-", "")
      .replace("-", "");

    let person_relationship_type = "owner";

    const obj = {
      account_type,
      upload_document_type,
      mcc,
      product_description,
      ownership_type,
      person_first_name,
      person_last_name,
      person_address,
      person_city,
      person_state,
      person_zip_code,
      person_email,
      person_phone_number,
      person_relationship_title,
      person_relationship_type,
      person_ownership_percentage,
      company_name,
      company_address,
      company_city,
      company_state,
      company_zip_code,
      company_tax_id,
      company_vat_id,
      company_phone_no,
      business_profile_url,
      bank_account_name,
      bank_account_number,
      bank_account_type,
      routing_number,
      upload_document_front,
      account_agreement
    };

    if (dob) {
      obj.person_date_of_birth = dob;
    }

    if (newSsn) {
      obj.ssn = this.encript(newSsn);
    }

    if (editView) {
      editOwnerAccountData(obj)
        .then(res => {
          this.setState({ submitting: false });
          if (this.props.loadNext) {
            this.props.loadNext();
            return false;
          }

          this.setState(
            { success: true, message: res.data.message, submitting: false },
            () => {
              setTimeout(() => {
                this.setState({ success: false, message: "" });
                this.props.submitted();
              }, 5000);
            }
          );
        })
        .catch(e => {
          if (e.response && e.response.data) {
            this.setState(
              {
                error: true,
                message: e.response.data.message,
                submitting: false
              },
              () => {
                setTimeout(() => {
                  this.setState({ error: false, message: "" });
                }, 5000);
              }
            );
          }
        });
    } else {
      postOwnersAccountData(obj)
        .then(res => {
          this.setState({ submitting: false });
          if (this.props.loadNext) {
            this.props.loadNext();
            return false;
          }

          this.setState(
            { success: true, message: res.data.message, submitting: false },
            () => {
              setTimeout(() => {
                this.setState({ success: false, message: "" });
                this.props.submitted();
              }, 3000);
            }
          );
        })
        .catch(e => {
          if (e.response && e.response.data) {
            this.setState(
              {
                error: true,
                message: e.response.data.message,
                submitting: false
              },
              () => {
                setTimeout(() => {
                  this.setState({ error: false, message: "" });
                }, 5000);
              }
            );
          }
        });
    }
  };

  render() {
    const {
      ownership_type,
      person_first_name,
      person_last_name,
      person_date_of_birth,
      person_phone_number,
      person_phone_number_temp,
      person_email,
      person_address,
      person_state,
      person_city,
      person_zip_code,
      person_relationship_title,
      ssn,
      mcc,
      business_profile_url,
      company_name,
      company_address,
      company_state,
      company_phone_no,
      company_phone_no_temp,
      person_ownership_percentage,
      company_city,
      company_zip_code,
      product_description,
      company_tax_id,
      company_vat_id,
      bank_account_type,
      bank_account_name,
      bank_account_number,
      routing_number,
      account_agreement,
      mccList,
      submitting,
      errorEmail,
      errorDate,
      success,
      error,
      message
    } = this.state;

    const { loadPrevious, page, usStates, editView, user } = this.props;
    console.log("person_phone_number", person_phone_number);
    console.log("person_phone_number_temp", person_phone_number_temp);

    return (
      <div className="Prof_owner_section">
        <div>
          <div className="Prof_owner_subhead">
            Are you the owner/director/shareholder of this company?
          </div>

          <Radio.Group
            onChange={({ target }) => {
              this.handleOwnershipType(target.value);
            }}
            value={ownership_type}
            className="Prof_owner_radiogroup sub"
          >
            <Radio value={OWNERSHIP_TYPE_IS_OWNER}>Yes, I am</Radio>
            <Radio value={OWNERSHIP_TYPE_IS_OTHER}>
              No, i am filling on behalf
            </Radio>
          </Radio.Group>
          {error && !ownership_type ? (
            <div className="Prof_error_txt">
              Please select the ownership type
            </div>
          ) : (
            ""
          )}

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !person_first_name ? "error" : ""}
                placeholder="First name *"
                value={person_first_name}
                onChange={e =>
                  this.setState({ person_first_name: e.target.value })
                }
                error={error && !person_first_name ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <TextInput
                className={submitting && !person_last_name ? "error" : ""}
                placeholder="Last name *"
                value={person_last_name}
                onChange={e =>
                  this.setState({ person_last_name: e.target.value })
                }
                error={error && !person_last_name ? "Required" : ""}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="text_field">
                <label>Date of birth *</label>
                <div className="date-text-input">
                  <DateTextInput
                    className={
                      submitting && !ssn
                        ? "mask-textfield error"
                        : "mask-textfield"
                    }
                    placeholder="MM-DD-YYYYY"
                    type="text"
                    name="dateOfBirth"
                    value={person_date_of_birth}
                    validate={() => ({})}
                    onChange={e =>
                      this.setState({ person_date_of_birth: e.target.value })
                    }
                  />
                  {error && !person_date_of_birth ? (
                    <div className="Prof_error_txt">Required</div>
                  ) : (
                    ""
                  )}
                  {error && errorDate ? (
                    <div className="Prof_error_txt">{errorDate}</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="text_field">
                <label>
                  Phone number
                  <span className="fields-requred">*</span>
                </label>
                <div className="teleinput-wrapper">
                  <TelInput
                    initalNumber={
                      ownership_type == "owner"
                        ? user.phone_number
                          ? user.phone_number
                          : " "
                        : person_phone_number_temp
                    }
                    value={person_phone_number ? person_phone_number : ""}
                    onChange={e => this.setState({ person_phone_number: e })}
                    label={false}
                    onBlurValidator={() => ({})}
                    errorFnc={() => {
                      if (error && !person_phone_number) {
                        return "Required";
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <TextInput
                className={submitting && !person_email ? "error" : ""}
                placeholder="Email *"
                value={person_email}
                onChange={e => this.setState({ person_email: e.target.value })}
                error={error && !person_email ? "Required" : ""}
              />
              {error && errorEmail ? (
                <div className="Prof_error_txt">{errorEmail}</div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !person_address ? "error" : ""}
                placeholder="Street address *"
                value={person_address}
                onChange={e =>
                  this.setState({ person_address: e.target.value })
                }
                error={error && !person_address ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <div className="text_field">
                {person_state && <label>State *</label>}
                <Select
                  className={submitting && !person_state ? "error" : ""}
                  placeholder="State *"
                  value={person_state ? person_state : undefined}
                  onChange={person_state => this.setState({ person_state })}
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
                {error && !person_state ? (
                  <div className="Prof_error_txt">Required</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !person_city ? "error" : ""}
                placeholder="City *"
                value={person_city}
                onChange={e => this.setState({ person_city: e.target.value })}
                error={error && !person_city ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <TextInput
                type="number"
                className={submitting && !person_zip_code ? "error" : ""}
                placeholder="Zip code *"
                value={person_zip_code}
                onChange={e =>
                  this.setState({ person_zip_code: e.target.value })
                }
                error={error && !person_zip_code ? "Required" : ""}
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="row">
            {!editView ? (
              <div className="col-md-6">
                <div className="text_field">
                  <label>Social security no (SSN) *</label>
                  <div className="date-text-input">
                    <MaskedTextInput
                      mask={[
                        /\d/,
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/
                      ]}
                      placeholder="000-00-0000"
                      guide={true}
                      value={ssn}
                      onChange={e => this.setState({ ssn: e.target.value })}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onFocus={() => ({})}
                      onBlur={() => ({})}
                      className={
                        submitting && !ssn
                          ? "mask-textfield error"
                          : "mask-textfield"
                      }
                    />
                  </div>
                  {error && !ssn ? (
                    <div className="Prof_error_txt">Required</div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <Fragment />
            )}

            <div className="col-md-6">
              <TextInput
                className={
                  submitting && !person_relationship_title ? "error" : ""
                }
                placeholder="Position in the organization *"
                value={person_relationship_title}
                onChange={e =>
                  this.setState({ person_relationship_title: e.target.value })
                }
                error={error && !person_relationship_title ? "Required" : ""}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="text_field">
                <label>Percentage of the ownership *</label>
                <div className="row">
                  <div className="col-md-9">
                    <Slider
                      min={0}
                      max={100}
                      onChange={person_ownership_percentage =>
                        this.setState({ person_ownership_percentage })
                      }
                      value={
                        typeof person_ownership_percentage === "number"
                          ? person_ownership_percentage
                          : 0
                      }
                      defaultValue={0}
                      tipFormatter={null}
                      className="Prof_slider"
                    />
                  </div>
                  <div className="col-md-3 col-xs-3">
                    <Input
                      value={
                        person_ownership_percentage
                          ? person_ownership_percentage
                          : 0
                      }
                      onChange={e => this.handleInputRange(e)}
                      className="Prof_precentage_input"
                    />
                    <span className="Prof_float_precentage">%</span>
                  </div>
                </div>
                {error && !person_ownership_percentage ? (
                  <div className="Prof_error_txt">Required</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="Prof_dash_separater"></hr>

        <div>
          <div className="Prof_owner_subhead">Company details</div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !company_name ? "error" : ""}
                placeholder="Company name *"
                value={company_name}
                onChange={e => this.setState({ company_name: e.target.value })}
                error={error && !company_name ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <div className="text_field">
                {mcc && <label>Merchant Category Code (MCC)</label>}
                <Select
                  className={submitting && !mcc ? "error" : ""}
                  placeholder="Merchant Category Code (MCC) *"
                  value={mcc ? mcc : undefined}
                  onChange={mcc => this.setState({ mcc })}
                >
                  {mccList.map(({ id, name }, key) => {
                    return (
                      <Option value={id} key={key}>
                        {name}
                      </Option>
                    );
                  })}
                </Select>
                {error && !mcc ? (
                  <div className="Prof_error_txt">Required</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="text_field">
                <label>
                  Phone number
                  <span className="fields-requred">*</span>
                </label>
                <div className="teleinput-wrapper">
                  <TelInput
                    className={submitting && !company_phone_no ? "error" : ""}
                    initalNumber={
                      company_phone_no_temp ? company_phone_no_temp : ""
                    }
                    value={company_phone_no ? company_phone_no : ""}
                    onChange={e => this.setState({ company_phone_no: e })}
                    label={false}
                    onBlurValidator={() => ({})}
                    errorFnc={() => {
                      if (error && !company_phone_no) {
                        return "Required";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !company_address ? "error" : ""}
                placeholder="Company street address *"
                value={company_address}
                onChange={e =>
                  this.setState({ company_address: e.target.value })
                }
                error={error && !company_address ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <div className="text_field">
                {company_state && <label>Company state *</label>}
                <Select
                  className={submitting && !company_state ? "error" : ""}
                  placeholder="Company state *"
                  value={company_state ? company_state : undefined}
                  onChange={company_state => this.setState({ company_state })}
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
                {error && !company_state ? (
                  <div className="Prof_error_txt">Required</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !company_city ? "error" : ""}
                placeholder="Company city *"
                value={company_city}
                onChange={e => this.setState({ company_city: e.target.value })}
                error={error && !company_city ? "Required" : ""}
              />
            </div>

            <div className="col-md-6">
              <TextInput
                type="number"
                className={submitting && !company_zip_code ? "error" : ""}
                placeholder="Zip code *"
                value={company_zip_code}
                onChange={e =>
                  this.setState({ company_zip_code: e.target.value })
                }
                error={error && !company_zip_code ? "Required" : ""}
                inputMode="numeric"
                onKeyPress={e => this.keyDownHandle(e)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !business_profile_url ? "error" : ""}
                placeholder="Business website URL *"
                value={business_profile_url}
                onChange={e =>
                  this.setState({ business_profile_url: e.target.value })
                }
                error={error && !business_profile_url ? "Required" : ""}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <TextArea
                className={submitting && !product_description ? "error" : ""}
                autosize={{ minRows: 1, maxRows: 6 }}
                placeholder="Short description about company *"
                value={product_description}
                onChange={e =>
                  this.setState({
                    product_description: e.target.value
                  })
                }
                error={error && !product_description ? "Required" : ""}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                className={submitting && !company_tax_id ? "error" : ""}
                placeholder="Tax ID (Business ID) *"
                value={company_tax_id}
                onChange={e =>
                  this.setState({ company_tax_id: e.target.value })
                }
                error={error && !company_tax_id ? "Required" : ""}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                className={submitting && !company_vat_id ? "error" : ""}
                placeholder="VAT ID  *"
                value={company_vat_id}
                onChange={e =>
                  this.setState({ company_vat_id: e.target.value })
                }
                error={error && !company_vat_id ? "Required" : ""}
              />
            </div>
          </div>
        </div>

        <hr className="Prof_dash_separater"></hr>

        <div>
          <div className="Prof_owner_subhead">Bank details</div>

          <div className="row">
            <div className="col-md-6">
              <div className="text_field">
                {bank_account_type && <label>Account Type *</label>}
                <Select
                  className={submitting && !bank_account_type ? "error" : ""}
                  placeholder="Account Type *"
                  value={bank_account_type ? bank_account_type : undefined}
                  onChange={bank_account_type =>
                    this.setState({ bank_account_type })
                  }
                >
                  {BANK_ACCOUNT_TYPES.map(({ id, value }, key) => {
                    return (
                      <Option value={id} key={key}>
                        {value}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              {error && !bank_account_type ? (
                <div className="Prof_error_txt">Required</div>
              ) : (
                ""
              )}
            </div>

            <div className="col-md-6">
              <TextInput
                className={submitting && !bank_account_name ? "error" : ""}
                placeholder="Account name *"
                value={bank_account_name}
                onChange={e =>
                  this.setState({ bank_account_name: e.target.value })
                }
                error={error && !bank_account_name ? "Required" : ""}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <TextInput
                type="number"
                className={submitting && !bank_account_number ? "error" : ""}
                placeholder="Bank account number *"
                value={bank_account_number}
                onChange={e =>
                  this.setState({ bank_account_number: e.target.value })
                }
                error={error && !bank_account_number ? "Required" : ""}
                inputMode="numeric"
                onKeyPress={e => this.keyDownHandle(e)}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                type="number"
                className={submitting && !routing_number ? "error" : ""}
                placeholder="Routing number *"
                value={routing_number}
                onChange={e =>
                  this.setState({ routing_number: e.target.value })
                }
                error={error && !routing_number ? "Required" : ""}
                inputMode="numeric"
                onKeyPress={e => this.keyDownHandle(e)}
              />
            </div>
          </div>
        </div>
        {!editView ? (
          <div>
            <div className="Prof_ownerphoto_wrapper flex-container">
              <Upload
                key={1}
                initialFiles={[]}
                type="corporate"
                onChange={data =>
                  this.setState({ upload_document_front: data.id })
                }
                upload_file_type="passport"
                thumbTitle="Attach business verify document"
                handleError={error => {
                  this.setState(
                    {
                      error: true,
                      message: error
                    },
                    () => {
                      setTimeout(() => {
                        this.setState({ error: false, message: "" });
                      }, 5000);
                    }
                  );
                }}
              />
            </div>

            <div className="info-message-box">
              <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
              <p>
                Attachments needs to be a color image (smaller than 8,000px by
                8,000px), in JPG or PNG format
              </p>
            </div>
          </div>
        ) : (
          <Fragment />
        )}

        <hr className="Prof_dash_separater top_margin"></hr>

        <div className="row">
          <div className="col-md-12">
            <Checkbox
              onChange={({ target }) =>
                this.setState({ account_agreement: target.checked })
              }
              className="Prof_owner_checkbox"
              checked={account_agreement}
            >
              By registering your account, you agree to{" "}
              <a
                className="fonts_medium"
                href="/terms-and-conditions"
                target="_blank"
              >
                RYDE terms and conditions{" "}
              </a>
              and the
              <a
                className="fonts_medium"
                href="https://stripe.com/connect-account/legal"
                target="_blank"
              >
                {" "}
                Stripe Connected Account Agreement.
              </a>
            </Checkbox>
          </div>
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

        {/* -- Action buttons in Profile - Start -- */}
        {page == "profile" ? (
          <div className="row">
            <div className="col-sm-12">
              <div className="Prof_btn_box">
                <button
                  className={`Prof_btn ${
                    !account_agreement ? "Prof_btn_disabled" : "Prof_btn_submit"
                  }`}
                  onClick={() => this.handleSubmit()}
                >
                  {submitting === true && !error && (
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
        ) : (
          <Fragment>
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
                    className={`Prof_btn ${
                      !account_agreement
                        ? "Prof_btn_disabled"
                        : "Prof_btn_submit"
                    }`}
                    onClick={() => this.handleSubmit()}
                    disabled={this.state.submitting === true}
                  >
                    {submitting === true && (
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
          </Fragment>
        )}
        {/* -- Action buttons in Profile - End-- */}
      </div>
    );
  }
}

export default CorporateAccount;
