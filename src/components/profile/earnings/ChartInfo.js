import React from "react";
import { Link } from "react-router-dom";
import { Table, Skeleton } from "antd";
import { isMobileOnly } from "react-device-detect";
import "antd/lib/skeleton/style/index.css";

class ChartInfo extends React.Component {
  state = {
    eraningsDetails: [],
    activateRaw: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.eraningsDetail.data !== prevProps.eraningsDetail.data) {
      this.setIntialData(this.props.eraningsDetail.data);
    }
  }

  setIntialData = earnings => {
    const dataArray = [];
    earnings &&
      earnings.length > 0 &&
      earnings.map((earning, key) => {
        let item = {
          id: earning.id,
          carImage: earning.car_photos.data.image_thumb,
          days: earning.days,
          carName: earning.car_name,
          dailyRate: "$" + earning.daily_rate,
          carTripsCount: earning.trips,
          earning: earning.earning,
          disabled: false
        };
        return dataArray.push(item);
      });
    this.setState({ eraningsDetails: dataArray });
  };

  tableColumns = () => {
    return [
      {
        title: "",
        width: isMobileOnly ? 170 : 400,
        dataIndex: "name",
        key: "name",
        fixed: isMobileOnly ? false : "left",
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
              <div className="SC_main_id profile-inline-blocks car-name-outer">
                <div className="car-photo">
                  <img src={carInfo.carImage} />
                </div>
                <div className="trips-tb-text-lg bold">{carInfo.carName}</div>
              </div>
            </Skeleton>
          );
        }
      },
      {
        title: "Daily rate",
        width: isMobileOnly ? 230 : 190,
        dataIndex: "deliverylocation",
        key: "delivery location",
        render: (nothing, carInfo, index) => {
          return (
            <Skeleton title={true} paragraph={false} active loading={false}>
              <div className="SC_main_id">
                <div className="trips-tb-text-lg">{carInfo.dailyRate}</div>
              </div>
            </Skeleton>
          );
        }
      },
      {
        title: "Trips",
        width: isMobileOnly ? 130 : 170,
        dataIndex: "trips",
        key: "trips",
        render: (nothing, carInfo, index) => {
          return (
            <Skeleton title={true} paragraph={false} active loading={false}>
              <div className="SC_main_id">
                <div className="trips-tb-text-lg">{carInfo.carTripsCount}</div>
              </div>
            </Skeleton>
          );
        }
      },
      {
        title: "Days",
        width: isMobileOnly ? 130 : 170,
        dataIndex: "days",
        key: "days",
        className: "trips-col",
        render: (nothing, carInfo, index) => {
          return (
            <Skeleton
              title={false}
              paragraph={{ rows: 2 }}
              active
              loading={false}
            >
              <div className="SC_main_id">
                <div className="trips-tb-text-lg">{carInfo.days}</div>
              </div>
            </Skeleton>
          );
        }
      },
      {
        title: "Earning",
        width: isMobileOnly ? 80 : 200,
        dataIndex: "earning",
        key: "earning",
        fixed: "right",
        render: (nothing, carInfo, index) => {
          return (
            <Skeleton
              avatar={{ shape: "circle", size: "small" }}
              title={true}
              paragraph={false}
              active
              loading={false}
              key={index}
            >
              <div className="SC_main_id">
                <div className="trips-tb-text-lg earning-tot">
                  {"$" + carInfo.earning}
                </div>
              </div>
            </Skeleton>
          );
        }
      }
    ];
  };

  render() {
    return (
      <Table
        pagination={false}
        dataSource={this.state.eraningsDetails}
        loading={this.props.isFetching}
        columns={this.tableColumns()}
        scroll={{ x: isMobileOnly ? 740 : 1130 }}
        rowKey={data => data.id}
        rowClassName={data =>
          data.id === this.state.activateRaw ? "ant-table-row-hover" : null
        }
      />
    );
  }
}
export default ChartInfo;
