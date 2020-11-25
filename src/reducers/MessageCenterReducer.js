import * as Type from "../actions/ActionTypes";
import _ from "lodash";

const initialState = {
  messages: [],
  message: {},
  message_acrchive: [],
  conversations: [],
  lastMessage: {},
  hasMessages: null,
  isFetchingConversation: false
};

const MessageCenter = (state = initialState, action) => {
  switch (action.type) {
    case Type.MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    case Type.HAS_MESSAGE:
      return {
        ...state,
        hasMessages: action.payload
      };
    case Type.MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    case Type.CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload
      };
    case Type.MESSAGE_ARCHIVE:
      return { ...state, messageArchive: action.payload };
    case Type.IS_FETCHING_CONVERSATION:
      return { ...state, isFetchingConversation: action.payload };
    default:
      return state;
  }
};

export default MessageCenter;
