import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleSubDrawer } from "../../actions/CommenActions";

class CarSummary extends Component {
  onDrawerClose = () => {
    const { dispatch, isSubDrawerOpen } = this.props;
    const data = {
      isSubDrawerOpen: !isSubDrawerOpen
    };
    dispatch(toggleSubDrawer(data));
  };
  render() {
    const { car } = this.props;
    return (
      <div className="car-detailsummery">
        <div className="panel-close-icon" onClick={() => this.onDrawerClose()}>
          <img src="/images/car-edit/close-icon.svg" alt="Close" />
        </div>

        <div className="car-detailsummery-box">
          <div className="title">License plate number</div>
          <div className="detail">{car && car.license_plate_number}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Year</div>
          <div className="detail">{car && car.year}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Make</div>
          <div className="detail">{car && car.car_make.name}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Model</div>
          <div className="detail">{car && car.car_model.name}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Trim</div>
          <div className="detail">{car && car.trim.name}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Type</div>
          <div className="detail">{car && car.car_type}</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Odometer</div>
          <div className="detail">{car && car.odometer} K</div>
        </div>

        <div className="car-detailsummery-box">
          <div className="title">Transmission</div>
          <div className="detail">
            {car && car.transmission === 0 ? (
              <div>Manual</div>
            ) : (
              <div>Automatic</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    car: state.car.car_v2,
    isSubDrawerOpen: state.common.isSubDrawerOpen
  };
};

export default connect(mapStateToProps)(CarSummary);
