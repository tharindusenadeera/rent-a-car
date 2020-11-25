import "react-dates/initialize";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment-timezone";
import { Table, Select } from "antd";
import { isMobileOnly } from "react-device-detect";
import { DateRangePicker } from "react-dates";
import Empty from "./empty";
import { fetchPayoutHistory } from "../../../../actions/ProfileActions";
import ProfilePagination from "../../../profile/lib/ProfilePagination";
import { PAYMENT_STATUS } from "../../../../consts/consts";
import "react-dates/lib/css/_datepicker.css";

class PayoutHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payOuts: [],
      to: null,
      focusedTo: false,
      status: "",
      startDate: null,
      endDate: null,
      page: 1,
      empty: false
    };
  }

  componentDidMount() {
    const { payoutHistory } = this.props;
    this.setInitialData(payoutHistory.data);
  }

  componentDidUpdate(prevProps) {
    const { payoutHistory } = this.props;
    if (payoutHistory.data !== prevProps.payoutHistory.data) {
      this.setInitialData(payoutHistory.data);
    }
  }

  fetchData = pageId => {
    const { dispatch } = this.props;
    const { startDate, endDate, status } = this.state;
    const data = {};

    if (status) {
      data.status = status;
    }

    if (startDate && endDate) {
      data.fromDate = moment(startDate).format("YYYY-MM-DD hh:mm");
      data.toDate = moment(endDate).format("YYYY-MM-DD hh:mm");
    }

    if (pageId) {
      data.page = pageId;
    }

    dispatch(fetchPayoutHistory(data));
  };

  setPayoutStatus = status => {
    switch (status) {
      case "in_transit":
        return (
          <div className="flex-container">
            <span className="icon-set-one-history-icon Prof_header_link_icon pending-stat-color"></span>
            <span className="Prof_table_stat_text pending-stat-color">
              Pending
            </span>
          </div>
        );
      case "paid":
        return (
          <div className="flex-container">
            <span className="icon-set-one-completed-icon Prof_header_link_icon confirmed-stat-color"></span>
            <span className="Prof_table_stat_text confirmed-stat-color">
              Paid
            </span>
          </div>
        );
      case "failed":
        return (
          <div className="flex-container">
            <span className="icon-set-one-cancel-icon Prof_header_link_icon canceled-stat-color"></span>
            <span className="Prof_table_stat_text canceled-stat-color">
              Reviewed
            </span>
          </div>
        );
      case "canceled":
        return (
          <div className="flex-container">
            <span className="icon-set-one-cancel-icon Prof_header_link_icon completed-stat-color"></span>
            <span className="Prof_table_stat_text completed-stat-color">
              Canceled
            </span>
          </div>
        );
      default:
        return <Fragment />;
    }
  };

  setInitialData = payouts => {
    const dataArray = [];

    if (payouts && payouts.length > 0) {
      payouts &&
        payouts.length > 0 &&
        payouts.map((payouts, key) => {
          let item = {
            key: key,
            transfer_id: payouts.payout_id,
            transfer_amount: payouts.amount,
            transfer_date: moment(payouts.created_at).format(
              "ddd, MMMM Do, YYYY"
            ),
            transfer_time: moment(payouts.created_at).format("hh:mm A"),
            transfer_account: payouts.bank_account_number,
            transfer_status: payouts.status
          };
          return dataArray.push(item);
        });
      this.setState({ payOuts: dataArray, empty: false });
    } else {
      this.setState({ empty: true });
    }
  };

  handleStatus = paidStatus => {
    this.setState({ status: paidStatus != "all" ? paidStatus : "" }, () =>
      this.fetchData()
    );
  };

  tableColumns = () => {
    return [
      {
        width: isMobileOnly ? 150 : 340,
        dataIndex: "transfer_id",
        key: "name",
        fixed: isMobileOnly ? "" : "left",
        render: (nothing, payouts, index) => {
          return (
            <span className="Prof_table_strong">{payouts.transfer_id}</span>
          );
        }
      },
      {
        title: "Transferd amount",
        dataIndex: "transfer_amount",
        key: "1",
        width: isMobileOnly ? 130 : 215,
        render: (nothing, payouts, index) => {
          return (
            <Fragment>
              <span className="Prof_table_strong">
                ${payouts.transfer_amount}
              </span>
            </Fragment>
          );
        }
      },
      {
        title: "Transferd date",
        dataIndex: "transfer_date",
        key: "2",
        width: isMobileOnly ? 150 : 215,
        render: (nothing, payouts, index) => {
          return (
            <div className="prof_table_date">
              <div className="trips-tb-text-lg">{payouts.transfer_date}</div>
              <div className="trips-tb-text-sm">{payouts.transfer_time}</div>
            </div>
          );
        }
      },
      {
        title: "Transferd account",
        dataIndex: "transfer_account",
        key: "3",
        width: isMobileOnly ? 130 : 211,
        render: (nothing, payouts, index) => {
          return <Fragment>{payouts.transfer_account}</Fragment>;
        }
      },
      {
        title: "Status",
        key: "transfer_status",
        fixed: "right",
        width: isMobileOnly ? 80 : 150,
        render: (nothing, payouts, index) => (
          <Fragment>{this.setPayoutStatus(payouts.transfer_status)}</Fragment>
        )
      }
    ];
  };

  onChangePagination = page => {
    this.setState({ page: page }, () => {
      this.fetchData(page);
    });
  };

  render() {
    const { Option } = Select;
    const { payOuts, page, status, empty, startDate, endDate } = this.state;
    const { payoutHistory } = this.props;
    const payOutsMeta = payoutHistory ? payoutHistory.meta : [];

    return (
      <div className="Prof_body">
        <div className="row">
          <div className="col-xs-12 col-md-6"></div>
          <div className="col-xs-12 col-md-4">
            <div className="Prof_filter_daterange">
              <DateRangePicker
                startDate={startDate} // momentPropTypes.momentObj or null,
                endDate={endDate} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) =>
                  this.setState({ startDate, endDate }, () => this.fetchData())
                } // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                initialVisibleMonth={() => moment()} // PropTypes.func or null,
                numberOfMonths={isMobileOnly ? 1 : 2}
                isOutsideRange={() => false}
              />
            </div>
          </div>
          <div className="col-xs-12 col-md-2">
            <div className="Prof_earnings_select">
              <Select
                defaultValue="All"
                value={status !== "" ? status : "All"}
                onChange={e => this.handleStatus(e)}
              >
                {PAYMENT_STATUS.map((item, index) => {
                  return (
                    <Option value={item.key} key={index}>
                      <img
                        src={item.icon_src}
                        className="Prof_antdropdown_icon"
                      />
                      <span>{item.value}</span>
                    </Option>
                  );
                })}
                <Option value="all" key="all">
                  <span>All</span>
                </Option>
              </Select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {empty == false ? (
              <Table
                columns={this.tableColumns()}
                dataSource={payOuts}
                scroll={{ x: isMobileOnly ? 740 : 1130 }}
                className="payout_table"
                pagination={false}
              />
            ) : (
              <Empty />
            )}
          </div>
        </div>
        {payOuts && payOutsMeta && payOutsMeta.pagination.total_pages > 1 && (
          <div className="SC_option_pagination">
            <ProfilePagination
              onChange={this.onChangePagination}
              total={payOutsMeta.pagination.total}
              pageSize={payOutsMeta.pagination.per_page}
              current={page}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.profile.isFetching,
    payoutHistory: state.profile.payoutHistory
  };
};

export default connect(mapStateToProps)(PayoutHistory);
