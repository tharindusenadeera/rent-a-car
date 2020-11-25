import React from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {
  TRIP_IS_PENDING,
  TRIP_IS_CONFIRM,
  TRIP_IS_CANCELED,
  TRIP_IS_ONTRIP,
  TRIP_IS_END
} from "../../consts/consts";
import { Link } from "react-router-dom";
import { Button } from "antd";
import moment from "moment";
import ViewReceipt from "./ViewReceipt";
import Image from "react-shimmer";
import _ from "lodash";
import TripsSummaryToMessage from "./TripsSummaryToMessage";

const setStatusIconObj = status => {
  switch (status) {
    case TRIP_IS_PENDING:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          {/* <img
            alt="Pending Acceptance status Icon"
            src="/images/profilev2/pending-acceptance-icon-orange.svg"
          /> */}
          <span className="trip-status-text pending-stat-color">
            <span className="icon-set-one-pending-icon status-icon-default" />
            Pending Acceptance
          </span>
        </div>
      );
    case TRIP_IS_CANCELED:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          {/* <img
            alt="Canceled status Icon"
            src="/images/profilev2/canceled-icon-red.svg"
          /> */}
          <span className="trip-status-text canceled-stat-color">
            <span className="icon-set-one-cancel-icon status-icon-default" />
            Canceled
          </span>
        </div>
      );
    case TRIP_IS_CONFIRM:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          {/* <img
            alt="Confirmed status Icon"
            src="/images/profilev2/confirmed-icon-blue.svg"
          /> */}
          <span className="trip-status-text confirmed-stat-color">
            <span className="icon-set-one-confirm-icon status-icon-default" />
            Confirmed
          </span>
        </div>
      );
    case TRIP_IS_ONTRIP:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          {/* <img
            alt="On trip status Icon"
            src="/images/profilev2/on-trip-icon-green.svg"
          /> */}
          <span className="trip-status-text ontrip-stat-color">
            <span className="icon-set-one-on-trip-icon status-icon-default" />
            On trip
          </span>
        </div>
      );
    case TRIP_IS_END:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          {/* <img
            alt="Completed status Icon"
            src="/images/profilev2/completed-icon-gray.svg"
          /> */}
          <span className="trip-status-text completed-stat-color">
            <span className="icon-set-one-completed-icon status-icon-default" />
            Completed
          </span>
        </div>
      );
    default:
      return (
        <div className="profile-inline-blocks trip-status-icon">
          <img
            alt="Pending Acceptance status Icon"
            src="/images/profilev2/pending-acceptance-icon-orange.svg"
          />
          <span className="trip-status-text completed-stat-color">Other</span>
        </div>
      );
  }
};

const getNumberOfPendingExtraRequest = booking => {
  if (booking && booking.tickets && booking.tickets.length > 0) {
    let result = booking.tickets.filter(ticket => {
      return ticket.status == 1;
    });
    return result.length;
  } else {
    return 0;
  }
};

const handleTripId = (tripInfo, history, data, userType) => {
  if (isNaN(tripInfo) && tripInfo.charAt(0) == "A") {
    var newStr = tripInfo.replace("A", "");
    history.push({
      pathname: "/booking/" + newStr,
      search: queryString.stringify({
        data,
        userType
      })
    });
  } else {
    history.push({
      pathname: "/booking/" + tripInfo,
      search: queryString.stringify({
        data,
        userType
      })
    });
  }
};

const boaderColor = status => {
  switch (status) {
    case TRIP_IS_PENDING:
      return "pending-border-color";
    case TRIP_IS_CANCELED:
      return "canceled-border-color";
    case TRIP_IS_CONFIRM:
      return "confirmed-border-color";
    case TRIP_IS_ONTRIP:
      return "ontrip-border-color";
    case TRIP_IS_END:
      return "completed-border-color";
    default:
      return "";
  }
};

const viewMoreButtonColor = status => {
  switch (status) {
    case TRIP_IS_PENDING:
      return "view-more-orange-btn";
    case TRIP_IS_CANCELED:
      return "view-more-red-btn";
    case TRIP_IS_CONFIRM:
      return "view-more-blue-btn";
    case TRIP_IS_ONTRIP:
      return "view-more-green-btn";
    case TRIP_IS_END:
      return "view-more-gray-btn";
    default:
      return "";
  }
};

const BookingDetails = props => {
  const { tripInfo, booking, carCoverageLevels } = props;

  return (
    <div className="booking-details-outer">
      {/* <div className="car-photo-wrapper pending-border-color"> */}
      <div className={`car-photo-wrapper ${boaderColor(tripInfo.status)}`}>
        {/* <img className="img-responsive" src={tripInfo.carImage} /> */}
        <Image
          className="img-responsive"
          src={tripInfo.carImage}
          width={108}
          height={240}
          style={{ objectFit: "cover" }}
        />
        <Button
          onClick={() => {
            handleTripId(tripInfo.id, props.history);
          }}
          className={`${viewMoreButtonColor(tripInfo.status)}`}
        >
          <span>View more</span>
        </Button>
      </div>
      <div className="trip-car-info-wrapper">
        {setStatusIconObj(tripInfo.status)}
        <div className="trip-car-name">{tripInfo.carName}</div>
        <div className="trip-car-id">Trip id - {tripInfo.tripId}</div>

        {booking && booking.tickets && booking.tickets.length > 0 && (
          <div className="drawer-section">
            <a className="view-request-wrapper">
              <div
                className="profile-inline-blocks"
                onClick={() => {
                  handleTripId(
                    tripInfo.id,
                    props.history,
                    "viewRequest",
                    tripInfo.userType
                  );
                }}
              >
                <img
                  alt="Request Icon"
                  src="/images/profilev2/request-icon-orange.svg"
                />
                <span>View request</span>
              </div>
              {getNumberOfPendingExtraRequest(booking) > 0 && (
                <div>
                  {getNumberOfPendingExtraRequest(booking) > 9 ? (
                    <div className="request-count-circle">9+</div>
                  ) : (
                    <div className="request-count-circle">
                      {getNumberOfPendingExtraRequest(booking)}
                    </div>
                  )}
                </div>
              )}
            </a>
          </div>
        )}

        <div className="drawer-section">
          <div className="profile-inline-blocks-outer">
            <div className="profile-inline-left">
              <div className="drawer-text-sm">From</div>
              {tripInfo.fromDate && (
                <div className="drawer-text-lg">
                  {tripInfo.fromDate.slice(0, -2)}
                  <sup>{tripInfo.fromDate.slice(-2)}</sup>
                </div>
              )}
              <div className="drawer-text-md">{tripInfo.fromTime}</div>
            </div>
            <div className="profile-inline-center">
              <img alt="Arrow Icon" src="/images/arrow-icon-new.png" />
            </div>
            <div className="profile-inline-right">
              <div className="drawer-text-sm">To</div>
              {tripInfo.toDate && (
                <div className="drawer-text-lg">
                  {tripInfo.toDate.slice(0, -2)}
                  <sup>{tripInfo.toDate.slice(-2)}</sup>
                </div>
              )}
              <div className="drawer-text-md">{tripInfo.toTime}</div>
            </div>
          </div>
        </div>

        <div className="drawer-section">
          <div className="drawer-text-sm">Delivery location</div>
          <p>{tripInfo.deliveryLocation}</p>

          <div className="drawer-text-sm" style={{ paddingTop: "15px" }}>
            Drop-off location
          </div>
          <p>
            {tripInfo && tripInfo.dropoff_location
              ? tripInfo.dropoff_location
              : ""}
          </p>
        </div>

        <div className="drawer-section">
          <div className="profile-inline-blocks-outer">
            <div className="drawer-text-sm">Total amount</div>
            <div className="drawer-text-lg">$ {tripInfo.amountCharged}</div>
          </div>
        </div>

        {tripInfo.receiptAvailability ? (
          <ViewReceipt
            tripInfo={tripInfo}
            carCoverageLevels={carCoverageLevels}
          />
        ) : (
          ""
        )}

        <div
          className={`${
            tripInfo.responseTime
              ? "drawer-section"
              : "drawer-section-nonunderline"
          } user-contact-section`}
        >
          <div className="profile-inline-blocks-outer">
            <div>
              {tripInfo.userType == "owner" ? (
                <div className="profile-inline-blocks">
                  <a className="hov-click">
                    {/* <img
                      alt="Profile pic"
                      className="user-profile-pic"
                      src={tripInfo.user.profile_image_thumb}
                    /> */}
                    <Image
                      alt="Profile pic"
                      className="user-profile-pic"
                      src={tripInfo.user.profile_image_thumb}
                      width={48}
                      height={48}
                      style={{ objectFit: "cover" }}
                    />
                  </a>
                  <div>
                    <div className="drawer-text-sm">
                      <Link
                        to={"/profile/" + tripInfo.userId}
                        className="hov-click"
                      >
                        {tripInfo.user.first_name}
                      </Link>
                    </div>
                    <div className="drawer-text-xs">
                      Member since :{" "}
                      {moment(tripInfo.user.created_at.date).format(
                        "MMM - YYYY"
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="profile-inline-blocks">
                  <a className="hov-click">
                    <img
                      alt="Profile pic"
                      className="user-profile-pic"
                      src={tripInfo.carOwner.profile_image_thumb}
                    />
                  </a>
                  <div>
                    <div className="drawer-text-sm">
                      <Link
                        to={"/profile/" + tripInfo.carOwner.id}
                        className="hov-click"
                      >
                        {tripInfo.carOwner.first_name}
                      </Link>
                    </div>
                    <div className="drawer-text-xs">
                      Member since :{" "}
                      {moment(tripInfo.carOwner.created_at.date).format(
                        "MMM - YYYY"
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-inline-blocks">
              {!_.isEmpty(booking) && <TripsSummaryToMessage {...props} />}
              {tripInfo.status != TRIP_IS_PENDING &&
                tripInfo.status != TRIP_IS_CANCELED && (
                  <Button className="unstyled-btn hov-click">
                    <a href={`tel:${tripInfo.callTo ? tripInfo.callTo : null}`}>
                      <img
                        alt="Chat Icon"
                        className=""
                        src="/images/profilev2/call-icon-green-sm.svg"
                      />
                    </a>
                  </Button>
                )}
            </div>
          </div>
          {tripInfo.userType == "renter" && tripInfo.acceptanceRate ? (
            <div className="drawer-section profile-inline-blocks-outer acceptance-rate-section">
              <div>Acceptance rate</div>
              <div>{tripInfo.acceptanceRate}</div>
            </div>
          ) : null}

          {tripInfo.responseTime ? (
            <div className="drawer-section profile-inline-blocks-outer response-time-section">
              <div>Response time</div>
              <div>{tripInfo.responseTime}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default withRouter(BookingDetails);
