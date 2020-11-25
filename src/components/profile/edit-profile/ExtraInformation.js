import React from "react";
import axios from "axios";
import { Input, Select } from "antd";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { getLoggedInUser } from "../../../actions/UserActions";
import { UPDATE_SUCCESS, UPDATE_ERROR } from "../../../actions/ActionTypes";
import * as Type from "../../../actions/ActionTypes";
import Axios from "axios";
import { authFail } from "../../../actions/AuthAction";
const { TextArea } = Input;
const Option = Select.Option;

class ExtraInformation extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      error: false,
      success: false,
      message: "",
      submitting: false,
      school: user.school,
      work: user.work,
      bio: user.bio ? user.bio : "",
      languages: user.user_languages,
      selectedLang: undefined,
      tab: "ExtraInformation"
    };
  }

  componentDidUpdate(prevProps) {
    const { user, success, error, dispatch } = this.props;
    if (user.user_languages !== prevProps.user.user_languages) {
      this.setState({ languages: user.user_languages });
    }

    if (success && prevProps.success === "") {
      this.setState({ success: true, message: success }, () => {
        setTimeout(() => {
          this.setState(
            { success: false, message: "", submitting: false },
            () => {
              dispatch({ type: UPDATE_SUCCESS, payload: "" });
            }
          );
        }, 2000);
      });
    }

    if (error && prevProps.error === "") {
      this.setState({ error: true, message: error }, () => {
        setTimeout(() => {
          this.setState(
            { error: false, message: "", submitting: false },
            () => {
              dispatch({ type: UPDATE_ERROR, payload: "" });
            }
          );
        }, 2000);
      });
    }

    if (this.props.user !== prevProps.user) {
      this.setInitialData(this.props.user);
    }
  }

  setInitialData(user) {
    this.setState({
      school: this.state.school ? this.state.school : user.school,
      work: this.state.work ? this.state.work : user.work,
      bio: user.bio ? user.bio : "",
      languages: user.user_languages
    });
  }

  getLanguages = languages => languages.map(i => i.id);

  handleSaveProfile = () => {
    const { dispatch } = this.props;
    this.setState({ submitting: true });
    const { school, work, bio, languages } = this.state;
    const { user } = this.props;

    const data = {
      school,
      work,
      bio,
      languages: this.getLanguages(languages)
    };
    Axios.patch(process.env.REACT_APP_API_URL + "users/" + user.id, data, {
      headers: {
        Authorization: localStorage.access_token
      }
    })
      .then(response => {
        if (response.data.error === true) {
          dispatch({ type: Type.UPDATE_ERROR, payload: response.data.message });
        } else {
          dispatch(getLoggedInUser());
          dispatch({
            type: Type.UPDATE_SUCCESS,
            payload: response.data.message
          });
          dispatch({ type: Type.DONE_FETCHING });
          this.setState({
            submitting: false
          });
        }
      })
      .catch(error => {
        dispatch({ type: Type.DONE_FETCHING });
        dispatch(authFail(error));
        if (error.response && error.response.data) {
          dispatch({
            type: Type.UPDATE_ERROR,
            payload: error.response.data.message
          });
        }
      });
  };

  handleChangeBio(value) {
    if (value.length <= 100) {
      this.setState({ bio: value });
    }
  }

  handleChangeLanguage = selectedOption => {
    const { languages } = this.state;
    const { languagesList } = this.props;
    const selected = languagesList.find(i => {
      return i.value === selectedOption;
    });

    const checkExist = languages.find(i => i.id == selectedOption);
    if (!checkExist) {
      languages.push({
        id: selected.value,
        name: selected.label
      });
    }
    this.setState({ languages });
  };

  removeLanguage = id => {
    const { languages } = this.state;
    this.setState(() => {
      return {
        languages: languages.filter(i => i.id != id)
      };
    });
  };

  render() {
    const {
      error,
      success,
      message,
      school,
      work,
      bio,
      languages
    } = this.state;
    const { user } = this.props;
    const completeStatus =
      user.work && user.bio && user.school && user.languages.length > 0
        ? true
        : false;
    return (
      <AccordionItem className="accordion__item">
        <AccordionItemTitle>
          <h3 className=" u-position-relative u-margin-bottom-s">
            Extra information
            <div className="Prof_list_complete">
              {completeStatus && (
                <img src="/images/profilev2/icon-correct.svg" />
              )}
            </div>
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          <div className="Prof_form_details_box">
            <div className="row">
              <div className="col-md-6">
                <div className="text_field">
                  {school && <label>School</label>}
                  <Input
                    placeholder="School"
                    value={school}
                    onChange={e =>
                      this.setState({
                        school: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="text_field">
                  {work && <label>Work</label>}
                  <Input
                    placeholder="Work"
                    value={work}
                    onChange={e =>
                      this.setState({
                        work: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-xs-12 Prof_form_details">
                <div className="row">
                  <div className="col-md-3 col-xs-12 title">Languages</div>
                  <div className="col-md-9 col-xs-12 txt">
                    {languages &&
                      languages.map(lng => {
                        return (
                          <span
                            key={lng.id}
                            style={{
                              display: "inline-block",
                              margin: 5,
                              backgroundColor: "#f46b4b",
                              color: "#fff",
                              padding: 5,
                              borderRadius: 50
                            }}
                          >
                            {lng.name}
                            <span
                              onClick={() => {
                                this.removeLanguage(lng.id);
                              }}
                              style={{
                                cursor: "pointer",
                                paddingLeft: 10
                              }}
                              className="glyphicon glyphicon-remove-circle"
                              aria-hidden="true"
                            />
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="text_field">
                  <Select
                    name="form-field-name"
                    value={this.state.selectedLang}
                    showSearch
                    placeholder="Select languages"
                    optionFilterProp="children"
                    onChange={value => {
                      this.handleChangeLanguage(value);
                    }}
                  >
                    {this.props.languagesList &&
                      this.props.languagesList.map((item, index) => {
                        return (
                          <Option key={index} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="text_field">
                  {bio && (
                    <label>
                      Bio
                      <span className="fields-requred">*</span>
                    </label>
                  )}
                  <TextArea
                    placeholder="Tell people about your self"
                    autosize
                    value={bio}
                    onChange={e => this.handleChangeBio(e.target.value)}
                  />
                  <div className="text_count">{bio.length}/100</div>
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
                    onClick={this.handleSaveProfile}
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
        </AccordionItemBody>
      </AccordionItem>
    );
  }
}
export default ExtraInformation;
