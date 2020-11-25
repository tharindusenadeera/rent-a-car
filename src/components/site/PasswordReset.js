import React, { Component } from "react";
import { Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { forgotPassword } from "../../actions/ProfileActions";
import { UPDATE_ERROR, UPDATE_SUCCESS } from "../../actions/ActionTypes";
import "antd/lib/input/style/index.css";

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: "",
      success: false,
      successMessage: "",

      submitting: false,
      email: "",
      newPassword: "",
      confirmPassword: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    // if (
    //   nextProps.user.authenticated != this.props.user.authenticated &&
    //   nextProps.user.authenticated === true
    // ) {
    //   this.props.history.goBack("/");
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props.updateSuccess && prevProps.updateSuccess === "") {
      this.setState(
        {
          success: true,
          successMessage: this.props.updateSuccess,
          submitting: false
        },
        () => {
          setTimeout(() => {
            this.setState({ success: false, successMessage: "" }, state => {
              this.props.dispatch({ type: UPDATE_SUCCESS, payload: "" });
            });
          }, 9000);
        }
      );
    }

    if (this.props.updateError && prevProps.updateError === "") {
      this.setState(
        {
          error: true,
          errorMessage: this.props.updateError,
          submitting: false
        },
        () => {
          setTimeout(() => {
            this.setState({ error: false, errorMessage: "" }, state => {
              this.props.dispatch({ type: UPDATE_ERROR, payload: "" });
            });
          }, 9000);
        }
      );
    }
  }

  handleSave = () => {
    const { email, confirmPassword, newPassword } = this.state;

    const resetData = {
      email: email,
      password: newPassword,
      password_confirmation: confirmPassword,
      token: this.props.token
    };

    this.props.dispatch(forgotPassword(resetData));
  };

  validate() {
    const { email, confirmPassword, newPassword } = this.state;
    if (email === "" || email === null) {
      this.setState({ error: true });
      return false;
    } else if (newPassword === "" || newPassword === null) {
      this.setState({ error: true });
      return false;
    } else if (confirmPassword === "" || confirmPassword === null) {
      this.setState({ error: true });
      return false;
    } else {
      this.setState({ error: false, submitting: true }, () => {
        this.handleSave();
      });
    }
  }

  render() {
    const {
      email,
      confirmPassword,
      newPassword,
      error,
      success,
      errorMessage,
      successMessage
    } = this.state;
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <div className="sign-up-container">
            <div className="password-reset-wrapper">
              <h3>Password reset</h3>
              <div>
                <div className="error">
                  {error && errorMessage !== "" && (
                    <div className="text-error"> {errorMessage} </div>
                  )}

                  {/* {resetPassword.errors && resetPassword.errors.length ? (
                  <div className="text-error"> {resetPassword.errors[0]} </div>
                ) : null} */}
                </div>

                {success && successMessage !== "" && (
                  <div className="success">
                    <div className="text-success">
                      {successMessage} <Link to="/login"> Login </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="control-label">Email</label>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e =>
                    this.setState({
                      email: e.target.value
                    })
                  }
                />
                {error && !email && (
                  <div className="Prof_error_txt">Required</div>
                )}
              </div>

              <div className="form-group">
                <label className="control-label">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={e =>
                    this.setState({
                      newPassword: e.target.value
                    })
                  }
                />
                {error && !newPassword && (
                  <div className="Prof_error_txt">Required</div>
                )}
              </div>

              <div className="form-group">
                <label className="control-label">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Retype your new password"
                  value={confirmPassword}
                  onChange={e =>
                    this.setState({
                      confirmPassword: e.target.value
                    })
                  }
                />
                {error && !confirmPassword && (
                  <div className="Prof_error_txt">Required</div>
                )}
              </div>

              <div className="form-group">
                <button
                  onClick={() => this.validate()}
                  className="btn sign-up-button"
                >
                  {this.state.submitting === true && (
                    <div style={{ paddingRight: "5px", paddingTop: "2px" }}>
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
                    </div>
                  )}
                  Submit
                </button>
              </div>

              {/* <div className="row">
              <div className="col-sm-12">
                {error && <strong className="b_error">{error}</strong>}
              </div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(PasswordReset);
