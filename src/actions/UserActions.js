import axios from "axios";
import {
  GET_LOGGED_IN_USER,
  CREDIT_CARD_VERIFICATION,
  RESET_USER,
  VERIFY_PHONE,
  GET_MESSAGES,
  GET_BOOKING_LIST,
  ADD_MESSAGE,
  IS_FETCHING,
  DONE_FETCHING,
  IS_FETCHING_V2,
  DONE_FETCHING_V2,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  VERIFY_PHONE_LOGIN,
  COUPON_CODE_AVAILABILITY,
  CREDIT_CARD_ERROR,
  COUPON_CODE_VALIDITY,
  RESEND_CODE_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_ERROR,
  COUPON_AMOUNT,
  REF_CODE_VALIDITY,
  GET_REF_CODE,
  GET_USER_BALANCE,
  AUTHENTICATED,
  RATING_CATEGORIES,
  SIGNUP_ERROR,
  PHONE_VERIFICATION_ERROR,
  PHONE_VERIFICATION_RESEND,
  VERIFY_PHONE_NUMBER,
  AUTH_USER_REVIEWS,
  NEW_PUBLIC_PROFILE_REVIEWS,
  ACCESSDENIED
} from "../actions/ActionTypes";
import { SubmissionError } from "redux-form";
//import { browserHistory } from "react-router-dom";
import moment from "moment";
import { clearData } from "./ProfileActions";
import { authFail } from "./AuthAction";

// To-do: This is the new method. Need to replace the old methods.
export const signupUser = data => dispatch => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}users`, data)
    .then(response => {
      if (response.data.response) {
        dispatch({ type: VERIFY_PHONE_NUMBER, payload: data });
      }
    })
    .catch(e => {
      if (e.response) {
        dispatch({ type: SIGNUP_ERROR, payload: e.response.data });
      }
    });
};

export const signUpAction = (signUpData, dispatch) => {
  return axios
    .post(process.env.REACT_APP_API_URL + "users", signUpData)
    .then(response => {
      localStorage.setItem("phoneNumber", signUpData.phone_number);
      localStorage.setItem("email", signUpData.email);
      dispatch({ type: VERIFY_PHONE_LOGIN, payload: true });
    })
    .catch(e => {
      if (e.response.data.message) {
        throw new SubmissionError({ _error: e.response.data.message });
      } else {
        throw new SubmissionError({ _error: e.response.data.errors[0] });
      }
    });
};

export const getApiTokenFromSocialToken = (token, dispatch) => {
  axios
    .post(process.env.REACT_APP_API_URL + "users/get-token", { token: token })
    .then(response => {
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );
      dispatch(getLoggedInUser());
    });
};

export const loginFacebook = (e, callBack = null, params = {}) => dispatch => {
  axios
    .post(process.env.REACT_APP_API_URL + "users/login-facebook", e)
    .then(response => {
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );

      dispatch(getLoggedInUser(null, null, callBack));
    });
};

export const loginGoogle = (e, callBack = null, params = {}) => dispatch => {
  axios
    .post(process.env.REACT_APP_API_URL + "users/login-google", {
      accessToken: e.Zi.access_token,
      ...params
    })
    .then(response => {
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );
      dispatch(getLoggedInUser(null, null, callBack));
    });
};

// To-do: This is the new method. Need to replace the old methods.
export const verifyPhoneVerificationCode = (
  email,
  password,
  phone_number,
  verifyCode
) => dispatch => {
  return axios
    .post(process.env.REACT_APP_API_URL + "users/verify-phone", {
      verifyCode,
      phone_number,
      email
    })
    .then(response => {
      return signinUser({ email, password }, dispatch);
    })
    .catch(e => {
      console.log(e);
      dispatch({ type: PHONE_VERIFICATION_ERROR, payload: e.response.data });
    });
};

// To-do: This is the new method. Need to replace the old methods.
export const verifyPhoneVerificationCodeProfile = (
  email,
  phone_number,
  verifyCode
) => dispatch => {
  return axios
    .post(
      process.env.REACT_APP_API_URL + "users/verify-phone",
      { verifyCode, email, phone_number },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: VERIFY_PHONE_NUMBER, payload: false });
      dispatch(getLoggedInUser());
    })
    .catch(e => {
      dispatch({ type: PHONE_VERIFICATION_ERROR, payload: e.response.data });
    });
};

export const verifyPhoneLoginAction = ({ password, verifyCode }, dispatch) => {
  return axios
    .post(process.env.REACT_APP_API_URL + "users/verify-phone", {
      verifyCode,
      phone_number: localStorage.phoneNumber,
      email: localStorage.email
    })
    .then(response => {
      if (response.data.response) {
        return signInAction({ email: localStorage.email, password }, dispatch);
      }
    })
    .catch(e => {
      if (e.response) {
        throw new SubmissionError({ _error: e.response.data.response });
      } else {
        throw new SubmissionError({ _error: e.errors._error });
      }
    });
};

export const verifyPhoneAction = ({ verifyCode }, dispatch) => {
  return axios
    .post(
      process.env.REACT_APP_API_URL + "users/verify-phone",
      {
        verifyCode,
        verifyKey: localStorage.verifyKey,
        email: localStorage.email,
        phone_number: localStorage.phoneNumber
      },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      //if(response.data.response.validated){
      dispatch({ type: VERIFY_PHONE, payload: false });
      dispatch(getLoggedInUser());
      //}
    })
    .catch(e => {
      if (e.response) {
        throw new SubmissionError({ _error: e.response.data.response });
      }
    });
};

// To-do: This is the new method. Need to replace the old methods.
export const resendPhoneVerificationCode = (
  signupFormData,
  phone_number
) => dispatch => {
  const { email } = signupFormData;

  dispatch({ type: PHONE_VERIFICATION_RESEND, payload: "" });
  axios
    .post(process.env.REACT_APP_API_URL + "users/resend-code", {
      phone_number,
      email
    })
    .then(response => {
      if (!response.data.error) {
        dispatch({ type: VERIFY_PHONE_NUMBER, payload: signupFormData });
        dispatch({
          type: PHONE_VERIFICATION_RESEND,
          payload: response.data.message
        });
      }
    })
    .catch(e => {
      if (e.response) {
        dispatch({ type: PHONE_VERIFICATION_RESEND, payload: e.response.data });
      }
    });
};

export const resendCode = dispatch => {
  axios
    .post(process.env.REACT_APP_API_URL + "users/resend-code", {
      phone_number: localStorage.phoneNumber,
      email: localStorage.email
    })
    .then(response => {
      if (!response.data.error) {
        dispatch({
          type: RESEND_CODE_SUCCESS,
          payload: response.data.message
        });
      }
    })
    .catch(e => {
      console.log("e", e);
    });
};

// To-do: This is the new method. Need to replace the old methods.
export const signinUser = (data, callBack = null) => dispatch => {
  const { email, password } = data;
  const signInData = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    grant_type: "password",
    username: email,
    password: password
  };
  return axios
    .post(process.env.REACT_APP_API_URL_AUTH + "oauth/token", signInData)
    .then(response => {
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );
      dispatch({
        type: AUTHENTICATED,
        payload: true
      });
      dispatch(getLoggedInUser(null, null, callBack));
      localStorage.searchData && dispatch(userSearchData());
    })
    .catch(e => {
      console.log("e", e);
    });
};

export const signInAction = ({ email, password }, dispatch) => {
  const signInData = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    grant_type: "password",
    username: email,
    password: password
  };
  return axios
    .post(process.env.REACT_APP_API_URL_AUTH + "oauth/token", signInData)
    .then(response => {
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );
      dispatch(getLoggedInUser());
      dispatch({ type: VERIFY_PHONE, payload: false });
    })
    .catch(e => {
      throw new SubmissionError({
        _error: "Login failed! Incorrect email or password"
      });
    });
};

export const forgetPassword = (email, dispatch) => {
  return axios
    .post(process.env.REACT_APP_API_URL + "password/email", email)
    .then(response => {
      dispatch({ type: FORGOT_PASSWORD, payload: response.data });
    })
    .catch(e => {
      throw new SubmissionError({ _error: "Failed! Incorrect email" });
    });
};

export const passwordReset = (data, dispatch, props) => {
  const resetData = {
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    token: props.token
  };
  return axios
    .post(process.env.REACT_APP_API_URL + "password/reset", resetData)
    .then(response => {
      dispatch({ type: RESET_PASSWORD, payload: response.data });
    })
    .catch(e => {
      throw new SubmissionError({ _error: "Failed!" });
    });
};

export const getLoggedInUser = (
  withLoading = true,
  platform = null,
  callBack = null
) => dispatch => {
  if (localStorage.access_token) {
    withLoading && dispatch({ type: IS_FETCHING });
    return axios
      .get(process.env.REACT_APP_API_URL + "user", {
        headers: {
          Authorization: localStorage.access_token,
          Platform: platform
        }
      })
      .then(response => {
        dispatch({
          type: GET_LOGGED_IN_USER,
          payload: response.data
        });
        dispatch({
          type: AUTHENTICATED,
          payload: true
        });
        dispatch({ type: DONE_FETCHING });

        if (callBack) {
          callBack();
        }
      })
      .catch(e => {
        if (e.response) {
          dispatch({
            type: AUTHENTICATED,
            payload: false
          });
          dispatch(logoutUser);
        }
        dispatch({ type: DONE_FETCHING });
      });
  } else {
    return dispatch({
      type: AUTHENTICATED,
      payload: false
    });
  }
};

export const createCreditCard = (data, dispatch, props) => {
  return axios
    .post(process.env.REACT_APP_API_URL + "credit-card/add", data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (!response.data.error) {
        dispatch(getLoggedInUser());
      }
    })
    .catch(e => {
      dispatch({
        type: CREDIT_CARD_ERROR,
        payload: e.response.data.message
      });
      dispatch(authFail(e));
      //throw new SubmissionError({ _error: "something is wrong"})
    });
};

export const getRefCode = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "referral/userRefCode", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_REF_CODE,
          payload: response.data.refCode ? response.data.refCode : ""
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getUserBalance = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "users/balance", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_USER_BALANCE,
          payload: response.data.balance
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const updateProfile = (data, props) => dispatch => {
  dispatch({ type: USER_UPDATE_SUCCESS, payload: "" });
  dispatch({ type: USER_UPDATE_ERROR, payload: "" });
  if (props && !props.profilePicUploaded) {
    window.scroll(0, 100);
    return;
  }
  let dle = null;
  let dob = null;
  if (
    moment(data.driving_license_expiration, "MM-DD-YYYY").format(
      "MM-DD-YYYY"
    ) == data.driving_license_expiration
  ) {
    dle = moment(data.driving_license_expiration, "MM-DD-YYYY").format(
      "YYYY-MM-DD"
    );
  } else if (
    moment(data.driving_license_expiration, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    ) == data.driving_license_expiration
  ) {
    dle = moment(data.driving_license_expiration, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );
  }

  if (
    moment(data.date_of_birth, "MM-DD-YYYY").format("MM-DD-YYYY") ==
    data.date_of_birth
  ) {
    dob = moment(data.date_of_birth, "MM-DD-YYYY").format("YYYY-MM-DD");
  } else if (
    moment(data.date_of_birth, "YYYY-MM-DD").format("YYYY-MM-DD") ==
    data.date_of_birth
  ) {
    dob = moment(data.date_of_birth, "YYYY-MM-DD").format("YYYY-MM-DD");
  }

  const dateOfBirth = dob;
  const drivingLicenseExpiration = dle;
  const phoneNumber = data.phone_number;

  const verifyData = {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    type: "PROFILE"
  };

  data.driving_license_expiration = drivingLicenseExpiration;
  data.date_of_birth = dateOfBirth;
  data.profile_image = "";
  data.profile_image_thumb = "";

  dispatch({ type: IS_FETCHING });
  return axios
    .patch(process.env.REACT_APP_API_URL + "users/" + data.id, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (response.data.error == true) {
        dispatch({ type: USER_UPDATE_ERROR, payload: response.data.message });
      } else {
        console.log("response", response);
        if (response.data.response.verified_phone == 0) {
          dispatch(resendPhoneVerificationCode(verifyData, phoneNumber));
          dispatch({ type: VERIFY_PHONE_NUMBER, payload: data });
        }
        dispatch({ type: GET_LOGGED_IN_USER, payload: response.data.response });
        dispatch({ type: CREDIT_CARD_VERIFICATION, payload: true });
        dispatch({ type: USER_UPDATE_SUCCESS, payload: response.data.message });
        dispatch({ type: DONE_FETCHING });
      }
    })
    .catch(e => {
      console.log("e.response", e.response);
      dispatch({ type: DONE_FETCHING });
      dispatch(authFail(e));
      throw new SubmissionError({ _error: e.response.data.message });
      // if (e.response && e.response.data && e.response.data.error == true) {
      //   dispatch({ type: USER_UPDATE_ERROR, payload: e.response.data.message });
      //   throw new SubmissionError({ _error: e.response.data.message });
      // }
    });
};

export const sendMessage = (messageData, dispatch, props) => {
  const { booking, user, reset } = props;
  reset();
  const { message } = messageData;
  const data = {
    id: Math.random() * 10,
    message: message,
    user: user,
    user_id: user.id,
    booking_id: booking.id
  };
  dispatch({ type: ADD_MESSAGE, payload: data });
  axios
    .post(
      process.env.REACT_APP_API_URL + "messages",
      {
        message: message,
        bookingId: booking.id
      },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {})
    .catch(e => dispatch(authFail(e)));
};

export const getMessages = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "messages", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_MESSAGES,
          payload: response.data.messages
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getMessagesForBooking = bookingId => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "messages/" + bookingId, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: GET_MESSAGES,
          payload: response.data.messages
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const getBookingList = () => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .get(process.env.REACT_APP_API_URL + "messages/booking-list", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: GET_BOOKING_LIST,
        payload: response.data.receiverList
      });
      dispatch({ type: DONE_FETCHING });
    })
    .catch(e => dispatch(authFail(e)));
};

export const logoutUser = dispatch => {
  axios
    .post(
      process.env.REACT_APP_API_URL + "user/logout",
      {},
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      if (!response.data.error) {
        localStorage.removeItem("access_token");
        dispatch({
          type: RESET_USER
        });
        dispatch({
          type: AUTHENTICATED,
          payload: false
        });
        dispatch(clearData());
      }
    })
    .catch(e => dispatch(authFail(e)));
};

export const uploadProfilePic = (dataUri, fetchUser = true) => dispatch => {
  dispatch({ type: IS_FETCHING });
  axios
    .post(
      process.env.REACT_APP_API_URL + "profile/pic-upload",
      {
        profileImage: dataUri
      },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {
      dispatch({ type: DONE_FETCHING });
      if (fetchUser) {
        dispatch(getLoggedInUser());
      }
    })
    .catch(e => dispatch(authFail(e)));
};

export const checkCouponCodeAvailability = () => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "coupon/availability", {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        if (response.data.data) {
          dispatch({
            type: COUPON_CODE_AVAILABILITY,
            payload: true
          });
          dispatch({
            type: COUPON_AMOUNT,
            payload: response.data.data.amount
          });
        } else {
          dispatch({
            type: COUPON_CODE_AVAILABILITY,
            payload: false
          });
        }
      })
      .catch(e => dispatch(authFail(e)));
};

export const checkCouponCodeValidity = code => {
  return dispatch =>
    axios
      .get(process.env.REACT_APP_API_URL + "coupon/validity/" + code, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(response => {
        dispatch({
          type: COUPON_CODE_VALIDITY,
          payload: response.data.status
        });
      })
      .catch(e => dispatch(authFail(e)));
};

export const checkRefCodeValidity = code => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "referral/check", {
      params: {
        code: code
      }
    })
    .then(response => {
      dispatch({
        type: REF_CODE_VALIDITY,
        payload: response.data.result
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const addRefCode = refCode => dispatch => {
  axios
    .post(
      process.env.REACT_APP_API_URL + "referral/add",
      { code: refCode },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
    .then(response => {})
    .catch(e => dispatch(authFail(e)));
};

export const fetchRatingCategories = () => dispatch => {
  axios
    .get(process.env.REACT_APP_API_URL + "rating-categories", {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: RATING_CATEGORIES,
        payload: response.data
      });
    })
    .catch(e => dispatch(authFail(e)));
};

export const fetchAuthUserReviews = () => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}reviews/users-review`, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      dispatch({
        type: AUTH_USER_REVIEWS,
        payload: response.data.reviews
      });
    })
    .catch(e => {
      dispatch(authFail(e));
      console.log("error", e);
    });
};

export const userSearchData = () => dispatch => {
  const data = JSON.parse(localStorage.searchData);
  axios
    .post(`${process.env.REACT_APP_API_URL}search-data`, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(response => {
      if (!response.data.error) {
        localStorage.removeItem("searchData");
      }
    })
    .catch(e => {
      dispatch(authFail(e));
      console.log("error", e);
    });
};

// ============================ V2 ============================== //

export const uploadProfilePicV2 = (imgUrl, fetchUser = true) => dispatch => {
  const data = {
    profile_image: imgUrl
  };
  dispatch({ type: IS_FETCHING_V2 });
  axios
    .post(`${process.env.REACT_APP_API_URL}v2/profile/pic_upload`, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
    .then(res => {
      dispatch({ type: DONE_FETCHING_V2 });
      if (fetchUser) {
        dispatch(getLoggedInUser(false));
      }
    })
    .catch(err => {
      dispatch(authFail(err));
      console.log("err", err);
    });
};

//------------------------Public profile new endpoint ------------------------------//

export const getNewPublicProfileReviews = (id, params = {}) => dispatch => {
  axios
    .get(`${process.env.REACT_APP_API_URL}profile/reviews/${id}`, { params })
    .then(response => {
      dispatch({
        type: NEW_PUBLIC_PROFILE_REVIEWS,
        payload: response.data.reviewList
      });
    });
};
