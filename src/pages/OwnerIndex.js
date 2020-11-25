import React, { Component, Fragment, Suspense, lazy } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import InputRange from "react-input-range";
import "../../node_modules/react-input-range/lib/css/index.css";
import SignupForm from "../components/forms/SignupForm";
import PreLoader from "../components/preloaders/preloaders";
const MainFooter = lazy(() => import("../components/layouts/MainFooter"));
class OwnerIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carValue: 3000,
      carRentedValue: 2,
      myCarValue: 3000,
      earnings: 50
    };
    this.handleCarValue = this.handleCarValue.bind(this);
  }

  handleCarValue = e => {
    const { carValue } = e;
    const minus = carValue === 120000 ? 40000 : (carValue / 3000 - 1) * 1000;
    this.setState({ myCarValue: carValue - minus, carValue: carValue });
    this.showEarnings();
  };

  handleCarRentedValue = e => {
    const { carRentedValue } = e;
    this.setState({ carRentedValue: carRentedValue });
    this.showEarnings();
  };

  showEarnings() {
    const increment = 0;
    const xValue = 2000;
    const price =
      this.state.carValue <= 85000
        ? 25 + (this.state.carValue / 3000 - 1) * 3
        : 106 + (this.state.carValue / 3000 - 28) * 10;
    const daySixtoEight = 46.8;
    const dayFourteentoSixteen = 43.76;
    const datTwentyTwotoTwentyFour = 32.94;

    let daysRented = this.state.carRentedValue;
    let value = 0;

    if (daysRented > 6 && daysRented < 16) {
      daysRented = daysRented - 2;
    } else if (daysRented > 14 && daysRented < 24) {
      daysRented = daysRented - 4;
    } else if (daysRented > 22 && daysRented < 28) {
      daysRented = daysRented - 6;
    } else if (daysRented === 28) {
      daysRented = daysRented - 7;
    } else if (daysRented === 30) {
      daysRented = daysRented - 8;
    }

    if (this.state.carRentedValue < 8) {
      value =
        (increment * ((this.state.myCarValue - 3000) / xValue) + price) *
        12 *
        daysRented;
    } else if (
      this.state.carRentedValue > 6 &&
      this.state.carRentedValue < 16
    ) {
      value =
        (increment * ((this.state.myCarValue - 57000) / xValue) + price) *
          12 *
          daysRented +
        daySixtoEight;
    } else if (
      this.state.carRentedValue > 14 &&
      this.state.carRentedValue < 24
    ) {
      value =
        (increment * ((this.state.myCarValue - 3000) / xValue) + price) *
          12 *
          daysRented +
        daySixtoEight +
        dayFourteentoSixteen;
    } else if (this.state.carRentedValue > 22) {
      value =
        (increment * ((this.state.myCarValue - 3000) / xValue) + price) *
          12 *
          daysRented +
        daySixtoEight +
        dayFourteentoSixteen +
        datTwentyTwotoTwentyFour;
    }

    this.setState({ earnings: value / 12 });
  }

  componentWillReceiveProps(nextProps) {
    const { history } = nextProps;
    if (
      history.location.pathname === "/list-your-car" &&
      nextProps.user.user.id != null
    ) {
      history.push("/car-create");
    }
  }

  componentWillMount() {
    if (this.props.user.authenticated === true) {
      this.props.history.push("/");
    }
  }

  render() {
    const { verifyPhone, match } = this.props;

    return (
      <Fragment>
        <div id="owner-landing-wrapper">
          <section className="main-banner-section">
            <div className="container">
              <div className="row">
                {/* Left Column */}
                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                  <div className="logo-wrapper clearfix">
                    <Link className="navbar-brand" to="/">
                      <img
                        className="logo"
                        src="images/owner/logo.svg"
                        alt="RYDE"
                      />
                    </Link>
                  </div>
                  <div className="intro-wrapper">
                    <div className="caption caption-bold">
                      Let your car work for you
                    </div>
                    {/* <div className="caption caption-normal">Worry Less</div> */}
                    {/* <p className="intro hidden-xs">Becoming a host with RYDE’s peer to peer service puts your car to work, for you. It literally becomes a money-making machine. Rent it directly to people who want a car, and rental experience, that’s better than the ordinary. </p>
                                    <p className="intro hidden-xs">Your car is protected up to $130,000 in physical damage coverage and $1 million dollars in liability coverage. There are several plans available, see all our coverage options <Link to="/safety/index/1">here</Link>.</p> */}
                    <p className="intro hidden-xs">
                      Listing your car on RYDE is simple and usually takes about
                      10 minutes.
                    </p>
                  </div>
                  <h1>How much can I make?</h1>
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <div className="car-value-wrapper">
                        <div className="car-value-top">
                          <label className="value-label-left">
                            My car value
                          </label>
                          <label className="value-label-right">
                            ${" "}
                            {this.state.myCarValue.toLocaleString(undefined, {
                              minimumFractionDigits: 0
                            })}
                          </label>
                        </div>
                        <div className="value-slider">
                          <InputRange
                            maxValue={120000}
                            minValue={3000}
                            step={3000}
                            value={this.state.carValue}
                            draggableTrack={true}
                            onChange={e => this.handleCarValue({ carValue: e })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <div className="car-value-wrapper">
                        <div className="car-value-top">
                          <label className="value-label-left">
                            Days per month car is rented
                          </label>
                          <label className="value-label-right">
                            {this.state.carRentedValue}
                          </label>
                        </div>
                        <div className="value-slider">
                          <InputRange
                            maxValue={30}
                            minValue={2}
                            step={2}
                            value={this.state.carRentedValue}
                            draggableTrack={true}
                            onChange={e =>
                              this.handleCarRentedValue({ carRentedValue: e })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="earnings-wrapper">
                        <div className="earnings earnings-left">
                          Possible earnings
                        </div>
                        <div className="earnings-center">
                          ${" "}
                          {this.state.earnings.toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </div>
                        <div className="earnings earnings-right">per month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                  <SignupForm
                    title={"List your car"}
                    referral={
                      match.params.referral ? match.params.referral : ""
                    }
                  />
                </div>

                {/* Verification Modal - Start */}
                {/* <PhoneVerification
                  signupFormData={verifyPhone}
                  isOpen={verifyPhone}
                /> */}
                {/* Verification Modal - End */}
              </div>
            </div>
          </section>

          {/* Why Ryde Section */}
          <section className="ryde-features-section">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
                  <div className="ryde-features-wrapper why-ryde">
                    <div className="ryde-features-icon">
                      <img src="/images/owner/why-ryde.svg" />
                    </div>
                    <div className="ryde-features-content">
                      <h2>Why RYDE?</h2>
                      <ul className="list-unstyled features-list">
                        <li>Highest payouts across all carsharing platforms</li>
                        <li>Stellar hosts support</li>
                      </ul>
                      {/* <Link className="learn-more" to="/how-to-use/index/1">
                        Learn More
                      </Link> */}
                      <a href="https://rydecarshelp.zendesk.com/" target="_blank">Learn More</a>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
                  <div className="ryde-features-wrapper safety-first">
                    <div className="ryde-features-icon">
                      <img src="/images/owner/safety-first.svg" />
                    </div>
                    <div className="ryde-features-content">
                      <h2>Safety First</h2>
                      <ul className="list-unstyled features-list">
                        <li>Verified users (background & DMV screenings)</li>
                        {/* <li>Community of trust </li> */}
                      </ul>
                      <Link className="learn-more" to="/safety">
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
                  <div className="ryde-features-wrapper best-insurance">
                    <div className="ryde-features-icon">
                      <img src="/images/owner/best-insurance.svg" />
                    </div>
                    <div className="ryde-features-content">
                      <h2>Insurance Included</h2>
                      <ul className="list-unstyled features-list">
                        <li>$1,000.000 in liability insurance</li>
                        <li>Physical Damage coverage</li>
                      </ul>
                      {/* <Link className="learn-more" to="/safety/index/1">
                        Learn More
                      </Link> */}
                      <a href="https://rydecarshelp.zendesk.com/hc/en-us/categories/360002472332-Insurance-Safety" target="_blank">Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Here’s How RYDE Works */}
          <section className="how-ryde-works-section">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="ryde-works-inner">
                    <h2>How it works</h2>
                    <div className="ryde-works-steps-wrapper">
                      <div className="ryde-works-steps">
                        <img
                          src="images/owner/step-icon-one.svg"
                          alt="Step One"
                        />
                        <div className="ryde-works-text hidden-xs">
                          <div className="ryde-works-sm">Review</div>
                          <div className="ryde-works-lg">Booking Requests</div>
                        </div>
                        <div className="visible-xs">
                          <div className="ryde-works-sm">
                            Review Booking Requests
                          </div>
                        </div>
                      </div>
                      <img
                        className="next-step hidden-xs"
                        src="images/owner/right-arrow.svg"
                        alt="Next"
                      />
                      <div className="ryde-works-steps">
                        <img
                          src="images/owner/step-icon-two.svg"
                          alt="Step Two"
                        />
                        <div className="ryde-works-text hidden-xs">
                          <div className="ryde-works-sm">Meet Renters & </div>
                          <div className="ryde-works-lg">Keys Handoff</div>
                        </div>
                        <div className="visible-xs">
                          <div className="ryde-works-sm">
                            Meet Renters & Keys Handoff
                          </div>
                        </div>
                      </div>
                      <img
                        className="next-step hidden-xs"
                        src="images/owner/right-arrow.svg"
                        alt="Next"
                      />
                      <div className="ryde-works-steps">
                        <img
                          src="images/owner/step-icon-three-1.svg"
                          alt="Step Three"
                        />
                        <div className="ryde-works-text hidden-xs">
                          <div className="ryde-works-sm">Collect Your</div>
                          <div className="ryde-works-lg">Earnings</div>
                        </div>
                        <div className="visible-xs">
                          <div className="ryde-works-sm">
                            Collect Your Earnings
                          </div>
                        </div>
                      </div>
                    </div>
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

const mapStateToProps = state => {
  return {
    user: state.user,
    verifyPhone: state.user.verifyPhoneNumber
  };
};

export default withRouter(connect(mapStateToProps)(OwnerIndex));
