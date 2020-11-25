import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import moment from "moment";
import { Button, Menu, Tooltip } from "antd";
import { log } from "util";
import "antd/lib/button/style/index.css";
import "antd/lib/tooltip/style/index.css";
import Image from "react-shimmer";

class ReviewAboutMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrivateReview: false,
      selectedId: null
    };
  }

  menu = props => {
    return (
      <Menu>
        <Menu.Item key={1}>
          <a>Booking details</a>
        </Menu.Item>
      </Menu>
    );
  };

  handleMenu = review => {
    const { history } = this.props;
    history.push(`/booking/${review.booking_id}`);
  };

  handleLeaveYourReview = review => {
    const { history } = this.props;
    history.push(`/booking/${review.booking_id}`);
  };

  render() {
    const { reviews } = this.props;
    const { showPrivateReview, selectedId } = this.state;
    return (
      <div>
        {reviews &&
          reviews.map((review, index) => {
            return (
              <div className="review-outer reviews-about-me" key={index}>
                <div className="review-header flex-container">
                  <div className="review-header-left">
                    <Link className="hov-click" to={"/profile/" + review.id}>
                      {/* <img
                        src={
                          review.profile_image_thumb &&
                          review.profile_image_thumb
                        }
                        className="img-responsive img-circle rw-pic"
                        alt="Review Writer"
                      /> */}
                      {review.profile_image_thumb && (
                        <Image
                          className="img-responsive img-circle rw-pic"
                          alt="Review Writer"
                          src={review.profile_image_thumb}
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </Link>
                  </div>
                  <div className="review-header-center">
                    <Link
                      className="hov-click hidden-xs"
                      to={"/profile/" + review.id}
                    >
                      <div className="rw-name">
                        {review.first_name && review.first_name}
                      </div>
                    </Link>
                    {review.user_rating && review.user_rating > 0 ? (
                      <div className="rew-rating rew-sep visible-xs">
                        <div className="rw-name">
                          {review.first_name && review.first_name}
                        </div>
                        <span style={{ marginLeft: "auto" }}>
                          <span className="rew-rating-count">
                            {review.user_rating && review.user_rating}
                          </span>
                          <span className="rating-mobile-wrap">
                            <Rating
                              emptySymbol="fa fa-star-o"
                              fullSymbol="fa fa-star"
                              fractions={2}
                              initialRating={5}
                              readonly
                            />
                          </span>
                        </span>
                      </div>
                    ) : (
                      <Fragment />
                    )}

                    <div className="flex-container">
                      {review.user_rating && review.user_rating > 0 ? (
                        <div className="rew-rating rew-sep hidden-xs">
                          <span className="rew-rating-count">
                            {review.user_rating && review.user_rating}
                          </span>
                          <Rating
                            emptySymbol="fa fa-star-o"
                            fullSymbol="fa fa-star"
                            fractions={2}
                            initialRating={parseFloat(
                              review.user_rating && review.user_rating
                            )}
                            readonly
                          />
                        </div>
                      ) : (
                        <Fragment />
                      )}

                      <div className="rew-booking-info rew-sep">
                        Trip id -{" "}
                        {review.booking_number && review.booking_number}
                      </div>
                      <div className="rew-booking-info rew-sep">
                        {review.car_name && review.car_name}
                      </div>
                      {review.leave_your_review == true && (
                        <div className="rew-booking-info rew-sep">
                          <Button
                            className="leave-feedback unstyled-btn hov-click"
                            onClick={() => this.handleLeaveYourReview(review)}
                          >
                            <img src="../../images/profilev2/feedback-green-icon.svg" />
                            Leave your review
                          </Button>
                        </div>
                      )}

                      <div className="review-header-right">
                        <div className="con-bs-right">
                          <Tooltip placement="top" title={"Booking details"}>
                            <Button
                              className="unstyled-btn more-options-btn hov-click"
                              onClick={e => this.handleMenu(review, e)}
                            >
                              <span className="icon-set-one-invoice-icon" />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="review-content">
                  <div className="public-review-wrapper">
                    <div className="review-title">Public review</div>
                    <p className="review-description">
                      {review.description && review.description}
                    </p>
                  </div>
                  {review.private_review && (
                    <div className="private-review-wrapper">
                      <div className="private-review-colap">
                        <button
                          className="colap-content-btn"
                          onClick={() => {
                            this.setState({
                              showPrivateReview: !showPrivateReview,
                              selectedId: review._id
                            });
                          }}
                        >
                          <div className="review-title">Private review</div>
                          {selectedId === review._id &&
                          showPrivateReview === true ? (
                            <img
                              src="../../images/less-content-icon.png"
                              alt="More"
                            />
                          ) : (
                            <img
                              src="../../images/more-content-icon.png"
                              alt="More"
                            />
                          )}
                        </button>
                      </div>
                      {showPrivateReview === true && selectedId === review._id && (
                        <div>
                          <div className="private-text">
                            This review is just for you. It won’t appear on your
                            Public profile.
                          </div>
                          <p className="review-description">
                            {review.private_review && review.private_review}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="review-date-bottom">
                    {review.ratingCreated &&
                      moment(review.ratingCreated).format("MMMM Do, YYYY")}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    );
  }
}

//export default withRouter(ReviewAboutMe);
export default connect()(withRouter(ReviewAboutMe));
