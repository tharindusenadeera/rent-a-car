import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Pusher from "pusher-js";
import _ from "lodash";
import queryString from "query-string";
import TopNavBar from "./TopNavBar";
import { logoutUser } from "../../actions/UserActions";
import * as Type from "../../actions/ActionTypes";
import { fetchUnreadNotification } from "../../actions/ProfileActions";
import {
  fetchMessages,
  hasMessages,
  setConversations
} from "../../actions/MessageCenterAction";
import { getLoggedInUser } from "../../actions/UserActions";
import NavBarDropDown from "../profile/NavBarDropDown";
import NavBarNotification from "../profile/NavBarNotification";

const $ = window.$;
$(document).click(function(event) {
  var clickover = $(event.target);
  if (document.getElementById("w3-collapse")) {
    var _opened = document.getElementById("w3-collapse").className;
    if (
      _opened === "navbar-collapse collapse in" &&
      !clickover.hasClass("navbar-toggle")
    ) {
      $("button.navbar-toggle").click();
    }
  }
});

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  encrypted: true,
  cluster: "ap1"
});

class MainNav extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      topNav: false
    };
    this.loadTopNav = this.loadTopNav.bind(this);
    if (this.props.authUser.id) {
      props.dispatch(fetchMessages({}, props.history.location.search));
      props.dispatch(hasMessages());
    }
  }
  componentDidMount() {
    const { dispatch, authUser } = this.props;
    if (authUser.id) {
      dispatch(fetchUnreadNotification());
      const messageThreadChannel = pusher.subscribe(
        `messageCenter-${authUser.id}`
      );
      messageThreadChannel.bind("message-posted", res => {
        this.setItems(res);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { authUser, dispatch, history } = this.props;
    if (authUser.id && prevProps.authUser.id != authUser.id) {
      const unreadSummaryChannel = pusher.subscribe(
        `notification-${authUser.id}`
      );
      unreadSummaryChannel.bind("unread-summary", data => {
        dispatch({
          type: Type.UNREAD_TAB_DATA,
          payload: data
        });
      });

      const messageThreadChannel = pusher.subscribe(
        `messageCenter-${authUser.id}`
      );
      messageThreadChannel.bind("message-posted", res => {
        this.setItems(res);
        dispatch(fetchMessages({}, history.location.search));
      });
    }

    if (prevProps.authUser.id != authUser.id) {
      dispatch(fetchMessages({}, history.location.search));
      dispatch(hasMessages());
    }
  }

  setItems = data => {
    const { conversations, message, dispatch, match, history } = this.props;
    dispatch(getLoggedInUser(false));
    if (
      match &&
      match.params &&
      match.params.tab &&
      match.params.tab == "message-center"
    ) {
      if (!_.isEmpty(message)) {
        if (
          message.id == data.thread.data.id &&
          message.id == data.conversation.data.conversational_thread_id
        ) {
          // dispatch(readThread(message.id,'Man nav'));
          data.conversation.data.is_auth_sender = false;
          conversations.data.push(data.conversation.data);
          dispatch(setConversations(conversations));
        }
      } else {
        dispatch(fetchMessages({}, history.location.search));
      }
    } else {
      dispatch(fetchMessages({}, history.location.search));
    }
  };

  loadTopNav() {
    if (this.state.topNav) {
      this.setState({ topNav: false });
    } else {
      this.setState({ topNav: true });
    }
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(logoutUser);
  }

  handleTopNavigation(para) {
    this.setState({ topNav: para });
  }

  render() {
    const { history, promoData } = this.props;

    return (
      <div>
        <div className="navbar-wrap">
          <div className="hidden-xs">
            {this.state.topNav ? (
              <TopNavBar
                navigationState={this.handleTopNavigation.bind(this)}
              />
            ) : (
              ""
            )}
          </div>

          <nav
            id="w3"
            className={
              "navbar-inverse customNavBar navbar " + this.props.cssClass
            }
          >
            <div className="container">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  <img alt="RYDE" src="/images/ryde-logo.png" />
                </Link>
                <div className="navbar-menuitems">
                  <div className="navbar-menuitems-mobile">
                    {this.props.user.id !== null && <NavBarDropDown />}
                  </div>
                  <div className="navbar-menuitems-mobile">
                    {this.props.user.id !== null && (
                      <NavBarNotification
                        user_id={this.props.user.id}
                        history={history}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    className="navbar-toggle"
                    data-toggle="collapse"
                    data-target="#w3-collapse"
                  >
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
              </div>
              <div
                id="w3-collapse"
                ref="mobile-menu"
                className="collapse navbar-collapse"
              >
                <ul id="w4" className="navbar-nav navbar-right nav main-nav">
                  {this.props.user.id === null ? (
                    <li>
                      <Link className="btn-listRyde" to="/list-your-car">
                        <span className="icon-btn-car-icon" /> LIST YOUR CAR
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link className="btn-listRyde" to="/car-create">
                        <span className="icon-btn-car-icon" /> LIST YOUR CAR
                      </Link>
                    </li>
                  )}

                  {this.props.user.id === null ? (
                    <li>
                      {!promoData ? (
                        <Link className="link signup" to="/signup">
                          Sign up
                        </Link>
                      ) : (
                        <Link
                          className="link signup"
                          to={{
                            pathname: "/signup",
                            search: queryString.stringify({
                              from: "promoindex",
                              ...promoData.citiesLocationData
                            })
                          }}
                        >
                          SIGN UP
                        </Link>
                      )}
                    </li>
                  ) : (
                    <li className="visible-xs main-nav-xs-logged" />
                  )}
                  {this.props.user.id === null ? (
                    <li>
                      {!promoData ? (
                        <Link className="login" to="/login">
                          Login
                        </Link>
                      ) : (
                        <Link className="login" to="/login">
                          LOG IN
                        </Link>
                      )}
                    </li>
                  ) : (
                    <li className="main-nav-xs-logged">
                      <div className="navbar-menuitems-web">
                        <NavBarDropDown />
                      </div>
                    </li>
                  )}
                  {this.props.user.id !== null ? (
                    <li className="main-nav-xs-logged">
                      <div className="navbar-menuitems-web">
                        <NavBarNotification
                          user_id={this.props.user.id}
                          history={history}
                        />
                      </div>
                    </li>
                  ) : null}

                  <li className="top-menu-button hidden-xs">
                    <a className="navIcon" onClick={this.loadTopNav}>
                      <span className="icon-menu-icon menuIcon" />
                    </a>
                  </li>

                  {/*used for mobile view only - need updated when update TopNavBar.js */}
                  <li className="visible-xs">
                    <a href="https://rydecarshelp.zendesk.com" target="_blank">How Ryde Works</a>
                  </li>
                  <li className="visible-xs">
                    <Link to="/safety">Safety</Link>
                  </li>
                  <li className="visible-xs">
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                  <li className="visible-xs">
                    <Link to="/about-us">About Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  authUser: state.user.user,
  messages: state.messageCenter.messages,
  message: state.messageCenter.message,
  conversations: state.messageCenter.conversations
});
export default connect(mapStateToProps)(withRouter(MainNav));
