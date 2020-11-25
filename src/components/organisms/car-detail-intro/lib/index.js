import React, { Fragment } from "react";

const CarDetailIntro = props => {
  const { car } = props;

  return (
    <Fragment>
      <div className="owner-header inner-z flex-justify-spacebetween flex-align-flexend">
        <div>
          <h4 className="car-name-">{car && car.car_name}</h4>
          <div className="flex-align-center feature">
            {car && car.trip_count == 0 && (
              <Fragment>
                <span className="new-title-span">NEW</span>
                <span className="bull-icon-small">&bull;</span>
              </Fragment>
            )}

            {car && car.trip_count != 0 && (
              <Fragment>
                {" "}
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
        </div>
        <div className="avatar">
          <img
            src={car && car.user && car.user.profile_image_thumb}
            className="avatar-extrasmall"
          />
          <span className="icon-revamp-verified icon flex-align-center flex-justify-center"></span>
        </div>
      </div>
    </Fragment>
  );
};

export default CarDetailIntro;
