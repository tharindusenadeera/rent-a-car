import React, { Component, Fragment } from "react";
import { smallModel } from "../../../consts/consts";
import Modal from "react-modal";

Modal.setAppElement("#root");

class Confirmation extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };
  }

  _toggleModel = () => this.setState({ showModal: !this.state.showModal });

  render() {
    return (
      /* <div style={{display:'inline-flex', width: '100%'}}> */
      <div className="bookchng_submit">
        <button
          onClick={() => {
            this.props.validate == false
              ? this.props.onClick()
              : this._toggleModel();
          }}
          className={this.props.className}
        >
          {this.props.children ? (
            this.props.children
          ) : (
            <Fragment>
              {this.props.buttonText && this.props.buttonText}
            </Fragment>
          )}
        </button>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this._toggleModel()}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={smallModel}
        >
          <div className="confirm-message-wrapper">
            <button
              className="modal-close-icon"
              onClick={() => this._toggleModel()}
            >
              <img
                className="img-responsive"
                src="/images/close-icon-gray.svg"
              />
            </button>
            <div className="modal-header">
              <h5>
                {this.props.confirmationTitle
                  ? this.props.confirmationTitle
                  : "Confirmed"}
              </h5>
            </div>
            {this.props.confirmationText && (
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                {this.props.confirmationText}
              </div>
            )}
            <div className="confirm-buttons-wrapper">
              <button
                className="btn yes-btn"
                onClick={() => {
                  this.props.onClick();
                  this._toggleModel();
                }}
              >
                Yes
              </button>
              <button
                className="btn no-btn"
                onClick={() => this._toggleModel()}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Confirmation;
