import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Input, Button } from "antd";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login-component";
import "./style.css";
import { isMobileOnly } from "react-device-detect";
import Axios from "axios";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import PageVisibility from "react-page-visibility";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import { loginFacebook, loginGoogle } from "../../actions/UserActions";
import ModalPopUp from "react-modal";

class EmailPopupContent extends Component {
  constructor(props) {
    super(props);
    if (!localStorage.promotion_a_data) {
      localStorage.setItem(
        "promotion_a_data",
        JSON.stringify({
          postEmail: false,
          email: "",
          isOpen: false
        })
      );
    }
    this.state = {
      showModelPopUp: false,
      email: "",
      error: "",
      submiting: false,
      success: false,
      isVisible: true
    };
  }

  responseFacebook = e => {
    const { dispatch } = this.props;
    dispatch(loginFacebook(e));
  };

  responseGoogle = e => {
    const { dispatch } = this.props;
    dispatch(loginGoogle(e));
  };

  componentDidMount() {
    const { isVisible } = this.state;
    setTimeout(() => {
      if (isVisible) {
        this.loadPopup();
      }
    }, 1000);
  }

  loadPopup = () => {
    const { isVisible } = this.state;
    const submittedData = localStorage.promotion_a_data;
    if (
      isVisible === true &&
      JSON.parse(submittedData).isOpen == false &&
      JSON.parse(submittedData).postEmail == false
    ) {
      this.setState({ showModelPopUp: true });
      localStorage.setItem(
        "promotion_a_data",
        JSON.stringify({
          postEmail: false,
          email: "",
          isOpen: true
        })
      );
    }
  };

  _checkEmailIsCorrect = email => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return false;
    } else {
      return true;
    }
  };

  submit = () => {
    const { email, submiting } = this.state;
    if (submiting) {
      return false;
    }
    this.setState({ submiting: true });
    if (!email) {
      this.setState({ error: "Email is required !", submiting: false });
      return false;
    }
    if (this._checkEmailIsCorrect(email) === false) {
      this.setState({ error: "Incorrect email address !", submiting: false });
      return false;
    }

    Axios.post(
      `${process.env.REACT_APP_API_URL}klaviyo-signup`,
      { email },
      {
        headers: {
          Authorization: localStorage.access_token
        }
      }
    )
      .then(res => {
        this.setState({ success: true, submiting: false });
        setTimeout(() => {
          this.setState({ success: false, showModelPopUp: false });
        }, 5000);
        localStorage.setItem(
          "promotion_a_data",
          JSON.stringify({
            postEmail: true,
            email: email
          })
        );
        if (this.props.submitForm) this.props.submitForm();
      })
      .catch(e => {
        this.setState({ showModelPopUp: false, submiting: false });
        console.log("Error", e);
      });
  };

  closePopup = () => {
    this.setState({ showModelPopUp: false }, () => {
      const submittedData = localStorage.promotion_a_data;
      if (!submittedData) {
        localStorage.setItem(
          "promotion_a_data",
          JSON.stringify({
            postEmail: false,
            email: ""
          })
        );
      }
    });
  };
  handleVisibilityChange = isVisible => {
    this.setState({ isVisible });
  };

  render() {
    const { email, error, submiting, success } = this.state;

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <ModalPopUp
          isOpen={this.state.showModelPopUp}
          shouldCloseOnOverlayClick={false}
          contentLabel="Modal"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          className="EmailPromoPop"
        >
          <div className="sign-up-popup checkout-popup email-pop-container">
            <button className="em-close-btn" onClick={() => this.closePopup()}>
              <img src="/images/close_icon.png" />
            </button>
            {success === false ? (
              <Fragment>
                <div className="em-text-sm">get an instant</div>
                <div className="em-text-lg">
                  <span className="em-text-lsm">$</span>30 off
                </div>
                <div className="em-text-md">on your first trip</div>
                <div className="form-group">
                  <div className="form-group-inner">
                    <Input
                      value={email}
                      onChange={e =>
                        this.setState({
                          email: e.target.value,
                          error: "",
                          submiting: false
                        })
                      }
                      className="em-input"
                      shape="circle"
                      placeholder="Enter your email address"
                    />
                    <span className="icon-email signup-icons" />
                  </div>
                </div>
                {error ? (
                  <span className="GC_form_error em-error">{error}</span>
                ) : (
                  ""
                )}
                <Button className="em-coupon-btn" onClick={() => this.submit()}>
                  {submiting && (
                    <PreloaderIcon
                      loader={Oval}
                      size={20}
                      strokeWidth={8} // min: 1, max: 50
                      strokeColor="#fff"
                      duration={800}
                      style={{
                        float: "left"
                      }}
                    />
                  )}
                  GET MY COUPON NOW
                </Button>

                <div className="em-login-so">
                  Or login with
                  <ul className="list-unstyled list-inline">
                    <li>
                      <FacebookLogin
                        appId="1573804792688964"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        cssClass=""
                        disableMobileRedirect={true}
                        textButton=""
                        icon={
                          <a>
                            <img src="/images/checkout/share-facebook-icon.png" />
                          </a>
                        }
                      />
                    </li>
                    <li>
                      <GoogleLogin
                        socialId="308823851175-3hl3te1anbvkvliperkqer73mv8akq7i.apps.googleusercontent.com"
                        className="metro"
                        scope="profile"
                        fetchBasicProfile={true}
                        responseHandler={this.responseGoogle}
                        buttonText=""
                      >
                        <a>
                          <img
                            src="/images/checkout/google-icon.png"
                            title="Google"
                          />
                        </a>
                      </GoogleLogin>
                      {/* <a>
                    <img src="/images/checkout/share-google-plus-icon.png" />
                  </a> */}
                    </li>
                  </ul>
                </div>
                <div className="em-bottom-sec">
                  <div className="em-ca">* Conditions Apply</div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="submit-success-mesg-wrapper">
                  <button
                    className="em-close-btn"
                    onClick={() => this.closePopup()}
                  >
                    <img src="/images/close_icon.png" />
                  </button>
                  <img src="/images/checkout/success-icon-green.png" />
                  <div className="lr-text-lg">Thank you</div>
                  <p className="lr-text-sm">Your email has been received.</p>
                </div>
              </Fragment>
            )}
          </div>
        </ModalPopUp>
      </PageVisibility>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user.user
  };
};
export default connect(mapStateToProps)(EmailPopupContent);
