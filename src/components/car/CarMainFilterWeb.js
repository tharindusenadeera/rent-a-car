import "react-dates/initialize";
import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { SingleDatePicker } from "react-dates";

import "react-dates/lib/css/_datepicker.css";
import { timeList } from "../../consts/consts";

export default class CarMainFilterWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedTo: null,
      focusedFrom: null
    };
  }

  render() {
    const {
      onMoreFilterClick,
      location,
      onLocationChange,
      onChangeAddress,
      tripData,
      handleDateChangeFrom,
      handleDateChangeTo,
      _timeMaker,
      handleTimeChangeFrom,
      handleTimeChangeTo,
      numberOfFilters
    } = this.props;

    return (
      <div className="main-search-wrapper">
        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
          <div className="search-box-form-inline">
            <img
              className="find-ryde-icons hidden-md"
              src="https://cdn.rydecars.com/static-images/location-icon-green.svg"
            />
            <div className="form-group">
              <label htmlFor="">Location</label>
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
                  location: new window.google.maps.LatLng(34.0522, -118.243),
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
                        className: location.address
                          ? " locationInput "
                          : "locationInput locationRequired"
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
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
          <div className="search-box-form-inline">
            <img
              className="find-ryde-icons hidden-md"
              src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
            />
            <div className="form-group">
              <label>From</label>
              <div className="row">
                <div className="col-xs-6">
                  <div className="date-picker-wrapper">
                    <SingleDatePicker
                      isOutsideRange={day => day.isBefore(tripData.minFromDate)}
                      date={tripData.fromDate}
                      onDateChange={handleDateChangeFrom} // PropTypes.func.isRequired
                      focused={this.state.focusedFrom} // PropTypes.bool
                      onFocusChange={({ focused }) =>
                        this.setState({ focusedFrom: focused })
                      }
                      orientation={
                        window.innerWidth < 700 ? "vertical" : "horizontal"
                      }
                      readOnly={true}
                    />
                    <img
                      className="select-drop-down"
                      src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                    />
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="picker-ar">
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
        <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
          <div className="search-box-form-inline">
            <img
              className="find-ryde-icons hidden-md"
              src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
            />
            <div className="form-group">
              <label>To</label>
              <div className="row">
                <div className="col-xs-6">
                  <div className="date-picker-wrapper">
                    <SingleDatePicker
                      isOutsideRange={day => day.isBefore(tripData.minToDate)}
                      date={tripData.toDate}
                      onDateChange={handleDateChangeTo} // PropTypes.func.isRequired
                      focused={this.state.focusedTo} // PropTypes.bool
                      onFocusChange={({ focused }) =>
                        this.setState({ focusedTo: focused })
                      }
                      orientation={
                        window.innerWidth < 700 ? "vertical" : "horizontal"
                      }
                      readOnly={true}
                    />
                    <img
                      className="select-drop-down"
                      src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                    />
                  </div>
                </div>
                <div className="col-xs-6">
                  <div className="picker-ar">
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
        <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2">
          <button
            onClick={() => onMoreFilterClick()}
            className="more-filters-btn"
          >
            More filters{" "}
            {numberOfFilters > 0 && (
              <span className="filters-count">{numberOfFilters}</span>
            )}
          </button>
        </div>
      </div>
    );
  }
}
