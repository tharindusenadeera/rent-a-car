import React from "react";

const InfoBubble = ({ car, onSelectBubble, selectedItem }) => {
  return (
    <a
      onClick={() => onSelectBubble(car)}
      className={
        selectedItem === car.id ? "map-newbubble selected" : "map-newbubble"
      }
    >
      <div className="">
        ${" "}
        {car.daily_rate_without_cents
          ? car.daily_rate_without_cents
          : car.daily_rate}
        /day
        {/* <span className="map-arrow"></span> */}
      </div>
    </a>
  );
};

export default InfoBubble;
