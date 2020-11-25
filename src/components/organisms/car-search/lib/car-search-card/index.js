import React, { Fragment } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import { LazyImage } from "../../../../comman";
import { AddFavourite } from "../../../add-to-favourite";
import moment from "moment-timezone";

const CarCard = props => {
  const {
    id,
    car_name,
    car_photos,
    daily_rate,
    car_rating,
    authenticated,
    is_auth_user_favorite_car,
    trip_count,
    from,
    to,
    timeZoneId,
    location
  } = props;

  return (
    <div className="car-card">
      <div className="black">
        <div className="thumb-card">
          <Link
            target="_blank"
            to={{
              pathname: `/car/${car_name}/${id}`,
              search: queryString.stringify({
                from: moment(from).format("MM-DD-YYYY"),
                fromTime: moment(from).format("HH:mm"),
                to: moment(to).format("MM-DD-YYYY"),
                toTime: moment(to).format("HH:mm"),
                timeZoneId: timeZoneId,
                location: location,
                _from: "cardetails"
              })
            }}
          >
            <LazyImage
              withloader="content-loader"
              className="thumb"
              src={car_photos.data.image_thumb}
              width={400}
              height={248}
            />
          </Link>
          <AddFavourite
            carId={id}
            favourite={is_auth_user_favorite_car}
            userId={authenticated}
          />
        </div>
        <div className="font-18 font-bold title">{car_name}</div>
        <div className="flex-align-center feature">
          {parseInt(car_rating) ? (
            <Fragment>
              <Rating
                emptySymbol="icon-revamp-star-unfilled"
                fullSymbol="icon-revamp-star-filled"
                fractions={2}
                initialRating={parseInt(car_rating)}
                readonly
                className="rate-group"
              />
              <span className="bull-icon-small">&bull;</span>
            </Fragment>
          ) : null}
          {trip_count == 0 && <span className="new-title-span">NEW</span>}
          {trip_count > 0 && (
            <span className="font-10 font-reguler">
              {trip_count} trip{trip_count > 1 ? "s" : null}
            </span>
          )}
          <span className="bull-icon-small">&bull;</span>
          <div className="label-verified">
            <span className="icon-revamp-verified icon"></span>
            <span>VERIFIED</span>
          </div>
        </div>
        <span className="font-14 font-semibold price">${daily_rate}/day</span>
      </div>
    </div>
  );
};

export default CarCard;
