import React, { Component } from "react";
import axios from "axios";
import { Upload } from "../file-processing/";
import Modal from "react-modal";
import { modalStyles } from "../../consts/consts";
import { withRouter } from "react-router";

class CarPhotosForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      certied: false
    };
  }

  saveUploads = async attachments => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}v3/car-photos`,
        { car_id: this.props.carId, attachments },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        if (!res.data.error) {
          axios.post(
            `${process.env.REACT_APP_API_URL}car/edit-mobile/${
              this.props.carId
            }`,
            {
              status: 0
            },
            {
              headers: {
                Authorization: localStorage.access_token
              }
            }
          );
          this.setState({ showModal: true });
        }
      })
      .catch(e => {});
  };

  renderSubmitButton = attachments => {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="requirment-text">Least 4 Photos Required.</div>
          <div>
            <label className="requirment-label">
              <input
                className="checkbox-inline"
                type="checkbox"
                value={this.state.certied}
                onChange={e => this.setState({ certied: !this.state.certied })}
              />
              <span className="certify-text">
                {" "}
                I certify that car is well maintained
              </span>
            </label>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-xs-6">
              <button
                onClick={() => this.props.previousPage()}
                className="btn btn-default pull-right form-btn"
              >
                Back
              </button>
            </div>
            <div className="col-xs-6">
              <button
                disabled={
                  attachments &&
                  attachments.length >= 4 &&
                  this.state.certied === true
                    ? false
                    : true
                }
                className="next form-btn btn btn-success"
                onClick={() =>
                  attachments &&
                  this.state.certied === true &&
                  attachments.length >= 4 &&
                  this.saveUploads(attachments)
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  onUpload = files => {};

  render() {
    return (
      <div>
        <div className="form-horizontal">
          <h4 className="center">Upload Car Photos</h4>
          <br />
          <Upload
            onUpload={this.onUpload}
            folder="tmp/car"
            renderSubmitButton={this.renderSubmitButton}
            multipleUploads={true}
          />
        </div>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={false}
          style={modalStyles}
        >
          <div className="center">
            <span className="glyphicon glyphicon-ok-sign congrats-sign" />
            <h1 className="congrats-text"> Congratulations </h1>
            <h4 className="congrats-desc">Your car has been listed</h4>
          </div>
          <br />
          <div className="center">
            <button
              className="browse-list"
              onClick={() => {
                this.setState({ showModal: false });
                // browserHistory.push("/profile/index/2");
              }}
            >
              Browse List
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(CarPhotosForm);
