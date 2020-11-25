import React from "react";
import CarLocationMapView from "../../../../car/CarLocationMapView";

const CarLocation = props => {
  const { car } = props;

  return (
    <div className="detail-card-linebottom inner">
      <h5>Car location</h5>
      <div className="p">
        <div className="flex-align-center row-content">
          <div>
            <span className="icon-revamp-map-pin row-icon color-green"></span>
          </div>
          <p>{car && car.car_location}</p>
        </div>
        <div className="font-12 font-medium row-desc">
          We will share the exact location of the car once the reservation is
          completed
        </div>
        <div className="detail-map">
          {car && <CarLocationMapView car={car} />}
        </div>
      </div>
    </div>
  );
};

export default CarLocation;
