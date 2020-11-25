import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

export default function(ComposedComponent) {
  class UnAuthentication extends Component {
    render() {
      const { authenticated } = this.props;
      if (authenticated === true) {
        return <Redirect to="/" />;
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  UnAuthentication.propTypes = {
    authenticated: PropTypes.bool
  };
  const mapStateToProps = state => ({
    authenticated: state.user.authenticated
  });
  return withRouter(connect(mapStateToProps)(UnAuthentication));
}
