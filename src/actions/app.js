import { DELIVERY_LOCATIONS } from "./ActionTypes";

export const setDeliveryLocations = payload => dispatch => {
  dispatch({ type: DELIVERY_LOCATIONS, payload });
};
