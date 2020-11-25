import React from "react";
import { connect } from "react-redux";
import PasswordReset from "./PasswordReset";

const PasswordResetPage = props => {
  const { match } = props;
  const token = match.params.token;
  return (
    <div className="login-page-wrap">
      <div className="container">
        <PasswordReset
          token={token}
          dispatch={props.dispatch}
          isFetching={props.isFetching}
          updateSuccess={props.updateSuccess}
          updateError={props.updateError}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    resetPassword: state.user.resetPassword,
    isFetching: state.profile.isFetching,
    updateSuccess: state.profile.updateSuccess,
    updateError: state.profile.updateError
  };
};

export default connect(mapStateToProps)(PasswordResetPage);
