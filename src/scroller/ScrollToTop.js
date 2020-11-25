import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FIRST_LOADED_ROUTE } from "../actions/ActionTypes";

class ScrollToTop extends Component {
  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    dispatch({
      type: FIRST_LOADED_ROUTE,
      payload: location.pathname
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(withRouter(ScrollToTop));
