import React from "react";

const MilesIncludedCarDetail = props => {
  const { car } = props;

  return (
    <div className="detail-card inner">
      <h5>Miles included</h5>
      {car &&
        car.miles_allowed.data.map((data, key) => {
          return (
            <p className="flex-justify-spacebetween" key={key}>
              <span>{data.name}</span>
              <span>{data.value}</span>
            </p>
          );
        })}
    </div>
  );
};

export default MilesIncludedCarDetail;
