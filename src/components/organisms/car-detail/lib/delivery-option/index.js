import React, { Fragment } from "react";

const DeliveryOption = props => {
  const { car, bookingData } = props;

  return (
    <div className="detail-card inner">
      <h5>Delivery options</h5>
      <Fragment>
        {bookingData && bookingData.delivery_info && (
          <div className="notification-section flex-default">
            <span className="icon-set-one-bell-icon icon" />
            <p>{bookingData && bookingData.delivery_info}</p>
          </div>
        )}

        <p>{car && car.delivery_option}</p>
      </Fragment>
    </div>
  );
};

export default DeliveryOption;
