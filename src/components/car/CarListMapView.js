/* global google */
import { default as React, Component, Fragment } from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Circle
} from "react-google-maps";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import Rating from "react-rating";
import moment from "moment-timezone";

const GoogleMapWithPopup = withGoogleMap(props => (
  <GoogleMap defaultZoom={isMobileOnly ? 8 : 10} center={props.center}>
    {props.markers.map((marker, index) => (
      <Marker
        key={index}
        position={marker.position}
        onClick={() => {
          !marker.isMyLocation && props.onMarkerClick(marker);
        }}
        icon={
          !marker.isMyLocation
            ? "/images/car-search/car-location-pin-icon.png"
            : "/images/car-search/my-location-pin-icon.png"
        }
      >
        {marker.showInfo && (
          <InfoWindow onCloseClick={() => props.onMarkerClose(marker)}>
            <div>{marker.infoContent}</div>
          </InfoWindow>
        )}
      </Marker>
    ))}
    <Circle
      center={props.center}
      radius={40233.6}
      options={{
        fillColor: `#00C07F`,
        fillOpacity: 0.2,
        strokeColor: `#00C07F`,
        strokeOpacity: 0.5,
        strokeWeight: 4
      }}
    />
  </GoogleMap>
));
class CarListMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: parseFloat(props.location.lat),
        lng: parseFloat(props.location.lng)
      },
      markers: [],
      targetMarker: null
    };
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.handleMarkerClose = this.handleMarkerClose.bind(this);
    this.makeMarker = this.makeMarker.bind(this);
  }
  componentWillMount() {
    this.setState({ markers: this.makeMarker() });
  }
  componentWillReceiveProps(nextProps) {
    if (
      parseFloat(this.props.location.lat) !=
        parseFloat(nextProps.location.lat) ||
      parseFloat(this.props.location.lng) != parseFloat(nextProps.location.lng)
    ) {
      this.setState({
        targetMarker: null,
        center: {
          lat: parseFloat(nextProps.location.lat),
          lng: parseFloat(nextProps.location.lng)
        }
      });
    }
    this.setState(() => {
      return { markers: this.makeMarker() };
    });
  }

  componentDidMount() {
    this.fetchCarLoop();
  }

  fetchCarLoop = () => {
    setTimeout(() => {
      this.props.loadMoreForMap();
      this.fetchCarLoop();
    }, 4000);
  };

  makeMarker() {
    const { cars, from, to, location } = this.props;
    const { targetMarker } = this.state;
    let locations = cars.map(car => ({
      position: new google.maps.LatLng(car.latitude, car.longitude),
      showInfo:
        targetMarker && targetMarker.selectedItemId == car.id ? true : false,
      isMyLocation: false,
      selectedItemId: car.id,

      infoContent: (
        <div className="track">
          <div className="map-carcard">
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
                className="map-carcard-img"
                src={car.car_photos.data.image_thumb}
              />
            </Link>
            <div className="map-carcard-detail">
              <div className="map-carcard-car">
                <Link
                  className="cars-name"
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
                <div className="map-carcard-flex map-carcard-stat">
                  {car.trip_count > 0 ? (
                    <div>
                      <span className="cars-trips">{car.trip_count}</span> trip
                      {car.trip_count > 1 && "s"}
                    </div>
                  ) : (
                    <span className="cars-trips-status">NEW</span>
                  )}
                  <span className="cards-bullet">&#9679;</span>
                  <div className="map-carcard-flex map-carcard-verfied">
                    <span className="icon-revamp-verified cards-icon" />
                    <span className="card-title">VERIFIED</span>
                  </div>
                </div>
                <span className="cars-price">${car.daily_rate}/day</span>
              </div>

              <div className="map-carcard-owner map-carcard-flex">
                <img
                  src="https://ryde-staging-assets.s3-us-west-2.amazonaws.com/profile/2000/cCKomDsLEaLiVhKb7iprmp.jpeg"
                  className="prof-img"
                />
                <div className="map-carcard-owner-detail">
                  <div className="map-carcard-name">
                    <Link target="_blank" to={`/profile/${car.user.data.id}`}>
                      {car.user.data.first_name}
                    </Link>
                  </div>
                  {parseInt(car.car_rating) ? (
                    <div className="map-carcard-rating">
                      <Rating
                        emptySymbol="icon-revamp-star-unfilled"
                        fullSymbol="icon-revamp-star-filled"
                        fractions={2}
                        readonly
                        initialRating={
                          parseFloat(car.car_rating)
                            ? parseFloat(car.car_rating)
                            : 0
                        }
                      />
                    </div>
                  ) : (
                    <Fragment></Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }));

    locations.push({
      position: new google.maps.LatLng(location.lat, location.lng),
      showInfo: false,
      isMyLocation: true,
      infoContent: ""
    });

    return locations;
  }

  // Toggle to 'true' to show InfoWindow and re-renders component
  handleMarkerClick(targetMarker) {
    this.setState({
      targetMarker,
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: true
          };
        }
        return {
          ...marker,
          showInfo: false
        };
      })
    });
  }

  handleMarkerClose(targetMarker) {
    this.setState({
      targetMarker: null,
      markers: this.state.markers.map(marker => {
        if (marker === targetMarker) {
          return {
            ...marker,
            showInfo: false
          };
        }
        return marker;
      })
    });
  }
  render() {
    return (
      <div>
        <GoogleMapWithPopup
          containerElement={<div style={{ height: `800px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          center={this.state.center}
          markers={this.state.markers}
          onMarkerClick={this.handleMarkerClick}
          onMarkerClose={this.handleMarkerClose}
        />
      </div>
    );
  }
}
export default CarListMapView;
