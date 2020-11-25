import React, { Component } from "react";
import Modal from "react-modal";
import axios from "axios";
import moment from "moment";
import NumberFormat from "react-number-format";
import { smallModel } from "../../consts/consts";
import TextInput from "../../form-components/TextInput";
import { compress } from "../file-processing/lib/FileCompress";
import { fileUpload } from "../file-processing/lib/FileUpload";
import { authFail } from "../../actions/AuthAction";

class ExtrachargeForm extends Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      modelView: "",
      img: "",
      error: false,
      success: false,
      message: "",
      submitting: false,
      validating: false,
      isSubmit: false,

      extraMiles: "",
      missingGas: "",
      tickets: "",
      description: "",
      totalExtraMiles: "",
      imges: []
    };
  }

  toggleModel = (view = null) => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal, modelView: view });
  };

  resetForm = () => {
    this.setState({
      extraMiles: "",
      missingGas: "",
      tickets: "",
      description: "",
      totalExtraMiles: "",
      imges: [],
      attachment: ""
    });
  };
  _validate = () => {
    const { extraMiles, missingGas, tickets, description } = this.state;
    const errors = {};
    if (extraMiles && extraMiles < 0) {
      errors.extraMiles = "Invalid Value";
    }
    if (missingGas && missingGas < 0) {
      errors.missingGas = "Invalid Value";
    }
    if (tickets && tickets < 0) {
      errors.tickets = "Invalid Value";
    }
    if (!description) {
      errors.description = "Message Required";
    }
    return errors;
  };

  beforeSubmit = () => {
    const { extraMiles, missingGas, tickets, imges } = this.state;
    this.setState({ validating: true });
    if (!extraMiles && !missingGas && !tickets) {
      this.setState(
        {
          error: true,
          message:
            "You need to supply at least one extra charge to submit the request.",
          validating: false
        },
        () => {
          setTimeout(() => {
            this.setState({ error: false, message: "" });
          }, 5000);
        }
      );
      return false;
    }
    //field validations
    let validator = this._validate();
    if (JSON.stringify(validator) !== "{}") {
      return false;
    }

    if (imges.length == 0) {
      this.setState(
        {
          error: true,
          message: "Please add  attachment(s)",
          validating: false
        },
        () => {
          setTimeout(() => {
            this.setState({ error: false, message: "" });
          }, 5000);
        }
      );
      return false;
    } else if (!this._isAllAttachmentSet()) {
      return false;
    } else {
      return true;
    }
  };

  _isAllAttachmentSet = () => {
    const { imges, extraMiles, missingGas, tickets } = this.state;
    let imageArray = imges;
    if (extraMiles) {
      let result = imageArray.filter(item => {
        return item.name == "extra_miles";
      });
      if (result.length == 0) {
        this.setState(
          { error: true, message: "Please add extra miles  attachment(s)" },
          () => {
            setTimeout(() => {
              this.setState({ error: false, message: "" });
            }, 5000);
          }
        );
        return false;
      }
    }
    if (missingGas) {
      let result = imageArray.filter(item => {
        return item.name == "missing_gas";
      });
      if (result.length == 0) {
        this.setState(
          { error: true, message: "Please add missing gas  attachment(s)" },
          () => {
            setTimeout(() => {
              this.setState({ error: false, message: "" });
            }, 5000);
          }
        );
        return false;
      }
    }
    if (tickets) {
      let result = imageArray.filter(item => {
        return item.name == "tickets";
      });
      if (result.length == 0) {
        this.setState(
          { error: true, message: "Please add tickets  attachment(s)" },
          () => {
            setTimeout(() => {
              this.setState({ error: false, message: "" });
            }, 5000);
          }
        );
        return false;
      }
    }
    return true;
  };

  onSubmit = async () => {
    try {
      const {
        extraMiles,
        missingGas,
        tickets,
        description,
        imges
      } = this.state;
      this.setState({ submitting: true });
      this.props._loadingUp();
      let ticketDetails = [];
      if (extraMiles) {
        ticketDetails.push({
          category: "extra_miles",
          value: parseFloat(extraMiles)
        });
      }
      if (missingGas) {
        ticketDetails.push({
          category: "missing_gas",
          value: parseFloat(missingGas)
        });
      }
      if (tickets) {
        ticketDetails.push({
          category: "tickets",
          value: parseFloat(tickets)
        });
      }
      const response = await await axios.post(
        `${process.env.REACT_APP_API_URL}booking-tickets`,
        {
          booking_id: this.props.booking.id,
          description: description,
          details: ticketDetails
        },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        const sendData = {
          attachments: imges,
          details: response.data.data.details,
          bookingId: response.data.data.booking_id
        };

        sendData.attachments.forEach(attachment => {
          let bookingTicketDetail = sendData.details.find(item => {
            return item.category === attachment.name;
          });
          axios
            .post(
              `${process.env.REACT_APP_API_URL}v2/booking-ticket-details/${bookingTicketDetail.id}/attachments`,
              {
                attachments: [attachment.key]
              },
              {
                headers: {
                  Authorization: localStorage.access_token
                }
              }
            )
            .then(() => {
              this.props.fetchBooking(false);
            });
        });
        this.props.fetchBooking(false);
        this.resetForm();
        this.setState(
          {
            success: true,
            message: "Your request has been sent successfully",
            error: false,
            submitting: false,
            isSubmit: true
          },
          () => {
            setTimeout(() => {
              this.setState({ success: false, error: false, message: "" });
            }, 3000);
          }
        );
        this.toggleModel();
        this.props._loadingDwon();
      }
    } catch (error) {
      this.props._loadingDwon();
      this.props.dispatch(authFail(error));
      this.setState({
        success: false,
        message: error.response.data.message,
        error: true,
        submitting: false
      });
      this.toggleModel();
    }
  };

  handleFileChange = (event, name) => {
    const { imges } = this.state;
    if (event.target.files && event.target.files.length > 0) {
      for (let index = 0; index < event.target.files.length; index++) {
        let originalFile = event.target.files[index];

        const reader = new FileReader();
        reader.readAsDataURL(originalFile);

        reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width >= 1440 && height >= 890) {
              let nameFile = "";
              // Compress image .
              const currentTime = `${moment().valueOf()}_${index}`;
              imges.push({
                file: originalFile,
                path: URL.createObjectURL(originalFile),
                key: currentTime,
                name: originalFile.name,
                uploading: true
              });
              this.setState({ imges }, () => {
                compress(
                  originalFile,
                  nameFile,
                  {
                    width: 1440,
                    height: 890,
                    quality: 0.8
                  },
                  file => {
                    fileUpload(
                      file,
                      res => {
                        let currenctFile = imges.find(i => {
                          return i.key == currentTime;
                        });
                        currenctFile.path = res.location;
                        currenctFile.key = res.key;
                        currenctFile.name = name;
                        currenctFile.uploading = false;
                        this.setState({ imges });
                      },
                      "tmp/booking-ticket-detail-attachments"
                    );
                  }
                );
              });
            } else {
              this.setState(
                {
                  error: true,
                  message: "Image size should be minimum 1440 x 890"
                },
                () => {
                  setTimeout(() => {
                    this.setState({ error: false, message: "" });
                  }, 4000);
                }
              );
            }
          };
        };
      }
      this.setState({ attachment: "" });
    }
  };

  removeImage = n => {
    const { imges } = this.state;
    var temp_array = [];
    imges.map((img, k) => {
      if (k != n) {
        temp_array.push(img);
      }
    });
    this.setState({ imges: temp_array });
  };

  removeAttachment = name => {
    const { imges } = this.state;

    let imageArray = imges;
    const result = imageArray.filter(item => {
      return item.name != name;
    });
    this.setState({ imges: result });
  };

  render() {
    const { booking } = this.props;
    const {
      missingGas,
      tickets,
      success,
      isSubmit,
      extraMiles,
      attachment,
      validating,
      totalExtraMiles,
      modelView,
      showModal,
      description,
      imges,
      message,
      error
    } = this.state;
    return (
      <div className="row request-extra-charges">
        <div className="col-xs-12 col-sm-12">
          {!success && !isSubmit && (
            <div>
              <div className="row">
                {booking &&
                  !booking.tickets.some(ticket => {
                    return (
                      ticket.status != -1 &&
                      ticket.details.find(
                        item => item.category == "extra_miles"
                      )
                    );
                  }) && (
                    <div className="col-xs-12 col-sm-6">
                      <div className="form-group">
                        <div className="labels-inline">
                          <label>
                            Extra miles ( ${" "}
                            {booking.car.extra_mile_price &&
                              booking.car.extra_mile_price}{" "}
                            per mile )
                          </label>
                          {extraMiles && (
                            <button>
                              <img
                                className="img-responsive"
                                src="/images/attach-icon-green.svg"
                                alt="Attach Icon"
                                onClick={() => this.fileUpload1.click()}
                              />
                              <input
                                type="file"
                                value={attachment}
                                multiple={true}
                                style={{
                                  visibility: "hidden",
                                  display: "none"
                                }}
                                onChange={e =>
                                  this.handleFileChange(e, "extra_miles")
                                }
                                ref={fileUpload1 => {
                                  this.fileUpload1 = fileUpload1;
                                }}
                              />
                            </button>
                          )}
                        </div>
                        <TextInput
                          name="extraMiles"
                          type="number"
                          min="1"
                          validate={() => this._validate()}
                          submitting={validating}
                          required={false}
                          className="form-control"
                          value={extraMiles}
                          onChange={e => {
                            this.setState(
                              {
                                extraMiles: e.target.value,
                                totalExtraMiles:
                                  e.target.value * booking.car.extra_mile_price
                              },
                              () =>
                                !extraMiles &&
                                this.removeAttachment("extra_miles")
                            );
                          }}
                          placeholder="Enter extra miles"
                        />
                        {totalExtraMiles && (
                          <span className="cal-price">$ {totalExtraMiles}</span>
                        )}
                      </div>
                    </div>
                  )}
                {booking &&
                  !booking.tickets.some(ticket => {
                    return (
                      ticket.status != -1 &&
                      ticket.details.find(
                        item => item.category == "missing_gas"
                      )
                    );
                  }) && (
                    <div className="col-xs-12 col-sm-6">
                      <div className="form-group">
                        <div className="labels-inline">
                          <label>Missing gas</label>
                          {missingGas && (
                            <button>
                              <img
                                className="img-responsive"
                                src="/images/attach-icon-green.svg"
                                alt="Attach Icon"
                                onClick={() => this.fileUpload2.click()}
                              />
                              <input
                                type="file"
                                value={attachment}
                                multiple={true}
                                style={{
                                  visibility: "hidden",
                                  display: "none"
                                }}
                                onChange={e =>
                                  this.handleFileChange(e, "missing_gas")
                                }
                                ref={fileUpload2 => {
                                  this.fileUpload2 = fileUpload2;
                                }}
                              />
                            </button>
                          )}
                        </div>
                        <NumberFormat
                          className="form-control"
                          value={missingGas ? missingGas : ""}
                          thousandSeparator={true}
                          prefix={"$"}
                          decimalScale={2}
                          placeholder="Enter missing gas"
                          onValueChange={values => {
                            const { floatValue } = values;
                            this.setState(
                              { missingGas: floatValue },
                              () =>
                                !missingGas &&
                                this.removeAttachment("missing_gas")
                            );
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-6">
                  <div className="form-group">
                    <div className="labels-inline">
                      <label>Tickets</label>
                      {tickets && (
                        <button>
                          <img
                            className="img-responsive"
                            src="/images/attach-icon-green.svg"
                            alt="Attach Icon"
                            onClick={() => this.fileUpload3.click()}
                          />
                          <input
                            type="file"
                            value={attachment}
                            value={attachment}
                            style={{ visibility: "hidden", display: "none" }}
                            multiple={true}
                            onChange={e => this.handleFileChange(e, "tickets")}
                            ref={fileUpload3 => {
                              this.fileUpload3 = fileUpload3;
                            }}
                          />
                        </button>
                      )}
                    </div>
                    <NumberFormat
                      className="form-control"
                      value={tickets}
                      thousandSeparator={true}
                      prefix={"$"}
                      decimalScale={2}
                      placeholder="Enter tickets"
                      onValueChange={values => {
                        const { floatValue } = values;
                        this.setState(
                          { tickets: floatValue },
                          () => !tickets && this.removeAttachment("tickets")
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label>Message</label>
                    <TextInput
                      type="text"
                      name="description"
                      validate={() => this._validate()}
                      submitting={validating}
                      required={true}
                      className="form-control"
                      value={description}
                      onChange={e => {
                        this.setState({ description: e.target.value });
                      }}
                      placeholder="Send a brief description"
                    />
                  </div>
                </div>
              </div>
              {(totalExtraMiles ? parseFloat(totalExtraMiles) : 0) +
                (missingGas ? parseFloat(missingGas) : 0) +
                (tickets ? parseFloat(tickets) : 0) >
                0 && (
                <div className="row">
                  <div className="col-xs-12 col-sm-12">
                    <div className="rec-total">
                      Total{" "}
                      <span>
                        ${" "}
                        {(totalExtraMiles ? parseFloat(totalExtraMiles) : 0) +
                          (missingGas ? parseFloat(missingGas) : 0) +
                          (tickets ? parseFloat(tickets) : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {imges.length > 0 && (
                <div className="row">
                  <div className="col-xs-12 col-sm-12">
                    <div className="photos-header-wrapper">
                      <label>Photos</label>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12">
                    <div className="image-wrapper ec-uploading-wrapper">
                      {imges &&
                        imges.map((img, key) => {
                          return (
                            <div className="image-inner-wrapper" key={img.path}>
                              <img
                                className={
                                  img.uploading === true
                                    ? "img-responsive uploading-img"
                                    : "img-responsive"
                                }
                                src={img.path}
                              />
                              <button onClick={() => this.removeImage(key)}>
                                <img
                                  className="img-responsive remove-image-icon"
                                  src="/images/remove-icon-green.svg"
                                />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
              <button
                className="btn send-request-btn"
                onClick={() =>
                  this.beforeSubmit() && this.toggleModel("confirm")
                }
              >
                Send Request
              </button>
            </div>
          )}
          {/* Notifications */}
          <div className="messages-wrapper">
            {success && (
              <div className="notification success-message">
                <div className="notification-inner">
                  <img
                    className="img-responsive pic"
                    src="/images/check-mark.svg"
                    alt="Image"
                  />
                  <span className="success-notification-cap-sm">{message}</span>
                </div>
              </div>
            )}
            {error && (
              <div className="notification warning-message">
                <div className="notification-inner">
                  <img
                    className="img-responsive pic"
                    src="/images/error-icon.svg"
                    alt="Image"
                  />
                  <span className="warning-notification-cap-sm">{message}</span>
                </div>
              </div>
            )}
          </div>

          {success && isSubmit && (
            <div className="request-buttons-wrapper">
              <button
                className="btn view-request-btn"
                onClick={() => this.props.loadViewTab(2)}
              >
                View Request
              </button>
              <button
                className="btn new-request-btn"
                onClick={() => {
                  this.setState({ success: false, isSubmit: false });
                }}
              >
                Add a New Request
              </button>
            </div>
          )}
        </div>

        {modelView == "confirm" && (
          <Modal
            isOpen={showModal}
            onRequestClose={this.handleCloseModalLarge}
            shouldCloseOnOverlayClick={true}
            contentLabel="Modal"
            style={smallModel}
          >
            <div className="confirm-message-wrapper">
              <button
                className="modal-close-icon"
                onClick={() => this.toggleModel()}
              >
                <img
                  className="img-responsive"
                  src="/images/close-icon-gray.svg"
                />
              </button>
              <div className="modal-header">
                <h5>Do you want to send this request</h5>
              </div>
              <div className="confirm-buttons-wrapper">
                <button className="btn yes-btn" onClick={() => this.onSubmit()}>
                  Yes
                </button>
                <button
                  className="btn no-btn"
                  onClick={() => this.toggleModel()}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default ExtrachargeForm;
