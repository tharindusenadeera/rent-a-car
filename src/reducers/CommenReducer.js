import {
  TOGGLE_DRAWER,
  TOGGLE_SUB_DRAWER,
  IS_FETCHING_V2,
  DONE_FETCHING_V2,
  TIME_ZONE,
  FIRST_LOADED_ROUTE,
  PAGE_NOT_FOUND,
  DELIVERY_LOCATIONS
} from "../actions/ActionTypes";
import moment from "moment-timezone";

const initialState = {
  timeZoneId: moment.tz.guess(),
  isDrawerOpen: false,
  isSubDrawerOpen: false,
  subDrawerName: null,
  isFetching: false,
  firstLoadedRoute: "",
  deliveryLocations: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return { ...state, isDrawerOpen: action.payload };
    case TOGGLE_SUB_DRAWER:
      return {
        ...state,
        isSubDrawerOpen: action.payload.isSubDrawerOpen,
        subDrawerName: action.payload.subDrawerName
      };
    case IS_FETCHING_V2:
      return { ...state, isFetching: true };
    case DONE_FETCHING_V2:
      return { ...state, isFetching: false };
    case TIME_ZONE:
      return { ...state, timeZoneId: action.payload };
    case FIRST_LOADED_ROUTE:
      return { ...state, firstLoadedRoute: action.payload };
    case PAGE_NOT_FOUND:
      return { ...state, pageNotFound: action.payload };
    case DELIVERY_LOCATIONS:
      return { ...state, deliveryLocations: action.payload };
    default:
      return state;
  }
}
