import React, { Component } from "react";
import { Link } from "react-router-dom";

class TopNavBar extends Component {
  navigateRoute() {
    this.props.navigationState(false);
  }

  render() {
    return (
      <nav className="fixed-drop-down-menu">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ul className="pull-right top-nav">
                <li onClick={this.navigateRoute.bind(this)}>
                  <a href="https://rydecarshelp.zendesk.com" target="_blank">How Ryde Works</a>
                </li>
                <li onClick={this.navigateRoute.bind(this)}>
                  <Link to="/safety">Safety</Link>
                </li>
                <li onClick={this.navigateRoute.bind(this)}>
                  <Link to="/contact-us">Contact Us</Link>
                </li>
                <li onClick={this.navigateRoute.bind(this)}>
                  <Link to="/about-us">About Us</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
export default TopNavBar;
