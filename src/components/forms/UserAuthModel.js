import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoginModel from "../forms/UserAuthModel/LoginModel";
import SignUpModel from "../forms/UserAuthModel/SignUpModel";
import SignUpSuccessModal from "./UserAuthModel/SignUpSuccessModal";
import ResetPasswordModel from "../forms/UserAuthModel/ResetPasswordModel";
class UserAuthModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModel: false,
      signUpModel: false,
      resetPasswordModel: false,
      signUpScuccessModal: false
    };
  }

  componentDidMount() {
    const { stack } = this.props;
    if (stack == "checkout") {
      this.setState({
        loginModel: true,
        signUpModel: false,
        resetPasswordModel: false
      });
    } else if (stack == "signup") {
      this.setState({
        loginModel: false,
        signUpModel: true,
        resetPasswordModel: false
      });
    } else if (stack == "login") {
      this.setState({
        loginModel: true,
        signUpModel: false,
        resetPasswordModel: false
      });
    }
  }

  signUp = () => {
    this.setState({
      loginModel: false,
      signUpModel: true,
      resetPasswordModel: false
    });
  };

  login = () => {
    this.setState({
      loginModel: true,
      signUpModel: false,
      resetPasswordModel: false
    });
  };

  afterLogin = () => {
    const { callBack, history } = this.props;
    if (callBack) {
      return callBack();
    }
    if (this.props.firstRoute == "/login") {
      if (history.length > 2) {
        return history.goBack();
      }
      return history.push("/");
    } else {
      return history.goBack();
    }
  };

  resetPassword = () => {
    this.setState({
      loginModel: false,
      signUpModel: false,
      resetPasswordModel: true
    });
  };

  onSignUpSuccess = () => {
    return this.setState({
      signUpScuccessModal: true,
      signUpModel: false
    });
  };

  render() {
    const { stack, referral, page, promoCloseCallBack } = this.props;
    const {
      loginModel,
      signUpModel,
      resetPasswordModel,
      signUpScuccessModal
    } = this.state;

    return (
      <Fragment>
        {loginModel && (
          <LoginModel
            signUp={this.signUp}
            resetPassword={this.resetPassword}
            closeModel={this.props.closeModel}
            stack={stack}
            callBack={this.afterLogin}
          />
        )}

        {signUpModel && (
          <SignUpModel
            login={this.login}
            closeModel={this.props.closeModel}
            stack={stack}
            referral={referral}
            callBack={() => this.onSignUpSuccess()}
          />
        )}

        {resetPasswordModel && (
          <ResetPasswordModel
            login={this.login}
            closeModel={this.props.closeModel}
          />
        )}

        {signUpScuccessModal && (
          <SignUpSuccessModal
            closeModel={this.props.closeModel}
            promoCloseCallBack={promoCloseCallBack}
            page={page ? true : false}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  firstRoute: state.common.firstLoadedRoute
});

export default connect(mapStateToProps)(withRouter(UserAuthModel));
