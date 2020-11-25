import "react-dates/initialize";
import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import moment from "moment-timezone";
import { SingleDatePicker } from "react-dates";
import { Select } from "antd";
import { timeList } from "../../../../../consts/consts";
import {
  getBookingData,
  getBookingDataAuth,
  setTripsData
} from "../../../../../api/booking";
import {
  TRANSACTION_FAILED,
  DONE_FETCHING_V2
} from "../../../../../actions/ActionTypes";

class MobileCalendar extends Component {
  constructor(props) {
    super(props);
    const { history } = this.props;
    this.state = {
      from: this.getFromData(),
      minFrom: this.getMinFrom(),
      to: this.getToDate(),
      minTo: this.getMinToDate(),
      roundedNow: this.getRounderNow(),
      searchData: queryString.parse(history.location.search),
      focuseFrom: false,
      focuseTo: false,
      focuseLocation: false
    };
  }

  _fetchBookingData = () => {
    const { dispatch, source, authenticated } = this.props;
    if (authenticated === true) {
      dispatch(getBookingDataAuth(this._filteredData(), "details"))
        .then(response => {
          dispatch({ type: TRANSACTION_FAILED, payload: "" });
          if (source == "details") {
            localStorage.setItem(
              "__tripDurationData",
              JSON.stringify({
                id: response.data.data.car_id,
                option: response.data.data.delivery_option,
                offerdelivery: response.data.data.offer_delivery,
                date: moment().format("YYYY-MM-DD HH:mm")
              })
            );
          }
          dispatch(setTripsData(response.data.data));
          dispatch({ type: DONE_FETCHING_V2 });
        })
        .catch({});
    } else {
      dispatch(getBookingData(this._filteredData(), "details"))
        .then(response => {
          dispatch({ type: TRANSACTION_FAILED, payload: "" });
          if (source == "details") {
            localStorage.setItem(
              "__tripDurationData",
              JSON.stringify({
                id: response.data.data.car_id,
                option: response.data.data.delivery_option,
                offerdelivery: response.data.data.offer_delivery,
                date: moment().format("YYYY-MM-DD HH:mm")
              })
            );
          }
          dispatch(setTripsData(response.data.data));
          dispatch({ type: DONE_FETCHING_V2 });
        })
        .catch({});
    }
  };

  _filteredData = () => {
    const { match, timeZoneId } = this.props;
    const { from, to } = this.state;
    return {
      from_date: moment(from).format("YYYY-MM-DD HH:mm"),
      to_date: moment(to).format("YYYY-MM-DD HH:mm"),
      car_id: match.params.id,
      car_coverage_level: localStorage.carCoverageLevel
        ? localStorage.carCoverageLevel
        : 1,
      timeZoneId: timeZoneId
    };
  };

  getFromData = () => {
    const { history } = this.props;
    const searchData = queryString.parse(history.location.search);

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
    const { timeZoneId } = this.props;
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(timeZoneId);

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
    const { history } = this.props;
    const searchData = queryString.parse(history.location.search);
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
    const { timeZoneId } = this.props;
    const caliDateTime = moment()
      .add(3, "hours")
      .tz(timeZoneId);
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
    const { from, to } = this.state;

    const searchData = queryString.parse(history.location.search);
    searchData.from = from.format("MM-DD-YYYY");
    searchData.fromTime = from.format("HH:mm");
    searchData.to = to.format("MM-DD-YYYY");
    searchData.toTime = to.format("HH:mm");
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify(searchData)
    });
  };

  handleDateChangeFrom = date => {
    const { from, to } = this.state;
    const fromDate = moment(
      moment(date).format("YYYY-MM-DD") + " " + moment(from).format("HH:mm")
    );
    var duration = moment.duration(to.diff(fromDate));
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
    const { from, to } = this.state;
    let fromDate = moment(moment(from).format("YYYY-MM-DD") + " " + e);
    var duration = moment.duration(to.diff(fromDate));
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

  handleDateChangeTo = date => {
    const { from, to } = this.state;
    let toDate = moment(
      moment(date).format("YYYY-MM-DD") + " " + moment(to).format("HH:mm")
    );
    let duration = moment.duration(toDate.diff(from));
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
    const { to } = this.state;
    let toDate = moment(moment(to).format("YYYY-MM-DD") + " " + e);
    this.setState({ to: toDate }, () => {
      this._chagenUrl();
      this._fetchBookingData();
    });
  };

  render() {
    const {
      from,
      minFrom,
      to,
      minTo,
      focusedFrom,
      focusedTo,
      focuseFrom,
      focuseTo
    } = this.state;
    return (
      <div className="page-search-wrapper">
        <div className="form-field-grey">
          <label className="font-12 font-semibold">From</label>
          <div className="flex-align-center">
            <div className="form-field-split">
              {/* Date picker */}
              <div className="datepicker grey">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(minFrom)}
                  date={from}
                  onDateChange={e => this.handleDateChangeFrom(e)} // PropTypes.func.isRequired
                  focused={focusedFrom} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({
                      focusedFrom: focused,
                      focuseFrom: true,
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
              <div className="datepicker grey flex-justify-spacebetween">
                <Select
                  showArrow={false}
                  className="ant-select-grey"
                  value={moment(from).format("HH:mm")}
                  onChange={this.handleDateChangeFromTime}
                  onFocus={() =>
                    this.setState({
                      focuseFrom: true,
                      focuseTo: false
                    })
                  }
                >
                  {timeList.map(time => {
                    return (
                      !this._timeStatus(time[0], false) && (
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
          </div>
          <div
            className={focuseFrom ? "input-line active" : "input-line"}
          ></div>
        </div>
        <div className="form-field-grey">
          <label className="font-12 font-semibold">To</label>
          <div className="flex-align-center">
            <div className="form-field-split">
              {/* Date picker */}
              <div className="datepicker grey">
                <SingleDatePicker
                  isOutsideRange={day => day.isBefore(minTo)}
                  date={to}
                  onDateChange={e => this.handleDateChangeTo(e)} // PropTypes.func.isRequired
                  focused={focusedTo} // PropTypes.bool
                  onFocusChange={({ focused }) =>
                    this.setState({
                      focusedTo: focused,
                      focuseTo: true,
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
              <div className="datepicker grey flex-justify-spacebetween">
                <Select
                  showArrow={false}
                  className="ant-select-grey"
                  value={moment(to).format("HH:mm")}
                  onChange={this.handleDateChangeToTime}
                  onFocus={() =>
                    this.setState({
                      focuseTo: true,
                      focuseFrom: false
                    })
                  }
                >
                  {timeList.map(time => {
                    return (
                      !this._timeStatus(time[0], true) && (
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
          </div>
          <div className={focuseTo ? "input-line active" : "input-line"}></div>
        </div>
      </div>
    );
  }
  _timeStatus = (selectedTime, isToTime) => {
    const { from, to, roundedNow } = this.state;
    const fromDate = moment(from);
    const toDate = moment(to);
    const minFrom = roundedNow;

    const minTo = moment(
      fromDate.format("YYYY-MM-DD") + " " + moment(from).format("HH:mm")
    ).add(3, "hours");
    let startDate;
    let endDate;
    if (!isToTime) {
      startDate = minFrom;
      endDate = moment(
        moment(fromDate).format("YYYY-MM-DD") + " " + selectedTime
      );
    } else {
      startDate = minTo;
      endDate = moment(
        moment(toDate).format("YYYY-MM-DD") + " " + selectedTime
      );
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

export default connect(mapStateToProps)(MobileCalendar);
