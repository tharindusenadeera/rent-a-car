import axios from "axios";
import moment from "moment";
import {
  REFERRAL_AVAILABLE,
  GET_BOOKING,
  TRANSACTION_FAILED,
  SHOW_BOOKING_REVIEW,
  MODAL_POPUP,
  GET_USERS_BOOKINS,
  IS_FETCHING,
  DONE_FETCHING,
  IS_FETCHING_V2,
  DONE_FETCHING_V2,
  EXTRA_CHARGE_REQUEST,
  GET_BOOKING_DATA,
  IS_TRIP_FETCHING,
  CARS_FROM_BOOKING,
  MULTIPLE_CREDIT_CARDS,
  ACTION_REQUIRED,
  ACCESSDENIED
} from "../actions/ActionTypes";
import { authFail } from "./AuthAction";

export const getBooking = id => dispatch => {
  dispatch({ type: ACCESSDENIED, payload: false });
  axios
    .get(process.env.REACT_APP_API_URL + "bookings/" + id, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (response.data.booking) {
        dispatch({
          type: GET_BOOKING,
          payload: response.data.booking
        });
      }
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const getBookingData = (data, source = null) => dispatch => {
  let url = process.env.REACT_APP_API_URL + "booking/data";
  if (localStorage.access_token) {
    url = process.env.REACT_APP_API_URL + "booking/data/auth";
  }
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

  axios
    .get(url, {
      params: data,
      headers: { Authorization: localStorage.access_token }
    })
    .then(response => {
      dispatch({ type: TRANSACTION_FAILED, payload: "" });
      if (source == "details") {
        localStorage.setItem(
          "__tripDurationData",
          JSON.stringify({
            id: response.data.data.car_id,
            option: response.data.data.delivery_option,
            offerdelivery: response.data.data.offer_delivery,
            date: moment().format("YYYY-MM-DD HH:mm")
          })
        );
      }
      dispatch(setTripsData(response.data.data));
      dispatch({ type: DONE_FETCHING_V2 });
    })
    .catch(e => {
      dispatch(authFail(e));
      dispatch({ type: DONE_FETCHING_V2 });
    });
};

export const setTripsData = payload => dispatch => {
  dispatch({ type: GET_BOOKING_DATA, payload });
};

export const addBooking = data => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(process.env.REACT_APP_API_URL + "bookings", data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({ type: GET_BOOKING, payload: response.data.booking });
      dispatch({ type: DONE_FETCHING });
      // need to show the booking was easy pop up
      dispatch({ type: SHOW_BOOKING_REVIEW, payload: true });
      dispatch({ type: GET_BOOKING_DATA, payload: "" });
    })
    .catch(e => {
      dispatch(authFail(e));
      dispatch({
        type: TRANSACTION_FAILED,
        payload: e.response.data.message
      });
      dispatch({ type: DONE_FETCHING });
    });
};

export const bookingReview = review => dispatch => {
  // dispatch({type:IS_FETCHING})
  axios
    .post(
      process.env.REACT_APP_API_URL + "booking/process-review",
      { review: review },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: DONE_FETCHING });
      if (response.data.error === false) {
        // browserHistory.push(`/booking/${bookingId}`);
        // dispatch({type:SHOW_BOOKING_REVIEW, payload:false})
      }
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const confirmBooking = id => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(
      process.env.REACT_APP_API_URL + "bookings/confirm/",
      { bookingId: id },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: GET_BOOKING, payload: response.data.booking });
      dispatch({ type: MODAL_POPUP, payload: true });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const startBooking = id => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(
      `${process.env.REACT_APP_API_URL}v2/bookings/start`,
      { id: id },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: GET_BOOKING, payload: response.data.booking });
      dispatch({ type: DONE_FETCHING });
      // browserHistory.push(`/booking/${id}`);
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const declineBooking = id => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(
      process.env.REACT_APP_API_URL + "bookings/cancel",
      { bookingId: id },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: GET_BOOKING, payload: response.data.booking });
      dispatch({ type: MODAL_POPUP, payload: true });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const cancelBooking = id => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(
      process.env.REACT_APP_API_URL + "bookings/cancel",
      { bookingId: id },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: GET_BOOKING, payload: response.data.booking });
      dispatch({ type: MODAL_POPUP, payload: true });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => {
      dispatch(authFail(e));
    });
};

export const isReferralAvailable = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "referral/availability", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        if (response.data.count == 0) {
          dispatch({
            type: REFERRAL_AVAILABLE,
            payload: true
          });
        } else {
          dispatch({
            type: REFERRAL_AVAILABLE,
            payload: false
          });
        }
      })
      .catch(e => {
        dispatch(authFail(e));
      });
};

export const getUsersBookings = (params = {}) => dispatch => {
  dispatch({ type: IS_TRIP_FETCHING, payload: true });
  axios
    .get(`${process.env.REACT_APP_API_URL}bookings/users-booking/list`, {
      params,
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: GET_USERS_BOOKINS,
        payload: response.data.bookingList
      });
      dispatch({ type: IS_TRIP_FETCHING, payload: false });
    })
    .catch(e => {
      dispatch({ type: IS_TRIP_FETCHING, payload: false });
      dispatch(authFail(e));
    });
};

export const fetchCarsFromUserBooking = () => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}bookings/users-booking/cars`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(res => {
      dispatch({
        type: CARS_FROM_BOOKING,
        payload: res.data.booking
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const makePayment = bookingId => {
  return dispatch =>
    axios
      .post(
        process.env.REACT_APP_API_URL + "make-payment/" + bookingId,
        bookingId,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(response => {})
      .catch(e => dispatch(authFail(e)));
};

export const extraChargeRequest = () => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(process.env.REACT_APP_API_URL + "extra-charge-request", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: EXTRA_CHARGE_REQUEST,
        payload: response.data.extraChargeRequest
      });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};

export const getMultipleCards = () => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}v2/user/credit_card`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: MULTIPLE_CREDIT_CARDS,
        payload: response.data
      });
    })
    .catch(e => dispatch(authFail(e)));
};

//----------Action required new profile--------------//
export const getActionRequired = () => dispatch => {
  axios
    .get(
      `${process.env.REACT_APP_API_URL}bookings/users-booking/action-required`,
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({
        type: ACTION_REQUIRED,
        payload: response.data
      });
    })
    .catch(e => dispatch(authFail(e)));
};
