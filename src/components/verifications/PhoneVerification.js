import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Modal from "react-modal";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { getLoggedInUser, signinUser } from "../../actions/UserActions";
import { defaultModel } from "../../consts/consts";
import ResendPhoneVerification from "./ResendPhoneVerification";
import {
  SIGNUP_FETCHED,
  PHONE_VERIFICATION_RESEND,
  VERIFY_PHONE_NUMBER
} from "../../actions/ActionTypes";

Modal.setAppElement("#root");

class PhoneVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone_number: "",
      email: "",
      password: "",
      type: "",
      isVerifying: false,
      isOpen: false,
      error: false,
      errorMessage: ""
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.toggleInputFieldEditable = this.toggleInputFieldEditable.bind(this);
    this.resetInputFields = this.resetInputFields.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleTextChange(e) {
    if (e.target.id < 4) this.refs[e.target.id].nextSibling.focus();
    if (e.target.id === "4") {
      this.toggleInputFieldEditable(true);
      this.onSubmit();
    }
  }

  toggleInputFieldEditable(status) {
    this.refs["1"].disabled = status;
    this.refs["2"].disabled = status;
    this.refs["3"].disabled = status;
    this.refs["4"].disabled = status;
  }

  resetInputFields() {
    this.toggleInputFieldEditable(false);
    this.refs["1"].value = "";
    this.refs["2"].value = "";
    this.refs["3"].value = "";
    this.refs["4"].value = "";
    this.refs["1"].focus();
  }

  onSubmit = async () => {
    this.props.dispatch({ type: PHONE_VERIFICATION_RESEND, payload: "" });
    try {
      const { dispatch, user, onSuccess } = this.props;
      const { phone_number, email, password } = this.state;
      const verificationCode = `${this.refs["1"].value}${this.refs["2"].value}${
        this.refs["3"].value
      }${this.refs["4"].value}`;

      const data = {
        verifyCode: verificationCode,
        phone_number: phone_number,
        email: email
      };
      this.setState({
        isVerifying: true
      });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "users/verify-phone",
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        onSuccess && onSuccess();
        this.setState({
          isVerifying: false
        });
        if (user.id) {
          dispatch(getLoggedInUser(false));
        } else {
          dispatch(
            signinUser({
              email,
              password
            })
          );
        }
        dispatch({ type: VERIFY_PHONE_NUMBER, payload: false });
      } else {
        this.setState(
          {
            isVerifying: false,
            errorMessage: response.data.errorMessage
          },
          () => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 5000);
          }
        );
      }
    } catch (e) {
      if (e.response.data.error) {
        this.setState(
          {
            isVerifying: false,
            error: true,
            errorMessage: e.response.data.response
          },
          () => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 5000);
          }
        );
      }
    }
  };

  updatePhoneNumber = phoneNumber => {
    this.setState({ phone_number: phoneNumber });
  };

  handleCloseModal() {
    const { dispatch, onCloseModal } = this.props;
    dispatch({ type: SIGNUP_FETCHED });
    this.setState({ isOpen: false });
    onCloseModal && onCloseModal();
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.verifyPhone) {
      if (!nextProps.verifyPhone.error && this.state.phone_number === "") {
        this.setState({ isVerifying: false });
        this.setState({
          phone_number: nextProps.verifyPhone["phone_number"],
          email: nextProps.verifyPhone["email"],
          password: nextProps.verifyPhone["password"],
          type: nextProps.verifyPhone["type"]
        });
      }
    }

    if (nextProps.verifyPhone && nextProps.verifyPhone.error) {
      this.setState({ isVerifying: false });
      this.setState(
        { error: true, errorMessage: nextProps.verifyPhone.response },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }

    if (nextProps.isOpen) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { verifyPhone } = this.props;
    if (verifyPhone && verifyPhone.error) this.resetInputFields();
    return (
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.handleCloseModal}
        shouldCloseOnOverlayClick={false}
        contentLabel="Modal"
        style={defaultModel}
      >
        <div id="verification-wrapper">
          <div className="verification-top">
            <div className="close-popup">
              <a onClick={this.handleCloseModal}>
                <img
                  className="error-icon"
                  src="/images/close_icon.png"
                  alt="Close"
                />
              </a>
            </div>

            {this.state.isVerifying === true ? (
              <div className="pop-header">
                <div className="row">
                  <div className="col-md-9">Verifying...</div>
                  <div className="col-md-3">
                    <PreloaderIcon
                      loader={Oval}
                      size={40}
                      strokeWidth={8} // min: 1, max: 50
                      strokeColor="#000"
                      duration={2000}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="pop-header">Verification</div>
                <p>Enter the verification code to complete registration</p>
                <form className="form-inline verification-inner">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      onChange={this.handleTextChange}
                      ref="1"
                      id="1"
                      autoFocus
                    />

                    <input
                      type="number"
                      className="form-control"
                      onChange={this.handleTextChange}
                      ref="2"
                      id="2"
                    />

                    <input
                      type="number"
                      className="form-control"
                      onChange={this.handleTextChange}
                      ref="3"
                      id="3"
                    />

                    <input
                      type="number"
                      className="form-control"
                      onChange={this.handleTextChange}
                      ref="4"
                      id="4"
                    />
                  </div>
                </form>
              </div>
            )}
            {this.state.error && (
              <div className="form-error-message">
                <img
                  className="error-icon"
                  src="/images/owner/error-icon.svg"
                  alt="Error"
                />
                {this.state.errorMessage}
              </div>
            )}
          </div>
          <ResendPhoneVerification
            signupFormData={this.props.signupFormData}
            dispatchNewPhoneNumber={this.updatePhoneNumber}
            onRef={ref => (this.resendPhoneVerification = ref)}
          />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    verifyPhone: state.user.verifyPhoneNumber,
    user: state.user.user
  };
};

export default connect(mapStateToProps)(PhoneVerification);
