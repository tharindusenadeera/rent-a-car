import "react-dates/initialize";
import React, { Component, Fragment } from "react";
import { SingleDatePicker } from "react-dates";
import moment from "moment-timezone";
import { timeList, TRIP_IS_ONTRIP, TRIP_IS_CONFIRM } from "../../consts/consts";
import { ConfirmationButton } from "../../components/comman/";
import axios from "axios";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import Tooltip from "../../components/tooltips/Tooltip";
import TextArea from "../../form-components/TextAriaInput";
import { authFail } from "../../actions/AuthAction";
import "react-dates/lib/css/_datepicker.css";

class TripChangeForm extends Component {
  constructor(props) {
    super(props);
    const caliDateTime = moment()
      .add(3, "hours")
      .tz("America/Los_Angeles");
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");

    const minFrom = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );

    const fromDate = moment(
      moment(props.booking.from_date, "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DD HH:mm"
      )
    );
    const toDate = moment(
      moment(props.booking.to_date, "YYYY-MM-DD HH:mm:ss").format(
        "YYYY-MM-DD HH:mm"
      )
    );
    const receipt = props.booking.receipts[0];
    let minToDate = moment(
      moment(props.booking.from_date, "YYYY-MM-DD HH:mm:ss").add(3, "hours")
    ).format("YYYY-MM-DD");
    if (props.booking.status == TRIP_IS_ONTRIP) {
      minToDate = moment(minFrom)
        .add(3, "hours")
        .format("YYYY-MM-DD");
    }
    let promotionalDescount = { amount: 0, type: null };
    if (receipt.coupon_amount != "0.00") {
      promotionalDescount.amount = receipt.coupon_amount;
      promotionalDescount.type = "Promotional deduction";
    }
    if (receipt.referral_amount != "0.00") {
      promotionalDescount.amount = receipt.referral_amount;
      promotionalDescount.type = "Car credit";
    }

    const roundedNow = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );

    this.state = {
      hasChanged: false,
      bookingData: {
        previousTripTotal: receipt.previous_trip_total,
        dailyRate: receipt.daily_rate_per_day,
        numberOfdates: receipt.number_of_dates,
        carCaveragePerDay: receipt.car_coverage_per_day,
        deliveryFee: receipt.total_delivery_amount,
        youngDriverFeePerDay: receipt.young_driver_fee_per_day,
        subTotal: receipt.receipt_subtotal,
        discount: receipt.discount_amount,
        amountCharged: receipt.amount_charged,
        balance: null,
        transactionType: null,
        carDiscount: receipt.discount,
        serviceFee: receipt.total_service_fee,
        promotionalDescount
      },
      fromDate: fromDate,
      minFrom: minFrom,
      toDate: toDate,
      minToDate: minToDate,
      roundedNow: roundedNow,
      description: "",
      showCalendar: false,
      showCalendarLink: true,
      focusedFrom: false,
      focusedTo: false,
      submitting: false,
      validating: false,
      error: false,
      errorMessage: null,
      calendarPrices: props.calendarPrices
    };
  }

  _timeStatus = (selectedTime, isToTime) => {
    const { booking } = this.props;
    const from = moment(this.state.fromDate);
    const to = moment(this.state.toDate);
    const minFrom = this.state.roundedNow;
    const minTo = moment(
      from.format("YYYY-MM-DD") +
        " " +
        moment(this.state.fromDate).format("HH:mm")
    ).add(3, "hours");
    let startDate;
    let endDate;

    //if from time == selected time return false -shernage
    const fromTime = from.format("HH:mm");
    const selected = moment(selectedTime, "HH:mm").format("HH:mm");
    if (isToTime === false && selected == fromTime) {
      return false;
    }

    if (!isToTime) {
      startDate = minFrom;
      endDate = moment(moment(from).format("YYYY-MM-DD") + " " + selectedTime);
    } else {
      if (booking.status == TRIP_IS_CONFIRM) {
        startDate = minTo;
      } else if (booking.status == TRIP_IS_ONTRIP) {
        startDate = minFrom;
      }

      endDate = moment(moment(to).format("YYYY-MM-DD") + " " + selectedTime);
    }
    if (startDate.isAfter(endDate)) {
      return true;
    } else {
      return false;
    }
  };

  _handdleFromDate = from => {
    const fromDate = moment(
      moment(from).format("YYYY-MM-DD") +
        " " +
        moment(this.state.fromDate).format("HH:mm")
    );
    if (
      fromDate.isAfter(this.state.toDate) ||
      fromDate.isSame(this.state.toDate)
    ) {
      const toDate = moment(fromDate).add(3, "hours");
      this.setState(
        {
          fromDate: fromDate,
          toDate: toDate,
          minToDate: moment(
            moment(
              moment(from).format("YYYY-MM-DD") +
                " " +
                moment(this.state.fromDate).format("HH:mm")
            ).add(3, "hours")
          ).format("YYYY-MM-DD")
        },
        () => {
          this._fetchDataForNewChanges();
        }
      );
    } else {
      this.setState(
        {
          fromDate: fromDate,
          minToDate: moment(
            moment(
              moment(from).format("YYYY-MM-DD") +
                " " +
                moment(this.state.fromDate).format("HH:mm")
            ).add(3, "hours")
          ).format("YYYY-MM-DD")
        },
        () => {
          this._fetchDataForNewChanges();
        }
      );
    }
  };

  _handdleToDate = to => {
    this.setState(
      {
        toDate: moment(
          moment(to).format("YYYY-MM-DD") +
            " " +
            moment(this.state.toDate).format("HH:mm")
        )
      },
      () => {
        this._fetchDataForNewChanges();
      }
    );
  };

  setNewPrices = data => {
    let newDataSet = [];
    for (let index = 0; index < data.length; index++) {
      newDataSet.push({
        date: data[index].date,
        price: data[index].amount
      });
    }
    this.setState({
      calendarPrices: newDataSet
    });
  };

  _fetchDataForNewChanges = async () => {
    try {
      const { booking } = this.props;
      const from = moment(this.state.fromDate).format("YYYY-MM-DD HH:mm:ss");
      const to = moment(this.state.toDate).format("YYYY-MM-DD HH:mm:ss");

      this.setState({ error: false, errorMessage: null });
      const response = await await axios.get(
        process.env.REACT_APP_API_URL + "booking-change/",
        {
          params: {
            booking_id: booking.id,
            from_date: from,
            to_date: to
          },
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        const priceBreakDown = response.data.data.item_price_break_down;
        this.setState({
          showCalendarLink: !priceBreakDown ? false : true,
          showCalendar: !priceBreakDown && false
        });
        priceBreakDown && this.setNewPrices(priceBreakDown);
        if (response.data.data.car_availability === true) {
          let bookingData = this.state.bookingData;
          bookingData.dailyRate = response.data.data.daily_rate_per_day;
          bookingData.numberOfdates = response.data.data.number_of_dates;
          bookingData.balance = response.data.data.changed_amount_formatted;
          bookingData.transactionType = response.data.data.changed_type;
          bookingData.subTotal = response.data.data.receipt_subtotal;
          bookingData.carDiscount = response.data.data.car_discount;
          bookingData.serviceFee = response.data.data.net_total_service_fee;
          bookingData.discount = response.data.data.discount_amount;
          bookingData.amountCharged = response.data.data.amount_charged;
          bookingData.carCaveragePerDay =
            response.data.data.car_coverage_amount_per_day;

          if (response.data.data.status == 2) {
            this.setState({
              minTo: moment(this.state.minFrom).format("YYYY-MM-DD")
            });
          }

          this.setState({ bookingData: bookingData, hasChanged: true });
        } else {
          this.setState({
            error: true,
            errorMessage: response.data.data.availability_message
          });
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
    }
  };

  beforeSubmit = () => {
    const { description } = this.state;
    if (!description) {
      return false;
    } else {
      return true;
    }
  };

  _validate = () => {
    const { description } = this.state;
    const errors = {};
    if (!description) {
      errors.description = "Description is required";
    }
    return errors;
  };

  _handdleFormSubmit = async () => {
    try {
      if (this.state.submitting) {
        return false;
      }
      this.setState({ validating: true });
      let validator = this._validate();
      if (JSON.stringify(validator) !== "{}") {
        return false;
      }
      this.setState({ submitting: true });
      const from = moment(this.state.fromDate).format("YYYY-MM-DD HH:mm:ss");
      const to = moment(this.state.toDate).format("YYYY-MM-DD HH:mm:ss");

      const response = await await axios.post(
        process.env.REACT_APP_API_URL + `booking-change`,
        {
          from_date: from,
          to_date: to,
          booking_id: this.props.booking.id,
          description: this.state.description
        },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      this.setState({ submitting: false });
      if (!response.data.error) {
        this.props.fetchBooking();
        this.props._toggleModal();
      }
    } catch (error) {
      this.setState({
        submitting: false,
        validating: false,
        error: true,
        errorMessage: error.response.data.message
      });
      setTimeout(() => {
        this.setState({ error: false, errorMessage: "" });
      }, 5000);
    }
  };

  render() {
    const { booking, carCoverageLevels } = this.props;
    const { bookingData, hasChanged, submitting } = this.state;

    return (
      <div className="booktrip-popup change-trip-popup">
        <div className="change-trip-modal">
          <div className="form-inner">
            <div className="booktrip-header">
              <h1>Change trip</h1>
              <div className="close-popup">
                <span
                  className="icon-cancel"
                  onClick={() => !submitting && this.props._toggleModal()}
                />
              </div>
            </div>
            <div className="popupform-tc-inner">
              <div className="popupform-inner-tc-scroll">
                <form className="trip-change-form">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">From</label>
                    <div className="row">
                      <div className="col-xs-7 col-md-8">
                        <SingleDatePicker
                          isOutsideRange={day =>
                            day.isBefore(this.state.minFrom)
                          }
                          disabled={
                            booking.status == TRIP_IS_ONTRIP || submitting
                              ? true
                              : false
                          }
                          date={this.state.fromDate}
                          onDateChange={e => this._handdleFromDate(e)}
                          focused={this.state.focusedFrom}
                          readOnly={true}
                          onFocusChange={({ focused }) =>
                            this.setState({ focusedFrom: focused })
                          }
                          // hideKeyboardShortcutsPanel={false}
                          // orientation={screenWidth < 700 ? "vertical" : "horizontal"}
                          numberOfMonths={1}
                        />
                      </div>
                      <div className="col-xs-4">
                        <select
                          className="form-control change-select"
                          value={moment(this.state.fromDate).format("HH:mm")}
                          disabled={
                            booking.status == TRIP_IS_ONTRIP || submitting
                              ? true
                              : false
                          }
                          onChange={e => {
                            this.setState(
                              {
                                fromDate: moment(
                                  moment(this.state.fromDate).format(
                                    "YYYY-MM-DD"
                                  ) +
                                    " " +
                                    e.target.value
                                ),
                                minToDate: moment(
                                  moment(
                                    moment(this.state.fromDate).format(
                                      "YYYY-MM-DD"
                                    ) +
                                      " " +
                                      e.target.value
                                  ).add(3, "hours")
                                ).format("YYYY-MM-DD")
                              },
                              state => {
                                this._fetchDataForNewChanges();
                              }
                            );

                            let fromDate = moment(
                              moment(this.state.fromDate).format("YYYY-MM-DD") +
                                " " +
                                e.target.value
                            );
                            if (
                              fromDate.isAfter(this.state.toDate) ||
                              fromDate.isSame(this.state.toDate)
                            ) {
                              let toDate = moment(
                                moment(this.state.toDate).format("YYYY-MM-DD") +
                                  " " +
                                  e.target.value
                              ).add(3, "hours");
                              this.setState(
                                {
                                  fromDate: fromDate,
                                  toDate: toDate,
                                  minToDate: moment(
                                    moment(
                                      moment(this.state.fromDate).format(
                                        "YYYY-MM-DD"
                                      ) +
                                        " " +
                                        e.target.value
                                    ).add(3, "hours")
                                  ).format("YYYY-MM-DD")
                                },
                                () => {
                                  this._fetchDataForNewChanges();
                                }
                              );
                            } else {
                              this.setState(
                                {
                                  frfromDateom: fromDate,
                                  minToDate: moment(
                                    moment(
                                      moment(this.state.fromDate).format(
                                        "YYYY-MM-DD"
                                      ) +
                                        " " +
                                        e.target.value
                                    ).add(3, "hours")
                                  ).format("YYYY-MM-DD")
                                },
                                () => {
                                  this._fetchDataForNewChanges();
                                }
                              );
                            }
                          }}
                        >
                          {booking && booking.status == TRIP_IS_CONFIRM ? (
                            timeList.map(time => {
                              return (
                                !this._timeStatus(time[0], false) && (
                                  <option key={time[0]} value={time[0]}>
                                    {time[1]}
                                  </option>
                                )
                              );
                            })
                          ) : (
                            <option
                              value={moment(this.state.fromDate).format(
                                "HH:mm"
                              )}
                            >
                              {" "}
                              {moment(this.state.fromDate).format(
                                "HH:mm A"
                              )}{" "}
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">To</label>
                    <div className="row">
                      <div className="col-xs-7 col-md-8">
                        <SingleDatePicker
                          isOutsideRange={day =>
                            day.isBefore(this.state.minToDate)
                          }
                          date={this.state.toDate}
                          disabled={submitting ? true : false}
                          onDateChange={e => this._handdleToDate(e)}
                          focused={this.state.focusedTo}
                          readOnly={true}
                          onFocusChange={({ focused }) =>
                            this.setState({ focusedTo: focused })
                          }
                          // orientation={screenWidth < 700 ? "vertical" : "horizontal"}
                          // orientation="vertical"
                          numberOfMonths={1}
                        />
                      </div>
                      <div className="col-xs-4">
                        <select
                          className="form-control change-select"
                          value={moment(this.state.toDate).format("HH:mm")}
                          disabled={submitting ? true : false}
                          onChange={e => {
                            this.setState(
                              {
                                toDate: moment(
                                  moment(this.state.toDate).format(
                                    "YYYY-MM-DD"
                                  ) +
                                    " " +
                                    e.target.value
                                )
                              },
                              state => {
                                this._fetchDataForNewChanges();
                              }
                            );
                          }}
                        >
                          {timeList.map(time => {
                            return (
                              !this._timeStatus(time[0], true) && (
                                <option key={time[0]} value={time[0]}>
                                  {time[1]}
                                </option>
                              )
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* <label htmlFor="exampleFormControlTextarea1">Description</label> */}
                  <div className="row">
                    <div className="col-md-12">
                      {/* 'Input' change to Ant 'TextArea' */}
                      <TextArea
                        label="Description"
                        type="text"
                        validate={() => this._validate()}
                        required={true}
                        submitting={this.state.validating}
                        className="form-control form-control-sm input-sm"
                        placeholder="Your description here..."
                        name="description"
                        disabled={submitting ? true : false}
                        onChange={e =>
                          this.setState({ description: e.target.value })
                        }
                        autosize={{ minRows: 2, maxRows: 6 }}
                      />
                    </div>
                  </div>
                </form>
                <div className="form-outer">
                  {bookingData ? (
                    <Fragment>
                      {hasChanged && (
                        <Fragment>
                          <div className="rate-list">
                            <div className="rate-left">
                              <span className="label-mid">
                                <strong>Previous trip total </strong>
                              </span>
                            </div>
                            <div className="rate-right">
                              $ {bookingData.previousTripTotal}
                            </div>
                          </div>
                          <hr />
                          <span className="label-mid">
                            <strong>
                              New trip change for {bookingData.numberOfdates}{" "}
                              days
                            </strong>
                          </span>
                        </Fragment>
                      )}

                      {bookingData.dailyRate ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">Daily rate</span>
                          </div>
                          <div className="rate-right">
                            $ {bookingData.dailyRate}/day
                          </div>
                        </div>
                      ) : null}
                      {bookingData.carCaveragePerDay ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">Car coverage</span>
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
                                  {carCoverageLevels.length > 0 &&
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
                                  {carCoverageLevels.length > 0 &&
                                    carCoverageLevels[0].description}
                                </p>
                              </div>
                            </Tooltip>
                          </div>
                          <div className="rate-right">
                            $ {bookingData.carCaveragePerDay}/day
                          </div>
                        </div>
                      ) : null}
                      {bookingData.youngDriverFeePerDay &&
                      bookingData.youngDriverFeePerDay != 0.0 ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">Young driver fee</span>
                          </div>
                          <div className="rate-right">
                            $ {bookingData.youngDriverFeePerDay}/day
                          </div>
                        </div>
                      ) : null}
                      {bookingData.deliveryFee &&
                      bookingData.deliveryFee != "0.00" ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">Delivery charge</span>
                          </div>
                          <div className="rate-right">
                            $ {bookingData.deliveryFee}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      {bookingData.serviceFee &&
                      bookingData.serviceFee != 0.0 ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">
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
                                    This fee helps us keep our community highly
                                    secure and provide services like customer
                                    support to you.
                                  </p>
                                </div>
                              </Tooltip>
                            </span>
                          </div>

                          <div className="rate-right">
                            $ {bookingData.serviceFee}
                          </div>
                        </div>
                      ) : null}
                      <hr />
                      {bookingData.subTotal ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span
                              className="label-mid"
                              style={{ fontWeight: "500" }}
                            >
                              Sub total
                            </span>
                          </div>
                          <div
                            className="rate-right"
                            style={{ fontWeight: "500" }}
                          >
                            $ {bookingData.subTotal}
                          </div>
                        </div>
                      ) : null}
                      {bookingData.discount && bookingData.carDiscount ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">
                              Discount ({bookingData.carDiscount}%)
                            </span>
                          </div>
                          <div className="rate-right">
                            {" "}
                            - $ {bookingData.discount}
                          </div>
                        </div>
                      ) : null}
                      {bookingData.promotionalDescount.type ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid">
                              {bookingData.promotionalDescount.type}
                            </span>
                          </div>
                          <div className="rate-right">
                            - $ {bookingData.promotionalDescount.amount}
                          </div>
                        </div>
                      ) : null}

                      <hr />

                      {bookingData.balance ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span className="label-mid change-rate">
                              Will be{" "}
                              {bookingData.transactionType == "charge"
                                ? "charged"
                                : "refund"}{" "}
                              to your credit card
                            </span>
                          </div>
                          <div className="rate-right change-rate">
                            $ {bookingData.balance}
                          </div>
                        </div>
                      ) : null}

                      {bookingData.amountCharged ? (
                        <div className="rate-list">
                          <div className="rate-left">
                            <span
                              className="label-mid"
                              style={{ fontSize: 20, fontWeight: "600" }}
                            >{`${
                              hasChanged ? "New trip " : "Trip "
                            } total`}</span>
                          </div>
                          <div
                            className="rate-right"
                            style={{ fontSize: 20, fontWeight: "600" }}
                          >
                            $ {bookingData.amountCharged}
                          </div>
                        </div>
                      ) : null}
                    </Fragment>
                  ) : (
                    <Fragment />
                  )}
                </div>

                {this.state.error && (
                  <div className="messages-wrapper">
                    <div className="notification error-message">
                      <div className="notification-inner">
                        <img
                          className="img-responsive pic"
                          src="/images/error-icon.svg"
                          alt="Image"
                        />
                        <span className="error-notification-cap-lg">
                          {this.state.errorMessage}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="buttons-wrapper">
                  <ConfirmationButton
                    className="pop-btn request-btn"
                    onClick={() => this._handdleFormSubmit()}
                    validate={this.beforeSubmit()}
                  >
                    {submitting && (
                      <PreloaderIcon
                        loader={Oval}
                        size={20}
                        strokeWidth={8} // min: 1, max: 50
                        strokeColor="#fff"
                        duration={800}
                      />
                    )}
                    SEND REQUEST
                  </ConfirmationButton>

                  <button
                    className="pop-btn cancel-btn"
                    onClick={() => !submitting && this.props._toggleModal()}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default TripChangeForm;
