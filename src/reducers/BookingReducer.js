import {
  GET_BOOKING,
  GET_BOOKING_DATA,
  SHOW_BOOKING_REVIEW,
  GET_USERS_BOOKINS,
  MODAL_POPUP,
  IS_TRIP_FETCHING,
  TRANSACTION_FAILED,
  CARS_FROM_BOOKING,
  MULTIPLE_CREDIT_CARDS,
  ACTION_REQUIRED
} from "../actions/ActionTypes";

const initialState = {
  booking: {},
  bookingData: {
    item_price: null,
    delivery_charge: null,
    amount_charged: null,
    tax_amount: null,
    tax: null,
    car_coverage_level: 1,
    car_coverage_amount: null,
    car_availability: true
  },
  showBookingReview: false,
  transactionFailed: "",
  popUp: false,
  users_bookings: [],
  isBookingFetching: false,
  carsFromBookings: [],
  multipleCreditCard: [],
  actionRequired: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_BOOKING:
      return { ...state, booking: action.payload };
    case GET_BOOKING_DATA:
      return { ...state, bookingData: action.payload };
    case MODAL_POPUP:
      return { ...state, popUp: action.payload };
    case SHOW_BOOKING_REVIEW:
      return { ...state, showBookingReview: action.payload };
    case GET_USERS_BOOKINS:
      return { ...state, users_bookings: action.payload };
    case IS_TRIP_FETCHING:
      return { ...state, isBookingFetching: action.payload };
    case TRANSACTION_FAILED:
      return { ...state, transactionFailed: action.payload };
    case CARS_FROM_BOOKING:
      return { ...state, carsFromBookings: action.payload };
    case MULTIPLE_CREDIT_CARDS:
      return { ...state, multipleCreditCard: action.payload };
    case ACTION_REQUIRED:
      return { ...state, actionRequired: action.payload };
    default:
      return state;
  }
}
