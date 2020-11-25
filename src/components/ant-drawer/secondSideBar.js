import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Button } from "antd";
import { DateRange } from "react-calendar-custom-date";
import "react-calendar-custom-date/dist/styles.css"; // main style file
import "react-calendar-custom-date/dist/theme/default.css"; // theme css file
import { eachDay, isWithinRange, format, isSameDay } from "date-fns";
import { fetchAdvancePrice } from "../../actions/CarActions";

class SecondSideBar extends Component {
  constructor(props) {
    super(props);
    const cellInfo = [];
    // for (let index = 0; index < car.advane_prices.length; index++) {
    //   cellInfo.push({
    //     date: new Date(car.advane_prices[index].date),
    //     price: car.advane_prices[index].price,
    //     value: `$ ${parseInt(car.advane_prices[index].price)}`
    //   });
    // }

    this.state = {
      dateRange: {
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection"
        }
      },
      cellInfo: cellInfo,
      newAdded: [],
      removebles: [],
      value: "",
      resetSelected: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { car } = this.props;
    if (
      nextProps.car.advane_prices &&
      car.advane_prices != nextProps.car.advane_prices
    ) {
      const cellInfo = [];
      for (let index = 0; index < nextProps.car.advane_prices.length; index++) {
        cellInfo.push({
          // date: new Date(nextProps.car.advane_prices[index].date),
          date: moment(nextProps.car.advane_prices[index].date),
          price: nextProps.car.advane_prices[index].price,
          value: `$ ${parseInt(nextProps.car.advane_prices[index].price)}`
        });
      }
      this.setState({
        cellInfo
      });
    }
  }

  _resetSelectedRange = () => {
    const { dateRange, cellInfo, newAdded } = this.state;
    const { car } = this.props;

    const newArray = cellInfo.filter(data => {
      return !(
        isWithinRange(
          new Date(data.date),
          new Date(dateRange.selection.startDate),
          new Date(dateRange.selection.endDate)
        ) ||
        isSameDay(
          new Date(data.date),
          new Date(dateRange.selection.startDate)
        ) ||
        isSameDay(new Date(data.date), new Date(dateRange.selection.endDate))
      );
    });

    let newAddedDate = newAdded.filter(d => {
      return !(
        isWithinRange(
          new Date(d.date),
          new Date(dateRange.selection.startDate),
          new Date(dateRange.selection.endDate)
        ) ||
        isSameDay(new Date(d.date), new Date(dateRange.selection.startDate)) ||
        isSameDay(new Date(d.date), new Date(dateRange.selection.endDate))
      );
    });

    const dbRemovebles = car.advane_prices.filter(d => {
      return (
        isWithinRange(
          new Date(d.date),
          new Date(dateRange.selection.startDate),
          new Date(dateRange.selection.endDate)
        ) ||
        isSameDay(new Date(d.date), new Date(dateRange.selection.startDate)) ||
        isSameDay(new Date(d.date), new Date(dateRange.selection.endDate))
      );
    });

    for (let index = 0; index < dbRemovebles.length; index++) {
      newAddedDate.push({
        date: dbRemovebles[index].date,
        value: `$ ${0}`,
        price: 0
      });
    }

    this.setState({
      cellInfo: newArray,
      resetSelected: false,
      newAdded: newAddedDate,
      value: ""
    });
  };

  handleRangeChange(which, payload) {
    const { cellInfo } = this.state;

    const inRange = cellInfo.filter(data => {
      return (
        isWithinRange(
          new Date(data.date),
          new Date(payload.selection.startDate),
          new Date(payload.selection.endDate)
        ) ||
        isSameDay(new Date(data.date), new Date(payload.selection.startDate)) ||
        isSameDay(new Date(data.date), new Date(payload.selection.endDate))
      );
    });
    if (inRange.length > 0) {
      if (inRange.length == 1) {
        this.setState({
          value: parseInt(inRange[0]["price"])
        });
      } else {
        this.setState({
          value: ""
        });
      }
      this.setState({
        resetSelected: true
      });
    } else {
      this.setState({
        resetSelected: false,
        value: ""
      });
    }

    this.setState({
      [which]: {
        ...this.state[which],
        ...payload
      }
    });
  }

  _applyChanges = () => {
    const { dateRange, value, cellInfo, newAdded } = this.state;
    const selectedDates = eachDay(
      new Date(dateRange.selection.startDate),
      new Date(dateRange.selection.endDate)
    );

    let selected = cellInfo.filter(data => {
      return !(
        isWithinRange(
          new Date(data.date),
          new Date(dateRange.selection.startDate),
          new Date(dateRange.selection.endDate)
        ) ||
        isSameDay(
          new Date(data.date),
          new Date(dateRange.selection.startDate)
        ) ||
        isSameDay(new Date(data.date), new Date(dateRange.selection.endDate))
      );
    });

    let newAddedFilter = newAdded.filter(data => {
      return !(
        isWithinRange(
          new Date(data.date),
          new Date(dateRange.selection.startDate),
          new Date(dateRange.selection.endDate)
        ) ||
        isSameDay(
          new Date(data.date),
          new Date(dateRange.selection.startDate)
        ) ||
        isSameDay(new Date(data.date), new Date(dateRange.selection.endDate))
      );
    });

    for (let index = 0; index < selectedDates.length; index++) {
      selected.push({
        date: selectedDates[index],
        value: `$ ${value}`,
        price: value
      });
      newAddedFilter.push({
        date: selectedDates[index],
        value: `$ ${value}`,
        price: value
      });
    }
    this.setState({
      cellInfo: selected,
      newAdded: newAddedFilter,
      value: ""
    });
  };

  saveChanges = async () => {
    try {
      const { car, dispatch } = this.props;
      const { newAdded } = this.state;
      const data = [];
      for (let index = 0; index < newAdded.length; index++) {
        data.push({
          date: format(new Date(newAdded[index].date), "YYYY-MM-DD"),
          price: newAdded[index].price
        });
      }
      const response = await await axios.post(
        `${process.env.REACT_APP_API_URL}car/calender-price/${car.id}`,
        { data },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        dispatch(fetchAdvancePrice(car.id));
        this.setState({
          newAdded: [],
          removebles: [],
          value: "",
          resetSelected: false
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  cancleChanges = () => {
    const { car } = this.props;
    const cellInfo = [];
    for (let index = 0; index < car.advane_prices.length; index++) {
      cellInfo.push({
        date: new Date(car.advane_prices[index].date),
        price: car.advane_prices[index].price,
        value: `$ ${car.advane_prices[index].price}`
      });
    }
    this.setState({
      cellInfo,
      dateRange: {
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection"
        }
      },
      newAdded: [],
      removebles: [],
      value: "",
      resetSelected: false
    });
  };

  handleInput = e => {
    const input = e.target.validity.valid ? e.target.value : this.state.value;
    this.setState({
      value: input
    });
  };

  render() {
    const { dateRange, cellInfo, value, resetSelected, newAdded } = this.state;

    return (
      <div>
        <div className="title-wrapper approved-bg">
          <div className="sp-title">Price Calendar</div>
        </div>
        <DateRange
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          color="#00C07F"
          ranges={[dateRange.selection]}
          minDate={new Date()}
          cellInfo={cellInfo}
          cellInfoClassName="cellInfo"
          onChange={this.handleRangeChange.bind(this, "dateRange")}
        />
        <div className="date-range-price-wrapper">
          <span className="doler-sign">$</span>
          <input
            type="text"
            pattern="[0-9]*"
            className="form-control date-range-price"
            placeholder="Daily rate"
            value={value}
            onChange={this.handleInput}
          />
          {resetSelected && (
            <Button
              className="sp-reset-btn"
              onClick={() => this._resetSelectedRange()}
            >
              <img
                src="/images/car-edit/reset-icon.svg"
                className="reset-icon"
                alt="Reset"
              />
            </Button>
          )}
          {value && (
            <Button
              type="primary"
              className="apply-btn"
              onClick={() => this._applyChanges()}
            >
              APPLY
            </Button>
          )}

          {newAdded.length > 0 && (
            <div className="calender-buttons-wrapper">
              <div className="flex-container">
                <button
                  className="sp-buttons sp-cancel-btn"
                  onClick={() => this.cancleChanges()}
                >
                  CANCEL
                </button>
                <button
                  className="sp-buttons sp-continue-btn"
                  onClick={() => this.saveChanges()}
                >
                  SAVE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    car: state.car.car_v2
  };
};

export default connect(mapStateToProps)(SecondSideBar);
