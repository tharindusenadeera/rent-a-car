import { combineReducers } from "redux";
import car from "./CarReducer";
import user from "./UserReducer";
import booking from "./BookingReducer";
import promotion from "./PromotionReducer";
import common from "./CommenReducer";
import supportCenter from "./SupportCenterReducer";
import profile from "./ProfileReducer";
import messageCenter from "./MessageCenterReducer";

const reducers = {
  car,
  user,
  booking,
  promotion,
  common,
  supportCenter,
  profile,
  messageCenter
};

export default combineReducers(reducers);
