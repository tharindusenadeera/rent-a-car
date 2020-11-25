import React from "react";
import { connect } from "react-redux";
import { Table, Select, Checkbox, Tooltip, Drawer } from "antd";
import { isMobileOnly } from "react-device-detect";
import moment from "moment";
import Image from "react-shimmer";
import queryString from "query-string";
import _ from "lodash";
import {
  getUsersBookings,
  fetchCarsFromUserBooking,
  getActionRequired,
  getBooking
} from "../../actions/BookingActions";
import { getCarCoverageLevels } from "../../actions/CarActions";
import {
  TRIP_IS_PENDING,
  TRIP_IS_CONFIRM,
  TRIP_IS_CANCELED,
  TRIP_IS_ONTRIP,
  TRIP_IS_END
} from "../../consts/consts";
import BookingDetails from "./TripBookingDetails";
import ProfilePagination from "./lib/ProfilePagination";
import PaginationHeader from "./lib/PaginationHeader";
import Empty from "./Empty";
import "antd/lib/table/style/index.css";
import "antd/lib/select/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/tooltip/style/index.css";
import "antd/lib/drawer/style/index.css";

const Option = Select.Option;
const tooltipTextOrange = <span>You have a extra fee request</span>;
const tooltipTextGreen = <span>Trip extention has been approved</span>;

class TripsContent extends React.Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const {
      filter_as_owner,
      filter_as_renter,
      filet_as_date,
      trip_status,
      car_id,
      page
    } = queryString.parse(history.location.search);

    this.state = {
      page: page ? parseInt(page) : 1,
      tripInfo: [],
      activateRaw: null,
      visible: false,
      filter_as_owner: filter_as_owner === "false" ? false : true,
      filter_as_renter: filter_as_renter === "false" ? false : true,
      filet_as_date: filet_as_date && filet_as_date !== "0" ? filet_as_date : 0,
      trip_status: parseInt(trip_status) ? parseInt(trip_status) : -10,
      car_id: parseInt(car_id) ? parseInt(car_id) : 0,
      action_required: props.actionRequired.actionRequiredList,
      tableData: [],
      clicked: false,
      showActionRequired: true
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getActionRequired());
    dispatch(getCarCoverageLevels());
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.actionRequired.actionRequiredList != this.state.action_required
    ) {
      this.setState({
        action_required: nextProps.actionRequired.actionRequiredList
      });
    }
    if (nextProps.bookings.data != this.props.bookings.data) {
      this.setTableGrid(nextProps.bookings);
    }
  }

  componentDidMount() {
    const { dispatch, match, history } = this.props;

    const searchQuery = queryString.parse(history.location.search);
    if (match.params.id) {
      this.setState({ car_id: parseInt(match.params.id) });
    }
    if (!_.isEmpty(searchQuery)) {
      this.setFilter();
    } else {
      dispatch(getUsersBookings({ page: 1 }));
    }

    dispatch(fetchCarsFromUserBooking());
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if (match.params.id && match.params.id !== prevProps.match.params.id) {
      this.setState({ car_id: parseInt(match.params.id) }, () => {
        this.setFilter();
      });
    }

    if (
      match.params.id === undefined &&
      prevProps.match.params.id !== undefined
    ) {
      this.setState(
        {
          car_id: 0
        },
        () => {
          this.setFilter();
        }
      );
    }
  }

  onChangePagination = page => {
    this.setState({ page: page }, () => {
      this.setFilter();
    });
  };

  setSearchParams = () => {
    const { history, match } = this.props;
    if (match.params.tab == "trips") {
      const {
        filter_as_owner,
        filter_as_renter,
        filet_as_date,
        trip_status,
        car_id,
        page
      } = this.state;
      history.push({
        pathname: history.location.pathname,
        search: queryString.stringify({
          filter_as_owner,
          filter_as_renter,
          filet_as_date,
          trip_status,
          car_id,
          page
        })
      });
    }
  };

  setFilter = () => {
    let params = {};
    const {
      filter_as_owner,
      filter_as_renter,
      filet_as_date,
      trip_status,
      car_id,
      page
    } = this.state;
    const { dispatch } = this.props;
    params.page = page;
    if (filter_as_owner) {
      params.user_type = "owner";
    }
    if (filter_as_renter) {
      params.user_type = "renter";
    }
    if (filter_as_owner && filter_as_renter) {
      params.user_type = "both";
    }
    if (filet_as_date) {
      params.trips = filet_as_date;
    }
    if (trip_status !== -10) {
      params.status = trip_status;
    }
    if (car_id) {
      params.cars = [car_id];
    }
    this.setSearchParams();
    dispatch(getUsersBookings(params));
  };

  setStatusIconObj = status => {
    switch (status) {
      case TRIP_IS_PENDING:
        return {
          icon: (
            <span className="icon-set-one-pending-icon status-icon-default" />
          ),
          status: (
            <div className="trip-status-text pending-stat-color">
              Pending acceptance
            </div>
          )
        };
      case TRIP_IS_CANCELED:
        return {
          icon: (
            <span className="icon-set-one-cancel-icon status-icon-default" />
          ),
          status: (
            <div className="trip-status-text canceled-stat-color">Canceled</div>
          )
        };
      case TRIP_IS_CONFIRM:
        return {
          icon: (
            <span className="icon-set-one-confirm-icon status-icon-default" />
          ),
          status: (
            <div className="trip-status-text confirmed-stat-color">
              Confirmed
            </div>
          )
        };
      case TRIP_IS_ONTRIP:
        return {
          icon: (
            <span className="icon-set-one-on-trip-icon status-icon-default" />
          ),
          status: (
            <div className="trip-status-text on-trip-stat-color">On trip</div>
          )
        };
      case TRIP_IS_END:
        return {
          icon: (
            <span className="icon-set-one-completed-icon status-icon-default" />
          ),
          status: (
            <div className="trip-status-text completed-stat-color">
              Completed
            </div>
          )
        };
      default:
        return {
          icon: <img src="/images/profilev2/on-trip-icon-green.svg" />,
          status: "Other"
        };
    }
  };

  onCloseActionRequire = () => {
    const { tableData } = this.state;
    var newArr = tableData.filter(item => {
      return !item.showTopActionRaw;
    });
    this.setState({ tableData: newArr, showActionRequired: false });
  };

  tableColumns = () => {
    return [
      {
        title: "",
        width: isMobileOnly ? 170 : 350,
        dataIndex: "name",
        key: "name",
        fixed: isMobileOnly ? false : "left",
        //className: isMobileOnly ? "hidden-xs" : "",
        render: (nothing, tripInfo, index) => {
          if (index === 0 && tripInfo.showTopActionRaw === true) {
            return {
              children: (
                <h5>
                  You have {tripInfo.length ? tripInfo.length : ""} trips that
                  requires actions
                </h5>
              ),
              props: {
                colSpan: 4
              }
            };
          }
          return (
            <div
              className="SC_main_id profile-inline-blocks car-name-outer"
              key={index}
            >
              <a
                onClick={() => this.showDrawer(tripInfo)}
                className="hov-click"
              >
                <div className="car-photo">
                  {tripInfo.extraTicket == true &&
                    tripInfo.tripExtension == false && (
                      <Tooltip
                        placement="rightTop"
                        overlayClassName="trips-tooltip-orange"
                        title={tooltipTextOrange}
                      >
                        <div className="not-dot dot-orange" />
                        {/* <img src={tripInfo.carImage} /> */}
                        <Image
                          src={tripInfo.carImage}
                          width={108}
                          height={72}
                          style={{ objectFit: "cover" }}
                        />
                      </Tooltip>
                    )}

                  {tripInfo.tripExtension == true &&
                    tripInfo.extraTicket == false && (
                      <Tooltip
                        placement="rightTop"
                        overlayClassName="trips-tooltip-green"
                        title={tooltipTextGreen}
                      >
                        <div className="not-dot dot-green" />
                        {/* <img src={tripInfo.carImage} /> */}
                        <Image
                          src={tripInfo.carImage}
                          width={108}
                          height={72}
                          style={{ objectFit: "cover" }}
                        />
                      </Tooltip>
                    )}
                  {tripInfo.tripExtension == false &&
                    (tripInfo.extraTicket == false && (
                      // <img src={tripInfo.carImage} />
                      <Image
                        src={tripInfo.carImage}
                        width={108}
                        height={72}
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                  {tripInfo.tripExtension == true &&
                    (tripInfo.extraTicket == true && (
                      <Tooltip
                        placement="rightTop"
                        overlayClassName="trips-tooltip-orange"
                        title={tooltipTextOrange}
                      >
                        <div className="not-dot dot-orange" />
                        {/* <img src={tripInfo.carImage} /> */}
                        <Image
                          src={tripInfo.carImage}
                          width={108}
                          height={72}
                          style={{ objectFit: "cover" }}
                        />
                      </Tooltip>
                    ))}
                </div>
              </a>

              <a
                onClick={() => this.showDrawer(tripInfo)}
                className="hov-click"
              >
                <div className="trips-tb-text-lg bold">{tripInfo.carName}</div>
              </a>
            </div>
          );
        }
      },
      {
        title: "Delivery location/Pickup",
        width: isMobileOnly ? 230 : 330,
        dataIndex: "deliverylocation",
        key: "delivery location",
        render: (nothing, tripInfo, index) => {
          const obj = {
            children: (
              <div className="SC_main_id" key={index}>
                <div className="trips-tb-text-lg">
                  {tripInfo.deliveryLocation}
                </div>
              </div>
            ),
            props: {}
          };
          if (index === 0 && tripInfo.showTopActionRaw === true) {
            obj.props.colSpan = 0;
          }
          return obj;
        }
      },
      {
        title: "From",
        width: isMobileOnly ? 130 : 150,
        dataIndex: "from",
        key: "from",

        render: (nothing, tripInfo, index) => {
          const obj = {
            children: (
              <div className="prof_table_date" key={index}>
                {tripInfo.fromDate && (
                  <div className="trips-tb-text-lg">
                    {tripInfo.fromDate.slice(0, -2)}
                    <sup>{tripInfo.fromDate.slice(-2)}</sup>
                  </div>
                )}
                <div className="trips-tb-text-sm">{tripInfo.fromTime}</div>
              </div>
            ),
            props: {}
          };
          if (index === 0 && tripInfo.showTopActionRaw === true) {
            obj.props.colSpan = 0;
          }
          return obj;
        }
      },
      {
        title: "To",
        width: isMobileOnly ? 130 : 150,
        dataIndex: "to",
        key: "to",

        render: (nothing, tripInfo, index) => {
          const obj = {
            children: (
              <div className="prof_table_date" key={index}>
                {tripInfo.toDate && (
                  <div className="trips-tb-text-lg">
                    {tripInfo.toDate.slice(0, -2)}
                    <sup>{tripInfo.toDate.slice(-2)}</sup>
                  </div>
                )}
                <div className="trips-tb-text-sm">{tripInfo.toTime}</div>
              </div>
            ),
            props: {}
          };
          if (index === 0 && tripInfo.showTopActionRaw === true) {
            obj.props.colSpan = 0;
          }
          return obj;
        }
      },
      {
        title: "Status",
        width: isMobileOnly ? 80 : 150,
        dataIndex: "status",
        key: "status",
        fixed: "right",

        render: (nothing, tripInfo, index) => {
          const obj = {
            children: (
              <div
                className="SC_main_id profile-inline-blocks trip-status-wrapper"
                key={index}
              >
                <div className="trip-status-icon">
                  {tripInfo.tripStatusIcon}
                </div>

                {tripInfo.tripStatus}
              </div>
            ),
            props: {}
          };
          if (index === 0 && tripInfo.showTopActionRaw === true) {
            obj.props.colSpan = 1;
            obj.children = (
              <a onClick={() => this.onCloseActionRequire()}>
                <img
                  className="Prof_trip_close"
                  src="/images/profilev2/close-icon.png"
                />
              </a>
            );
          }
          return obj;
        }
      }
    ];
  };

  showDrawer = tripInfo => {
    const { dispatch } = this.props;
    dispatch(getBooking(tripInfo.id));
    this.setState(
      {
        tripInfo,
        visible: true,
        clicked: !this.state.clicked
      },
      () => {
        this.props.clicked(tripInfo.id);
      }
    );
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  setTableGrid = bookings => {
    const { action_required, showActionRequired } = this.state;
    if (bookings && bookings.data) {
      let data = [];
      if (
        action_required &&
        action_required.data.length > 0 &&
        showActionRequired
      ) {
        const message =
          "You have" +
          `${action_required.data.length}` +
          "trips that requires actions";
        data.push({
          id: "uidx@@@#4",
          _id: "uidx@@@#4",
          showTopActionRaw: true,
          _isBookingRaw: false,
          message: message,
          length: action_required.data.length
        });
      }
      if (
        action_required &&
        action_required.data.length > 0 &&
        showActionRequired
      ) {
        action_required.data.forEach(element => {
          data.push({
            id: element.id,
            _id: `__a${element.id}`,
            showTopActionRaw: true,
            _isBookingRaw: true,
            tripId: element.number,
            carImage: element.car.car_photo.image_thumb,
            carName: element.car_name,
            carOwner: element.car_owner,
            deliveryLocation: element.delivery_location_method.location,
            fromDate: moment(element.from_date).format("ddd, MMM Do"),
            fromTime: moment(element.from_date).format("h:mm A"),
            toDate: moment(element.to_date).format("ddd, MMM Do"),
            toTime: moment(element.to_date).format("h:mm A"),
            amountCharged:
              element.btn.user_type == "renter"
                ? element.amount_charged
                : element.car_owner_amount,
            user: element.user,
            acceptanceRate: element.acceptance_rate,
            responseTime: element.response_time,
            status: element.status,
            tripStatusIcon: this.setStatusIconObj(element.status).icon,
            tripStatus: isMobileOnly
              ? ""
              : this.setStatusIconObj(element.status).status,
            userType: element.btn.user_type,
            status: element.status,
            userId: element.user_id,
            extraTicket: element.extra_ticket,
            tripExtension: element.trip_extension,
            subTotal: element.sub_total,
            dropoff_location: element.dropoff_location,
            callTo: element.call_to,
            receiptAvailability: element.receipt_availability
          });
        });
      }

      bookings.data.forEach(element => {
        const hasActionRequired = data.filter(i => {
          return i.id == element.id;
        });
        if (!hasActionRequired.length) {
          data.push({
            id: element.id,
            _id: element.id,
            _isBookingRaw: true,
            tripId: element.number,
            carImage: element.car.car_photo.image_thumb,
            carName: element.car_name,
            carOwner: element.car_owner,
            deliveryLocation: element.delivery_location_method.location,
            fromDate: moment(element.from_date).format("ddd, MMM Do"),
            fromTime: moment(element.from_date).format("h:mm A"),
            toDate: moment(element.to_date).format("ddd, MMM Do"),
            toTime: moment(element.to_date).format("h:mm A"),
            amountCharged:
              element.btn.user_type == "renter"
                ? element.amount_charged
                : element.car_owner_amount,
            user: element.user,
            acceptanceRate: element.acceptance_rate,
            responseTime: element.response_time,
            status: element.status,
            tripStatusIcon: this.setStatusIconObj(element.status).icon,
            tripStatus: isMobileOnly
              ? ""
              : this.setStatusIconObj(element.status).status,
            userType: element.btn.user_type,
            status: element.status,
            userId: element.user_id,
            extraTicket: element.extra_ticket,
            tripExtension: element.trip_extension,
            subTotal: element.sub_total,
            callTo: element.call_to,
            receiptAvailability: element.receipt_availability,
            dropoff_location: element.dropoff_location
          });
        }
      });
      //return data;
      this.setState({ tableData: data });
    }
  };

  setToolTipForCarImg = element => {
    if (element.extra_ticket === true) {
      return (
        <Tooltip
          placement="rightTop"
          overlayClassName="trips-tooltip-orange"
          title={tooltipTextOrange}
        >
          <div className="not-dot dot-orange" />
          {this.setStatusIconObj(element.status).icon}
        </Tooltip>
      );
    } else if (element.edit_reques === true) {
      return (
        <Tooltip
          placement="rightTop"
          overlayClassName="trips-tooltip-green"
          title={tooltipTextGreen}
        >
          <div className="not-dot dot-green" />
          {this.setStatusIconObj(element.status).icon}
        </Tooltip>
      );
    } else {
      return this.setStatusIconObj(element.status).icon;
    }
  };

  render() {
    const {
      bookings,
      isBookingsFetching,
      carsFromBookings,
      carCoverageLevels
    } = this.props;
    const {
      filet_as_date,
      trip_status,
      car_id,
      filter_as_owner,
      filter_as_renter
    } = this.state;

    let meta = bookings.meta ? bookings.meta : null;

    return (
      <div className="Prof_page_wrapper">
        <div className="row">
          <div className="col-md-12 prof_trip">
            {/* <div className="Prof_body_title full">
              Trips -
              {bookings && bookings.meta
                ? " " + bookings.meta.pagination.total
                : "loading.."}
            </div> */}
            <div className="Prof_body">
              <div className="row">
                <div className="col-xs-12 col-md-5">
                  <div className="row">
                    <div className="col-xs-6 col-md-4">
                      <div className="Prof_top_checkbox">
                        <Checkbox
                          onChange={e => {
                            this.setState(
                              {
                                filter_as_renter: e.target.checked,
                                page: 1
                              },
                              () => this.setFilter()
                            );
                          }}
                          checked={filter_as_renter}
                        >
                          <span className="checkbox-label">Renter</span>
                        </Checkbox>
                      </div>
                    </div>
                    <div className="col-xs-6 col-md-4">
                      <div className="Prof_top_checkbox">
                        <Checkbox
                          onChange={e => {
                            this.setState(
                              {
                                filter_as_owner: e.target.checked,
                                page: 1
                              },
                              () => this.setFilter()
                            );
                          }}
                          checked={filter_as_owner}
                        >
                          <span className="checkbox-label">Owner</span>
                        </Checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-3">
                  <Select
                    showSearch
                    className="XXX-123456"
                    // placeholder="Cars"
                    value={car_id}
                    defaultValue="0"
                    optionFilterProp="children"
                    onChange={e =>
                      this.setState({ car_id: e, page: 1 }, () =>
                        this.setFilter()
                      )
                    }
                    // filterOption={(input, option) =>
                    //   option.props.children
                    //     .toLowerCase()
                    //     .indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    <Option
                      value={0}
                      key="1!@!"
                      className="Prof_from_select_item"
                    >
                      <img src="/images/profilev2/default-car-list-icon.svg" />
                      Cars
                    </Option>
                    {carsFromBookings.map((car, index) => {
                      return (
                        <Option
                          key={index}
                          value={car.car_id}
                          className="Prof_from_select_item"
                        >
                          <img src={car.image_thumb} />
                          {car.car_name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="col-xs-6 col-md-2">
                  <Select
                    placeholder="Trips"
                    defaultValue={0}
                    value={filet_as_date}
                    optionFilterProp="children"
                    onChange={e =>
                      this.setState({ filet_as_date: e, page: 1 }, () =>
                        this.setFilter()
                      )
                    }
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={0} className="Prof_from_select_item">
                      Trips
                    </Option>
                    <Option value="today" className="Prof_from_select_item">
                      Today
                    </Option>
                    <Option value="yesterday" className="Prof_from_select_item">
                      Yesterday
                    </Option>
                    <Option value="last_week" className="Prof_from_select_item">
                      Last week
                    </Option>
                    <Option
                      value="last_month"
                      className="Prof_from_select_item"
                    >
                      Last month
                    </Option>
                  </Select>
                </div>
                <div className="col-xs-6 col-md-2">
                  <Select
                    // placeholder="Status"
                    defaultValue="0"
                    value={trip_status}
                    optionFilterProp="children"
                    onChange={e =>
                      this.setState({ trip_status: e, page: 1 }, () =>
                        this.setFilter()
                      )
                    }
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={-10} className="Prof_from_select_item">
                      Status
                    </Option>
                    <Option
                      value={TRIP_IS_ONTRIP}
                      className="Prof_from_select_item"
                    >
                      On trip
                    </Option>
                    <Option
                      value={TRIP_IS_PENDING}
                      className="Prof_from_select_item"
                    >
                      Pending
                    </Option>
                    <Option
                      value={TRIP_IS_CONFIRM}
                      className="Prof_from_select_item"
                    >
                      Confirmed
                    </Option>
                    <Option
                      value={TRIP_IS_CANCELED}
                      className="Prof_from_select_item"
                    >
                      Canceled
                    </Option>
                    <Option
                      value={TRIP_IS_END}
                      className="Prof_from_select_item"
                    >
                      Completed
                    </Option>
                  </Select>
                </div>
              </div>

              {/* {this.state.tableData.length > 0 && ( */}
              <div className="row">
                <div className="col-md-12">
                  <Table
                    pagination={false}
                    dataSource={this.state.tableData}
                    columns={this.tableColumns()}
                    scroll={{ x: isMobileOnly ? 740 : 1130 }}
                    rowKey={data => data._id}
                    loading={isBookingsFetching}
                    className="Prof-table"
                    onRow={(record, index) => {
                      return {
                        onClick: event => {
                          if (record._isBookingRaw) {
                            this.showDrawer(record);
                          }
                        }
                      };
                    }}
                    rowClassName={(data, index) => {
                      let cssClassName = "";
                      if (data.showTopActionRaw === true) {
                        cssClassName = "top-row-action-class";
                      } else {
                        cssClassName = "";
                      }

                      return cssClassName;
                    }}
                  />

                  {/* Drawer - Booking details */}
                  <div>
                    <Drawer
                      placement="right"
                      closable={false}
                      onClose={this.onClose}
                      visible={this.state.visible}
                      width={470}
                      className="trip-booking-drawer"
                    >
                      <BookingDetails
                        history={this.props.history}
                        tripInfo={this.state.tripInfo}
                        booking={this.props.booking}
                        onClose={this.onClose}
                        carCoverageLevels={carCoverageLevels}
                      />
                    </Drawer>
                  </div>
                </div>
              </div>

              {meta && meta.pagination.count ? (
                <PaginationHeader parent="trips" meta={meta} />
              ) : null}
              {/* pagination */}
              {bookings &&
                bookings.meta &&
                bookings.meta.pagination.total_pages > 1 && (
                  <ProfilePagination
                    onChange={this.onChangePagination}
                    total={bookings.meta.pagination.total}
                    pageSize={bookings.meta.pagination.per_page}
                    current={this.state.page}
                  />
                )}

              {this.state.tableData.length === 0 &&
                this.props.isBookingsFetching === false && (
                  <Empty match={this.props.match} />
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bookings: state.booking.users_bookings,
    isBookingsFetching: state.booking.isBookingFetching,
    carsFromBookings: state.booking.carsFromBookings,
    actionRequired: state.booking.actionRequired,
    booking: state.booking.booking,
    carCoverageLevels: state.car.carCoverageLevels
  };
};
export default connect(mapStateToProps)(TripsContent);
