import React, { Component } from "react";
import { connect } from "react-redux";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import UploadAttachments from "./UploadAttachments";
import SuccessMessage from "./SuccessMessage";
import { Input } from "antd";
import { toggleDrawer } from "../../actions/CommenActions";
import "antd/lib/input/style/index.css";

const { TextArea } = Input;

class GenarelForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      photos: [],
      isUploading: false,
      errObj: {},
      submitting: this.props.submitting
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.successDialog) {
      this.setState({
        errObj: {},
        description: "",
        photos: []
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      description: "",
      photos: [],
      isUploading: false,
      errObj: {},
      submitting: this.props.submitting
    });
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
    const { createTicket, timeZoneId } = this.props;
    const { description, photos, isUploading } = this.state;

    let errors = {};

    if (!description) {
      errors.description = "Should not be empty!";
    }
    if (isUploading) {
      errors.upload = "Please wait until upload is done!";
    }

    if (!Object.keys(errors).length) {
      this.setState({ submitting: true });
      const ticket = {
        description,
        type: "general",
        photos,
        timeZoneId
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
    const { errObj } = this.state;

    const {
      dispatch,
      isDrawerOpen,
      uploadFile,
      successDialog,
      message,
      ticketId,
      submitting,
      handleCancel
    } = this.props;
    return (
      <div>
        <div className="SC_drawer_header genarel">
          <img alt="Icon" src="/images/support-center/gen-icon.svg" />
          <div>General</div>
        </div>

        {!successDialog ? (
          <div className="SC_drawer">
            <div className="SC_drawer_inner">
              <div className="GC_fieldrow">
                <TextArea
                  placeholder="Tell us your concern *"
                  autosize={{ minRows: 1, maxRows: 10 }}
                  id="description"
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
                isUploading={this.handleIsUploading}
                onChange={photos => this.setState({ photos })}
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
    isDrawerOpen: state.common.isDrawerOpen,
    timeZoneId: state.common.timeZoneId
  };
};

export default connect(mapStateToProps)(GenarelForm);
