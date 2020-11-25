import "react-dates/initialize";
import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

import { timeList } from "../../consts/consts";
import moment from "moment-timezone";
import { isMobile } from "react-device-detect";

export default class CarMainFilterMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false
    };
  }

  render() {
    const {
      location,
      onLocationChange,
      onChangeAddress,
      tripData,
      handleDateChangeFrom,
      handleDateChangeTo,
      _timeMaker,
      handleTimeChangeFrom,
      handleTimeChangeTo,
      numberOfFilters,
      submitForm,
      _toggleMobileFilterModal,
      openMapViwe,
      showMapview
    } = this.props;

    return (
      <div className="col-xs-12">
        <div className="main-search-mobile-inner">
          <div className="flex-row">
            {!this.state.isEdit ? (
              <div className="flex-container">
                <div className="flex-left">
                  <div className="location-mobile">{location.address}</div>
                  <div className="from-to-mobile">
                    {" "}
                    {moment(tripData.fromDate).format("MM DD")}
                    <sup>st</sup> {moment(tripData.fromDate).format("hh mm A")}{" "}
                    <span className="icon-right-arrow" />{" "}
                    {moment(tripData.toDate).format("MM DD")}
                    <sup>st</sup> {moment(tripData.toDate).format("hh mm A")}
                  </div>
                </div>
                <div className="flex-right">
                  <button
                    className="change-fields"
                    onClick={() => this.setState({ isEdit: true })}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="main-search-wrapper main-search-mobile-outer clearfix">
                  <div className="col-xs-12">
                    <div className="search-box-form-inline">
                      <img
                        className="find-ryde-icons"
                        src="https://cdn.rydecars.com/static-images/location-icon-green.svg"
                      />
                      <div className="form-group">
                        <label>Location</label>

                        <PlacesAutocomplete
                          value={location.address}
                          onChange={e => onLocationChange(e)}
                          onSelect={e => onChangeAddress(e)}
                          classNames={{
                            root: "",
                            input: "form-control form-select",
                            autocompleteContainer: "row expanded-location"
                          }}
                          searchOptions={{
                            location: new window.google.maps.LatLng(
                              34.0522,
                              -118.243
                            ),
                            radius: 2000,
                            route: "Los Angeles County",
                            //types: ['address'],
                            componentRestrictions: {
                              country: "us"
                            }
                          }}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading
                          }) => (
                            <div>
                              <input
                                {...getInputProps({
                                  placeholder: "Type City, ZIP Code or Airport",
                                  className: "locationInput"
                                })}
                              />
                              <div className="row expanded-location">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer"
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer"
                                      };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style
                                      })}
                                    >
                                      <span>{suggestion.description}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className="search-box-form-inline">
                      <img
                        className="find-ryde-icons"
                        src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
                      />
                      <div className="form-group">
                        <label>From</label>
                        <div className="row">
                          <div className="col-xs-6  main-search-dpick from">
                            <div className="date-picker-wrapper">
                              <SingleDatePicker
                                isOutsideRange={day =>
                                  day.isBefore(tripData.minFromDate)
                                }
                                date={tripData.fromDate}
                                onDateChange={handleDateChangeFrom} // PropTypes.func.isRequired
                                focused={this.state.focusedFrom} // PropTypes.bool
                                onFocusChange={({ focused }) =>
                                  this.setState({ focusedFrom: focused })
                                }
                                // orientation={
                                //   window.innerWidth < 700
                                //     ? "vertical"
                                //     : "horizontal"
                                // }
                                readOnly={true}
                                numberOfMonths={isMobile ? 1 : 2}
                              />
                              <img
                                className="select-drop-down"
                                src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                              />
                            </div>
                          </div>
                          <div className="col-xs-6">
                            <div className="date-picker-wrapper">
                              <select
                                className="form-control form-select"
                                value={tripData.fromTime}
                                onChange={handleTimeChangeFrom}
                              >
                                {timeList.map(time => {
                                  return (
                                    !_timeMaker(time[0], false) && (
                                      <option key={time[0]} value={time[0]}>
                                        {time[1]}
                                      </option>
                                    )
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
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className="search-box-form-inline">
                      <img
                        className="find-ryde-icons"
                        src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
                      />
                      <div className="form-group">
                        <label>To</label>
                        <div className="row">
                          <div className="col-xs-6  main-search-dpick to">
                            <div className="date-picker-wrapper">
                              <SingleDatePicker
                                isOutsideRange={day =>
                                  day.isBefore(tripData.minToDate)
                                }
                                date={tripData.toDate}
                                onDateChange={handleDateChangeTo} // PropTypes.func.isRequired
                                focused={this.state.focusedTo} // PropTypes.bool
                                onFocusChange={({ focused }) =>
                                  this.setState({ focusedTo: focused })
                                }
                                // orientation={
                                //   window.innerWidth < 700
                                //     ? "vertical"
                                //     : "horizontal"
                                // }
                                readOnly={true}
                                numberOfMonths={isMobile ? 1 : 2}
                              />
                              <img
                                className="select-drop-down"
                                src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                              />
                            </div>
                          </div>
                          <div className="col-xs-6 main-search-dpick to">
                            <div className="date-picker-wrapper">
                              <select
                                className="form-control form-select"
                                value={tripData.toTime}
                                onChange={handleTimeChangeTo}
                              >
                                {timeList.map(time => {
                                  return (
                                    !_timeMaker(time[0], true) && (
                                      <option key={time[0]} value={time[0]}>
                                        {time[1]}
                                      </option>
                                    )
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
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <button
                      onClick={() => {
                        submitForm();
                        this.setState({ isEdit: false });
                      }}
                      className="ryde-button"
                    >
                      RYDE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-container">
            <button
              onClick={() => _toggleMobileFilterModal()}
              className="more-filters-btn"
            >
              More filters{" "}
              <span className="filters-count">
                {numberOfFilters > 0 && numberOfFilters}
              </span>
            </button>
            <div className="flex-right">
              <button onClick={() => openMapViwe()} className="map-btn">
                <img
                  className="filter-remove-icon"
                  src={
                    showMapview
                      ? "/images/car-search/placeholder-dis.png"
                      : "/images/car-search/placeholder.png"
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
