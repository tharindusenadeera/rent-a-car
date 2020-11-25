import React, { Component } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import moment from "moment-timezone";
import OwlCarousel from "react-owl-carousel";

class Carousel extends Component {
  constructor(props) {
    super(props);
    let _this = this;
    this.options = {
      onInitialized: function() {
        _this.carousel = this;
      }
    };
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const { selectedItem } = this.props;
    if (selectedItem !== nextProps.selectedItem) {
      const { cars } = this.props;
      const index = cars.findIndex(i => {
        return i.id == nextProps.selectedItem;
      });
      this.carousel.to(index, 100);
    }
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     // console.log("nextProps.cars.length", nextProps.cars.length);
  //     // console.log("this.props.cars.length", this.props.cars.length);

  //     //   if (nextProps.cars.length !== this.props.cars.length) {
  //     //     console.log("heree");

  //     //     return true;
  //     //   }
  //     return false;
  //   }

  render() {
    const { cars, from, to, onDragged } = this.props;

    const carouselProps = {
      loop: false,
      dots: false,
      margin: 12,
      items: "1",
      onDragged: e => onDragged(e),
      className: "owl-theme",
      stagePadding: "25"
    };

    return (
      <div className="map-newcard-wrapper">
        <OwlCarousel {...this.options} {...carouselProps}>
          {cars.map((car, key) => {
            return (
              <div className="map-newcard flex-align-center" key={key}>
                <div className="map-newcard-img-wrapper">
                  <Link
                    target="_blank"
                    to={{
                      pathname: `/car/${car.name}/${car.id}`,
                      search: queryString.stringify({
                        from: moment(from).format("MM-DD-YYYY"),
                        fromTime: moment(from).format("HH:mm"),
                        to: moment(to).format("MM-DD-YYYY"),
                        toTime: moment(to).format("HH:mm"),
                        _from: "cardetails"
                      })
                    }}
                  >
                    <img
                      alt={car.car_name}
                      className="map-newcard-img"
                      src={car.car_photos.data.image_thumb}
                    />
                  </Link>
                </div>
                <div className="map-newcard-details">
                  <div className="map-newcard-name font-14 font-bold">
                    <Link
                      className="map-newcard-name black"
                      target="_blank"
                      to={{
                        pathname: `/car/${car.car_name}/${car.id}`,
                        search: queryString.stringify({
                          from: moment(from).format("MM-DD-YYYY"),
                          fromTime: moment(from).format("HH:mm"),
                          to: moment(to).format("MM-DD-YYYY"),
                          toTime: moment(to).format("HH:mm"),
                          _from: "cardetails"
                        })
                      }}
                    >
                      {car.car_name}
                    </Link>
                  </div>
                  <div className="map-newcard-price font-13">
                    ${car.daily_rate}/day
                  </div>
                  <div className="flex-align-center">
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
                    {/* <span className="new-title-span">NEW</span> */}
                    <span className="font-8 font-reguler">100 trips</span>
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
        </OwlCarousel>
      </div>
    );
  }
}

export default Carousel;
