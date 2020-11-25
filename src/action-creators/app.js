import { fetchDeliveryLocations } from "../api/app";
import { setDeliveryLocations } from "../actions/app";

export const deliveryLocations = params => dispatch => {
  fetchDeliveryLocations(params).then(res => {
    dispatch(setDeliveryLocations(res.data.delivery));
  });
};
