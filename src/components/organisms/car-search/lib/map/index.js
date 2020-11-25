import React, { Component, Fragment } from "react";
import GoogleMapReact from "google-map-react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import moment from "moment-timezone";

import InfoBubble from "./InfoBubble";
import "antd/lib/skeleton/style/index.css";

const WAIT_INTERVAL = 200;
const MAP_DEAFAULT_ZOOM = 11;
const MAX_ZOOM = 14;
const MIN_ZOOM = 6;

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultcenter: {
        lat: parseFloat(props.location.lat),
        lng: parseFloat(props.location.lng)
      },
      center: {
        lat: parseFloat(props.location.lat),
        lng: parseFloat(props.location.lng)
      },

      selectedItem: null,
      zoom: MAP_DEAFAULT_ZOOM,
      bubleClicked: false,
      boundryCordinates: []
    };
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (
      location.lat !== prevProps.location.lat ||
      location.lng !== prevProps.location.lng
    ) {
      const center = {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng)
      };
      this.setState({ center });
    }
  }

  componentDidMount() {
    const { cars } = this.props;
    this.timer = null;
    if (cars.length) {
      const car = cars[0];
      const center = {
        lat: parseFloat(car.latitude),
        lng: parseFloat(car.longitude)
      };
      this.setState({ selectedItem: car.id, center });
    }
    this.fetchCarLoop();
  }

  fetchCarLoop = () => {
    setTimeout(() => {
      this.props.loadMoreForMap();
      this.fetchCarLoop();
    }, 4000);
  };

  onSelectBubble = car => {
    this.setState({ bubleClicked: true });

    const selectedDev = document.getElementById(`module-${car.id}`);

    this.setState(
      {
        selectedItem: car.id
      },
      () => {
        if (selectedDev) {
          selectedDev.scrollIntoView({
            block: "start",
            inline: "center"
          });
        }
      }
    );
  };

  onScroll = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.onScrolled, WAIT_INTERVAL);
  };

  onScrolled = () => {
    const topParent = document.getElementsByClassName("scroller-container");
    const parentDiv = document.getElementsByClassName("scroller-modules");

    const p = parentDiv[0].scrollLeft;
    const q = topParent[0].clientWidth;

    const i = Array.prototype.slice.call(parentDiv[0].childNodes).find(j => {
      const n = j.offsetLeft;
      const x = j.clientWidth;
      return n + 0.25 * x >= p && n + 0.25 * x <= p + q;
    });

    if (i) {
      if (i.getAttribute("carid")) {
        const selectedItem = parseInt(i.getAttribute("carid"));

        const { cars } = this.props;
        const car = cars.find(item => {
          return item.id === selectedItem;
        });

        this.setState(
          {
            selectedItem
          },
          () => {
            const selectedDev = document.getElementById(`module-${car.id}`);
            if (selectedDev) {
              selectedDev.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
              });
            }
          }
        );
      }
    }
  };

  onChangeBoundryCordinates = ({ marginBounds }) => {
    this.setState({
      boundryCordinates: [
        marginBounds.ne.lat,
        marginBounds.ne.lng,
        marginBounds.sw.lat,
        marginBounds.sw.lng
      ]
    });
  };

  setSliderData(data) {
    const { boundryCordinates } = this.state;
    if (!boundryCordinates.length) {
      return [];
    }
    return data.filter(
      d =>
        d.latitude > boundryCordinates[2] &&
        d.latitude < boundryCordinates[0] &&
        d.longitude > boundryCordinates[3] &&
        d.longitude < boundryCordinates[1]
    );
  }

  onDragEnd = () => {
    this.setState({ selectedItem: null });
  };

  render() {
    const { cars, from, to } = this.props;
    const { selectedItem, center, zoom, defaultcenter } = this.state;

    const sliderData = this.setSliderData(cars);

    return (
      <div className="map-newwrapper-outer">
        <GoogleMapReact
          defaultCenter={defaultcenter}
          defaultZoom={MAP_DEAFAULT_ZOOM}
          onZoomAnimationEnd={zoom => this.setState({ zoom })}
          zoom={zoom}
          center={center}
          onDragEnd={this.onDragEnd}
          onChange={this.onChangeBoundryCordinates}
          onGoogleApiLoaded={({ map }) => {
            // this.onChangeBoundryCordinates(map);
            map.setOptions({ minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM });
          }}
          yesIWantToUseGoogleMapApiInternals={true}
          resetBoundsOnResize={true}
        >
          {cars.map((car, key) => {
            return (
              <InfoBubble
                key={key}
                lat={car.latitude}
                lng={car.longitude}
                car={car}
                selectedItem={selectedItem}
                onSelectBubble={this.onSelectBubble}
              />
            );
          })}
        </GoogleMapReact>
        {sliderData.length ? (
          <div className="map-newcard-wrapper">
            <div className="scroller-container">
              <div
                className="scroller-modules"
                onScroll={() => this.onScroll()}
              >
                {sliderData.map((car, key) => {
                  return (
                    <div
                      className="scroller-module"
                      id={`module-${car.id}`}
                      carid={car.id}
                      key={key}
                    >
                      <div className="map-newcard flex-align-center">
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
                            ${" "}
                            {car.daily_rate_without_cents
                              ? car.daily_rate_without_cents
                              : car.daily_rate}
                            /day
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <Fragment />
        )}
      </div>
    );
  }
}

export default Map;
