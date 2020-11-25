import React, { Component } from "react";
import Rating from "react-rating";
import Modal from "react-modal";
import { Popover, Button, Switch, Icon } from "antd";
import "antd/lib/popover/style/index.css";
import "antd/lib/button/style/index.css";
import "antd/lib/switch/style/index.css";
import "antd/lib/icon/style/index.css";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { ratingModal, ratingMobileModal } from "../../consts/modalStyles";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import { isMobile, isMobileOnly } from "react-device-detect";
import axios from "axios";
import moment from "moment-timezone";
import { authFail } from "../../actions/AuthAction";
class RatingForm extends Component {
  constructor(props) {
    super(props);
    const { booking, reting_categories } = props;
    const categories =
      booking.btn.user_type == "renter"
        ? reting_categories.data.owner
        : reting_categories.data.renter;
    let ratings = [];

    categories.map(val => {
      ratings.push({
        rating_category_id: val.id,
        values: 0.5
      });
    });
    this.state = {
      showModel: true,
      showThank: true,
      switchOn: false,
      ratingCategories: ratings,
      description: "",
      publicReviewCharsLeft: 250,
      privateReview: "",
      privateReviewCharsLeft: 250,
      error: false,
      success: false,
      message: "",
      submitting: false,
      publicReviewDeclVisible: false,
      priveteReviewDeclVisible: false
    };
  }

  handleSwitchPrivate = () => {
    this.setState({ switchOn: !this.state.switchOn });
  };

  handleChange = e => {
    let review = e.target.value;
    let reviewType = e.target.id;
    let charsLength = review
      .split(" ")
      .filter(el => {
        return el != "";
      })
      .map(word => {
        return word.length;
      })
      .reduce((a, b) => a + b, 0);
    if (charsLength <= 250) {
      this.setState({
        [e.target.id]: review
      });
    }
    reviewType === "description" &&
      this.setState({ publicReviewCharsLeft: 250 - charsLength });
    reviewType === "privateReview" &&
      this.setState({ privateReviewCharsLeft: 250 - charsLength });
  };

  _toggleModal = () => this.setState({ showModel: !this.state.showModel });

  onStarRatingPress = (index, rating) => {
    const { booking } = this.props;
    let category_ratings = this.state.ratingCategories;

    let findIndex = category_ratings.findIndex(data => {
      return data.rating_category_id == index;
    });
    category_ratings[findIndex].values = rating;
    this.setState({
      error: false,
      message: "",
      ratingCategories: category_ratings
    });
  };

  _hanndleSubmit = async () => {
    try {
      if (this.state.submitting) {
        return false;
      }
      this.setState({ submitting: true });
      if (this.state.ratingCategories.length == 0) {
        this.setState({
          error: true,
          message: "Ratings required",
          submitting: false
        });
        return false;
      }
      if (!this.state.description) {
        this.setState({
          error: true,
          message: "Public Review required",
          submitting: false
        });
        return false;
      }
      if (this.state.publicReviewCharsLeft > 225) {
        this.setState({
          error: true,
          message: "The public review must be at least 25 characters.",
          submitting: false
        });
        return false;
      }
      if (
        this.state.switchOn === true &&
        this.state.privateReviewCharsLeft > 225
      ) {
        this.setState({
          error: true,
          message: "The private review must be at least 25 characters.",
          submitting: false
        });
        return false;
      }
      let data = {
        booking_id: this.props.booking.id,
        category_rating: this.state.ratingCategories,
        description: this.state.description.trim()
      };
      if (this.state.switchOn === true && this.state.privateReview !== "") {
        data.private_review = this.state.privateReview.trim();
      }
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "ratings",
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.setState(
          {
            success: true,
            message: response.data.message,
            error: false,
            submitting: false,
            showModel: false
          },
          state => {
            // this.props.fetchBooking()
            // this._toggleModal();
          }
        );
      } else {
        this.setState({
          error: true,
          message: response.data.message,
          success: false,
          submitting: false
        });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({
        error: true,
        message: error.response.data.message,
        success: false,
        submitting: false
      });
    }
  };

  _setRating = id => {
    const { ratingCategories } = this.state;
    if (ratingCategories.length > 0) {
      let rating = ratingCategories.filter(data => {
        return data.rating_category_id == id;
      });
      return rating[0].values;
    }
  };

  render() {
    const { booking, reting_categories } = this.props;
    const user =
      booking.btn.user_type == "owner" ? booking.user : booking.car.car_owner;
    const categories =
      booking.btn.user_type == "renter"
        ? reting_categories.data.owner
        : reting_categories.data.renter;

    const contentOne = (
      <div>
        <div className="rating-close-tip visible-xs">
          <a onClick={() => this.setState({ publicReviewDeclVisible: false })}>
            <img src="/images/close_icon.png" alt="close" />
          </a>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            Examples of helpful Reviews.
          </div>
          <p>
            I had a BMW rental for 3 days: pickup & return was great & the price
            was reasonable. I have a corporate acct w/ Enterprise but my rental
            experience w/RYDE (during a busy weekend nonetheless), far exceeds
            any rental experience w/Enterprise. Thank you!
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            Why their honest review is important?
          </div>
          <p>
            Share your views on your recent Ryde experience to help other Ryders
            decide which Ryde is best for them.
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            What they can mention in Public
          </div>
          <p>
            Mention a few things you liked most about your Ryde experience, the
            car itself, the drive, the exchange, the host, and recommend it to
            other Ryders.
          </p>
        </div>
      </div>
    );

    const contentTwo = (
      <div>
        <div className="rating-close-tip visible-xs">
          <a onClick={() => this.setState({ priveteReviewDeclVisible: false })}>
            <img src="/images/close_icon.png" alt="close" />
          </a>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            Examples of helpful Reviews.
          </div>
          <p>
            Hey, I found a lost sock under the back seat. Just wanted to let you
            know to clean and check all corners of the car. Thank you.
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            Why their honest review is important?
          </div>
          <p>
            Share your most honest feedback here to help them improve their
            future interactions. Please be respectful of your fellow Ryder and
            communicate your concerns clearly.
          </p>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            What they can mention in Private
          </div>
          <p>
            Take this opportunity to tell your fellow Ryder how they can improve
            their communication, timing, cleanliness, or overall performance.
          </p>
        </div>
      </div>
    );

    return (
      <div>
        <Modal
          isOpen={this.state.showModel}
          onRequestClose={this.handleCloseModalLarge}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={isMobileOnly ? ratingMobileModal : ratingModal}
        >
          <div className="rating-container">
            <div className="row">
              {/* {this.state.submitting && <div className="preloader" />} */}
              <div className="col-sm-12">
                <div className="close-popup-header" >
                  <h1>Please rate your RYDE with</h1>
                  <button
                    className="modal-close-btn close-popup"
                    onClick={() => this._toggleModal()}
                  >
                    <span className="icon-cancel"  />
                  </button>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="rating-popup-wrapper">
                  <img
                    className="img-responsive pic"
                    src={user.profile_image_thumb}
                    alt="Image"
                  />
                  <div className="name-wrapper">
                    <span className="name">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="since">
                      Member Since{" "}
                      {moment(user.created_at, "YYYY-MM-DD HH:mm:ss").format(
                        "MMM-YYYY"
                      )}{" "}
                    </span>
                  </div>
                  <div className="rating-wrapper">
                    {categories &&
                      categories.map(category => {
                        return (
                          <div
                            className="flex-rating-container"
                            key={category.id}
                          >
                            <span className="rating-cate">{category.name}</span>
                            <div className="rating-stars">
                              <Rating
                                emptySymbol="fa fa-star-o fa-2x"
                                fullSymbol="fa fa-star fa-2x"
                                fractions={2}
                                onChange={e =>
                                  this.onStarRatingPress(category.id, e)
                                }
                                initialRating={
                                  this.state.ratingCategories.length &&
                                  this._setRating(category.id)
                                }
                                readonly={this.state.success ? true : false}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="comment-wrapper public-comment-wrapper">
                    <div className="review-tips flex-container">
                      <div className="review-label">Public review</div>
                      <Popover
                        content={contentOne}
                        // title="Title"
                        onClick={() =>
                          this.setState({
                            publicReviewDeclVisible: !this.state
                              .publicReviewDeclVisible
                          })
                        }
                        trigger="click"
                        visible={this.state.publicReviewDeclVisible}
                      >
                        <Button>
                          <img
                            className="help-icon"
                            src="/images/help-icon.svg"
                            alt="Help"
                          />
                        </Button>
                      </Popover>
                    </div>
                    <textarea
                      id="description"
                      className="form-control rate-description"
                      rows="3"
                      readOnly={this.state.success ? true : false}
                      placeholder="Write your review"
                      onChange={this.handleChange}
                      value={this.state.description}
                    />
                    <div className="words-left">
                      {`${this.state.publicReviewCharsLeft} characters left`}
                    </div>
                  </div>
                  <div className="comment-wrapper private-comment-wrapper">
                    <div className="flex-container">
                      <div>
                        <div className="review-label">Private review</div>
                        <div className="review-tips flex-container">
                          This review is just for you. It won’t appear on your
                          profile
                          <Popover
                            content={contentTwo}
                            onClick={() =>
                              this.setState({
                                priveteReviewDeclVisible: !this.state
                                  .priveteReviewDeclVisible
                              })
                            }
                            trigger="click"
                            visible={this.state.priveteReviewDeclVisible}
                          >
                            <Button>
                              <img
                                className="help-icon"
                                src="/images/help-icon.svg"
                                alt="Help"
                              />
                            </Button>
                          </Popover>
                        </div>
                      </div>
                      <div className="private-switch">
                        <Switch
                          disabled={this.state.success ? true : false}
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          onChange={this.handleSwitchPrivate}
                        />
                      </div>
                    </div>
                    {this.state.switchOn === true && (
                      <div>
                        <textarea
                          id="privateReview"
                          className="form-control rate-description"
                          rows="3"
                          readOnly={this.state.success ? true : false}
                          placeholder="Write your review"
                          onChange={this.handleChange}
                          value={this.state.privateReview}
                        />
                        <div className="words-left">
                          {`${this.state.privateReviewCharsLeft} characters left`}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="messages-wrapper">
                    {this.state.success && (
                      <div className="notification success-message">
                        <span className="success-notification-cap-lg">
                          Thank you.
                        </span>
                        <span className="success-notification-cap-sm">
                          {this.state.message}
                        </span>
                      </div>
                    )}
                    {this.state.error && (
                      <div className="notification error-message">
                        <div className="notification-inner">
                          <img
                            className="img-responsive pic"
                            src="/images/error-icon.svg"
                            alt="Image"
                          />
                          <span className="error-notification-cap-lg">
                            {this.state.message}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="rating-buttons-wrapper">
                    <button
                      className="cancel-btn"
                      onClick={() => this._toggleModal()}
                    >
                      Cancel
                    </button>
                    <button
                      className="submit-btn"
                      onClick={() => this._hanndleSubmit()}
                    >
                      {this.state.submitting && (
                        <PreloaderIcon
                          loader={Oval}
                          size={20}
                          strokeWidth={8} // min: 1, max: 50
                          strokeColor="#fff"
                          duration={800}
                        />
                      )}
                      {this.state.submitting ? "Submitting" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {this.state.success && (
          <Modal
            isOpen={this.state.showThank}
            onRequestClose={() =>
              this.setState({ showThank: false, showModel: false })
            }
            shouldCloseOnOverlayClick={false}
            contentLabel="Thank You"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="payment-success-popup checkout-popup">
              <div className="close-popup rating-success-pop">
                <span
                  className="icon-cancel"
                  onClick={() =>
                    this.setState({
                      showThank: false,
                      showModel: false
                    })
                  }
                />
              </div>
              <img
                className="img-responsive success"
                src="/images/checkout/success-icon-green.png"
              />
              <div className="ps-title">Thank you for submitting a review</div>
              <p>
                Your review is most important to us. This helps to build a more
                safer RYDE community.
              </p>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default RatingForm;
