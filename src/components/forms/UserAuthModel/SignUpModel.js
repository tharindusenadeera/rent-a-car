import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  loginFacebook,
  loginGoogle,
  signinUser
} from "../../../actions/UserActions";
import { GoogleLogin } from "react-google-login-component";
import Oval from "react-preloader-icon/loaders/Oval";
import FacebookLogin from "react-facebook-login";
import PreloaderIcon from "react-preloader-icon";
import "rc-checkbox/assets/index.css";
import Checkbox from "rc-checkbox";
import axios from "axios";
import TextInput from "../../../form-components/TextInput";
import ReactPixel from "react-facebook-pixel";

const SOURCE = localStorage.getItem("_source");
class SignUpModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      email: "",
      password: "",
      referralCode: props.referral ? props.referral : "",
      tacAgreed: false,
      referralChecked: props.referral ? true : false,
      isLoading: false,
      error: false,
      errorMessage: "",
      submitting: false
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  _validate = (submitting = this.state.submitting) => {
    const {
      firstName,
      email,
      password,
      referralCode,
      referralChecked
    } = this.state;
    const errors = {};
    if (!firstName || firstName == "") {
      errors.firstName = "First name is required";
    }
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
    if (referralChecked && (!referralCode || referralCode === "")) {
      errors.referralCode = "Enter the referral  code";
    }
    return errors;
  };

  beforeSubmit = () => {
    this.setState({ submitting: true });
    let validator = this._validate(true);
    if (JSON.stringify(validator) !== "{}") {
      return false;
    }
    if (!this.state.tacAgreed) {
      this.setState(
        {
          error: true,
          errorMessage: "You must agree with Terms and Conditions",
          validate: false
        },
        () => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" });
          }, 5000);
        }
      );
      return false;
    } else {
      return true;
    }
  };

  actionSignUp = async () => {
    ReactPixel.track("CompleteRegistration", { value: 1.0, currency: "USD" });
    const {
      firstName,
      email,
      password,
      tacAgreed,
      referralChecked,
      referralCode
    } = this.state;

    if (!this.beforeSubmit()) {
      return false;
    }
    this.setState({ isLoading: true });
    const { dispatch, timeZoneId, callBack } = this.props;

    const data = {
      first_name: firstName,
      email: email,
      password: password,
      referral_code: referralChecked ? referralCode : null,
      tac: tacAgreed,
      timeZoneId
    };

    if (SOURCE) {
      data.source = SOURCE;
      localStorage.removeItem("_source");
    } else {
      data.source = "direct";
    }
    try {
      if (data.referral_code && referralChecked) {
        const referalsCheck = await await axios.get(
          `${process.env.REACT_APP_API_URL}referral/check`,
          {
            params: {
              code: data.referral_code
            }
          }
        );

        if (!referalsCheck.data.result) {
          this.setState(
            {
              isLoading: false,
              error: true,
              errorMessage: "Invalid referral code"
            },
            () => {
              setTimeout(() => {
                this.setState({ error: false, errorMessage: "" });
              }, 5000);
            }
          );
          return false;
        }
      }
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "v2/users",
        data
      );
      if (!response.data.error) {
        const signIndata = {
          email: this.state.email,
          password: this.state.password
        };
        this.setState({ isLoading: false });
        dispatch(signinUser(signIndata, callBack));
      } else {
        this.setState(
          {
            isLoading: false,
            error: true,
            errorMessage: response.data.message
          },
          () => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 5000);
          }
        );
      }
    } catch (error) {
      if (error.response.data.errors) {
        this.setState(
          {
            isLoading: false,
            error: true,
            errorMessage: error.response.data.errors[0]
          },
          () => {
            setTimeout(() => {
              this.setState({ error: false, errorMessage: "" });
            }, 5000);
          }
        );
      } else {
        this.setState(
          {
            isLoading: false,
            error: true,
            errorMessage: error.response.data.message
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

  responseFacebook = e => {
    const { dispatch, callBack } = this.props;
    ReactPixel.track("Started Sign Up", { value: 0, currency: "USD" });
    if (SOURCE) {
      e.source = SOURCE;
      dispatch(loginFacebook(e, callBack));
      localStorage.removeItem("_source");
    } else {
      dispatch(loginFacebook(e, callBack));
    }
  };

  responseGoogle = e => {
    const { dispatch, callBack } = this.props;
    const extraParams = {};
    if (SOURCE) {
      extraParams.source = SOURCE;
      localStorage.removeItem("_source");
    }
    ReactPixel.track("Started Sign Up", { value: 0, currency: "USD" });
    dispatch(loginGoogle(e, callBack, extraParams));
  };

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const { login, refCodeValidity } = this.props;
    return (
      <div className="sign-up-popup checkout-popup">
        <div className="close-popup">
          <span className="icon-cancel" onClick={this.props.closeModel} />
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <div className="ps-title">Sign up</div>
          <div className="feilds-wrapper">
            <div className="form-group">
              <div className="form-group-inner">
                <TextInput
                  type="text"
                  name="firstName"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.submitting}
                  className="form-control signup-feilds"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={e => this.setState({ firstName: e.target.value })}
                />
                <span className="icon-user signup-icons" />
              </div>
            </div>
            <div className="form-group">
              <div className="form-group-inner">
                <TextInput
                  name="email"
                  type="text"
                  validate={() => this._validate()}
                  required={true}
                  submitting={this.state.submitting}
                  className="form-control signup-feilds"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={e => this.setState({ email: e.target.value })}
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
                  className="form-control signup-feilds"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={e => this.setState({ password: e.target.value })}
                  autocomplete="new-password"
                />
                <span className="icon-password signup-icons" />
              </div>
            </div>
          </div>
          <div className="referral-code-wrapper">
            <div className="referral-text">
              <label>
                <Checkbox
                  name="my-checkbox"
                  onChange={e => {
                    this.setState({
                      referralChecked: e.target.checked
                    });
                  }}
                  checked={this.state.referralChecked ? true : false}
                />
                &nbsp; I have a referral code
              </label>
            </div>
            {this.state.referralChecked && (
              <div className="form-group">
                <div className="form-group-inner">
                  <TextInput
                    type="text"
                    name="referralCode"
                    validate={() => this._validate()}
                    required={false}
                    submitting={this.state.submitting}
                    className="form-control signup-feilds"
                    placeholder="Referral Code"
                    value={this.state.referralCode}
                    onChange={e =>
                      this.setState({ referralCode: e.target.value })
                    }
                  />
                  <span className="icon-referral-tag signup-icons" />
                </div>
              </div>
            )}
          </div>
          <div className="terms-service-wrapper flex-container">
            <div className="terms-left">
              <label>
                <Checkbox
                  name="my-checkbox"
                  onChange={() => {
                    this.setState({ tacAgreed: !this.state.tacAgreed });
                  }}
                />
                &nbsp; I agree to terms and service
              </label>
            </div>
            <div className="terms-right flex-right">
              <Link to="/terms-and-conditions" target="_blank">
                Terms of service
              </Link>
            </div>
          </div>
          <div className="signup-login-buttons-wrapper">
            <div>
              <button
                className="sign-up-button"
                onClick={() => {
                  this.actionSignUp();
                }}
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
                SIGN UP
              </button>
            </div>

            <div className="sign-up-smedia-span">
              <span>or Sign up with</span>
            </div>

            <div className="sign-up-smedia">
              <FacebookLogin
                appId="1573804792688964"
                autoLoad={false}
                fields="name,email,picture"
                callback={this.responseFacebook}
                cssClass=""
                disableMobileRedirect={true}
                textButton=""
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
        </form>
        {refCodeValidity === false && (
          <div className="messages-wrapper">
            <div className="notification error-message">
              <div className="notification-inner">
                <img
                  className="img-responsive pic"
                  src="/images/error-icon.svg"
                  alt="Image"
                />
                <span className="error-notification-cap-lg">
                  Invalid referral code
                </span>
              </div>
            </div>
          </div>
        )}
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
            Already have an RYDE account ?<a onClick={login}> Login</a>
          </p>
        </div>
        <div
          ref={el => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  refCodeValidity: state.user.refCodeValidity,
  timeZoneId: state.common.timeZoneId
});
export default connect(mapStateToProps)(withRouter(SignUpModel));
