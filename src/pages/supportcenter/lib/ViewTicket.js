import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../../consts/consts";
import ModalPopUp from "react-modal";
import axios from "axios";
import moment from "moment";
import { Upload, Input } from "antd";
import Lightbox from "react-images";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import Image from "react-shimmer";
import { SUPPORT_TICKET } from "../../../actions/ActionTypes";
import { fetchTicketV2 } from "../../../actions/SupportCenterActions";
import DocumentGallery from "../../../components/supportcenter/DocumentGallery";
import DeleteBtn from "../../../components/supportcenter/DeleteBtn";
import TicketStatus from "../../../components/supportcenter/TicketStatus";
import SuccessPopUp from "../../../components/supportcenter/SuccessPopUp";
import Pusher from "pusher-js";
import checkAuth from "../../../components/requireAuth";
import checkPermission from "../../../components/requirePermission";
import ConfirmationButton from "../../../components/supportcenter/ConfirmationButton";
import { fileUpload } from "../../../components/file-processing/lib/FileUpload";
import { compress } from "../../../components/file-processing/lib/FileCompress";
import MainNav from "../../../components/layouts/MainNav";
import MainFooter from "../../../components/layouts/MainFooter";
import PreLoader from "../../../components/preloaders/preloaders";

import "antd/lib/upload/style/index.css";
import "antd/lib/input/style/index.css";

ModalPopUp.setAppElement("#root");

// status
// -1 => withdrawn, 1 => resolved, 0 => waiting for review,
// 2 => under review, 5 => accepted, 6 => declined

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  encrypted: true,
  cluster: "ap1"
});

const { TextArea } = Input;

class ViewTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketId: props.match.params.id,
      messages: [],
      message: "",
      fileList: {},
      carCheckoutPhotos: [],
      readMore: false,
      ticketDescription: "",
      withdrawing: false,
      resolving: false,
      showModelSuccess: false,
      showDeclineReasonModel: false,
      attachments: [],
      uploading: false,
      previewImages: [],
      lightboxIsOpen: false,
      currentImage: 0,
      errObj: {}
    };
  }

  componentDidMount() {
    const { dispatch, match, authenticated } = this.props;
    const channel = pusher.subscribe(`supportTicket-${match.params.id}`);
    channel.bind("message-posted", data => {
      this.fetchMessages();
    });
    const { ticketId } = this.state;
    if (authenticated !== false) {
      dispatch(fetchTicketV2(ticketId));
      this.fetchMessages();
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: SUPPORT_TICKET,
      payload: null
    });
  }

  componentWillReceiveProps(nextProps) {
    const { ticket, history } = nextProps;

    if (ticket) {
      (ticket.detailable_type === "general" ||
        ticket.detailable_type === "urgent_matter") &&
        this.setTicketDescription(ticket.detailable.description);

      let docs = [];
      let images = [];
      ticket.support_ticket_attachments.map(file => {
        const url = file.image_path.toLowerCase();
        if (url.match(/\.(jpeg|jpg|png|webp)$/) === null) {
          const type = this.getExtension(file.image_path).toLowerCase();
          const data = {
            src: file.image_path,
            type: type
          };
          docs.push(data);
        } else {
          const data = {
            uid: file.id,
            name: "",
            status: "done",
            url: file.image_path
          };
          images.push(data);
        }
      });
      this.setState({ fileList: { docs, images } });

      if (ticket.car_checkout_photos) {
        let carCheckoutPhotos = [];
        ticket.car_checkout_photos.map(img => {
          carCheckoutPhotos.push({
            uid: img.id,
            name: img.booking_id,
            status: "done",
            url: img.image_path
          });
        });
        this.setState({ carCheckoutPhotos });
      }
    }
  }

  updateTicket = status => {
    const { dispatch } = this.props;
    const { ticketId } = this.state;
    const data = {
      status: status
    };
    if (status === -1) {
      this.setState({ withdrawing: true });
    }
    if (status === 1) {
      this.setState({ resolving: true });
    }
    return axios
      .patch(
        `${process.env.REACT_APP_API_URL}support-ticket/${ticketId}`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        if (!res.data.error) {
          this.setState({ showModelSuccess: true, message: res.data.message });
          if (status === -1) {
            this.setState({ withdrawing: false, message: "" });
          }
          if (status === 1) {
            this.setState({ resolving: false, message: "" });
          }
        }
        dispatch(fetchTicketV2(ticketId, false));
      })
      .catch(err => {
        console.log("err", err);
      });
  };

  deleteTicketConfirm = ticketId => {
    return axios
      .delete(`${process.env.REACT_APP_API_URL}support-ticket/${ticketId}`, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(res => {
        if (!res.data.error) {
          this.props.history.push(`/my-profile/support-center`);
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  };

  deleteTicketCancel = () => {
    console.log("cancel");
  };

  handleSubmit = () => {
    const { message, ticketId, attachments } = this.state;
    const { dispatch } = this.props;
    const data = {
      message: message,
      reference_id: ticketId,
      reference_type: "support_ticket",
      attachments: attachments
    };
    this.setState({ message: "", attachments: [] });
    return axios
      .post(`${process.env.REACT_APP_API_URL}user-messages`, data, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(() => {
        this.fetchMessages();
        dispatch(fetchTicketV2(ticketId, false));
      })
      .catch(err => {
        console.log("err", err);
      });
  };

  fetchMessages = () => {
    const { ticketId } = this.state;
    const ticketType = "support_ticket";
    return axios
      .get(
        `${process.env.REACT_APP_API_URL}user-messages?reference_id=${ticketId}&reference_type=${ticketType}&include=attachments`,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        this.setState({ messages: res.data.userMessages.data });
      })
      .catch(err => {
        console.log("err", err);
      });
  };

  updateFileStatus = data => {
    const { attachments } = this.state;
    const file_name = data.key
      .split("/")
      .pop()
      .substring(10, data.key.length);
    attachments.push({
      url: data.location,
      thumb: data.location,
      name: file_name
    });
    this.setState({ attachments, uploading: false });
  };

  updateDocStatus = data => {
    const { attachments } = this.state;
    const file_name = data.key.split("/").pop();
    attachments.push({
      url: data.location,
      thumb: data.location,
      name: file_name
    });
    this.setState({ attachments, uploading: false });
  };

  getCompressedFile = file => {
    fileUpload(file, this.updateFileStatus, "tmp/support-center");
  };

  handleUpload = e => {
    const { attachments, errObj } = this.state;
    const ext = this.getExtension(e.target.files[0].name);
    let file = e.target.files[0];
    const nameFile = "";
    delete errObj.upload;
    if (ext) {
      this.setState({ uploading: true });
      if (file.type.split("/")[0] === "image") {
        const settings = {
          width: 1440,
          height: 890,
          quality: 0.8
        };
        compress(file, nameFile, settings, this.getCompressedFile);
      } else {
        fileUpload(file, this.updateDocStatus, "tmp/support-center");
      }
    } else {
      let errObj = {};
      errObj.upload = "Invalid type of document!";
      this.setState({
        errObj: errObj
      });
    }
  };

  removeAttachment = img => {
    const { attachments } = this.state;
    let newList = attachments.filter(item => {
      return item.name != img;
    });

    this.setState({ attachments: newList });
  };

  handlePreview = (file, type) => {
    const { fileList, carCheckoutPhotos } = this.state;
    let srcSet = [];
    if (type === "attachments") {
      fileList.images.map((image, index) => {
        if (image.url === file.url) {
          this.setState({ currentImage: index });
        }
        srcSet.push({
          src: image.url,
          caption: image.url.split("/").pop()
        });
      });
      this.lightboxPreview(srcSet);
    }
    if (type === "checkoutphotos") {
      carCheckoutPhotos.map((image, index) => {
        if (image.url === file.url) {
          this.setState({ currentImage: index });
        }
        srcSet.push({
          src: image.url,
          caption: image.url.split("/").pop()
        });
      });
      this.lightboxPreview(srcSet);
    }
    if (type === "message") {
      this.setState({ currentImage: file.index });
      file.srcSet.map(image => {
        srcSet.push({
          src: image.src,
          caption: image.src.split("/").pop()
        });
      });
      this.lightboxPreview(srcSet);
    }
  };

  // Lightbox functions

  lightboxPreview = data => {
    if (data[0].src.toLowerCase().match(/\.(jpeg|jpg|png|webp)$/) === null) {
      window.open(data[0].src, "_blank");
    } else {
      this.setState({
        previewImages: data,
        lightboxIsOpen: true
      });
    }
  };

  lightboxNext = () => {
    this.setState({ currentImage: this.state.currentImage + 1 });
  };

  lightboxPrev = () => {
    this.setState({ currentImage: this.state.currentImage - 1 });
  };

  getExtension = path => {
    let basename = path.split(/[\\/]/).pop();
    let pos = basename.lastIndexOf(".");
    if (basename === "" || pos < 1) {
      return "";
    } else {
      return basename.slice(pos + 1);
    }
  };

  setHeaderIcon = type => {
    switch (type) {
      case "general":
        return (
          <img
            alt="status-icon"
            className="icon"
            src="/images/support-center/gen-icon.svg"
          />
        );
      case "urgent_matter":
        return (
          <img
            alt="status-icon"
            className="icon"
            src="/images/support-center/urgent-icon.svg"
          />
        );
      case "damage_report":
        return (
          <img
            alt="status-icon"
            className="icon"
            src="/images/support-center/damage-icon.svg"
          />
        );
      default:
        return (
          <img
            alt="status-icon"
            className="icon"
            src="/images/support-center/gen-icon.svg"
          />
        );
    }
  };

  setTicketDescription = str => {
    if (str.length > 200) {
      this.setState({ ticketDescription: str.substring(0, 200) + " . . ." });
    } else {
      this.setState({ ticketDescription: str });
    }
  };

  handleReadMore = () => {
    const { ticket } = this.props;
    const { readMore } = this.state;
    if (ticket) {
      if (!readMore) {
        this.setState({
          ticketDescription: ticket.detailable.description
        });
      } else {
        this.setState({
          ticketDescription:
            ticket.detailable.description.substring(0, 200) + " . . ."
        });
      }
    }
    this.setState({ readMore: !this.state.readMore });
  };

  render() {
    const { ticket, history, isFetching } = this.props;
    const {
      ticketId,
      message,
      messages,
      fileList,
      carCheckoutPhotos,
      withdrawing,
      resolving,
      showModelSuccess,
      attachments,
      uploading,
      errObj
    } = this.state;

    if (ticket === null) {
      return (
        <Fragment>
          <MainNav />
          <div className="container" style={{ minHeight: "80vh" }}>
            <PreLoader />
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <MainNav />
        <div className="container" style={{ minHeight: "80vh" }}>
          {/* Back Links */}
          <div className="row">
            <div className="col-md-12">
              <div className="SC_backlink SC_backlink_def">
                <div className="SC_backlink_box">
                  <Link to="/">Home</Link>
                </div>
                <div className="SC_backlink_iconbox">
                  <img src="/images/support-center/bclinks-arrow.png" />
                </div>
                <div className="SC_backlink_box">
                  <Link to="/my-profile">Profile</Link>
                </div>
                <div className="SC_backlink_iconbox">
                  <img src="/images/support-center/bclinks-arrow.png" />
                </div>
                <div className="SC_backlink_box">
                  <a onClick={() => history.goBack()}>Support Connect</a>
                </div>
                <div className="SC_backlink_iconbox">
                  <img src="/images/support-center/bclinks-arrow.png" />
                </div>
                <div className="SC_backlink_box">{ticket && ticket.number}</div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div>
            <div className="row">
              <div className="col-xs-12 col-md-12">
                <div
                  className={
                    ticket &&
                    (ticket.detailable_type === "general"
                      ? "SC_page_title gen"
                      : ticket.detailable_type === "urgent_matter"
                      ? "SC_page_title urgent"
                      : ticket.detailable_type === "damage_report" &&
                        "SC_page_title damage")
                  }
                >
                  <div className="SC_page_dtitle">
                    <div className="ticket_details">
                      Ticket number : {ticket && ticket.number}
                    </div>
                    <div className="">
                      {ticket && <TicketStatus status={ticket.status} />}
                    </div>
                  </div>
                  {ticket && this.setHeaderIcon(ticket.detailable_type)}
                </div>
              </div>
            </div>
          </div>
          {/* Page Header */}

          {/* Page Body */}
          <div className="SC_page_body row">
            <div style={{ padding: "0px 15px" }}>
              {ticket &&
                (ticket.detailable.status === 5 || ticket.status === 1) &&
                ticket.ticket_message !== "" && (
                  <div className="SC_msg_success" style={{ display: "flex" }}>
                    <div className="icon" style={{ minWidth: "15px" }}>
                      <img src="/images/support-center/sucess_icon.svg" />
                    </div>
                    <div className="text">{ticket.ticket_message}</div>
                  </div>
                )}
              {ticket &&
                (ticket.detailable.status === 6 ||
                  ticket.detailable.status === 7 ||
                  ticket.detailable.status === 0) &&
                ticket.ticket_message !== "" && (
                  <div className="SC_msg_warning" style={{ display: "flex" }}>
                    <div className="icon" style={{ minWidth: "15px" }}>
                      <img src="/images/support-center/status_message_icon.svg" />
                    </div>
                    <div className="text">{ticket.ticket_message}</div>
                  </div>
                )}
            </div>
            {/* Section start here */}
            {ticket && (ticket.status === 0 || ticket.status === 2) && (
              <div className="col-xs-12 col-md-8">
                <div className="SC_chat">
                  {message == "" && (
                    <div>
                      <input
                        type="file"
                        name="newfile"
                        className="SC_chat_attach_btn"
                        onChange={this.handleUpload}
                      />
                    </div>
                  )}

                  <div className="SC_chat_field">
                    <TextArea
                      name="chat"
                      className="field"
                      placeholder="Click here to reply"
                      value={message}
                      onChange={e => this.setState({ message: e.target.value })}
                      autosize
                    />
                  </div>
                </div>

                {(message !== "" || attachments.length > 0) &&
                  uploading === false && (
                    <div className="SC_chat-inner">
                      <div>
                        {message !== "" && uploading === false && (
                          <div className="attachm-btn">
                            <input
                              type="file"
                              name="newfile"
                              className="SC_chat_attach_btn"
                              onChange={this.handleUpload}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        {(message !== "" || attachments.length > 0) &&
                          uploading === false && (
                            <button
                              type="button"
                              className="btn SC_btn SC_btn_submit chat"
                              onClick={this.handleSubmit}
                            >
                              REPLY
                            </button>
                          )}
                      </div>
                    </div>
                  )}

                {errObj.upload && (
                  <div className="GC_form_error">{errObj.upload}</div>
                )}

                {/* Attachment View */}
                <div>
                  {uploading && (
                    <div className="SC_upload_notification">
                      <a href="#">
                        <span>Uploding.....</span>
                      </a>
                      <a href="#">
                        <img src="/images/support-center/msg_mini_close.svg" />
                      </a>
                    </div>
                  )}
                  {/* File */}
                  {attachments.map((item, index) => {
                    return (
                      <div className="SC_upload_notification" key={index}>
                        <a href="#">
                          <span>{item.name}</span>
                        </a>
                        <a onClick={() => this.removeAttachment(item.name)}>
                          <img src="/images/support-center/msg_mini_close.svg" />
                        </a>
                      </div>
                    );
                  })}

                  {/* File */}
                </div>

                {/* Waiting for Review - Warning Message */}
                {ticket && (
                  <div className="row">
                    <div className="col-xs-12 col-md-12">
                      {ticket.detailable.status === 6 && (
                        <div className="SC_review_btnbox">
                          <button
                            type="button"
                            className="btn SC_btn_create msgbtn"
                            onClick={() =>
                              this.setState({ showDeclineReasonModel: true })
                            }
                          >
                            View decline reason
                          </button>
                        </div>
                      )}
                      <div className="SC_chat_message">
                        <div className="SC_chat_message_btn">
                          {/* Delete */}
                          {ticket.status === 0 && (
                            <DeleteBtn
                              deleteConfirm={() =>
                                this.deleteTicketConfirm(ticketId)
                              }
                              deleteCancel={this.deleteTicketCancel}
                              size={16}
                            />
                          )}
                          {ticket &&
                            (ticket.status === 0 || ticket.status === 2) &&
                            ticket.detailable.status !== 5 && (
                              <ConfirmationButton
                                type="button"
                                className="btn SC_btn SC_btn_withdraw"
                                onClick={() => this.updateTicket(-1)}
                                confirmationMessage="Are you sure you want to withdraw ?"
                              >
                                {withdrawing && (
                                  <PreloaderIcon
                                    style={{ paddingRight: "5px" }}
                                    loader={Oval}
                                    size={20}
                                    strokeWidth={8} // min: 1, max: 50
                                    strokeColor="#fff"
                                    duration={800}
                                  />
                                )}
                                {withdrawing ? "WITHDRAWING" : "WITHDRAW"}
                              </ConfirmationButton>
                            )}
                          {ticket &&
                            (ticket.status === 0 || ticket.status === 2) && (
                              <ConfirmationButton
                                type="button"
                                className="btn SC_btn SC_btn_submit"
                                onClick={() => this.updateTicket(1)}
                                confirmationMessage="Are you sure you want to mark this as resolved ?"
                              >
                                {resolving && (
                                  <PreloaderIcon
                                    style={{ paddingRight: "5px" }}
                                    loader={Oval}
                                    size={20}
                                    strokeWidth={8} // min: 1, max: 50
                                    strokeColor="#fff"
                                    duration={800}
                                  />
                                )}
                                {resolving ? "RESOLVING" : "RESOLVE"}
                              </ConfirmationButton>
                            )}
                        </div>
                      </div>

                      {ticket.status === 1 && messages.length > 0 && (
                        <div>
                          <div className="name SC_chat_conv_title">
                            Your Conversation With RYDE
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Waiting for Review - Warning Message */}

                <div className="SC_chatthread">
                  {/* chat thraead start */}
                  {messages &&
                    messages.map((message, index) => {
                      let srcSet = [];
                      const user_type = message.sender.data.user_type;
                      if (
                        user_type === "admin" ||
                        user_type === "super_admin"
                      ) {
                        // User
                        return (
                          <div className="SC_chatbox" key={`${index}-user`}>
                            <div className="tic-pro-pic">
                              <img
                                src="/images/support-center/ryde_chat_icon.svg"
                                width="100%"
                              />
                            </div>
                            <div className="content">
                              <div>
                                <span className="name">RYDE Team</span>
                                <span className="date">
                                  {moment
                                    .utc(message.created_at.date)
                                    .local()
                                    .format("MMMM DD, YYYY hh:mm a")}
                                </span>
                              </div>
                              {message && message.message && (
                                <div className="txt">{message.message}</div>
                              )}
                              <div>
                                {/* Attachment */}
                                <div className="attachment-outer">
                                  {message.attachments.data.length > 0 &&
                                    message.attachments.data.map((img, key) => {
                                      let name = img.image_path
                                        .split("/")
                                        .pop();
                                      let isImg = img.image_path
                                        .toLowerCase()
                                        .match(/\.(jpeg|jpg|png|webp)$/);
                                      if (isImg !== null) {
                                        srcSet.push({
                                          src: img.image_path
                                        });
                                      }
                                      return (
                                        <div
                                          className="SC_view_attach"
                                          key={key}
                                        >
                                          {isImg === null ? (
                                            <a
                                              href={img.image_path}
                                              target="_blank"
                                              title={name}
                                            >
                                              <img src="/images/support-center/error_icon_mini.svg" />
                                              <span>{name}</span>
                                            </a>
                                          ) : (
                                            <a
                                              onClick={() =>
                                                this.handlePreview(
                                                  {
                                                    srcSet: srcSet,
                                                    index: key
                                                  },
                                                  "message"
                                                )
                                              }
                                              title={name}
                                            >
                                              <img src="/images/support-center/error_icon_mini.svg" />
                                              <span>{name}</span>
                                            </a>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      if (user_type === "user") {
                        // RYDE
                        return (
                          <div
                            className="SC_chatbox SC_chatbox_host"
                            key={`${index}-admin`}
                          >
                            <div className="content">
                              <div>
                                <span className="name">
                                  {message.sender.data.first_name}
                                </span>
                                <span className="date">
                                  {moment
                                    .utc(message.created_at.date)
                                    .local()
                                    .format("MMMM Do, YYYY hh:mm a")}
                                </span>
                              </div>
                              <div className="txt">
                                {message.message && message.message}
                              </div>
                              {/* Attachment */}
                              <div>
                                {message.attachments.data.length > 0 &&
                                  message.attachments.data.map((img, key) => {
                                    let name = img.image_path.split("/").pop();
                                    let isImg = img.image_path
                                      .toLowerCase()
                                      .match(/\.(jpeg|jpg|png|webp)$/);
                                    if (isImg !== null) {
                                      srcSet.push({
                                        src: img.image_path
                                      });
                                    }
                                    return (
                                      <div
                                        className="SC_view_attach"
                                        key={key}
                                        style={{ float: "right" }}
                                      >
                                        {isImg === null ? (
                                          <a
                                            href={img.image_path}
                                            target="_blank"
                                            title={name}
                                          >
                                            <img src="/images/support-center/error_icon_mini.svg" />
                                            <span>{name}</span>
                                          </a>
                                        ) : (
                                          <a
                                            onClick={() =>
                                              this.handlePreview(
                                                {
                                                  srcSet: srcSet,
                                                  index: key
                                                },
                                                "message"
                                              )
                                            }
                                            title={name}
                                          >
                                            <img src="/images/support-center/error_icon_mini.svg" />
                                            <span>{name}</span>
                                          </a>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="tic-pro-pic">
                              <Image
                                className="img-circle"
                                src={message.sender.data.profile_image_thumb}
                                width={50}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </div>
                        );
                      }
                    })}
                  {/* chat thread end */}
                </div>
              </div>
            )}
            {/* Section end here */}
            {/* Side */}
            <div
              className={
                ticket && (ticket.status === 0 || ticket.status === 2)
                  ? "col-xs-12 col-md-4"
                  : "col-xs-12 col-md-12"
              }
            >
              <div className="SC_history">
                {ticket && ticket.detailable_type !== "general" && (
                  <div className="head">
                    Booking Number : {ticket.booking_number}
                  </div>
                )}
                <div className="head">Summary</div>
                {/* If Genaral or Urgent */}
                {ticket &&
                  (ticket.detailable_type === "general" ||
                    ticket.detailable_type === "urgent_matter") && (
                    <div>
                      <div className="detail">
                        {this.state.ticketDescription}
                      </div>
                      {ticket.detailable.description.length > 200 && (
                        <button
                          onClick={this.handleReadMore}
                          className="btn SC_btn_view"
                        >
                          {this.state.readMore ? "Read less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}
                {/* If Genaral or Urgent */}

                {/* IF Damage Reoport */}
                {ticket && ticket.detailable_type === "damage_report" && (
                  <div>
                    <div className="detail">
                      <div className="qst">Location of the incident ?</div>
                      <div className="answer">
                        {ticket.detailable.location_status === 0
                          ? "No"
                          : ticket.detailable.location &&
                            ticket.detailable.location}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">How did the incident happen ?</div>
                      <div className="answer">
                        {ticket.detailable.incident_status === 0
                          ? "No"
                          : ticket.detailable.incident &&
                            ticket.detailable.incident}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">
                        Was there a 3rd party involved ?
                      </div>
                      <div className="answer">
                        {ticket.detailable.third_party_status === 0
                          ? "No"
                          : ticket.detailable.third_party_status === 2
                          ? "Don’t know"
                          : ticket.detailable.third_party_status === 1 && "Yes"}
                      </div>
                      <div className="answer">
                        {ticket.detailable.third_party_status === 1 &&
                          ticket.third_party &&
                          ticket.third_party}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">
                        Do you have an estimate for damages ?
                      </div>
                      <div className="answer">
                        {ticket.detailable.estimate_status === 0
                          ? "No"
                          : ticket.detailable.estimate_amount &&
                            "$ " + ticket.detailable.estimate_amount}
                      </div>
                    </div>

                    {ticket.detailable.estimate_status === 1 && (
                      <div className="detail">
                        <div className="qst">How was it estimated ?</div>
                        <div className="answer">
                          {ticket.detailable.estimate_type === 1
                            ? "Estimated by a body shop"
                            : ticket.detailable.estimate_type === 2
                            ? "Own experience"
                            : ticket.detailable.estimate_type === 3 &&
                              "An assumption"}
                        </div>
                      </div>
                    )}

                    <div className="detail">
                      <div className="qst">
                        Did you notify the guest about damages ?
                      </div>
                      <div className="answer">
                        {ticket.detailable.notify_guest_status === 0
                          ? "No"
                          : "Yes"}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">
                        Do you like to resolve the claim directly with the{" "}
                        <br />
                        guest ?
                      </div>
                      <div className="answer">
                        {ticket.detailable.resolve_with_guest_status === 0
                          ? "No, I want RYDE claims team to help me to get this resolved"
                          : "Yes"}
                      </div>
                    </div>
                  </div>
                )}
                {/* IF Damage Reoport */}
                {((fileList.images && fileList.images.length > 0) ||
                  (fileList.docs && fileList.docs.length > 0)) && (
                  <div className="head">Attachments</div>
                )}
                <div className="attachment">
                  {fileList.images && fileList.images.length > 0 && (
                    <div>
                      <div className="head">Photos</div>
                      <div className="clearfix">
                        <Upload
                          customRequest={() => console.log("uploading.....")}
                          listType="picture-card"
                          fileList={fileList.images}
                          onPreview={file =>
                            this.handlePreview(file, "attachments")
                          }
                          onChange={this.handleUpload}
                          onRemove={false}
                          showUploadList={{
                            showRemoveIcon: false,
                            showPreviewIcon: true
                          }}
                          className={
                            ticket.status == 1 || ticket.status == -1
                              ? "SC-ticket-attachment-main"
                              : "SC-ticket-attachment-side"
                          } /* "SC-ticket-attachment-main"  This class only visible when support ticket 'resolved' & 'withdrawn' */
                        />
                      </div>
                    </div>
                  )}

                  {fileList.docs && fileList.docs.length > 0 && (
                    <div>
                      <div className="head">Documents</div>
                      <DocumentGallery docs={fileList.docs} />
                    </div>
                  )}

                  {ticket &&
                    ticket.detailable_type === "damage_report" &&
                    carCheckoutPhotos &&
                    carCheckoutPhotos.length > 0 && (
                      <div className="checkout">
                        <div className="head">Checkout Photos</div>
                        <div className="clearfix">
                          <Upload
                            listType="picture-card"
                            fileList={carCheckoutPhotos}
                            onPreview={file =>
                              this.handlePreview(file, "checkoutphotos")
                            }
                            onChange={this.handleUpload}
                            onRemove={false}
                            showUploadList={{
                              showRemoveIcon: false,
                              showPreviewIcon: true
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>
                <div className="crtdate">
                  Created On{" "}
                  {ticket && moment(ticket.created_at).format("MMMM Do, YYYY")}
                </div>
              </div>
            </div>
            {/* Side */}
          </div>

          {/* View Decline Reason */}
          <ModalPopUp
            isOpen={this.state.showDeclineReasonModel}
            onRequestClose={() =>
              this.setState({ showDeclineReasonModel: false })
            }
            shouldCloseOnOverlayClick={true}
            contentLabel="reason to decline"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <div className="SC_popup">
              <div className="del_icon">
                <span
                  className="icon-cancel"
                  onClick={() =>
                    this.setState({ showDeclineReasonModel: false })
                  }
                />
              </div>
              <div className="header">Decline Reason</div>
              {ticket && ticket.detailable.declined_reason && (
                <div className="desc_justifed">
                  {ticket.detailable.declined_reason}
                </div>
              )}
            </div>
          </ModalPopUp>
          {/* View Decline Reason */}

          {/* Page Body */}
          {showModelSuccess === true && (
            <div>
              {ticket && ticket.status === -1 && (
                <SuccessPopUp
                  header={"Ticket has been withdrawn"}
                  description={`${ticket.number}`}
                  icon={"success"}
                />
              )}
              {ticket && ticket.status === 1 && (
                <SuccessPopUp
                  header={"Ticket has been marked as resolved"}
                  description={`Claim No ${ticket.number} has been resolved`}
                  icon={"success"}
                />
              )}
            </div>
          )}
          {this.state.previewImages.length > 0 && (
            <Lightbox
              images={this.state.previewImages}
              isOpen={this.state.lightboxIsOpen}
              onClose={() =>
                this.setState({
                  lightboxIsOpen: false,
                  currentImage: 0,
                  previewImages: []
                })
              }
              onClickNext={this.lightboxNext}
              onClickPrev={this.lightboxPrev}
              currentImage={this.state.currentImage}
              backdropClosesModal={true}
            />
          )}
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    ticket: state.supportCenter.ticket,
    authenticated: state
  };
};

export default connect(mapStateToProps)(
  withRouter(checkAuth(checkPermission(ViewTicket)))
);
