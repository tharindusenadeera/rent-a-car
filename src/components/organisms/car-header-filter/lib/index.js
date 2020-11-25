import "react-dates/initialize";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment from "moment-timezone";
import PlacesAutocomplete from "react-places-autocomplete";
import { SingleDatePicker } from "react-dates";
import { Menu, Dropdown, Icon, Select } from "antd";
import { timeList } from "../../../../consts/consts";
import { fetchTimeZone } from "../../../../actions/CommenActions";
import "react-dates/lib/css/_datepicker.css";
import "antd/lib/select/style/index.css";
import "antd/lib/slider/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/radio/style/index.css";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";

class CarSearchHeaderFilter extends Component {
  constructor(props) {
    super(props);
    const { routeData, timeZoneId } = this.props;
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(timeZoneId);

    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");

    let fromDate = moment(
      moment(routeData.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        routeData.fromTime
    );

    if (caliDateTime.isAfter(fromDate)) {
      fromDate = moment(
        caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
      );
    }

    const toDate = moment(
      moment(routeData.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        routeData.toTime
    );
    const roundedNow = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );

    //setup calendar min from date
    const caliFromDateTime = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD");
    const caliFromDateTimeNoon = moment(caliFromDateTime)
      .startOf("day")
      .add(12, "hours");
    const caliFromDateTimeMidNight = moment(caliFromDateTime).endOf("day");
    const calendarFromDate =
      caliFromDateTime > caliFromDateTimeNoon &&
      caliFromDateTime < caliFromDateTimeMidNight
        ? moment(caliFromDateTime).subtract(1, "days")
        : moment(caliFromDateTime);

    this.state = {
      routeData: routeData,
      location: routeData.location,
      selectedLocation: routeData.location,
      county: null,
      lat: routeData.lat,
      lng: routeData.lng,
      from: fromDate,
      minFrom: calendarFromDate,
      to: toDate,
      minTo: "",
      roundedNow: roundedNow,
      tracks: [],
      hasMoreItems: true,
      latsPage: 0,
      totalResults: 0,
      isReset: false,
      visible: false,
      focuseFrom: false,
      focuseTo: false,
      focuseLocation: false
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  onChangeAddress = location => {
    this.setState({
      location: location,
      filtered_search: true,
      selectedLocation: location
    });
    const { dispatch } = this.props;
    this.fetchGeocodeByAddress(location, latLng => {
      const { lat, lng } = latLng;
      this.setState({ lat: lat, lng: lng }, () => {
        dispatch(fetchTimeZone(lat, lng));
      });
    });
  };

  fetchGeocodeByAddress = (address, callBack = null) => {
    geocodeByAddress(address).then(results => {
      const address_components = results[0].address_components;

      let county = address_components.find(i => {
        return i.types.find(j => {
          return j == "administrative_area_level_2";
        });
      });
      if (county) {
        let countryName = county.long_name.split("County");
        if (countryName) {
          this.setState({ county: countryName[0] });
        }
      }
      getLatLng(results[0]).then(latLng => {
        if (callBack) callBack(latLng);
      });
    });
  };

  _onLocationChange = e => this.setState({ location: e });

  handleDateChangeFrom = date => {
    // check if the to date is smaller that this value if so add three more days and set it
    const { from } = this.state;
    const { _changeUrl, source } = this.props;
    const fromDate = moment(
      moment(date).format("YYYY-MM-DD") + " " + moment(from).format("HH:mm")
    );
    const toDate = moment(fromDate).add(3, "days");
    this.setState({ from: fromDate, to: toDate }, () => {
      const data = { from: fromDate, to: toDate };
      if (source == "detail") {
        _changeUrl(data);
      }
    });
  };

  handleDateChangeTo = date => {
    const { to, from } = this.state;
    const { _changeUrl, source } = this.props;
    let toDate = moment(
      moment(date).format("YYYY-MM-DD") + " " + moment(to).format("HH:mm")
    );
    let duration = moment.duration(toDate.diff(from));
    let hours = duration.asHours();
    if (hours <= 3) {
      this.setState({ to: moment(toDate).add(3, "hours") }, () => {
        const data = { to: moment(toDate).add(3, "hours") };
        if (source == "detail") {
          _changeUrl(data);
        }
      });
    } else {
      this.setState({ to: toDate }, () => {
        const data = { to: toDate };
        if (source == "detail") {
          _changeUrl(data);
        }
      });
    }
  };

  handleTimeChangeFrom = e => {
    const { from, to } = this.state;
    const { _changeUrl, source } = this.props;
    let fromDate = moment(moment(from).format("YYYY-MM-DD") + " " + e);
    if (fromDate.isAfter(to) || fromDate.isSame(to)) {
      let to = moment(moment(to).format("YYYY-MM-DD") + " " + e).add(3, "days");
      this.setState({ from: fromDate, to: to }, () => {
        const data = { from: fromDate, to: to };
        if (source == "detail") {
          _changeUrl(data);
        }
      });
    } else {
      this.setState({ from: fromDate }, () => {
        const data = { from: fromDate };
        if (source == "detail") {
          _changeUrl(data);
        }
      });
    }
  };

  handleTimeChangeTo = e => {
    const { to } = this.state;
    const { _changeUrl, source } = this.props;

    let toDate = moment(moment(to).format("YYYY-MM-DD") + " " + e);
    this.setState({ to: toDate }, () => {
      const data = { to: toDate };
      if (source == "detail") {
        _changeUrl(data);
      }
    });
  };

  _timeMaker = (selectedTime, isToTime) => {
    const { from, to, roundedNow } = this.state;
    const fromTime = moment(from);
    const toTime = moment(to);
    const minFrom = roundedNow;
    const minTo = moment(
      fromTime.format("YYYY-MM-DD") + " " + moment(from).format("HH:mm")
    ).add(3, "hours");
    let startDate;
    let endDate;
    if (!isToTime) {
      startDate = minFrom;
      endDate = moment(
        moment(fromTime).format("YYYY-MM-DD") + " " + selectedTime
      );
    } else {
      startDate = minTo;
      endDate = moment(
        moment(toTime).format("YYYY-MM-DD") + " " + selectedTime
      );
    }
    if (startDate.isAfter(endDate)) {
      return true;
    } else {
      return false;
    }
  };

  submitForm = () => {
    const { location, lat, lng, from, to, visible, routeData } = this.state;
    const {
      submitFilters,
      _onChangeHeaderData,
      source,
      _changeUrl
    } = this.props;

    if (!location) {
      return false;
    }
    this.setState({ visible: false });
    const filterdData = {
      location: location,
      lat: lat,
      lng: lng,
      from: moment(from).format("YYYY-MM-DD HH:mm"),
      to: moment(to).format("YYYY-MM-DD HH:mm"),
      fromTime: moment(from).format("HH:mm"),
      toTime: moment(to).format("HH:mm")
    };

    if (source == "detail") {
      if (routeData.location !== location) {
        const data = { location: location, lat: lat, lng: lng };
        _changeUrl(data);
      } else {
        this.setState({ visible: !visible });
      }
    } else {
      submitFilters(filterdData);
      _onChangeHeaderData(filterdData);
      this.setState({
        tracks: [],
        hasMoreItems: true,
        latsPage: 0,
        totalResults: 0,
        isReset: true
      });
    }

    let searchDataArray = [];
    let searchData = { location: location, latitude: lat, longitude: lng };
    searchDataArray.push(searchData);
    localStorage.setItem("searchData", JSON.stringify(searchDataArray));
  };

  menu = (location, from, minFrom, to, user) => {
    let fromTime = moment(from).format("HH:mm");
    let toTime = moment(to).format("HH:mm");
    let minToDate = moment(from).add(3, "hours");
    const { focuseFrom, focuseTo, focuseLocation } = this.state;

    return (
      <Menu className="freez-search-dropdown">
        <div className="freez-search-wrapper">
          <div className="form-field-black flex-justify-spacebetween flex-align-center ">
            <label className="font-14 font-semibold">Location</label>
            <PlacesAutocomplete
              value={location}
              onChange={e => this._onLocationChange(e)}
              onSelect={e => this.onChangeAddress(e)}
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
                <div className="freez-search-location">
                  <input
                    {...getInputProps({
                      placeholder: "Type City, ZIP Code or Airport",
                      className: "ant-input-black"
                    })}
                    onFocus={() =>
                      this.setState({
                        focuseLocation: true,
                        focuseFrom: false,
                        focuseTo: false
                      })
                    }
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
            {!location ? (
              <div
                className={focuseLocation ? "input-line errors" : "input-line"}
              />
            ) : (
              <div
                className={focuseLocation ? "input-line active" : "input-line"}
              />
            )}
          </div>
          <div className="form-field-black flex-align-center">
            <label className="font-14 font-semibold">From</label>
            <div className="form-field-split">
              {/* Date picker */}
              <div className="datepicker dark">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(minFrom)}
                  date={from}
                  onDateChange={from => this.handleDateChangeFrom(from)} // PropTypes.func.isRequired
                  focused={this.state.focusedFrom} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({
                      focusedFrom: focused,
                      focuseFrom: true,
                      focuseLocation: false,
                      focuseTo: false
                    })
                  }
                  readOnly={true}
                  numberOfMonths={1}
                />
                <span className="icon-set-one-down-arrow-icon arrow"></span>
              </div>
              {/* Date picker */}
            </div>
            <div className="form-field-split">
              <div className="datepicker dark flex-justify-spacebetween">
                <Select
                  value={fromTime}
                  onChange={e => this.handleTimeChangeFrom(e)}
                  className="ant-select-black"
                  onFocus={() =>
                    this.setState({
                      focuseFrom: true,
                      focuseLocation: false,
                      focuseTo: false
                    })
                  }
                >
                  {timeList.map(time => {
                    return (
                      !this._timeMaker(time[0], false) && (
                        <Select.Option key={time[0]} value={time[0]}>
                          {time[1]}
                        </Select.Option>
                      )
                    );
                  })}
                </Select>
                <span className="icon-set-one-down-arrow-icon arrow"></span>
              </div>
            </div>
            <div
              className={focuseFrom ? "input-line active" : "input-line"}
            ></div>
          </div>
          <div className="form-field-black flex-justify-spacebetween flex-align-center">
            <label className="font-14 font-semibold">To</label>
            <div className="form-field-split">
              {/* Date picker */}
              <div className="datepicker dark">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(minToDate)}
                  date={to}
                  onDateChange={to => this.handleDateChangeTo(to)} // PropTypes.func.isRequired
                  focused={this.state.focusedTo} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({
                      focusedTo: focused,
                      focuseTo: true,
                      focuseLocation: false,
                      focuseFrom: false
                    })
                  }
                  readOnly={true}
                  numberOfMonths={1}
                />
                <span className="icon-set-one-down-arrow-icon arrow"></span>
              </div>
              {/* Date picker */}
            </div>
            <div className="form-field-split">
              <div className="datepicker dark flex-justify-spacebetween">
                <Select
                  value={toTime}
                  onChange={e => this.handleTimeChangeTo(e)}
                  showArrow={false}
                  className="ant-select-black"
                  onFocus={() =>
                    this.setState({
                      focuseTo: true,
                      focuseLocation: false,
                      focuseFrom: false
                    })
                  }
                >
                  {timeList.map(time => {
                    return (
                      !this._timeMaker(time[0], true) && (
                        <Select.Option key={time[0]} value={time[0]}>
                          {time[1]}
                        </Select.Option>
                      )
                    );
                  })}
                </Select>
                <span className="icon-set-one-down-arrow-icon arrow"></span>
              </div>
            </div>
            <div
              className={focuseTo ? "input-line active" : "input-line"}
            ></div>
          </div>
          <div>
            <button
              type="submit"
              className="default-btn small submit"
              onClick={this.submitForm}
            >
              Search
            </button>
          </div>
        </div>
        {user.id == null ? (
          <a href="/signup" className="white">
            <div className="flex-default freez-search-signup">
              <div>
                <img
                  src="https://cdn.rydecars.com/static-images/default-avatar.jpg"
                  className="avatar"
                />
              </div>
              <div>
                <span className="font-20 font-bold">Sign up to save more</span>
                <br />
                <span className="font-14 font-reguler">
                  Sign up to unlock our best deals
                </span>
              </div>
            </div>
          </a>
        ) : null}
      </Menu>
    );
  };

  render() {
    const { user } = this.props;

    const {
      location,
      from,
      minFrom,
      to,
      visible,
      selectedLocation
    } = this.state;

    return (
      <Dropdown
        overlay={this.menu(location, from, minFrom, to, user)}
        trigger={["click"]}
        className="freez-search"
        visible={visible}
        onVisibleChange={() => this.setState({ visible: !visible })}
        overlayClassName="freez-search-dropdown-wrapper"
      >
        <a className="ant-dropdown-link flex-align-center" href="#">
          <div className="freez-search-outer">
            <span className="font-12 font-semibold">{selectedLocation}</span>
            <br />
            <span className="font-10 font-semibold">
              {moment(from).format("MMM D, h:mm A")} -{" "}
              {moment(to).format("MMM D, h:mm A")}
            </span>
          </div>
          <Icon type="down" className="freez-search-arrow" />
        </a>
      </Dropdown>
    );
  }
}

const mapStateToProps = state => ({
  filteredCar: state.car.filteredCar,
  features: state.car.features,
  carMakes: state.car.carMakes,
  carModels: state.car.carModels,
  user: state.user.user,
  authenticated: state.user.authenticated,
  timeZoneId: state.common.timeZoneId
});

export default withRouter(connect(mapStateToProps)(CarSearchHeaderFilter));
