import Axios from "axios";

export const fetchDeliveryLocations = params => {
  return Axios.get(`${process.env.REACT_APP_API_URL}car/delivery`, {
    params: { ...params }
  });
};
