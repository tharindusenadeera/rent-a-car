import { AUTHENTICATED } from "./ActionTypes";

export const authFail = e => dispatch => {
  if (e && e.response && e.response.status && e.response.status == 401) {
    localStorage.removeItem("access_token");
    dispatch(logOut());
  }
};

export const logOut = () => dispatch => {
  dispatch({
    type: AUTHENTICATED,
    payload: false
  });
};
