import React, { lazy, Suspense, Fragment } from "react";
import { connect } from "react-redux";
import { Switch, Icon, Select, Radio } from "antd";
import {
  fetchUserEarnings,
  fetchEarningsDetail,
  fetchCarsForEarnings,
  fetchPayoutHistory
} from "../../../actions/ProfileActions";
// import Chart from "./Chart";
import ChartInfo from "./ChartInfo";
import moment from "moment";
import ProfilePagination from "../lib/ProfilePagination";
import PreLoader from "../../../components/preloaders/preloaders";
import { PayoutHistory } from "../../organisms/payout-history";
import EarningsInfo from "./EarningsInfo";

const Chart = lazy(() => import("./Chart"));

const RadioGroup = Radio.Group;
const Option = Select.Option;

class Earnings extends React.Component {
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
      dispatch(fetchPayoutHistory());
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
      payoutHistory
    } = this.props;

    const { showHistory } = this.state;
    const radioStyle = {
      display: "block"
    };

    // let maxValue = userEranings.reduce(function(count, item) {
    //   console.log('item',item);
    //   return count + item.earning;
    // }, 0);

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
      <div className="Prof_page_wrapper Prof_earnings">
        <div className="row">
          <div className="col-md-12 prof_trip">
            {/* --------- Page Title -------------- */}
            <div className="Prof_body_title full">
              <div className="flex-space-between">
                {!showHistory ? (
                  <span>Earnings</span>
                ) : (
                  <span>Payout history</span>
                )}
                <button
                  className="Prof_header_link flex-container"
                  onClick={() => this.setState({ showHistory: !showHistory })}
                >
                  {!showHistory ? (
                    <Fragment>
                      <span className="icon-set-one-history-icon Prof_header_link_icon"></span>
                      <span className="Prof_header_link_text">
                        Payout history
                      </span>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <span className="icon-set-one-wallet-icon Prof_header_link_icon"></span>
                      <span className="Prof_header_link_text">
                        Back to earnings
                      </span>
                    </Fragment>
                  )}
                </button>
                {/* --------------- Back to earnings button ------------------
                <span>Payout history</span>
                <button className="Prof_header_link flex-container">
                  <span className="icon-set-one-wallet-icon Prof_header_link_icon"></span>
                  <span className="Prof_header_link_text">
                    Back to earnings
                  </span>
                </button> */}
              </div>
            </div>
            {/* --------- Page Title -------------- */}
          </div>
        </div>

        {/* --------- Payout History - Start -------------- */}
        {showHistory ? (
          <PayoutHistory payoutHistory={payoutHistory} />
        ) : (
          <Fragment />
        )}
        {/* --------- Payout History - Start -------------- */}

        {/* --------- Earnings - Start -------------- */}
        {!showHistory ? <EarningsInfo /> : <Fragment />}
        {/* --------- Earnings - End -------------- */}
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
    payoutHistory: state.profile.payoutHistory
  };
};

export default connect(mapStateToProps)(Earnings);
