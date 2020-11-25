import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Pusher from "pusher-js";
import ChatBox from "./ChatBox";
import ProfileSnippet from "./ProfileSnippet";
import InnerpageHeader from "../layouts/InnerPageHeader";
import {
  getMessages,
  getMessagesForBooking,
  getBookingList
} from "../../actions/UserActions";
import {
  ADD_MESSAGE,
  MESSAGES,
  MESSAGE,
  CONVERSATIONS
} from "../../actions/ActionTypes";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";

const pusher = new Pusher("8c7f4e09e2b5cef8614c", {
  encrypted: true
});

const channel = pusher.subscribe("message-center");

class MessageCenter extends Component {
  constructor() {
    super();
    this.state = {
      selectedBookingId: null,
      receiverId: ""
    };
    this.selectedMessages = this.selectedMessages.bind(this);
    this.messageThreads = this.messageThreads.bind(this);
    this.selectThread = this.selectThread.bind(this);
  }

  componentWillMount() {
    console.log("mounted");
    const { dispatch, bookingList } = this.props;
    dispatch(getBookingList());
    dispatch(getMessages());
  }

  // componentDidMount() {
  //   const { dispatch, user } = this.props;
  //   channel.bind("message-posted", function(data) {
  //     if (data.user_id != user.id && user.id) {
  //       dispatch({ type: ADD_MESSAGE, payload: data });
  //     }
  //   });
  // }

  componentWillUnmount() {
    const { dispatch } = this.props;
    console.log("unmounted");

    dispatch({ type: MESSAGES, payload: [] });
    dispatch({ type: MESSAGE, payload: {} });
    dispatch({ type: MESSAGE, payload: {} });
    dispatch({ type: CONVERSATIONS, payload: [] });
  }

  getBookingObject(bookingList, bookingId) {
    if (bookingId == null) {
      bookingId = bookingList[0].id;
    }
    const booking = bookingList.filter(booking => {
      return booking.id == bookingId ? booking : null;
    });
    return booking[0];
  }

  selectThread(id) {
    const { dispatch } = this.props;
    dispatch(getMessagesForBooking(id));
    this.setState({ selectedBookingId: id });
  }

  messageThreads() {
    const { bookingList, receiverId, user } = this.props;
    if (bookingList.length && user.id) {
      // must show the profile of the other user not logged in user
      return bookingList.map((booking, key) => {
        return (
          <ProfileSnippet
            active={
              (this.state.selectedBookingId == null && key == 0) ||
              this.state.selectedBookingId == booking.id
                ? "active-chat-profile"
                : null
            }
            key={booking.id}
            bookingId={booking.id}
            car={booking.car}
            createdDate={booking.created_at}
            receiver={
              booking.user_id == user.id ? booking.car.car_owner : booking.user
            }
            selectThread={this.selectThread}
            booking={booking}
          />
        );
      });
    } else {
      return [];
    }
  }

  selectedMessages() {
    const { messages, bookingList } = this.props;
    // if booking id is selected return only the messages for the booking id or return only the last bookings messages
    if (messages.length && this.state.selectedBookingId == null) {
      return messages.filter(message => {
        if (message.booking_id == bookingList[0].id) {
          return message;
        }
      });
    } else if (messages.length) {
      return messages.filter(message => {
        if (message.booking_id == this.state.selectedBookingId) {
          return message;
        }
      });
    } else {
      return [];
    }
  }

  selectedProfile() {
    const { bookingList, receiverId, user } = this.props;
    if (bookingList.length && user.id) {
      // must show the profile of the other user not logged in user
      return bookingList.map((booking, key) => {
        if (this.state.selectedBookingId == null && key == 0) {
          return (
            <ProfileSnippet
              active={null}
              key={booking.id}
              bookingId={booking.id}
              car={booking.car}
              createdDate={booking.created_at}
              receiver={
                booking.user_id == user.id
                  ? booking.car.car_owner
                  : booking.user
              }
              selectThread={this.selectThread}
              booking={booking}
            />
          );
        } else if (this.state.selectedBookingId == booking.id) {
          return (
            <ProfileSnippet
              active={null}
              key={booking.id}
              bookingId={booking.id}
              car={booking.car}
              createdDate={booking.created_at}
              receiver={
                booking.user_id == user.id
                  ? booking.car.car_owner
                  : booking.user
              }
              selectThread={this.selectThread}
              booking={booking}
            />
          );
        }
      });
    } else {
      return [];
    }
  }

  render() {
    const { receiverId, bookingList, messages, user } = this.props;
    return (
      <Fragment>
        <MainNav />
        <InnerpageHeader header="MESSAGE CENTER" title="Message Center" />
        <div className="chat-view container">
          <br />
          <div className="go-back">
            <Link to="/profile">Go Back</Link>
          </div>
          <br />
          <div className="row">
            <div className="col-md-8 col-md-push-4">
              <div className="panel ">
                <div className="panel-heading msgcnt_panelhead">&nbsp;</div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-sm-8 col-md-8">
                          {this.selectedProfile()}
                        </div>
                      </div>
                      {bookingList.length ? (
                        <ChatBox
                          user={user}
                          booking={this.getBookingObject(
                            bookingList,
                            this.state.selectedBookingId
                          )}
                          selectedMessages={this.selectedMessages()}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-md-pull-8">
              <div className="panel ">
                <div className="panel-heading msgcnt_panelhead">
                  ALL MESSAGES
                </div>
                <div className="panel-body msgcnt_panelbody">
                  <div className="row">
                    <div className="col-md-12">{this.messageThreads()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.user.messages,
    receiverId: state.user.receiverId,
    bookingList: state.user.bookingList,
    user: state.user.user
  };
};

export default connect(mapStateToProps)(MessageCenter);
