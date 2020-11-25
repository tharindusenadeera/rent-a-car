import React, { Component, Fragment } from "react";
import { Input, Slider } from "antd";

class RangeInput extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      minVal: value[0],
      maxVal: value[1],
      bothVal: value,
      error: ""
    };
  }

  handleMin = e => {
    const { min, max } = this.props;
    if (e.target.value <= max && e.target.value >= min) {
      this.setState(
        {
          minVal: e.target.value
        },
        () => this.handleValueArray()
      );
    }
  };

  handleMax = e => {
    const { min, max } = this.props;
    if (e.target.value <= max && e.target.value >= min) {
      this.setState(
        {
          maxVal: e.target.value
        },
        () => this.handleValueArray()
      );
    }
  };

  handleValueArray = () => {
    const { minVal, maxVal } = this.state;

    this.setState(
      {
        bothVal: [parseInt(minVal), parseInt(maxVal)]
      },
      () =>
        this.props.onAfterChange([
          minVal || minVal === 0 ? parseInt(minVal) : null,
          maxVal ? parseInt(maxVal) : null
        ])
    );
  };

  onAfterChange = range => {
    this.setState(
      {
        minVal: range[0],
        maxVal: range[1],
        bothVal: range
      },
      () => this.props.onAfterChange(range)
    );
  };

  render() {
    const { min, max, valuePrefix, value } = this.props;
    const prefix = valuePrefix ? valuePrefix : "";

    return (
      <Fragment>
        <div className="mobile-modal-field">
          <Slider
            max={max}
            min={min}
            range
            defaultValue={[min, max]}
            className="ant-slider-green"
            onChange={this.onAfterChange}
            value={value}
          />
        </div>
        <div className="flex-justify-spacebetween">
          <div className="range-input">
            {prefix ? <span className="prefix-icon font-18">$</span> : ""}
            <Input
              className="ant-input-grey"
              inputMode="numeric"
              onChange={e => this.handleMin(e)}
              maxLength="4"
              pattern="^-?[0-9]\d*\.?\d*$"
              min={0}
              value={value[0]}
            />
          </div>
          <div className="ant-input-dash">-</div>
          <div className="range-input">
            {prefix ? <span className="prefix-icon font-18">$</span> : ""}
            <Input
              className="ant-input-grey"
              inputMode="numeric"
              onChange={e => this.handleMax(e)}
              maxLength="4"
              pattern="^-?[0-9]\d*\.?\d*$"
              value={value[1]}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RangeInput;
