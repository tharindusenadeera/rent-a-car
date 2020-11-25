import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
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
    document.body.classList.remove("login");
    if (popUp != true) {
      document.body.classList.add("signup");
    }
    if (user.authenticated === true) {
      history.push("/");
    }
  }

  handleCloseModal = () => {
    this.setState({ showModelPopUp: false });
  };

  render() {
    const { history, match, firstRoute } = this.props;
    const searchData = queryString.parse(history.location.search);

    return (
      <div className="main-wrap">
        <div className={!this.state.showModelPopUp ? "login-page-wrap" : null}>
          <Helmet
            title="Sign Up to Rent or List Your Car with Ryde | RYDE"
            meta={[
              {
                name: "description",
                content:
                  "Get started with RYDE here. It's easy! Using email or Facebook, create an account and start renting cars from trusted local owners. You can also earn money by renting your own car to verified renters from our community."
              }
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
                searchData={searchData}
                referral={match.params.referral ? match.params.referral : null}
                stack={"signup"}
                closeModel={() => {
                  if (
                    firstRoute == "signup" ||
                    firstRoute.split("/")[1] == "signup"
                  ) {
                    return history.push("/");
                  } else {
                    return history.goBack();
                  }
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  firstRoute: state.common.firstLoadedRoute
});

export default connect(mapStateToProps)(withRouter(SignUp));
