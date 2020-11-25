import React, { Component, Fragment } from "react";
import { Checkbox } from "antd";

import { offerFreeDeliveryOptions } from "../../../../consts/consts";

class DeliveryDurationFiled extends Component {
  constructor(props) {
    super(props);
    const { offer_delivery } = props;
    this.state = {
      isChecked: offer_delivery ? true : false,
      offer_delivery: offer_delivery
    };
  }

  handleFreeDeliveryOption = e => {
    this.setState(
      {
        offer_delivery: e.target.value
      },
      () => {
        this.props.onChange(this.state.offer_delivery);
      }
    );
  };

  offerFreeDeliveryOptions() {
    return offerFreeDeliveryOptions.map(i => {
      return (
        <option key={i.key} value={i.value}>
          {i.value}
        </option>
      );
    });
  }
  render() {
    const { offer_delivery, isChecked } = this.state;
    return (
      <Fragment>
        <Checkbox
          onChange={e =>
            this.setState(
              {
                isChecked: e.target.checked,
                offer_delivery: e.target.checked ? "Any" : null
              },
              () => {
                this.props.onChange(this.state.offer_delivery);
              }
            )
          }
          className="offer-deliver-option "
          checked={isChecked}
        >
          <span className="option-title">
            Offer free delivery upto 25 miles if the trip duration is
          </span>
        </Checkbox>
        <div className="offer-deliver-duration">
          <div>
            <select
              disabled={!isChecked}
              className={
                !isChecked
                  ? "offer-deliver-select listFormInput disabled"
                  : "offer-deliver-select listFormInput "
              }
              defaultValue={offer_delivery}
              onChange={this.handleFreeDeliveryOption}
            >
              {this.offerFreeDeliveryOptions()}
            </select>
            {offer_delivery && offer_delivery != "Any" ? (
              <label className="and-over">and over</label>
            ) : (
              <Fragment />
            )}
          </div>
        </div>

        <div className="info-message-box  side-margin">
          <img src="https://ryde-bucket-oregon.s3-us-west-2.amazonaws.com/static-images/info-msg-icon.png" />
          <p>Select this to attract longer trips.</p>
        </div>
      </Fragment>
    );
  }
}

export default DeliveryDurationFiled;
