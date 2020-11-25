import axios from "axios";
import {
  PROMOTION_FORM_ERROR,
  PROMOTION_POP_UP_CLOSED,
  REFERRAL_DATA
} from "../actions/ActionTypes";
// import {REACT_APP_API_URL} from '../consts/consts'
//import { browserHistory } from "react-router";

export const registerToWinStore = data => dispatch => {
  dispatch({
    type: PROMOTION_FORM_ERROR,
    payload: false
  });
  return axios
    .post(
      process.env.REACT_APP_API_URL + "promotion/register-to-win/create",
      data
    )
    .then(response => {
      dispatch({
        type: PROMOTION_FORM_ERROR,
        payload: false
      });
      localStorage.setItem("registerToWinPopIsClosed", true);
      // browserHistory.push("/signup");
    })
    .catch(e => {
      dispatch({
        type: PROMOTION_FORM_ERROR,
        payload: e.response.data.message
      });
    });
};

export const closeModel = () => dispatch => {
  return dispatch({
    type: PROMOTION_POP_UP_CLOSED,
    payload: true
  });
};

export const openModel = () => dispatch => {
  return dispatch({
    type: PROMOTION_POP_UP_CLOSED,
    payload: false
  });
};

export const getReferralAmount = () => dispatch => {
  return axios
    .get(process.env.REACT_APP_API_URL + "referral/amount")
    .then(res => {
      dispatch({ type: REFERRAL_DATA, payload: res.data.amounts });
    })
    .catch(e => {
      console.log(e);
    });
};
