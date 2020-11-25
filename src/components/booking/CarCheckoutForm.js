import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Switch from "react-switch";
import moment from "moment-timezone";
import _ from "lodash";
import axios from "axios";
import { getBooking } from "../../actions/BookingActions";
import { Upload } from "../file-processing/";
import InnerpageHeader from "../layouts/InnerPageHeader";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import PreLoader from "../preloaders/preloaders";
import { authFail } from "../../actions/AuthAction";
import checkAuth from "../requireAuth";

class CarCheckoutForm extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      carPopUp: false,
      carPhoto: "",
      checked: false,
      error: null,
      message: "",
      submitting: false
    };
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch(getBooking(match.params.id));
  }

  startBooking = id => {
    const { history, dispatch } = this.props;
    this.setState({
      submitting: !this.state.submitting
    });
    axios
      .post(
        `${process.env.REACT_APP_API_URL}v2/bookings/start`,
        { id: id },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        if (!res.data.error) {
          history.push(`/booking/${id}`);
          this.setState({
            submitting: false
          });
        } else console.log("Error");
      })
      .catch(e => {
        dispatch(authFail(e));
        if (e.response.data.error)
          this.setState({ error: true, message: e.response.data.message });
        // console.log("e", e.response.data.message);
      });
  };

  saveUploads = attachments => {
    const { booking, dispatch } = this.props;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}v2/bookings/car-checkout-form`,
        {
          booking_id: booking.id,
          identity: this.state.checked === true ? "yes" : "no",
          checkout_photos: attachments
        },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        if (!res.data.error) {
          this.startBooking(booking.id);
        }
      })
      .catch(e => dispatch(authFail(e)));
  };

  renderSubmitButton = attachments => {
    const { error, message } = this.state;
    return (
      <div className="container">
        {error === true && (
          <div className="row">
            <div className="col-md-12 GC_form_error images-comp-error-box">
              <img
                className="err-icon"
                src="/images/support-center/error_icon.svg"
              />
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="row">
          <div className="images-comp-cnt">
            <div className="col-md-6 col-xs-12">
              <p>
                {" "}
                <strong>
                  You cannot undo this. Please recheck your uploaded photos{" "}
                </strong>
              </p>
            </div>
            <div className="col-md-2 col-xs-12">
              <button
                type="submit"
                className="btn btn-success form-btn checkout"
                onClick={() => this.saveUploads(attachments)}
              >
                {this.state.submitting === true && this.state.error !== true && (
                  <div className="submit-btn-preloder">
                    <PreloaderIcon
                      loader={Oval}
                      size={20}
                      strokeWidth={8} // min: 1, max: 50
                      strokeColor="#fff"
                      duration={800}
                    />
                  </div>
                )}
                Start Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { booking } = this.props;
    const { checked } = this.state;
    if (_.isEmpty(booking)) {
      return (
        <Fragment>
          <MainNav />
          <InnerpageHeader
            header="FINAL CHECKOUT DETAILS"
            title="Upload/ Car Photos"
          />
          <PreLoader />
        </Fragment>
      );
    }
    const dateOfBirth = moment(booking.user.date_of_birth, "YYYY-MM-DD");

    return (
      <Fragment>
        <MainNav />
        <InnerpageHeader
          header="FINAL CHECKOUT DETAILS"
          title="Upload/ Car Photos"
        />
        <div className="form-horizontal">
          <br />
          <h4 className="center upload-checkout-head">
            UPLOAD YOUR CAR CHECKOUT PHOTOS
          </h4>
          <br />
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-xs-12">
                    <div className="checkout-present flex-space-between">
                      <h5>
                        Registered Driver <strong>{booking.user.first_name}</strong> Present
                      </h5>
                      <Switch
                        onChange={e => {
                          this.setState({ checked: e });
                        }}
                        checked={
                          this.state.checked === null
                            ? false
                            : this.state.checked
                        }
                        id="normal-switch"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12">
                    <div className="car-owner center">
                      <img
                        className="img-circle center"
                        width="100"
                        height="100"
                        src={booking.user.profile_image_thumb}
                        alt="Image"
                      />
                    </div>
                    <div className="owner-details">
                      <p className="center">
                        {" "}
                        &nbsp; <span className="title">Birthdate :</span> {dateOfBirth.format(
                          "MMM-DD-YYYY"
                        )}{" "}
                      </p>
                      <p className="center">
                        {" "}
                        &nbsp; <span className="title">Drivers License :</span>{" "}
                        {booking.user.driving_license_mask}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 images-comp-messg-box">
                    <div>
                      <img
                        className="messg-icon"
                        src="/images/support-center/status_message_icon.svg"
                      />
                    </div>
                    <p>
                      <span>
                        Minimum of 6 photos required to eligible for coverage
                        including front, back, passenger and driver side,
                        mileage and gas level. Feel free to take many photos.
                      </span>

                      <span>
                        Please Notify the other party that without the
                        registered driver{" "}
                        <strong>{booking.user.first_name}</strong> present at
                        the location, owner cannot rent this vehicle.{" "}
                        <Link to="/contact-us"> Contact Support Centre</Link>
                      </span>
                    </p>
                  </div>
                </div>

                {checked === true && (
                  <Upload
                    renderSubmitButton={this.renderSubmitButton}
                    folder="tmp/checkout"
                    multipleUploads={true}
                  />
                )}
              </div>
            </div>
            <br />
          </div>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    booking: state.booking.booking
  };
};
export default withRouter(connect(mapStateToProps)(checkAuth(CarCheckoutForm)));
