import Axios from "axios";

export const authSignUp = data => {
  return Axios.post(`${process.env.REACT_APP_API_URL_AUTH}oauth/token`, data);
};

export const authSignIn = data => {
  return Axios.post(`${process.env.REACT_APP_API_URL_AUTH}oauth/token`, data);
};

export const fetchAuthUser = () => {};

export const faceBookSignUp = () => {};

export const googleSignUp = () => {};

export const referralCheck = params => {
  return Axios.get(`${process.env.REACT_APP_API_URL}referral/check`, {
    params
  });
};
