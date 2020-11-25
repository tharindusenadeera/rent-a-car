import React, { Component } from "react";
import { connect } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { Steps, Switch, Radio, Checkbox, Select, Input } from "antd";
import { fetchBookings } from "../../actions/SupportCenterActions";
import { toggleDrawer } from "../../actions/CommenActions";
import UploadAttachments from "./UploadAttachments";
import SuccessMessage from "./SuccessMessage";
import "antd/lib/steps/style/index.css";
import "antd/lib/radio/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/switch/style/index.css";
import "antd/lib/select/style/index.css";

const { TextArea } = Input;

const Step = Steps.Step;

const steps = [
  {
    step: "1"
  },
  {
    step: "2"
  },
  {
    step: "3"
  }
];

const RadioGroup = Radio.Group;

const Option = Select.Option;

class ReportDamageForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      booking_id: "",
      location_status: false,
      location: "",
      lat: "",
      lng: "",
      incident_status: false,
      incident: "",
      third_party_status: null,
      third_party: "",
      estimate_status: false,
      estimate_amount: "",
      estimate_type: null,
      notify_guest_status: false,
      resolve_with_guest_status: null,
      declare_status: false,
      photos: [],
      isUploading: false,
      errObj: {}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchBookings("damage_report"));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.successDialog) {
      this.setState({
        errObj: {},
        booking_id: "",
        location_status: false,
        location: "",
        lat: "",
        lng: "",
        incident_status: false,
        incident: "",
        third_party_status: null,
        third_party: "",
        estimate_status: false,
        estimate_amount: "",
        estimate_type: null,
        notify_guest_status: false,
        resolve_with_guest_status: null,
        declare_status: false,
        photos: [],
        step: 0
      });
    }
  }

  handleLocationSelect = location => {
    this.setState({ location });
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ lat: latLng.lat, lng: latLng.lng });
      })
      .catch(error => console.error("Error", error));
  };

  setLocationClass = isError => {
    let locationClass = {
      root: "",
      input: "SC_drawer_textfield_dmg",
      autocompleteContainer: "row expanded-location"
    };
    if (isError) {
      locationClass.input = "SC_drawer_textfield_dmg error";
      return locationClass;
    } else {
      return locationClass;
    }
  };

  onRadioChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  regexValidation(value) {
    var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
    return regex.test(value);
  }

  validateForm = () => {
    const {
      booking_id,
      incident_status,
      incident,
      third_party_status,
      step,
      location_status,
      location,
      lat,
      lng,
      estimate_status,
      estimate_amount,
      estimate_type,
      resolve_with_guest_status,
      isUploading,
      declare_status
    } = this.state;
    let errors = {};

    if (step === 0) {
      if (booking_id === "") {
        errors.booking_id = "Please select your trip!";
      }
      if (location_status === true && location === "") {
        errors.location = "Should not be empty!";
      }
      if (location_status === true && location && (!lat || !lng)) {
        errors.location = "Select valid location";
      }

      if (incident_status === true && incident === "") {
        errors.incident = "Should not be empty!";
      }
      if (third_party_status === null) {
        errors.third_party_status = "3rd party details required!";
      }
    }
    if (step === 1) {
      if (estimate_status === true) {
        if (estimate_amount < 1 || estimate_amount === "") {
          errors.estimate_amount = "Should not be empty!";
        }
        if (!this.regexValidation(estimate_amount)) {
          errors.estimate_amount = "Should be a number!";
        }
        if (parseFloat(estimate_amount) > 2500) {
          errors.estimate_amount = "Should be less than $2500!";
        }
        if (parseFloat(estimate_amount) < 1) {
          errors.estimate_amount = "Should be a valid amount";
        }
        if (estimate_type === null) {
          errors.estimate_type = "Estimated details should not be empty!";
        }
      }
      if (resolve_with_guest_status === null) {
        errors.resolve_with_guest_status = "Claim resolve details required!";
      }
    }
    if (step === 2) {
      if (isUploading) {
        errors.upload = "Please wait until upload is done!";
      }
      if (declare_status === false) {
        errors.declare_status = "Please declare all details are true!";
      }
    }
    this.setState({ errObj: errors });
    return errors;
  };

  validateUpload = file => {
    const { errObj } = this.state;
    let errors = {};

    if (file) {
      if (
        file.name
          .toLowerCase()
          .match(/\.(jpeg|jpg|png|pdf|doc|docx|xls|xlsx)$/) === null
      ) {
        errors.upload = "Invalid type of document!";
        this.setState({ errObj: Object.assign(errObj, errors) });
        return false;
      } else {
        delete errObj.upload;
        return true;
      }
    }
  };

  next = () => {
    let { step } = this.state;
    const errors = this.validateForm();
    if (!Object.keys(errors).length) {
      const next = step + 1;
      this.setState({ step: next });
    }
  };

  prev = () => {
    const step = this.state.step - 1;
    this.setState({ step });
  };

  handleSubmit = () => {
    const { createTicket } = this.props;
    const errors = this.validateForm();
    if (!Object.keys(errors).length) {
      const ticket = {
        type: "damage_report",
        booking_id: this.state.booking_id,
        location_status: this.state.location_status ? 1 : 0,
        location: this.state.location,
        latitude: this.state.lat,
        longitude: this.state.lng,
        incident_status: this.state.incident_status ? 1 : 0,
        incident: this.state.incident,
        third_party_status: this.state.third_party_status,
        third_party: this.state.third_party,
        estimate_status: this.state.estimate_status ? 1 : 0,
        estimate_amount: parseFloat(this.state.estimate_amount).toFixed(2),
        estimate_type: this.state.estimate_type,
        notify_guest_status: this.state.notify_guest_status ? 1 : 0,
        resolve_with_guest_status: this.state.resolve_with_guest_status,
        photos: this.state.photos
      };
      createTicket(ticket);
    }
  };

  handleIsUploading = val => {
    const { errObj } = this.state;
    if (!val) {
      delete errObj.upload;
    }
    this.setState({ isUploading: val });
  };

  render() {
    const {
      dispatch,
      isDrawerOpen,
      ticketBookings,
      uploadFile,
      message,
      successDialog,
      ticketId,
      submitting,

      handleCancel
    } = this.props;
    const { step, errObj } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    return (
      <div>
        {/* Drawer Content */}
        <div className="SC_drawer_header damage">
          <img src="/images/support-center/damage-icon.svg" />
          <div>Report damage</div>
        </div>

        {!successDialog ? (
          <div className="SC_drawer">
            <div className="SC_drawer_inner steps-outer">
              <Steps
                className="hidden-xs"
                size="default"
                direction="vertical"
                current={step}
              >
                {steps.map(item => (
                  <Step key={item.step} />
                ))}
              </Steps>

              <div className="steps-right-wrapper">
                {this.state.step === 0 && (
                  <div>
                    {/* Step 1 - Start */}
                    <div className="SC_drawer_box_title">
                      Tell us about the incident
                    </div>
                    <div className="incident-question-wrapper">
                      <Select
                        className={
                          errObj.booking_id
                            ? "SC_drawer_textfield_dmg error"
                            : "SC_drawer_textfield_dmg"
                        }
                        value={
                          this.state.booking_id === ""
                            ? "Select your trip *"
                            : this.state.booking_id
                        }
                        //style={{ float: screenLeft }}
                        onChange={booking_id => {
                          this.setState({ booking_id });
                          delete errObj.booking_id;
                        }}
                      >
                        {ticketBookings &&
                          ticketBookings.map((trip, index) => {
                            return (
                              <Option key={index} value={trip.id}>
                                {trip.name}
                              </Option>
                            );
                          })}
                      </Select>
                      {errObj.booking_id && (
                        <div className="GC_form_error">{errObj.booking_id}</div>
                      )}
                    </div>

                    {/* Location of the incident ? */}
                    <div className="incident-question-wrapper">
                      <div className="switch-inline">
                        <div className="question">
                          Location of the incident ?
                        </div>
                        <div className="switch">
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            checked={this.state.location_status}
                            onChange={checked => {
                              this.setState({
                                location_status: checked,
                                location: ""
                              });
                              delete errObj.location;
                            }}
                          />
                        </div>
                      </div>
                      {this.state.location_status && (
                        <div>
                          <PlacesAutocomplete
                            value={this.state.location}
                            onChange={location => {
                              this.setState({ location });
                              delete errObj.location;
                            }}
                            onSelect={this.handleLocationSelect}
                            searchOptions={{
                              location: new window.google.maps.LatLng(
                                34.0522,
                                -118.243
                              ),
                              radius: 2000,

                              componentRestrictions: {
                                country: "us"
                              }
                            }}
                          >
                            {({
                              getInputProps,
                              getSuggestionItemProps,
                              suggestions,
                              loading
                            }) => (
                              <div className="autocomplete-root">
                                <input
                                  {...getInputProps({
                                    placeholder: "Enter your location here*",
                                    className: errObj.location
                                      ? "SC_drawer_textfield_dmg error"
                                      : "SC_drawer_textfield_dmg"
                                  })}
                                />
                                <div className="autocomplete-dropdown-container">
                                  {loading && (
                                    <div className="load-icon">
                                      <img src="/images/img_loading.gif" />
                                      Loading ...
                                    </div>
                                  )}
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

                          {errObj.location && (
                            <div className="GC_form_error">
                              {errObj.location}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* How did the incident happen ? */}
                    <div className="incident-question-wrapper">
                      <div className="switch-inline">
                        <div className="question">
                          How did the incident happen ?
                        </div>
                        <div className="switch">
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            checked={this.state.incident_status}
                            onChange={checked => {
                              this.setState({
                                incident_status: checked,
                                incident: ""
                              });
                              delete errObj.incident;
                            }}
                          />
                        </div>
                      </div>
                      {this.state.incident_status && (
                        <div>
                          <TextArea
                            className={
                              errObj.incident
                                ? "SC_drawer_textfield_dmg error"
                                : "SC_drawer_textfield_dmg"
                            }
                            autosize={{ minRows: 1, maxRows: 10 }}
                            placeholder="Tell us about the incident  *"
                            value={this.state.incident}
                            onChange={e => {
                              this.setState({ incident: e.target.value });
                              delete errObj.incident;
                            }}
                          />
                          {errObj.incident && (
                            <div className="GC_form_error">
                              {errObj.incident}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Was there a 3rd party involved ? */}
                    <div className="incident-question-wrapper">
                      <div className="question">
                        Was there a 3rd party involved ?
                      </div>
                      <div className="radiobx">
                        <RadioGroup
                          onChange={e => {
                            this.onRadioChange(e);
                            delete errObj.third_party_status;
                          }}
                          value={this.state.third_party_status}
                        >
                          <Radio
                            id="third_party_status"
                            style={radioStyle}
                            value={1}
                          >
                            Yes
                          </Radio>
                          <Radio
                            id="third_party_status"
                            style={radioStyle}
                            value={0}
                          >
                            No
                          </Radio>
                          <Radio
                            id="third_party_status"
                            style={radioStyle}
                            value={2}
                          >
                            Don’t know
                          </Radio>
                        </RadioGroup>
                      </div>
                      {this.state.third_party_status === 1 && (
                        <div className="incident-question-wrapper">
                          <TextArea
                            className="SC_drawer_textfield_dmg"
                            autosize={{ minRows: 1, maxRows: 10 }}
                            placeholder="Please tell us their info"
                            value={this.state.third_party}
                            onChange={e =>
                              this.setState({ third_party: e.target.value })
                            }
                          />
                        </div>
                      )}
                      {errObj.third_party_status && (
                        <div className="GC_form_error">
                          {errObj.third_party_status}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {this.state.step === 1 && (
                  <div>
                    {/* Step 2 - Start */}
                    <div
                      className="SC_drawer_box_title"
                      style={{ marginBottom: "30px" }}
                    >
                      More information
                    </div>

                    {/* Do you have an estimate for damages ? */}
                    <div className="incident-question-wrapper">
                      <div className="switch-inline">
                        <div className="question">
                          Do you have an estimate for damages ?
                        </div>
                        <div className="switch">
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            checked={this.state.estimate_status}
                            onChange={checked => {
                              this.setState({
                                estimate_status: checked,
                                estimate_amount: ""
                              });
                              delete errObj.estimate_amount;
                              delete errObj.estimate_type;
                            }}
                          />
                        </div>
                      </div>
                      {this.state.estimate_status && (
                        <div>
                          <Input
                            className={
                              errObj.estimate_amount
                                ? "SC_drawer_textfield_dmg error"
                                : "SC_drawer_textfield_dmg"
                            }
                            placeholder="Estimated amount"
                            pattern="^-?[0-9]\d*\.?\d*$"
                            type="text"
                            value={this.state.estimate_amount}
                            onChange={e => {
                              const estimate_amount = e.target.validity.valid
                                ? e.target.value
                                : this.state.estimate_amount;
                              this.setState({
                                estimate_amount
                              });
                              delete errObj.estimate_amount;
                            }}
                          />
                          {errObj.estimate_amount && (
                            <div className="GC_form_error">
                              {errObj.estimate_amount}
                            </div>
                          )}
                        </div>
                      )}
                      {this.state.estimate_status && (
                        <div style={{ marginTop: "30px" }}>
                          <div className="question">How was it estimated ?</div>
                          <div className="radiobx">
                            <RadioGroup
                              onChange={e => {
                                this.onRadioChange(e);
                                delete errObj.estimate_type;
                              }}
                              value={this.state.estimate_type}
                            >
                              <Radio
                                id="estimate_type"
                                style={radioStyle}
                                value={1}
                              >
                                Estimated by a body shop
                              </Radio>
                              <Radio
                                id="estimate_type"
                                style={radioStyle}
                                value={2}
                              >
                                Own experience
                              </Radio>
                              <Radio
                                id="estimate_type"
                                style={radioStyle}
                                value={3}
                              >
                                An assumption
                              </Radio>
                            </RadioGroup>
                          </div>
                          {errObj.estimate_type && (
                            <div className="GC_form_error">
                              {errObj.estimate_type}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Did you notify the guest about damages ? */}
                    <div className="incident-question-wrapper">
                      <div className="switch-inline">
                        <div className="question">
                          Did you notify the guest about damages ?
                        </div>
                        <div className="switch">
                          <Switch
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            checked={this.state.notify_guest_status}
                            onChange={checked =>
                              this.setState({ notify_guest_status: checked })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="incident-question-wrapper">
                      <div className="question">
                        Do you like to resolve the claim directly with the guest
                        ?
                      </div>
                      <div className="radiobx">
                        <RadioGroup
                          onChange={e => {
                            this.onRadioChange(e);
                            delete errObj.resolve_with_guest_status;
                          }}
                          value={this.state.resolve_with_guest_status}
                        >
                          <Radio
                            id="resolve_with_guest_status"
                            style={radioStyle}
                            value={1}
                          >
                            Yes
                          </Radio>
                          <Radio
                            id="resolve_with_guest_status"
                            style={radioStyle}
                            value={0}
                            className="SC_drawer_label-custom-a"
                          >
                            <span className="txt">
                              No, I want RYDE claims team to help me to get this
                              resolved
                            </span>
                          </Radio>
                        </RadioGroup>
                      </div>
                      {errObj.resolve_with_guest_status && (
                        <div className="GC_form_error">
                          {errObj.resolve_with_guest_status}
                        </div>
                      )}
                    </div>

                    {/* Step 2 - End */}
                  </div>
                )}

                {this.state.step === 2 && (
                  <div>
                    {/* Step 3 - Start */}
                    <div
                      className="SC_drawer_box_title"
                      style={{ marginBottom: "30px" }}
                    >
                      Attach related documents or photos
                    </div>

                    <div>
                      {/* Upload Img */}
                      <UploadAttachments
                        onChange={photos => this.setState({ photos })}
                        isUploading={this.handleIsUploading}
                        uploadFile={uploadFile}
                        validateUpload={this.validateUpload}
                      />
                      {errObj.upload && (
                        <div className="GC_form_error">{errObj.upload}</div>
                      )}
                      {/* Upload Img */}
                    </div>

                    <div className="SC_drawer_box_b">
                      <Checkbox
                        onChange={e => {
                          this.setState({ declare_status: e.target.checked });
                          delete errObj.declare_status;
                        }}
                        checked={this.state.declare_status}
                      >
                        <span className="disclaimertxt">
                          I hereby declare that all the details i have mentioned
                          above are true and correct to the best of my
                          knowledge. In case, any of the above information is
                          found to be false, untrue, misleading or
                          misrepresenting, I am aware that my claim will be
                          revoked automatically.
                        </span>
                        <span className="disclaimertxt_sub">
                          We will share this information with our guest.
                        </span>
                        {errObj.declare_status && (
                          <div className="GC_form_error">
                            {errObj.declare_status}
                          </div>
                        )}
                      </Checkbox>
                    </div>
                    {/* Step 3 - End */}
                  </div>
                )}
                <div className="SC_drawer_box" style={{ display: "flex" }}>
                  {step === 0 && (
                    <button
                      type="button"
                      className="btn SC_btn_cancel"
                      onClick={() => {
                        handleCancel();
                      }}
                    >
                      CANCEL
                    </button>
                  )}
                  {step > 0 && (
                    <button
                      type="button"
                      className="btn SC_btn_greenV2"
                      onClick={() => this.prev()}
                    >
                      BACK
                    </button>
                  )}
                  {step < steps.length - 1 && (
                    <button
                      type="button"
                      className="btn SC_btn_submit"
                      onClick={() => this.next()}
                    >
                      NEXT
                    </button>
                  )}
                  {step === steps.length - 1 && (
                    <button
                      type="button"
                      className="btn SC_btn_submit"
                      style={{ display: "flex", justifyContent: "center" }}
                      onClick={this.handleSubmit}
                    >
                      {submitting && (
                        <PreloaderIcon
                          style={{ paddingRight: "5px" }}
                          loader={Oval}
                          size={25}
                          strokeWidth={8} // min: 1, max: 50
                          strokeColor="#fff"
                          duration={800}
                        />
                      )}
                      {submitting ? "SUBMITTING" : "SUBMIT"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          message && (
            <SuccessMessage
              successMsg={message}
              ticketId={ticketId}
              onClickView={() => {
                dispatch(toggleDrawer(!isDrawerOpen));
              }}
            />
          )
        )}
        {/* Drawer Content */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ticketBookings: state.supportCenter.ticketBookings,
    isDrawerOpen: state.common.isDrawerOpen
  };
};

export default connect(mapStateToProps)(ReportDamageForm);
