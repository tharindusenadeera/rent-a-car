import React, { Component } from "react";
import { connect } from "react-redux";
import ToggleDrawer from "../ant-drawer/toggleDrawer";
import { CAR_V2 } from "../../actions/ActionTypes";
import { fetchAdvancePrice } from "../../actions/CarActions";

class CarGrid extends Component {
  onPressImage = car => {
    const { dispatch } = this.props;
    let selectedCar = {
      id: car.id,
      name: `${car.year} ${car.car_make.name} ${car.car_model.name}`,
      status: car.status,
      daily_rate: car.daily_rate,
      car_photo: car.car_photo,
      year: car.year,
      car_make: car.car_make,
      car_model: car.car_model,
      trim: car.trim,
      car_type: car.car_type,
      odometer: car.odometer,
      transmission: car.transmission,
      daily_rate: car.daily_rate,
      booking_count: car.booking_count,
      license_plate_number: car.license_plate_number
    };
    dispatch({
      type: CAR_V2,
      payload: selectedCar
    });
    dispatch(fetchAdvancePrice(car.id));
  };

  render() {
    const { usersCars } = this.props;
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>Name</th>
              <th>Address</th>
              <th>License Plate</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {usersCars.map((car, key) => {
              return (
                <tr key={key}>
                  <td>
                    <ToggleDrawer onPress={() => this.onPressImage(car)}>
                      <img 
                        src={
                          car.car_photo[0]
                            ? car.car_photo[0].image_thumb
                            : "https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png"
                        }
                        className="img-rounded profile-cars-img"
                        alt="Cinque Terre"
                        width="140"
                        height="86"
                      />
                    </ToggleDrawer>
                  </td>
                  <td>{`${car.year} ${car.car_make.name} ${
                    car.car_model.name
                  }`}</td>
                  <td>{car.location}</td>
                  <td>{car.license_plate_number}</td>
                  <td />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(CarGrid);
