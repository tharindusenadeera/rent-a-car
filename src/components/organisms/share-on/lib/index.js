import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  EmailShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  EmailIcon
} from "react-share";
import { isMobileOnly } from "react-device-detect";
import {
  defaultMobileModelPopup,
  defaultModelPopup
} from "../../../../consts/consts";

class ShareOn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      car_URL: window.location.href,
      copyText: false
    };
  }

  getPageURL() {
    var copyText = document.getElementById("paste-box");
    copyText.select();
    document.execCommand("copy");
    this.setState({ copyText: true });
  }

  render() {
    const { car } = this.props;
    const { car_URL, copyText } = this.state;

    return (
      <Fragment>
        <button
          className="favorite-icon flex-align-center flex-justify-center"
          onClick={() => {
            this.setState({ showModal: true });
          }}
        >
          <span className="icon-revamp-share-new icon"></span>
        </button>
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="share-this-car-popup checkout-popup">
            <div className="close-popup">
              <span
                className="icon-cancel"
                onClick={() => this.setState({ showModal: false })}
              />
            </div>
            <div className="ps-title">Share this car</div>
            <div className="share-icons-wrapper">
              <ul className="share-icon-list list-unstyled">
                <li className="share-icon-inner">
                  <FacebookShareButton
                    refs="child"
                    beforeOnClick={() => this.setState({ showModal: false })}
                    url={car_URL}
                    quote={car && car.car_name}
                    className="Demo__some-network__share-button"
                  >
                    <div className="social-icon-wrapper">
                      <FacebookIcon refs="child" size={40} round />
                      <div className="social-icon-text">Facebook</div>
                    </div>
                  </FacebookShareButton>
                </li>
                <li className="share-icon-inner">
                  <TwitterShareButton
                    beforeOnClick={() => this.setState({ showModal: false })}
                    url={car_URL}
                    quote={car && car.car_name}
                    className="Demo__some-network__share-button"
                  >
                    <div className="social-icon-wrapper">
                      <TwitterIcon size={40} round />
                      <div className="social-icon-text">Twitter</div>
                    </div>
                  </TwitterShareButton>
                </li>
                <li className="share-icon-inner">
                  <GooglePlusShareButton
                    beforeOnClick={() => this.setState({ showModal: false })}
                    url={car_URL}
                    quote={car && car.car_name}
                    className="Demo__some-network__share-button"
                  >
                    <div className="social-icon-wrapper">
                      <GooglePlusIcon size={40} round />
                      <div className="social-icon-text">Google</div>
                    </div>
                  </GooglePlusShareButton>
                </li>
                <li className="share-icon-inner">
                  <EmailShareButton
                    beforeOnClick={() => this.setState({ showModal: false })}
                    url={car_URL}
                    quote={car && car.car_name}
                    className="Demo__some-network__share-button"
                  >
                    <div className="social-icon-wrapper">
                      <EmailIcon size={40} round />
                      <div className="social-icon-text">Email</div>
                    </div>
                  </EmailShareButton>
                </li>
              </ul>
            </div>
            <button className="copy-link" onClick={this.getPageURL.bind(this)}>
              {!copyText ? "Click to copy link" : "Copyed"}
            </button>
            <input
              className="copy-link-field"
              id={"paste-box"}
              value={car_URL}
              type="text"
              readOnly
            />
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default ShareOn;
