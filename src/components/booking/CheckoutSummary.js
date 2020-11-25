import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import Rating from "react-rating";
import moment from "moment";
import { isMobileOnly } from "react-device-detect";
import Modal from "react-modal";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";
import Image from "react-shimmer";
import CalenderModel from "../car/CalenderModel";
import { LazyImage } from "../comman";

import Tooltip from "../tooltips/Tooltip";

class CheckoutSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalender: false
    };
  }

  loadOwlCarouselImages = () => {
    const { car } = this.props;
    if (car && car.car_photos && car.car_photos.data) {
      return car.car_photos.data.map((img, index) => {
        return (
          <div className="item" key={index}>
            <LazyImage
              key={index}
              className="img-responsive img-rounded"
              src={img.image_path}
              width={260}
              height={225}
              style={{ objectFit: "cover" }}
            />
          </div>
        );
      });
    } else {
      return [];
    }
  };

  _toggleModal = () =>
    this.setState({ showCalender: !this.state.showCalender });

  setPriceBreakDownLink = () => {
    const { bookingData } = this.props;
    if (
      bookingData.item_price_break_down &&
      bookingData.item_price_break_down.length
    ) {
      return <a onClick={() => this._toggleModal("price-calender")}>View</a>;
    } else {
      return null;
    }
  };

  render() {
    const {
      car,
      fromDate,
      fromTime,
      toDate,
      toTime,
      bookingData,
      hidePricebreakdown,
      carCoverageLevels
    } = this.props;

    let fromDateFormatted = moment(fromDate, "MM-DD-YYYY").format(
      "dddd, MMM DD"
    );
    let fromDateSuperscript = moment(fromDate, "MM-DD-YYYY").format("Do");
    let fromTimeFormatted = moment(fromTime, "HH:mm").format("h:mm A");
    let toDateFormatted = moment(toDate, "MM-DD-YYYY").format("dddd, MMM DD");
    let toDateSuperscript = moment(toDate, "MM-DD-YYYY").format("Do");
    let toTimeFormatted = moment(toTime, "HH:mm").format("h:mm A");
    const responsiveOptionsFullwidth = {
      0: {
        items: 1,
        nav: false
      },
      480: {
        items: 1,
        nav: false
      },
      900: {
        items: 1,
        nav: false
      },
      1200: {
        items: 1,
        nav: false
      }
    };

    return (
      //sidebar-widgets edited
      <div className="sidebar-widget">
        {/* Cars Slider - Start */}
        <section className="cars-slider-section">
          {this.loadOwlCarouselImages().length > 0 && (
            <OwlCarousel
              className="owl-theme"
              loop={true}
              margin={0}
              center={true}
              lazyLoad={true}
              dots={true}
              autoplay={true}
              navClass="owl-prev owl-next"
              responsiveClass={true}
              responsive={responsiveOptionsFullwidth}
            >
              {this.loadOwlCarouselImages()}
            </OwlCarousel>
          )}
        </section>

        {/* Date / Time - Start */}
        <div className="picked-date-time-section">
          <div className="trip-summary-header">
            <h2 className="car-info-head">Trip summary</h2>
            <div className="car-name">{car && car.name}</div>
          </div>
          <div className="flex-container">
            <div className="flex-left">
              <h2 className="car-info-head">From</h2>
            </div>
            <div className="flex-right text-normal">
              {[
                fromDateFormatted,
                <sup key={132}>{fromDateSuperscript.match(/[a-zA-Z]+/g)} </sup>,
                fromTimeFormatted
              ]}
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-left">
              <h2 className="car-info-head">To</h2>
            </div>
            <div className="flex-right text-normal">
              {[
                toDateFormatted,
                <sup key={100}>{toDateSuperscript.match(/[a-zA-Z]+/g)} </sup>,
                toTimeFormatted
              ]}
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-left">
              <h2 className="car-info-head">Car location</h2>
            </div>
            <div className="flex-right text-normal">
              {car && car.car_state && car.car_zip_code
                ? car.car_state + " " + car.car_zip_code
                : "Not available"}
            </div>
          </div>
        </div>
        {/* Date / Time - End */}

        <hr />

        {!hidePricebreakdown && bookingData && (
          <div>
            <div className="price-breakdown-section">
              {bookingData.daily_rate_per_day ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">
                    Daily rate {this.setPriceBreakDownLink()}
                  </div>
                  <div className="flex-right text-normal">
                    $ {bookingData.daily_rate_per_day}/day
                  </div>
                </div>
              ) : null}

              {bookingData.car_coverage_amount_per_day ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">
                    Car coverage
                    <Tooltip>
                      <div style={{ marginBottom: "10px" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#000",
                            fontFamily: "Poppins"
                          }}
                        >
                          {carCoverageLevels &&
                            carCoverageLevels.length > 0 &&
                            carCoverageLevels[0].title}
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#999999",
                            fontFamily: "Poppins"
                          }}
                        >
                          {carCoverageLevels &&
                            carCoverageLevels.length > 0 &&
                            carCoverageLevels[0].description}
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex-right text-normal">
                    $ {bookingData.car_coverage_amount_per_day}/day
                  </div>
                </div>
              ) : null}

              {bookingData.is_service_fee_per_day_show &&
              bookingData.service_fee_per_day ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">
                    Service fee
                    <Tooltip>
                      <div style={{ marginBottom: "10px" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#000",
                            fontFamily: "Poppins"
                          }}
                        >
                          Service fee
                        </div>
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: "#999999",
                            fontFamily: "Poppins"
                          }}
                        >
                          This fee helps us keep our community highly secure and
                          provide services like customer support to you.
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                  <div className="flex-right text-normal">
                    $ {bookingData.service_fee_per_day}/day
                  </div>
                </div>
              ) : null}

              {bookingData.young_driver_fee_per_day ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">Young driver fee</div>
                  <div className="flex-right text-normal">
                    $ {bookingData.young_driver_fee_per_day}/day
                  </div>
                </div>
              ) : null}

              {bookingData.total_per_day ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">Total per day</div>
                  <div className="flex-right text-normal">
                    $ {bookingData.total_per_day}/day
                  </div>
                </div>
              ) : null}

              {bookingData.number_of_dates && bookingData.total_trip_price ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">
                    Total {bookingData.number_of_dates} day trip price
                  </div>
                  <div className="flex-right text-normal">
                    $ {bookingData.total_trip_price}
                  </div>
                </div>
              ) : null}

              {bookingData.isDelivery === true ||
              bookingData.isDropOff === true ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">Delivery fee</div>
                  <div className="flex-right text-normal">
                    {bookingData.total_delivery_amount === 0
                      ? `Free`
                      : `$ ${bookingData.total_delivery_amount}`}
                  </div>
                </div>
              ) : null}

              {bookingData.total_ref_deduct > 0 && (
                <div className="flex-container">
                  <div className="flex-left text-normal">Car credit</div>
                  <div className="flex-right text-normal">
                    - $ {bookingData.total_ref_deduct}
                  </div>
                </div>
              )}

              {bookingData.car_discount !== 0 ? (
                <div className="flex-container">
                  <div className="flex-left text-normal">
                    Discount ({bookingData.car_discount}%)
                  </div>
                  <div className="flex-right text-normal">
                    - $ {bookingData.discount_amount}
                  </div>
                </div>
              ) : null}
              {/* {bookingData && bookingData.item_price_break_down && (
              <div className="flex-container">
                <div className="flex-left text-normal">Price Calender</div>
                <div className="flex-right text-normal">
                  <a onClick={() => this._toggleModal("calender")}>View</a>
                </div>
              </div>
            )} */}
            </div>
            <hr />
            {bookingData.amount_charged ? (
              <div className="total-trip-price-section">
                <div className="flex-container">
                  <div className="flex-left">
                    <h2 className="car-info-head">Trip total</h2>
                  </div>
                  <div className="flex-right text-bold">
                    ${" "}
                    {bookingData.amount_charged.toLocaleString("en-US", {
                      minimumFractionDigits: 2
                    })}
                  </div>
                </div>
              </div>
            ) : null}
            <hr />
          </div>
        )}

        {/* Miles included Section - Start */}
        <div className="miles-included-section">
          <div className="flex-container">
            <div className="flex-left text-normal">Miles Included</div>
            <div className="flex-right text-normal">
              {bookingData && bookingData.miles_included}
            </div>
            {bookingData && bookingData.miles_included != "Unlimited" ? (
              <div className="extra-text-wrapper">
                <p>
                  $ {car && car.extra_mile_price} fee for each additional mile
                </p>
              </div>
            ) : null}
          </div>
        </div>
        {/* Miles included Section - End */}

        <hr />

        {/* Insurance provided by Section - Start */}
        {/* <div className="insurance-provided-section">
          <div className="flex-container">
            <div className="flex-left text-normal">
              <h2 className="car-info-head">Insurance provided by</h2>
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

        {/* Owner info Section - Start */}
        <div className="owner-info-section">
          <h2 className="car-info-head">Owner info</h2>
          <div className="flex-container owner-info-inner">
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
                  {car && car.user.first_name + " " + car.user.last_name}
                </div>
              </Link>
              <div className="cd-owner-member-since">
                Member since:{" "}
                {moment(car && car.user.created_at).format("MMMM - YYYY")}
              </div>
              {car && car.user.user_rating !== 0 && (
                <Rating
                  emptySymbol="fa fa-star-o fa-1x"
                  fullSymbol="fa fa-star fa-1x"
                  fractions={2}
                  readonly
                  initialRating={5}
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
            <div className="flex-left text-normal">Acceptance rate</div>
            <div className="flex-right text-normal">
              {car && car.user.acceptance_rate}
            </div>
          </div>
          {car && car.user.response_time && (
            <div className="flex-container">
              <div className="flex-left text-normal">Response time</div>
              <div className="flex-right text-normal">
                {car && car.user.response_time}
              </div>
            </div>
          )}
        </div>
        {/* Owner info Section - End */}
        {/* Cars Slider - End */}

        {/*Price Calender Popup*/}
        {this.state.showCalender == true && (
          <Modal
            isOpen={this.state.showCalender}
            onRequestClose={() => this.setState({ showCalender: false })}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
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
                startDate={moment(fromDate, "MM-DD-YYYY").format("YYYY-MM-DD")}
                endDate={moment(toDate, "MM-DD-YYYY").format("YYYY-MM-DD")}
              />
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
export default CheckoutSummary;
