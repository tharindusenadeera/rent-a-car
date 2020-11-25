import React, { Component } from "react";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  EmailShareButton,
  TwitterShareButton
} from "react-share";

class SharePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile_URL: window.location.href
    };
  }

  render() {
    return (
      <div className="event-share-icons">
        <div className="inner-text-sm">Share</div>
        <div className="flex-container">
          <FacebookShareButton
            ref="child"
            beforeOnClick={() => this.setState({ showModal: false })}
            url={this.state.profile_URL}
            className="Demo__some-network__share-button"
          >
            <div className="social-icon-wrapper">
              <button className="share-buttons">
                <img
                  alt="Facebook"
                  className="share-icon-sm"
                  src="https://cdn.rydecars.com/static-images/events/facebook-letter-icon.svg"
                />
              </button>
            </div>
          </FacebookShareButton>

          <TwitterShareButton
            beforeOnClick={() => this.setState({ showModal: false })}
            url={this.state.profile_URL}
            className="Demo__some-network__share-button"
          >
            <div className="social-icon-wrapper">
              <button className="share-buttons">
                <img
                  alt="Twitter"
                  className="share-icon-sm"
                  src="https://cdn.rydecars.com/static-images/events/twitter-letter-icon.svg"
                />
              </button>
            </div>
          </TwitterShareButton>

          <GooglePlusShareButton
            beforeOnClick={() => this.setState({ showModal: false })}
            url={this.state.profile_URL}
            className="Demo__some-network__share-button"
          >
            <div className="social-icon-wrapper">
              <button className="share-buttons">
                <img
                  alt="Google pluse"
                  className="share-icon-sm"
                  src="https://cdn.rydecars.com/static-images/events/google-plus-letter-icon.svg"
                />
              </button>
            </div>
          </GooglePlusShareButton>

          <EmailShareButton
            beforeOnClick={() => this.setState({ showModal: false })}
            url={this.state.profile_URL}
            className="Demo__some-network__share-button"
          >
            <div className="social-icon-wrapper">
              <button className="share-buttons">
                <img
                  alt="Email"
                  className="share-icon-sm"
                  src="https://cdn.rydecars.com/static-images/events/envelope-letter-icon.svg"
                />
              </button>
            </div>
          </EmailShareButton>
        </div>
      </div>
    );
  }
}

export default SharePage;
