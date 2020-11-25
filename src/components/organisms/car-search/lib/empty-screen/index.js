import React from "react";
import { Link } from "react-router-dom";

const EmptyScreen = props => {
  const { location } = props;
  return (
    <div className="zero-data-section">
      <span className="font-18 font-semibold title">
        No cars found on {location}
      </span>
      <p>Thanks for choosing Ryde. We will be in your city soon</p>
      <hr />
      <span className="font-16 font-semibold">List your RYDE & make money</span>
      <p>
        Ryde straight to the bank. The advantages of listing your vehicle with
        Ryde are numerous and highly lucrative.
        <br />
        <br />
        Click below to turn your car bills into dollar bills.
        <br />
        <br />
      </p>
      <Link to="/car-create" className="default-btn small submit">
        LIST YOUR RYDE
      </Link>
    </div>
  );
};

export default EmptyScreen;
