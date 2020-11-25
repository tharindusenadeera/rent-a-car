import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import MainNav from "./components/layouts/MainNav";
import MainFooter from "./components/layouts/MainFooter";
import { getLoggedInUser } from "./actions/UserActions";
import ReactPixel from "react-facebook-pixel";
// import { browserHistory } from "react-router-dom";
//import { browserHistory } from "react-router";
//import Helmet from "react-helmet";

const advancedMatching = {};
const options = {
  autoConfig: true,
  debug: false
};

ReactPixel.init("367110953735019", advancedMatching, options);
ReactPixel.pageView();
class App extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    // if( localStorage.access_token ){
    dispatch(getLoggedInUser());
    // }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isFetching: state.user.isFetching
});

export default connect(mapStateToProps)(App);
