import Axios from "axios";
import moment from "moment";
import { IS_FETCHING_V2, GET_BOOKING_DATA } from "../actions/ActionTypes";

export const getBookingDataAuth = (data, source = null) => dispatch => {
  dispatch({ type: IS_FETCHING_V2 });
  const __tripDurationData = JSON.parse(
    localStorage.getItem("__tripDurationData")
  );

  if (__tripDurationData) {
    var duration = moment.duration(
      moment().diff(moment(__tripDurationData.date, "YYYY-MM-DD HH:mm"))
    );
    if (duration.asMinutes() <= 30) {
      if (data.car_id == __tripDurationData.id) {
        data.delivery_option = __tripDurationData.option;
        data.offer_delivery = __tripDurationData.offerdelivery;
      }
    }
  }
  return Axios.get(`${process.env.REACT_APP_API_URL}booking/data/auth`, {
    params: data,
    headers: { Authorization: localStorage.access_token }
  });
};

export const getBookingData = (data, source = null) => dispatch => {
  dispatch({ type: IS_FETCHING_V2 });
  const __tripDurationData = JSON.parse(
    localStorage.getItem("__tripDurationData")
  );

  if (__tripDurationData) {
    var duration = moment.duration(
      moment().diff(moment(__tripDurationData.date, "YYYY-MM-DD HH:mm"))
    );
    if (duration.asMinutes() <= 30) {
      if (data.car_id == __tripDurationData.id) {
        data.delivery_option = __tripDurationData.option;
        data.offer_delivery = __tripDurationData.offerdelivery;
      }
    }
  }
  return Axios.get(`${process.env.REACT_APP_API_URL}booking/data`, {
    params: data
  });
};

/**
 * This is totaly wrong, We do not use api file to make actions
 * Please correct this when you do development in car detail page
 */
export const setTripsData = payload => dispatch => {
  dispatch({ type: GET_BOOKING_DATA, payload });
};
