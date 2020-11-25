import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "react-modal";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts.js";
import UserAuthModel from "../../components/forms/UserAuthModel";
import Helmet from "react-helmet";
import { isMobileOnly } from "react-device-detect";
import UnAuth from "../requireUnAuth";

Modal.setAppElement("#root");

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModelPopUp: true
      //showReferralModal: false
    };
  }

  componentWillMount() {
    const { user, history, popUp } = this.props;
    document.body.classList.remove("signup");
    if (popUp != true) {
      document.body.classList.add("login");
    }
    if (user.authenticated === true) {
      history.goBack();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.authenticated != this.props.user.authenticated &&
      nextProps.user.authenticated === true &&
      !nextProps.popUp
    ) {
      document.body.classList.remove("login");
      this.props.history.goBack();
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("login");
  }

  handleCloseModal = () => {
    this.setState({ showModelPopUp: false });
  };

  render() {
    const { history } = this.props;

    return (
      <div className="main-wrap">
        <Helmet
          title="Login to Your RYDE Account | RYDE"
          meta={[
            { name: "description", content: "Login to your RYDE account here." }
          ]}
        />
        <div className="sign-up-container">
          <Modal
            isOpen={this.state.showModelPopUp}
            onRequestClose={() => {
              history.push("/");
            }}
            shouldCloseOnOverlayClick={false}
            contentLabel="Modal"
            style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
          >
            <UserAuthModel
              stack={"login"}
              closeModel={() => {
                if (this.props.firstRoute == "/login") {
                  history.push("/");
                } else {
                  history.goBack();
                }
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  firstRoute: state.common.firstLoadedRoute
});

export default connect(mapStateToProps)(withRouter(UnAuth(SignUp)));
