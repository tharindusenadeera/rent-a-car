import React, { Component, Fragment } from "react";
import { defaultMobileModelPopup } from "../../../../../consts/consts";
import { RangeInput } from "../../../../molecules";
import Modal from "react-modal";

const PRICE_MAX = 2500;
const PRICE_MIN = 0;

class PriceRangeAdvancedFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      variableChanged: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.priceRange) {
      this.setState(() => {
        return {
          priceRange: {
            min: nextProps.priceRange.min,
            max: nextProps.priceRange.max
          }
        };
      });
    } else {
      this.setState(() => {
        return {
          priceRange: {
            min: 0,
            max: 2500
          }
        };
      });
    }
    if (nextProps && nextProps.variableChanged) {
      this.setState({ variableChanged: true });
    } else {
      this.setState({ variableChanged: false });
    }
  }

  setVisible = isVisible => this.setState({ isVisible });

  setPriceRange = range => {
    this.setState(() => {
      return {
        priceRange: { min: range[0], max: range[1] },
        variableChanged: true
      };
    });
  };

  submitForm = () => {
    const { priceRange, variableChanged } = this.state;
    const { submitFilters, handleVariableChange } = this.props;
    submitFilters({ priceRange });
    handleVariableChange(variableChanged);
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, priceRange, variableChanged } = this.state;

    return (
      <Fragment>
        <a
          onClick={() => this.setVisible(true)}
          className={
            variableChanged == true
              ? "flex-align-center"
              : "black flex-align-center"
          }
        >
          <span className="icon-revamp-dollar-rotate scroll-menu-icon"></span>
          {variableChanged ? (
            <Fragment>
              ${priceRange.min} - ${priceRange.max}
            </Fragment>
          ) : (
            "Price range"
          )}
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
                <h6>Price range</h6>
              </div>
              <button
                className={`${
                  variableChanged ? "default-btn-link" : "gray-link"
                } font-semibold submit`}
                onClick={() =>
                  this.setState(
                    () => {
                      return {
                        priceRange: { min: PRICE_MIN, max: PRICE_MAX },
                        variableChanged: false
                      };
                    },
                    () => this.props._onClear("priceRange")
                  )
                }
              >
                Clear All
              </button>
            </div>
            <div className="mobile-modal-body">
              <div className="mobile-modal-section">
                <div className="mobile-modal-field">
                  <RangeInput
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    value={[priceRange.min, priceRange.max]}
                    valuePrefix="$"
                    onAfterChange={this.setPriceRange}
                  />
                </div>
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

export default PriceRangeAdvancedFilter;
