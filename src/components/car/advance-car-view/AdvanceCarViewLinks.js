import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toggleSubDrawer } from "../../../actions/CommenActions";

class AdvanceCarViewLinks extends Component {
  _toggleSubDrawer = (subDrawerName = null) => {
    const { dispatch, isSubDrawerOpen } = this.props;
    if (subDrawerName) {
      const data = {
        isSubDrawerOpen: !isSubDrawerOpen,
        subDrawerName: subDrawerName
      };
      dispatch(toggleSubDrawer(data));
    }
  };

  render() {
    const { car_id } = this.props;
    return (
      <div className="row padding-outer">
        <button
          className="visible-xs unstyled-button drawer-edit-btn"
          onClick={() => this._toggleSubDrawer("car-summary")}
        >
          <span>Car summary</span>
          <img
            src="/images/car-edit/left-arrow.svg"
            className="next-icon"
            alt="Next"
          />
        </button>

        <button className="unstyled-button drawer-edit-btn">
          <Link to={`/car/update/${car_id}`}>
            <span>Car edit</span>
            <img
              src="/images/car-edit/left-arrow.svg"
              className="next-icon"
              alt="Next"
            />
          </Link>
        </button>

        <button className="unstyled-button drawer-edit-btn">
          <Link to={this.props.car_route} target="_blank">
            <span>Car details</span>
            <img
              src="/images/car-edit/left-arrow.svg"
              className="next-icon"
              alt="Next"
            />
          </Link>
        </button>

        <button className="unstyled-button drawer-edit-btn">
          <Link to={`/car-availability/${car_id}`}>
            <span>Add Unavailability</span>
            <img
              src="/images/car-edit/left-arrow.svg"
              className="next-icon"
              alt="Next"
            />
          </Link>
        </button>

        <button
          className="unstyled-button drawer-edit-btn"
          onClick={() => this._toggleSubDrawer("price-calendar")}
        >
          <span>Price Calendar</span>
          <img
            src="/images/car-edit/left-arrow.svg"
            className="next-icon"
            alt="Next"
          />
        </button>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isSubDrawerOpen: state.common.isSubDrawerOpen
  };
};

export default connect(mapStateToProps)(AdvanceCarViewLinks);
