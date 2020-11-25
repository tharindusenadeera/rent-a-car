import React from "react";
import { connect } from "react-redux";
import { Button, Progress, Input, notification } from "antd";
import moment from "moment-timezone";
import _ from "lodash";
import Pusher from "pusher-js";
import ScrollView from "react-inverted-scrollview";
import {
  sendMessage,
  setTyping,
  messageArchive,
  setConversations,
  fetchConversations,
  fetchMessages
} from "../../../actions/MessageCenterAction";
import { MESSAGES } from "../../../actions/ActionTypes";
import ConversationHeader from "./ConversationHeader";
import ChatSender from "./ChatSender";
import ChatReceiver from "./ChatReceiver";
import { compress } from "../../file-processing/lib/FileCompress";
import { fileUpload } from "../../file-processing/lib/FileUpload";
import {
  getExtension,
  getDocumentIcon
} from "../../../consts/commen-functions/";
import { DOCUMENT_TYPES } from "../../../consts/consts";
import WelcomeMessage from "./WelcomeMessage";
import PreLoader from "../../preloaders/preloaders";
import "antd/lib/button/style/index.css";
import "antd/lib/progress/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/notification/style/index.css";
import TextArea from "antd/lib/input/TextArea";

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  encrypted: true,
  cluster: "ap1"
});

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      typing: false,
      typing_user: "",
      typing_thread_id: null,
      textChanging: false,
      archive: "",
      files: [],
      hasMore: false,
      click: false,
      imgUploading: false
    };
  }

  removeTempAttachments = id => {
    const { files } = this.state;
    let newArray = files.filter(i => {
      return i.id != id;
    });
    this.setState({ files: newArray });
  };

  handleOwnMessage = () => {
    const { text, files } = this.state;
    if (!(text.replace(/ /g, "").length > 0 || files.length)) {
      return;
    }
    if (
      files.filter(i => {
        return i.uploading === true;
      }).length
    ) {
      return;
    }
    const { message, messages, dispatch, _conversation } = this.props;
    const changed = messages.data.filter(i => {
      return message.id == i.id;
    });
    const filterd = messages.data.filter(i => {
      return message.id != i.id;
    });
    if (!_.isEmpty(changed)) {
      changed[0].last_message_at = moment()
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
      filterd.push(changed[0]);
      messages.data = filterd;
      dispatch({
        type: MESSAGES,
        payload: messages
      });
    } else {
      dispatch(
        fetchMessages({
          page: 1
        })
      );
    }

    const newChat = {
      attachments: {
        data: files.map(i => {
          return {
            id: i.id,
            image_path: i.path,
            image_thumb: i.path
          };
        })
      },
      created_at: moment(),
      id: null,
      is_auth_sender: true,
      message: text,
      sender_id: 0,
      sender_name: "",
      sender_profile_image: "",
      sender_profile_image_thumb: ""
    };
    _conversation.data.push(newChat);
    dispatch(setConversations(_conversation));
    this.setState({ text: "", files: [] });
    dispatch(
      sendMessage(
        {
          detailable_type: "booking",
          detailable_id: message.detailable_id,
          message: text,
          attachments: this.setAttachment()
        },
        message.isTemp ? "new" : null
      )
    );
  };

  setAttachment = () => {
    const { files } = this.state;
    return files.map(i => {
      return { url: i.key, id: i.id };
    });
  };

  componentDidMount() {
    const { authUser } = this.props;
    this.timer = null;
    if (authUser.id) {
      const messageThreadChannel = pusher.subscribe(
        `messageCenter-${authUser.id}`
      );
      messageThreadChannel.bind("message-typing", data => {
        this.setState({
          typing: data.typing,
          typing_user: data.typing ? data.image_url : "",
          typing_thread_id: data.thread_id
        });
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;

    if (authUser.id && authUser.id !== prevProps.authUser.id) {
      const messageThreadChannel = pusher.subscribe(
        `messageCenter-${authUser.id}`
      );
      messageThreadChannel.bind("message-typing", data => {
        this.setState({
          typing: data.typing,
          typing_user: data.typing ? data.image_url : "",
          typing_thread_id: data.thread_id
        });
        setTimeout(() => {
          this.setState({ typing: false });
        }, 10000);
      });
    }
  }

  handleImgFile = (originalFile, fileName) => {
    compress(
      originalFile,
      `${fileName}.jpeg`,
      {
        width: 1440,
        height: 890,
        quality: 0.8
      },
      file => {
        this.setState({
          imgUploading: true
        });
        fileUpload(
          file,
          res => {
            this.afterUpload(res, fileName);
          },
          "tmp/message-center"
        );
      }
    );
  };

  handleDocFile = (file, fileName) => {
    fileUpload(
      file,
      res => {
        this.afterUpload(res, fileName);
      },
      "tmp/message-center"
    );
  };

  afterUpload = (res, fileName) => {
    const { files } = this.state;
    this.setState({
      imgUploading: false
    });
    let currentFile = files.find(i => {
      return i.id === fileName && i.key === null;
    });
    currentFile.path = res.location;
    currentFile.key = res.key;
    currentFile.uploading = false;
    this.setState({ files: files });
  };

  handleFileChange = ({ target }) => {
    const { files } = this.state;
    if (target.files && target.files.length > 0) {
      for (let index = 0; index < target.files.length; index++) {
        let originalFile = target.files[index];

        const currentTime = `${moment().valueOf()}_${index}`;
        files.push({
          file: originalFile,
          path: DOCUMENT_TYPES.includes(getExtension(originalFile.name))
            ? originalFile.name
            : URL.createObjectURL(originalFile),
          key: null,
          id: currentTime,
          uploading: true
        });
        this.setState({ files }, () => {
          if (DOCUMENT_TYPES.includes(getExtension(originalFile.name))) {
            this.handleDocFile(originalFile, currentTime);
          } else {
            this.handleImgFile(originalFile, currentTime);
          }
        });
      }
    }
    target.value = "";
  };

  onChangeText = e => {
    const { dispatch, message } = this.props;
    clearTimeout(this.timer);
    this.setState({ text: e.target.value });
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    if (this.state.textChanging === false) {
      dispatch(setTyping({ thread_id: message.id, typing: true }));
      this.setState({ textChanging: true });
    }
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY && e.shiftKey == false) {
      this.triggerChange();
      e.preventDefault(e);
      this.handleOwnMessage();
    }
  };

  triggerChange = () => {
    const { dispatch, message } = this.props;
    dispatch(setTyping({ thread_id: message.id, typing: false }));
    this.setState({ textChanging: false });
  };

  handleArchive = (type, data) => {
    const { dispatch } = this.props;
    dispatch(messageArchive(data));
    notification[type]({
      className: "archived-message-wrapper",
      message: "Message archived"
      // duration: 0,
    });
  };
  loadMore = i => {
    const { _conversation, dispatch, message } = this.props;

    if (message.isTemp === true) {
      return false;
    }
    const { meta } = _conversation;

    if (
      !Array.isArray(meta) &&
      meta.pagination.current_page == meta.pagination.total_pages
    ) {
      this.setState({ hasMore: false });
      return false;
    } else {
      this.setState({ hasMore: true });
    }
    if (!Array.isArray(meta)) {
      dispatch(
        fetchConversations(
          {
            thread_id: message.id,
            page: meta.pagination.current_page + 1
          },
          _conversation
        )
      );
    }
  };

  handleClick = () => {
    this.setState({
      click: !this.state.click
    });
  };

  render() {
    const {
      files,
      typing_user,
      typing,
      typing_thread_id,
      hasMore
    } = this.state;
    const { _conversation, message, authUser } = this.props;
    // console.log("_conversation", _conversation);

    if (
      _.isEmpty(message) &&
      _.isEmpty(_conversation) &&
      this.props.isFetchingConversation == false
    ) {
      return (
        <div id="chat">
          <WelcomeMessage />
        </div>
      );
    }
    if (
      _.isEmpty(message) &&
      _.isEmpty(_conversation) &&
      this.props.isFetchingConversation == true
    ) {
      return (
        <div id="chat">
          <div className="empty-screen-wrapper">
            <PreLoader />
          </div>
        </div>
      );
    }
    return (
      <div className="full-height-wrapper">
        <div className="con-top-fixed">
          {!_.isEmpty(message) && (
            <ConversationHeader
              message={message}
              onArchive={this.handleArchive}
              handleClick={this.handleClick}
              click={this.state.click}
            />
          )}
        </div>
        <div
          id="chat"
          className={`chat-person-wrapper con-bottom ${
            files.length ? "active-attachments-bar" : ""
          } `}
        >
          {_conversation.data && !_.isEmpty(message) && (
            <ScrollView
              width={"100%"}
              height={"100%"}
              style={{ paddingTop: 30, paddingBottom: 30 }}
              ref={ref => (this.scrollView = ref)}
              onScroll={this.handleScroll}
              // style={{ paddingBottom: 90 }}
            >
              {hasMore && <p style={{ textAlign: "center" }}>Loading....</p>}
              {_conversation.data.map((chat, index) => {
                if (chat.is_auth_sender) {
                  return (
                    <ChatSender
                      key={index}
                      message={chat}
                      thread_id={message.id}
                    />
                  );
                } else {
                  return (
                    <ChatReceiver
                      key={index}
                      message={chat}
                      thread_id={message.id}
                    />
                  );
                }
              })}
              {typing && typing_thread_id && typing_thread_id == message.id && (
                <div className="ch-cons-loading">
                  <div className="chat-person-left">
                    <img
                      className="pro-pic"
                      src={typing ? typing_user : " /images/defaultprofile.jpg"}
                    />
                  </div>
                  <div className="chat-person-right">
                    <div className="three-balls">
                      <div className="ball ball1" />
                      <div className="ball ball2" />
                      <div className="ball ball3" />
                    </div>
                  </div>
                </div>
              )}
            </ScrollView>
          )}
        </div>
        <div className="con-bottom-fixed">
          {files.length > 0 && (
            <div className="inline-blocks-vertical-center uploading-attachments">
              {files.map((file, index) => {
                return (
                  <div
                    key={index}
                    className={`uploading-attachments-inner ${
                      file.file.type &&
                      file.file.type.split("/")[0] == "application"
                        ? "doc-icon-wrapper"
                        : ""
                    }`}
                  >
                    {DOCUMENT_TYPES.includes(getExtension(file.file.name)) ? (
                      <img
                        className={
                          file.uploading === true
                            ? "img-responsive  uploading-img"
                            : "img-responsive"
                        }
                        src={getDocumentIcon(getExtension(file.file.name))}
                      />
                    ) : (
                      <img
                        className={
                          file.uploading === true
                            ? "img-responsive  uploading-img"
                            : "img-responsive"
                        }
                        src={file.path}
                      />
                    )}

                    {file.uploading === true ? (
                      <div className="progress-wrapper">
                        <Progress
                          strokeColor="#1CC185"
                          percent={100}
                          showInfo={false}
                          status="active"
                        />
                      </div>
                    ) : (
                      <Button
                        onClick={() => this.removeTempAttachments(file.id)}
                        className="unstyled-btn hov-click img-remove-btn"
                      >
                        <span className="icon-set-one-close-icon" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="inline-blocks-horizontal-between-center chat-type-bar-outer">
            <div className="inline-blocks-vertical-center chat-type-bar-left">
              <img
                className="pro-pic hidden-xs"
                src={
                  authUser.profile_image_thumb
                    ? authUser.profile_image_thumb
                    : "/images/defaultprofile.jpg"
                }
              />
              <TextArea
                value={this.state.text}
                onChange={e => this.onChangeText(e)}
                placeholder="Click here to reply"
                onKeyDown={this.handleKeyDown}
              />
            </div>
            <div className="inline-blocks-vertical-center chat-type-bar-right">
              <input
                type="file"
                style={{ visibility: "hidden", display: "none" }}
                maxLength="5"
                multiple={true}
                onChange={e => this.handleFileChange(e)}
                ref={fileUpload3 => {
                  this.fileUpload3 = fileUpload3;
                }}
              />
              <Button
                className="unstyled-btn hov-click"
                onClick={() => this.fileUpload3.click()}
              >
                <span className="icon-set-one-attachment-icon" />
              </Button>
              <Button
                className={`unstyled-btn ${
                  this.state.text ? "chat-send-active" : "chat-send-btn"
                }`}
                disabled={this.state.imgUploading == true}
                onClick={() => this.handleOwnMessage()}
              >
                <span className="icon-set-one-send-icon" />
                {files.filter(i => i.uploading === false).length ? (
                  <div className="attachments-count">
                    {files.filter(i => i.uploading === false).length < 10
                      ? files.filter(i => i.uploading === false).length
                      : "9+"}
                  </div>
                ) : (
                  ""
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  scrollToBottom() {
    if (!this.scrollView) return;
    this.scrollView.scrollToBottom();
  }

  scrollToTop() {
    if (!this.scrollView) return;
    this.scrollView.scrollToTop();
  }

  handleScroll = ({ scrollTop, scrollBottom }) => {
    if (scrollTop == 0) {
      this.loadMore();
    }
  };
}

const mapStateToProps = state => {
  return {
    message: state.messageCenter.message,
    messages: state.messageCenter.messages,
    authUser: state.user.user,
    _conversation: state.messageCenter.conversations,
    lastMessage: state.messageCenter.lastMessage,
    isFetchingConversation: state.messageCenter.isFetchingConversation
  };
};

export default connect(mapStateToProps)(Conversation);
