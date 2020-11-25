import React, { Component } from "react";
import Modal from "react-modal";
import { modalStylesBooking } from "../../consts/consts";
//import Dropzone from "react-dropzone";
import axios from "axios";
import RydeUpload from "../file-processing/lib/Upload";
import { isMobileOnly } from "react-device-detect";
import {
  sharexModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import { authFail } from "../../actions/AuthAction";

class ExperienceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      description: "",
      submitting: false,
      error: false,
      errorMassage: ""
    };
  }

  onDrop = file => {
    this.setState({ file: file[0] });
  };

  onFormSubmitV2 = async () => {
    try {
      if (
        !this.state.file &&
        !this.state.description &&
        !this.state.submitting
      ) {
        return false;
      }
      this.setState({ submitting: true, error: false, errorMassage: "" });
      const data = {
        booking_id: this.props.bookingId,
        experience: this.state.description,
        image: this.state.file
      };
      const response = await await axios.post(
        `${process.env.REACT_APP_API_URL}v2/user-experience`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (response && !response.error) {
        this.setState({
          file: null,
          description: "",
          error: false,
          errorMassage: ""
        });
        this.props.onRequestClose();
      } else {
        this.setState({ error: true, errorMassage: response.message });
      }
      this.setState({ submitting: false });
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({ error: true, errorMassage: error.response.data.message });
      this.setState({ submitting: false });
      console.log("error", error.response.data.message);
    }
  };

  getUploadedFiles = data => {
    this.setState({ file: data[0].key });
  };

  render() {
    const {
      showExperincesModal,
      shouldCloseOnOverlayClick,
      onRequestClose
    } = this.props;

    return (
      <Modal
        isOpen={showExperincesModal}
        onRequestClose={() => this.setState({ showModel: false })}
        // shouldCloseOnOverlayClick={true}
        contentLabel="Modal"
        style={isMobileOnly ? defaultMobileModelPopup : sharexModelPopup}
      >
        {this.state.submitting && <div className="preloader" />}

        <div className="center booking-modal ex-modal">
          <div className="close-popup-header">
            <h1>Share Your Experience</h1>
            <button
              className="modal-close-btn close-popup"
              onClick={() => {
                !this.state.submitting && onRequestClose();
              }}
            >
              <span className="icon-cancel" />
            </button>
          </div>
          <div className="col-md-12">
            <div className="ex-modal-img-comp">
              <RydeUpload
                folder="tmp/user_experience"
                max={1}
                onUpload={this.getUploadedFiles}
                styleFullWidth
              />
            </div>
          </div>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Experience"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
          />
          <p style={{ color: "#e53935", textAlign: "left" }}>
            {this.state.error && this.state.errorMassage}
          </p>
          <div className="footer-buttons centerd">
            <button
              type="button"
              className="btn btn-default submit-btn"
              disabled={
                this.state.file && this.state.description ? false : true
              }
              onClick={() => this.onFormSubmitV2()}
            >
              SUBMIT
            </button>
            <button
              type="button"
              className="btn btn-default cancel-btn"
              onClick={() => {
                !this.state.submitting && onRequestClose();
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ExperienceForm;
