import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Upload } from "antd";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../../consts/consts";
import MainNav from "../../../components/layouts/MainNav";
import MainFooter from "../../../components/layouts/MainFooter";
import ModalPopUp from "react-modal";
import Lightbox from "react-images";
import { SUPPORT_TICKET } from "../../../actions/ActionTypes";
import { fetchTicketV2 } from "../../../actions/SupportCenterActions";
import DocumentGallery from "../../../components/supportcenter/DocumentGallery";
import TicketStatus from "../../../components/supportcenter/TicketStatus";
import checkAuth from "../../../components/requireAuth";
import SuccessPopUp from "../../../components/supportcenter/SuccessPopUp";
import DeclinePopUp from "../../../components/supportcenter/DeclinePopUp";
import AcceptTicket from "../../../components/supportcenter/AcceptTicket";
import checkPermission from "../../../components/requirePermission";
import PreLoader from "../../../components/preloaders/preloaders";
import "antd/lib/upload/style/index.css";
import { authFail } from "../../../actions/AuthAction";

ModalPopUp.setAppElement("#root");

class ReviewTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketId: props.match.params.id,
      status: null,
      error: null,
      success: false,
      message: "",
      declinedReason: "",
      fileList: {},
      carCheckoutPhotos: [],
      showDeclinePopUp: false,
      showDeclineReasonModel: false,
      // lightbox
      previewImages: [],
      lightboxIsOpen: false,
      currentImage: 0
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { ticketId } = this.state;
    console.log("ticketId", ticketId);

    dispatch(fetchTicketV2(ticketId));
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: SUPPORT_TICKET,
      payload: null
    });
  }

  componentWillReceiveProps(nextProps) {
    const { ticket } = nextProps;

    if (ticket) {
      // ticket attachments
      let fileList = [];
      let docs = [];
      let images = [];
      ticket.support_ticket_attachments.map(file => {
        const url = file.image_path.toLowerCase();
        if (url.match(/\.(jpeg|jpg|png|webp)$/) !== null) {
          // Allowed image types
          const data = {
            uid: file.id,
            name: "",
            status: "done",
            url: file.image_path
          };
          images.push(data);
        } else {
          // Allowed doc types
          const type = url.match(/\.(pdf|doc|docx|xls|xlsx)$/);
          if (type !== null) {
            const data = {
              src: file.image_path,
              type: type[1]
            };
            docs.push(data);
          }
        }
      });
      this.setState({ fileList: { docs, images } });

      // car checkout photos
      if (ticket.car_checkout_photos) {
        let carCheckoutPhotos = [];
        ticket.car_checkout_photos.map((img, index) => {
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
  // Decline functions for popup props

  handleDeclineReason = declinedReason => {
    this.setState({ declinedReason });
  };

  handleDeclineMessage = message => {
    const { dispatch } = this.props;
    const { ticketId } = this.state;
    this.setState({ success: message.success, message: message.message });
    if (message.success) {
      dispatch(fetchTicketV2(ticketId));
    }
  };

  handleDecline = () => {
    this.setState({ status: "declined" });
    let data = {
      ticket_id: this.state.ticketId,
      reason: this.state.declinedReason
    };
    return axios
      .post(
        `${process.env.REACT_APP_API_URL}support-ticket/damage/decline`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {})
      .catch(err => this.props.dispatch(authFail(err)));
  };

  handleAccept = () => {
    const { dispatch } = this.props;
    const { ticketId } = this.state;
    this.setState({ status: "accepted" });
    let data = {
      ticket_id: this.state.ticketId
    };
    return axios
      .post(
        `${process.env.REACT_APP_API_URL}support-ticket/damage/accept`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      )
      .then(res => {
        this.setState({ success: true, message: res.data.message });
        dispatch(fetchTicketV2(ticketId));
      })
      .catch(err => {
        dispatch(authFail(err));
        this.setState({ success: false, message: err.response.data.message });
      });
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

  estimateOfDamages = () => {
    const { ticket } = this.props;
    if (!ticket) {
      return false;
    }

    if (
      parseFloat(ticket.detailable.estimate_amount) >
      parseFloat(ticket.detailable.max_deduct_amount)
    ) {
      return ticket.detailable.max_deduct_amount;
    } else {
      return ticket.detailable.estimate_amount;
    }
  };

  render() {
    const { ticket, history } = this.props;
    const {
      success,
      status,
      message,
      fileList,
      carCheckoutPhotos,
      showDeclinePopUp
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
        <div className="container SC_review_page">
          {/* Back Links */}
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

          {/* Page Header */}
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <div className="SC_page_title damage">
                <div className="SC_page_dtitle">
                  <div className="ticket_details">
                    Ticket number : {ticket && ticket.number}
                  </div>
                  <div className="SC_page_title_status">
                    {ticket && <TicketStatus status={ticket.status} />}
                  </div>
                </div>

                {ticket && ticket.detailable_type === "general" && (
                  <img
                    src="/images/support-center/gen-icon.svg"
                    className="icon"
                  />
                )}
                {ticket && ticket.detailable_type === "urgent_matter" && (
                  <img
                    src="/images/support-center/urgent-icon.svg"
                    className="icon"
                  />
                )}
                {ticket && ticket.detailable_type === "damage_report" && (
                  <img
                    src="/images/support-center/damage-icon.svg"
                    className="icon"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Page Header */}

          {/* Page Body */}
          <div className="row">
            <div className="col-md-12">
              {/* Message */}
              {ticket &&
                ticket.detailable.status === 5 &&
                ticket.ticket_message !== "" && (
                  <div className="SC_msg_success" style={{ display: "flex" }}>
                    <div className="icon" style={{ minWidth: "15px" }}>
                      <img src="/images/support-center/sucess_icon.svg" />
                    </div>
                    <div className="text">{ticket.ticket_message}</div>
                  </div>
                )}

              {ticket &&
                ticket.detailable.status === 6 &&
                ticket.ticket_message !== "" && (
                  <div className="SC_msg_warning" style={{ display: "flex" }}>
                    <div className="icon" style={{ minWidth: "15px" }}>
                      <img src="/images/support-center/status_message_icon.svg" />
                    </div>
                    <div className="text">{ticket.ticket_message}</div>
                  </div>
                )}
              {ticket &&
                (status === "declined" || ticket.detailable.status === 6) && (
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
              {/* Message */}

              <div className="SC_history">
                {/* IF Damage Reoport */}
                {ticket && ticket.detailable_type === "damage_report" && (
                  <div>
                    {ticket && (
                      <div className="head">
                        Booking Number : {ticket.booking_number}
                      </div>
                    )}
                    <div className="detail">
                      <div className="qst">Location of the incident :</div>
                      <div className="answer">
                        {ticket.detailable.location_status === 0
                          ? "No"
                          : ticket.detailable.location &&
                            ticket.detailable.location}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">
                        Details of how the accident took place :
                      </div>
                      <div className="answer">
                        {ticket.detailable.incident_status === 0
                          ? "No"
                          : ticket.detailable.incident &&
                            ticket.detailable.incident}
                      </div>
                    </div>

                    <div className="detail">
                      <div className="qst">3rd party involvement :</div>
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
                      <div className="qst">Estimate of damages :</div>
                      <div className="answer">
                        {ticket.detailable.estimate_status === 0
                          ? "No"
                          : `$ ${this.estimateOfDamages()}`}
                      </div>
                    </div>

                    {ticket.detailable.estimate_status === 1 && (
                      <div className="detail">
                        <div className="qst">Estimation by : </div>
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
                  </div>
                )}
                {/* IF Damage Reoport */}
              </div>

              <div className="SC_review_attachment">
                <div className="title" style={{ fontSize: "1.8rem" }}>
                  Attachments :
                </div>
                {fileList.images && fileList.images.length > 0 && (
                  <div>
                    <div className="title">Photos</div>
                    <div className="clearfix imglist">
                      <Upload
                        action="//"
                        listType="picture-card"
                        fileList={fileList.images}
                        onPreview={file =>
                          this.handlePreview(file, "attachments")
                        }
                        onRemove={false}
                        showUploadList={{
                          showRemoveIcon: false,
                          showPreviewIcon: true
                        }}
                      />
                    </div>
                  </div>
                )}
                {fileList.docs && fileList.docs.length > 0 && (
                  <div>
                    <div className="title">Documents</div>
                    <DocumentGallery docs={fileList.docs} width={24} />
                  </div>
                )}
              </div>

              {carCheckoutPhotos && carCheckoutPhotos.length > 0 && (
                <div className="SC_review_attachment_secondrow">
                  <div className="title" style={{ fontSize: "1.8rem" }}>
                    Car checkout photos :
                  </div>
                  <div className="clearfix imglist">
                    <Upload
                      action="//"
                      listType="picture-card"
                      fileList={carCheckoutPhotos}
                      onPreview={file =>
                        this.handlePreview(file, "checkoutphotos")
                      }
                      onRemove={false}
                      showUploadList={{
                        showRemoveIcon: false,
                        showPreviewIcon: true
                      }}
                    />
                  </div>
                </div>
              )}

              {ticket && (
                <div className="SC_chat_message">
                  <div className="SC_chat_message_btn">
                    {ticket.btn.btn_decline && (
                      <button
                        type="button"
                        className="btn SC_btn SC_btn_withdraw"
                        onClick={() =>
                          this.setState({ showDeclinePopUp: true })
                        }
                      >
                        DECLINE
                      </button>
                    )}
                    {ticket.btn.btn_accept && (
                      <AcceptTicket
                        ticket={ticket}
                        success={this.state.success}
                        message={this.state.message}
                        handleAccept={this.handleAccept}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Page Body */}

          {showDeclinePopUp === true && (
            <DeclinePopUp
              onTypeReason={this.handleDeclineReason}
              onDeclineMsg={this.handleDeclineMessage}
              onDecline={this.handleDecline}
            />
          )}

          {success && (
            <div>
              <div>
                {status === "accepted" && (
                  <SuccessPopUp
                    header={message[0] && message[0]}
                    description={message[1] && message[1]}
                    icon={"success"}
                  />
                )}
              </div>
              <div>
                {status === "declined" && (
                  <SuccessPopUp
                    header={message[0] && message[0]}
                    description={message[1] && message[1]}
                    icon={"decline"}
                  />
                )}
              </div>
            </div>
          )}

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
    usStates: state.car.usStates
  };
};

export default connect(mapStateToProps)(
  checkAuth(checkPermission(ReviewTicket))
);
