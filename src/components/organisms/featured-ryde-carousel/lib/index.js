import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import OwlCarousel from "react-owl-carousel";
import { fetchSimilarCars } from "../../../../api/car";
import { SIMILAR_CARS } from "../../../../actions/ActionTypes";
import FeaturedRydeIntro from "../../featured-ryde-intro/lib";
import { AddFavourite } from "../../add-to-favourite";

const PageLink = ({ car, from, to, fromTime, toTime, children }) => {
  return (
    <Link
      target="_blank"
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
      className="black"
    >
      {children}
    </Link>
  );
};

class FeaturedRydeCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch, car_id } = this.props;
    fetchSimilarCars(car_id)
      .then(response => {
        dispatch({
          type: SIMILAR_CARS,
          payload: response.data.cars
        });
      })
      .catch({});
  }

  render() {
    const {
      similarCars,
      from,
      to,
      fromTime,
      toTime,
      authenticated
    } = this.props;

    return (
      <Fragment>
        {similarCars && similarCars.data.length > 0 ? (
          <div className="detail-card-noline">
            <h5 className="inner-head">Similar Cars</h5>
            <div className="p">
              <OwlCarousel
                loop={false}
                dots={false}
                margin={12}
                items="1"
                className="car-detail-carousal"
                stagePadding="24"
              >
                {similarCars &&
                  similarCars.data.map((car, index) => {
                    return (
                      <div className="item" key={index}>
                        {/* Car card - start */}
                        <div className="car-card">
                          <div className="thumb-card">
                            <PageLink
                              car={car}
                              from={from}
                              to={to}
                              fromTime={fromTime}
                              toTime={toTime}
                            >
                              <img
                                src={car.car_photos.data.image_thumb}
                                className="thumb"
                              />
                            </PageLink>
                            <AddFavourite
                              carId={car.id}
                              favourite={car.is_auth_user_favorite_car}
                            />
                          </div>
                          <PageLink
                            car={car}
                            from={from}
                            to={to}
                            fromTime={fromTime}
                            toTime={toTime}
                          >
                            <FeaturedRydeIntro car={car} />
                          </PageLink>
                        </div>

                        {/* Car card - end */}
                      </div>
                    );
                  })}
              </OwlCarousel>
            </div>
          </div>
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  similarCars: state.car.similarCars
});

export default connect(mapStateToProps)(FeaturedRydeCarousel);
