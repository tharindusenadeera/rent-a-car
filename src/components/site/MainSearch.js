import "react-dates/initialize";
import React, { Component } from "react";
import { connect } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import moment from "moment-timezone";
import { SingleDatePicker } from "react-dates";
import { timeList } from "../../consts/consts";
import { SEARCH_DATA } from "../../actions/ActionTypes";
import { fetchTimeZone } from "../../actions/CommenActions";
import { isMobile } from "react-device-detect";
import "react-dates/lib/css/_datepicker.css";

class MainSearch extends Component {
  constructor(props) {
    super(props);
    const { address, lat, lng, foucesFrom } = props;

    this.state = {
      address: address ? address : "",
      lat: lat ? lat : "",
      lng: lng ? lng : "",
      focusedFrom: foucesFrom ? foucesFrom : false,
      focusedTo: false,
      locationClass: {
        root: "",
        input: "locationInput",
        autocompleteContainer: "row expanded-location"
      },
      from: null,
      minFrom: null,
      minTo: null,
      roundedNow: null,
      to: null,
      inputClass: "locationInput"
    };
  }

  componentWillMount() {
    const { timeZoneId } = this.props;
    this.setInitalTimes(timeZoneId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.timeZoneId != this.props.timeZoneId) {
      this.setInitalTimes(this.props.timeZoneId);
    }
    if (this.props.foucesFrom !== prevProps.foucesFrom) {
      this.setState({ focusedFrom: this.props.foucesFrom });
    }
  }

  setInitalTimes = timeZoneId => {
    let userDateTime = moment()
      .add(3, "hours")
      .tz(timeZoneId);

    const remainder = 30 - (userDateTime.minute() % 30);
    const timeToDisplay = moment(userDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");
    const fromDate = moment(
      moment(userDateTime)
        .add(remainder, "minutes")
        .format("YYYY-MM-DD") +
        " " +
        timeToDisplay
    );

    const roundedNow = moment(
      userDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );
    const minFrom = moment(userDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD");

    let minToDate = moment(fromDate.clone().add(3, "hours")).format(
      "YYYY-MM-DD"
    );
    this.setState({
      from: fromDate,
      minFrom: minFrom,
      minTo: minToDate,
      roundedNow: roundedNow,
      to: moment(fromDate).add(3, "days")
    });
  };

  handleFormSubmit = () => {
    const { address, from, to } = this.state;
    const { dispatch, authenticated, history } = this.props;

    if (!address) {
      this.setState({
        locationClass: {
          root: "",
          input: "locationInput ",
          autocompleteContainer: "row expanded-location"
        },
        inputClass: "locationInput locationRequired"
      });
      return false;
    }

    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const { lat, lng } = latLng;
        localStorage.setItem("_source_location", address);
        localStorage.setItem("_source_lat", lat);
        localStorage.setItem("_source_lng", lng);
        dispatch({
          type: SEARCH_DATA,
          payload: {
            location: address,
            from: moment(from).format("YYYY-MM-DD HH:mm"),
            to: moment(to).format("YYYY-MM-DD HH:mm"),
            lat: lat,
            lng: lng
          }
        });
        if (!authenticated) {
          // User Search Data into localStorage
          let searchDataArray = [];
          let searchData = { location: address, latitude: lat, longitude: lng };
          if (!localStorage.getItem("searchData")) {
            searchDataArray.push(searchData);
            localStorage.setItem("searchData", JSON.stringify(searchDataArray));
          } else {
            searchDataArray = JSON.parse(localStorage.getItem("searchData"));
            const isDuplicated = searchDataArray.some(
              data => data.location === searchData.location
            );
            if (!isDuplicated) {
              searchDataArray.push(searchData);
              localStorage.setItem(
                "searchData",
                JSON.stringify(searchDataArray)
              );
            }
          }
        }
        history.push({
          pathname: "/cars",
          search: queryString.stringify({
            location: address,
            lat: lat,
            lng: lng,
            from: moment(from).format("MM-DD-YYYY"),
            to: moment(to).format("MM-DD-YYYY"),
            fromTime: from.format("HH:mm"),
            toTime: to.format("HH:mm")
          })
        });
      })
      .catch(error => console.log("error", error));
  };

  onChangeAddress = address => {
    this.setState({
      address: address,
      locationClass: {
        root: "",
        input: "locationInput",
        autocompleteContainer: "row expanded-location"
      },
      inputClass: "locationInput"
    });
  };

  handleSearch = address => {
    const { dispatch } = this.props;
    this.setState({ address: address, search: false });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const { lat, lng } = latLng;
        dispatch(fetchTimeZone(lat, lng));
      });
  };

  handleDateChangeFrom = from => {
    const fromDate = moment(
      moment(from).format("YYYY-MM-DD") +
        " " +
        moment(this.state.from).format("HH:mm")
    );
    const toDate = moment(fromDate).add(3, "days");
    this.setState({ from: fromDate, to: toDate }, state => {
      this.setMinToDate();
    });
  };
  handleDateChangeTo = to => {
    let toDate = moment(
      moment(to).format("YYYY-MM-DD") +
        " " +
        moment(this.state.to).format("HH:mm")
    );
    let duration = moment.duration(toDate.diff(this.state.from));
    let hours = duration.asHours();
    if (hours <= 3) {
      this.setState({ to: moment(toDate).add(3, "hours") });
    } else {
      this.setState({ to: toDate });
    }
  };

  _timeStatus = (selectedTime, isToTime) => {
    const from = moment(this.state.from);
    const to = moment(this.state.to);
    const minFrom = this.state.roundedNow;
    const minTo = moment(
      from.format("YYYY-MM-DD") + " " + moment(this.state.from).format("HH:mm")
    ).add(3, "hours");
    let startDate;
    let endDate;
    if (!isToTime) {
      startDate = minFrom;
      endDate = moment(moment(from).format("YYYY-MM-DD") + " " + selectedTime);
    } else {
      startDate = minTo;
      endDate = moment(moment(to).format("YYYY-MM-DD") + " " + selectedTime);
    }
    if (startDate.isAfter(endDate)) {
      return true;
    } else {
      return false;
    }
  };

  setMinToDate = () => {
    const minTo = moment(this.state.from.format("YYYY-MM-DD HH:mm")).add(
      3,
      "hours"
    );
    this.setState({
      minTo: minTo.format("YYYY-MM-DD")
    });
  };

  render() {
    const {
      locationFieldProps,
      submitButtonProps,
      foucesFromReturn
    } = this.props;

    return (
      <div className="search-box-form">
        <div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
              <div className="search-box-form-inline">
                <img
                  alt="Rent a car with Ryde"
                  className="find-ryde-icons"
                  src="https://cdn.rydecars.com/static-images/location-icon-green.svg"
                />
                <div className="form-group">
                  <label htmlFor="">{locationFieldProps.label}</label>
                  <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.onChangeAddress}
                    onSelect={this.handleSearch}
                    classNames={this.state.locationClass}
                    textInputProps={{ underlineColorAndroid: "transparent" }}
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
                            placeholder: locationFieldProps.placeholder,
                            className: this.state.inputClass
                          })}
                        />
                        <div className="row expanded-location">
                          {loading && (
                            <div className="load-icon">
                              <img src="/images/img_loading.gif" />
                              Loading ...
                            </div>
                          )}
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
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3">
              <div className="search-box-form-inline">
                <img
                  alt="Rent a car with Ryde"
                  className="find-ryde-icons"
                  src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
                />
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">From</label>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="date-picker-wrapper">
                        <SingleDatePicker
                          isOutsideRange={day =>
                            day.isBefore(this.state.minFrom)
                          }
                          date={this.state.from}
                          readOnly={true}
                          onDateChange={this.handleDateChangeFrom} // PropTypes.func.isRequired
                          focused={this.state.focusedFrom} // PropTypes.bool
                          onFocusChange={({ focused }) =>
                            this.setState(
                              {
                                focusedFrom: focused
                              },
                              () =>
                                foucesFromReturn
                                  ? foucesFromReturn(focused)
                                  : ""
                            )
                          }
                          numberOfMonths={isMobile ? 1 : 2}
                        />
                        <img
                          alt="Rent a car with Ryde"
                          className="select-drop-down"
                          src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                        />
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="picker-ar">
                        <select
                          className="form-control form-select"
                          value={moment(this.state.from).format("HH:mm")}
                          onChange={e => {
                            let fromDate = moment(
                              moment(this.state.from).format("YYYY-MM-DD") +
                                " " +
                                e.target.value
                            );
                            if (
                              fromDate.isAfter(this.state.to) ||
                              fromDate.isSame(this.state.to)
                            ) {
                              let to = moment(
                                moment(this.state.to).format("YYYY-MM-DD") +
                                  " " +
                                  e.target.value
                              ).add(3, "days");
                              this.setState(
                                { from: fromDate, to: to },
                                state => {
                                  this.setMinToDate();
                                }
                              );
                            } else {
                              this.setState({ from: fromDate }, state => {
                                this.setMinToDate();
                              });
                            }
                          }}
                        >
                          {timeList.map(time => {
                            return (
                              !this._timeStatus(time[0], false) && (
                                <option key={time[0]} value={time[0]}>
                                  {time[1]}
                                </option>
                              )
                            );
                          })}
                        </select>
                        <img
                          alt="Rent a car with Ryde"
                          className="select-drop-down"
                          src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3">
              <div className="search-box-form-inline">
                <img
                  alt="Rent a car with Ryde"
                  className="find-ryde-icons"
                  src="/images/schedule-icon-green.svg"
                />
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">To</label>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="date-picker-wrapper">
                        <SingleDatePicker
                          isOutsideRange={day => day.isBefore(this.state.minTo)}
                          date={this.state.to}
                          readOnly={true}
                          onDateChange={this.handleDateChangeTo} // PropTypes.func.isRequired
                          focused={this.state.focusedTo} // PropTypes.bool
                          onFocusChange={({ focused }) =>
                            this.setState({ focusedTo: focused })
                          }
                          numberOfMonths={isMobile ? 1 : 2}
                        />
                        <img
                          alt="Rent a car with Ryde"
                          className="select-drop-down"
                          src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                        />
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="picker-ar">
                        <select
                          className="form-control form-select"
                          value={moment(this.state.to).format("HH:mm")}
                          onChange={e => {
                            let toDate = moment(
                              moment(this.state.to).format("YYYY-MM-DD") +
                                " " +
                                e.target.value
                            );
                            this.setState({ to: toDate });
                          }}
                        >
                          {timeList.map(time => {
                            return (
                              !this._timeStatus(time[0], true) && (
                                <option key={time[0]} value={time[0]}>
                                  {" "}
                                  {time[1]}{" "}
                                </option>
                              )
                            );
                          })}
                        </select>
                        <img
                          alt="Rent a car with Ryde"
                          className="select-drop-down"
                          src="https://cdn.rydecars.com/static-images/fields-down-arrow.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2">
              <button
                type="submit"
                onClick={() => this.handleFormSubmit()}
                disabled={false}
                className="btn-success btn home-button btn-block"
              >
                {submitButtonProps.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    authenticated: state.user.authenticated,
    timeZoneId: state.common.timeZoneId
  };
};
export default connect(mapStateToProps)(withRouter(MainSearch));
