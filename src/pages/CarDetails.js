import React, { Component, lazy, Suspense, Fragment } from "react";
import { connect } from "react-redux";
import Rating from "react-rating";
import { Link, withRouter } from "react-router-dom";
import { StickyContainer, Sticky } from "react-sticky";
import axios from "axios";
import queryString from "query-string";
import ReviewsGrid from "../components/rating/ReviewsGrid";
import moment from "moment-timezone";
import { fetchCar, fetchSimilarCars } from "../actions/CarActions";
import TruncateMarkup from "react-truncate-markup";
import Modal from "react-modal";
import OwlCarousel from "react-owl-carousel";
import {
  defaultModelPopup,
  defaultMobileModelPopup,
  PRODUCT_CATALOG_ID
} from "../consts/consts.js";
import UserAuthModel from "../components/forms/UserAuthModel";
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
import Lightbox from "react-images";
import { isMobileOnly, isMobile } from "react-device-detect";
import Helmet from "react-helmet";
import Image from "react-shimmer";
import { LazyImage } from "../components/comman";
import { CAR_V2 } from "../actions/ActionTypes";
import { setTripsData } from "../actions/BookingActions";
import CalenderModel from "../components/car/CalenderModel";
import MainNav from "../components/layouts/MainNav";
import PreLoader from "../components/preloaders/preloaders";
import MainCalander from "../components/car/car-details-page/MainCalander";
import ReactPixel from "react-facebook-pixel";
import { fetchAuthBookingData } from "../api/trips";
import { notification, Icon } from "antd";
import { authFail } from "../actions/AuthAction";

import "react-dates/lib/css/_datepicker.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "antd/lib/notification/style/index.css";

const SimilarCarsCarousel = lazy(() =>
  import("../components/car-details-components/SimilarCarsCarousel")
);
const CarLocationMapView = lazy(() =>
  import("../components/car/CarLocationMapView")
);
const MainFooter = lazy(() => import("../components/layouts/MainFooter"));

Modal.setAppElement("#root");

class CarDetails extends Component {
  constructor(props) {
    super(props);
    const { car, match, dispatch } = props;

    this.state = {
      car: null,
      car_id: match.params.id,
      showViewPopUp: false,
      showModal: false,
      showCalender: false,
      modelView: "",
      car_URL: window.location.href,
      showDescriptionMore: false,
      lightboxIsOpen: false,
      currentImage: 0,
      copyText: false,
      randCode: 2,
      showModelPopUp: false,
      isFavorite: false
    };

    if (car && car.id != match.params.id) {
      dispatch({ type: CAR_V2, payload: null });
    }
  }

  gotoPrevLightboxImage() {
    this.setState({ currentImage: this.state.currentImage - 1 });
  }
  gotoNextLightboxImage() {
    this.setState({ currentImage: this.state.currentImage + 1 });
  }

  componentWillMount() {
    const { car_id } = this.state;
    const { dispatch, car, authenticated } = this.props;

    this.genarateRandomCode();
    const submittedData = localStorage.promotion_a_data;
    let fetchParams = {};
    if (submittedData && authenticated === false) {
      let localData = JSON.parse(submittedData);
      if (localData.email) {
        fetchParams.email = localData.email;
      }
    }

    dispatch(
      fetchCar(
        car_id,
        !car || (car && car.id != car_id) ? true : false,
        fetchParams
      )
    );
    dispatch(fetchSimilarCars(car_id));
  }

  componentDidMount() {
    const { user } = this.props;
    ReactPixel.pageView();
    if (user.id) {
      setTimeout(() => {
        this.saveLiveUser();
      }, 3000);
    }
  }

  _toggleModal = (modelView = null) =>
    this.setState({
      showCalender: !this.state.showCalender,
      modelView: modelView
    });

  saveLiveUser = async () => {
    try {
      const { car } = this.props;
      if (!car.id) {
        return false;
      }
      const url = "car/view/" + car.id;
      if (localStorage.access_token) {
        const response = await await axios.post(
          process.env.REACT_APP_API_URL + url,
          car,
          {
            headers: {
              Authorization: localStorage.access_token
            }
          }
        );
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      console.log("error", error);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.car) {
      this.setState({ isFavorite: nextProps.car.is_auth_user_favorite_car });
      var car_id = nextProps.car.id;
      car_id = String(car_id);
      ReactPixel.track("ViewContent", {
        content_name: nextProps.car.car_name,
        content_ids: car_id,
        content_type: "product",
        value: nextProps.car.daily_rate,
        currency: "USD",
        contents: [{ id: nextProps.car.id, quantity: 2 }],
        product_catalog_id: PRODUCT_CATALOG_ID
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { bookingData } = this.props;

    if (bookingData.delivery_info != prevProps.bookingData.delivery_info) {
      this.openNotification(bookingData.delivery_info);
    }
  }

  openNotification = data => {
    if (data != null) {
      notification.open({
        message: data,
        icon: <Icon type="bell" theme="filled" style={{ color: "#2980B9" }} />,
        duration: 20,
        className: "detail-notification-wrapper"
      });
    } else {
      notification.destroy();
    }
  };

  handleCloseModal = () => {
    this.setState({ showModelPopUp: false });
  };

  lightBoxImages = () => {
    const { car } = this.props;
    if (car && car.car_photos && car.car_photos.data) {
      var arrayList = [];
      car.car_photos.data.map(img => {
        arrayList.push({ src: img.image_path });
      });
      return arrayList;
    } else {
      return [];
    }
  };

  handleFormSubmit = () => {
    const { bookingData, history, match } = this.props;
    const carAvailability = bookingData.car_availability;

    const { from, fromTime, to, toTime } = queryString.parse(
      history.location.search
    );
    ReactPixel.track("InitiateCheckout", {
      content_ids: bookingData.car_id,
      value: bookingData.daily_rate_per_day,
      currency: "USD",
      contents: [{ id: bookingData.car_id, quantity: 1 }],
      num_items: 1,
      content_type: "product"
    });
    if (carAvailability) {
      if (this.props.user.id) {
        history.push(
          `/car-delivery/${match.params.id}/${from}/${fromTime}/${to}/${toTime}`
        );
      } else {
        this.setState({ showModelPopUp: true });
      }
    }
  };

  afterLogin = () => {
    const { history, match, dispatch } = this.props;
    const { from, fromTime, to, toTime } = queryString.parse(
      history.location.search
    );
    const formDate = moment(
      moment(from, "MM-DD-YYYY").format("YYYY-MM-DD") + " " + fromTime
    ).format("YYYY-MM-DD HH:mm");
    const toDate = moment(
      moment(to, "MM-DD-YYYY").format("YYYY-MM-DD") + " " + toTime
    ).format("YYYY-MM-DD HH:mm");
    const searchParams = {
      from_date: formDate,
      to_date: toDate,
      car_id: this.props.match.params.id,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: this.props.timeZoneId
    };
    fetchAuthBookingData(searchParams).then(res => {
      dispatch(setTripsData(res.data.data));
      if (res.data.data.car_availability) {
        history.push(
          `/car-delivery/${match.params.id}/${from}/${fromTime}/${to}/${toTime}`
        );
      } else {
        this.setState({ showModelPopUp: false });
      }
    });
  };

  _toggleFavorites = () => {
    try {
      const { user } = this.props;
      const { isFavorite } = this.state;

      if (user.id) {
        this.setState({ isFavorite: !isFavorite }, () => {
          if (this.state.car_id) {
            let id = this.state.car_id;
            axios.post(
              process.env.REACT_APP_API_URL + `add-to-favorite`,
              { car_id: id },
              {
                headers: {
                  Authorization: localStorage.access_token
                }
              }
            );
          }
        });
      } else {
        this.setState({ showModelPopUp: true });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
    }
  };

  genarateRandomCode = () => {
    const code = 1 + Math.floor(Math.random() * 10);
    this.setState({ randCode: code });
  };

  getPageURL() {
    var copyText = document.getElementById("paste-box");
    copyText.select();
    document.execCommand("copy");
    this.setState({ copyText: true });
  }

  getTimeZoneId = () => {
    const searchQuery = queryString.parse(this.props.history.location.search);
    if (searchQuery.timeZoneId) {
      return searchQuery.timeZoneId;
    }
    return this.props.timeZoneId;
  };

  render() {
    const { bookingData, car, history } = this.props;
    const { from, to, fromTime, toTime } = queryString.parse(
      history.location.search
    );
    const { isFavorite } = this.state;
    let lightBoxImagesList = this.lightBoxImages();

    if (car === null) {
      return (
        <Fragment>
          <MainNav />
          <div className="container" style={{ minHeight: "80vh" }}>
            <PreLoader />
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <MainNav />

        <StickyContainer>
          <Helmet
            title={
              car &&
              car.car_name +
                "Car Rental from $" +
                car.daily_rate +
                "/day | Ryde"
            }
            meta={[
              {
                name: "description",
                content:
                  car &&
                  car.car_name +
                    " Car Rental from $" +
                    car.daily_rate +
                    "/day " +
                    car.car_city +
                    "  from Ryde . Delivery available. Skip the rental counters & save on paperwork."
              }
            ]}
          />
          <div className="checkout-outer">
            {isMobile ? (
              <section className="cars-slider-section">
                {car && (
                  <OwlCarousel
                    className="owl-theme"
                    loop={true}
                    margin={5}
                    center={true}
                    lazyLoad={true}
                    dots={false}
                    autoplay={true}
                    autoplayHoverPause={true}
                    navClass="owl-prev owl-next"
                    responsiveClass={true}
                    responsive={{
                      0: {
                        items: 1,
                        nav: true
                      },
                      480: {
                        items: 1,
                        nav: true
                      },
                      900: {
                        items: 2,
                        nav: true
                      },
                      1200: {
                        items: 2,
                        nav: true
                      }
                    }}
                  >
                    {car.car_photos.data.map((img, index) => {
                      return (
                        <div
                          className="item"
                          key={index}
                          onClick={() =>
                            this.setState({
                              lightboxIsOpen: true,
                              currentImage: index
                            })
                          }
                        >
                          <Image
                            className="img-responsive img-rounded"
                            src={img.image_path}
                            width={345}
                            height={235}
                            style={{ objectFit: "cover" }}
                          />
                          {/* <img
                          className="img-responsive img-rounded"
                          src={img.image_path}
                        /> */}
                        </div>
                      );
                    })}
                  </OwlCarousel>
                )}
              </section>
            ) : (
              <section className="cars-slider-section">
                {car && (
                  <OwlCarousel
                    className="owl-theme"
                    loop={true}
                    margin={5}
                    center={true}
                    lazyLoad={true}
                    dots={false}
                    autoplay={true}
                    autoplayHoverPause={true}
                    navClass="owl-prev owl-next"
                    responsiveClass={true}
                    responsive={{
                      0: {
                        items: 1,
                        nav: true
                      },
                      480: {
                        items: 1,
                        nav: true
                      },
                      900: {
                        items: 2,
                        nav: true
                      },
                      1200: {
                        items: 2,
                        nav: true
                      }
                    }}
                  >
                    {car.car_photos.data.map((img, index) => {
                      return (
                        <div
                          className="item cardetail-slide"
                          key={index}
                          onClick={() =>
                            this.setState({
                              lightboxIsOpen: true,
                              currentImage: index
                            })
                          }
                        >
                          <img
                            className="img-responsive img-rounded"
                            src={img.image_path}
                          />
                        </div>
                      );
                    })}
                  </OwlCarousel>
                )}
              </section>
            )}

            {/* Car Info Fixed - Start */}
            <div>
              {!isMobile && (
                <Sticky topOffset={523} disableHardwareAcceleration={false}>
                  {props => (
                    <section style={props.style} className="fixed-info-section">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-12">
                            <ul className="list-inline page-breadcrumb">
                              <li>
                                <Link to="/">Home</Link>
                              </li>
                              <li>
                                <span className="icon-right-arrow" />
                              </li>
                              <li className="stay">{car && car.car_name}</li>
                            </ul>
                          </div>
                        </div>
                        {car && car.is_insurance_discounted === true && (
                          <div className="row">
                            <div className="col-xs-12">
                              <span>
                                <LazyImage
                                  className="img-responsive"
                                  src="/images/offers/offer-badge.png"
                                />
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="row">
                          {/* -- Promotion --*/}
                          {car && car.december_promotion === 1 && (
                            <div className="col-md-12">
                              <LazyImage
                                className="offer_top_banner"
                                src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-30.png"
                              />
                            </div>
                          )}
                          {car && car.december_promotion === 2 && (
                            <div className="col-md-12">
                              <LazyImage
                                className="offer_top_banner"
                                src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-40.png"
                              />
                            </div>
                          )}
                          {car && car.december_promotion === 3 && (
                            <div className="col-md-12">
                              <LazyImage
                                className="offer_top_banner"
                                src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-75.png"
                              />
                            </div>
                          )}
                          {/* -- Promotion --*/}
                        </div>

                        <div className="row">
                          <div className="col-md-8">
                            <div className="flex-container">
                              <div className="car-main-info-left">
                                <div className="car-main-info name-left">
                                  <div className="car-name">
                                    {car && car.car_name}
                                  </div>
                                </div>
                                <div className="car-main-info price-right visible-xs visible-sm">
                                  <div className="car-price" id="car-price">
                                    $ {car && car.daily_rate}{" "}
                                    <span>per day</span>
                                  </div>
                                </div>
                                <div className="car-main-info-bottom">
                                  {car && car.car_rating > 0 && (
                                    <div className="car-rating horiz-sep">
                                      <span className="rating-count">
                                        {car && car.car_rating}
                                      </span>
                                      <Rating
                                        emptySymbol="fa fa-star-o fa-1x"
                                        fullSymbol="fa fa-star fa-1x"
                                        fractions={2}
                                        readonly
                                        initialRating={car && car.car_rating}
                                      />
                                    </div>
                                  )}
                                  {car && car.trip_count > 0 ? (
                                    <span className="car-trips horiz-sep">
                                      <span className="car-trips-count">
                                        {car.trip_count}
                                      </span>{" "}
                                      trip
                                      {car.trip_count > 1 && "s"}
                                    </span>
                                  ) : (
                                    <span className="car-trips horiz-sep">
                                      <LazyImage
                                        className=""
                                        src="/images/checkout/new-listing.png"
                                      />
                                    </span>
                                  )}
                                  <span className="horiz-sep">
                                    <button
                                      className="share-button"
                                      onClick={() => {
                                        this.setState({ showModal: true });
                                      }}
                                    >
                                      <span className="car-share">
                                        <span className="icon-share" />{" "}
                                        <span className="hidden-xs">Share</span>
                                      </span>
                                    </button>
                                  </span>
                                  <span className="horiz-sep">
                                    {isFavorite ? (
                                      <button
                                        className="favorite-button"
                                        onClick={() => this._toggleFavorites()}
                                      >
                                        <span className="car-favorite">
                                          <span className="icon-set-one-like-filled" />
                                          <span className="hidden-xs RemoveFavorites">
                                            Remove favorites
                                          </span>
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        className="favorite-button"
                                        onClick={() => this._toggleFavorites()}
                                      >
                                        <span className="car-favorite">
                                          <span className="icon-set-one-like" />{" "}
                                          <span className="hidden-xs AddToFavorites">
                                            Add to favorites
                                          </span>
                                        </span>
                                      </button>
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="car-main-info-right">
                                <div className="top-owner-wrapper">
                                  <Link
                                    className="top-owner-mobile"
                                    to={`/profile/${car && car.user.id}`}
                                  >
                                    <div className="top-owner-inner">
                                      {car && (
                                        <LazyImage
                                          className="owner-image-sm img-circle img-responsive"
                                          src={car.user.profile_image_thumb}
                                          width={40}
                                          height={40}
                                          style={{ objectFit: "cover" }}
                                        />
                                      )}

                                      <LazyImage
                                        className="owner-verify-sm"
                                        src="/images/checkout/verify-sm-icon.png"
                                      />
                                    </div>
                                    <div className="owner-name-sm">
                                      {car && car.user.first_name}
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 hidden-xs hidden-sm">
                            <div className="car-main-info price-right">
                              <div className="car-price">
                                $ {car && car.daily_rate} <span>per day</span>
                              </div>
                            </div>
                          </div>
                          {/* <Button type="primary" onClick={openNotification}>
                            Open the notification box
                          </Button> */}
                        </div>
                      </div>
                    </section>
                  )}
                  {/* Car Info Fixed - End */}
                </Sticky>
              )}

              {isMobile && (
                <div>
                  <section className="fixed-info-section">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <ul className="list-inline page-breadcrumb">
                            <li>
                              <Link to="/">Home</Link>
                            </li>
                            <li>
                              <span className="icon-right-arrow" />
                            </li>
                            <li className="stay">{car && car.car_name}</li>
                          </ul>
                        </div>
                      </div>

                      <div className="row">
                        {/* -- Promotion --*/}
                        {car && car.december_promotion === 1 && (
                          <div className="col-md-12">
                            <LazyImage
                              className="offer_top_banner"
                              src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-30.png"
                            />
                          </div>
                        )}
                        {car && car.december_promotion === 2 && (
                          <div className="col-md-12">
                            <LazyImage
                              className="offer_top_banner"
                              src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-40.png"
                            />
                          </div>
                        )}
                        {car && car.december_promotion === 3 && (
                          <div className="col-md-12">
                            <LazyImage
                              className="offer_top_banner"
                              src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/Seasonal-promotion-banner-75.png"
                            />
                          </div>
                        )}
                        {/* -- Promotion --*/}
                      </div>

                      {car && car.is_insurance_discounted === true && (
                        <div className="row">
                          <div className="col-xs-12">
                            <span
                              style={{
                                marginTop: 5,
                                marginBottom: 5,
                                display: "block"
                              }}
                            >
                              <LazyImage
                                className="img-responsive"
                                src="/images/offers/offer-badge.png"
                              />
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col-md-8">
                          <div className="flex-container">
                            <div className="car-main-info-left">
                              <div className="car-main-info name-left">
                                <div className="car-name">
                                  {car && car.car_name}
                                </div>
                              </div>
                              <div className="car-main-info price-right visible-xs visible-sm">
                                <div className="car-price" id="car-price">
                                  $ {car && car.daily_rate} <span>per day</span>
                                </div>
                              </div>
                              {/* <Button type="primary" onClick={openNotification}>
                                Open the notification box [Mobile]
                              </Button> */}
                              <div className="car-main-info-bottom">
                                {car && car.car_rating > 0 && (
                                  <div className="car-rating horiz-sep">
                                    <span className="rating-count">
                                      {car && car.car_rating}
                                    </span>
                                    <Rating
                                      emptySymbol="fa fa-star-o fa-1x"
                                      fullSymbol="fa fa-star fa-1x"
                                      fractions={2}
                                      readonly
                                      initialRating={car && car.car_rating}
                                    />
                                  </div>
                                )}
                                {car && car.trip_count > 0 ? (
                                  <span className="car-trips horiz-sep">
                                    <span className="car-trips-count">
                                      {car.trip_count}
                                    </span>{" "}
                                    trip
                                    {car.trip_count > 1 && "s"}
                                  </span>
                                ) : (
                                  <span className="car-trips horiz-sep">
                                    <img
                                      className=""
                                      src="/images/checkout/new-listing.png"
                                    />
                                    {/* <span className="car-trips-count car-new-listing">New Listing</span> */}
                                  </span>
                                )}
                                <span className="horiz-sep">
                                  <button
                                    className="share-button"
                                    onClick={() => {
                                      this.setState({ showModal: true });
                                    }}
                                  >
                                    <span className="car-share">
                                      <span className="icon-share" />{" "}
                                      <span className="hidden-xs">Share</span>
                                    </span>
                                  </button>
                                </span>
                                <span className="horiz-sep">
                                  <button
                                    className="favorite-button"
                                    onClick={() => this._toggleFavorites()}
                                  >
                                    <span className="car-favorite">
                                      <span
                                        className={
                                          isFavorite
                                            ? "icon-set-one-like"
                                            : "icon-set-one-like-filled"
                                        }
                                      />{" "}
                                      {isFavorite ? (
                                        <span className="hidden-xs RemoveFavorites">
                                          Remove favorites
                                        </span>
                                      ) : (
                                        <span className="hidden-xs AddToFavorites">
                                          Add to favorites
                                        </span>
                                      )}
                                    </span>
                                  </button>
                                </span>
                              </div>
                            </div>
                            <div className="car-main-info-right">
                              <div className="top-owner-wrapper">
                                <Link
                                  className="top-owner-mobile"
                                  to={`/profile/${car && car.user.id}`}
                                >
                                  <div className="top-owner-inner">
                                    {car && (
                                      <LazyImage
                                        className="owner-image-sm img-circle img-responsive"
                                        src={car.user.profile_image_thumb}
                                        width={40}
                                        height={40}
                                        style={{ objectFit: "cover" }}
                                      />
                                    )}
                                    <img
                                      className="owner-verify-sm"
                                      src="/images/checkout/verify-sm-icon.png"
                                    />
                                  </div>
                                  <div className="owner-name-sm">
                                    {car && car.user.first_name}
                                  </div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 hidden-xs hidden-sm">
                          <div className="car-main-info price-right">
                            <div className="car-price">
                              $ {car && car.daily_rate} <span>per day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Car Info Fixed - End */}
                </div>
              )}
            </div>

            {/* Car more info - Start */}
            <section className="more-info-section">
              <div className="container">
                <div className="row">
                  <div className="col-md-4 col-md-push-8">
                    {/* Date / Time Picker - Start */}
                    <div className="car-availability-section">
                      {/* Ishara to work here and show car discount */}
                      {car && car.car_offer[0] && (
                        <div className="car-discount-wrapper">
                          {car.car_offer[0]}
                        </div>
                      )}
                      {car && car.car_offer[1] && (
                        <div className="car-discount-wrapper">
                          {car.car_offer[1]}
                        </div>
                      )}
                      {car && car.car_offer[2] && (
                        <div className="car-discount-wrapper">
                          {car.car_offer[2]}
                        </div>
                      )}
                      <MainCalander
                        timeZoneId={this.getTimeZoneId()}
                        history={history}
                        _fetchBookingData={this._fetchBookingData}
                        match={this.props.match}
                      />
                    </div>
                    {/* Date / Time Picker - End */}

                    {/* Trip price breakdown - Start */}
                    <div className="price-breakdown-section">
                      <div className="flex-container">
                        {bookingData &&
                        bookingData.item_price_break_down != null ? (
                          <div className="flex-left text-normal">
                            Trip price
                          </div>
                        ) : (
                          <div className="flex-left text-normal">
                            Trip price (${" "}
                            {bookingData && bookingData.unit_price} x{" "}
                            {bookingData && bookingData.number_of_dates} days)
                          </div>
                        )}
                        <div className="flex-right text-normal">
                          $ {bookingData && bookingData.item_price}
                        </div>
                      </div>
                      {bookingData && bookingData.car_discount > 0 && (
                        <div className="flex-container">
                          <div className="flex-left text-normal">
                            {bookingData && bookingData.discount_days} (
                            {bookingData && bookingData.car_discount}
                            %)
                          </div>
                          <div className="flex-right text-normal">
                            - $ {bookingData && bookingData.discount_amount}
                          </div>
                        </div>
                      )}
                      {bookingData && bookingData.total_ref_deduct > 0 && (
                        <div className="flex-container">
                          <div className="flex-left text-normal">
                            Car credit
                          </div>
                          <div className="flex-right text-normal">
                            - $ {bookingData && bookingData.total_ref_deduct}
                          </div>
                        </div>
                      )}
                      {bookingData && bookingData.item_price_break_down && (
                        <div className="flex-container">
                          <div className="flex-left text-normal">
                            Price Calender
                          </div>
                          <div className="flex-right text-normal">
                            <a onClick={() => this._toggleModal("calender")}>
                              View
                            </a>
                          </div>
                        </div>
                      )}
                      {bookingData && bookingData.car_discount > 0 ? (
                        <div className="flex-container">
                          <div className="flex-left text-bold">Total</div>
                          <div className="flex-right text-bold">
                            $ {bookingData && bookingData.actual_sub_total}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-container">
                          <div className="flex-left text-bold">Total</div>
                          <div className="flex-right text-bold">
                            $ {bookingData && bookingData.item_price}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Trip price breakdown - End */}

                    {/* Button Section - Start */}

                    {bookingData && !bookingData.car_availability && (
                      <div className="messages-wrapper">
                        <div className="notification error-message">
                          <div className="notification-inner">
                            <LazyImage
                              className="img-responsive pic"
                              src="/images/checkout/exclamation-icon-red.png"
                              alt="Image"
                            />
                            <span className="error-notification-cap-lg">
                              {bookingData.availability_message}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      className={
                        bookingData && bookingData.car_availability
                          ? "rent-button"
                          : "List_disable_btn List_disable_btn_block"
                      }
                      onClick={() => this.handleFormSubmit()}
                      disabled={this.props.isFetching}
                    >
                      Request Booking
                    </button>
                    <div className="wont-charged-text">
                      You won’t be charged yet
                    </div>

                    <div className="car-location-right-section">
                      <h2 className="car-info-head">Car location</h2>
                      <a>
                        {car && car.car_location
                          ? car.car_location
                          : "Not available"}
                      </a>
                      <p>
                        We will share the exact location of the car once the
                        reservation is completed
                      </p>
                    </div>
                    {/* Button Section - End */}

                    <hr />

                    {/* Miles included Section - Start */}
                    <div className="miles-included-section">
                      <h2 className="car-info-head">Miles included</h2>
                      {car &&
                        car.miles_allowed.data.map((data, key) => {
                          return (
                            <div className="flex-container" key={key}>
                              <div className="flex-left text-normal">
                                {data.name}
                              </div>
                              <div className="flex-right text-normal">
                                {data.value}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {/* Miles included Section - End */}

                    <hr />

                    {/* Delivery options Section - Start */}
                    <div className="miles-included-section">
                      <h2 className="car-info-head">Delivery options</h2>
                      <p>{car && car.delivery_option}</p>
                    </div>
                    {/* Delivery options Section - End */}

                    <hr />

                    {/* Insurance provided by Section - Start */}
                    {/* <div className="insurance-provided-section">
                      <div className="flex-container">
                        <div className="flex-left text-normal">
                          <h2 className="car-info-head">
                            Insurance provided by
                          </h2>
                        </div>
                        <div className="flex-right text-normal">
                          <LazyImage
                            className="img-responsive"
                            src="/images/checkout/assurant-sm-logo.png"
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* Insurance provided by Section - End */}

                    {/* <hr /> */}

                    {/* Owner info Section - Start (Hidden Mobile) */}
                    <div className="owner-info-section hidden-xs hidden-sm">
                      <h2 className="car-info-head">Owner info</h2>
                      <div className="flex-container">
                        <Link to={`/profile/${car && car.user.id}`}>
                          {/* <img
                            className="img-responsive img-circle car-owner-pic"
                            src={car && car.user.profile_image_thumb}
                          /> */}
                          {car && (
                            <LazyImage
                              className="img-responsive img-circle car-owner-pic"
                              src={car.user.profile_image_thumb}
                              width={75}
                              height={75}
                              style={{ objectFit: "cover" }}
                            />
                          )}
                        </Link>
                        <div className="owner-info-right">
                          <Link to={`/profile/${car && car.user.id}`}>
                            <div className="cd-owner-name">
                              {car && car.user.first_name}
                            </div>
                          </Link>
                          <div className="cd-owner-member-since">
                            Member since:{" "}
                            {car &&
                              moment(car.user.created_at).format("MMM - YYYY")}
                          </div>
                          {car && car.user.user_rating > 0 && (
                            <Rating
                              emptySymbol="fa fa-star-o fa-1x"
                              fullSymbol="fa fa-star fa-1x"
                              fractions={2}
                              readonly
                              initialRating={car.user.user_rating}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-bold">Verified</div>
                        <div className="flex-right text-normal">
                          <LazyImage
                            className="img-responsive"
                            src="/images/checkout/verify-lg-icon.png"
                          />
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">Trips</div>
                        <div className="flex-right text-normal">
                          {car && car.user.trips}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">Cars</div>
                        <div className="flex-right text-normal">
                          {car && car.user.cars_count}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">
                          Acceptance rate
                        </div>
                        <div className="flex-right text-normal">
                          {car && car.user.acceptance_rate}
                        </div>
                      </div>
                      {car && car.user.response_time && (
                        <div className="flex-container">
                          <div className="flex-left text-normal">
                            Response time
                          </div>
                          <div className="flex-right text-normal">
                            {car && car.user.response_time}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-8 col-md-pull-4">
                    {/* Description */}
                    {car && car.description && (
                      <div className="car-description-section">
                        <h2 className="car-info-head"> Description </h2>
                        {!this.state.showDescriptionMore ? (
                          <div className="abvvv">
                            <TruncateMarkup
                              lines={10}
                              ellipsis={
                                <span>
                                  ... <br />{" "}
                                  <a
                                    className="more-read"
                                    onClick={() =>
                                      this.setState({
                                        showDescriptionMore: true
                                      })
                                    }
                                  >
                                    Read more{" "}
                                    <span className="icon-down-arrow" />{" "}
                                  </a>
                                </span>
                              }
                            >
                              <p>{car.description}</p>
                            </TruncateMarkup>
                          </div>
                        ) : (
                          <p>
                            {car.description}
                            <a
                              className="more-read"
                              onClick={() =>
                                this.setState({ showDescriptionMore: false })
                              }
                            >
                              Read less
                              <span className="icon-up-arrow" />
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Features */}
                    {car && car.features.data.length > 0 && (
                      <div className="car-features-section">
                        <h2 className="car-info-head">Features</h2>
                        <div className="features-list">
                          {car.features.data.map((feature, index) => {
                            return (
                              <span className="features-list-item" key={index}>
                                <span
                                  className={
                                    "features-icon " + feature.icon_name
                                  }
                                />
                                <span>{feature.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Reviews */}
                    <ReviewsGrid car={car} car_id={this.state.car_id} />

                    {/* Location */}
                    {car && (
                      <div className="car-location-section">
                        <h2 className="car-info-head">Car location</h2>
                        <Suspense fallback={<PreLoader />}>
                          <CarLocationMapView car={car} />
                        </Suspense>
                      </div>
                    )}

                    <div className="visible-xs visible-sm">
                      <hr />
                    </div>

                    {/* Owner info Section - Start (Visible Mobile) */}
                    <div className="owner-info-section visible-xs visible-sm">
                      <h2 className="car-info-head">Owner info</h2>
                      <div className="flex-container">
                        <Link to={`/profile/${car && car.user.id}`}>
                          {car && (
                            <LazyImage
                              className="img-responsive img-circle car-owner-pic"
                              src={car.user.profile_image_thumb}
                            />
                          )}
                        </Link>
                        <div className="owner-info-right">
                          <Link to={`/profile/${car && car.user.id}`}>
                            <div className="cd-owner-name">
                              {car && car.user.first_name}
                            </div>
                          </Link>
                          <div className="cd-owner-member-since">
                            Member since:{" "}
                            {car &&
                              moment(car.user.created_at).format("MMM - YYYY")}
                          </div>
                          {car && car.user.user_rating > 0 && (
                            <Rating
                              emptySymbol="fa fa-star-o fa-1x"
                              fullSymbol="fa fa-star fa-1x"
                              fractions={2}
                              readonly
                              initialRating={car.user.user_rating}
                            />
                          )}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-bold">Verified</div>
                        <div className="flex-right text-normal">
                          <LazyImage
                            className="img-responsive"
                            src="/images/checkout/verify-lg-icon.png"
                          />
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">Trips</div>
                        <div className="flex-right text-normal">
                          {car && car.user.trips}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">Cars</div>
                        <div className="flex-right text-normal">
                          {car && car.user.cars_count}
                        </div>
                      </div>
                      <div className="flex-container">
                        <div className="flex-left text-normal">
                          Acceptance rate
                        </div>
                        <div className="flex-right text-normal">
                          {car && car.user.acceptance_rate}
                        </div>
                      </div>
                      {car && car.user.response_time && (
                        <div className="flex-container">
                          <div className="flex-left text-normal">
                            Response time
                          </div>
                          <div className="flex-right text-normal">
                            {car && car.user.response_time}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Owner info Section - End */}

                    <div className="visible-xs visible-sm">
                      <hr />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Car more info - End */}

            <Suspense fallback={<PreLoader />}>
              <SimilarCarsCarousel
                similarCars={this.props.similarCars}
                from={from}
                to={to}
                fromTime={fromTime}
                toTime={toTime}
              />
            </Suspense>

            <Modal
              isOpen={this.state.showModelPopUp}
              onRequestClose={this.handleCloseModal}
              shouldCloseOnOverlayClick={true}
              contentLabel="Modal"
              style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
            >
              <UserAuthModel
                // stack={
                //   localStorage.getItem("_source") == "ads-landing"
                //     ? "signup"
                //     : "checkout"
                // }
                stack="signup"
                callBack={this.afterLogin}
                closeModel={() => {
                  this.setState({ showModelPopUp: false });
                }}
                page="car_detail"
                promoCloseCallBack={this.afterLogin}
              />
            </Modal>

            {/* Share this car popup */}
            {this.props.car && (
              <Modal
                isOpen={this.state.showModal}
                onRequestClose={() => this.setState({ showModal: false })}
                shouldCloseOnOverlayClick={true}
                contentLabel="Modal"
                style={
                  isMobileOnly ? defaultMobileModelPopup : defaultModelPopup
                }
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
                          ref="child"
                          beforeOnClick={() =>
                            this.setState({ showModal: false })
                          }
                          url={this.state.car_URL}
                          quote={this.props.car.car_name}
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
                          beforeOnClick={() =>
                            this.setState({ showModal: false })
                          }
                          url={this.state.car_URL}
                          quote={this.props.car.car_name}
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
                          beforeOnClick={() =>
                            this.setState({ showModal: false })
                          }
                          url={this.state.car_URL}
                          quote={this.props.car.car_name}
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
                          beforeOnClick={() =>
                            this.setState({ showModal: false })
                          }
                          url={this.state.car_URL}
                          quote={this.props.car.car_name}
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
                    value={this.state.car_URL}
                    type="text"
                    readonly
                  />
                </div>
              </Modal>
            )}

            {/*Price Calender Popup*/}
            {this.state.showCalender == true && (
              <Modal
                isOpen={this.state.showCalender}
                onRequestClose={() => this.setState({ showCalender: false })}
                shouldCloseOnOverlayClick={true}
                contentLabel="Modal"
                style={
                  isMobileOnly ? defaultMobileModelPopup : defaultModelPopup
                }
              >
                <div className="share-this-car-popup checkout-popup">
                  <div className="close-popup">
                    <span
                      className="icon-cancel"
                      onClick={() => this.setState({ showCalender: false })}
                    />
                  </div>
                  <CalenderModel
                    itemPriceBreakDown={bookingData.item_price_break_down}
                    startDate={moment(from, "MM-DD-YYYY").format("YYYY-MM-DD")}
                    endDate={moment(to, "MM-DD-YYYY").format("YYYY-MM-DD")}
                  />
                </div>
              </Modal>
            )}

            {lightBoxImagesList.length > 0 && (
              <Lightbox
                images={lightBoxImagesList}
                currentImage={this.state.currentImage}
                enableKeyboardInput={true}
                backdropClosesModal={true}
                onClickThumbnail={e => {
                  this.setState({ currentImage: e });
                }}
                isOpen={this.state.lightboxIsOpen}
                onClickPrev={this.gotoPrevLightboxImage.bind(this)}
                onClickNext={this.gotoNextLightboxImage.bind(this)}
                showThumbnails={true}
                onClose={() => {
                  this.setState({ lightboxIsOpen: false });
                }}
              />
            )}
          </div>
        </StickyContainer>

        <Suspense fallback={<PreLoader />}>
          <MainFooter />
        </Suspense>

        {/* {match.params.cat == "cat0" && authenticated === false && (
          <EmailPopupContent />
        )} */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  bookingData: state.booking.bookingData,
  user: state.user.user,
  verifyPhone: state.user.verifyPhoneNumber,
  car: state.car.car_v2,
  similarCars: state.car.similarCars,
  isFetching: state.common.isFetching,
  timeZoneId: state.common.timeZoneId,
  authenticated: state.user.authenticated
});
export default connect(mapStateToProps)(withRouter(CarDetails));
