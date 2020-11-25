import React, { Component } from "react";
import InputRange from "react-input-range";
import Checkbox from "rc-checkbox";
import Collapsible from "react-collapsible";
import "react-input-range/lib/css/index.css";
import "rc-checkbox/assets/index.css";

const MAX_YEAR = new Date().getFullYear() + 1;
const MIN_YEAR = 1994;
export default class CarMoreFilterWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shwoFeatures: false,
      checked: []
    };
  }

  trigger = () => {
    return (
      <div className="features-title">
        Features
        {this.state.shwoFeatures ? (
          <span className="icon-up-arrow" />
        ) : (
          <span className="icon-down-arrow" />
        )}
      </div>
    );
  };

  render() {
    const {
      carTypes,
      onChangeCarTypes,
      filteringData,
      onChangePriceRange,
      carMakes,
      onChangeCarMakes,
      onChangeTransmission,
      onChangeMilesPerDay,
      milesPerDay,
      onChangeYearRange,
      deliveryLocations,
      onChangeDeliveryLocation,
      features,
      selectedFeatures,
      onChangeFeatures
    } = this.props;

    return (
      <div className="search-filters-outer hidden-xs">
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <div className="car-value-wrapper">
              <div className="car-value-top">
                <label className="value-label-left">Price range</label>
                <label className="value-label-right">
                  $ {filteringData.priceRange.min} - ${" "}
                  {filteringData.priceRange.max}
                </label>
              </div>
              <div className="value-slider">
                <InputRange
                  step={100}
                  maxValue={2000}
                  minValue={0}
                  value={filteringData.priceRange}
                  onChange={onChangePriceRange}
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
            <div className="form-group filter-form-group">
              <label>Car type</label>
              <div className="picker-ar">
                <select
                  className="form-control form-select"
                  value={filteringData.carType}
                  onChange={onChangeCarTypes}
                >
                  <option value="">Select</option>
                  {carTypes.map(carType => {
                    return (
                      <option key={carType.key} value={carType.value}>
                        {carType.value}
                      </option>
                    );
                  })}
                </select>
                <img
                  className="select-drop-down"
                  src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
            <div className="form-group filter-form-group">
              <label>Make</label>
              <div className="picker-ar">
                <select
                  className="form-control form-select"
                  onChange={onChangeCarMakes}
                  value={filteringData.makeId}
                >
                  <option value="">Select</option>
                  {carMakes.map(make => {
                    return (
                      <option key={make.id} value={make.id}>
                        {make.name}
                      </option>
                    );
                  })}
                </select>
                <img
                  className="select-drop-down"
                  src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
            <div className="form-group filter-form-group">
              <label>Transmission</label>
              <div className="picker-ar">
                <select
                  className="form-control form-select"
                  value={filteringData.transmission}
                  onChange={onChangeTransmission}
                >
                  <option value="">Select</option>
                  <option value="1">Automatic</option>
                  <option value="0">Manual</option>
                </select>
                <img
                  className="select-drop-down"
                  src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
            <div className="form-group filter-form-group">
              <label>Distance per day</label>
              <div className="picker-ar">
                <select
                  className="form-control form-select"
                  value={filteringData.distancePerDay}
                  onChange={onChangeMilesPerDay}
                >
                  <option value="">Select</option>
                  {milesPerDay.map(miles => {
                    return (
                      <option key={miles.value} value={miles.value}>
                        {miles.value}
                      </option>
                    );
                  })}
                </select>
                <img
                  className="select-drop-down"
                  src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <div className="car-value-wrapper">
              <div className="car-value-top">
                <label className="value-label-left">Year</label>
                <label className="value-label-right">
                  {filteringData.yearRange.min} - {filteringData.yearRange.max}
                </label>
              </div>
              <div className="value-slider">
                <InputRange
                  step={1}
                  value={filteringData.yearRange}
                  maxValue={MAX_YEAR}
                  minValue={MIN_YEAR}
                  onChange={onChangeYearRange}
                />
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
            <div className="form-group filter-form-group">
              <label>Delivery</label>
              <div className="picker-ar">
                <select
                  className="form-control form-select"
                  value={filteringData.deliveryLocationId}
                  onChange={onChangeDeliveryLocation}
                >
                  <option value="">Select</option>
                  {deliveryLocations.map((i, index) => {
                    return (
                      <option key={index} value={i.id}>
                        {i.name}
                      </option>
                    );
                  })}
                </select>
                <img
                  className="select-drop-down"
                  src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <Collapsible
              trigger={this.trigger()}
              handleTriggerClick={() =>
                this.setState({ shwoFeatures: !this.state.shwoFeatures })
              }
              open={this.state.shwoFeatures}
            >
              <div className="car-features-section">
                <div className="features-list">
                  {features.map(feature => {
                    return (
                      <span className="features-list-item" key={feature.id}>
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          value={feature.id}
                          onChange={e => onChangeFeatures(e, feature.id)}
                        />
                        <span
                          className={"features-icon " + feature.icon_name}
                        />
                        <span> {feature.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>
    );
  }
}
