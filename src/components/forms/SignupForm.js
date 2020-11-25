import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login-component";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import {
  loginFacebook,
  loginGoogle,
  signinUser
} from "../../actions/UserActions";
import TelInput from "../../form-components/TelInput";
import { TextInput } from "../../form-components";
import { SIGNUP_FETCHING } from "../../actions/ActionTypes";
import axios from "axios";

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
      referralCode: props.referral ? props.referral : "",
      tacAgreed: false,
      referralChecked: props.referral ? true : false,
      isLoading: false,
      error: false,
      errorMessage: "",
      submitting: false
    };

    this.responseFacebook = this.responseFacebook.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { onSignUp, user, authenticated } = nextProps;
    if (authenticated && user.id) {
      onSignUp({ referralModal: true, signUpModal: false });
    }
  }

  formValidate = () => {
    const {
      first_name,
      last_name,
      email,
      password,
      tacAgreed,
      phone_number
    } = this.state;
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !tacAgreed ||
      !phone_number
    ) {
      return false;
    } else {
      return true;
    }
  };

  actionSignUp = async () => {
    const {
      first_name,
      last_name,
      email,
      password,
      tacAgreed,
      referralCode,
      phone_number
    } = this.state;

    if (!this.formValidate()) {
      this.setState({ error: true });
      return false;
    }

    this.setState({ submitting: true });

    const { dispatch, timeZoneId } = this.props;
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      password: password,
      referral_code: referralCode ? referralCode : null,
      tac: tacAgreed,
      timeZoneId
    };
    try {
      if (data.referral_code) {
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
              submitting: false,
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
      axios
        .post(`${process.env.REACT_APP_API_URL}users`, data)
        .then(res => {
          if (res.data.response) {
            this.setState({ submitting: false });
            dispatch(signinUser({ email, password }));
          }
        })
        .catch(e => {
          if (e.response) {
            this.setState({
              submitting: false,
              error: true,
              errorMessage: e.response.data.message
                ? e.response.data.message
                : e.response.data.errors[0]
            });
            setTimeout(() => {
              this.setState({
                error: false,
                errorMessage: ""
              });
            }, 5000);
          }
        });
    } catch (error) {
      if (error.response.data.errors) {
        this.setState(
          {
            submitting: false,
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
            submitting: false,
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

  handleTermsAgreement = () => {
    this.setState({ tacAgreed: !this.state.tacAgreed });
  };

  responseFacebook(e) {
    const { dispatch } = this.props;
    dispatch(loginFacebook(e));
  }

  responseGoogle(e) {
    const { dispatch } = this.props;
    dispatch(loginGoogle(e));
  }

  render() {
    const { title, refCodeValidity } = this.props;
    const {
      first_name,
      last_name,
      email,
      password,
      submitting,
      tacAgreed,
      error
    } = this.state;

    return (
      <div className="sign-up-container">
        <div className="row">
          <h1>{title}</h1>
          <div className="col-lg-12">
            <div className="form-wrap">
              <div className="row">
                <div className="col-md-6 field-sep">
                  <div className="form-group">
                    <TextInput
                      placeholder="First Name"
                      value={first_name}
                      onChange={first_name => this.setState({ first_name })}
                      onBlur={setErrors => {
                        setErrors(function() {
                          if (!first_name) {
                            return { error: "First name is required" };
                          }
                          return { error: false };
                        });
                      }}
                      setErrors={() => {
                        if (!first_name && error) {
                          return { error: "First name is required" };
                        }
                        return { error: false };
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6 field-sep">
                  <div className="form-group">
                    <TextInput
                      placeholder="Last Name"
                      value={last_name}
                      onChange={last_name => this.setState({ last_name })}
                      onBlur={setErrors => {
                        setErrors(function() {
                          if (!last_name) {
                            return { error: "Last name is required" };
                          }
                          return { error: false };
                        });
                      }}
                      setErrors={() => {
                        if (!last_name && error) {
                          return { error: "Last name is required" };
                        }
                        return { error: false };
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row field-sep">
                <div className="col-md-12">
                  <div className="form-group">
                    <TelInput
                      onBlurValidator={true}
                      value={this.state.phone_number}
                      className="form-control"
                      onChange={phone_number => this.setState({ phone_number })}
                      errorFnc={() => {
                        if (error) {
                          if (!this.state.phone_number) {
                            return "Phone number required";
                          }
                          if (
                            this.state.phoneNumber &&
                            this.state.phoneNumber.length !== 12
                          ) {
                            return "Invalid phone mumber";
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row field-sep">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextInput
                      placeholder="Email"
                      value={email}
                      onChange={email => this.setState({ email })}
                      onBlur={setErrors => {
                        setErrors(function() {
                          if (!email) {
                            return { error: "Email is required" };
                          }
                          if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                              email
                            )
                          ) {
                            return { error: "Invalid Email Address" };
                          }
                          return { error: false };
                        });
                      }}
                      setErrors={() => {
                        if (!email && error) {
                          return { error: "Email is required" };
                        }
                        if (
                          email &&
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                            email
                          )
                        ) {
                          return { error: "Invalid Email Address" };
                        }
                        return { error: false };
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row field-sep">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={password => this.setState({ password })}
                      onBlur={setErrors => {
                        setErrors(function() {
                          if (!password) {
                            return { error: "Password is required" };
                          }
                          return { error: false };
                        });
                      }}
                      setErrors={() => {
                        if (!password && error) {
                          return { error: "Password is required" };
                        }
                        return { error: false };
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row field-sep">
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="referralCode"
                      required={false}
                      className="form-control"
                      placeholder="Referral Code"
                      value={this.state.referralCode}
                      onChange={e =>
                        this.setState({ referralCode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <br />
                  <Link to="/terms-and-conditions" target="_blank">
                    Terms of service
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 terms-conditions-outer">
                  <div className="terms-conditions">
                    <input
                      type="checkbox"
                      name="tac"
                      id="tac"
                      data-validate-input=""
                      checked={this.state.tacAgreed}
                      onChange={this.handleTermsAgreement}
                    />{" "}
                    I agree to the terms and conditions
                  </div>
                  {error && !tacAgreed && (
                    <span className="rc-input-error-txt"> Required </span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
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
                  {this.state.error && this.state.errorMessage ? (
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
                  ) : null}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block sign-up-btn"
                    onClick={() => {
                      this.actionSignUp();
                    }}
                  >
                    {submitting === true && (
                      <PreloaderIcon
                        loader={Oval}
                        size={20}
                        strokeWidth={8} // min: 1, max: 50
                        strokeColor="#fff"
                        duration={800}
                      />
                    )}
                    Sign Up
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <p>
                    Already have an account?
                    <Link to="/login"> Sign In</Link>
                  </p>
                  <div className="or-text-wrapper">
                    <hr />
                    <p>or</p>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <FacebookLogin
              appId="1573804792688964"
              autoLoad={false}
              fields="name,email,picture"
              callback={this.responseFacebook}
              cssClass="facebook-btn"
              icon="fa-facebook"
              disableMobileRedirect={true}
            />

            <br />
            <br />

            <GoogleLogin
              socialId="308823851175-3hl3te1anbvkvliperkqer73mv8akq7i.apps.googleusercontent.com"
              className="google-btn"
              scope="profile"
              fetchBasicProfile={true}
              responseHandler={this.responseGoogle}
              buttonText="Login With Google"
            >
              {/* <i className="fa fa-google" style={{ paddingRight: "1rem" }} /> */}
              <img
                className="img-responsive sl-go"
                src="/images/checkout/google-icon-32.png"
                title="Google"
              />
            </GoogleLogin>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSignupFetching: state.user.isSignupFetching,
    user: state.user.user,
    refCodeValidity: state.user.refCodeValidity
  };
};

export default connect(mapStateToProps)(SignupForm);
