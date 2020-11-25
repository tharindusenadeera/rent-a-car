import React, { Component } from "react";
import { connect } from "react-redux";
import { resendPhoneVerificationCode } from "../../actions/UserActions";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { PHONE_VERIFICATION_FETCHING } from "../../actions/ActionTypes";
import TelInput from "../../form-components/TelInput";

class ResendPhoneVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone_number: "",
      signupFormData: null,
      error: false,
      success: false,
      errorMessage: "",
      successMessage: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.setNewPhoneNumber = this.setNewPhoneNumber.bind(this);
  }

  setNewPhoneNumber(phone) {
    this.setState({ phone_number: phone });
  }

  componentWillMount() {
    // console.log('ResendPhoneVerification = componentWillMount - ', this.props);
    const { signupFormData } = this.props;
    // console.log('ResendPhoneVerification - signupFormData',signupFormData);
    if (signupFormData) {
      this.setState({
        phone_number: signupFormData["phone_number"],
        signupFormData: signupFormData
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { signupFormData, newPhoneVerificationCode } = nextProps;

    if (newPhoneVerificationCode && newPhoneVerificationCode.error) {
      this.setState(
        { error: true, errorMessage: newPhoneVerificationCode.message },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }

    if (newPhoneVerificationCode && !newPhoneVerificationCode.error) {
      this.setState(
        { success: true, successMessage: newPhoneVerificationCode },
        state => {
          setTimeout(() => {
            this.setState({ success: false, successMessage: "" });
          }, 5000);
        }
      );
    }
  }
  onSubmit = e => {
    const {
      dispatch,
      dispatchNewPhoneNumber,
      isPhoneVerificationFetching
    } = this.props;
    e.preventDefault();
    if (
      isPhoneVerificationFetching === null ||
      isPhoneVerificationFetching === false
    ) {
      dispatch({ type: PHONE_VERIFICATION_FETCHING });
      dispatchNewPhoneNumber(this.state.phone_number);
      dispatch(
        resendPhoneVerificationCode(
          this.state.signupFormData,
          this.state.phone_number,
          dispatch
        )
      );
    }
  };

  render() {
    const { signupFormData, newPhoneVerificationCode } = this.props;

    return (
      <div className="verification-bottom">
        <div className="verification-bottom-inner">
          <TelInput
            label={false}
            initalNumber={
              signupFormData && signupFormData["phone_number"]
                ? signupFormData["phone_number"]
                : ""
            }
            value={this.state.phone_number}
            onChange={phone => this.setNewPhoneNumber(phone)}
          />
          <button
            type="button"
            className="btn resend-btn"
            onClick={this.onSubmit}
          >
            {this.props.isPhoneVerificationFetching === true && (
              <PreloaderIcon
                loader={Oval}
                size={15}
                strokeWidth={8} // min: 1, max: 50
                strokeColor="#fff"
                duration={800}
              />
            )}
            Resend Code
          </button>
        </div>

        {this.state.error && (
          <div className="form-message form-error-message">
            <img
              className="error-icon"
              src="/images/owner/error-icon.svg"
              alt="Error"
            />
            {this.state.errorMessage}
          </div>
        )}

        {this.state.success && (
          <div className="form-message form-successful-message">
            <img
              className="success-icon"
              src="/images/owner/success-icon.svg"
              alt="Success"
            />
            {this.state.successMessage}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    newPhoneVerificationCode: state.user.newPhoneVerificationCode,
    isPhoneVerificationFetching: state.user.isPhoneVerificationFetching
  };
};

export default connect(mapStateToProps)(ResendPhoneVerification);
