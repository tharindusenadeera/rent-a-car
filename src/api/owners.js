import Axios from "axios";
import { fetchLocalStorage } from "../utils/localStorage";

const URL = process.env.REACT_APP_API_URL;

export const postOwnersAccountData = data => {
  const headers = { Authorization: fetchLocalStorage("access_token") };
  return Axios.post(`${URL}stripe-create`, data, {
    headers
  });
};

export const fetchMcc = () => {
  return Axios.get(`${URL}stripe-mcc`);
};

export const fileUpload = data => {
  const headers = {
    Authorization: fetchLocalStorage("access_token"),
    "Content-Type": "multipart/form-data"
  };
  return Axios.post(`${URL}stripe/file-upload`, data, {
    headers
  });
};

export const fetchStripeDetail = () => {
  const headers = { Authorization: fetchLocalStorage("access_token") };
  return Axios.get(`${URL}stripe`, {
    headers
  });
};

export const editOwnerAccountData = data => {
  const headers = { Authorization: fetchLocalStorage("access_token") };
  return Axios.patch(`${URL}stripe-update`, data, {
    headers
  });
};
