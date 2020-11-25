import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import { isMobileOnly, isMobile } from "react-device-detect";

class PromotionFetures extends Component {
  render() {
    return (
      <div>
        {isMobile ? (
          <div>
            <div className="Promo19-fetures-section">
              <section className="section-wrap-promo Promo19-grey-section">
                <div className="container">
                  <h2 className="Promo19-section-head">
                    <span>Travel with RYDE</span>
                  </h2>

                  <div className="row">
                    <div className="Promo19Ft-Carousel">
                      <OwlCarousel
                        className="owl-theme"
                        // responsiveClass={true}
                        // responsive={OWLCAROSEL_RESPONSIVE_OPTIONS}
                        margin={12}
                        dots={false}
                        lazyLoad={true}
                        navClass="owl-prev owl-next"
                        loop={false}
                        nav={isMobileOnly ? false : true}
                        //nav={true}
                        // center={isMobileOnly ? true : false}
                        items={1}
                        className="car-detail-carousal-ads"
                        stagePadding={isMobileOnly ? 25 : 0}
                      >
                        <div className="item">
                          <div className="Promo19-fetures">
                            <div>
                              <img
                                className="icon"
                                src="/images/car-icon-thin.png"
                              />
                            </div>
                            <div className="txt">
                              <h3>Variety of best cars</h3>
                              <span className="desc">
                                We have the best of the best. Any make, style,
                                price you need we have it for you.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="item">
                          <div className="Promo19-fetures">
                            <div>
                              <img
                                className="icon"
                                src="/images/people-network.png"
                              />
                            </div>
                            <div className="txt">
                              <h3>Trusted Verified and Safe</h3>
                              <span className="desc">
                                Community of local owners who offer their best
                                cars and car lovers who pass our Renter
                                qualifications as responsible drivers.
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="item">
                          <div className="Promo19-fetures">
                            <div>
                              <img
                                className="icon"
                                src="/images/clock-black.png"
                              />
                            </div>
                            <div className="txt">
                              <h3>Convenience</h3>
                              <span className="desc">
                                Book quickly, get your car delivered anywhere
                                anytime you like.
                              </span>
                            </div>
                          </div>
                        </div>
                      </OwlCarousel>
                    </div>
                  </div>
                </div>
              </section>
              {/* <div className="Promo19-fetures-tag">
                Insurance provided by
                <img src="/images/checkout/assurant-sm-logo.png" />
              </div> */}
            </div>
          </div>
        ) : (
          <div>
            <div className="Promo19-fetures-section">
              <section className="section-wrap-promo Promo19-grey-section">
                <div className="container">
                  <h2 className="Promo19-section-head">
                    <span>Travel with RYDE</span>
                  </h2>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="Promo19-fetures">
                        <div>
                          <img
                            className="icon"
                            src="/images/car-icon-thin.png"
                          />
                        </div>
                        <div className="txt">
                          <h3>Variety of best cars</h3>
                          <span className="desc">
                            We have the best of the best. Any make, style, price
                            you need we have it for you.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="Promo19-fetures">
                        <div>
                          <img
                            className="icon"
                            src="/images/people-network.png"
                          />
                        </div>
                        <div className="txt">
                          <h3>Trusted Verified and Safe</h3>
                          <span className="desc">
                            Community of local owners who offer their best cars
                            and car lovers who pass our Renter qualifications as
                            responsible drivers.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="Promo19-fetures">
                        <div>
                          <img className="icon" src="/images/clock-black.png" />
                        </div>
                        <div className="txt">
                          <h3>Convenience</h3>
                          <span className="desc">
                            Book quickly, get your car delivered anywhere
                            anytime you like.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* <div className="Promo19-fetures-tag">
                Insurance provided by
                <img src="/images/checkout/assurant-sm-logo.png" />
              </div> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default PromotionFetures;
