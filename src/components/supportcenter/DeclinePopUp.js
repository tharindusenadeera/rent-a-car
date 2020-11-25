import React, { Component } from "react";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import { Input } from "antd";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";
import { isValid } from "date-fns";
import "antd/lib/input/style/index.css";

const { TextArea } = Input;

class DeclinePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: true,
      declineReason: "",
      error: null,
      message: ""
    };
  }

  validateForm = () => {
    if (this.state.declineReason === "") {
      this.setState({ error: true, message: "Decline reason is required!" });
      return false;
    }
    this.setState({ error: false, message: "" });
    return true;
  };

  handleDeclineReason = e => {
    const { onTypeReason } = this.props;
    this.setState({ declineReason: e.target.value });
    onTypeReason(this.state.declineReason);
  };

  handleDecline = () => {
    const { onDecline, onDeclineMsg } = this.props;
    const isValid = this.validateForm();
    if (isValid) {
      onDecline("decline")
        .then(res => {
          if (!res.data.error) {
            onDeclineMsg({ success: true, message: res.data.message });
            this.setState({ showModel: false });
          } else {
            this.setState({ error: true, message: res.data.message });
          }
        })
        .catch(err => {
          this.setState({ error: true, message: err.response.data.message });
        });
    }
  };

  render() {
    const { error, message } = this.state;

    return (
      <div>
        {/* Decline claim  - Insert Reason */}
        <Modal
          isOpen={this.state.showModel}
          onRequestClose={() => this.setState({ showModel: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div>
              <div className="header_side">Reason to decline</div>
              <div className="del_icon_side">
                <span
                  className="icon-cancel"
                  onClick={() => this.setState({ showModel: false })}
                />
              </div>
            </div>

            <div>
              <TextArea
                className="col-sm-12"
                placeholder="Tell us the reason to decline the claim*"
                autosize={{ minRows: 2, maxRows: 6 }}
                value={this.state.declineReason}
                onChange={this.handleDeclineReason}
              />
            </div>
            {error && (
              <div className="col-sm-12 SC_drawer_box">
                <div className="SC_msg_error">
                  <div className="text">{message}</div>
                </div>
              </div>
            )}
            <div className="btn decline">
              <button
                className="btn-popup SC_btn SC_btn_withdraw"
                onClick={this.handleDecline}
              >
                DECLINE
              </button>
            </div>
          </div>
        </Modal>
        {/* Decline claim  - Insert Reason */}
      </div>
    );
  }
}

export default DeclinePopUp;
