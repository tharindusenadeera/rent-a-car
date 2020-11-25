import React from "react";
import { connect } from "react-redux";
import { Select, Drawer } from "antd";
import queryString from "query-string";
import CarDetails from "./CarDetails";
import CarTable from "./CarTable";
import ProfilePagination from "../lib/ProfilePagination";
import PaginationHeader from "../lib/PaginationHeader";
import { fetchUserCars } from "../../../actions/ProfileActions";
import { fetchCar, fetchAdvancePrice } from "../../../actions/CarActions";
import SecondSideBar from "../../../components/ant-drawer/secondSideBar";
import Empty from "../Empty";
import { isMobileOnly } from "react-device-detect";
import { CAR_V2, ADVANCE_CAR_PRICE } from "../../../actions/ActionTypes";
import "antd/lib/select/style/index.css";
import "antd/lib/drawer/style/index.css";

const Option = Select.Option;

class CarsContent extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const queryData = queryString.parse(history.location.search);
    this.state = {
      userCars: [],
      carInfo: {},
      status: "All",
      page: queryData.page ? parseInt(queryData.page) : 1,
      visible: false,
      subDrawer: false
    };
  }

  handleChange = value => {
    const { dispatch } = this.props;
    this.setState({ status: value, page: 1 }, () => {
      dispatch(fetchUserCars({ page: 1, status: value }));
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch(fetchUserCars({ page }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userCars.data !== prevProps.userCars.data) {
      this.setIntialData(this.props.userCars.data);
    }
  }

  setIntialData(data) {
    let carArray = [];
    let carStatus = "";
    data.map((car, index) => {
      if (car.status === 0) {
        carStatus = "pending";
      } else if (car.status === 1) {
        carStatus = "approved";
      } else if (car.status === 2) {
        carStatus = "unavailable";
      } else if (car.status === -1) {
        carStatus = "incomplete";
      } else if (car.status === -2) {
        carStatus = "reviewed";
      }

      let item = {
        id: car.id,
        year: car.year,
        carMake: car.car_make,
        carModel: car.car_model,
        transmission: car.transmission,
        carImage: car.car_photos.data.image_thumb,
        carName: car.car_name,
        dailyRate: "$ " + car.daily_rate,
        licensePlate: car.license_plate_number,
        carTripsCount: car.trip_count,
        carHistory: "trip history",
        isTripHistory: car.trip_count > 0 ? true : false,
        cstatus: carStatus,
        disabled: false,
        disapprovedReason: car.status == -2 ? car.disapproved_reason : null
      };
      carArray.push(item);

      return carArray;
    });
    this.setState({ userCars: carArray });
  }

  onChangePagination = page => {
    const { dispatch, history, match } = this.props;

    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({ page })
    });
    this.setState({ page: page }, () => {
      dispatch(fetchUserCars({ page: page, status: this.state.status }));
    });
  };

  handleDrawer(carInfo) {
    this.setState({ carInfo, visible: !this.state.visible }, () => {
      this.props.dispatch(fetchCar(carInfo.id));
    });
  }

  handleSubDrawer(carId) {
    this.setState({ subDrawer: true }, () => {
      this.props.dispatch(fetchAdvancePrice(carId));
    });
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onCloseSubDrawer = () => {
    this.setState(
      {
        subDrawer: false
      },
      () => {
        this.props.dispatch({ type: ADVANCE_CAR_PRICE, payload: "" });
        this.props.dispatch({ type: CAR_V2, payload: "" });
      }
    );
  };

  render() {
    const userCarsMeta = this.props.userCars.meta
      ? this.props.userCars.meta
      : null;

    return (
      <div className="Prof_page_wrapper">
        <div className="row">
          <div className="col-md-12 prof_trip prof_cars">
            <div className="Prof_body">
              <div className="row">
                <div className="col-xs-12 col-md-10 prof_trip prof_cars" />
                <div className="col-xs-12 col-md-2">
                  <Select
                    showSearch
                    defaultValue="All"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    disabled={
                      this.state.userCars.length === 0 &&
                      this.state.status === "All"
                        ? true
                        : false
                    }
                  >
                    <Option value="All" className="Prof_from_select_item">
                      All cars
                    </Option>
                    <Option value="0" className="Prof_from_select_item">
                      Pending
                    </Option>
                    <Option value="1" className="Prof_from_select_item">
                      Approved
                    </Option>
                    <Option value="2" className="Prof_from_select_item">
                      Unlisted
                    </Option>
                    <Option value="-2" className="Prof_from_select_item">
                      Reviewed
                    </Option>
                  </Select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  {/* Car - Car table */}
                  {this.state.userCars && this.state.userCars.length > 0 && (
                    <CarTable
                      userCars={this.state.userCars}
                      handleDrawer={this.handleDrawer.bind(this)}
                      isFetching={this.props.isFetching}
                      history={this.props.history}
                    />
                  )}

                  {/* Cars Empty Table */}
                  {this.state.userCars &&
                    this.state.userCars.length === 0 &&
                    this.state.status !== "All" && <CarTable userCars={[]} />}
                  {userCarsMeta && (
                    <PaginationHeader parent="cars" meta={userCarsMeta} />
                  )}

                  {userCarsMeta && userCarsMeta.pagination.total_pages > 1 && (
                    <ProfilePagination
                      onChange={this.onChangePagination}
                      total={userCarsMeta.pagination.total}
                      pageSize={userCarsMeta.pagination.per_page}
                      current={this.state.page}
                    />
                  )}

                  {/* Drawer - Booking details */}
                  <Drawer
                    width={isMobileOnly ? 430 : 470}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    className="trip-booking-drawer"
                    history={this.props.history}
                  >
                    {/* Drawer Car Calender */}
                    <Drawer
                      className="edit-panel side-panel"
                      width={isMobileOnly ? 300 : 500}
                      closable={false}
                      onClose={this.onCloseSubDrawer}
                      visible={this.state.subDrawer}
                    >
                      <SecondSideBar />
                    </Drawer>

                    <CarDetails
                      carInfo={this.state.carInfo}
                      history={this.props.history}
                      onClose={this.onClose}
                      handleSubDrawer={this.handleSubDrawer.bind(this)}
                    />
                  </Drawer>

                  {this.state.userCars.length === 0 &&
                    this.state.status === "All" &&
                    this.props.isFetching === false && (
                      <Empty match={this.props.match} />
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userCars: state.profile.userCars,
    advane_prices: state.car,
    isFetching: state.profile.isFetching
  };
};

export default connect(mapStateToProps)(CarsContent);
