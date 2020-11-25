import "react-dates/initialize";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { SingleDatePicker } from "react-dates";
import moment from "moment-timezone";
import queryString from "query-string";
import { timeList } from "../../../consts/consts";
import { getBookingData } from "../../../actions/BookingActions";
import { isMobile } from "react-device-detect";

class MainCalander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: this.getFromData(),
      minFrom: this.getMinFrom(),
      to: this.getToDate(),
      minTo: this.getMinToDate(),
      roundedNow: this.getRounderNow(),
      searchData: queryString.parse(this.props.history.location.search)
    };
  }

  _fetchBookingData = () =>
    this.props.dispatch(getBookingData(this._filteredData(), "details"));

  _filteredData = () => {
    return {
      from_date: moment(this.state.from).format("YYYY-MM-DD HH:mm"),
      to_date: moment(this.state.to).format("YYYY-MM-DD HH:mm"),
      car_id: this.props.match.params.id,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: this.props.timeZoneId
    };
  };

  getFromData = () => {
    const searchData = queryString.parse(this.props.history.location.search);
    const formDate = moment(
      moment(searchData.from, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        searchData.fromTime
    );
    if (!formDate.isAfter(this.getMinFrom())) {
      return this.getMinFrom();
    }
    return formDate;
  };

  getMinFrom = () => {
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(this.props.timeZoneId);
    const remainder = 30 - (caliDateTime.minute() % 30);

    const caliFromDateTime = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("YYYY-MM-DD HH:mm");

    const caliFromDateTimeNoon = moment(caliFromDateTime)
      .startOf("day")
      .add(12, "hours");
    const caliFromDateTimeMidNight = moment(caliFromDateTime).endOf("day");

    const calendarFromDate =
      caliFromDateTime > caliFromDateTimeNoon &&
      caliFromDateTime < caliFromDateTimeMidNight
        ? moment(caliFromDateTime).subtract(1, "days")
        : moment(caliFromDateTime);

    return calendarFromDate;
  };

  getToDate = () => {
    const searchData = queryString.parse(this.props.history.location.search);
    const toDate = moment(
      moment(searchData.to, "MM-DD-YYYY").format("YYYY-MM-DD") +
        " " +
        searchData.toTime
    );
    if (!toDate.isAfter(this.getFromData())) {
      return moment(this.getFromData()).add(3, "hours");
    }
    return toDate;
  };

  getMinToDate = () => {
    const from = this.getFromData();
    return from.clone().add(3, "hours");
  };

  getRounderNow = () => {
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(this.props.timeZoneId);
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add(remainder, "minutes")
      .format("HH:mm");
    const roundedNow = moment(
      caliDateTime.format("YYYY-MM-DD") + " " + timeToDisplay
    );
    return roundedNow;
  };

  componentDidMount() {
    this.setState(
      {
        from: this.getFromData(),
        to: this.getToDate(),
        minFrom: this.getMinFrom(),
        minTo: this.getMinToDate(),
        roundedNow: this.getRounderNow()
      },
      () => {
        this._chagenUrl();
        this._fetchBookingData();
      }
    );
  }

  _chagenUrl = () => {
    const { history } = this.props;
    const searchData = queryString.parse(this.props.history.location.search);
    searchData.from = this.state.from.format("MM-DD-YYYY");
    searchData.fromTime = this.state.from.format("HH:mm");
    searchData.to = this.state.to.format("MM-DD-YYYY");
    searchData.toTime = this.state.to.format("HH:mm");
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(searchData)
    });
  };

  handleDateChangeFrom = from => {
    const fromDate = moment(
      moment(from).format("YYYY-MM-DD") +
        " " +
        moment(this.state.from).format("HH:mm")
    );
    var duration = moment.duration(this.state.to.diff(fromDate));
    const minTo = moment(fromDate.clone()).add(3, "hours");
    if (duration.asMinutes() <= 180) {
      let to = fromDate.clone().add(3, "hours");
      this.setState({ from: fromDate, to, minTo }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    } else {
      this.setState({ from: fromDate, minTo }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    }
  };

  handleDateChangeFromTime = e => {
    let fromDate = moment(
      moment(this.state.from).format("YYYY-MM-DD") + " " + e.target.value
    );
    var duration = moment.duration(this.state.to.diff(fromDate));
    const minTo = moment(fromDate.clone()).add(3, "hours");

    if (duration.asMinutes() <= 180) {
      let to = fromDate.clone().add(3, "hours");
      this.setState({ from: fromDate, to: to, minTo }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    } else {
      this.setState({ from: fromDate, minTo }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    }
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
      this.setState({ to: moment(toDate).add(3, "hours") }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    } else {
      this.setState({ to: toDate }, () => {
        this._chagenUrl();
        this._fetchBookingData();
      });
    }
  };
  handleDateChangeToTime = e => {
    let toDate = moment(
      moment(this.state.to).format("YYYY-MM-DD") + " " + e.target.value
    );
    this.setState({ to: toDate }, () => {
      this._chagenUrl();
      this._fetchBookingData();
    });
  };

  render() {
    return (
      <Fragment>
        <div className="form-group">
          <label htmlFor="From">From</label>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="cd-date-picker cd-times-picker">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(this.state.minFrom)}
                  date={this.state.from}
                  onDateChange={e => this.handleDateChangeFrom(e)} // PropTypes.func.isRequired
                  focused={this.state.focusedFrom} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({ focusedFrom: focused })
                  }
                  readOnly={true}
                  numberOfMonths={isMobile ? 1 : 2}
                />
                <span className="icon-down-arrow select-drop-down" />
              </div>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="cd-date-picker">
                <select
                  className="form-control form-select time-drop-down"
                  value={moment(this.state.from).format("HH:mm")}
                  onChange={this.handleDateChangeFromTime}
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
                <span className="icon-down-arrow select-drop-down" />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="From">To</label>
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="cd-date-picker cd-times-picker">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(this.state.minTo)}
                  date={this.state.to}
                  onDateChange={e => this.handleDateChangeTo(e)} // PropTypes.func.isRequired
                  focused={this.state.focusedTo} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({ focusedTo: focused })
                  }
                  readOnly={true}
                  numberOfMonths={isMobile ? 1 : 2}
                />
                <span className="icon-down-arrow select-drop-down" />
              </div>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6">
              <div className="cd-date-picker">
                <select
                  className="form-control form-select time-drop-down"
                  value={moment(this.state.to).format("HH:mm")}
                  onChange={this.handleDateChangeToTime}
                >
                  {timeList.map(time => {
                    return (
                      !this._timeStatus(time[0], true) && (
                        <option key={time[0]} value={time[0]}>
                          {time[1]}
                        </option>
                      )
                    );
                  })}
                </select>
                <span className="icon-down-arrow select-drop-down" />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
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
}
const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(MainCalander);
