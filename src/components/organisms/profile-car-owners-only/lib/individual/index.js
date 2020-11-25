import React, { Component, Fragment } from "react";
import { Input, Radio, Checkbox, Select } from "antd";
import MaskedTextInput from "react-text-mask";
import JSEncrypt from "js-encript";
import Upload from "../file";
import {
  fetchMcc,
  postOwnersAccountData,
  fetchStripeDetail,
  editOwnerAccountData
} from "../../../../../api/owners";
import { BANK_ACCOUNT_TYPES } from "../../../../../consts/consts";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";

const DRIVER_LICENSE = 1;
const PASSPORT = 2;
const { Option } = Select;

const TextArea = props => {
  const { value, placeholder, error } = props;
  return (
    <div className="text_field">
      {value && <label>{placeholder}</label>}
      <Input.TextArea {...props} />
      {error && <div className="Prof_error_txt">{error}</div>}
    </div>
  );
};

const TextInput = props => {
  const { value, placeholder, error } = props;
  return (
    <div className="text_field">
      {value && <label>{placeholder}</label>}
      <Input {...props} />
      {error && <div className="Prof_error_txt">{error}</div>}
    </div>
  );
};
class IndividualAccount extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;

    this.state = {
      bank_account_name: user.bank_account_name ? user.bank_account_name : "",
      bank_account_number: user.bank_account_number
        ? user.bank_account_number
        : "",
      routing_number: user.routing_number ? user.routing_number : "",
      bank_account_type: user.bank_account_type ? user.bank_account_type : "",
      business_profile_url: "",
      product_description: "",
      ssn: "",
      mcc: "",
      upload_document_type: "",
      account_agreement: "",
      uploadPhoto: DRIVER_LICENSE,
      submitting: false,
      account_type: "individual",
      upload_document_front: "",
      upload_document_back: "",
      error: false,
      success: false,
      message: "",
      mccList: [],
      mmcName: "",
      submitting: false
    };
  }

  componentDidMount() {
    fetchMcc().then(res => {
      this.setState({ mccList: res.data.mcc });
    });
    fetchStripeDetail().then(res => {
      if (res.data.details) {
        this.setState({
          business_profile_url: res.data.details.business_profile_url,
          product_description: res.data.details.product_description,
          mcc: res.data.details.mcc,
          bank_account_name: res.data.details.bank_account_name,
          bank_account_number: res.data.details.bank_account_number,
          bank_account_type: res.data.details.bank_account_type,
          routing_number: res.data.details.routing_number
        });
      }
    });
  }

  encript = data => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(process.env.REACT_APP_RSA_PUBLIC_KEY);
    var encrypted = encrypt.encrypt(data);
    return encrypted;
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
      account_type,
      bank_account_name,
      bank_account_number,
      bank_account_type,
      routing_number,
      business_profile_url,
      product_description,
      ssn,
      account_agreement,
      upload_document_front,
      upload_document_back,
      uploadPhoto,
      mcc
    } = this.state;

    if (!editView) {
      if (!bank_account_name) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!bank_account_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!routing_number) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!business_profile_url) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!mcc) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!product_description) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!ssn) {
        this.setState({ error: true, submitting: false });
        return false;
      } else if (!uploadPhoto) {
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

    let newSsn = ssn
      .replace("-", "")
      .replace("-", "")
      .replace("-", "");

    const data = {
      account_type,
      bank_account_name,
      bank_account_number,
      bank_account_type,
      routing_number,
      business_profile_url,
      product_description,
      mcc,
      account_agreement
    };

    if (uploadPhoto == DRIVER_LICENSE) {
      data.upload_document_type = "driver_license";
      data.upload_document_front = upload_document_front;
      data.upload_document_back = upload_document_back;
    } else {
      data.upload_document_type = "passport";
      data.upload_document_front = upload_document_front;
    }

    if (newSsn) {
      data.ssn = this.encript(newSsn);
    }

    if (editView) {
      editOwnerAccountData(data)
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
      postOwnersAccountData(data)
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
    }
  };

  render() {
    const { loadPrevious, page, editView } = this.props;
    const {
      bank_account_name,
      bank_account_number,
      routing_number,
      business_profile_url,
      product_description,
      ssn,
      uploadPhoto,
      submitting,
      success,
      error,
      message,
      mccList,
      mcc,
      account_agreement,
      bank_account_type
    } = this.state;

    return (
      <div className="Prof_owner_section">
        <div className="row">
          <div className="col-md-6">
            <div className="text_field">
              {bank_account_type && <label>Bank Account Type *</label>}
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
              {submitting && !bank_account_type ? (
                <div className="Prof_error_txt">Required</div>
              ) : (
                ""
              )}
            </div>
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
              onChange={e => this.setState({ routing_number: e.target.value })}
              error={error && !routing_number ? "Required" : ""}
              inputMode="numeric"
              onKeyPress={e => this.keyDownHandle(e)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {!editView ? (
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
                    className={
                      submitting && !ssn
                        ? "mask-textfield error"
                        : "mask-textfield"
                    }
                    placeholder="000-00-0000"
                    guide={true}
                    value={ssn}
                    onChange={e => this.setState({ ssn: e.target.value })}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onFocus={() => ({})}
                    onBlur={() => ({})}
                  />
                </div>
                {error && !ssn ? (
                  <div className="Prof_error_txt">Required</div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Fragment />
            )}
          </div>

          <div className="col-md-6">
            <div className="text_field">
              {mcc && <label>Merchant Category Code (MCC)</label>}
              <Select
                className={submitting && !mcc ? "error" : ""}
                value={mcc ? mcc : undefined}
                placeholder="Merchant Category Code (MCC) *"
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
            <TextInput
              className={submitting && !business_profile_url ? "error" : ""}
              placeholder="Business website URL *"
              value={business_profile_url}
              onChange={e =>
                this.setState({ business_profile_url: e.target.value })
              }
              error={submitting && !business_profile_url ? "Required" : ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <TextArea
              className={submitting && !product_description ? "error" : ""}
              placeholder="Short description about your business *"
              value={product_description}
              onChange={e =>
                this.setState({ product_description: e.target.value })
              }
              autosize={{ minRows: 1, maxRows: 6 }}
              error={error && !product_description ? "Required" : ""}
            />
          </div>
        </div>

        {!editView ? (
          <Fragment>
            <hr className="Prof_dash_separater" />

            <div>
              <div>
                <Radio.Group
                  onChange={e => this.setState({ uploadPhoto: e.target.value })}
                  value={uploadPhoto}
                  className="Prof_owner_radiogroup"
                >
                  <Radio value={DRIVER_LICENSE}>
                    Upload driver license photos
                  </Radio>
                  <Radio value={PASSPORT}>Upload passport photo</Radio>
                </Radio.Group>
              </div>
              {uploadPhoto == DRIVER_LICENSE ? (
                <div
                  className={
                    page == "profile"
                      ? "Prof_ownerphoto_wrapper flex-container profile_class"
                      : "Prof_ownerphoto_wrapper flex-container listing_class"
                  }
                >
                  <Upload
                    key={1}
                    initialFiles={[]}
                    type="individual"
                    onChange={driving_license_photos =>
                      this.setState({
                        upload_document_front: driving_license_photos.id
                      })
                    }
                    folder={``}
                    thumbTitle="Upload front side"
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
                  <Upload
                    key={2}
                    initialFiles={[]}
                    type="individual"
                    onChange={driving_license_photos =>
                      this.setState({
                        upload_document_back: driving_license_photos.id
                      })
                    }
                    folder={``}
                    thumbTitle="Upload back side"
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
              ) : (
                <div
                  className={
                    page == "profile"
                      ? "Prof_ownerphoto_wrapper flex-container profile_class"
                      : "Prof_ownerphoto_wrapper flex-container listing_class"
                  }
                >
                  <Upload
                    key={3}
                    initialFiles={[]}
                    type="individual"
                    onChange={driving_license_photos =>
                      this.setState({
                        upload_document_front: driving_license_photos.id
                      })
                    }
                    folder={``}
                    thumbTitle="Upload image"
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
              )}

              <div className="info-message-box">
                <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
                <p>
                  Attachments needs to be a color image (smaller than 8,000px by
                  8,000px), in JPG or PNG format
                </p>
              </div>
            </div>
          </Fragment>
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
                  onClick={this.handleSubmit}
                  className={`Prof_btn ${
                    !account_agreement ? "Prof_btn_disabled" : "Prof_btn_submit"
                  }`}
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
                    onClick={this.handleSubmit}
                    disabled={submitting == true}
                  >
                    {submitting == true && (
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
        {/* -- Action buttons in car listing - End-- */}
      </div>
    );
  }
}

export default IndividualAccount;
