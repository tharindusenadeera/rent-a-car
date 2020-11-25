import React, { Component, Fragment } from "react";
import moment from "moment-timezone";
import Tooltip from "../../components/tooltips/Tooltip";
import "antd/lib/select/style/index.css";

class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsState: false,
      collapsKey: 0,
      viewBreakDown: 0
    };
  }

  collapAction(data) {
    if (data == this.state.collapsKey) {
      this.setState({ collapsKey: 100 });
    } else {
      this.setState({ collapsKey: data });
    }
  }

  itemPriceBreakDown(data) {
    return (
      data &&
      data.map((item, k) => {
        return (
          this.state.viewBreakDown == 1 && (
            <div className="clearfix" style={{ paddingBottom: "10px" }} key={k}>
              <div className="col-md-6 col-xs-6">
                {moment(item.date, "YYYY-MM-DD HH:mm:ss").format(
                  "MMM DD, YYYY"
                )}
              </div>
              <div className="col-md-6 col-xs-6" style={{ textAlign: "right" }}>
                $ {item.amount}
              </div>
            </div>
          )
        );
      })
    );
  }

  reciptItem(data) {
    return data.map((receipt, k) => {
      return (
        <div key={k}>
          <div className="changetrip-popup">
            <div className="recipt-content">
              <div
                className="recipt-row recipt-row-wrapper"
                onClick={this.collapAction.bind(this, k)}
              >
                <div className="receipt-header-wrapper">
                  <div className="receipt-header-left">
                    <div className="res-id">
                      Receipt ID : {receipt.receipt_id}
                    </div>
                    <div className="res-date">
                      Last Updated Date{" "}
                      {moment(
                        receipt.receipt_date,
                        "YYYY-MM-DD HH:mm:ss"
                      ).format("MMM DD, YYYY h:mm a")}
                    </div>
                  </div>
                  <div className="receipt-header-right">
                    {this.state.collapsKey === k ? (
                      <img
                        className="img-responsive"
                        src="/images/up-arrow.svg"
                        alt="Image"
                      />
                    ) : (
                      <img
                        className="img-responsive"
                        src="/images/down-arrow.svg"
                        alt="Image"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {this.state.collapsKey === k && (
              <div>
                <div className="recipt-row-date">
                  <div>
                    <strong>From</strong>
                    <div className="">
                      {moment(receipt.from_date, "YYYY-MM-DD HH:mm:ss").format(
                        "MMM DD, YYYY"
                      )}
                      <span className="time-lab">
                        {moment(
                          receipt.from_date,
                          "YYYY-MM-DD HH:mm:ss"
                        ).format("h:mm a")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <strong>To</strong>
                    <div className="">
                      {moment(receipt.to_date, "YYYY-MM-DD HH:mm:ss").format(
                        "MMM DD, YYYY"
                      )}
                      <span className="time-lab">
                        {moment(receipt.to_date, "YYYY-MM-DD HH:mm:ss").format(
                          "h:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="fs16-medium-black row-separate-bottom-15">
                  Trip charge for {receipt.number_of_dates} days
                </div>
                {receipt.price_breakdown &&
                receipt.price_breakdown.length > 0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="fs16-regular-black text-left">
                          Daily rate
                        </div>
                        <p
                          className="fs14-semibold-link-green"
                          style={{
                            position: "relative",
                            zIndex: 999,
                            marginLeft: 5,
                            marginTop: 0,
                            marginBottom: 0
                          }}
                          onClick={() => {
                            this.setState({
                              viewBreakDown: !this.state.viewBreakDown
                            });
                          }}
                        >
                          View
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5 ">
                      <div className="fs16-regular-black text-right">
                        $ {receipt.daily_rate_per_day}/day
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="row">
                        {this.itemPriceBreakDown(receipt.price_breakdown)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Daily rate
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="recipt-amount fs16-regular-black text-right">
                        $ {receipt.daily_rate_per_day}/day
                      </div>
                    </div>
                  </div>
                )}
                {this.props.booking.user_type == "renter" &&
                receipt.car_coverage_amount &&
                receipt.car_coverage_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Car Coverage
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
                              {this.props.carCoverageLevels.length > 0 &&
                                this.props.carCoverageLevels[0].title}
                            </div>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#999999",
                                fontFamily: "Poppins"
                              }}
                            >
                              {this.props.carCoverageLevels.length > 0 &&
                                this.props.carCoverageLevels[0].description}
                            </p>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        $ {receipt.car_coverage_per_day}/day
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props.booking.user_type == "renter" &&
                receipt.young_driver_fee &&
                receipt.young_driver_fee != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Young driver fee
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        $ {receipt.young_driver_fee_per_day}/day
                      </div>
                    </div>
                  </div>
                ) : null}

                {this.props.booking.user_type == "owner" &&
                receipt.discount_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Discount ({receipt.discount} %)
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="recipt-amount fs16-regular-black text-right">
                        - $ {receipt.discount_amount}
                      </div>
                    </div>
                  </div>
                ) : null}

                {receipt.total_delivery_amount &&
                receipt.total_delivery_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Delivery Charge
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        $ {receipt.total_delivery_amount}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Service fee - Start */}

                {this.props.booking.user_type == "renter" &&
                receipt.total_service_fee != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <span className="fs16-regular-black text-left">
                        Service fee{" "}
                      </span>
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
                            This fee helps us keep our community highly secure
                            and provide services like customer support to you.
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        $ {receipt.total_service_fee}
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* Service fee - End */}

                <hr />
                {this.props.booking.user_type == "renter" ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-medium-black text-left">
                        Sub Total
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-medium-black text-right">
                        $ {receipt.receipt_subtotal}
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props.booking.user_type == "owner" ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-bold-black text-left ">Total</div>
                    </div>
                    <div className="col-md-6 col-xs-5 ">
                      <div className="fs16-bold-black text-right">
                        $ {receipt.sub_total}
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props.booking.user_type == "renter" &&
                receipt.discount_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Discount ({receipt.discount} %)
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        - $ {receipt.discount_amount}
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props.booking.user_type == "renter" &&
                receipt.coupon_amount &&
                receipt.coupon_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Promotional deduction
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        - $ {receipt.coupon_amount}
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.props.booking.user_type == "renter" &&
                receipt.referral_amount &&
                receipt.referral_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Car Credit
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        - $ {receipt.referral_amount}
                      </div>
                    </div>
                  </div>
                ) : null}

                {this.props.booking.user_type == "renter" &&
                receipt.tax_amount &&
                receipt.tax_amount != 0.0 ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">Tax</div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        - $ {receipt.tax_amount}
                      </div>
                    </div>
                  </div>
                ) : null}
                <hr />
                {this.props.booking.user_type == "owner" ? (
                  <div className="row row-separate-bottom-15">
                    <div className="col-md-6 col-xs-7">
                      <div className="fs16-regular-black text-left">
                        Ryde Fees
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-5">
                      <div className="fs16-regular-black text-right">
                        - ${" "}
                        {parseFloat(
                          receipt.sub_total - receipt.car_owner_amount
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="row row-separate-bottom-15">
                  <div className="col-md-6 col-xs-7">
                    <div className="fs16-bold-black text-left">
                      {this.props.booking.btn.user_type == "owner"
                        ? "Earnings"
                        : "Trip Total"}
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-5">
                    <div className="fs16-bold-black text-right">
                      {this.props.booking.btn.user_type == "owner"
                        ? "$ " + receipt.car_owner_amount
                        : "$ " + receipt.amount_charged}
                    </div>
                  </div>
                </div>
                {/* <hr /> */}
              </div>
            )}
          </div>
        </div>
      );
    });
  }

  reciptList() {
    let deliveryLocation = {};
    let updatedDate = moment(
      this.props.booking.updated_at,
      "YYYY-MM-DD HH:mm:ss"
    ).format("ddd, MMM D h:mm a");

    if (
      this.props.booking.user_type === "renter" &&
      this.props.booking.status === 0 &&
      this.props.booking.delivery_location_method.type === "PICK UP LOCATION"
    ) {
      deliveryLocation.location = this.props.booking.car_zip_code;
      deliveryLocation.type = this.props.booking.delivery_location_method.type;
    } else {
      deliveryLocation.location =
        this.props.booking &&
        this.props.booking.delivery_location_method &&
        this.props.booking.delivery_location_method.location;
      deliveryLocation.type =
        this.props.booking &&
        this.props.booking.delivery_location_method &&
        this.props.booking.delivery_location_method.type;
    }
    return (
      <div className="booktrip-popup">
        <div className="receipt-page">
          <div className="form-inner">
            <div className="booktrip-header">
              <h1>Receipt</h1>
              <div className="close-popup">
                <span
                  className="icon-cancel"
                  onClick={() => this.props._toggleModal()}
                />
              </div>
            </div>
            <div className="popupform-tc-inner">
              <div className="popupform-inner-tc-scroll">
                <div className="recipt-wrap-outer">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="recipt-wrap">
                        <div className="recipt-header">
                          {/* <div className="clearfix">
                      <span className="recipt-number">Last Updated : {updatedDate}</span>
                    </div> */}
                          <span className="recipt-number">
                            Reservation ID:{" "}
                            <span className="recipt-number-number">
                              {this.props.booking.number}
                            </span>
                          </span>
                        </div>

                        <hr />

                        <div className="recipt-content">
                          {this.props.booking &&
                            this.props.booking.receipts &&
                            this.reciptItem(this.props.booking.receipts)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <Fragment>{this.reciptList()}</Fragment>;
  }
}

export default Receipt;
