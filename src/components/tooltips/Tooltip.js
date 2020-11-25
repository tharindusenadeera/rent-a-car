import React, { Component } from "react";
import { Popover, Button } from "antd";
import "antd/lib/popover/style/index.css";
import { isMobile } from "react-device-detect";
import { LazyImage } from "../comman";

export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  render() {
    const serviceFeeContent = (
      <div>
        <div className="tooltip-close visible-xs">
          <a onClick={() => this.setState({ visible: false })}>
            <img src="/images/close_icon.png" alt="close" />
          </a>
        </div>
        {this.props.children}
      </div>
    );

    if (isMobile) {
      return (
        <Popover
          content={serviceFeeContent}
          trigger="hover"
          overlayClassName="service-fee-tooltip sm-tooltip"
          visible={this.state.visible}
          trigger="click"
          onVisibleChange={this.handleVisibleChange}
        >
          <Button className="help-icon-btn">
            <LazyImage
              className="help-icon"
              src="/images/help-icon.png"
              alt="Help"
            />
          </Button>
        </Popover>
      );
    }
    return (
      <Popover
        content={serviceFeeContent}
        trigger="hover"
        overlayClassName="service-fee-tooltip sm-tooltip"
      >
        <Button className="help-icon-btn">
          <LazyImage
            className="help-icon"
            src="/images/help-icon.png"
            alt="Help"
          />
        </Button>
      </Popover>
    );
  }
}
