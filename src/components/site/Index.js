import React, { Component, Fragment, lazy, Suspense } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import Helmet from "react-helmet";
import "antd/lib/skeleton/style/index.css";
import "react-dates/lib/css/_datepicker.css";
import MainNav from "../../components/layouts/MainNav";
import * as testimonialsConst from "../../consts/testimonials";
import { LazyImage } from "../comman";
import PromotionBanner from "../home-page-components/banners/PromotionBanner";
import PreLoader from "../preloaders/preloaders";

const Section1 = lazy(() => import("../home-page-components/Section1"));
const Section2 = lazy(() => import("../home-page-components/section2"));
const RydeCities = lazy(() => import("../home-page-components/RydeCities"));
const FeaturedRydes = lazy(() =>
  import("../home-page-components/FeaturedRydes")
);
const RydePlayVideo = lazy(() =>
  import("../home-page-components/RydePlayVideo")
);
const RydeDownloadMobileApp = lazy(() =>
  import("../home-page-components/RydeDownloadMobileApp")
);
const VideoPlayer = lazy(() => import("./VideoPlayer"));
const Testimonials = lazy(() => import("../home-page-components/Testimonials"));
const RentalExperience = lazy(() =>
  import("../home-page-components/RentalExperience")
);
const PopularVehicleBrands = lazy(() =>
  import("../home-page-components/PopularVehicleBrands")
);
const RentCarLandingPageSection = lazy(() =>
  import("../home-page-components/RentCarLandingSection")
);
const AvailablePickupAirport = lazy(() =>
  import("../home-page-components/AvailablePickupAirport")
);
const RydeAirports = lazy(() => import("../home-page-components/RydeAirports"));
const MainFooter = lazy(() => import("../layouts/MainFooter"));

class Index extends Component {
  constructor(props) {
    super(props);
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(props.timeZoneId);
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");
    const fromDate = moment(
      moment(caliDateTime)
        .add(remainder, "minutes")
        .format("YYYY-MM-DD") +
        " " +
        timeToDisplay
    );
    const roundedNow = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );
    const minFrom = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD");
    let minToDate = moment(fromDate.add(3, "hours")).format("YYYY-MM-DD");

    this.state = {
      showPlayer: false,
      couponCode: "",
      address: "",
      lat: "",
      lng: "",
      search: true,
      from: fromDate,
      minFrom: minFrom,
      minTo: minToDate,
      roundedNow: roundedNow,
      to: moment(fromDate).add(3, "days"),
      insurancePromotion: false,
      couponObj: null
    };
  }

  _toggleVideoPlayer = () =>
    this.setState({ showPlayer: !this.state.showPlayer });

  componentWillMount() {
    document.body.classList.remove("login");
    document.body.classList.remove("signup");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.first_ryde_coupon_banner)
      this.setState({ couponObj: nextProps.user.first_ryde_coupon_banner });
  }

  render() {
    const heroLosAngeles = {
      background:
        'url("https://cdn.rydecars.com/static-images/los-angeles-bg.png") no-repeat',
      backgroundSize: "cover",
      backgroundPosition: "bottom center"
    };
    const heroSanDiego = {
      background:
        'url("https://cdn.rydecars.com/static-images/san-diego-bg.png") no-repeat',
      backgroundSize: "cover",
      backgroundPosition: "bottom center"
    };
    const heroSanFrancisco = {
      background:
        'url("https://cdn.rydecars.com/static-images/san-francisco-bg.png") no-repeat',
      backgroundSize: "cover",
      backgroundPosition: "bottom center"
    };
    const heroMiami = {
      background:
        'url("https://cdn.rydecars.com/static-images/miami-bg.png") no-repeat',
      backgroundSize: "cover",
      backgroundPosition: "bottom center"
    };

    let mainBannerBgImageCssClass = "";
    let isLosAngeles = false;
    let isSanDiego = false;
    let isSanFrancisco = false;
    let isMiami = false;
    let isMain = false;

    let citiesLocationData = {};

    switch (this.props.match.params.city) {
      case "los-angeles":
        isLosAngeles = true;
        mainBannerBgImageCssClass = heroLosAngeles;
        citiesLocationData = {
          address: "Los Angeles, CA, USA",
          lat: "34.0522342",
          lng: "-118.2436849"
        };
        break;
      case "san-diego":
        isSanDiego = true;
        mainBannerBgImageCssClass = heroSanDiego;
        citiesLocationData = {
          address: "San Diego, CA, USA",
          lat: "32.715738",
          lng: "-117.16108380000003"
        };
        break;
      case "san-francisco":
        isSanFrancisco = true;
        mainBannerBgImageCssClass = heroSanFrancisco;
        citiesLocationData = {
          address: "San Francisco, CA, USA",
          lat: "37.7749295",
          lng: "-122.41941550000001"
        };
        break;
      case "miami":
        isMiami = true;
        mainBannerBgImageCssClass = heroMiami;
        citiesLocationData = {
          address: "Miami, FL, USA",
          lat: "25.7616798",
          lng: "-80.19179020000001"
        };
        break;
      default:
        isMain = true;
        break;
    }

    let landingPageProps = {
      isLosAngeles,
      isSanDiego,
      isSanFrancisco,
      isMiami,
      isMain,
      city: this.props.match.params.city
    };

    return (
      <Fragment>
        <Helmet
          title="Rent The Perfect Car Or Earn Money Renting Your Car | RYDE"
          meta={[
            {
              name: "description",
              content:
                "With RYDE, rent the perfect car from a trusted local owner or earn money by renting your own car to verified renters from our community."
            }
          ]}
        />
        <div className="site-index">
          {/* Coupon - Start */}
          {/* {couponObj && couponObj.activation && couponObj.data && (
            <TopBanner data={couponObj.data} />
          )} */}
          {/* Coupon - End */}

          {/* <div className={`hero ${mainBannerBgImageCssClass}`}>  */}

          <div
            className="hero"
            style={mainBannerBgImageCssClass ? mainBannerBgImageCssClass : {}}
          >
            <div className="home-main-menu">
              <MainNav cssClass="home-navigation" showBanner={false} />
            </div>
            <Suspense fallback={""}>
              <Section1 landingPageProps={landingPageProps} />
            </Suspense>
          </div>

          <PromotionBanner />

          <Suspense fallback={<PreLoader />}>
            <FeaturedRydes
              from={this.state.from}
              to={this.state.to}
              fromTime={this.state.from.format("HH:mm")}
              toTime={this.state.to.format("HH:mm")}
              landingPageProps={landingPageProps}
            />
          </Suspense>
          {isMain ? (
            <Fragment>
              <Suspense fallback={<PreLoader />}>
                <Section2
                  props={this.props}
                  from={this.state.from}
                  to={this.state.to}
                  source={localStorage.getItem("_source")}
                />
              </Suspense>

              {/* Rent a car Section - End - Only for pages */}

              <Suspense fallback={<PreLoader />}>
                <RydeCities />
              </Suspense>

              {/* RYDE airports link - End - Only for pages */}

              <Suspense fallback={<PreLoader />}>
                <RydePlayVideo onClick={this._toggleVideoPlayer} />
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <RydeDownloadMobileApp />
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <Testimonials isMain={isMain}>
                  {testimonialsConst.MAING_PAGE_TESTIMONIALS.map(
                    (data, index) => {
                      return (
                        <div className="item" key={index}>
                          <div className="media">
                            <div className="media-body">
                              <p>{data.text}</p>
                              <p className="writer">{data.writer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </Testimonials>
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <VideoPlayer
                  showPlayer={this.state.showPlayer}
                  _toggleVideoPlayer={this._toggleVideoPlayer}
                />
              </Suspense>
            </Fragment>
          ) : (
            <Fragment>
              <Suspense fallback={<PreLoader />}>
                <Testimonials isMain={isMain}>
                  {testimonialsConst.LANDING_PAGE_TESTIMONIALS.map(
                    (data, index) => {
                      return (
                        <div className="item" key={index}>
                          <div className="media">
                            <div className="media-body">
                              <p className="writer-description">{data.text}</p>
                              {/* <div className="ct-user-rating">
                                <Rating
                                  emptySymbol="fa fa-star-o"
                                  fullSymbol="fa fa-star"
                                  fractions={2}
                                  initialRating={data.rating}
                                  readonly
                                />
                              </div> */}
                              <div className="ct-user-wrap">
                                <LazyImage
                                  alt="testimonial"
                                  className="img-responsive img-circle testimonial-user"
                                  src={data.profImg}
                                  width={45}
                                  height={45}
                                  style={{ objectFit: "cover" }}
                                />
                                <div className="ct-user-inner-content">
                                  <p className="writer">{data.writer}</p>
                                  <div className="date-writer">{data.date}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </Testimonials>
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <PopularVehicleBrands
                  from={this.state.from}
                  to={this.state.to}
                  fromTime={this.state.from.format("HH:mm")}
                  toTime={this.state.to.format("HH:mm")}
                  landingPageProps={landingPageProps}
                  citiesLocationData={citiesLocationData}
                />
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <RentCarLandingPageSection
                  from={this.state.from}
                  to={this.state.to}
                  fromTime={this.state.from.format("HH:mm")}
                  toTime={this.state.to.format("HH:mm")}
                  citiesLocationData={citiesLocationData}
                  landingPageProps={landingPageProps}
                />
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <RentalExperience />
              </Suspense>

              <Suspense fallback={<PreLoader />}>
                <AvailablePickupAirport
                  from={this.state.from}
                  to={this.state.to}
                  fromTime={this.state.from.format("HH:mm")}
                  toTime={this.state.to.format("HH:mm")}
                  landingPageProps={landingPageProps}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <RydeAirports
                  from={this.state.from}
                  to={this.state.to}
                  fromTime={this.state.from.format("HH:mm")}
                  toTime={this.state.to.format("HH:mm")}
                  landingPageProps={landingPageProps}
                />
              </Suspense>
            </Fragment>
          )}
        </div>
        <Suspense fallback={<PreLoader />}>
          <MainFooter />
        </Suspense>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  authenticated: state.user.authenticated,
  timeZoneId: state.common.timeZoneId
});

export default connect(mapStateToProps)(withRouter(Index));
