import React, { Fragment, Component, useState } from "react";
import Rating from "react-rating";
import Modal from "react-modal";
import { defaultMobileModelPopup } from "../../../../../consts/consts";
import moment from "moment";
import TruncateMarkup from "react-truncate-markup";
import { fetchReviews } from "../../../../../api/car";

const ReivewDescription = ({ description }) => {
  const [visible, setVisible] = useState(false);
  if (visible) {
    return (
      <Fragment>
        <p>{description}</p>
        <a onClick={() => setVisible(!visible)}>Less</a>
      </Fragment>
    );
  }
  return (
    <TruncateMarkup
      lines={5}
      ellipsis={
        <span>
          ... <br /> <a onClick={() => setVisible(!visible)}>More</a>
        </span>
      }
    >
      <p>{description}</p>
    </TruncateMarkup>
  );
};

class Riviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      reviews: [],
      numberOfItem: null,
      showModelPopUp: false
    };
  }

  componentDidMount() {
    const { id } = this.props;
    fetchReviews(id).then(res => {
      const reviews = res.data.reviews;
      this.setState({ reviews, numberOfItem: res.data.reviews.length });
    });
  }

  // chunkArray(myArray, chunk_size = 3) {
  //   var index = 0;
  //   var arrayLength = myArray.length;
  //   var tempArray = [];
  //   var myChunk;

  //   for (index = 0; index < arrayLength; index += chunk_size) {
  //     myChunk = myArray.slice(index, index + chunk_size);
  //     tempArray.push(myChunk);
  //   }

  //   return tempArray;
  // }

  // nextPage = () => {
  //   const { page, reviews } = this.state;
  //   const max = reviews.length - 1;

  //   if (page < max) {
  //     this.setState({ page: page + 1 });
  //   }
  // };
  // previousPage = () => {
  //   const { page } = this.state;
  //   if (page > 0) {
  //     this.setState({ page: page - 1 });
  //   }
  // };

  _toggleModal = () =>
    this.setState({ showModelPopUp: !this.state.showModelPopUp });

  render() {
    const { reviews, showModelPopUp, numberOfItem } = this.state;
    const { car } = this.props;

    if (!reviews.length) {
      return <Fragment />;
    }

    return (
      <Fragment>
        {reviews ? (
          <div className="detail-card inner">
            <div className="flex-align-center">
              <h5>{numberOfItem} Reviews</h5>
              {car && parseInt(car.user.user_rating) ? (
                <Fragment>
                  <Rating
                    emptySymbol="icon-revamp-star-unfilled"
                    fullSymbol="icon-revamp-star-filled"
                    fractions={2}
                    initialRating={parseInt(car.user.user_rating)}
                    readonly
                    className="rate-group padding-left-10"
                  />
                </Fragment>
              ) : null}
            </div>
            <div className="p">
              {reviews.map(
                (
                  {
                    first_name,
                    profile_image_thumb,
                    description,
                    ratingCreated
                  },
                  key
                ) => {
                  if (key > 2) {
                    return <Fragment key={key} />;
                  }
                  return (
                    <div className="review-card" key={key}>
                      <div className="flex-default">
                        <div className="review-avatar-wrapper">
                          <img
                            src={profile_image_thumb}
                            className="avatar-small"
                          />
                        </div>
                        <div className="review-card-host-detail">
                          <span className="font-16 font-semibold">
                            {first_name}
                          </span>
                          <span className="font-12 font-medium date">
                            {moment(ratingCreated).format("MMM DD, YYYY")}
                          </span>
                          <ReivewDescription description={description} />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            {numberOfItem > 3 && (
              <div className="slide-controls flex-default">
                <button
                  className="default-btn classic"
                  onClick={() => this._toggleModal()}
                >
                  <span className="icon-set-one-arrow-right-icon"></span>
                </button>
                {/* <button className="default-btn classic" onClick={this.previousPage}>
              <span className="icon-set-one-arrow-left-icon"></span>
            </button>
            <button className="default-btn classic" onClick={this.nextPage}>
              <span className="icon-set-one-arrow-right-icon"></span>
            </button> */}
              </div>
            )}
          </div>
        ) : null}

        <Modal
          isOpen={showModelPopUp}
          onRequestClose={this._toggleModal}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={defaultMobileModelPopup}
        >
          <div className="mobile-modal">
            <div className="mobile-modal-header flex-justify-spacebetween flex-align-center">
              <span
                className="icon-cancel"
                onClick={() => this._toggleModal()}
              />
              <div className="flex-justify-spacebetween flex-align-center">
                <h6>Reviews</h6>
              </div>
              <p></p>
            </div>
            <div className="mobile-modal-body full-height">
              <div className="content-page">
                <div className="inner-z">
                  {reviews.map(
                    (
                      {
                        first_name,
                        profile_image_thumb,
                        description,
                        ratingCreated
                      },
                      key
                    ) => {
                      return (
                        <div className="review-card" key={key}>
                          <div className="flex-default">
                            <div className="review-avatar-wrapper">
                              <img
                                src={profile_image_thumb}
                                className="avatar-small"
                              />
                            </div>
                            <div className="review-card-host-detail">
                              <span className="font-16 font-semibold">
                                {first_name}
                              </span>
                              <span className="font-12 font-medium date">
                                {moment(ratingCreated).format("MMM DD, YYYY")}
                              </span>
                              <ReivewDescription description={description} />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="content-page">
            <div className="inner">
              <div className="p">
                <button onClick={() => this._toggleModal()}>Close</button>
                {reviews.map(
                  (
                    {
                      first_name,
                      profile_image_thumb,
                      description,
                      ratingCreated
                    },
                    key
                  ) => {
                    return (
                      <div className="review-card" key={key}>
                        <div className="flex-default">
                          <img
                            src={profile_image_thumb}
                            className="avatar-small"
                          />
                          <div className="review-card-host-detail">
                            <span className="font-16 font-semibold">
                              {first_name}
                            </span>
                            <span className="font-12 font-medium date">
                              {moment(ratingCreated).format("MMM DD, YYYY")}
                            </span>
                            <ReivewDescription description={description} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div> */}
        </Modal>
      </Fragment>
    );
  }
}

export default Riviews;
