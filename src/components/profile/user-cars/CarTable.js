import React, { Fragment } from "react";
import { isMobileOnly } from "react-device-detect";
import { Table, Skeleton, Button, Popover } from "antd";
import Image from "react-shimmer";
import "antd/lib/table/style/index.css";
import "antd/lib/skeleton/style/index.css";
import "antd/lib/button/style/index.css";
import "antd/lib/popover/style/index.css";

class CarTable extends React.Component {
  state = {
    activateRaw: null,
    visible: false
  };

  setCarStatus = status => {
    switch (status) {
      case "pending":
        return (
          <div className="SC_main_id profile-inline-blocks trip-status-wrapper">
            <div className="trip-status-icon">
              {/* <img src="/images/profilev2/pending-acceptance-icon-orange.svg" /> */}
              <span className="icon-set-one-pending-icon status-icon-default" />
            </div>
            <div className="trip-status-text pending-stat-color">
              {isMobileOnly ? "" : "Pending"}
            </div>
          </div>
        );
      case "approved":
        return (
          <div className="SC_main_id profile-inline-blocks trip-status-wrapper">
            <div className="trip-status-icon">
              {/* <img src="/images/profilev2/confirmed-icon-blue.svg" /> */}
              <span className="icon-set-one-completed-icon status-icon-default" />
            </div>
            <div className="trip-status-text completed-stat-color">
              {isMobileOnly ? "" : "Approved"}
            </div>
          </div>
        );
      case "incomplete":
        return (
          <div className="SC_main_id profile-inline-blocks trip-status-wrapper">
            <div className="trip-status-icon">
              {/* <img src="/images/profilev2/completed-icon-gray.svg" /> */}
              <span className="icon-set-one-on-trip-icon status-icon-default" />
            </div>
            <div className="trip-status-text ontrip-stat-color">
              {isMobileOnly ? "" : "Incomplete"}
            </div>
          </div>
        );
      case "reviewed":
        return (
          <div className="SC_main_id profile-inline-blocks trip-status-wrapper">
            <div className="trip-status-icon">
              {/* <img src="/images/profilev2/reviewed-icon-red.svg" /> */}
              <span className="icon-set-one-cancel-icon status-icon-default" />
            </div>
            <div className="trip-status-text canceled-stat-color">
              {isMobileOnly ? "" : "Reviewed"}
            </div>
          </div>
        );
      case "unavailable":
        return (
          <div>
            <Button className="lyrb-btn hov-click">List your ryde back</Button>
          </div>
        );
      default:
        return <Fragment />;
    }
  };

  carReason = reason => {
    return <div className="test123">{reason}</div>;
  };

  tableColumns = () => {
    return [
      {
        title: "",
        width: isMobileOnly ? 170 : 400,
        dataIndex: "name",
        key: "name",
        fixed: isMobileOnly ? false : "left",
        //className: isMobileOnly ? "hidden-xs" : "",
        className: "cars-col",
        rowClassName: "test",
        render: (nothing, carInfo, index) => {
          return (
            <Skeleton
              avatar={{ shape: "square", size: "default" }}
              title={false}
              paragraph={{ rows: 2 }}
              active
              loading={false}
            >
              <div
                className={`SC_main_id profile-inline-blocks car-name-outer ${
                  carInfo.disabled ? "car-row-disabled" : ""
                }`}
                key={index}
              >
                <a
                  onClick={() => {
                    this.props.handleDrawer(carInfo);
                  }}
                  className="hov-click"
                >
                  {" "}
                  <div className="car-photo">
                    <Image
                      className="img-responsive"
                      src={
                        carInfo.carImage
                          ? carInfo.carImage
                          : "/images/defaultcar.jpg"
                      }
                      width={108}
                      height={72}
                      style={{ objectFit: "cover" }}
                    />
                  </div>{" "}
                </a>

                <div>
                  <a
                    onClick={() => {
                      this.props.handleDrawer(carInfo);
                    }}
                    className="hov-click"
                  >
                    <div className="trips-tb-text-lg bold">
                      {carInfo.carName}
                    </div>
                  </a>
                  {carInfo.cstatus == "reviewed" && (
                    <Popover
                      placement="topLeft"
                      content={this.carReason(carInfo.disapprovedReason)}
                      trigger="click"
                    >
                      <div className="reason-wrap hov-click">
                        <img
                          className="reason-icon-red"
                          src="/images/profilev2/reason-icon-red.svg"
                        />
                        Reason
                      </div>
                    </Popover>
                  )}
                </div>
              </div>
            </Skeleton>
          );
        }
      },
      {
        title: "Daily rate",
        width: isMobileOnly ? 230 : 190,
        dataIndex: "dailyrate",
        key: "daily rate",
        render: (nothing, carInfo, index) => {
          const obj = {
            children: (
              <Skeleton title={true} paragraph={false} active loading={false}>
                <div
                  className={`SC_main_id ${
                    carInfo.disabled ? "car-row-disabled" : ""
                  }`}
                  key={index}
                >
                  <div className="trips-tb-text-lg">{carInfo.dailyRate}</div>
                </div>
              </Skeleton>
            ),
            props: {}
          };
          return obj;
        }
      },
      {
        title: "License plate",
        width: isMobileOnly ? 130 : 170,
        dataIndex: "licenseplate",
        key: "licenseplate",
        render: (nothing, carInfo, index) => {
          const obj = {
            children: (
              <Skeleton title={true} paragraph={false} active loading={false}>
                <div
                  className={`SC_main_id ${
                    carInfo.disabled ? "car-row-disabled" : ""
                  }`}
                  key={index}
                >
                  <div className="trips-tb-text-lg">{carInfo.licensePlate}</div>
                </div>
              </Skeleton>
            ),
            props: {}
          };
          return obj;
        }
      },
      {
        title: "Trips",
        width: isMobileOnly ? 130 : 170,
        dataIndex: "trips",
        key: "trips",
        className: "trips-col",
        render: (nothing, carInfo, index) => {
          const obj = {
            children: (
              <Skeleton
                title={false}
                paragraph={{ rows: 2 }}
                active
                loading={false}
              >
                <div
                  className={carInfo.disabled ? "car-row-disabled" : ""}
                  key={index}
                >
                  <div className="trips-tb-text-lg">
                    {carInfo.carTripsCount}
                  </div>
                  {carInfo.isTripHistory && (
                    <p
                      className="trips-tb-text-sm history-wrap hov-click"
                      onClick={() =>
                        this.props.history.push(
                          `/my-profile/trips/${carInfo.id}`
                        )
                      }
                    >
                      <img
                        className="history-icon-green"
                        src="/images/profilev2/history-icon-green.svg"
                      />
                      Trip history
                    </p>
                  )}
                </div>
              </Skeleton>
            ),
            props: {}
          };
          return obj;
        }
      },
      {
        title: "Status",
        width: isMobileOnly ? 80 : 200,
        dataIndex: "status",
        key: "status",
        fixed: "right",
        render: (nothing, carInfo, index) => {
          const obj = {
            children: (
              <Skeleton
                avatar={{ shape: "circle", size: "small" }}
                title={true}
                paragraph={false}
                active
                loading={false}
                key={index}
              >
                {this.setCarStatus(carInfo.cstatus)}
              </Skeleton>
            ),
            props: {}
          };
          return obj;
        }
      }
    ];
  };

  render() {
    const data = this.props.userCars;
    return (
      <Table
        dataSource={data}
        loading={this.props.isFetching}
        pagination={false}
        columns={this.tableColumns()}
        scroll={{ x: isMobileOnly ? 740 : 1130 }}
        rowKey={data => data.id}
        rowClassName={data =>
          data.id === this.state.activateRaw ? "ant-table-row-hover" : null
        }
        className="Prof-table"
        onRow={(record, index) => {
          return {
            onClick: event => this.props.handleDrawer(record)
          };
        }}
      />
    );
  }
}

export default CarTable;
