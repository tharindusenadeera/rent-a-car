import { default as React, Component } from "react";
import { withGoogleMap, GoogleMap, Circle } from "react-google-maps";

const GoogleMapCircle = withGoogleMap(props => (
  <GoogleMap defaultZoom={12} center={props.center}>
    {props.center && (
      <Circle
        center={props.center}
        radius={props.radius}
        options={{
          fillColor: `green`,
          fillOpacity: 0.2,
          strokeColor: `green`,
          strokeOpacity: 0.2,
          strokeWeight: 0
        }}
      />
    )}
  </GoogleMap>
));
class CarLocationMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: null,
      content: null,
      radius: 2000
    };
  }
  componentWillReceiveProps(nextProps) {
    const car = nextProps.car;
    if (car.latitude && car.longitude) {
      this.setState({
        center: {
          lat: parseFloat(car.latitude),
          lng: parseFloat(car.longitude)
        }
      });
    }
  }

  componentDidMount() {
    const { car } = this.props;
    if (car.latitude && car.longitude) {
      this.setState({
        center: {
          lat: parseFloat(car.latitude),
          lng: parseFloat(car.longitude)
        }
      });
    }
  }

  render() {
    return (
      <GoogleMapCircle
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        center={this.state.center}
        content={this.state.content}
        radius={this.state.radius}
      />
    );
  }
}

export default CarLocationMapView;
