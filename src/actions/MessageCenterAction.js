import Axios from "axios";
import queryString from "query-string";
import moment from "moment-timezone";
import * as Type from "./ActionTypes";
import _ from "lodash";
import { getLoggedInUser } from "./UserActions";
import { authFail } from "./AuthAction";
//-------------- Fetch message threads -----------//

export const makeTempThread = searchQuery => {
  const {
    detailable_id,
    car_name,
    car_photo,
    from_date,
    id,
    number,
    profile_image,
    to_date,
    participant_name,
    profile_image_thumb
  } = queryString.parse(searchQuery);
  return {
    isTemp: true,
    created_at: "",
    created_by: "",
    detailable_id: parseInt(detailable_id),
    details: {
      data: {
        car_name,
        car_photo,
        from_date,
        id,
        number,
        to_date
      }
    },
    id: null,
    is_archived: 0,
    last_message_at: moment(),
    participant: {
      data: [
        {
          id: null,
          is_active: 1,
          participant_name,
          profile_image,
          profile_image_thumb
        }
      ]
    },
    unread_count: 0,
    updated_at: ""
  };
};

export const fetchMessages = (params = {}, searchQuery = null) => dispatch => {
  params.detailable_type = "booking";
  params.conversation_order = "asc";
  params.paginate = 0;
  Axios.get(`${process.env.REACT_APP_API_URL}threads`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(res => {
      if (!res.data.error) {
        const fetchedThread = res.data.threads;

        if (searchQuery) {
          const tempThread = makeTempThread(searchQuery);

          const checkMessageIsExist = fetchedThread.data.find(item => {
            return item.detailable_id === tempThread.detailable_id;
          });
          if (!checkMessageIsExist) {
            fetchedThread.data.unshift(tempThread);
          }
        }
        dispatch({
          type: Type.MESSAGES,
          payload: fetchedThread
        });
      }
    })
    .catch(e => {
      console.log("Error", e);
      dispatch(authFail(e));
    });
};

export const fetchMessage = (params, searchQuery = null) => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}message-center/thread`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(res => {
      if (!res.data.error) {
        let fetchThred = res.data.thread.data;
        if (
          searchQuery &&
          Array.isArray(fetchThred) &&
          fetchThred.length === 0
        ) {
          fetchThred = makeTempThread(searchQuery);
        }
        dispatch({
          type: Type.MESSAGE,
          payload: fetchThred
        });
      }
    })
    .catch(e => {
      console.log("Error", e);
      dispatch(authFail(e));
    });
};

export const fetchConversations = (params, withInfinit = {}) => dispatch => {
  params.conversation_order = "asc";
  // if (_.isEmpty(withInfinit)) {
  //   dispatch({
  //     type: Type.CONVERSATIONS,
  //     payload: []
  //   });
  // }
  dispatch({
    type: Type.IS_FETCHING_CONVERSATION,
    payload: true
  });
  Axios.get(`${process.env.REACT_APP_API_URL}message-center/conversation`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params
  })
    .then(res => {
      if (!res.data.error) {
        if (_.isEmpty(withInfinit)) {
          dispatch({
            type: Type.CONVERSATIONS,
            payload: res.data.conversations
          });
          dispatch({
            type: Type.IS_FETCHING_CONVERSATION,
            payload: false
          });
        } else {
          dispatch({
            type: Type.CONVERSATIONS,
            payload: {
              data: res.data.conversations.data.concat(withInfinit.data),
              meta: res.data.conversations.meta
            }
          });
          dispatch({
            type: Type.IS_FETCHING_CONVERSATION,
            payload: false
          });
        }
      }
    })
    .catch(e => {
      console.log("Errorr", e);
      dispatch(authFail(e));
    });
};

export const setConversations = data => dispatch => {
  dispatch({
    type: Type.CONVERSATIONS,
    payload: data
  });
};

//------------------- Send Messages ----------------//
export const sendMessage = (data, status = null) => dispatch => {
  Axios.post(`${process.env.REACT_APP_API_URL}message-center/create`, data, {
    headers: {
      Authorization: localStorage.access_token
    }
  })
    .then(() => {
      if (status === "new") {
        dispatch(fetchMessages());
        dispatch(
          fetchMessage({
            detailable_type: "booking",
            detailable_id: data.detailable_id
          })
        );
        dispatch(
          fetchConversations({
            detailable_type: "booking",
            detailable_id: data.detailable_id
          })
        );
      }
      //
    })
    .catch(e => {
      console.log("error, e");
      dispatch(authFail(e));
    });
};

export const hasMessages = () => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}message-center/thread`, {
    headers: {
      Authorization: localStorage.access_token
    },
    params: {
      page: 1
    }
  })
    .then(res => {
      if (!_.isEmpty(res.data.thread.data)) {
        dispatch({
          type: Type.HAS_MESSAGE,
          payload: true
        });
      } else {
        dispatch({
          type: Type.HAS_MESSAGE,
          payload: false
        });
      }
    })
    .catch(e => dispatch(authFail(e)));
};

//-----------------Message Archive---------------------//
export const messageArchive = (id, loadingData = {}) => dispatch => {
  Axios.patch(
    `${process.env.REACT_APP_API_URL}message-center/archive/${id}`,
    {},
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  )
    .then(response => {
      if (!response.data.error) {
        dispatch(fetchMessages(loadingData));
        dispatch({
          type: Type.MESSAGE,
          payload: {}
        });
      }
    })
    .catch(e => dispatch(authFail(e)));
};
export const setTyping = data => dispatch => {
  Axios.post(`${process.env.REACT_APP_API_URL}message-center/typing`, data, {
    headers: {
      Authorization: localStorage.access_token
    }
  });
};

export const deleteAttachment = id => dispatch => {
  Axios.delete(
    `${process.env.REACT_APP_API_URL}message-center/attachment/${id}`,
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  )
    .then(res => {
      dispatch(fetchMessages());
    })
    .catch(e => dispatch(authFail(e)));
};

export const readThread = (id, searchQuery = null) => dispatch => {
  Axios.post(
    `${process.env.REACT_APP_API_URL}message-center/read/${id}`,
    {},
    {
      headers: {
        Authorization: localStorage.access_token
      }
    }
  )
    .then(res => {
      dispatch(fetchMessages({}, searchQuery));
      dispatch(getLoggedInUser(false));
    })
    .catch(e => dispatch(authFail(e)));
};
