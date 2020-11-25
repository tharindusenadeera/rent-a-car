import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { VERIFY_PHONE_NUMBER } from "../../../actions/ActionTypes";
import {
  getLoggedInUser,
  loginFacebook,
  loginGoogle
} from "../../../actions/UserActions";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login-component";
import axios from "axios";
import TextInput from "../../../form-components/TextInput";

class LoginModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false,
      errorMessage: "",
      email: "",
      password: "",
      submitting: false
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { history, authenticated } = nextProps;
  //   if (history.length === 1) {
  //     history.push("/");
  //   } else if (authenticated === true) {
  //     history.goBack();
  //   }
  // }

  _validate = (submitting = this.state.submitting) => {
    const { email, password } = this.state;
    const errors = {};
    if (!email || email == "") {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
      submitting
    ) {
      errors.email = "Invalid Email Address";
    }
    if (!password || password == "") {
      errors.password = "Password is required";
    }
    return errors;
  };

  actionLogin = async () => {
    this.setState({ submitting: true });
    let validator = this._validate(true);
    if (JSON.stringify(validator) !== "{}") {
      return false;
    }
    this.setState({ isLoading: true });
    const { dispatch, callBack } = this.props;
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    const signInData = {
      username: this.state.email,
      password: this.state.password,
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      grant_type: "password"
    };
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL_AUTH + "oauth/token",
        signInData,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      localStorage.setItem(
        "access_token",
        "Bearer " + response.data.access_token
      );
      dispatch(getLoggedInUser(false, "web", callBack));
      this.setState({ isLoading: false }, () => {});
    } catch (error) {
      if (error.response) {
        this.setState(
          {
            isLoading: false,
            error: true,
            errorMessage: error.response.data.message,
            submitting: false
          },
          () => {
            let time = this.state.error ? 10000 : 5000;
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, time);
          }
        );
      }
    }
  };

  responseFacebook = e => {
    const { dispatch, callBack } = this.props;
    dispatch(loginFacebook(e, callBack));
  };

  responseGoogle = e => {
    const { dispatch, callBack } = this.props;
    dispatch(loginGoogle(e, callBack));
  };

  render() {
    const { signUp, resetPassword } = this.props;

    return (
      <div className="sign-up-popup checkout-popup">
        <form onSubmit={e => e.preventDefault()}>
          <div className="close-popup">
            <span className="icon-cancel" onClick={this.props.closeModel} />
          </div>
          <div className="ps-title">Login</div>
          <div className="feilds-wrapper">
            <div className="form-group">
              <div className="form-group-inner">
                <TextInput
                  type="text"
                  name="email"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.submitting}
                  className="form-control signup-feilds"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={e =>
                    this.setState({
                      email: e.target.value,
                      error: false,
                      errorMessage: ""
                    })
                  }
                  autocomplete="username"
                />
                <span className="icon-email signup-icons" />
              </div>
            </div>
            <div className="form-group">
              <div className="form-group-inner">
                <TextInput
                  type="password"
                  name="password"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.submitting}
                  value={this.state.password}
                  className="form-control signup-feilds"
                  placeholder="Password"
                  onChange={e =>
                    this.setState({
                      password: e.target.value,
                      error: false,
                      errorMessage: ""
                    })
                  }
                  autocomplete="current-password"
                />
                <span className="icon-password signup-icons" />
              </div>
            </div>
          </div>
          <div className="forgot-password-wrapper flex-container">
            <div className="terms-right flex-right">
              <a onClick={resetPassword}>Forgot Password ?</a>
            </div>
          </div>

          <div className="signup-login-buttons-wrapper">
            <div>
              <button
                type="submit"
                className="sign-up-button"
                onClick={() => {
                  this.actionLogin();
                }}
                disabled={this.state.isLoading}
              >
                {this.state.isLoading === true && (
                  <PreloaderIcon
                    loader={Oval}
                    size={20}
                    strokeWidth={8} // min: 1, max: 50
                    strokeColor="#fff"
                    duration={800}
                  />
                )}
                LOGIN
              </button>
            </div>

            <div>
              <span className="or-text">or Login with</span>
            </div>

            <div className="sign-up-smedia">
              <FacebookLogin
                appId="1573804792688964"
                autoLoad={false}
                fields="name,email,picture"
                callback={this.responseFacebook}
                cssClass=""
                textButton=""
                disableMobileRedirect={true}
                icon={
                  <img
                    className="img-responsive sl-fb"
                    src="/images/checkout/share-facebook-icon.png"
                    title="Facebook"
                  />
                }
              />
              <GoogleLogin
                socialId="308823851175-3hl3te1anbvkvliperkqer73mv8akq7i.apps.googleusercontent.com"
                className="metro"
                scope="profile"
                fetchBasicProfile={true}
                responseHandler={this.responseGoogle}
                buttonText=""
              >
                <img
                  className="img-responsive sl-go"
                  src="/images/checkout/google-icon.png"
                  title="Google"
                />
              </GoogleLogin>
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
                      alt="Image"
                    />
                    <span className="error-notification-cap-lg">
                      {this.state.errorMessage}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <hr />
          <div className="bottom-account-wrapper">
            <p>
              Don’t have an RYDE account ? <a onClick={signUp}>Sign up</a>
            </p>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  bookingData: state.booking.bookingData,
  user: state.user.user,
  car: state.car.car,
  authenticated: state.user.authenticated
});

export default withRouter(connect(mapStateToProps)(LoginModel));
