import React, { Component } from "react";
import axios from "axios";
import { Checkbox } from "antd";
import { Upload } from "../../file-processing/";
import Modal from "react-modal";
import { modalStyles } from "../../../consts/consts";
import { withRouter } from "react-router";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../../consts/consts.js";
import "antd/lib/checkbox/style/index.css";
import ReactPixel from "react-facebook-pixel";
import { authFail } from "../../../actions/AuthAction";

class StepFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      certied: false,
      submitting: false,
      upload: []
    };
  }

  saveUploads = async attachments => {
    const { car, dispatch } = this.props;
    this.setState({ submitting: true });

    ReactPixel.trackCustom("Complete List my Ryde", {
      content_ids: car.id,
      value: car.daily_rate,
      currency: "USD",
      content_type: "product",
      contents: [{ id: car.id, quantity: 1 }]
    });
    axios
      .post(
        `${process.env.REACT_APP_API_URL}v3/car-photos`,
        { car_id: car.id, attachments },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        if (!res.data.error) {
          axios.post(
            `${process.env.REACT_APP_API_URL}car/edit-mobile/${car.id}`,
            {
              status: 0
            },
            {
              headers: {
                Authorization: localStorage.access_token
              }
            }
          );

          this.setState({ showModal: true, submitting: false });
        }
        this.setState({ submitting: false });
      })
      .catch(e => {
        this.setState({ submitting: false });
        dispatch(authFail(e));
      });
  };

  renderSubmitButton = attachments => {
    return (
      <div className="row">
        <div className="col-md-12">
          {attachments.length > 0 && attachments.length < 4 && (
            <div className="requirment-text">Least 4 photos required.</div>
          )}

          <div>
            <label className="requirment-label">
              <Checkbox
                value={this.state.certied}
                onChange={e => this.setState({ certied: !this.state.certied })}
              >
                I certify that car is well maintained and does not have a
                Salvage title.
              </Checkbox>
            </label>
          </div>
        </div>
        <div className="col-md-12 lst-step">
          <div className="List_outer_wrapper">
            <div className="List_button_wrapper">
              <div className="List_button-box">
                <button
                  type="button"
                  className="List_back_btn"
                  onClick={() => this.props.loadPrevious()}
                >
                  Back
                </button>
                <button
                  disabled={
                    attachments &&
                    attachments.length >= 4 &&
                    this.state.upload.length >= 4 &&
                    this.state.certied === true
                      ? false
                      : true
                  }
                  // className="List_submit_btn btn-disabled"
                  className={
                    attachments &&
                    this.state.certied === true &&
                    attachments.length >= 4
                      ? "List_submit_btn"
                      : "List_disable_btn"
                  }
                  onClick={() =>
                    attachments &&
                    this.state.certied === true &&
                    attachments.length >= 4 &&
                    this.saveUploads(attachments)
                  }
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
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  onUpload = files => {
    this.setState({
      upload: [...this.state.upload, files]
    });
  };

  render() {
    const { history } = this.props;

    return (
      <div>
        <div className="form-horizontal">
          <h4 className="center">Upload car photos</h4>
          <br />
          <Upload
            onUpload={this.onUpload}
            folder="tmp/car"
            renderSubmitButton={this.renderSubmitButton}
            multipleUploads={true}
            accept="image/*"
          />
        </div>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={false}
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="sign-up-popup congratulations-popup">
            <div className="icon">
              <img src="/images/checkout/success-icon-green.png" />
              {/* <img src="/images/support-center/decline-icon.svg" /> */}
            </div>
            <div className="cong-header">Congratulations</div>
            <div className="cong-desc">
              Your car will start earning soon. Pending verification which may
              take 1-3 business days.
            </div>
            <div className="btn">
              <button
                className="btn SC_btn_submit"
                onClick={() => {
                  this.setState({ showModal: false });
                  history.push("/my-profile/cars");
                }}
              >
                Browse List
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(StepFive);
