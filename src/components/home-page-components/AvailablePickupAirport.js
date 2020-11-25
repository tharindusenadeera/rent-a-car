import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { LazyImage } from "../comman";

const URL = props => {
  const { location, lat, lng, from, to, children, fromTime, toTime } = props;
  return (
    <Link
      className="search-rental-btn"
      to={{
        pathname: "/cars",
        search: queryString.stringify({
          location,
          lat,
          lng,
          from,
          to,
          fromTime,
          toTime
        })
      }}
    >
      {children}
    </Link>
  );
};

const AvailablePickupAirport = props => {
  const {
    isLosAngeles,
    isSanDiego,
    isSanFrancisco,
    isMiami
  } = props.landingPageProps;
  return (
    <section className="airport-section">
      <LazyImage src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/airport-bg.jpg" />
      {isLosAngeles && (
        <Fragment>
          <div className="fixed-content-wrapper">
            <div className="air-main-title">
              Skip the car rental counters at LAX
            </div>
            <div className="air-sub-title">Airport pickup available</div>
            {/* <Link
            className="search-rental-btn"
            to={`/cars/Los Angeles International Airport (LAX), World Way, Los Angeles, CA, USA/33.9444133/-118.39666879999999/${props.from.format(
              "MM-DD-YYYY"
            )}/${props.from.format("HH:mm")}/${props.to.format(
              "MM-DD-YYYY"
            )}/${props.to.format("HH:mm")}`}
          >
            SEARCH FOR LAX CAR RENTALS
          </Link> */}
            <URL
              location="Los Angeles International Airport (LAX), World Way, Los Angeles, CA, USA"
              lat="33.9444133"
              lng="-118.39666879999999"
              from={props.from.format("MM-DD-YYYY")}
              fromTime={props.from.format("HH:mm")}
              to={props.to.format("MM-DD-YYYY")}
              toTime={props.to.format("HH:mm")}
            >
              SEARCH FOR LAX CAR RENTALS
            </URL>
          </div>
        </Fragment>
      )}
      {isSanDiego && (
        <Fragment>
          <div className="fixed-content-wrapper">
            <div className="air-main-title">
              Skip the car rental counters at SAN
            </div>
            <div className="air-sub-title">Airport pickup available</div>
            {/* <Link
            className="search-rental-btn"
            to={`/cars/San Diego International Airport (SAN), North Harbor Drive, San Diego, CA, USA/32.7338006/-117.19330379999997/${props.from.format(
              "MM-DD-YYYY"
            )}/${props.from.format("HH:mm")}/${props.to.format(
              "MM-DD-YYYY"
            )}/${props.to.format("HH:mm")}`}
          >
            SEARCH FOR SAN CAR RENTALS
          </Link> */}
            <URL
              location="San Diego International Airport (SAN), North Harbor Drive, San Diego, CA, USA"
              lat="32.7338006"
              lng="-117.19330379999997"
              from={props.from.format("MM-DD-YYYY")}
              fromTime={props.from.format("HH:mm")}
              to={props.to.format("MM-DD-YYYY")}
              toTime={props.to.format("HH:mm")}
            >
              SEARCH FOR SAN CAR RENTALS
            </URL>
          </div>
        </Fragment>
      )}
      {isSanFrancisco && (
        <Fragment>
          <div className="fixed-content-wrapper">
            <div className="air-main-title">
              Skip the car rental counters at SFO
            </div>
            <div className="air-sub-title">Airport pickup available</div>
            {/* <Link
            className="search-rental-btn"
            to={`/cars/San Francisco International Airport (SFO), San Francisco, CA, USA/37.6213129/-122.3789554/${props.from.format(
              "MM-DD-YYYY"
            )}/${props.from.format("HH:mm")}/${props.to.format(
              "MM-DD-YYYY"
            )}/${props.to.format("HH:mm")}`}
          >
            SEARCH FOR SFO CAR RENTALS
          </Link> */}

            <URL
              location="San Francisco International Airport (SFO), San Francisco, CA, USA"
              lat="37.6213129"
              lng="-122.3789554"
              from={props.from.format("MM-DD-YYYY")}
              fromTime={props.from.format("HH:mm")}
              to={props.to.format("MM-DD-YYYY")}
              toTime={props.to.format("HH:mm")}
            >
              SEARCH FOR SFO CAR RENTALS
            </URL>
          </div>
        </Fragment>
      )}
      {isMiami && (
        <Fragment>
          <div className="fixed-content-wrapper">
            <div className="air-main-title">
              Skip the car rental counters at MIA
            </div>
            <div className="air-sub-title">Airport pickup available</div>
            {/* <Link
            className="search-rental-btn"
            to={`/cars/Miami International Airport, Miami, FL, USA/25.795865/-80.28704570000002/${props.from.format(
              "MM-DD-YYYY"
            )}/${props.from.format("HH:mm")}/${props.to.format(
              "MM-DD-YYYY"
            )}/${props.to.format("HH:mm")}`}
          >
            SEARCH FOR MIA CAR RENTALS
          </Link> */}

            <URL
              location="Miami International Airport, Miami, FL, USA"
              lat="25.795865"
              lng="-80.28704570000002"
              from={props.from.format("MM-DD-YYYY")}
              fromTime={props.from.format("HH:mm")}
              to={props.to.format("MM-DD-YYYY")}
              toTime={props.to.format("HH:mm")}
            >
              SEARCH FOR MIA CAR RENTALS
            </URL>
          </div>
        </Fragment>
      )}
      ,
    </section>
  );
};

export default AvailablePickupAirport;
