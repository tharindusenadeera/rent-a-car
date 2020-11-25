import { TOGGLE_DRAWER, TOGGLE_SUB_DRAWER, TIME_ZONE } from "./ActionTypes";
import axios from "axios";
import moment from "moment-timezone";

export const toggleDrawer = data => dispatch => {
  dispatch({
    type: TOGGLE_DRAWER,
    payload: data
  });
};

export const toggleSubDrawer = data => dispatch => {
  dispatch({
    type: TOGGLE_SUB_DRAWER,
    payload: data
  });
};

export const fetchTimeZone = (lat = null, lng = null) => dispatch => {
  if (!lat && !lng) {
    dispatch({
      type: TIME_ZONE,
      payload: moment.tz.guess()
    });
    return false;
  }
  axios
    .get(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1458000000&key=AIzaSyAc_ISg29JIeVF9tfUc4xqJHi2bL8gyJM0`
    )
    .then(result => {
      dispatch({
        type: TIME_ZONE,
        payload:
          result.data.status === "ZERO_RESULTS"
            ? moment.tz.guess()
            : result.data.timeZoneId
      });
    });
};
