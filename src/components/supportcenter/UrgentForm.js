import React, { Component } from "react";
import { connect } from "react-redux";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { fetchBookings } from "../../actions/SupportCenterActions";
import UploadAttachments from "./UploadAttachments";
import SuccessMessage from "./SuccessMessage";
import { Select, Input } from "antd";
import { toggleDrawer } from "../../actions/CommenActions";
import "antd/lib/select/style/index.css";
import "antd/lib/input/style/index.css";

const { TextArea } = Input;
const Option = Select.Option;

class UrgentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      booking_id: "",
      photos: [],
      isUploading: false,
      errObj: {}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchBookings("urgent_matter"));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.successDialog) {
      this.setState({
        errObj: {},
        description: "",
        booking_id: "",
        photos: []
      });
    }
  }

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

  handleSubmit = () => {
    const { createTicket } = this.props;
    const { description, booking_id, photos, isUploading } = this.state;
    let errors = {};

    if (!booking_id) {
      errors.booking_id = "Should not be empty!";
    }
    if (!description) {
      errors.description = "Should not be empty!";
    }
    if (isUploading) {
      errors.upload = "Please wait until upload is done!";
    }

    if (!Object.keys(errors).length) {
      this.setState({ submitting: true });
      const ticket = {
        description: description,
        type: "urgent_matter",
        photos,
        booking_id: booking_id
      };
      createTicket(ticket);
    }
    this.setState({ errObj: errors });
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
    const { errObj } = this.state;

    return (
      <div>
        <div className="SC_drawer_header urgent">
          <img alt="Icon" src="/images/support-center/urgent-icon.svg" />
          <div>Urgent</div>
        </div>

        {!successDialog ? (
          <div className="SC_drawer">
            <div className="SC_drawer_inner">
              <div className="GC_fieldrow">
                <Select
                  className={
                    errObj.booking_id
                      ? "SC_drawer_textfield error"
                      : "SC_drawer_textfield"
                  }
                  //defaultValue="Select your trip *"
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

              <div className="GC_fieldrow">
                <TextArea
                  placeholder="Tell us your concern *"
                  autosize={{ minRows: 1, maxRows: 10 }}
                  value={this.state.description}
                  className={
                    errObj.description
                      ? "SC_drawer_textfield error"
                      : "SC_drawer_textfield"
                  }
                  onChange={e => {
                    this.setState({ description: e.target.value });
                    delete errObj.description;
                  }}
                />
                {errObj.description && (
                  <div className="GC_form_error">{errObj.description}</div>
                )}
              </div>

              <div className="field-title">
                Attach related documents or photos
              </div>
              <UploadAttachments
                onChange={photos => this.setState({ photos })}
                isUploading={this.handleIsUploading}
                uploadFile={uploadFile}
                validateUpload={this.validateUpload}
              />
              {errObj.upload && (
                <div className="GC_form_error">{errObj.upload}</div>
              )}

              <div className="SC_drawer_box" style={{ display: "flex" }}>
                <button
                  type="button"
                  className="btn SC_btn_cancel"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  CANCEL
                </button>
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

export default connect(mapStateToProps)(UrgentForm);
