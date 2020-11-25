import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MainNav from "./layouts/MainNav";
import MainFooter from "./layouts/MainFooter";

export default function(ComposedComponent) {
  class Authentication extends Component {
    render() {
      if (this.props.accessdenied === true) {
        return (
          <Fragment>
            <MainNav />
            <div className="container contact-page">
              <h1>403 forbidden</h1>
              <h3>you don't have permission to access / on this page</h3>
            </div>
            <MainFooter />
          </Fragment>
        );
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    accessdenied: PropTypes.bool
  };
  const mapStateToProps = state => ({
    accessdenied: state.user.accessdenied
  });
  return withRouter(connect(mapStateToProps)(Authentication));
}
