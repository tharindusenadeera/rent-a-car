import React from "react";
import { Link } from "react-router-dom";
//import { SimpleImg } from 'react-simple-img';
import { LazyImage } from "../comman";
import { isMobileOnly } from "react-device-detect";
import queryString from "query-string";
import moment from "moment-timezone";

const section2 = props => {
  return (
    <React.Fragment>
      <section className="ryde-section clearfix">
        <div className="ryde-inner-left">
          <div style={{ width: "100%" }}>
            <LazyImage
              withloader="content-loader"
              alt="List your RYDE"
              src="https://cdn.rydecars.com/static-images/list-car-bg.jpg"
              width={960}
              height={isMobileOnly ? 500 : 700}
            />
          </div>

          <div className="ryde-inner-content">
            <div className="min-content-wrapper">
              <h2>List your car</h2>
              {/* <p className="lg-para">
                Make money by renting your car directly to people on Ryde’s
                peer-to-peer car sharing platform. Sign up, list your Ryde and
                we’ll take care of the rest. We’ve got great insurance coverage,
                too, so you can rest easy.
              </p> */}
              {/* <br /> */}
              <ul className="list-left">
                <li className="sm-para">
                  Make extra money with your car by sharing it on RYDE
                </li>
                <li className="sm-para">Pay for your monthly car payments</li>
                <li className="sm-para">
                  Share your passion with other automotive enthusiasts
                </li>
                {/* <li className="sm-para">
                  Insurance coverage provided for every rental
                </li>
                <li className="sm-para">Average owners make $1400/mo</li> */}
              </ul>
            </div>
            <Link
              className="list-your-ryde-btn"
              to={
                props && props.props.authenticated === true
                  ? "/car-create"
                  : "/list-your-car"
              }
            >
              LIST YOUR CAR
            </Link>
          </div>
        </div>
        <div className="ryde-inner-right">
          <div style={{ width: "100%" }}>
            <LazyImage
              withloader="content-loader"
              alt="Rent a car, it’s easy."
              src="https://cdn.rydecars.com/static-images/rent-car-bg.jpg"
              width={960}
              height={isMobileOnly ? 565 : 700}
            />
          </div>
          <div className="ryde-inner-content">
            <div className="min-content-wrapper">
              <h2>
                {/* Rent a car, <span className="textNormal">it’s easy.</span> */}
                Rent a car
              </h2>
              {/* <p className="lg-para">
                RYDE’s mission is to change the car rental experience for the
                better. Here’s what you can expect:
              </p> */}
              {/* <br /> */}
              <ul className="list-right">
                <li className="sm-para">Find a car for any occasion</li>
                <li className="sm-para">No rental counter lines</li>
                <li className="sm-para">Premier customer service</li>
                {/* <li className="sm-para">
                  Insurance coverage included for every rental
                </li> */}
              </ul>
            </div>
            <Link
              className="rent-car-btn"
              to={{
                pathname: "/cars",
                search: queryString.stringify({
                  location:
                    localStorage.getItem("_source_location") != null
                      ? localStorage.getItem("_source_location")
                      : "Los Angeles, CA, USA",
                  lat:
                    localStorage.getItem("_source_lat") != null
                      ? localStorage.getItem("_source_lat")
                      : "34.0522342",
                  lng:
                    localStorage.getItem("_source_lng") != null
                      ? localStorage.getItem("_source_lng")
                      : "-118.2436849",
                  from: moment(props.from).format("MM-DD-YYYY"),
                  to: moment(props.to).format("MM-DD-YYYY"),
                  fromTime: props.from.format("HH:mm"),
                  toTime: props.to.format("HH:mm")
                })
              }}
            >
              RENT A CAR
            </Link>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default section2;
