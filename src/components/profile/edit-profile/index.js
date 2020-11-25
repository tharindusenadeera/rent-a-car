import React, { Fragment } from "react";
import { connect } from "react-redux";
import ProfileLeft from "./ProfileLeft";
import ProfileRight from "./ProfileRight";
import { getUsStates } from "../../../actions/CarActions";
import { fetchLanguagesList } from "../../../actions/ProfileActions";
import { countryList } from "../../../consts/consts";
import "react-accessible-accordion/dist/minimal-example.css";
import "react-accessible-accordion/dist/fancy-example.css";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpne: false,
      isOpen: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUsStates());
    dispatch(fetchLanguagesList());
  }

  countryArray = () => {
    let array = [];
    countryList &&
      countryList.map((item, key) => {
        return array.push({
          value: item.code,
          key: item.name
        });
      });
    return array;
  };

  handleMessage = data => {
    this.setState({ isOpen: data });
  };

  render() {
    const { isOpne, isOpen } = this.state;
    const { user } = this.props;

    return (
      <div className="Prof_page_wrapper">
        {user && user.stripe_connect_account_status == "pending" ? (
          <div className="row">
            <div className="col-md-12">
              <div className="Prof_notifimessage">
                <span>
                  We have updated our policies for your upcoming payouts as a
                  measure to improve our services and want you to make sure all
                  of the mandatory information in car owners only section has
                  been filled in clearly and accurately.
                </span>
                <button
                  className="Prof_btn_notify"
                  onClick={() => this.setState({ isOpne: !isOpne })}
                  disabled={isOpen}
                >
                  Update Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Fragment />
        )}
        <div className="row">
          {/* Left Side */}
          {this.props.user && (
            <ProfileLeft
              user={this.props.user}
              dispatch={this.props.dispatch}
              picUpdateSuccess={this.props.picUpdateSuccess}
              error={this.props.updateError}
              dispatch={this.props.dispatch}
            />
          )}

          {/* Right Side */}
          {this.props.user && (
            <ProfileRight
              user={this.props.user}
              verifyPhone={this.props.verifyPhone}
              usStates={this.props.usStates}
              countryArray={this.countryArray()}
              languageList={this.props.languageList}
              userCards={this.props.userCards}
              success={this.props.updateSuccess}
              error={this.props.updateError}
              dispatch={this.props.dispatch}
              isOpne={isOpne}
              handleMessage={this.handleMessage}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    verifyPhone: state.user.verifyPhoneNumber,
    usStates: state.car.usStates,
    isFetching: state.profile.isFetching,
    languageList: state.profile.languageList,
    updateSuccess: state.profile.updateSuccess,
    picUpdateSuccess: state.profile.picUpdateSuccess,
    updateError: state.profile.updateError
  };
};

export default connect(mapStateToProps)(EditProfile);
