import {
  UPDATE_PROFILE,
  RESET_PASSWORD,
  RESET_USER,
  FORGOT_PASSWORD,
  VERIFY_PHONE,
  VERIFY_PHONE_NUMBER,
  VERIFY_PHONE_LOGIN,
  GET_LOGGED_IN_USER,
  GET_MESSAGES,
  RECEIVER_ID,
  GET_BOOKING_LIST,
  ADD_MESSAGE,
  IS_FETCHING,
  DONE_FETCHING,
  CREDIT_CARD_VERIFICATION,
  COUPON_CODE_AVAILABILITY,
  COUPON_CODE_VALIDITY,
  COUPON_AMOUNT,
  REFERRAL_AVAILABLE,
  REF_CODE_VALIDITY,
  GET_REF_CODE,
  GET_USER_BALANCE,
  CREDIT_CARD_ERROR,
  RESEND_CODE_SUCCESS,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_ERROR,
  AUTHENTICATED,
  RATING_CATEGORIES,
  SIGNUP_ERROR,
  PHONE_VERIFICATION_ERROR,
  PHONE_VERIFICATION_RESEND,
  SIGNUP_FETCHING,
  PHONE_VERIFICATION_FETCHING,
  SIGNUP_FETCHED,
  AUTH_USER_REVIEWS,
  IS_FETCHING_V2,
  DONE_FETCHING_V2,
  NEW_PUBLIC_PROFILE_REVIEWS,
  ACCESSDENIED
} from "../actions/ActionTypes";

const initialState = {
  isFetching: false,
  authenticated: null,
  accessdenied: null,
  user: {
    id: null,
    first_name: null
  },
  referralAvailable: false,
  verifyPhone: false,
  verifyPhoneLogin: null,
  messages: [],
  receiverId: "",
  receiverList: [],
  bookingList: [],
  creditCardVerifaction: false,
  couponCodeAvailability: false,
  couponCodeValidity: null,
  refCodeValidity: "",
  phoneCodeValidity: "",
  refCode: "",
  userBalance: 0.0,
  couponAmount: 0,
  creditCard: null,
  forgotUserPassword: {
    error: null,
    message: null,
    status_code: null
  },
  resetPassword: {
    error: null,
    message: null,
    status_code: null,
    errors: []
  },
  phoneVerificationCode: null,
  newPhoneVerificationCode: null,
  isSignupFetching: null,
  isPhoneVerificationFetching: null,
  reting_categories: null,
  auth_user_reviews: null,
  isFetchingV2: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_FETCHING:
      return { ...state, isFetching: true };
    case DONE_FETCHING:
      return { ...state, isFetching: false };
    case AUTHENTICATED:
      return { ...state, authenticated: action.payload };
    case ACCESSDENIED:
      return { ...state, accessdenied: action.payload };
    case REFERRAL_AVAILABLE:
      return { ...state, referralAvailable: action.payload };
    case GET_REF_CODE:
      return { ...state, refCode: action.payload };
    case GET_USER_BALANCE:
      return { ...state, userBalance: action.payload };
    case GET_LOGGED_IN_USER:
      return { ...state, user: action.payload };
    case UPDATE_PROFILE:
      return { ...state, updateProfile: action.payload };
    case RESET_PASSWORD:
      return { ...state, resetPassword: action.payload };
    case RESET_USER:
      return { ...state, user: initialState.user };
    case FORGOT_PASSWORD:
      return { ...state, forgotUserPassword: action.payload };
    case VERIFY_PHONE:
      return { ...state, verifyPhone: action.payload };
    case VERIFY_PHONE_NUMBER: {
      return { ...state, verifyPhoneNumber: action.payload };
    }
    case VERIFY_PHONE_LOGIN:
      return { ...state, verifyPhoneLogin: action.payload };
    case GET_MESSAGES:
      return { ...state, messages: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case RECEIVER_ID:
      return { ...state, receiverId: action.payload };
    case GET_BOOKING_LIST:
      return { ...state, bookingList: action.payload };
    case CREDIT_CARD_VERIFICATION:
      return { ...state, creditCardVerifaction: action.payload };
    case COUPON_CODE_AVAILABILITY:
      return { ...state, couponCodeAvailability: action.payload };
    case COUPON_CODE_VALIDITY:
      return { ...state, couponCodeValidity: action.payload };
    case REF_CODE_VALIDITY:
      return { ...state, refCodeValidity: action.payload };
    case COUPON_AMOUNT:
      return { ...state, couponAmount: action.payload };
    case CREDIT_CARD_ERROR:
      return { ...state, creditCardError: action.payload };
    case RESEND_CODE_SUCCESS:
      return { ...state, resendCodeSuccess: action.payload };
    case SIGNUP_ERROR:
      return { ...state, user: action.payload, isSignupFetching: false };
    case PHONE_VERIFICATION_ERROR:
      return { ...state, verifyPhoneNumber: action.payload };
    case PHONE_VERIFICATION_RESEND:
      return {
        ...state,
        newPhoneVerificationCode: action.payload,
        isPhoneVerificationFetching: false
      };
    case SIGNUP_FETCHING:
      return { ...state, isSignupFetching: true };
    case SIGNUP_FETCHED:
      return { ...state, isSignupFetching: false };
    case PHONE_VERIFICATION_FETCHING:
      return { ...state, isPhoneVerificationFetching: true };
    case RATING_CATEGORIES:
      return { ...state, reting_categories: action.payload };
    case USER_UPDATE_SUCCESS:
      return { ...state, userUpdateSuccess: action.payload };
    case USER_UPDATE_ERROR:
      return { ...state, userUpdateError: action.payload };
    case AUTH_USER_REVIEWS:
      return { ...state, auth_user_reviews: action.payload };
    case IS_FETCHING_V2:
      return { ...state, isFetchingV2: true };
    case DONE_FETCHING_V2:
      return { ...state, isFetchingV2: false };
    case NEW_PUBLIC_PROFILE_REVIEWS:
      return { ...state, newPublicProfileReviews: action.payload };
    default:
      return state;
  }
}
