import {
  PROMOTION_FORM_ERROR,
  PROMOTION_POP_UP_CLOSED,
  REFERRAL_DATA
} from "../actions/ActionTypes";

const initialState = {
  registerToWin: {
    error: false,
    popUpIsColsed: true
  },
  referralData: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROMOTION_FORM_ERROR:
      return Object.assign(
        {},
        {
          ...state,
          registerToWin: {
            ...state.registerToWin,
            error: action.payload
          }
        }
      );
    case PROMOTION_POP_UP_CLOSED:
      return Object.assign(
        {},
        {
          ...state,
          registerToWin: {
            ...state.registerToWin,
            popUpIsColsed: action.payload
          }
        }
      );
    case REFERRAL_DATA:
      return {
        ...state,
        referralData: action.payload
      };
    default:
      return state;
  }
}
