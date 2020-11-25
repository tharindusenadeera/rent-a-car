import React, { Component } from "react";
import { connect } from "react-redux";
import { Radio } from "antd";
import {
  IndividualAccount,
  CorporateAccount,
  PaymentAccountView
} from "../../organisms/profile-car-owners-only";
import { getUsStates } from "../../../actions/CarActions";

const ACCOUNT_TYPE_IS_INDIVIDUAL = 1;
const ACCOUNT_TYPE_IS_CORPORATE = 2;

class StepCarOwnersOnly extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      accountType: ACCOUNT_TYPE_IS_INDIVIDUAL,
      completeStatus:
        user && user.stripe_connect_account_id == null ? false : true,
      clickToEdit: false,
      savedAccountType: "",
      editView: false
    };
  }

  componentDidMount() {
    const { user, dispatch } = this.props;
    if (user && user.stripe_connect_account_id != null) {
      this.setState({ completeStatus: true });
    } else {
      this.setState({ completeStatus: false });
    }
    dispatch(getUsStates());
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  handleClick = () => {
    this.divElement.click();
  };

  handleEdit = data => {
    this.setState({
      clickToEdit: true,
      savedAccountType: data,
      editView: true,
      accountType:
        data == "individual"
          ? ACCOUNT_TYPE_IS_INDIVIDUAL
          : ACCOUNT_TYPE_IS_CORPORATE
    });
  };

  afterSubmit = () => {
    this.setState({ completeStatus: true, clickToEdit: false });
  };

  render() {
    const {
      accountType,
      completeStatus,
      clickToEdit,
      editView,
      savedAccountType
    } = this.state;
    const { user, usStates } = this.props;

    return (
      <div className="Prof_body">
        <h3 className=" u-position-relative u-margin-bottom-s">
          Car owners only
        </h3>
        {!completeStatus || clickToEdit ? (
          <div className="Prof_form_details_box">
            <div className="row">
              <div className="col-md-12">
                <div className="Prof_owner_desc">
                  Please choose Individual option if you operate your business
                  as an individual or choose corporate option if you operate
                  your business as a registered company on this platform.
                </div>
                <div>
                  <Radio.Group
                    onChange={e =>
                      this.setState({ accountType: e.target.value })
                    }
                    value={accountType}
                    className="Prof_owner_radiogroup"
                  >
                    <Radio value={ACCOUNT_TYPE_IS_INDIVIDUAL}>Individual</Radio>
                    <Radio value={ACCOUNT_TYPE_IS_CORPORATE}>Corporate</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
            {accountType === 1 || savedAccountType == "individual" ? (
              <IndividualAccount
                {...this.props}
                editView={editView}
                submitted={this.afterSubmit}
              />
            ) : (
              <CorporateAccount
                {...this.props}
                usStates={usStates}
                editView={editView}
                submitted={this.afterSubmit}
              />
            )}
          </div>
        ) : (
          <PaymentAccountView user={user} handleEdit={this.handleEdit} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    usStates: state.car.usStates
  };
};

export default connect(mapStateToProps)(StepCarOwnersOnly);
