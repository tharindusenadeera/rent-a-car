import React, { Component, Suspense, lazy, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import Helmet from "react-helmet";
import { isMobileOnly } from "react-device-detect";
import "antd/lib/skeleton/style/index.css";
import "react-dates/lib/css/_datepicker.css";
import MainNav from "../components/layouts/MainNav";
import PreLoader from "../components/preloaders/preloaders";

const Section1 = lazy(() => import("../components/promotionIndex/Section1"));
const ReviewRydes = lazy(() =>
  import("../components/promotionIndex/ReviewRydes")
);
const PromotionFeture = lazy(() =>
  import("../components/promotionIndex/PromotionFetures")
);
const FeaturedRydes = lazy(() =>
  import("../components/promotionIndex/FeaturedRydes")
);
const MainFooter = lazy(() => import("../components/layouts/MainFooter"));
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

    this.state = {
      couponCode: "",
      address: "",
      lat: "",
      lng: "",
      from: fromDate,
      to: moment(fromDate).add(3, "days"),
      foucesFrom: false
    };
  }

  componentWillMount() {
    document.body.classList.remove("login");
    document.body.classList.remove("signup");
  }

  componentDidMount() {
    localStorage.setItem("_source", "ads-landing");
    if (this.props.match.params.location == "los-angeles") {
      localStorage.setItem("_source_location", "Los Angeles, CA, USA");
      localStorage.setItem("_source_lat", "34.0522342");
      localStorage.setItem("_source_lng", "-118.2436849");
    }
    if (this.props.match.params.location == "san-diego") {
      localStorage.setItem("_source_location", "San Diego, CA, USA");
      localStorage.setItem("_source_lat", "32.715738");
      localStorage.setItem("_source_lng", "-117.16108380000003");
    }
    if (this.props.match.params.location == "san-francisco") {
      localStorage.setItem("_source_location", "San Francisco, CA, USA");
      localStorage.setItem("_source_lat", "37.7749295");
      localStorage.setItem("_source_lng", "-122.41941550000001");
    }
    if (this.props.match.params.location == "miami") {
      localStorage.setItem("_source_location", "Miami, FL, USA");
      localStorage.setItem("_source_lat", "25.7616798");
      localStorage.setItem("_source_lng", "-80.19179020000001");
    }
  }

  foucesFromReturn = data => {
    this.setState({ foucesFrom: data });
  };

  render() {
    let isLosAngeles = false;
    let isSanDiego = false;
    let isSanFrancisco = false;
    let isMiami = false;
    let isMain = false;

    let citiesLocationData = {
      mainBnerClass: "hero-promodefault"
    };

    switch (this.props.match.params.location) {
      case "los-angeles":
        isLosAngeles = true;
        citiesLocationData = {
          _address: "los_angeles",
          address: "Los Angeles, CA, USA",
          lat: "34.0522342",
          lng: "-118.2436849",
          name: "Los Angeles",
          mainBnerClass: "hero-promodefault"
        };
        break;
      case "san-diego":
        citiesLocationData = {
          _address: "san_diego",
          isSanDiego: true,
          address: "San Diego, CA, USA",
          lat: "32.715738",
          lng: "-117.16108380000003",
          name: "San Diego",
          mainBnerClass: "hero-san-diego"
        };
        break;
      case "san-francisco":
        citiesLocationData = {
          _address: "san_francisco",
          isSanFrancisco: true,
          address: "San Francisco, CA, USA",
          lat: "37.7749295",
          lng: "-122.41941550000001",
          name: "San Francisco",
          mainBnerClass: "hero-san-francisco"
        };
        break;
      case "miami":
        citiesLocationData = {
          _address: "miami",
          isMiami: true,
          address: "Miami, FL, USA",
          lat: "25.7616798",
          lng: "-80.19179020000001",
          name: "Miami",
          mainBnerClass: "hero-miami"
        };
        break;
      default:
        break;
    }

    citiesLocationData.source = "ads-landing";

    let landingPageProps = {
      isLosAngeles,
      isSanDiego,
      isSanFrancisco,
      isMiami,
      isMain,
      citiesLocationData,
      city: this.props.match.params.city
    };

    const mainImgCssClass = citiesLocationData.mainBnerClass;
    return (
      <Fragment>
        <Helmet
          title="RYDE: Car Lover's Choice"
          meta={[
            {
              name: "description",
              content: "RYDE: Car Lover's Choice"
            }
          ]}
        />
        <div className="site-index">
          <div className={`hero hero-promo19 ${mainImgCssClass}`}>
            <div className="home-main-menu">
              <MainNav
                cssClass="home-navigation"
                promoData={landingPageProps}
              />
            </div>
            <Suspense fallback={""}>
              {" "}
              <Section1
                landingPageProps={landingPageProps}
                foucesFrom={this.state.foucesFrom}
                foucesFromReturn={this.foucesFromReturn}
              />
            </Suspense>
          </div>
          <Suspense fallback={<PreLoader />}>
            <ReviewRydes
              title={
                citiesLocationData._address == "los_angeles"
                  ? "What our community has to say"
                  : "Featured RYDES"
              }
              from={this.state.from}
              to={this.state.to}
              fromTime={this.state.from.format("HH:mm")}
              toTime={this.state.to.format("HH:mm")}
              landingPageProps={landingPageProps}
              section="cities"
            />
          </Suspense>

          <Suspense fallback={<PreLoader />}>
            <PromotionFeture />
          </Suspense>
          <Suspense fallback={<PreLoader />}>
            {" "}
            <FeaturedRydes
              title={`Explore ${citiesLocationData.name}`}
              {...landingPageProps}
            />
          </Suspense>

          <section className="section-wrap-promo Promo19-last">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="Promo19-section-head type-2">
                    Browse cars in {citiesLocationData.name}
                  </h2>
                  <div className="Promo19-section-subhead">
                    Add dates to find out updated pricing and availability.
                  </div>

                  <div>
                    <button
                      className="Promo19-add-btn"
                      onClick={() => {
                        window.scrollTo(0, isMobileOnly ? 300 : 0);
                        this.setState({ foucesFrom: true });
                      }}
                    >
                      Add Dates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
