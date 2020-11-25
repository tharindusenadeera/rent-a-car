import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import Rating from "react-rating";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { LazyImage } from "../comman";
import { isMobileOnly } from "react-device-detect";

const GalleryItemPromotion = props => {
  const { testamonial } = props;
  const { car } = testamonial;
  const { carOwner } = car;
  const { location } = testamonial;

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

  const { source } = props.landingPageProps.citiesLocationData;

  return (
    <div>
      <div className="featured-item-link cars-box-link">
        <Link
          to={{
            pathname: "/cars/",
            search: queryString.stringify({
              location: location.location,
              lat: location.lat,
              lng: location.lng,
              from,
              to,
              fromTime,
              toTime,
              source
            })
          }}
        >
          {location.location_name && (
            <div className="Promo19-section-title">
              {location.location_name}
            </div>
          )}
        </Link>
        <Link
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
          <div className="featured-item-img-outer wochs-img-wrapper">
            <LazyImage
              withloader="content-loader"
              className="Promo19-thumb"
              role="presentation"
              alt="Fretured cars"
              effect="blur"
              src={car && car.car_image_thumb && car.car_image_thumb}
              width={isMobileOnly ? 295 : 370}
              height={isMobileOnly ? 190 : 240}
            />
          </div>
          <div className="Promo19-title">
            <h3>{car.carName}</h3>
            <div className="flex-wrapper flex-space-between">
              <div className="">
                <span className="car-rate-lg">${car.daily_rate}</span>
                <span className="days">Per Day</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      {testamonial.review.description && (
        <div className="Promo19-desc">{testamonial.review.description}</div>
      )}
      <div className="Promo19-bottom">
        <Link to={`/profile/${carOwner.id}`}>
          <div className="Promo19-bottom-owner">
            <div>
              <img className="owner-img" src={carOwner.profile_image_thumb} />
            </div>
            <div>
              <span className="name">{carOwner.name}</span>
              <div className="date">Member since {carOwner.created_at}</div>
              <div>
                {carOwner.user_rating ? (
                  <Rating
                    emptySymbol="fa fa-star-o"
                    fullSymbol="fa fa-star"
                    fractions={2}
                    initialRating={parseInt(carOwner.user_rating)}
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
              <span className="trips-int explore">{car.trip_count}</span> trips
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

export default GalleryItemPromotion;
