import React, { Component } from "react";

class TopBanner extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data } = this.props;
    console.log("data", data);
    return (
      data && (
        <div className="coupon-wrapper">
          <div className="coupon-text">
            <span className="coupon-text-sm">
              You have {data.time_left && data.time_left} left to
            </span>{" "}
            <span className="coupon-text-lg">
              Save {data.amount && data.amount}
            </span>{" "}
            <span className="coupon-text-sm">
              on your first booking with coupon
            </span>{" "}
            <span className="coupon-text-md">{data.code && data.code}</span>
          </div>
        </div>
      )
    );
  }
}

export default TopBanner;
