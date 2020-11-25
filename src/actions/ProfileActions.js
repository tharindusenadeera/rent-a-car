import Axios from "axios";
import * as Type from "./ActionTypes";
import { getLoggedInUser, resendPhoneVerificationCode } from "./UserActions";
import { authFail } from "./AuthAction";

//-------------Reviews---------------//
export const fetchReviewsAboutMe = (params = {}) => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(
    `${process.env.REACT_APP_API_URL}v2/reviews/users-review/about_me`,
    {
      headers: {
        Authorization: localStorage.access_token
      },
      params
    }
  )
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.REVIEWS_ABOUT_ME,
          payload: response.data
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

export const fetchReviewsByMe = (params = {}) => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}v2/reviews/users-review/by_me`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.REVIEWS_BY_ME,
          payload: response.data
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

//---------Notifications--------//
export const fetchWebNotifications = (params = {}) => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}web-notifications`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (response) {
        dispatch({
          type: Type.NOTIFICATIONS,
          payload: response.data
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

export const fetchNavNotifications = () => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}profile-notifications`, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.NAVBAR_NOTIFICATIONS,
          payload: response.data
        });
      }
    })
    .catch(e => dispatch(authFail(e)));
};

export const readNotification = id => dispatch => {
  Axios.delete(`${process.env.REACT_APP_API_URL}notifications/${id}`, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      dispatch(fetchNavNotifications());
      dispatch(fetchWebNotifications());
    })
    .catch(e => {
      console.log("e", e);
      dispatch(authFail(e));
    });
};

//-------------Cars-------------------//
export const fetchUserCars = (params = {}) => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}V2/cars/users-cars`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.USER_CARS,
          payload: response.data.cars
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

//----------Unread notification---------//
export const fetchUnreadNotification = () => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}unread-notification`, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(res => {
      dispatch({
        type: Type.UNREAD_TAB_DATA,
        payload: res.data.unreadNotifications
      });
    })
    .catch(e => {
      console.log("Error", e);
      dispatch(authFail(e));
    });
};

export const readUnreadNotification = id => dispatch => {
  Axios.patch(
    `${process.env.REACT_APP_API_URL}unread-notification`,
    { notificationIds: id },
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  )
    .then(res => {
      dispatch(fetchUnreadNotification());
    })
    .catch(e => {
      console.log("Error", e);
      dispatch(authFail(e));
    });
};

//-------------Earnings----------------//
export const fetchCarsForEarnings = (params = {}) => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}earnings/users-cars`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.CARS_FOR_EARNINGS,
          payload: response.data.cars
        });
      }
    })
    .catch(e => {
      console.log("error", e);
      dispatch(authFail(e));
    });
};

export const fetchUserEarnings = (params = {}) => dispatch => {
  dispatch({
    type: Type.USER_EARNINGS,
    payload: []
  });
  Axios.get(`${process.env.REACT_APP_API_URL}user/earnings`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        let dataArray = response.data.chart.data.map((item, key) => {
          let intvalue = parseFloat(item.earning);
          return {
            xAxisLable: item.xAxisLable,
            earning: intvalue,
            label: "$ " + intvalue
          };
        });
        dispatch({
          type: Type.USER_EARNINGS,
          payload: dataArray
        });
        dispatch({
          type: Type.TOTAL_EARNINGS,
          payload: response.data.chart.total_earnings
        });
        dispatch({
          type: Type.USER_PAYOUTS,
          payload: response.data.chart
        });
      }
    })
    .catch(e => {
      console.log("error", e);
      dispatch(authFail(e));
    });
};

export const fetchEarningsDetail = (params = {}) => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}user/earnings/detail`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.EARNINGS_DETAIL,
          payload: response.data.earningList
        });
        dispatch({
          type: Type.TOTAL_EARNINGS,
          payload: response.data.total_earnings
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

export const fetchPayoutHistory = params => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}payouts/history`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.PAYOUT_HISTORY,
          payload: response.data.stripePayout
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

//-------------Edit Profile----------------//
export const fetchLanguagesList = () => dispatch => {
  Axios.get(process.env.REACT_APP_API_URL + "languages", {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (!response.data.error) {
        const languageArray = response.data.feature.map(language => {
          return { value: language.id, label: language.name };
        });
        dispatch({
          type: Type.LANGUAGE_LIST,
          payload: languageArray
        });
      }
    })
    .catch(error => {
      console.log("error", error);
      dispatch(authFail(error));
    });
};

export const uploadProfile = (imgUrl, fetchUser = true) => dispatch => {
  const data = {
    profile_image: imgUrl
  };
  dispatch({ type: Type.IS_FETCHING });
  Axios.post(`${process.env.REACT_APP_API_URL}v2/profile/pic_upload`, data, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(getLoggedInUser(false));
      dispatch({
        type: Type.PROFILE_PIC_UPDATE_SUCCESS,
        payload: "Photo Upload Success"
      });
      // dispatch({
      //   type: Type.GET_LOGGED_IN_USER,
      //   payload: response.data.user
      // });
    })
    .catch(error => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(error));
    });
};

export const updateProfile = data => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  dispatch({ type: Type.VERIFY_PHONE_NUMBER, payload: "" });
  // const formatPhoneNumber = data => {
  //   return data.toString().replace(/[^+\d]+/g, "");
  // };

  const phoneNumber = data.phone_number;
  const verifyData = {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone_number: data.phone_number,
    type: "PROFILE"
  };

  Axios.patch(process.env.REACT_APP_API_URL + "users/" + data.id, data, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (response.data.error == true) {
        dispatch({ type: Type.UPDATE_ERROR, payload: response.data.message });
      } else {
        if (
          data.tab === "PersonalInformation" &&
          response.data.response.verified_phone == 0
        ) {
          dispatch(resendPhoneVerificationCode(verifyData, phoneNumber));
          dispatch({ type: Type.VERIFY_PHONE_NUMBER, payload: data });
        }

        dispatch(getLoggedInUser());
        // dispatch({
        //   type: Type.GET_LOGGED_IN_USER,
        //   payload: response.data.response
        // });
        dispatch({ type: Type.CREDIT_CARD_VERIFICATION, payload: true });
        dispatch({ type: Type.UPDATE_SUCCESS, payload: response.data.message });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(error => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(error));
      if (error.response && error.response.data) {
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: error.response.data.message
        });
      }
    });
};

export const getUserCards = () => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.get(`${process.env.REACT_APP_API_URL}v2/user/credit_card`, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (!response.error) {
        dispatch({
          type: Type.USERS_CARDS,
          payload: response.data.creditCard
        });
        dispatch({ type: Type.DONE_FETCHING });
      }
    })
    .catch(e => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(e));
    });
};

export const addCreditCard = data => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.post(process.env.REACT_APP_API_URL + "v2/credit-card/add", data, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (!response.data.error) {
        dispatch({
          type: Type.GET_LOGGED_IN_USER,
          payload: response.data.response
        });
        dispatch({ type: Type.DONE_FETCHING });
        dispatch({
          type: Type.UPDATE_SUCCESS,
          payload: "Card Saved Successfully"
        });
      } else {
        dispatch({ type: Type.DONE_FETCHING });
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: response.data.message
        });
      }
    })
    .catch(error => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(error));
      if (error.response && error.response.data) {
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: error.response.data.message
        });
      }
    });
};

export const setPrimaryCard = data => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.post(
    process.env.REACT_APP_API_URL + `credit-card/set-primary/${data}`,
    data,
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  )
    .then(response => {
      dispatch({ type: Type.DONE_FETCHING });
    })
    .catch(error => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(error));
    });
};

export const resetPassword = data => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.post(process.env.REACT_APP_API_URL + "user/password-reset", data, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(response => {
      if (!response.data.error) {
        dispatch({ type: Type.DONE_FETCHING });
        dispatch({
          type: Type.UPDATE_SUCCESS,
          payload: response.data.message
        });
      } else {
        dispatch({ type: Type.DONE_FETCHING });
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: response.data.message
        });
      }
    })
    .catch(error => {
      dispatch({ type: Type.DONE_FETCHING });
      dispatch(authFail(error));
      if (error.response && error.response.data) {
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: error.response.data.message
        });
      }
    });
};

export const forgotPassword = data => dispatch => {
  dispatch({ type: Type.IS_FETCHING });
  Axios.post(process.env.REACT_APP_API_URL + "password/reset", data)
    .then(response => {
      if (response.data.errors) {
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: response.data.errors[0]
        });
      } else if (!response.data.error) {
        dispatch({
          type: Type.UPDATE_SUCCESS,
          payload: response.data.message
        });
      } else {
        dispatch({
          type: Type.UPDATE_ERROR,
          payload: response.data.message
        });
      }
    })
    .catch(e => {
      dispatch({
        type: Type.UPDATE_ERROR,
        payload: e.response.data.errors[0]
      });
      dispatch({ type: Type.DONE_FETCHING });
    });
};

export const clearData = () => dispatch => {
  dispatch({ type: Type.GET_USERS_BOOKINS, payload: [] });
  dispatch({ type: Type.ACTION_REQUIRED, payload: [] });
  dispatch({ type: Type.CARS_FROM_BOOKING, payload: [] });
};
