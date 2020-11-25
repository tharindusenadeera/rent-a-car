import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import moment from "moment";
import Image from "react-shimmer";
class ReviewByMe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrivateReview: false
    };
  }
  render() {
    const { reviews } = this.props;
    const { showPrivateReview } = this.state;
    return (
      <div>
        {reviews &&
          reviews.map((review, index) => {
            return (
              <div className="review-outer reviews-by-me" key={index}>
                <div className="review-header flex-container">
                  <div className="review-header-center">
                    <div className="flex-container main-flex">
                      <Link to="cars" className="trip-car-pic hov-click">
                        <Image
                          src={review.car_photos.data.image_thumb}
                          width={70}
                          height={46}
                          style={{ objectFit: "cover" }}
                        />
                        {/* <img src={review.car_photos.data.image_thumb} /> */}
                      </Link>
                      <div className="flex-left">
                        <div className="flex-container flex-top">
                          <div className="rew-booking-info rew-sep">
                            Trip id -{" "}
                            {review.booking_number && review.booking_number}
                          </div>
                        </div>
                        <div className="flex-container flex-bottom">
                          <div className="rew-booking-info rew-sep rew-car-name">
                            <Link className="hov-click" to={"cars"}>
                              {review.car_name && review.car_name}
                            </Link>
                          </div>
                          <div className="review-header-left rew-sep">
                            <Link
                              className="hov-click"
                              to={"/profile/" + review.id}
                            >
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
                                  width={20}
                                  height={20}
                                  style={{ objectFit: "cover" }}
                                />
                              )}
                            </Link>
                            <Link
                              className="hov-click"
                              to={"/profile/" + review.id}
                            >
                              <div className="rw-name">
                                {review.first_name && review.first_name}
                              </div>
                            </Link>
                          </div>
                          {review.user_rating && review.user_rating > 0 ? (
                            <div className="rew-rating rew-sep">
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
                        </div>
                      </div>
                      <div className="review-header-right">
                        <Link
                          className="hov-click"
                          to={"/booking/" + review.booking_id}
                        >
                          <button>
                            <img
                              src="../../images/more-icon.svg"
                              className="more-icon"
                              alt="More"
                            />
                          </button>
                        </Link>
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
                          className="colap-content-btn hov-click"
                          onClick={e => {
                            this.setState({
                              showPrivateReview: !showPrivateReview
                            });
                          }}
                        >
                          <div className="review-title">Private review</div>
                          {showPrivateReview === false ? (
                            <img
                              src="../../images/more-content-icon.png"
                              alt="More"
                            />
                          ) : (
                            <img
                              src="../../images/less-content-icon.png"
                              alt="More"
                            />
                          )}
                        </button>
                      </div>
                      {showPrivateReview === true && (
                        <div>
                          <div className="private-text">
                            This review is just for you. It won’t appear on your
                            Public profile.
                          </div>
                          <p className="review-description">
                            {review.private_review}
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

export default ReviewByMe;
