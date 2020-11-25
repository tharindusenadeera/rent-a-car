import React, { Component } from "react";
import { connect } from "react-redux";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  EmailShareButton,
  TwitterShareButton
} from "react-share";
import moment from "moment-timezone";
import AdvanceCarViewLinks from "./AdvanceCarViewLinks";

class AdvanceCarView extends Component {
  constructor(props) {
    super(props);
    const caliDateTime = moment().tz("America/Los_Angeles");
    const to = moment(caliDateTime).add(3, "days");
    this.state = {
      from: caliDateTime,
      to: to
    };
  }

  setCarUrl = car => {
    return `${window.location.origin}/car/${car.name}/${car.id}/${moment(
      this.state.from
    ).format("MM-DD-YYYY")}/${moment(this.state.from).format("HH:mm")}/${moment(
      this.state.to
    ).format("MM-DD-YYYY")}/${moment(this.state.to).format("HH:mm")}`;
  };

  setCarRoute = car => {
    return `/car/${car.id}/${moment(this.state.from).format(
      "MM-DD-YYYY"
    )}/${moment(this.state.from).format("HH:mm")}/${moment(
      this.state.to
    ).format("MM-DD-YYYY")}/${moment(this.state.to).format("HH:mm")}`;
  };

  render() {
    const { car } = this.props;
    return (
      <div>
        <div className="row flex-outer">
          <div
            className={
              car && car.status == 0
                ? `col-md-6 pending-bg panel-left-wrapper padding-remove-both`
                : car.status == 1
                  ? `col-md-6 approved-bg panel-left-wrapper padding-remove-both`
                  : car.status == 2
                    ? `col-md-6 reviewed-bg panel-left-wrapper padding-remove-both`
                    : null
            }
          >
            {car && car.status == 0 ? (
              <div className="flex-container">
                <img
                  className="status-icon"
                  src="/images/car-edit/pending-icon.svg"
                  alt="Pending"
                />
                <span className="status-label sp-pending-status-label">
                  Pending
                </span>
              </div>
            ) : car.status == 1 ? (
              <div className="flex-container">
                <img
                  className="status-icon"
                  src="/images/car-edit/approved-icon.svg"
                  alt="Approved"
                />
                <span className="status-label sp-approved-status-label">
                  Approved
                </span>
              </div>
            ) : car.status == 2 ? (
              <div className="flex-container">
                <img
                  className="status-icon"
                  src="/images/car-edit/reviewed-icon.svg"
                  alt="Reviewed"
                />
                <span className="status-label sp-reviewed-status-label">
                  Unlisted
                </span>
              </div>
            ) : null}
            <div className="sp-car-name">{car && car.name}</div>
            <div className="sp-car-price">
              $ {car && car.daily_rate} <span>Per day</span>
            </div>
            <div className="panel-left-bottom flex-container">
              {car && car.booking_count.trip_count > 1 ? (
                <div className="sp-trips">
                  {car.booking_count.trip_count} <span>Trips</span>
                </div>
              ) : (
                <div className="sp-trips">
                  {car.booking_count.trip_count} <span>Trip</span>
                </div>
              )}
              {car &&
                car.status == 1 && (
                  <div className="sp-share">
                    <FacebookShareButton
                      ref="child"
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.setCarUrl(car)}
                      quote={car.name}
                      className="Demo__some-network__share-button"
                    >
                      <button className="unstyled-button">
                        <img
                          className="sp-social-icons"
                          src="/images/car-edit/facebook-letter-logo-green.svg"
                          alt="Facebook"
                        />
                      </button>
                    </FacebookShareButton>

                    <TwitterShareButton
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.setCarUrl(car)}
                      quote={car.name}
                      className="Demo__some-network__share-button"
                    >
                      <button className="unstyled-button">
                        <img
                          className="sp-social-icons"
                          src="/images/car-edit/twitter-letter-logo-green.svg"
                          alt="Twitter"
                        />
                      </button>
                    </TwitterShareButton>

                    <GooglePlusShareButton
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.setCarUrl(car)}
                      quote={car.name}
                      className="Demo__some-network__share-button"
                    >
                      <button className="unstyled-button">
                        <img
                          className="sp-social-icons"
                          src="/images/car-edit/google-plus-letter-logo-green.svg"
                          alt="Google Pluse"
                        />
                      </button>
                    </GooglePlusShareButton>

                    <EmailShareButton
                      beforeOnClick={() => this.setState({ showModal: false })}
                      url={this.setCarUrl(car)}
                      quote={car.name}
                      className="Demo__some-network__share-button"
                    >
                      <button className="unstyled-button">
                        <img
                          className="sp-social-icons"
                          src="/images/car-edit/message-closed-envelope-green.svg"
                          alt="Envelop"
                        />
                      </button>
                    </EmailShareButton>
                  </div>
                )}
            </div>
          </div>
          <div className="col-md-6 panel-right-wrapper padding-remove-both">
            <img
              src={
                car && car.car_photo[0]
                  ? car.car_photo[0].image_thumb
                  : "https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png"
              }
              className="img-responsive"
              alt="Car"
            />
          </div>
        </div>

        <div className="row uneditable-outer-wrapper hidden-xs">
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">License plate number</div>
              <div className="sp-field">
                {car && car.license_plate_number && car.license_plate_number}
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Year</div>
              <div className="sp-field">{car && car.year}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Make</div>
              <div className="sp-field">{car && car.car_make.name}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Model</div>
              <div className="sp-field">{car && car.car_model.name}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Trim</div>
              <div className="sp-field">{car && car.trim.name}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Type</div>
              <div className="sp-field">{car && car.car_type}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Odometer</div>
              <div className="sp-field">{car && car.odometer} K</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="sp-field-wrapper">
              <div className="sp-label">Transmission</div>
              {car && car.transmission === 0 ? (
                <div className="sp-field">Manual</div>
              ) : (
                <div className="sp-field">Automatic</div>
              )}
            </div>
          </div>
        </div>

        <AdvanceCarViewLinks
          car_id={car && car.id}
          car_route={this.setCarRoute(car)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    car: state.car.car_v2
  };
};

export default connect(mapStateToProps)(AdvanceCarView);
