import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import _ from "lodash";
import { MESSAGE, MESSAGES, CONVERSATIONS } from "../../actions/ActionTypes";
import {
  fetchMessages,
  fetchConversations,
  fetchMessage
} from "../../actions/MessageCenterAction";
import ChatList from "./message-center/ChatList";
import Conversation from "./message-center/Conversation";
import PreLoader from "../../components/preloaders/preloaders";

class MessageCenterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: null,
      searchData: []
    };
  }

  componentWillMount() {
    const { navbarClick } = this.props;
    if (navbarClick.id != null) {
      this.handleClick(this.props.navbarClick.id.thread_id);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({ type: MESSAGES, payload: [] });
    dispatch({ type: MESSAGE, payload: {} });
    dispatch({ type: CONVERSATIONS, payload: [] });
  }

  componentDidUpdate(prevProps) {
    const { match, dispatch, history, messages } = this.props;

    if (history.location.search) {
      if (messages.data) {
        let checkIsExist = messages.data.find(item => {
          return parseInt(item.detailable_id) == parseInt(match.params.id);
        });
        if (!checkIsExist) {
          dispatch(fetchMessages({}, history.location.search));
        }
      }
    }
    if (
      match.params.id &&
      match.params.tab == "message-center" &&
      match.params.id != prevProps.match.params.id
    ) {
      dispatch(
        fetchMessage(
          {
            detailable_type: "booking",
            detailable_id: match.params.id
          },
          history.location.search
        )
      );
      dispatch(
        fetchConversations({
          detailable_type: "booking",
          detailable_id: match.params.id
        })
      );
    }
  }

  componentDidMount() {
    const { match, dispatch, history } = this.props;

    /**
     * Senarios
     * 1.  User come from inside booking with booking id
     * 2.  User come from home page clicked messege center link
     * 3.  User come from my profile tab navigation
     */
    /** Senarios One */
    if (match.params.id && match.params.tab == "message-center") {
      dispatch(
        fetchMessage(
          {
            detailable_type: "booking",
            detailable_id: match.params.id
          },
          history.location.search
        )
      );
      dispatch(
        fetchConversations({
          detailable_type: "booking",
          detailable_id: match.params.id
        })
      );
    }
  }

  handleThreadSelect = data => {
    const { dispatch, messages } = this.props;
    if (data.isTemp !== true) {
      dispatch(fetchMessage({ thread_id: data.id }));
      dispatch(fetchConversations({ thread_id: data.id }));
      const selectedMessage = messages.data.filter(i => {
        return i.id == data.id;
      });
      selectedMessage[0].unread_count = 0;
      const outhers = messages.data.filter(i => {
        return i.id != data.id;
      });
      outhers.push(selectedMessage[0]);
      messages.data = outhers;
      dispatch({ type: MESSAGES, payload: messages });
    }
  };

  handleClick = data => {
    if (data) {
      this.props.clickedTab(data);
    }
  };

  messageMobieleRender = () => {
    const { message, match } = this.props;
    if (match.params.id) {
      if (!Array.isArray(message) && _.isEmpty(message)) {
        return (
          <div style={{ height: "100vh" }}>
            <div className="preloader">
              <PreLoader />
            </div>
          </div>
        );
      }
      if (Array.isArray(message) || !_.isEmpty(message)) {
        return (
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <Conversation match={match} />
          </div>
        );
      }
      return (
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <ChatList
            onThreadSelect={this.handleThreadSelect}
            clickedTab={this.handleClick}
          />
        </div>
      );
    } else {
      if (!_.isEmpty(message)) {
        return (
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
            <Conversation match={match} />
          </div>
        );
      }
      return (
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <ChatList
            onThreadSelect={this.handleThreadSelect}
            clickedTab={this.handleClick}
          />
        </div>
      );
    }
  };

  render() {
    const { match } = this.props;

    return (
      <div>
        <div className="row">
          {isMobile ? (
            <Fragment>{this.messageMobieleRender()}</Fragment>
          ) : (
            <Fragment>
              <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <ChatList
                  onThreadSelect={this.handleThreadSelect}
                  clickedTab={this.handleClick}
                />
              </div>

              <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                <Conversation match={match} />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    messages: state.messageCenter.messages,
    message: state.messageCenter.message,
    hasMessages: state.messageCenter.hasMessages,
    navbarClick: state.profile.navBarClick
  };
};
export default connect(mapStateToProps)(MessageCenterContainer);
