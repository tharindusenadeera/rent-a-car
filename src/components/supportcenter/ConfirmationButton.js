import React, { Component } from "react";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";

class ConfirmationButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false
    };
  }

  toggleModal = () => this.setState({ showModel: !this.state.showModel });

  onClickButton = () => {
    this.props.onClick();
    this.toggleModal();
  };
  render() {
    const {
      children,
      className,
      type,
      style,
      confirmationMessage
    } = this.props;
    return (
      <div>
        <button
          className={className}
          type={type}
          style={style}
          onClick={() => this.toggleModal()}
        >
          {children}
        </button>
        <Modal
          isOpen={this.state.showModel}
          onRequestClose={() => this.setState({ showModel: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div className="del_icon">
              <span
                className="icon-cancel"
                onClick={() => this.toggleModal()}
              />
            </div>
            <div className="header_second">
              {confirmationMessage ? confirmationMessage : "Are you sure"}
            </div>
            <div className="btn-scbox">
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_withdraw"
                onClick={() => this.toggleModal()}
              >
                NO
              </button>
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_submit"
                onClick={() => this.onClickButton()}
              >
                YES
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ConfirmationButton;
