import React from "react";
import { Button } from "antd";
import queryString from "query-string";
import moment from "moment";

const TripsSummaryToMessage = props => {
  const { tripInfo, history, booking } = props;

  const detailable_id = booking.id;
  const car_name = booking && booking.car.car_name;
  const from_date = booking && moment(booking.from_date, "YYYY-MM-DD HH:mm:ss");
  const to_date = booking && moment(booking.to_date, "YYYY-MM-DD HH:mm:ss");
  const number = booking.number;
  const car_photo = booking.car.car_photo[0].image_path;

  let participant_name, profile_image, profile_image_thumb;
  if (booking.btn.user_type == "renter") {
    profile_image_thumb = booking.car.car_owner.profile_image_thumb;
    profile_image = booking.car.car_owner.profile_image;
    participant_name = booking.car.car_owner.first_name;
  } else {
    profile_image_thumb = booking.user.profile_image_thumb;
    profile_image = booking.user.profile_image;
    participant_name = booking.user.first_name;
  }

  return (
    <Button
      className="unstyled-btn hov-click"
      onClick={() => {
        history.push({
          pathname: `/my-profile/message-center/${tripInfo.id}`,
          search: queryString.stringify({
            detailable_id,
            car_name,
            car_photo,
            from_date,
            id: null,
            number,
            to_date,
            participant_name,
            profile_image,
            profile_image_thumb
          })
        });
        props.onClose();
      }}
    >
      <img
        alt="Chat Icon"
        className=""
        src="/images/profilev2/chat-icon-green-sm.svg"
      />
    </Button>
  );
};

export default TripsSummaryToMessage;
