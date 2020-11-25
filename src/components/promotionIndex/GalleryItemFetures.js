import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import Rating from "react-rating";
import { LazyImage } from "../comman";
import { isMobile, isMobileOnly } from "react-device-detect";

const GalleryItemFetures = props => {
  const { car } = props;

  const { carOwner } = car;
  const from = moment()
    .add(3, "hours")
    .format("MM-DD-YYYY");
  const fromTime = moment()
    .add(3, "hours")
    .format("HH:mm");
  const to = moment()
    .add(3, "days")
    .format("MM-DD-YYYY");
  const toTime = moment()
    .add(3, "days")
    .format("HH:mm");
  const { source } = props.citiesLocationData;

  return (
    <div>
      <Link
        className="featured-item-link cars-box-link"
        to={{
          pathname: `/car/${car.carName}/${car.id}`,
          search: queryString.stringify({
            from,
            fromTime,
            to,
            toTime,
            source,
            _from: "cardetails"
          })
        }}
      >
        <div className="featured-item-img-outer ec-img-wrapper">
          <LazyImage
            withloader="content-loader"
            className="Promo19-thumb explore"
            role="presentation"
            alt="Fretured cars"
            effect="blur"
            src={
              car.car_image &&
              car.car_image.image_thumb &&
              car.car_image.image_thumb
            }
            width={isMobileOnly ? 275 : 274}
            height={180}
          />
        </div>
        <div className="Promo19-title explore">
          <h3>{car.carName}</h3>
          <div className="flex-wrapper flex-space-between">
            <div>
              <span className="car-rate-lg explore">${car.daily_rate}</span>
              <span className="days explore">Per Day</span>
            </div>
          </div>
        </div>
      </Link>
      <div className="Promo19-bottom">
        <Link to={`/profile/${carOwner.id}`}>
          <div className="Promo19-bottom-owner">
            <div>
              <img className="owner-img" src={carOwner.profile_image_thumb} />
            </div>
            <div>
              <span className="name explore">{carOwner.name}</span>
              <div className="date">Member since {carOwner.created_at}</div>
              <div>
                {car.car_rating ? (
                  <Rating
                    emptySymbol="fa fa-star-o"
                    fullSymbol="fa fa-star"
                    fractions={2}
                    initialRating={parseInt(car.car_rating)}
                    readonly
                  />
                ) : (
                  <Fragment />
                )}
              </div>
            </div>
          </div>
        </Link>
        <div className="trips-details">
          {car.trip_count != 0 ? (
            <Fragment>
              {" "}
              <span className="trips-int explore">
                {car.trip_count}
              </span> trips{" "}
            </Fragment>
          ) : (
            <img
              className="Promo19-newlist-tag"
              src="https://rydecars.com/images/checkout/new-listing.png"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryItemFetures;
