import React, { Component, Fragment } from "react";
import Modal from "react-modal";
import {
  defaultMobileModelPopup,
  carTypes
} from "../../../../../consts/consts";
import { Radio } from "antd";

class CarTypeFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      type: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.carType) {
      this.setState({
        type: nextProps.carType
      });
    } else {
      this.setState({
        type: ""
      });
    }
  }

  setVisible = isVisible => this.setState({ isVisible });

  handleTypeChange = type => {
    this.setState({ type: type.target.value });
  };

  submitForm = () => {
    const { type } = this.state;
    const { submitFilters } = this.props;
    submitFilters({ carType: type });
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, type } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    return (
      <Fragment>
        <a
          onClick={() => this.setVisible(true)}
          className={
            type == "" ? "black flex-align-center" : "flex-align-center"
          }
        >
          <span className="icon-set-one-car-icon scroll-menu-icon"></span>
          {type == "" ? "Car type" : type}
        </a>
        <Modal
          isOpen={isVisible}
          onRequestClose={() => this.setVisible(false)}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={defaultMobileModelPopup}
        >
          <div className="mobile-modal">
            <div className="mobile-modal-header flex-justify-spacebetween flex-align-center">
              <span
                className="icon-cancel"
                onClick={() => this.setVisible(false)}
              />
              <div className="flex-justify-spacebetween flex-align-center">
                <h6>Car type</h6>
              </div>
              <button
                className={`${
                  type != "" ? "default-btn-link" : "gray-link"
                } font-semibold submit`}
                onClick={() =>
                  this.setState({ type: "" }, () => this.props._onClear("type"))
                }
              >
                Clear
              </button>
            </div>
            <div className="mobile-modal-body">
              <div className="mobile-modal-section without-padding">
                <Radio.Group
                  onChange={e => this.handleTypeChange(e)}
                  value={type}
                >
                  {carTypes.map(type => {
                    return (
                      <Radio
                        style={radioStyle}
                        value={type.value}
                        key={type.key}
                      >
                        {type.value}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            </div>
            <div className="mobile-modal-sticky">
              <button
                type="submit"
                className="default-btn full-width submit"
                onClick={this.submitForm}
              >
                Show results
              </button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default CarTypeFilter;
