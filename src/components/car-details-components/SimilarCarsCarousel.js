import React from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import queryString from "query-string";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Rating from "react-rating";
import { LazyImage } from "../comman";

const SimilarCars = props => {
  const { similarCars, from, to, fromTime, toTime } = props;

  if (similarCars) {
    return similarCars.data.map((car, index) => {
      return (
        <div className="item featured-item" key={index}>
          <Link
            target="_blank"
            className="featured-item-link cars-box-link"
            to={{
              pathname: `/car/${car.car_name}/${car.id}`,
              search: queryString.stringify({
                from: from,
                fromTime: fromTime,
                to: to,
                toTime: toTime,
                _from: "cardetails"
              })
            }}
          >
            {car && (
              <LazyImage
                className="featured-item-img"
                role="presentation"
                src={car.car_photos.data.image_thumb}
                width={450}
                height={170}
                style={{ objectFit: "cover" }}
              />
            )}

            <div className="car-info-sm car-info-top-sm">
              <h3>{car.car_name}</h3>
              <span className="car-rate-lg">${car.daily_rate}</span>
            </div>
            <div className="car-info-sm car-info-bottom">
              {car.car_rating != "0.0" && (
                <Rating
                  emptySymbol="fa fa-star-o"
                  fullSymbol="fa fa-star"
                  fractions={2}
                  initialRating={parseInt(car.car_rating)}
                  readonly
                />
              )}
              {car.trip_count == 0 ? (
                <span className="car-trips-sm">New Listing</span>
              ) : (
                <span className="car-trips-sm">
                  {car.trip_count} {car.trip_count == 1 ? "trip" : "trips"}
                </span>
              )}
              <span className="car-trips car-trips-sm ct-per-day">Per Day</span>
            </div>
          </Link>
        </div>
      );
    });
  } else {
    return [];
  }
};

const SimilarCarsCarousel = props => {
  return (
    <section className="section-wrap featured-rydes-outer">
      <div className="container">
        {(props.similarCars && props.similarCars.data.length) > 0 ? (
          <h1 className="section-header">Similar cars</h1>
        ) : (
          ""
        )}
        <div className="featuredCarousel">
          <OwlCarousel
            className="owl-theme"
            responsiveClass={true}
            responsive={{
              0: {
                items: 1,
                nav: true
              },
              480: {
                items: 2,
                nav: true
              },
              900: {
                items: 3,
                nav: true
              },
              1200: {
                items: 4,
                nav: true
              }
            }}
            // loop={
            //   props.similarCars && props.similarCars.data.length > 4
            //     ? true
            //     : false
            // }
            loop={false}
            margin={15}
            nav
            dots={false}
            lazyLoad={true}
            autoplay={true}
            navClass="owl-prev owl-next"
          >
            <SimilarCars {...props} />
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default SimilarCarsCarousel;
