import React, { Fragment } from "react";

const FeaturedRydeIntro = props => {
  const { car } = props;

  return (
    <Fragment>
      <div className="font-18 font-bold title">{car && car.car_name}</div>
      <div className="flex-align-center feature">
        {car && car.trip_count == 0 && (
          <Fragment>
            <span className="new-title-span">NEW</span>
            <span className="bull-icon-small">&bull;</span>
          </Fragment>
        )}
        {car && car.trip_count != 0 && (
          <Fragment>
            <span className="font-11 font-reguler">
              {car && car.trip_count} trip{car.trip_count > 1 && "s"}
            </span>
            <span className="bull-icon-small">&bull;</span>
          </Fragment>
        )}
        <div className="label-verified">
          <span className="icon-revamp-verified icon"></span>
          <span>VERIFIED</span>
        </div>
      </div>
      <span className="font-14 font-semibold price">
        ${car && car.daily_rate}/day
      </span>
    </Fragment>
  );
};

export default FeaturedRydeIntro;
