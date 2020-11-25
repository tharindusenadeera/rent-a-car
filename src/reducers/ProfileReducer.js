import * as Type from "../actions/ActionTypes";

const initialState = {
  isFetching: false,
  updateSuccess: "",
  updateError: "",
  picUpdateSuccess: "",
  reviewsAboutMe: [],
  reviewsByMe: [],
  unreadTabData: [],
  notifications: [],
  navBarNotifications: [],
  userCars: [],
  userEranings: [],
  eraningsDetail: [],
  carsForEarnings: [],
  totalEranings: "",
  languageList: [],
  userCards: [],
  navBarClick: [],
  payoutHistory: [],
  userPayOuts: []
};

const Profile = (state = initialState, action) => {
  switch (action.type) {
    case Type.IS_FETCHING:
      return { ...state, isFetching: true };
    case Type.DONE_FETCHING:
      return { ...state, isFetching: false };
    case Type.UPDATE_SUCCESS:
      return { ...state, updateSuccess: action.payload };
    case Type.UPDATE_ERROR:
      return { ...state, updateError: action.payload };
    case Type.PROFILE_PIC_UPDATE_SUCCESS:
      return { ...state, picUpdateSuccess: action.payload };
    case Type.REVIEWS_ABOUT_ME:
      return { ...state, reviewsAboutMe: action.payload };
    case Type.REVIEWS_BY_ME:
      return { ...state, reviewsByMe: action.payload };
    case Type.UNREAD_TAB_DATA:
      return { ...state, unreadTabData: action.payload };
    case Type.NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    case Type.NAVBAR_NOTIFICATIONS:
      return { ...state, navBarNotifications: action.payload };
    case Type.USER_CARS:
      return { ...state, userCars: action.payload };
    case Type.CARS_FOR_EARNINGS:
      return { ...state, carsForEarnings: action.payload };
    case Type.USER_EARNINGS:
      return { ...state, userEranings: action.payload };
    case Type.EARNINGS_DETAIL:
      return { ...state, eraningsDetail: action.payload };
    case Type.TOTAL_EARNINGS:
      return { ...state, totalEranings: action.payload };
    case Type.LANGUAGE_LIST:
      return { ...state, languageList: action.payload };
    case Type.USERS_CARDS:
      return { ...state, userCards: action.payload };
    case Type.NAVBARNOTIFICATION_CLICK:
      return { ...state, navBarClick: action.payload };
    case Type.PAYOUT_HISTORY:
      return { ...state, payoutHistory: action.payload };
    case Type.USER_PAYOUTS:
      return { ...state, userPayOuts: action.payload };
    default:
      return state;
  }
};
export default Profile;
