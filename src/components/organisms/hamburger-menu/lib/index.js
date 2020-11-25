import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../../../actions/UserActions";

class HmaburgerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logOut = () => {
    const { dispatch } = this.props;
    dispatch(logoutUser);
  };

  render() {
    const { authenticated, user } = this.props;

    return (
      <Fragment>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        {/* Before login */}
        {authenticated === false && (
          <label className="menu-icon" htmlFor="menu-btn">
            <span className="navicon"></span>
          </label>
        )}

        {/* Before login */}

        {/* After login */}
        {authenticated === true && (
          <label className="menu-icon avatar-wrapper" htmlFor="menu-btn">
            <img
              src={
                user.profile_image_thumb
                  ? user.profile_image_thumb
                  : "https://cdn.rydecars.com/static-images/default-avatar.jpg"
              }
              className="avatar"
            />
          </label>
        )}

        {/* After login */}

        <ul className="menu">
          {/* Before login */}
          {authenticated === false && (
            <Fragment>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </Fragment>
          )}
          {/* Before login */}

          {/* After login */}
          {authenticated === true && (
            <Fragment>
              <li>
                <Link to="/my-profile/trips">Trips</Link>
              </li>
              <li>
                <Link to="/my-profile/edit-profile">Profile</Link>
              </li>
            </Fragment>
          )}

          <li>
            <a href="https://rydecarshelp.zendesk.com" target="_blank">How Ryde Works</a>
          </li>
          <li>
            <Link to="/about-us">About Us</Link>
          </li>
          {authenticated === true && (
            <li>
              <a onClick={this.logOut}>Logout</a>
            </li>
          )}
        </ul>
        {/* After login */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  authenticated: state.user.authenticated,
  timeZoneId: state.common.timeZoneId
});

export default connect(mapStateToProps)(HmaburgerMenu);
