import Axios from "axios";
import { fetchLocalStorage } from "../utils/localStorage";

const URL = process.env.REACT_APP_API_URL;

export const fetchAuthBookingData = params => {
  const headers = { Authorization: fetchLocalStorage("access_token") };
  return Axios.get(`${URL}booking/data/auth`, {
    params,
    headers
  });
};

export const saveUserDataInCarDetails = id => {
  return Axios.post(
    `${process.env.REACT_APP_API_URL}car/view/${id}`,
    {},
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  );
};
