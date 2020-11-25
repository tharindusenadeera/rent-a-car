import {
  SUPPORT_TICKET,
  SUPPORT_TICKETS,
  SUPPORT_TICKET_BOOKINGS
} from "../actions/ActionTypes";

const initialState = {
  ticket: null,
  tickets: {
    data: [],
    meta: null
  },
  ticketDocs: [],
  ticketBookings: [],
  ticketSuccessMsg: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SUPPORT_TICKET:
      return {
        ...state,
        ticket: action.payload
      };
    case SUPPORT_TICKETS:
      return {
        ...state,
        tickets: action.payload
      };
    case SUPPORT_TICKET_BOOKINGS:
      return {
        ...state,
        ticketBookings: action.payload
      };
    default:
      return state;
  }
};
