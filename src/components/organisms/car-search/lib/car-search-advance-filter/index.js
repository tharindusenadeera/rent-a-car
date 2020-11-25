import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { Select, Checkbox } from "antd";
import {
  defaultMobileModelPopup,
  milesPerDay,
  carTypes
} from "../../../../../consts/consts";
import { getCarMakes, getFeatures } from "../../../../../actions/CarActions";
import { deliveryLocations } from "../../../../../action-creators/app";
import {
  RangeInput,
  YearRangeInput,
  MappedSelectInput
} from "../../../../molecules/";

const { Option } = Select;

const YEAR_MIN = 1994;
const YEAR_MAX = new Date().getFullYear() + 1;
const PRICE_MAX = 2500;
const PRICE_MIN = 0;

class AdvanceFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      yearRange: { min: YEAR_MIN, max: YEAR_MAX },
      makeId: "",
      distancePerDay: "",
      deliveryLocationId: "",
      carType: "",
      transmission: "",
      selectedFeatures: [],
      shwoFeatures: false,
      carFilterCountArray: [],
      isFixedButton: true,
      variableChanged: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { carMakes } = this.props;

    if (nextProps && nextProps.makeId) {
      if (
        carMakes.find(i => {
          return nextProps.makeId == i.id;
        })
      ) {
        this.setFilterCountArray("make");

        this.setState({
          makeId: nextProps.makeId
        });
      }
    }

    if (nextProps && nextProps.carType) {
      this.setFilterCountArray("carType");
      this.setState({
        carType: nextProps.carType
      });
    }

    if (nextProps && nextProps.priceRange) {
      if (
        nextProps &&
        (nextProps.priceRange.min != 0 || nextProps.priceRange.max != 2500)
      ) {
        this.setFilterCountArray("priceRange");
      }
      this.setState(() => {
        return {
          priceRange: {
            min: nextProps.priceRange.min,
            max: nextProps.priceRange.max
          }
        };
      });
    }

    if (nextProps && nextProps.clear == "make") {
      this.setState({ makeId: "" });
      this.removeFilterCountArray(nextProps.clear);
    }
    if (nextProps && nextProps.clear == "carType") {
      this.setState({ carType: "" });
      this.removeFilterCountArray(nextProps.clear);
    }
    if (nextProps && nextProps.clear == "priceRange") {
      this.setState({ priceRange: { min: PRICE_MIN, max: PRICE_MAX } });
      this.removeFilterCountArray(nextProps.clear);
    }
  }

  componentDidMount() {
    const { dispatch, carMakes, lat, lng } = this.props;

    if (carMakes.length == 0) {
      dispatch(getCarMakes("registered-makes"));
    }
    dispatch(deliveryLocations({ lat, lng }));
    dispatch(getFeatures());
  }

  setVisible = isVisible => this.setState({ isVisible });

  setPriceRange = range => {
    const { variableChanged } = this.props;
    this.setFilterCountArray("priceRange");
    this.setState(
      () => {
        return {
          priceRange: { min: range[0], max: range[1] },
          variableChanged: true
        };
      },
      () => variableChanged(true)
    );
  };

  setYearRange = range => {
    this.setFilterCountArray("Years");
    this.setState(() => {
      return {
        yearRange: { min: range[0], max: range[1] }
      };
    });
  };

  handleMakeChange = makeId => {
    this.setFilterCountArray("make");
    this.setState({
      makeId
    });
  };

  handleDistanceChange = distancePerDay => {
    this.setFilterCountArray("distance");
    this.setState({
      distancePerDay
    });
  };

  handleDeliveryLocationChange = deliveryLocationId => {
    this.setFilterCountArray("deliveryL");
    this.setState({
      deliveryLocationId
    });
  };

  handleCarTypeChange = carType => {
    this.setFilterCountArray("carType");
    this.setState({
      carType
    });
  };

  handleTransmissionChange = transmission => {
    this.setFilterCountArray("transmission");
    this.setState({
      transmission
    });
  };

  handleFeaturesChange = selectedFeatures => {
    this.setFilterCountArray("features");
    this.setState({
      selectedFeatures
    });
  };

  makeFeaturesArray = () => {
    const { features } = this.props;
    return features.map(({ id, name }) => {
      return { label: name, value: id };
    });
  };

  handleClear = () => {
    this.setState(
      {
        makeId: "",
        distancePerDay: "",
        deliveryLocationId: "",
        carType: "",
        selectedFeatures: [],
        transmission: "",
        priceRange: { min: PRICE_MIN, max: PRICE_MAX },
        yearRange: { min: YEAR_MIN, max: YEAR_MAX },
        carFilterCountArray: []
      },
      () => this.props._onClear("all")
    );
  };

  submitForm = () => {
    const {
      priceRange,
      yearRange,
      makeId,
      distancePerDay,
      deliveryLocationId,
      carType,
      transmission,
      selectedFeatures
    } = this.state;

    const { submitFilters } = this.props;
    const filterdData = { priceRange, yearRange };
    if (makeId) {
      filterdData.makeId = makeId;
    }
    if (distancePerDay) {
      filterdData.distancePerDay = distancePerDay;
    }
    if (deliveryLocationId) {
      filterdData.deliveryLocationId = deliveryLocationId;
    }
    if (carType) {
      filterdData.carType = carType;
    }
    if (transmission) {
      filterdData.transmission = transmission;
    }
    if (selectedFeatures.length) {
      filterdData.selectedFeatures = selectedFeatures;
    }
    submitFilters(filterdData);
    this.setState({ isVisible: false });
  };

  setFilterCountArray = para => {
    const { carFilterCountArray } = this.state;
    if (carFilterCountArray.length > 0) {
      if (!carFilterCountArray.includes(para)) {
        carFilterCountArray.push(para);
      }
    } else {
      carFilterCountArray.push(para);
    }
  };

  removeFilterCountArray = para => {
    const { carFilterCountArray } = this.state;
    if (carFilterCountArray.length > 0) {
      if (carFilterCountArray.includes(para)) {
        this.setState({ carFilterCountArray: [] });
      }
    }
  };

  render() {
    const {
      isVisible,
      selectedFeatures,
      shwoFeatures,
      makeId,
      priceRange,
      yearRange,
      transmission,
      distancePerDay,
      carType,
      deliveryLocationId,
      carFilterCountArray,
      isFixedButton
    } = this.state;
    const { carMakes, deliveryLocations } = this.props;

    return (
      <Fragment>
        <a
          onClick={() => this.setVisible(true)}
          className="black flex-align-center"
        >
          <span className="icon-revamp-filter scroll-menu-icon"></span>
          Filters
          {carFilterCountArray.length != 0 ? (
            <div className="label-count-green">
              {carFilterCountArray.length}
            </div>
          ) : null}
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
                <h6>Filters</h6>
                {carFilterCountArray.length != 0 ? (
                  <div className="label-count-green">
                    {carFilterCountArray.length}
                  </div>
                ) : null}
              </div>
              <button
                className={`${
                  carFilterCountArray.length > 0
                    ? "default-btn-link"
                    : "gray-link"
                } font-semibold submit`}
                onClick={() => this.handleClear()}
              >
                Clear All
              </button>
            </div>
            <div
              className={
                isFixedButton
                  ? "mobile-modal-body"
                  : "mobile-modal-body full-height"
              }
            >
              {/*-- Section --*/}
              <div className="mobile-modal-section">
                <h4>Price range</h4>
                <RangeInput
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  valuePrefix="$"
                  onAfterChange={this.setPriceRange}
                  value={[priceRange.min, priceRange.max]}
                />
              </div>

              <div className="mobile-modal-section">
                <h4>Vehicle make</h4>
                <div className="mobile-modal-field">
                  <MappedSelectInput
                    onChange={this.handleMakeChange}
                    value={makeId}
                    mappingProperty={carMakes}
                  />
                </div>
              </div>
              <div className="mobile-modal-section">
                <h4>Vehicle years</h4>
                <YearRangeInput
                  min={YEAR_MIN}
                  max={YEAR_MAX}
                  onAfterChange={this.setYearRange}
                  value={[yearRange.min, yearRange.max]}
                  onChangeYearPicker={isFixedButton =>
                    this.setState({ isFixedButton })
                  }
                />
              </div>
              <div className="mobile-modal-section">
                <h4>Distance per day</h4>
                <div className="mobile-modal-field">
                  <Select
                    onChange={this.handleDistanceChange}
                    className="ant-select-grey-default"
                    value={distancePerDay != "" ? distancePerDay : "Select"}
                  >
                    {milesPerDay.map(({ value }, key) => {
                      return (
                        <Option value={value} key={key}>
                          {value}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="mobile-modal-section">
                <h4>Delivery</h4>
                <div className="mobile-modal-field">
                  <Select
                    onChange={this.handleDeliveryLocationChange}
                    className="ant-select-grey-default"
                    value={
                      deliveryLocationId != "" ? deliveryLocationId : "Select"
                    }
                  >
                    {deliveryLocations.map(({ id, name }, key) => {
                      return (
                        <Option value={id} key={key}>
                          {name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="mobile-modal-section">
                <h4>Car type</h4>
                <div className="mobile-modal-field">
                  <Select
                    onChange={this.handleCarTypeChange}
                    className="ant-select-grey-default"
                    value={carType != "" ? carType : "Select"}
                  >
                    {carTypes.map(type => {
                      return (
                        <Option value={type.value} key={type.key}>
                          {type.value}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="mobile-modal-section">
                <h4>Transmission</h4>
                <div className="mobile-modal-field">
                  <Select
                    onChange={this.handleTransmissionChange}
                    className="ant-select-grey-default"
                    value={transmission != "" ? transmission : "Select"}
                  >
                    <Option value="1">Automatic</Option>
                    <Option value="0">Manual</Option>
                  </Select>
                </div>
              </div>
              <div className="mobile-modal-section features">
                <div className="flex-justify-spacebetween flex-align-center">
                  <h4>Features</h4>
                  <a
                    href="#"
                    onClick={() =>
                      this.setState({ shwoFeatures: !shwoFeatures })
                    }
                  >
                    {shwoFeatures ? "Close" : "Show All"}
                  </a>
                </div>

                {shwoFeatures ? (
                  <Fragment>
                    <div className="mobile-modal-field">
                      <Checkbox.Group
                        options={this.makeFeaturesArray()}
                        onChange={this.handleFeaturesChange}
                        className="ant-checkboxgroup-grey"
                        value={selectedFeatures}
                      />
                    </div>
                    <a
                      href="#"
                      onClick={() => {
                        this.handleFeaturesChange([]);
                      }}
                      className={selectedFeatures.length > 0 ? "" : "gray-link"}
                    >
                      Clear All
                    </a>
                  </Fragment>
                ) : null}
              </div>
              {/*-- Section --*/}
            </div>
            {isFixedButton && (
              <div className="mobile-modal-sticky">
                <button
                  type="submit"
                  className="default-btn full-width submit"
                  onClick={this.submitForm}
                >
                  Show results
                </button>
              </div>
            )}
          </div>
        </Modal>
      </Fragment>
    );
  }
}
const mapToStateProps = state => {
  return {
    carMakes: state.car.carMakes,
    deliveryLocations: state.common.deliveryLocations,
    features: state.car.features
  };
};
export default connect(mapToStateProps)(AdvanceFilter);
