import axios from "axios";
import {
  SUPPORT_TICKET,
  SUPPORT_TICKETS,
  SUPPORT_TICKET_BOOKINGS,
  IS_FETCHING,
  DONE_FETCHING,
  ACCESSDENIED
} from "./ActionTypes";
import { authFail } from "./AuthAction";

export const fetchBookings = type => dispatch => {
  return axios
    .get(
      process.env.REACT_APP_API_URL +
        `support-ticket-data/bookings?type=${type}`,
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(res => {
      dispatch({
        type: SUPPORT_TICKET_BOOKINGS,
        payload: res.data.data
      });
    })
    .catch(e => {
      console.log("error", e);
      dispatch(authFail(e));
    });
};

export const fetchSupportTickets = (params = {}) => dispatch => {
  dispatch({ type: ACCESSDENIED, payload: false });
  axios
    .get(`${process.env.REACT_APP_API_URL}support-ticket`, {
      headers: {
        Authorization: localStorage.access_token
      },
      params
    })
    .then(response => {
      dispatch({
        type: SUPPORT_TICKETS,
        payload: response.data.supportTickets
      });
    })
    .catch(err => {
      console.log("error", err);
      dispatch(authFail(err));
    });
};

export const fetchTicket = (id, loading = true) => dispatch => {
  loading && dispatch({ type: IS_FETCHING });
  return axios
    .get(process.env.REACT_APP_API_URL + `support-ticket/${id}`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(res => {
      dispatch({
        type: SUPPORT_TICKET,
        payload: res.data.data
      });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};

//============================ V2 End Ponits============================//

export const fetchTicketV2 = (id, loading = true) => dispatch => {
  dispatch({ type: ACCESSDENIED, payload: false });
  loading && dispatch({ type: IS_FETCHING });
  return axios
    .get(`${process.env.REACT_APP_API_URL}v2/support-ticket/${id}`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(res => {
      dispatch({
        type: SUPPORT_TICKET,
        payload: res.data.data
      });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(error => {
      if (error.response && error.response.data.status_code == 403) {
        dispatch({ type: DONE_FETCHING });
        dispatch({ type: ACCESSDENIED, payload: true });
      }
      dispatch(authFail(error));
    });
};
