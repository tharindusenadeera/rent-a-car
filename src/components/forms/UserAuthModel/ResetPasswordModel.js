import React, { Component } from "react";
import { connect } from "react-redux";
// import { forgetPassword } from "../../../actions/UserActions";
import {
  IS_FETCHING,
  DONE_FETCHING,
  FORGOT_PASSWORD
} from "../../../actions/ActionTypes";
import axios from "axios";
import SelectInput from "../../../form-components/TextInput";

class ResetPasswordModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      error: false,
      errorMessage: "",
      success: false,
      successMessage: "",
      submitting: false
    };
  }

  _validate = (submitting = this.state.submitting) => {
    const { email } = this.state;
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
      submitting
    ) {
      errors.email = "Invalid Email Address";
    }
    return errors;
  };

  actionForgetPassword = async () => {
    const { dispatch } = this.props;
    const data = {
      email: this.state.email
    };
    this.setState({ submitting: true });
    let validator = this._validate(true);
    if (JSON.stringify(validator) !== "{}") {
      return false;
    }
    dispatch({ type: IS_FETCHING });
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "password/email",
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        dispatch({ type: FORGOT_PASSWORD, payload: response.data });
        this.setState(
          {
            success: true,
            successMessage: response.data.message,
            submitting: false
          },
          state => {
            setTimeout(() => {
              this.setState({ success: false, successMessage: "" });
            }, 7000);
          }
        );
        dispatch({ type: DONE_FETCHING });
      } else {
        dispatch({ type: DONE_FETCHING });
        this.setState(
          {
            error: true,
            errorMessage: response.data.message,
            submitting: false
          },
          state => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 7000);
          }
        );
      }
    } catch (error) {
      dispatch({ type: DONE_FETCHING });
      this.setState(
        {
          error: true,
          errorMessage: error.response.data.message,
          submitting: false
        },
        state => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
    }
  };

  render() {
    const { login } = this.props;
    const { email, submitting } = this.state;
    return (
      <div className="sign-up-popup checkout-popup">
        <div className="close-popup">
          <span className="icon-cancel" onClick={this.props.closeModel} />
        </div>
        <div className="ps-title">Reset Password</div>
        <p className="pop-text">
          Enter your email and we’ll email you a link to reset your password.
        </p>
        <div className="feilds-wrapper">
          <div className="form-group">
            <div className="form-group-inner">
              <SelectInput
                validate={() => this._validate()}
                required={true}
                submitting={submitting}
                className="form-control signup-feilds"
                value={email}
                placeholder="Email"
                name="email"
                type="email"
                onChange={e => this.setState({ email: e.target.value })}
                autocomplete="username"
              />
              {/* <input type="email" className="form-control signup-feilds" placeholder="Email" onChange={(e) => this.setState({ email: e.target.value })} /> */}
              <span className="icon-email signup-icons" />
            </div>
          </div>
        </div>
        <div className="signup-login-buttons-wrapper reset">
          <div className="row reset-inner-wrapper">
            <div className="col-md-6 col-md-push-6">
              <button
                className="sign-up-button reset-link-button"
                onClick={() => {
                  this.actionForgetPassword();
                }}
              >
                SEND RESET LINK
              </button>
            </div>
            <div className="col-md-6 col-md-pull-6 sign-up-smedia reset">
              <button className="sign-up-back-button">
                <span className="icon-left-arrow" />{" "}
                <a onClick={login}>Back to login</a>
              </button>
            </div>
          </div>
        </div>
        {this.state.error ? (
          <div className="">
            <div className="messages-wrapper">
              <div className="notification error-message">
                <div className="notification-inner">
                  <img
                    className="img-responsive pic"
                    src="/images/error-icon.svg"
                    alt="error-icon"
                  />
                  <span className="error-notification-cap-lg">
                    {this.state.errorMessage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {this.state.success ? (
          <div className="messages-wrapper">
            <div className="notification success-message">
              <span className="success-notification-cap-sm">
                {this.state.successMessage}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  forgotUserPassword: state.user.forgotUserPassword,
  car: state.car.car
});

export default connect(mapStateToProps)(ResetPasswordModel);
