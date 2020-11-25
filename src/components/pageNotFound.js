import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MainNav from "./layouts/MainNav";
import MainFooter from "./layouts/MainFooter";

export default function(ComposedComponent) {
  class PageNotFound extends Component {
    render() {
      if (this.props.pageNotFound === true) {
        return (
          <Fragment>
            <MainNav />
            <div className="container contact-page">
              <h1>404 Page Not Found</h1>
            </div>
            <MainFooter />
          </Fragment>
        );
      }
      return <ComposedComponent {...this.props} />;
    }
  }

  PageNotFound.propTypes = {
    pageNotFound: PropTypes.bool
  };

  const mapStateToProps = state => ({
    pageNotFound: state.common.pageNotFound
  });

  return withRouter(connect(mapStateToProps)(PageNotFound));
}
