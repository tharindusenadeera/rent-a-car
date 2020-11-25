import React, { Component, Fragment } from "react";

class CarOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  checkDiscounts = car => {
    var threeDays = "";
    var sevenDays = "";
    car &&
      car.car_offer.map(data => {
        if (data.includes("3+")) {
          threeDays = data;
        } else if (data.includes("7+")) {
          sevenDays = data;
        }
      });
    return { threeDays: threeDays, sevenDays: sevenDays };
  };

  getDiscount = days => {
    const threeDays = days && days.threeDays;
    const sevenDays = days && days.sevenDays;

    if (threeDays && sevenDays) {
      return (
        <Fragment>
          <div className="flex-default item">
            <span className="icon-revamp-discount-star icon"></span>
            <p className="font-16 font-semibold">{threeDays}</p>
          </div>
          <div className="flex-default item">
            <span className="icon-revamp-discount-star icon"></span>
            <p className="font-16 font-semibold">{sevenDays}</p>
          </div>
        </Fragment>
      );
    } else if (threeDays) {
      return (
        <Fragment>
          <div className="flex-default item">
            <span className="icon-revamp-discount-star icon"></span>
            <p className="font-16 font-semibold">{threeDays}</p>
          </div>
        </Fragment>
      );
    } else if (sevenDays) {
      return (
        <Fragment>
          <div className="flex-default item">
            <span className="icon-revamp-discount-star icon"></span>
            <p className="font-16 font-semibold">{sevenDays}</p>
          </div>
        </Fragment>
      );
    } else {
      return false;
    }
  };

  render() {
    const { car, location } = this.props;
    var days = { threeDays: "", sevenDays: "" };
    days =
      car &&
      car.car_offer &&
      car.car_offer.length > 0 &&
      this.checkDiscounts(car);

    return (
      <div
        className={
          !location ? "page-fetures non-border inner-z" : "page-fetures inner-z"
        }
      >
        {/* Swich this class when comes to detail page - "className="page-fetures non-border inner-z">" */}
        {this.getDiscount(days)}
        <div className="flex-default item">
          <span className="icon-revamp-repair-service icon"></span>
          <p className="font-16 font-semibold">
            Free upgrade on any breakdowns
          </p>
        </div>
      </div>
    );
  }
}

export default CarOffers;
