import React, { Component, Fragment } from "react";
import { Input, Slider } from "antd";
import SlidingPanel from "react-sliding-side-panel";
import { List } from "antd";
import "antd/lib/list/style/index.css";

const years = order => {
  const list = [];
  for (let index = 1994; index <= new Date().getFullYear() + 1; index++) {
    list.push(index);
  }
  if (order) {
    return list.reverse();
  }
  return list;
};

class YearRangeInput extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      minVal: value[0],
      maxVal: value[1],
      bothVal: value,
      error: "",
      isOpen: false,
      type: null
    };
  }

  handleMin = e => {
    const { min, max } = this.props;
    if (e <= max && e >= min) {
      this.setState(
        {
          minVal: e
        },
        () => this.handleValueArray()
      );
    }
  };

  handleMax = e => {
    const { min, max } = this.props;
    if (e <= max && e >= min) {
      this.setState(
        {
          maxVal: e
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

  onChangePicker = item => {
    const { type } = this.state;
    const { onChangeYearPicker } = this.props;
    if (type == "min") {
      this.handleMin(item);
    } else if (type == "max") {
      this.handleMax(item);
    }
    this.setState({ isOpen: false }, () => {
      onChangeYearPicker(true);
    });
  };

  render() {
    const { min, max, valuePrefix, value, onChangeYearPicker } = this.props;
    const prefix = valuePrefix ? valuePrefix : "";
    const { isOpen, minVal, maxVal, type } = this.state;

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
              readOnly={true}
              onClick={() =>
                this.setState({ isOpen: !isOpen, type: "min" }, () => {
                  onChangeYearPicker(false);
                })
              }
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
              readOnly={true}
              onFocus={() =>
                this.setState({ isOpen: !isOpen, type: "max" }, () => {
                  onChangeYearPicker(false);
                })
              }
            />
          </div>
        </div>
        <div className="input-gesture-panel">
          <SlidingPanel
            type={"bottom"}
            isOpen={isOpen}
            size={40}
            backdropClicked={() =>
              this.setState({ isOpen: !isOpen }, () => {
                onChangeYearPicker(true);
              })
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={years(type == "max" ? "desc" : null)}
              className="input-gesture-menu"
              renderItem={item => (
                <List.Item
                  className={
                    (minVal == item && type == "min") ||
                    (maxVal == item && type == "max")
                      ? "active"
                      : {}
                  }
                >
                  <button
                    onClick={() => this.onChangePicker(item)}
                    className="default-btn-link black font-semibold font-16"
                  >
                    {item}
                  </button>
                </List.Item>
              )}
            />
          </SlidingPanel>
        </div>
      </Fragment>
    );
  }
}

export default YearRangeInput;
