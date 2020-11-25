import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Rating from "react-rating";
import { isMobileOnly } from "react-device-detect";
import { LazyImage } from "../comman";

const GalleryItem = ({ car, from, to, fromTime, toTime }) => {
  return (
    <div>
      <Link
        className="featured-item-link cars-box-link"
        to={{
          pathname: `/car/${car.year} ${car.car_make.name} ${car.car_model.name}/${car.id}`,
          search: queryString.stringify({
            from: from.format("MM-DD-YYYY"),
            fromTime: fromTime,
            to: to.format("MM-DD-YYYY"),
            toTime: toTime,
            _from: "cardetails"
          })
        }}
      >
        <div className="featured-item-img-outer">
          {car && car.is_insurance_discounted === 1 && (
            <img
              className="offer-badge-thum"
              src="/images/offers/offer-badge-thum.svg"
              height="69"
              width="88"
            />
          )}
          {/* --------------- Coupon Icons - Start -------------*/}
          {car && car.december_promotion === 1 && (
            <img
              className="coupon-badge-thum"
              src="https://cdn.rydecars.com/static-images/gift-coupon-30.svg"
              height="69"
              width="88"
            />
          )}
          {car && car.december_promotion === 2 && (
            <img
              className="coupon-badge-thum"
              src="https://cdn.rydecars.com/static-images/gift-coupon-40.svg"
              height="69"
              width="88"
            />
          )}
          {car && car.december_promotion === 3 && (
            <img
              className="coupon-badge-thum"
              src="https://cdn.rydecars.com/static-images/gift-coupon-75.svg"
              height="69"
              width="88"
            />
          )}

          {car.car_photo &&
            car.car_photo.length &&
            car.car_photo[0].image_thumb && (
              <LazyImage
                withloader="content-loader"
                className="featured-item-img"
                role="presentation"
                alt="Fretured cars"
                src={car.car_photo[0].image_thumb}
                width={isMobileOnly ? 320 : 270}
                height={isMobileOnly ? 210 : 170}
                style={{ objectFit: "cover" }}
              />
              // <SimpleImg
              //   alt="Featured cars"
              //   src={car.car_photo[0].image_thumb}
              //   style={{ objectFit: "cover" }}
              //   role="presentation"
              //   width={isMobileOnly ? 320 : 270}
              //   height={isMobileOnly ? 210 : 170}
              //   className="featured-item-img"
              // />
            )}
        </div>
        <div className="car-info-sm car-info-top-sm">
          <h3>{car.car_name}</h3>
          <span className="car-rate-lg">${car.daily_rate}</span>
          {/* <span className="car-trips ct-per-day visible-xs">Per Day</span> */}
        </div>
        <div className="car-info-sm car-info-bottom">
          {car.car_rating !== 0 && (
            <Rating
              emptySymbol="fa fa-star-o"
              fullSymbol="fa fa-star"
              fractions={2}
              initialRating={parseInt(car.car_rating)}
              readonly
            />
          )}
          {car.booking_count.trip_count == 0 ? (
            <span className="car-trips-sm">New Listing</span>
          ) : (
            <span className="car-trips-sm">
              {car.booking_count.trip_count}{" "}
              {car.booking_count.trip_count == 1 ? "trip" : "trips"}
            </span>
          )}
          <span className="car-trips car-trips-sm ct-per-day">Per Day</span>
        </div>
      </Link>
    </div>
  );
};

export default GalleryItem;
