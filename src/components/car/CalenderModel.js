import React, { Component } from "react";
import { DateRange } from "react-calendar-custom-date";
import moment from "moment";
import "react-calendar-custom-date/dist/styles.css"; // main style file
import "react-calendar-custom-date/dist/theme/default.css"; // theme css file

class CalenderModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cellInfo: [],
      resetSelected: false
    };
  }

  componentDidMount() {
    const { itemPriceBreakDown } = this.props;
    this.setCellInfo(itemPriceBreakDown);
  }

  componentWillReceiveProps(nextProps) {
    this.setCellInfo(nextProps.itemPriceBreakDown);
  }

  setCellInfo = itemPriceBreakDown => {
    const { cellInfo } = this.state;
    for (let index = 0; index < itemPriceBreakDown.length; index++) {
      cellInfo.push({
        date: moment(itemPriceBreakDown[index].date),
        value:
          (itemPriceBreakDown[index].price &&
            `$ ${Math.floor(itemPriceBreakDown[index].price)}`) ||
          (itemPriceBreakDown[index].amount &&
            `$ ${Math.floor(itemPriceBreakDown[index].amount)}`)
      });
    }

    this.setState({
      cellInfo
    });
  };

  render() {
    const { cellInfo } = this.state;
    const { startDate, endDate } = this.props;
    const dateRange = {
      selection: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        key: "selection"
      }
    };

    return (
      <div>
        <DateRange
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          color="#00C07F"
          cellInfo={cellInfo}
          cellInfoClassName="cellInfo"
          ranges={[dateRange.selection]}
          onChange={() => console.log("")}
        />
      </div>
    );
  }
}

export default CalenderModel;
