import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

export default function(ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      const { history, authenticated } = this.props;
      if (authenticated === false) {
        history.push("/login");
      }
    }
    componentWillUpdate(nextProps) {
      const { history, authenticated } = nextProps;
      if (authenticated === false) {
        history.push("/login");
      }
    }
    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    authenticated: PropTypes.bool
  };
  const mapStateToProps = state => ({
    authenticated: state.user.authenticated
  });
  return withRouter(connect(mapStateToProps)(Authentication));
}
