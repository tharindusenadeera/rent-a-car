import React, { Component } from "react";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";

class SucessPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: true
    };
  }
  render() {
    const { header, description, icon } = this.props;
    return (
      <div>
        {/* Resolve - Sucess Message */}
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
                onClick={() => this.setState({ showModel: false })}
              />
            </div>
            {icon && (
              <div className="icon">
                {icon === "success" ? (
                  <img src="/images/checkout/success-icon-green.png" />
                ) : (
                  icon === "decline" && (
                    <img src="/images/support-center/decline-icon.svg" />
                  )
                )}
              </div>
            )}
            {header && <div className="header">{header}</div>}
            {description && <div className="desc">{description}</div>}
            <div className="btn-scbox">
              <a
                className="btn-popup SC_btn SC_btn_submit"
                onClick={() => this.setState({ showModel: false })}
              >
                VIEW TICKET
              </a>
            </div>
          </div>
        </Modal>
        {/* Resolve - Sucess Message */}
      </div>
    );
  }
}

export default SucessPopUp;
