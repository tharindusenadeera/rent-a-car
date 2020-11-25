import React from "react";
import { Input, Select } from "antd";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import { resetPassword } from "../../../actions/ProfileActions";
import { UPDATE_SUCCESS, UPDATE_ERROR } from "../../../actions/ActionTypes";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { tuple } from "antd/lib/_util/type";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      message: "",
      submitting: false,

      new_password: "",
      current_password: "",
      confirm_password: ""
    };
  }

  componentDidUpdate(prevProps) {
    const { success, error, dispatch } = this.props;

    if (success && prevProps.success === "") {
      this.setState(
        {
          success: true,
          message: success,
          submitting: false,
          new_password: "",
          current_password: "",
          confirm_password: ""
        },
        () => {
          setTimeout(() => {
            this.setState({ success: false, message: "" }, state => {
              dispatch({ type: UPDATE_SUCCESS, payload: "" });
            });
          }, 2000);
        }
      );
    }

    if (error && prevProps.error === "") {
      this.setState({ error: true, message: error, submitting: false }, () => {
        setTimeout(() => {
          this.setState({ error: false, message: "" }, state => {
            dispatch({ type: UPDATE_ERROR, payload: "" });
          });
        }, 2000);
      });
    }
  }

  validateForm() {
    const { current_password, new_password, confirm_password } = this.state;
    if (current_password === "" || current_password === null) {
      this.setState({ error: true });
      return false;
    } else if (new_password === "" || new_password === null) {
      this.setState({ error: true });
      return false;
    } else if (confirm_password === "" || confirm_password === null) {
      this.setState({ error: true });
      return false;
    } else {
      this.setState({ error: false, submitting: true }, () => {
        this.handleSave();
      });
    }
  }
  handleSave() {
    const { dispatch } = this.props;
    let data = {
      current_password: this.state.current_password,
      new_password: this.state.new_password,
      re_enter_password: this.state.confirm_password
    };
    dispatch(resetPassword(data));
  }

  render() {
    const {
      error,
      success,
      message,
      current_password,
      new_password,
      confirm_password
    } = this.state;
    return (
      <AccordionItem className="accordion__item">
        <AccordionItemTitle>
          <h3 className=" u-position-relative u-margin-bottom-s">
            Reset password
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          {/* Reset password - Start */}
          <div className="Prof_form_details_box">
            <div className="row">
              <div className="col-md-6">
                <div className="text_field">
                  {current_password && (
                    <label>
                      Current password
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    type="password"
                    className={error && !current_password ? "error" : " "}
                    placeholder="Current password"
                    value={current_password}
                    onChange={e =>
                      this.setState({
                        current_password: e.target.value
                      })
                    }
                  />
                  {error && !current_password && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="text_field">
                  {new_password && (
                    <label>
                      New password
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    type="password"
                    placeholder="New password"
                    className={error && !new_password ? "error" : " "}
                    value={new_password}
                    onChange={e =>
                      this.setState({
                        new_password: e.target.value
                      })
                    }
                  />
                  {error && !new_password && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="text_field">
                  {confirm_password && (
                    <label>
                      Re-enter password
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirm_password}
                    className={error && !confirm_password ? "error" : " "}
                    onChange={e =>
                      this.setState({
                        confirm_password: e.target.value
                      })
                    }
                  />
                  {error && !confirm_password && (
                    <div className="Prof_error_txt">Required</div>
                  )}
                </div>
              </div>
            </div>

            {success && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box success">
                    <img src="/images/profilev2/message_icon_sucess.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}

            {error && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box failed">
                    <img src="/images/profilev2/message_icon_failed.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}
            
            <div className="row">
              <div className="col-sm-12">
                <div className="Prof_btn_box">
                  {/* <button className="Prof_btn Prof_btn_cancel">CANCEL</button> */}
                  <button
                    className="Prof_btn Prof_btn_submit"
                    onClick={() => this.validateForm()}
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
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Reset password - End */}
        </AccordionItemBody>
      </AccordionItem>
    );
  }
}
export default ResetPassword;
