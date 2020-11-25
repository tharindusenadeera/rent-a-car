import React, { Component } from "react";
import { connect } from "react-redux";
import ToolTip from "../../../molecules/lib/tool-tip";
import { getCarCoverageInfo } from "../../../../api/car";
import { CAR_COVERAGES } from "../../../../actions/ActionTypes";
import "antd/lib/popover/style/index.css";

class CarCoverageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    getCarCoverageInfo().then(response => {
      dispatch({
        type: CAR_COVERAGES,
        payload: response.data.carCoverageLevels
      });
    });
  }

  render() {
    const { carCoverageLevels } = this.props;
    return (
      <div>
        {/* <div className="detail-card inner"></div> */}
        {/* <h5>You are covered on your trip</h5>
        
        <p className="secondary">Insurance provided by</p>
        <p className="secondary">
          <img src="https://staging.rydecars.com/images/checkout/assurant-sm-logo.png" />
        </p> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  carCoverageLevels: state.car.carCoverageLevels
});

export default connect(mapStateToProps)(CarCoverageInfo);
