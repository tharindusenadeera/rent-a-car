import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Rating from "react-rating";
import NewCarousel from "../components/organisms/new-carousel/lib";
// import "../Revamp2019.css";
import { fetchSimilarCars } from "../actions/CarActions";
import { LazyImage } from "../components/comman";
import CheckBox from "rc-checkbox";
class TestK extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoplay: false,
      nav: false,
      loop: false
    };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(fetchSimilarCars(1024));
  }

  render() {
    return (
      <div>
        {/* <InnerpageHeader header="CAR DETAILS" title="" /> */}
        Auto Play :{" "}
        <CheckBox
          value={this.state.autoplay}
          onChange={() => this.setState({ autoplay: !this.state.autoplay })}
        />
        <br />
        Navigation :{" "}
        <CheckBox
          value={this.state.nav}
          onChange={() => this.setState({ nav: !this.state.nav })}
        />
        <br />
        Loop :{" "}
        <CheckBox
          value={this.state.loop}
          onChange={() => this.setState({ loop: !this.state.loop })}
        />
        <br />
        <br />
        <br />
        <div className="container">
          {this.props.similarCars && (
            <NewCarousel
              className="featuredCarousel"
              responsive={[
                { range: { min: 0, max: 480 }, items: 1, nav: true },
                { range: { min: 480, max: 900 }, items: 2, nav: true },
                { range: { min: 900, max: 1800 }, items: 4, nav: true }
              ]}
              autoplay={this.state.autoplay}
              loop={this.state.loop}
              nav={this.state.nav}
            >
              {this.props.similarCars.data.map((car, key) => {
                return (
                  <div
                    id={`module-${car.id}`}
                    carid={car.id}
                    key={key}
                    className="map-newcard-universal"
                    style={{
                      marginRight: 10
                    }}
                  >
                    <div className="map-newcard-img-wrapper">
                      <a target="_blank" href="">
                        <LazyImage
                          alt={car.car_name}
                          className="map-newcard-img"
                          src={car.car_photos.data.image_thumb}
                        />
                      </a>
                    </div>
                    <div className="map-newcard-details">
                      <div className="map-newcard-name font-14 font-bold">
                        <a
                          className="map-newcard-name black"
                          target="_blank"
                          href=""
                        >
                          {car.car_name}
                        </a>
                      </div>
                      <div className="map-newcard-price font-13">
                        $ {car.daily_rate}/day
                      </div>
                      <div className="flex-align-center">
                        {parseFloat(car.car_rating) ? (
                          <Fragment>
                            <Rating
                              emptySymbol="fa fa-star-o"
                              fullSymbol="fa fa-star"
                              fractions={2}
                              readonly
                              initialRating={
                                parseFloat(car.car_rating)
                                  ? parseFloat(car.car_rating)
                                  : 0
                              }
                              className="font-8 color-orange"
                            />
                            <span className="bull-icon-small">&bull;</span>
                          </Fragment>
                        ) : (
                          <Fragment />
                        )}

                        {car.trip_count > 0 ? (
                          <span className="font-8 font-reguler">
                            {car.trip_count}{" "}
                            {`trip${car.trip_count > 1 ? "s" : ""}`}
                          </span>
                        ) : (
                          <span className="new-title-span">NEW</span>
                        )}

                        <span className="bull-icon-small">&bull;</span>
                        <div className="label-verified">
                          <span className="icon-revamp-verified icon"></span>
                          <span>VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </NewCarousel>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  similarCars: state.car.similarCars
});

export default connect(mapStateToProps)(TestK);
