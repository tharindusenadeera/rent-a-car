import React from "react";
import { Button } from "antd";
import moment from "moment-timezone";
import Image from "react-shimmer";
import {
  FacebookShareButton,
  GooglePlusShareButton,
  EmailShareButton,
  TwitterShareButton
} from "react-share";
import "antd/lib/button/style/index.css";

const setCarUrl = carInfo => {
  const caliDateTime = moment().tz("America/Los_Angeles");
  const from = moment().tz("America/Los_Angeles");
  const to = moment(caliDateTime).add(3, "days");
  return `${window.location.origin}/car/${carInfo.name}/${carInfo.id}/${moment(
    from
  ).format("MM-DD-YYYY")}/${moment(from).format("HH:mm")}/${moment(to).format(
    "MM-DD-YYYY"
  )}/${moment(to).format("HH:mm")}`;
};

const BookingDetails = props => {
  let carInfo = props.carInfo;

  const boaderColor = status => {
    switch (status) {
      case "pending":
        return "pending-border-color";
      case "reviewed":
        return "canceled-border-color";
      case "approved":
        return "completed-border-color";
      case "incomplete":
        return "completed-border-color";
      case "unavailable":
        return "unlist-border-color";
      default:
        return "";
    }
  };

  const viewMoreButtonColor = status => {
    switch (status) {
      case "pending":
        return "view-more-orange-btn";
      case "reviewed":
        return "view-more-red-btn";
      case "approved":
        return "view-more-gray-btn";
      case "incomplete":
        return "view-more-green-btn";
      case "unavailable":
        return "view-more-lightgray-btn";
      default:
        return "";
    }
  };

  return (
    <div className="booking-details-outer">
      <div className={`car-photo-wrapper ${boaderColor(carInfo.cstatus)}`}>
        {/* <img className="img-responsive" src={carInfo.carImage} /> */}
        <Image
          className="img-responsive"
          src={carInfo.carImage}
          width={100}
          height={240}
          style={{ objectFit: "cover" }}
        />
        <Button
          onClick={() => props.history.push("/car-update/" + carInfo.id)}
          className={viewMoreButtonColor(carInfo.cstatus)}
        >
          <span>Edit car</span>
        </Button>
      </div>

      <div className="trip-car-info-wrapper">
        {carInfo.cstatus === "approved" && (
          <div className="profile-inline-blocks trip-status-icon">
            <span className="icon-set-one-completed-icon status-icon-default" />
            <span className="trip-status-text completed-stat-color">
              Approved
            </span>
          </div>
        )}

        {carInfo.cstatus === "incomplete" && (
          <div className="profile-inline-blocks trip-status-icon">
            <span className="icon-set-one-on-trip-icon status-icon-default" />
            <span className="trip-status-text ontrip-stat-color">
              Incomplete
            </span>
          </div>
        )}

        {carInfo.cstatus === "pending" && (
          <div className="profile-inline-blocks trip-status-icon">
            <span className="icon-set-one-pending-icon status-icon-default" />
            <span className="trip-status-text pending-stat-color">Pending</span>
          </div>
        )}
        {carInfo.cstatus === "unavailable" && (
          <div className="profile-inline-blocks trip-status-icon">
            <span className="icon-set-one-pending-icon status-icon-default" />
            <span className="trip-status-text pending-stat-color">
              Unlisted
            </span>
          </div>
        )}

        {carInfo.cstatus === "reviewed" && (
          <div className="profile-inline-blocks trip-status-icon">
            <span className="icon-set-one-cancel-icon status-icon-default" />
            <span className="trip-status-text canceled-stat-color">
              Reviewed
            </span>
          </div>
        )}
        <div className="trip-car-name">{carInfo.carName}</div>

        <div className="drawer-section">
          <div className="profile-inline-blocks-outer">
            <div className="drawer-text-sm">Daily rate</div>
            <div className="drawer-text-lg">{carInfo.dailyRate}</div>
          </div>
        </div>

        <div className="drawer-section">
          <div className="profile-inline-blocks-outer">
            <div className="drawer-text-sm">Trips</div>
            <div className="drawer-text-lg">{carInfo.carTripsCount}</div>
          </div>
          {carInfo.carTripsCount > 0 && (
            <Button
              className="trips-tb-text-sm history-wrap hov-click"
              onClick={() => {
                props.history.push(`/my-profile/trips/${carInfo.id}`);
                props.onClose();
              }}
            >
              <img
                className="history-icon-green"
                src="/images/profilev2/history-icon-green.svg"
              />
              View trip history
            </Button>
          )}
        </div>

        <div className="drawer-section">
          <div className="profile-inline-blocks-outer">
            <div className="drawer-text-sm drawer-text-left">
              <div className="text-inner-text">License plate number</div>
              <div className="text-inner-text">Year</div>
              <div className="text-inner-text">Make</div>
              <div className="text-inner-text">Model</div>
              <div className="text-inner-text">Trim</div>
              <div className="text-inner-text">Type</div>
              <div className="text-inner-text">Odometer</div>
              <div className="text-inner-text">Transmission</div>
              <div className="text-inner-text">State</div>
            </div>
            <div className="drawer-text-sm drawer-text-right">
              <div className="text-inner-text">{carInfo.licensePlate}</div>
              <div className="text-inner-text">{carInfo.year}</div>
              <div className="text-inner-text">{carInfo.carMake}</div>
              <div className="text-inner-text">{carInfo.carModel}</div>
              <div className="text-inner-text">Base</div>
              <div className="text-inner-text">Sedan</div>
              <div className="text-inner-text">0 - 20K</div>
              <div className="text-inner-text">{carInfo.transmission}</div>
              <div className="text-inner-text">CA</div>
            </div>
          </div>
        </div>

        {carInfo.cstatus !== "pending" && (
          <div className="drawer-section">
            <div className="profile-inline-blocks-outer">
              <div className="drawer-text-sm">Share this car</div>
              <div className="share-car-wrapper">
                <FacebookShareButton
                  url={setCarUrl(carInfo)}
                  quote={carInfo.name}
                  className="Demo__some-network__share-button"
                >
                  <Button className="unstyled-btn hov-click">
                    <img
                      className="social-icons-green"
                      src="/images/profilev2/fb-logo-green.svg"
                    />
                  </Button>
                </FacebookShareButton>

                <TwitterShareButton
                  url={setCarUrl(carInfo)}
                  quote={carInfo.name}
                  className="Demo__some-network__share-button"
                >
                  <Button className="unstyled-btn hov-click">
                    <img
                      className="social-icons-green"
                      src="/images/profilev2/twitter-logo-green.svg"
                    />
                  </Button>
                </TwitterShareButton>

                <GooglePlusShareButton
                  url={setCarUrl(carInfo)}
                  quote={carInfo.name}
                  className="Demo__some-network__share-button"
                >
                  <Button className="unstyled-btn hov-click">
                    <img
                      className="social-icons-green"
                      src="/images/profilev2/google-plus-logo-green.svg"
                    />
                  </Button>
                </GooglePlusShareButton>

                <EmailShareButton
                  url={setCarUrl(carInfo)}
                  quote={carInfo.name}
                  className="Demo__some-network__share-button"
                >
                  <Button className="unstyled-btn hov-click">
                    <img
                      className="social-icons-green"
                      src="/images/profilev2/envelope-green.svg"
                    />
                  </Button>
                </EmailShareButton>
              </div>
            </div>
          </div>
        )}

        <div className="drawer-section">
          <Button
            onClick={() =>
              props.history.push("/car-availability/" + carInfo.id)
            }
            className="unstyled-btn add-unav-btn hov-click"
          >
            <img
              className="cale-icons-green"
              src="/images/profilev2/calendar-icon-green.svg"
            />
            Add unavailability
          </Button>
        </div>
        <div className="drawer-section">
          <Button
            onClick={() => props.handleSubDrawer(carInfo.id)}
            className="unstyled-btn add-unav-btn hov-click"
          >
            <img
              className="cale-icons-green"
              src="/images/profilev2/calendar-icon-green.svg"
            />
            Price Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
