import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Input, Tooltip, Menu, Dropdown } from "antd";
import moment from "moment-timezone";
import {
  fetchMessages,
  fetchMessage,
  readThread,
  messageArchive
} from "../../../actions/MessageCenterAction";
import { MESSAGE, CONVERSATIONS } from "../../../actions/ActionTypes";
import checkAuth from "../../../components/requireAuth";
import Thread from "./Thread";
import "antd/lib/button/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/tooltip/style/index.css";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chat: null,
      threads: props.messages,
      searchText: null,
      hasMore: true,
      thread_type: "all",
      clicked: false
    };
  }

  // componentWillMount() {
  //   const { dispatch } = this.props;
  //   dispatch(fetchMessages());
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages != this.props.messages) {
      this.setState({ threads: nextProps.messages });
    }
  }

  menu = () => {
    const { thread_type } = this.state;
    return (
      <Menu onClick={e => this.handleMenu(e)}>
        <Menu.Item key="unread">
          <a target="_blank" rel="noopener noreferrer">
            Unread
          </a>
        </Menu.Item>
        <Menu.Item key="history">
          <a target="_blank" rel="noopener noreferrer">
            History
          </a>
        </Menu.Item>
        {thread_type !== "all" && (
          <Menu.Item key="all">
            <a target="_blank" rel="noopener noreferrer">
              Clear
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  handleMenu = e => {
    const { dispatch } = this.props;
    dispatch({
      type: MESSAGE,
      payload: {}
    });
    this.setState(
      { thread_type: e.key, disabled: !this.state.disabled, searchText: null },
      () => {
        this.loadThreads();
      }
    );
  };

  loadThreads = () => {
    const { dispatch } = this.props;
    const { thread_type } = this.state;
    if (thread_type != "all") {
      dispatch(fetchMessages({ thread_type: thread_type }));
    } else {
      dispatch(fetchMessages());
    }
  };

  handleConversation = data => {
    this.setState(
      {
        chat: data,
        clicked: !this.state.clicked
      },
      () => {
        this.props.onSelectConversation(data);
        //this.props.clicked(data.id);
      }
    );
  };

  searchCallBack = data => {
    const { messages } = this.props;
    this.setState({ searchText: data }, () => {
      var searchText = data.toUpperCase();
      var newArrayA = messages.filter(function(obj) {
        return (
          obj.details.data.car_name.toUpperCase().indexOf(searchText) > -1 ||
          obj.details.data.number.toUpperCase().indexOf(searchText) > -1
        );
      });
      if (!data) {
        this.setState({ threads: this.props.messages });
      } else {
        this.setState({ threads: newArrayA });
      }
    });
  };

  // makeTempMessage = (data, clickedTemp = false) => {
  //   const { dispatch, message } = this.props;
  //   if (message.length === 0 || clickedTemp === true) {
  //     dispatch({ type: CONVERSATIONS, payload: { data: [], meta: [] } });
  //     dispatch({ type: MESSAGE, payload: data });
  //   }
  // };

  sortedThread = () => {
    const { threads } = this.state;
    if (!threads) {
      return [];
    }
    let allTrheads = threads.sort((item1, item2) => {
      return moment(item2.last_message_at).diff(item1.last_message_at);
    });
    return allTrheads;
  };

  onSelectThread = (item, archiveClicked = false) => {
    const { onThreadSelect, dispatch, history, match } = this.props;
    const { thread_type } = this.state;

    this.setState(
      {
        clicked: !this.state.clicked
      },
      () => {
        this.props.clickedTab(item.id);
      }
    );

    if (!archiveClicked) {
      onThreadSelect(item);
      if (item.isTemp !== true) {
        dispatch(readThread(item.id, history.location.search));
      } else {
        dispatch({ type: CONVERSATIONS, payload: { data: [], meta: [] } });
        dispatch(
          fetchMessage(
            {
              detailable_type: "booking",
              detailable_id: match.params.id
            },
            history.location.search
          )
        );
      }
    } else {
      if (thread_type != "all") {
        dispatch(messageArchive(item.id, { thread_type: thread_type }));
      } else {
        dispatch(messageArchive(item.id));
      }
    }
  };

  render() {
    const { messages } = this.props;

    return (
      <div className="full-height-wrapper">
        <div className="chat-top-fixed">
          <div className="inline-blocks-horizontal-between-center chat-list-top-wrapper">
            <div className="cp-top-text drawer-text-md-semi">
              {messages && messages.length ? messages.length : "No"} Chats
            </div>
            <Tooltip placement="top">
              <Dropdown
                overlay={this.menu()}
                trigger={["click"]}
                placement="bottomRight"
                overlayClassName="drop-menus drop-down-sm"
              >
                <Button className="unstyled-btn more-options-btn hov-click">
                  <span className="icon-set-one-more-op-icon" />
                </Button>
              </Dropdown>
            </Tooltip>
          </div>
          <div className="chat-list-search">
            <img src="/images/message-center/search-icon-gray.png" />
            <Input
              placeholder="Search by booking ID or car name"
              onChange={e => this.searchCallBack(e.target.value)}
              value={this.state.searchText}
              autoComplete="off"
            />
          </div>
        </div>
        <div id="chat-list" className="chat-bottom">
          {this.sortedThread().map((item, key) => {
            return (
              <Thread
                key={key}
                archiveClicked={this.onSelectThread}
                item={item}
                message={this.props.message}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    messages: state.messageCenter.messages.data,
    authUser: state.user.user,
    meta: state.messageCenter.messages.meta,
    message: state.messageCenter.message
  };
};

export default connect(mapStateToProps)(withRouter(checkAuth(ChatList)));
