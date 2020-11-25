import React, { Component, Fragment, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import moment from "moment";
import OwlCarousel from "react-owl-carousel";
import Rating from "react-rating";
import axios from "axios";
import { Skeleton } from "antd";
import queryString from "query-string";
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
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../consts/consts.js";
import MainNav from "../components/layouts/MainNav";
import { getNewPublicProfileReviews } from "../actions/UserActions.js";
import ProfilePagination from "../components/profile/lib/ProfilePagination";
import { LazyImage } from "../components/comman";
import "antd/lib/skeleton/style/index.css";
import PreLoader from "../components/preloaders/preloaders.js";
import { PAGE_NOT_FOUND } from "../actions/ActionTypes.js";
import checkPage from "../components/pageNotFound";

const MainFooter = lazy(() => import("../components/layouts/MainFooter"));

Modal.setAppElement("#root");

class PublicProfile extends Component {
  constructor(props) {
    super(props);

    const caliDateTime = moment()
      .add(3, "hours")
      .tz("America/Los_Angeles");
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add("minutes", remainder)
      .format("HH:mm");

    this.state = {
      user: null,
      from: moment(),
      fromTime: timeToDisplay,
      to: moment().add(3, "days"),
      toTime: timeToDisplay,
      readMore: false,
      showModal: false,
      profile_URL: window.location.href,
      copyText: false,
      page: 1
    };
  }

  setUrlForCars = car => {
    const { from, to, fromTime, toTime } = this.state;
    return {
      pathname: `/car/${car.year} ${car.car_make.name} ${car.car_model.name}/${car.id}`,
      search: queryString.stringify({
        from: from.format("MM-DD-YYYY"),
        fromTime: fromTime,
        to: to.format("MM-DD-YYYY"),
        toTime: toTime,
        _from: "cardetails"
      })
    };
  };

  _userCars() {
    const { user, from, to, fromTime, toTime } = this.state;
    const usersCars = user ? user.cars : null;

    const reviews =
      user && user.reviews ? user.reviews[user.reviews.length - 1] : null;

    const responsiveOptionsFullwidth = {
      0: {
        items: 1,
        nav: true
      },
      480: {
        items: 2,
        nav: true
      },
      // 768: {
      //   items: 2
      // },
      900: {
        items: 3,
        nav: true
      },
      1200: {
        items: 3,
        nav: true
      }
    };

    return (
      //  3 cars
      <div className="container less-cars-wrapper">
        <div className="row">
          <div className="col-md-12">
            <OwlCarousel
              className="owl-theme"
              // center={true}
              responsiveClass={true}
              responsive={responsiveOptionsFullwidth}
              margin={15}
              loop={false}
              dots={false}
              lazyLoad={true}
              navClass="owl-prev owl-next"
            >
              {usersCars &&
                usersCars.map((item, k) => {
                  return (
                    <div key={k} className="item cars-box">
                      <Link
                        className="cars-box-link"
                        to={this.setUrlForCars(item)}
                      >
                        <LazyImage
                          width={400}
                          height={248}
                          withloader="content-loader"
                          className="img-responsive"
                          src={
                            item.car_photo &&
                            item.car_photo.length &&
                            item.car_photo[0].image_thumb
                              ? item.car_photo[0].image_thumb
                              : ""
                          }
                        />
                        {/* <Image
                          className="img-responsive"
                          src={item.car_photo[0].image_path}
                          width={300}
                          height={250}
                          style={{ objectFit: "cover" }}
                        /> */}
                        <div className="car-info car-info-top">
                          <h1>{item.car_name}</h1>
                          <span className="car-rate-lg">
                            ${item.daily_rate}
                          </span>
                          {/* <span className="car-trips ct-per-day visible-xs">Per Day</span> */}
                        </div>
                        <div className="car-info car-info-bottom">
                          {item.car_rating != 0 ? (
                            <Rating
                              emptySymbol="fa fa-star-o fa-2x"
                              fullSymbol="fa fa-star fa-2x"
                              fractions={2}
                              initialRating={parseInt(item.car_rating)}
                              readonly
                            />
                          ) : null}
                          {item.booking_count.trip_count == 0 ? (
                            <span className="car-trips">New Listing</span>
                          ) : (
                            <span className="car-trips">
                              {item.booking_count.trip_count}{" "}
                              {item.booking_count.trip_count == 1
                                ? "trip"
                                : "trips"}
                            </span>
                          )}
                          <span className="car-trips ct-per-day">Per Day</span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </OwlCarousel>
          </div>
        </div>
      </div>
    );
  }

  componentWillMount = async () => {
    const { dispatch } = this.props;
    dispatch(getNewPublicProfileReviews(this.props.match.params.id));
    this.fetchUserNew();
  };

  fetchUserNew = async () => {
    const { dispatch } = this.props;
    try {
      const response = await await axios.get(
        `${process.env.REACT_APP_API_URL}v2/profile/${this.props.match.params.id}`
      );
      if (!response.data.error) {
        this.setState({ user: response.data.users });
      }
    } catch (error) {
      if (error.response && error.response.data.status_code == 404) {
        dispatch({ type: PAGE_NOT_FOUND, payload: true });
      }
    }
  };

  onChangePagination = page => {
    const { dispatch } = this.props;
    this.setState({ page });
    dispatch(
      getNewPublicProfileReviews(this.props.match.params.id, { page: page })
    );
  };

  _itemReviews() {
    const { reviews } = this.props;
    return (
      reviews &&
      reviews.data.map((review, k) => {
        return (
          <div className="row" key={k}>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="review-wrapper">
                {review ? (
                  <a href={`/profile/${review.id}`}>
                    <img
                      style={{ width: 100 }}
                      className="img-responsive img-circle"
                      src={review.profile_image_thumb}
                      alt=""
                    />
                  </a>
                ) : null}
                <div className="review-right">
                  <p>{review.description}</p>
                  <a href={`/profile/${review.id}`}>
                    <span className="re-name">{review.first_name}</span>
                  </a>
                  <span className="re-date">
                    {moment(review.ratingCreated).format("MMMM DD")},{" "}
                    {moment(review.ratingCreated).format("YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })
    );
  }

  readMoreFunction() {
    this.setState({ readMore: !this.state.readMore });
  }

  experiencesList(data) {
    var readMore = <a>Read More...</a>;
    return (
      <div className="row row-flex experience-row-sep">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-sm-push-6 col-md-push-6 col-lg-push-6 ex-right">
          <div className="ex-right-inner experience-inner">
            {/* <img className="img-responsive" src={data.image_path} alt="" /> */}
            <LazyImage
              className="img-responsive"
              src={data.image_path}
              width={500}
              height={500}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        {data.experience.length > 300 ? (
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-sm-pull-6 col-md-pull-6 col-lg-pull-6 ex-left">
            <div className="ex-left-inner experience-inner">
              {this.state.readMore == false ? (
                <p>
                  {data.experience.substr(0, 300)}
                  <a
                    onClick={() => {
                      this.readMoreFunction();
                    }}
                  >
                    {" "}
                    + Read More...
                  </a>
                </p>
              ) : (
                <p>
                  {data.experience}
                  <a
                    onClick={() => {
                      this.readMoreFunction();
                    }}
                  >
                    {" "}
                    + Read Less...
                  </a>
                </p>
              )}
              <span className="extime">
                {moment(data.created_at).format("MMMM Do YYYY")}
              </span>
            </div>
          </div>
        ) : (
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-sm-pull-6 col-md-pull-6 col-lg-pull-6 ex-left">
            <div className="ex-left-inner experience-inner">
              <p>{data.experience}</p>
              <span className="extime">
                {moment(data.created_at).format("MMMM Do YYYY")}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  getPageURL() {
    var copyText = document.getElementById("paste-box");
    copyText.select();
    document.execCommand("copy");
    this.setState({ copyText: true });
  }

  render() {
    const { user, from, to, fromTime, toTime } = this.state;
    const usersCars = user ? user.cars : null;
    const favoriteCars = user ? user.favorite_car : null;
    const languages = user ? user.languages : null;
    const reviewsMeta = this.props.reviews && this.props.reviews.meta;
    const experiences = user && user.experiences[0];

    const carRoute =
      "/" +
      from.format("MM-DD-YYYY") +
      "/" +
      fromTime +
      "/" +
      to.format("MM-DD-YYYY") +
      "/" +
      toTime;
    const _userCars = this._userCars();

    const responsiveOptionsNew = {
      0: {
        items: 1,
        nav: true
      },
      480: {
        items: 2,
        nav: true
      },
      900: {
        items: 3,
        nav: true
      },
      1200: {
        items: 3,
        nav: true
      }
    };

    return (
      <Fragment>
        <MainNav />
        <div id="profile-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-5 col-md-3 col-lg-3">
                <div className="pro-image-wrapper">
                  <LazyLoadImage
                    className="img-rounded img-responsive"
                    effect="blur"
                    src={
                      user && user.profile_image
                        ? user.profile_image
                        : "/images/imageLoading.gif"
                    }
                  />
                </div>
                <div className="visible-xs">
                  <div className="pro-name-wrapper">
                    {user ? (
                      <Fragment>
                        <h1 className="pro-name">
                          {user && user.first_name} {user && user.last_name}
                        </h1>
                        <LazyImage
                          src="/images/profile-verified.svg"
                          alt="Profile Pic"
                          className="pro-verified img-rounded img-responsive"
                        />
                      </Fragment>
                    ) : (
                      <Skeleton active />
                    )}
                  </div>

                  <div className="profile-share-wrapper">
                    <button
                      className="share-button"
                      onClick={() => {
                        this.setState({ showModal: true });
                      }}
                    >
                      <span className="profile-share">
                        <span className="icon-share" />{" "}
                        <span className="pro-share-text">Share</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="pro-info-wrapper visible-xs">
                  <div className="info-icons">
                    <div className="member-since member-since-mobile icon">
                      <LazyImage
                        width="18px"
                        src="/images/user-icon.svg"
                        alt="Profile Pic"
                        className="img-responsive"
                      />
                      Member Since{" "}
                      {user && moment(user.created_at).format("MMMM - YYYY")}
                    </div>
                    <div className="member-location member-location-mobile icon">
                      <LazyImage
                        width="18px"
                        src="/images/location-icon.svg"
                        alt="Profile Pic"
                        className="img-responsive"
                      />
                      {user && user.city}
                    </div>
                  </div>
                </div>

                <div className="visible-xs">
                  <div className="pro-collect-wrapper">
                    {user && user.user_rating ? (
                      <div className="pro-collect-inner">
                        <h2>{user && user.user_rating}</h2>
                        <img src="/images/star.svg" alt="Rating" />
                      </div>
                    ) : null}
                    <div className="pro-collect-inner">
                      <h2>{user && user.trips}</h2>
                      <span className="pc-text-right">
                        {user && user.trips == 1 ? "Trip" : "Trips"}
                      </span>
                    </div>
                    {user && user.cars.length != 0 ? (
                      <div className="pro-collect-inner">
                        <h2>{user && user.cars.length}</h2>
                        <span className="pc-text-right">
                          {user && user.cars.length == 1 ? "Car" : "Cars"}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="pro-verified-info">
                  <ul className="list-unstyled">
                    {user && user.verified_phone == 1 ? (
                      <li>
                        Phone Number Verified{" "}
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                        />
                      </li>
                    ) : null}
                    {user && user.status == 1 ? (
                      <li>
                        Email Verified{" "}
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                        />
                      </li>
                    ) : null}
                    {user && user.status == 1 ? (
                      <li>
                        Approved
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                        />
                      </li>
                    ) : null}
                    {user && user.status == 1 ? (
                      <li>
                        Listed a Car{" "}
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                        />
                      </li>
                    ) : null}
                    {user && user.reviews && user.reviews_count > 3 ? (
                      <li>
                        Reviewed - {user.review_count} reviews{" "}
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                        />
                      </li>
                    ) : null}

                    {user && user.facebook_friends_count > 0 && (
                      <li>
                        Facebook - {user && user.facebook_friends_count} friends{" "}
                        <LazyImage
                          src="/images/check-mark.svg"
                          alt="Verified Icon"
                          title="Verified"
                        />
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="col-xs-12 col-sm-7 col-md-9 col-lg-9">
                {user ? (
                  <Fragment>
                    <div className="pro-name-wrapper hidden-xs">
                      <h1 className="pro-name">
                        {user && user.first_name}{" "}
                        {user &&
                          user.last_name &&
                          user.last_name.charAt(0) + "."}
                      </h1>
                      <LazyImage
                        src="/images/profile-verified.svg"
                        alt="Profile Pic"
                        className="pro-verified img-rounded img-responsive"
                      />
                    </div>

                    <div className="profile-share-wrapper hidden-xs">
                      <button
                        className="share-button"
                        onClick={() => {
                          this.setState({ showModal: true });
                        }}
                      >
                        <span className="profile-share">
                          <span className="icon-share" />{" "}
                          <span className="pro-share-text">Share</span>
                        </span>
                      </button>
                    </div>

                    <div className="pro-info-wrapper hidden-xs">
                      <ul className="list-unstyled list-inline info-icons">
                        <li className="member-since icon">
                          Member Since{" "}
                          {user &&
                            moment(user.created_at).format("MMMM - YYYY")}
                        </li>
                        <li className="member-location icon">
                          {user && user.city}
                        </li>
                      </ul>
                    </div>

                    <div className="pro-collect-wrapper hidden-xs">
                      {user && user.user_rating ? (
                        <div className="pro-collect-inner">
                          <h2>{user && user.user_rating}</h2>
                          <LazyImage src="/images/star.svg" alt="Rating" />
                        </div>
                      ) : null}
                      <div className="pro-collect-inner">
                        <h2>{user && user.trips}</h2>
                        <span className="pc-text-right">
                          {user && user.trips == 1 ? "Trip" : "Trips"}
                        </span>
                      </div>
                      {user && user.cars.length != 0 ? (
                        <div className="pro-collect-inner">
                          <h2>{user && user.cars.length}</h2>
                          <span className="pc-text-right">
                            {user && user.cars.length == 1 ? "Car" : "Cars"}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="pro-more-info-wrapper">
                      <p>{user && user.bio}</p>
                      {user && languages.length > 0 && (
                        <div className="pro-lang">
                          <h5>LANGUAGES</h5>
                          {languages.map((item, id) => {
                            return <span key={id}>{item.name}, </span>;
                          })}
                        </div>
                      )}

                      {user && user.work && (
                        <div>
                          <h5>WORK</h5>
                          <p>{user.work}</p>
                        </div>
                      )}

                      {user && user.school && (
                        <div>
                          <h5>SCHOOL</h5>
                          <p>{user.school}</p>
                        </div>
                      )}
                    </div>
                  </Fragment>
                ) : (
                  <Skeleton active paragraph={true} rows={10} />
                )}
              </div>
            </div>
            <hr className="border" />
            <section className="reviews">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="sec-header">
                    <h2>
                      <span className="text-bold">REVIEWS</span>
                    </h2>
                  </div>
                </div>
              </div>
              {this.props.reviews && this.props.reviews.data.length > 0 ? (
                this._itemReviews()
              ) : (
                <p className="empty-info">
                  {user && user.first_name} doesn’t have any reviews yet
                </p>
              )}
              <div className="row">
                <div className="pubprof-pagination">
                  {reviewsMeta && reviewsMeta.pagination.total_pages > 1 && (
                    <ProfilePagination
                      onChange={this.onChangePagination}
                      total={reviewsMeta.pagination.total}
                      pageSize={reviewsMeta.pagination.per_page}
                      current={this.state.page}
                    />
                  )}
                </div>
              </div>
            </section>
            <hr className="border" />
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="sec-header-wrapper sec-header">
                      {user ? (
                        <h2>
                          <span className="text-bold">
                            {user && user.first_name}'s
                          </span>{" "}
                          EXPERIENCES
                        </h2>
                      ) : null}
                      {/* {(recentExperiences)? <a className="view-more hidden-xs" href="#">+ View More</a> : null } */}
                    </div>
                  </div>
                </div>
                {experiences && this.experiencesList(experiences)}
                {!experiences && (
                  <p className="empty-info">
                    {user && user.first_name} hasn't shared any experience yet
                  </p>
                )}
                {/* <div className="row visible-xs">
                            <div className="col-xs-12">
                                <div className="sec-header">
                                {(recentExperiences)?   <a className="view-more" href="#">+ View More</a> : null }
                                </div>
                            </div>
                        </div> */}
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <hr className="border" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="co-cars-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="sec-header">
                    {user ? (
                      <h2>
                        <span className="text-bold">{user.first_name}’S</span>{" "}
                        CARS
                      </h2>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {usersCars && usersCars.length ? (
              _userCars
            ) : (
              <div className="container">
                <p className="empty-info">
                  {user && user.first_name} doesn’t have any cars yet
                </p>
              </div>
            )}
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <hr className="border" />
                </div>
              </div>
            </div>
          </section>
          <section className="co-fav-cars-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="sec-header">
                    {user ? (
                      <h2>
                        <span className="text-bold">
                          {user && user.first_name}’S
                        </span>{" "}
                        FAVORITES
                      </h2>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {favoriteCars && favoriteCars.length ? (
              <div className="container">
                <OwlCarousel
                  className="owl-theme"
                  center={false}
                  responsiveClass={true}
                  responsive={responsiveOptionsNew}
                  margin={15}
                  nav
                  autoplay={favoriteCars.length > 4 ? true : false}
                  dots={false}
                  lazyLoad={true}
                  navClass="owl-prev owl-next"
                >
                  {favoriteCars.map((item, k) => {
                    return (
                      <div key={k} className="item cities-box">
                        <Link
                          className="cars-box-link"
                          to={this.setUrlForCars(item)}
                        >
                          <LazyImage
                            withloader="content-loader"
                            className="img-responsive"
                            width={400}
                            height={248}
                            src={item.car_photo[0].image_thumb}
                          />
                          <div className="car-info-sm car-info-top-sm">
                            <h1>{item.car_name}</h1>
                            <span className="car-rate-lg">
                              ${item.daily_rate}
                            </span>
                            {/* <span className="car-trips ct-per-day visible-xs">Per Day</span> */}
                          </div>
                          <div className="car-info-sm car-info-bottom">
                            {item && item.car_rating != 0 ? (
                              <Rating
                                emptySymbol="fa fa-star-o fa-2x"
                                fullSymbol="fa fa-star fa-2x"
                                fractions={2}
                                initialRating={parseInt(item.car_rating)}
                                readonly
                              />
                            ) : null}
                            {item.booking_count.trip_count == 0 ? (
                              <span className="car-trips-sm">New Listing</span>
                            ) : (
                              <span className="car-trips-sm">
                                {item.booking_count.trip_count}{" "}
                                {item.booking_count.trip_count == 1
                                  ? "trip"
                                  : "trips"}
                              </span>
                            )}
                            <span className="car-trips car-trips-sm ct-per-day">
                              Per Day
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </OwlCarousel>
              </div>
            ) : (
              <div className="container">
                <p className="empty-info">
                  {user && user.first_name} doesn’t have any favorites yet
                </p>
              </div>
            )}
          </section>

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
              <div className="ps-title">Share this profile</div>
              <div className="share-icons-wrapper">
                <ul className="share-icon-list list-unstyled">
                  <li className="share-icon-inner">
                    <FacebookShareButton
                      ref="child"
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.state.profile_URL}
                      quote={user && user.first_name}
                      className="Demo__some-network__share-button"
                    >
                      <div className="social-icon-wrapper">
                        <FacebookIcon ref="child" size={40} round />
                        <div className="social-icon-text">Facebook</div>
                      </div>
                    </FacebookShareButton>
                    {/*<Link to="#"><img className="img-responsive" src="/images/checkout/share-facebook-icon.png" /> Facebook</Link>*/}
                  </li>
                  <li className="share-icon-inner">
                    <TwitterShareButton
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.state.profile_URL}
                      quote={user && user.first_name}
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
                      url={this.state.profile_URL}
                      quote={user && user.first_name}
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
                      url={this.state.profile_URL}
                      quote={user && user.first_name}
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
              <button
                className="copy-link"
                onClick={this.getPageURL.bind(this)}
              >
                {!this.state.copyText ? "Click to copy link" : "Copyed"}
              </button>
              <input
                className="copy-link-field"
                id={"paste-box"}
                value={this.state.profile_URL}
                type="text"
                readOnly={true}
              />
            </div>
          </Modal>
        </div>

        <Suspense fallback={<PreLoader />}>
          <MainFooter />
        </Suspense>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  usersCars: state.car.usersCars,
  usersBookings: state.booking.users_bookings,
  reviews: state.user.newPublicProfileReviews
});

export default connect(mapStateToProps)(checkPage(PublicProfile));
