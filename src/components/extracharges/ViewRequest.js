import React, { Component } from "react";
import Modal from "react-modal";
import Collapsible from "react-collapsible";
import { smallModel, imageModel } from "../../consts/consts";
import moment from "moment-timezone";
import axios from "axios";
import { authFail } from "../../actions/AuthAction";

class ViewRequest extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      modalName: "",
      error: false,
      message: "",
      declineReson: "",
      selectedRequestId: null,
      openedCollaps: 0,
      selectedImg: "",
      error: false,
      errorMessage: ""
    };
  }

  _toggleModel = (model = null, id = null) =>
    this.setState({
      showModal: !this.state.showModal,
      modalName: model,
      selectedRequestId: id
    });

  trigger = (item, key) => {
    if (item.status == 1 || item.status == -2) {
      return (
        <div className="request-info-wrapper collaps-panel">
          <div className="label-status-inline">
            <div className="request-total-price">
              Total $ {item.total_amount}
            </div>
            {item.status == 1 && (
              <span className="label-status label-pending-sm">Pending</span>
            )}
            {item.status == -2 && (
              <span className="label-status label-under-further-reviewing-sm">
                Under Review
              </span>
            )}
            {this.state.openedCollaps == key ? (
              <img
                className="img-responsive arrow-green"
                src={"/images/up-arrow-green.svg"}
              />
            ) : (
              <img
                className="img-responsive arrow-green"
                src={"/images/down-arrow-green.svg"}
              />
            )}
          </div>
          <div className="request-info-bottom-wrapper">
            <div className="vr-date-time">
              {moment(item.created_at).format("MM-DD-YYYY")}{" "}
              <span className="vr-time">
                {" "}
                {moment(item.created_at).format("h:mm a")}
              </span>
            </div>
          </div>
          {item.declined_within_hours && (
            <div className="respond-time-wrapper respond-time-collaps-wrapper">
              <img src="/images/clock-icon.svg" alt="Clock Icon" />
              <span>{item.declined_within_hours}</span>
            </div>
          )}
        </div>
      );
    } else if (item.status == 2 || item.status == 3) {
      return (
        <div className="request-info-wrapper request-completed collaps-panel">
          <div className="label-status-inline">
            {item.status == 2 && (
              <span className="label-status label-completed-sm">Completed</span>
            )}
            {item.status == 3 && (
              <span className="label-status label-admin-completed-sm">
                Admin Approved
              </span>
            )}
            {this.state.openedCollaps == key ? (
              <img
                className="img-responsive arrow-green"
                src={"/images/up-arrow-green.svg"}
              />
            ) : (
              <img
                className="img-responsive arrow-green"
                src={"/images/down-arrow-green.svg"}
              />
            )}
          </div>
          <div className="vr-date-time">
            {moment(item.created_at).format("MM-DD-YYYY")}{" "}
            <span className="vr-time">
              {" "}
              {moment(item.created_at).format("h:mm a")}
            </span>
          </div>
        </div>
      );
    } else if (item.status == -1 || item.status == -3) {
      return (
        <div className="request-info-wrapper request-completed collaps-panel">
          <div className="label-status-inline">
            {item.status == -1 && (
              <span className="label-status label-completed-sm">Withdrawn</span>
            )}
            {item.status == -3 && (
              <span className="label-status label-completed-sm">
                Admin Declined
              </span>
            )}
            {this.state.openedCollaps == key ? (
              <img
                className="img-responsive arrow-green"
                src={"/images/up-arrow-green.svg"}
              />
            ) : (
              <img
                className="img-responsive arrow-green"
                src={"/images/down-arrow-green.svg"}
              />
            )}
          </div>
          <div className="vr-date-time">
            {moment(item.created_at).format("MM-DD-YYYY")}{" "}
            <span className="vr-time">
              {" "}
              {moment(item.created_at).format("h:mm a")}
            </span>
          </div>
        </div>
      );
    }
  };

  renderItem = item => {
    if (item.category == "extra_miles") {
      return (
        <div className="request-info-inline">
          <div className="request-info-inline-left">
            {item.unit_price > 0 ? (
              <p>Extra miles ( $ {item.unit_price} per mile )</p>
            ) : (
              <p>Extra miles </p>
            )}
            {item.unit_price > 0 && (
              <span>
                $ {item.value} x {item.unit_price}
              </span>
            )}
          </div>
          <div className="request-info-inline-right">$ {item.amount}</div>
        </div>
      );
    } else if (item.category == "missing_gas") {
      return (
        <div className="request-info-inline">
          <div className="request-info-inline-left">Missing gas</div>
          <div className="request-info-inline-right">$ {item.amount}</div>
        </div>
      );
    } else if (item.category == "tickets") {
      return (
        <div className="request-info-inline">
          <div className="request-info-inline-left">Tickets</div>
          <div className="request-info-inline-right">$ {item.amount}</div>
        </div>
      );
    }
  };

  renderAttachments = (item, k) => {
    return item.map((data, key) => {
      return (
        <div className="image-inner-wrapper" key={key + k}>
          <img
            className="img-responsive"
            src={data.url}
            onClick={() => {
              this.setState({ selectedImg: data.url }, state => {
                this._toggleModel("soomImgae");
              });
            }}
          />
        </div>
      );
    });
  };

  _setButtons = item => {
    if (this.props.booking.btn.user_type == "owner" && item.status == 1) {
      return (
        <button
          className="btn withdraw-request-btn"
          onClick={() => this._toggleModel("withdrow", item.id)}
        >
          Withdraw Request
        </button>
      );
    } else if (
      this.props.booking.btn.user_type == "renter" &&
      item.status == 1
    ) {
      return (
        <div className="accept-buttons-wrapper">
          <button
            className="btn accept-request-btn"
            onClick={() => this._toggleModel("accept", item.id)}
          >
            Accept
          </button>
          <button
            className="btn decline-request-btn"
            onClick={() => this._toggleModel("decline", item.id)}
          >
            Decline
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  replyToTicketRequest = async data => {
    try {
      if (!this.state.selectedRequestId) {
        return false;
      }
      data.id = this.state.selectedRequestId;
      if (this.state.declineReson && this.state.modalName == "decline") {
        data.renter_description = this.state.declineReson;
      }
      this.props._loadingUp();
      const response = await await axios.patch(
        process.env.REACT_APP_API_URL + `booking-tickets/${data.id}`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this._toggleModel();
        this.props.fetchBooking(false);
        this.props._loadingDwon();
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      if (error.response.data.error)
        this.setState({
          error: true,
          errorMessage: error.response.data.message
        });
      this.props._loadingDwon();
    }
  };

  _isOpen = key => {
    if (key == this.state.openedCollaps) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { booking } = this.props;
    const { error, errorMessage } = this.state;
    return (
      <div className="row request-extra-charges view-request">
        <div className="col-xs-12 col-sm-12">
          {booking &&
            booking.tickets.length > 0 &&
            booking.tickets.map((item, key) => {
              return (
                <Collapsible
                  lazyRender={false}
                  handleTriggerClick={() =>
                    this.setState({
                      openedCollaps: key == this.state.openedCollaps ? -1 : key
                    })
                  }
                  trigger={this.trigger(item, key)}
                  key={key}
                  open={key == this.state.openedCollaps ? true : false}
                >
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      <div className="request-info-wrapper request-pending">
                        <div className="request-info-inner">
                          {item.details.length > 0 &&
                            item.details.map((data, k) => {
                              return <div key={k}>{this.renderItem(data)}</div>;
                            })}
                          {item.description && (
                            <div className="request-message-fw">
                              <div className="request-info-inline-left">
                                Message
                              </div>
                              <div className="request-info-inline-right">
                                {item.description}
                              </div>
                            </div>
                          )}
                          <div className="request-info-inline">
                            <div className="request-total-price">Total</div>
                            <div className="request-total-price">
                              $ {item.total_amount}
                            </div>
                          </div>
                          {item.details.filter(i => {
                            return i.attachments && i.attachments.length > 0;
                          }).length > 0 && (
                            <div className="row">
                              <div className="col-xs-12 col-sm-12">
                                <div className="photos-header-wrapper">
                                  <label>Photos</label>
                                </div>
                              </div>
                              <div className="col-xs-12 col-sm-12">
                                <div className="image-wrapper">
                                  {item.details.length > 0 &&
                                    item.details.map((data, k) => {
                                      return this.renderAttachments(
                                        data.attachments,
                                        k
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                          {this._setButtons(item)}
                          {item.status == -2 && (
                            <div className="messages-wrapper">
                              <div className="notification warning-message">
                                <div className="notification-inner">
                                  {booking &&
                                  booking.btn.user_type == "owner" ? (
                                    <span className="warning-notification-cap-sm">
                                      Renter Has decline the request
                                    </span>
                                  ) : (
                                    <span className="warning-notification-cap-sm">
                                      Your request has forwarded to Ryde
                                      support. We will be in touch with you
                                      shortly.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapsible>
              );
            })}
        </div>

        {/* Modal for decline */}
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this._toggleModel()}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={this.state.modalName == "soomImgae" ? imageModel : smallModel}
        >
          {this.state.modalName == "decline" && (
            <div className="confirm-message-wrapper">
              <button
                className="modal-close-icon"
                onClick={() => this._toggleModel()}
              >
                <img
                  className="img-responsive"
                  src="/images/close-icon-gray.svg"
                />
              </button>
              <div className="modal-header">
                <h5>Decline</h5>
              </div>
              <div className="reason-field-wrapper">
                <div className="form-group">
                  <label>
                    We like to know the reason for decline the request
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Describe your reason here"
                    onChange={e =>
                      this.setState({ declineReson: e.target.value })
                    }
                    value={this.state.declineReson}
                  />
                </div>
              </div>
              <div className="confirm-buttons-wrapper">
                <button
                  className="btn no-btn"
                  onClick={() => this.replyToTicketRequest({ status: -2 })}
                >
                  Decline
                </button>
              </div>
            </div>
          )}
          {this.state.modalName == "accept" && (
            <div className="confirm-message-wrapper">
              <button
                className="modal-close-icon"
                onClick={() => this._toggleModel()}
              >
                <img
                  className="img-responsive"
                  src="/images/close-icon-gray.svg"
                />
              </button>
              <div className="modal-header">
                <h5>Confirm</h5>
              </div>
              <div className="confirm-buttons-wrapper">
                <button
                  className="btn yes-btn"
                  onClick={() => this.replyToTicketRequest({ status: 2 })}
                >
                  Yes
                </button>
                <button
                  className="btn no-btn"
                  onClick={() => this._toggleModel()}
                >
                  No
                </button>
              </div>
              {error && (
                <p style={{ textAlign: "center", color: "red" }}>
                  {errorMessage}
                </p>
              )}
            </div>
          )}
          {this.state.modalName == "withdrow" && (
            <div className="confirm-message-wrapper">
              <button
                className="modal-close-icon"
                onClick={() => this._toggleModel()}
              >
                <img
                  className="img-responsive"
                  src="/images/close-icon-gray.svg"
                />
              </button>
              <div className="modal-header">
                <h5>Do you want to withdraw</h5>
              </div>
              <div className="confirm-buttons-wrapper">
                <button
                  className="btn yes-btn"
                  onClick={() => this.replyToTicketRequest({ status: -1 })}
                >
                  Yes
                </button>
                <button
                  className="btn no-btn"
                  onClick={() => this._toggleModel()}
                >
                  No
                </button>
              </div>
            </div>
          )}
          {this.state.modalName == "soomImgae" && (
            <img width="100%" src={this.state.selectedImg} />
          )}
        </Modal>
      </div>
    );
  }
}

export default ViewRequest;
