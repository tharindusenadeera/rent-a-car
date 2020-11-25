import { connect } from "react-redux";
import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import { Input, Button, Radio } from "antd";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import "./style.css";
import { isMobileOnly } from "react-device-detect";

const RadioGroup = Radio.Group;

class LeavingReasons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModelPopUp: true
    };
  }
  state = {
    value: 1
  };
  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };

  render() {
    // const radioStyle = {
    //   display: "block",
    //   height: "30px",
    //   lineHeight: "30px"
    // };

    return (
      <Fragment>
        <Modal
          isOpen={this.state.showModelPopUp}
          shouldCloseOnOverlayClick={false}
          contentLabel="Modal"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="sign-up-popup checkout-popup leaving-pop-container">
            {/* <button className="em-close-btn">
              <img src="/images/close_icon.png" />
            </button>
            <div className="lr-text-lg">WHY ARE YOU LEAVING ?</div>
            <div className="lr-text-md">
              Help us improve to serve you better
            </div>
            <div className="lr-reasons">
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio className="lr-op-text" value={1}>
                  I’m not sure how Ryde works
                </Radio>
                <Radio className="lr-op-text" value={2}>
                  Cars on my price range is not available
                </Radio>
                <Radio className="lr-op-text" value={3}>
                  Ryde does not have the car I want
                </Radio>
              </RadioGroup>
            </div>

            <Button className="em-coupon-btn">
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
              SUBMIT
            </Button>

            <div className="em-bottom-sec">
              <div className="em-ca">* Conditions Apply</div>
            </div> */}
            {/* Success Message */}
            <div className="submit-success-mesg-wrapper">
              <button className="em-close-btn">
                <img src="/images/close_icon.png" />
              </button>
              <img src="/images/checkout/success-icon-green.png" />
              <div className="lr-text-lg">Thank you for your feedback</div>
              <p className="lr-text-sm">
                We will work in our effort to make Ryde available at your
                location.
              </p>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default LeavingReasons;
