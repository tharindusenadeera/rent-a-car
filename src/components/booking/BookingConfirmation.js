import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";
import moment from "moment-timezone";
import {
  modalStylesBooking,
  modalStylesBookingLarge
} from "../../consts/consts";
import { carUpdatePhoto } from "../../consts/modalStyles";
import { MODAL_POPUP } from "../../actions/ActionTypes";
import {
  getBooking,
  confirmBooking,
  declineBooking,
  cancelBooking
} from "../../actions/BookingActions";
import Receipt from "./Receipt";
import checkAuth from "../requireAuth";
import ExperienceForm from "../experience/ExperienceForm";

class BookingConfirmation extends Component {
  constructor() {
    super();
    this.state = {
      modalText: "",
      checkout: false,
      showReceipt: false,
      showCheckoutPhoto: false,
      checkoutPhoto: "",
      showExperincesModal: false
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCloseModalLarge = this.handleCloseModalLarge.bind(this);
    this.confirmBooking = this.confirmBooking.bind(this);
    this.declineBooking = this.declineBooking.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.showReceiptPopup = this.showReceiptPopup.bind(this);
    this.bookingStatus = this.bookingStatus.bind(this);
    this.handleCheckout = this.handleCheckout.bind(this);
    this.adminTransaction = this.adminTransaction.bind(this);
    this.adminTransactionReceiptsView = this.adminTransactionReceiptsView.bind(
      this
    );
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getBooking(this.props.params.id));
  }

  componentWillReceiveProps(nextProps) {
    // booking canel pop up
    if (nextProps.popUp && nextProps.booking.status == -1) {
      this.setState({
        modalText: "Your Booking Has Been Canceled"
      });
    }

    // booking confirm pop up
    if (nextProps.popUp && nextProps.booking.status == 1) {
      this.setState({
        modalText:
          "You have confirmed booking for " +
          nextProps.booking.car.year +
          " " +
          nextProps.booking.car.car_make.name +
          " " +
          nextProps.booking.car.car_model.name
      });
    }
  }

  adminTransaction() {
    const { booking, user } = this.props;
    if (booking.status != null) {
      const { car, transaction } = this.props.booking;
      let i = 0;
      let amount = 0;
      if (transaction) {
        transaction.forEach(function(t) {
          if (car.user_id == user.id) {
            if (t.transaction_to == 1) {
              if (t.type == 1) {
                amount = parseFloat(t.amount);
              } else if (t.type == 2) {
                amount = -1 * parseFloat(t.amount);
              }
            }
          } else if (booking.user_id == user.id) {
            if (t.transaction_to == 2) {
              if (t.type == 1) {
                amount = parseFloat(t.amount);
              } else if (t.type == 2) {
                amount = -1 * parseFloat(t.amount);
              }
            }
          }
          i = i + amount;
        }, this);
        return i;
      }
    }
  }

  adminTransactionReceiptsView() {
    const { booking, user } = this.props;
    if (booking.status != null) {
      const { car, transaction } = this.props.booking;
      if (transaction) {
        return booking.transaction.map(t => {
          if (car.user_id == user.id) {
            if (t.transaction_to == 1) {
              return (
                <tr>
                  <td>{t.transaction_title}</td>
                  <td className="recipt-amount">
                    {" "}
                    {t.type == 1 ? "" : "-"} $ {t.amount}{" "}
                  </td>
                </tr>
              );
            }
          } else if (booking.user_id == user.id) {
            if (t.transaction_to == 2) {
              return (
                <tr>
                  <td>{t.transaction_title}</td>
                  <td className="recipt-amount">
                    {" "}
                    {t.type == 1 ? "" : "-"} $ {t.amount}{" "}
                  </td>
                </tr>
              );
            }
          }
        });
      }
    }
  }

  handleCloseModal() {
    const { dispatch } = this.props;
    dispatch({ type: MODAL_POPUP, payload: false });
  }

  showReceiptPopup() {
    this.setState({ showReceipt: true });
  }

  handleCloseModalLarge() {
    this.setState({ showReceipt: false, showCheckoutPhoto: false });
  }

  // Owner confirms the booking
  confirmBooking() {
    const { dispatch, booking } = this.props;
    dispatch(confirmBooking(booking.id));
  }

  // Owner cancels the booking
  declineBooking() {
    const { dispatch, booking } = this.props;
    dispatch(declineBooking(booking.id));
  }

  // The Renter cancels the booking
  cancelBooking() {
    const { dispatch, booking } = this.props;
    dispatch(cancelBooking(booking.id));
  }

  handleCheckout() {
    const { booking, history } = this.props;
    history.push(`/booking-checkout/${booking.id}`);
  }

  // Create booking status

  bookingStatus(booking) {
    const { user } = this.props;
    const startDate = moment(booking.from_date);
    const caliDateTime = moment().tz("America/Los_Angeles");
    const endDate = moment(booking.to_date);

    if (booking.status != null) {
      if (booking.status == 0) {
        return <h4 className="text-warning">Pending</h4>;
      }

      if (booking.status == 1) {
        return <h4 className="text-primary">Confirmed</h4>;
      }
      if (booking.status == 2) {
        return <h4 className="text-success">On Trip</h4>;
      }
      if (booking.status == -1) {
        return <h4 className="text-danger">Canceled</h4>;
      }
      if (booking.status == 3) {
        return (
          <h4 className="text-secondary" style={{ color: "#7f8c8d" }}>
            Completed
          </h4>
        );
      }
    }
  }

  totalAmount() {
    const { booking, user } = this.props;
    const { car } = booking;
    if (booking.payment) {
      if (car.user_id == user.id) {
        return (
          ((parseFloat(
            (booking.payment[0].item_price *
              (100 - booking.payment[0].discount)) /
              100
          ) +
            parseFloat(booking.payment[0].delivary_charge)) *
            (100 - parseFloat(booking.payment[0].commission))) /
          100
        ).toFixed(2);
      } else {
        return (
          parseFloat(
            (booking.payment[0].item_price *
              (100 - booking.payment[0].discount)) /
              100
          ) +
          parseFloat(booking.payment[0].delivary_charge) -
          (parseFloat(booking.payment[0].company_contribution) *
            (100 + parseFloat(booking.payment[0].tax))) /
            100
        ).toFixed(2);
      }
    }
  }

  render() {
    const { booking, user } = this.props;
    const { car } = booking;
    let extraPhotos = [];
    if (booking.car_checkout_detail && booking.car_checkout_detail.extra) {
      extraPhotos = JSON.parse(booking.car_checkout_detail.extra);
    }

    const startDate = moment(booking.from_date, "YYYY-MM-DD HH:mm:ss");
    const endDate = moment(booking.to_date, "YYYY-MM-DD HH:mm:ss");

    let totalAmount =
      parseFloat(this.totalAmount()) + parseFloat(this.adminTransaction());

    const caliDateTime = moment().tz("America/Los_Angeles");
    const ms = startDate.diff(caliDateTime);
    const timeDiff = moment.duration(ms)._milliseconds;

    const timeDiffInHours = timeDiff / 3600000;
    const checkoutPhotoBtn =
      timeDiffInHours <= 3 && booking.user.status == 1 ? false : true;

    const currentTime = moment().tz("America/Los_Angeles");
    const endDateTime = moment(booking.to_date);
    let checkTripEnd = false;
    if (
      currentTime.format("YYYY-MM-DD hh:mm:ss") >
      endDateTime.format("YYYY-MM-DD hh:mm:ss")
    ) {
      checkTripEnd = true;
    } else {
      checkTripEnd = false;
    }
    return (
      <div>
        <div className="container booked-page">
          <div className="row">
            <div className="col-md-8">
              <h1>BOOKED TRIP</h1>
            </div>
            <div className="col-md-4">
              <span className="reservation-id">
                RESERVATION ID{" "}
                <span className="id-label">{booking.number}</span>
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="well well-sm title-bar">
                <div className="row">
                  <div className="col-sm-9">
                    <h4>
                      {car.year} {car.car_make.name} {car.car_model.name}
                    </h4>
                  </div>
                  <div className="col-sm-3">{this.bookingStatus(booking)}</div>
                </div>
              </div>
              <div className="panel">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-sm-4">
                      <img
                        className="thumbnail-image-small"
                        src={
                          car.car_photo.length
                            ? car.car_photo[0].image_thumb
                            : null
                        }
                      />
                    </div>
                    <div className="col-sm-8">
                      <div className="content-box clearfix">
                        <div className="content-label">
                          {booking.user.first_name} TRIP
                        </div>
                        <table className="table no-m-b">
                          <tbody>
                            <tr>
                              <td>
                                <div className="content-label-header-lg">
                                  {startDate.format("ddd, MMM D")}
                                  <div className="content-label">
                                    {startDate.format("h:mm a")}
                                  </div>
                                </div>
                              </td>
                              <td className="text-left">
                                <img src="/images/arrow.png" />
                              </td>
                              <td>
                                <div className="content-label-header-lg">
                                  {endDate.format("ddd, MMM D")}
                                  <div className="content-label">
                                    {endDate.format("h:mm a")}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="content-box clearfix">
                        <div className="content-label">
                          {booking.delivery_location_method
                            ? booking.delivery_location_method.type
                            : null}
                        </div>
                        <div className="content-label-header">
                          {booking.delivery_location_method &&
                          ((booking.status == 0 || booking.status == -1) &&
                            booking.user_type == "renter" &&
                            booking.delivery_location_method.type ==
                              "PICK UP LOCATION")
                            ? booking.car.car_zip_code
                            : [
                                booking.delivery_location_method
                                  ? booking.delivery_location_method.location
                                  : null
                              ]}
                        </div>
                      </div>

                      {booking.delivery_location_method &&
                      booking.delivery_location_method.type ==
                        "PICK UP LOCATION" ? (
                        <div className="content-box clearfix">
                          <div className="content-label">
                            Pick up instructions
                          </div>
                          <div className="content-label-header">
                            {car.pickup_instructions}
                          </div>
                        </div>
                      ) : null}

                      <div className="content-box clearfix">
                        <div className="content-label">Miles included</div>
                        <div className="content-label-header">
                          {booking.miles_included} miles
                        </div>
                      </div>
                      <div className="content-box clearfix">
                        <div className="content-label">
                          Total {user.id == car.user_id ? "earnings" : "amount"}
                        </div>
                        <div className="content-label-header">
                          ${" "}
                          {car.user_id == user.id
                            ? booking.car_owner_amount
                            : booking.amount_charged}
                        </div>
                      </div>
                      {(checkTripEnd && car.user_id == user.id) ||
                      booking.user_id == user.id ? (
                        <div className="content-box clearfix">
                          <div className="content-label">
                            <a
                              className="link-booked"
                              onClick={this.showReceiptPopup}
                            >
                              View Receipt
                            </a>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="content-box clearfix" />
                    </div>
                  </div>
                  <div className="content-label">
                    {(booking.status == 2 || booking.status == 3) &&
                    booking.car_checkout_detail &&
                    booking.car_checkout_detail.id ? (
                      <div>
                        <div className="previewCarImage clearfix">
                          <h4> Final Checkout Photos </h4>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.fuel_level}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.fuel_level
                                })
                              }
                            />
                          </div>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.mileage}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.mileage
                                })
                              }
                            />
                          </div>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.car_front}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.car_front
                                })
                              }
                            />
                          </div>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.driver_side}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.driver_side
                                })
                              }
                            />
                          </div>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.passenger_side}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.passenger_side
                                })
                              }
                            />
                          </div>
                          <div className="dz-details">
                            <img
                              className="car-preview-thumb"
                              src={booking.car_checkout_detail.car_back}
                              onClick={() =>
                                this.setState({
                                  showCheckoutPhoto: true,
                                  checkoutPhoto:
                                    booking.car_checkout_detail.car_back
                                })
                              }
                            />
                          </div>
                          {booking.car_checkout_detail &&
                            booking.car_checkout_detail.extra &&
                            extraPhotos.map((image, key) => {
                              return (
                                <div className="dz-details" key={key}>
                                  <img
                                    className="car-preview-thumb"
                                    src={image}
                                    onClick={() =>
                                      this.setState({
                                        showCheckoutPhoto: true,
                                        checkoutPhoto: image
                                      })
                                    }
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="panel panel-custom">
                <div className="panel-body">
                  {/*can cancel before booking start date */}
                  {car.user_id == user.id && booking.user.status == 1 ? (
                    <div>
                      {booking.status != null && booking.status == 0 ? (
                        <div>
                          <button
                            className="btn btn-success btn-block"
                            onClick={this.confirmBooking}
                          >
                            Confirm
                          </button>
                        </div>
                      ) : null}
                      {booking.status != null && booking.status == 0 ? (
                        <div>
                          <button
                            className="btn btn-default btn-block"
                            onClick={this.declineBooking}
                          >
                            Decline
                          </button>
                          <hr />
                        </div>
                      ) : null}
                      {booking.status != null && booking.status == 1 ? (
                        <div>
                          <button
                            className="btn btn-default btn-block"
                            onClick={this.cancelBooking}
                          >
                            Cancel
                          </button>
                          <hr />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {car.user_id == user.id &&
                  booking.status != null &&
                  booking.status == 1 &&
                  !booking.car_checkout_detail ? (
                    <div>
                      <button
                        disabled={checkoutPhotoBtn}
                        className="btn btn-success btn-block"
                        onClick={this.handleCheckout}
                      >
                        {" "}
                        Checkout Photos{" "}
                      </button>
                    </div>
                  ) : null}
                  {booking.user_id == user.id &&
                  booking.status != null &&
                  timeDiff > 0 &&
                  booking.status != -1 ? (
                    <div>
                      <hr />
                      <button
                        className="btn btn-default btn-block"
                        onClick={this.cancelBooking}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}

                  <div className="media">
                    {user.id == car.user_id && user.id && car.user_id ? (
                      <h4>Renter</h4>
                    ) : (
                      <h4>Car Owner</h4>
                    )}
                    <div className="car-user-wrap clearfix">
                      <div className="media-left">
                        {user.id == car.user_id && user.id && car.user_id ? (
                          <img
                            className="media-object img-circle img-thumbnail user-profile-pic-midium"
                            src={booking.user.profile_image_thumb}
                          />
                        ) : null}
                        {user.id == booking.user_id &&
                        user.id &&
                        car.user_id ? (
                          <img
                            className="media-object img-circle img-thumbnail user-profile-pic-midium"
                            src={car.car_owner.profile_image_thumb}
                          />
                        ) : null}
                      </div>
                      <div className="media-body">
                        {user.id == car.user_id && user.id && car.user_id ? (
                          <Link to={"/profile/" + booking.user.id}>
                            <h4 className="label-gray-lg">
                              {booking.user.first_name}
                            </h4>
                          </Link>
                        ) : (
                          <Link to={"/profile/" + car.user_id}>
                            <h4 className="label-gray-lg">
                              {car.car_owner.first_name}
                            </h4>
                          </Link>
                        )}

                        {booking.status == 1 || booking.status == 2 ? (
                          <p>
                            {user.id == car.user_id && user.id && car.user_id
                              ? booking.user.phone_number
                              : car.car_owner.phone_number}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>

                  {((booking && booking.status == 2) ||
                    booking.status == 3) && (
                    <div>
                      {" "}
                      <hr />{" "}
                      <button
                        className="link-booked car-user-msg share-button"
                        onClick={() =>
                          this.setState({ showExperincesModal: true })
                        }
                      >
                        <span
                          className="glyphicon glyphicon-share"
                          aria-hidden="true"
                        />{" "}
                        Share Your Experience
                      </button>{" "}
                    </div>
                  )}

                  <hr />
                  {user.id == car.user_id && user.id && car.user_id ? (
                    <Link
                      to="/message-center"
                      className="link-booked car-user-msg"
                    >
                      <img src="/images/msg-icon.png" /> &nbsp; Message Renter{" "}
                    </Link>
                  ) : null}
                  {user.id == booking.user_id && user.id && car.user_id ? (
                    <Link
                      to="/message-center"
                      className="link-booked car-user-msg"
                    >
                      <img src="/images/msg-icon.png" /> &nbsp; Message Owner{" "}
                    </Link>
                  ) : null}
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.showCheckoutPhoto}
          onRequestClose={this.handleCloseModalLarge}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={carUpdatePhoto}
        >
          <img className="popUpCarImage" src={this.state.checkoutPhoto} />
        </Modal>

        <Modal
          isOpen={this.state.showReceipt}
          onRequestClose={this.handleCloseModalLarge}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          style={modalStylesBookingLarge}
        >
          <button
            className="modal-close-btn pull-right"
            onClick={this.handleCloseModalLarge}
          >
            <i className="fa fa-close" /> Close
          </button>
          {booking.id ? (
            <Receipt
              user={user}
              booking={booking}
              owner={car.user_id == user.id ? true : false}
              adminTransaction={this.adminTransaction()}
              adminTransactionReceiptsView={this.adminTransactionReceiptsView()}
            />
          ) : null}
        </Modal>

        <Modal
          isOpen={this.props.popUp}
          onRequestClose={this.handleCloseModal}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          style={modalStylesBooking}
        >
          <div className="center booking-modal">
            <h3 className="congrats-text"> {this.state.modalText} </h3>
          </div>
          <br />
        </Modal>

        <ExperienceForm
          bookingId={booking.id}
          showExperincesModal={this.state.showExperincesModal}
          shouldCloseOnOverlayClick={true}
          onRequestClose={() => this.setState({ showExperincesModal: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    booking: state.booking.booking,
    popUp: state.booking.popUp,
    user: state.user.user
  };
};

export default withRouter(
  connect(mapStateToProps)(checkAuth(BookingConfirmation))
);
