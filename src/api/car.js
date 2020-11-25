import Axios from "axios";
import { fetchLocalStorage } from "../utils/localStorage";

export const fetchCars = (params, next) => {
  return Axios.get(`${process.env.REACT_APP_API_URL}v2/cars${next}`, {
    params
  });
};

export const fetchAuthCars = (params, next) => {
  return Axios.get(`${process.env.REACT_APP_API_URL}v2/auth/cars${next}`, {
    params,
    headers: {
      Authorization: localStorage.access_token
    }
  });
};

export const fetchAuthCar = (id, params = {}) => {
  return Axios.get(
    `${process.env.REACT_APP_API_URL}v2/auth/car/${id}?include=user,features`,
    {
      headers: {
        params,
        Authorization: localStorage.access_token
      }
    }
  );
};

export const fetchCar = (id, params = {}) => {
  return Axios.get(
    `${process.env.REACT_APP_API_URL}v2/car/${id}?include=user,features`,
    { params }
  );
};

export const addToFavourite = id => {
  return Axios.post(
    `${process.env.REACT_APP_API_URL}add-to-favorite`,
    { car_id: id },
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  );
};

export const getCarCoverageInfo = () => {
  return Axios.get(`${process.env.REACT_APP_API_URL}car-coverage-levels`);
};

export const fetchSimilarCars = carId => {
  return Axios.get(
    `${process.env.REACT_APP_API_URL}v2/similar-cars?id=${carId}`
  );
};

export const fetchReviews = id => {
  return Axios.get(`${process.env.REACT_APP_API_URL}v2/car/reviews/${id}`);
};
