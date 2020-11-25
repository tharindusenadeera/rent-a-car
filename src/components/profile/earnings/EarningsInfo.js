import React, { Component, lazy, Suspense, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Switch, Icon, Select, Radio } from "antd";
import {
  fetchUserEarnings,
  fetchEarningsDetail,
  fetchCarsForEarnings
} from "../../../actions/ProfileActions";
import ChartInfo from "./ChartInfo";
import ProfilePagination from "../lib/ProfilePagination";
import PreLoader from "../../../components/preloaders/preloaders";

const Chart = lazy(() => import("./Chart"));

const RadioGroup = Radio.Group;
const Option = Select.Option;

class EarningsInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      detailView: false,
      years: [],
      year: "2019",
      selectCarID: "All",
      option: 3,
      step: 1,
      showHistory: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    let years = [];
    let startYear = 2017;
    let currentYear = moment().year();

    while (startYear <= currentYear) {
      years.push(startYear++);
    }

    this.setState({ years }, () => {
      dispatch(fetchCarsForEarnings());
      this.fetchData();
    });
  }

  // fetch data on changes
  fetchData = () => {
    const { dispatch } = this.props;
    if (this.state.detailView === true) {
      if (this.state.option === 3 && this.state.selectCarID !== "All") {
        dispatch(
          fetchEarningsDetail({
            page: this.state.page,
            year: this.state.year,
            car_id: this.state.selectCarID
          })
        );
      }

      if (this.state.option === 3 && this.state.selectCarID == "All") {
        dispatch(
          fetchEarningsDetail({
            page: this.state.page,
            year: this.state.year
          })
        );
      }

      if (this.state.option === 2 && this.state.selectCarID == "All") {
        dispatch(
          fetchEarningsDetail({
            page: this.state.page,
            this_month: true
          })
        );
      }

      if (this.state.option === 2 && this.state.selectCarID !== "All") {
        dispatch(
          fetchEarningsDetail({
            page: this.state.page,
            this_month: true,
            car_id: this.state.selectCarID
          })
        );
      }

      if (this.state.option === 1 && this.state.selectCarID == "All") {
        dispatch(
          fetchEarningsDetail({
            this_week: true
          })
        );
      }

      if (this.state.option === 1 && this.state.selectCarID !== "All") {
        dispatch(
          fetchEarningsDetail({
            this_week: true,
            car_id: this.state.selectCarID
          })
        );
      }
    } else {
      if (this.state.option === 3 && this.state.selectCarID !== "All") {
        dispatch(
          fetchUserEarnings({
            year: this.state.year,
            car_id: this.state.selectCarID
          })
        );
      }

      if (this.state.option === 3 && this.state.selectCarID == "All") {
        dispatch(
          fetchUserEarnings({
            year: this.state.year
          })
        );
      }

      if (this.state.option === 2 && this.state.selectCarID == "All") {
        dispatch(
          fetchUserEarnings({
            this_month: true
          })
        );
      }

      if (this.state.option === 2 && this.state.selectCarID !== "All") {
        dispatch(
          fetchUserEarnings({
            this_month: true,
            car_id: this.state.selectCarID
          })
        );
      }

      if (this.state.option === 1 && this.state.selectCarID == "All") {
        dispatch(
          fetchUserEarnings({
            this_week: true
          })
        );
      }

      if (this.state.option === 1 && this.state.selectCarID !== "All") {
        dispatch(
          fetchUserEarnings({
            this_week: true,
            car_id: this.state.selectCarID
          })
        );
      }
    }
  };

  handleChangeYear = value => {
    const { dispatch } = this.props;
    this.setState({ year: value }, () => {
      this.fetchData();
    });
  };

  handleChangeCars = value => {
    this.setState({ selectCarID: value }, () => {
      this.fetchData();
    });
  };

  handleChangeSwitch = value => {
    this.setState({ detailView: value }, () => {
      this.fetchData();
    });
  };

  onChangeOption = option => {
    this.setState({ option: option.target.value }, () => {
      this.fetchData();
    });
  };

  onChangePagination = value => {
    this.setState({ page: value }, () => {
      this.fetchData();
    });
  };

  // year drop-down
  renderOptions = () => {
    return (
      this.state.years &&
      this.state.years.map((item, index) => {
        return (
          <Option
            value={item}
            key={index + item.id}
            className="Prof_from_select_item Prof_earnings_year"
          >
            {item}
          </Option>
        );
      })
    );
  };

  // cars drop-down
  renderCars = cars => {
    return cars.map((item, index) => {
      return (
        <Option value={item.id} key={index} className="Prof_from_select_item">
          <img src={item.car_photos.data.image_thumb} />
          {item.car_name}
        </Option>
      );
    });
  };
  render() {
    const {
      carsForEarnings,
      userEranings,
      eraningsDetail,
      isFetching,
      totalEranings,
      userPayOuts
    } = this.props;

    const radioStyle = {
      display: "block"
    };

    const eraningsDetailMeta = this.props.eraningsDetail
      ? this.props.eraningsDetail.meta
      : [];

    let earningsSince = "";
    if (this.state.option == 3) {
      earningsSince = "year " + this.state.year;
    } else if (this.state.option == 2) {
      earningsSince = "this month";
    } else if (this.state.option == 1) {
      earningsSince = "this week";
    }

    return (
      <div className="Prof_body">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-4 col-xs-6">
                    <div className="Prof_earnings_stat">
                      <div className="date">Earnings for {earningsSince}</div>
                      <div className="static">
                        <div>
                          <span className="menu_int">
                            {totalEranings ? "$" + totalEranings : "$" + "0.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-xs-6">
                    <div className="Prof_earnings_stat">
                      <div className="date">Last payout</div>
                      <div className="static">
                        <div>
                          <span className="menu_title">
                            ${userPayOuts.last_payout}
                          </span>
                        </div>
                      </div>
                      <div className="paystat_date">
                        {userPayOuts.lastPayout_date != null &&
                          moment(userPayOuts.lastPayout_date).format(
                            "MMM Do, YYYY"
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-xs-6">
                    <div className="Prof_earnings_stat">
                      <div className="date">Next payout</div>
                      <div className="static">
                        <div>
                          <span className="menu_title">
                            ${userPayOuts.next_payout}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-xs-12">
                <div className="stat_switch">
                  <div className="stat_txt">Show Earnings</div>
                  <div>
                    <Switch
                      disabled={parseFloat(totalEranings) > 0.0 ? false : true}
                      onChange={value => {
                        this.handleChangeSwitch(value);
                      }}
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 menu_row">
            <div className="row">
              <div className="col-md-3">
                {carsForEarnings && carsForEarnings.length > 0 && (
                  <Select
                    disabled={
                      userEranings && userEranings.length === 0 ? true : false
                    }
                    defaultValue="All"
                    optionFilterProp="children"
                    onChange={this.handleChangeCars}
                  >
                    <Option value={"All"} className="Prof_from_select_item">
                      {/* <img src={item.car_photos.data.image_thumb} /> */}
                      <img src="/images/profilev2/default-car-list-icon.svg" />
                      Cars
                    </Option>
                    {this.renderCars(carsForEarnings)}
                  </Select>
                )}
              </div>
              <div className="col-md-9">
                <div className="menu_right">
                  <RadioGroup
                    disabled={
                      userEranings && userEranings.length === 0 ? true : false
                    }
                    onChange={this.onChangeOption}
                    value={this.state.option}
                  >
                    <div className="radio_box">
                      <Radio style={radioStyle} value={1}>
                        This week
                      </Radio>
                    </div>
                    <div className="radio_box">
                      <Radio style={radioStyle} value={2}>
                        This month
                      </Radio>
                    </div>
                    <div className="radio_box">
                      <Radio style={radioStyle} value={3}>
                        Year
                      </Radio>
                    </div>
                  </RadioGroup>
                  <div>
                    {this.state.option === 3 && (
                      <Select
                        disabled={
                          userEranings && userEranings.length === 0
                            ? true
                            : false
                        }
                        defaultValue={this.state.year}
                        optionFilterProp="children"
                        onChange={this.handleChangeYear}
                        className="Prof_earnings_select"
                      >
                        {this.renderOptions()}
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {userEranings && userEranings.length === 0 && (
          <div style={{ height: "100vh", top: "50%", bottom: "50%" }}>
            <PreLoader />
          </div>
        )}

        <div className="row">
          <div className="col-md-12 prof_trip">
            {/* { Chart Here} */}
            {userEranings && userEranings.length > 0 && !this.state.detailView && (
              <Suspense
                fallback={
                  <div style={{ height: "100vh", top: "50%", bottom: "50%" }}>
                    <PreLoader />
                  </div>
                }
              >
                <Chart data={userEranings} selectOption={this.state.option} />
              </Suspense>
            )}

            {/* { Table Here} */}
            {this.state.detailView && (
              <ChartInfo
                eraningsDetail={eraningsDetail}
                isFetching={this.props.isFetching}
              />
            )}

            {this.state.detailView &&
              eraningsDetailMeta &&
              eraningsDetailMeta.pagination.total_pages > 1 && (
                <ProfilePagination
                  onChange={this.onChangePagination}
                  total={eraningsDetailMeta.pagination.total}
                  pageSize={eraningsDetailMeta.pagination.per_page}
                  current={this.state.page}
                />
              )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.profile.isFetching,
    userEranings: state.profile.userEranings,
    eraningsDetail: state.profile.eraningsDetail,
    carsForEarnings: state.profile.carsForEarnings,
    totalEranings: state.profile.totalEranings,
    userPayOuts: state.profile.userPayOuts
  };
};

export default connect(mapStateToProps)(EarningsInfo);
