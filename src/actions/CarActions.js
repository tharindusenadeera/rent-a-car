import axios from "axios";
import {
  CAR_PHOTO_DELETE,
  CAR_PHOTO_UPLOAD,
  FREE_DELIVERY_LOCATIONS,
  DELIVERY_OPTIONS,
  CAR_COVERAGES,
  CAR_PROTECTION_LEVELS,
  UNAVAILABLE_ERROR,
  UNAVAILABLE_LIST,
  GALLERY_CARS,
  CAR_DELIVARY_STATUS,
  DONE_FETCHING,
  CAR_DELIVARY_PRICE,
  FETCHING,
  CAR_REGISTRATION_PAGE,
  CAR_MAKES,
  IS_FETCHING,
  GET_CAR,
  US_STATES,
  YEARS,
  GET_MAKES,
  GET_CAR_MODELS,
  GET_CAR_TRIMS,
  GET_FEATURES,
  REGISTERED_CAR,
  FILTERED_CAR_LIST,
  USERS_CARS,
  USER_LAST_INCOMPLETE_CAR,
  COACHELLA_GALLERY_CARS,
  SIMILAR_CARS,
  CAR_V2,
  ADVANCE_CAR_PRICE,
  FREE_DELIVERY_LOCATIONS_CAR_LISTING,
  REGISTERED_CAR_FOR_EDIT
} from "../actions/ActionTypes";

import { getBooking } from "./BookingActions";
//import { //browserHistory } from "react-router-dom";
import { SubmissionError } from "redux-form";
import { fetchTimeZone } from "./CommenActions";
import { authFail } from "./AuthAction";

export const fetchSimilarCars = carId => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "v2/similar-cars?id=" + carId)
      .then(response => {
        dispatch({
          type: SIMILAR_CARS,
          payload: response.data.cars
        });
      });
};

export const registerCar = (data, pageId) => dispatch => {
  dispatch({ type: IS_FETCHING });
  let url = process.env.REACT_APP_API_URL + "cars";
  if (data.id) {
    url = process.env.REACT_APP_API_URL + "car/edit-mobile/" + data.id;
  }
  return axios
    .post(url, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: REGISTERED_CAR,
        payload: response.data.car
      });
      dispatch(getMakes(data.year));
      dispatch(getModels(data.year, data.car_make));
      dispatch(getTrims(data.year, data.car_make, data.car_model));
      //browserHistory.push("/car/create/" + response.data.car.id);
      if (pageId != 6) {
        dispatch({ type: CAR_REGISTRATION_PAGE, payload: pageId });
      }
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => {
      dispatch(authFail(e));
      throw new SubmissionError({ _error: e.response.data.message });
      dispatch({ type: DONE_FETCHING });
    });
};
export const resetRegisterCar = () => {
  return dispatch => {
    dispatch({
      type: REGISTERED_CAR,
      payload: {}
    });
  };
};
export const getRegisteringCar = id => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "cars/edit/" + id, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: REGISTERED_CAR,
          payload: response.data.car
        });
        dispatch({
          type: REGISTERED_CAR_FOR_EDIT,
          payload: response.data.car
        });
        dispatch(getMakes(response.data.car.year));
        dispatch(
          getModels(response.data.car.year, response.data.car.car_make.id)
        );
        dispatch(
          getTrims(
            response.data.car.year,
            response.data.car.car_make.id,
            response.data.car.car_model.id
          )
        );
      })
      .catch(e => dispatch(authFail(e)));
};

export const getDeliveryOptions = () => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "car/delivery-options", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      // if (response.data.error)
      dispatch({
        type: DELIVERY_OPTIONS,
        payload: response.data.delivery_options
      });
    })
    .catch(e => {
      console.log("error", e);
      dispatch(authFail(e));
    });
};

export const getFreeDeliveryLocations = carId => {
  return dispatch =>
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "v2/car/free-delivery-locations/" +
          carId,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(response => {
        dispatch({
          type: FREE_DELIVERY_LOCATIONS,
          payload: response.data.locations
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getFreeDeliveryLocationsforCarListing = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "car/free-delivery-locations", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: FREE_DELIVERY_LOCATIONS_CAR_LISTING,
          payload: response.data.locations
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getMakes = year => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "msrp/make-from-year/" + year, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_MAKES,
          payload: response.data.make
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getModels = (year, make) => {
  return dispatch =>
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "msrp/model-from-year-and-make/" +
          year +
          "/" +
          make,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(response => {
        dispatch({
          type: GET_CAR_MODELS,
          payload: response.data.model
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getTrims = (year, make, carModel) => {
  return dispatch =>
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "msrp/trim-from-ymm/" +
          year +
          "/" +
          make +
          "/" +
          carModel,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(response => {
        dispatch({
          type: GET_CAR_TRIMS,
          payload: response.data.trim
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getYears = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "years", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: YEARS,
          payload: response.data.year
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getUsStates = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "us-states", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: US_STATES,
          payload: response.data.usState
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getCarMakes = (type = null) => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "car-makes", {
        params: { type: type },
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: CAR_MAKES,
          payload: response.data.make
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getFeatures = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "features", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_FEATURES,
          payload: response.data.feature
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const filteredCarList = queryString => dispatch => {
  //dispatch({ type:IS_FETCHING });
  axios
    .get(process.env.REACT_APP_API_URL + "cars", {
      params: queryString
    })
    .then(response => {
      dispatch({
        type: FILTERED_CAR_LIST,
        payload: response.data.cars
      });
      //dispatch({type:DONE_FETCHING});
    });
};

export const filteredCarListV2 = queryString => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "v2/cars", {
      params: queryString
    })
    .then(response => {
      dispatch({
        type: FILTERED_CAR_LIST,
        payload: response.data.cars
      });
    });
};

export const fetchCar = (id, shouldLoad = true, params = {}) => dispatch => {
  if (localStorage.access_token) {
    shouldLoad && dispatch({ type: IS_FETCHING });
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "v2/auth/car/" +
          id +
          "?include=user,features",
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(response => {
        dispatch({ type: CAR_V2, payload: response.data.car });
        dispatch(
          fetchTimeZone(response.data.car.latitude, response.data.car.longitude)
        );
        dispatch({ type: DONE_FETCHING });
      })
      .catch(e => dispatch(authFail(e)));
  } else {
    dispatch({ type: IS_FETCHING });
    axios
      .get(
        process.env.REACT_APP_API_URL +
          "v2/car/" +
          id +
          "?include=user,features",
        {
          params
        }
      )
      .then(response => {
        dispatch({ type: CAR_V2, payload: response.data.car });
        dispatch({ type: DONE_FETCHING });
      });
  }
};

export const getCar = id => dispatch => {
  if (localStorage.access_token) {
    dispatch({ type: IS_FETCHING });
    dispatch({ type: FETCHING, payload: true });
    axios
      .get(process.env.REACT_APP_API_URL + "auth-cars/" + id, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_CAR,
          payload: response.data.car
        });
        dispatch({ type: DONE_FETCHING });
        dispatch({ type: FETCHING, payload: false });
      })
      .catch(e => dispatch(authFail(e)));
  } else {
    dispatch({ type: IS_FETCHING });
    axios
      .get(process.env.REACT_APP_API_URL + "cars/" + id, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_CAR,
          payload: response.data.car
        });
        dispatch({ type: DONE_FETCHING });
        dispatch({ type: FETCHING, payload: false });
      })
      .catch(e => dispatch(authFail(e)));
  }
};

export const getUsersCars = () => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .get(process.env.REACT_APP_API_URL + "cars/users-cars", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: USERS_CARS,
        payload: response.data.car_list
      });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => {
      // dispatch({
      // 	type: USERS_CARS,
      // 	payload: null
      // })
      dispatch({ type: DONE_FETCHING });
      dispatch(authFail(e));
    });
};

export const updateCar = data => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(process.env.REACT_APP_API_URL + "car/edit-mobile/" + data.id, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: REGISTERED_CAR,
        payload: response.data.car
      });
      //browserHistory.push("/profile/index/2");
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};

export const getCarDelivaryPrice = (data, id) => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "car/delivary-price/" + id, {
        params: data
      })
      .then(response => {
        if (response.data.error) {
          dispatch({
            type: CAR_DELIVARY_PRICE,
            payload: 0
          });
          dispatch({
            type: CAR_DELIVARY_STATUS,
            payload:
              "We don't delivery this far. Maximum delivery distance is up to 25 miles"
          });
        } else {
          dispatch({
            type: CAR_DELIVARY_STATUS,
            payload: null
          });
          dispatch({
            type: CAR_DELIVARY_PRICE,
            payload: response.data.delivaryPrice
          });
        }
      });
};

export const getGalleryCars = (queryString = {}) => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "cars/gallery-cars", {
      params: queryString
    })
    .then(response => {
      dispatch({
        type: GALLERY_CARS,
        payload: response.data.galleryCars
      });
    });
};

export const getCoachellaGalleryCars = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "cars/coachella-gallery-cars")
      .then(response => {
        dispatch({
          type: COACHELLA_GALLERY_CARS,
          payload: response.data.galleryCars
        });
      });
};

export const carCheckout = (data, dispatch, props) => {
  const { booking } = props;
  let body = new FormData();
  body.append("bookingId", booking.id);
  body.append("identity", data.identity);
  body.append("fuelLevel", data.fuelLevel);
  body.append("mileage", data.mileage);
  body.append("carFront", data.carFront);
  body.append("driverSide", data.driverSide);
  body.append("passengerSide", data.passengerSide);
  body.append("carBack", data.carBack);
  dispatch({ type: FETCHING, payload: true });
  return axios
    .post(process.env.REACT_APP_API_URL + `bookings/car-checkout-form`, body, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: FETCHING, payload: false });
    })
    .catch(e => dispatch(authFail(e)));
};

export const carCheckoutPhotoUpload = data => dispatch => {
  let body = new FormData();
  body.append("booking_id", data.booking_id);
  body.append(data.fileName, data.file);
  body.append("identity", data.identity);
  dispatch({ type: IS_FETCHING });
  axios
    .post(process.env.REACT_APP_API_URL + `bookings/car-checkout-form`, body, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch(getBooking(data.booking_id));
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};

export const getCarProtectionLevels = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "car-protection-levels", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: CAR_PROTECTION_LEVELS,
          payload: response.data.carProtectionLevels
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const addUnavailability = data => dispatch => {
  dispatch({ type: FETCHING, payload: true });
  dispatch({ type: UNAVAILABLE_ERROR, payload: "" });
  axios
    .post(process.env.REACT_APP_API_URL + `availability`, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: UNAVAILABLE_LIST, payload: response.data.list });
      dispatch({ type: FETCHING, payload: false });
    })
    .catch(({ response }) => {
      if (response.data.error) {
        dispatch({ type: UNAVAILABLE_ERROR, payload: response.data.message });
      }
      dispatch({ type: FETCHING, payload: false });
    });
};

export const editUnavailability = data => dispatch => {
  dispatch({ type: FETCHING, payload: true });
  axios
    .put(process.env.REACT_APP_API_URL + `availability/${data.id}`, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: UNAVAILABLE_LIST, payload: response.data.list });
      dispatch({ type: FETCHING, payload: false });
    })
    .catch(({ response }) => {
      if (response.data.error) {
        dispatch({ type: UNAVAILABLE_ERROR, payload: response.data.message });
      }
      dispatch({ type: FETCHING, payload: false });
    });
};

export const deleteUnavailability = data => dispatch => {
  dispatch({ type: FETCHING, payload: true });
  axios
    .delete(process.env.REACT_APP_API_URL + `availability/${data.id}`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (response.data.error) {
        dispatch({ type: UNAVAILABLE_ERROR, payload: response.data.message });
      } else {
        dispatch({ type: UNAVAILABLE_LIST, payload: response.data.list });
      }
      dispatch({ type: FETCHING, payload: false });
    });
};

export const getUnavailableList = carId => dispatch => {
  dispatch({ type: FETCHING, payload: true });
  axios
    .get(process.env.REACT_APP_API_URL + `availability/${carId}`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: UNAVAILABLE_LIST, payload: response.data.list });
      dispatch({ type: FETCHING, payload: false });
    })
    .catch(e => dispatch(authFail(e)));
};
export const getCarForEdit = id => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .get(process.env.REACT_APP_API_URL + "cars/edit/" + id, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (response.data.car) {
        dispatch({
          type: GET_CAR,
          payload: response.data.car
        });
        dispatch({ type: DONE_FETCHING });
      } else {
        //browserHistory.push("/error");
      }
    });
};

export const changeCarProtectionLevel = (
  selectedProtectionLevel,
  carId
) => dispatch => {
  dispatch({ type: IS_FETCHING });
  return axios
    .post(
      process.env.REACT_APP_API_URL + "change-car-protection-level",
      { current_protection_level: selectedProtectionLevel, car_id: carId },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch(getCar(response.data.carProtectionChange.car_id));
      dispatch(getRegisteringCar(response.data.carProtectionChange.car_id));
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};
export const getCarCoverageLevels = () => dispatch => {
  return axios
    .get(process.env.REACT_APP_API_URL + "car-coverage-levels")
    .then(response => {
      dispatch({
        type: CAR_COVERAGES,
        payload: response.data.carCoverageLevels
      });
    });
};

export const carPhotoUpload = data => dispatch => {
  let body = new FormData();
  body.append("car_id", data.car_id);
  body.append("car_photo", data.car_photo);
  body.append("status", data.status);
  body.append("photo_key", data.photo_key);
  axios
    .post(process.env.REACT_APP_API_URL + `car-photo`, body, {
      headers: {
        Authorization: localStorage.access_token
      },
      onUploadProgress: progressEvent => {
        if (progressEvent.lengthComputable) {
          const percentage = (progressEvent.loaded * 100) / progressEvent.total;
          dispatch({
            type: CAR_PHOTO_UPLOAD,
            payload: { photoKey: data.photo_key, progress: percentage }
          });
        }
      }
    })
    .then(response => {
      dispatch({
        type: CAR_PHOTO_UPLOAD,
        payload: {
          photoKey: data.photo_key,
          progress: -1,
          id: response.data.car_photo.id
        }
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const carPhotoDelete = (id, carId = null) => dispatch => {
  axios
    .delete(process.env.REACT_APP_API_URL + `car-photo/${id}`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: CAR_PHOTO_DELETE, payload: id });
      if (carId) {
        dispatch(getCar(carId));
      }
    })
    .catch(e => dispatch(authFail(e)));
};

export const getLastIncompleateCar = () => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "car/last-incomplete-car", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: USER_LAST_INCOMPLETE_CAR,
        payload: response.data.incompleteCar
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const markAsMainImage = data => dispatch => {
  axios
    .post(
      process.env.REACT_APP_API_URL +
        "car-photos/mark-as-main-image/" +
        data.id,
      { status: data.status },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({
        type: REGISTERED_CAR,
        payload: response.data.car
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const fetchAdvancePrice = (carId, bookingId = null) => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}car/calender-price/${carId}`, {
      params: {
        booking_id: bookingId
      },
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: ADVANCE_CAR_PRICE,
        payload: response.data.data
      });
    })
    .catch(e => dispatch(authFail(e)));
};

//new method to get data for car edit - to fix RYD-3325-car-info-in-list-my-car-for-ryde bug
export const getRegisteredCarForEdit = id => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "cars/edit/" + id, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: REGISTERED_CAR_FOR_EDIT,
          payload: response.data.car
        });
        dispatch(getMakes(response.data.car.year));
        dispatch(
          getModels(response.data.car.year, response.data.car.car_make.id)
        );
        dispatch(
          getTrims(
            response.data.car.year,
            response.data.car.car_make.id,
            response.data.car.car_model.id
          )
        );
      })
      .catch(e => dispatch(authFail(e)));
};
