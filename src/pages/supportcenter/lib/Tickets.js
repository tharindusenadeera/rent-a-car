import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Table, Checkbox, Select, Drawer } from "antd";
import { connect } from "react-redux";
import axios from "axios";
import moment from "moment";
import { isMobileOnly } from "react-device-detect";
import Image from "react-shimmer";
import queryString from "query-string";
import DeleteBtn from "../../../components/supportcenter/DeleteBtn";
import TicketStatus from "../../../components/supportcenter/TicketStatus";
import { fetchSupportTickets } from "../../../actions/SupportCenterActions";
import { TICKET_STATUS, TICKET_TYPES } from "../../../consts/consts";
import Pagination from "../../../components/profile/lib/ProfilePagination";
import checkAuth from "../../../components/requireAuth";
import CreateNewTicket from "./CreateNewTicket";
import PaginationHeader from "../../../components/profile/lib/PaginationHeader";
import "antd/lib/table/style/index.css";
import "antd/lib/select/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/tooltip/style/index.css";
import { authFail } from "../../../actions/AuthAction";

const Option = Select.Option;

class Tickets extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const {
      isHost,
      isGuest,
      ticketStatus,
      ticketType,
      page
    } = queryString.parse(history.location.search);

    this.state = {
      activateRaw: null,
      isHost: isHost === "false" ? false : true,
      isGuest: isGuest === "false" ? false : true,
      ticketStatus: ticketStatus ? parseInt(ticketStatus) : null,
      ticketType: ticketType ? ticketType : null,
      page: page ? parseInt(page) : 1,
      visible: false,
      drawerContent: null
    };
    this.fetchWithFilterd();
  }

  setSearchParams = () => {
    const { history } = this.props;
    const { page, isHost, isGuest, ticketStatus, ticketType } = this.state;
    history.push({
      pathname: history.location.pathname,
      search: queryString.stringify({
        page,
        isHost,
        isGuest,
        ticketStatus,
        ticketType
      })
    });
  };

  handleTicketTypesChange = ticketType => {
    this.setState(
      { ticketType: ticketType !== "Ticket type" ? ticketType : null, page: 1 },
      () => {
        this.setSearchParams();
        this.fetchWithFilterd();
      }
    );
  };

  handleTicketStatusChange = ticketStatus => {
    this.setState(
      {
        ticketStatus: ticketStatus !== "Status" ? ticketStatus : null,
        page: 1
      },
      () => {
        this.setSearchParams();
        this.fetchWithFilterd();
      }
    );
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  fetchWithFilterd = () => {
    const { ticketType, ticketStatus, isHost, isGuest, page } = this.state;
    const { dispatch } = this.props;
    let user_type = [];
    if (isHost) {
      user_type.push("host");
    }
    if (isGuest) {
      user_type.push("guest");
    }

    dispatch(
      fetchSupportTickets({
        ticket_type: ticketType !== null ? [ticketType] : null,
        status: ticketStatus !== null ? [ticketStatus] : null,
        user_type,
        page: page
      })
    );
  };

  onChangePagination = page => {
    this.setState({ page }, () => {
      this.setSearchParams();
      this.fetchWithFilterd();
    });
  };

  deleteTicketConfirm = ticketId => {
    return axios
      .delete(process.env.REACT_APP_API_URL + `support-ticket/${ticketId}`, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(res => {
        if (!res.data.error) this.fetchWithFilterd();
      })
      .catch(err => {
        console.log("err", err);
        this.props.dispatch(authFail(err));
      });
  };

  deleteTicketCancel = e => {
    e.stopPropagation();
  };

  setRawIcon = type => {
    switch (type) {
      case "general":
        return (
          <img alt="status-icon" src="/images/support-center/gen-icon.svg" />
        );
      case "urgent_matter":
        return (
          <img alt="status-icon" src="/images/support-center/urgent-icon.svg" />
        );
      case "damage_report":
        return (
          <img alt="status-icon" src="/images/support-center/damage-icon.svg" />
        );
      default:
        return (
          <img alt="status-icon" src="/images/support-center/gen-icon.svg" />
        );
    }
  };

  tableColumns = () => {
    return [
      {
        title: "Ticket ID",
        width: isMobileOnly ? 100 : 200,
        dataIndex: "name",
        key: "name",
        fixed: "left",
        render: (text, record, index) => {
          return (
            <div className="SC_main_new_id" key={index}>
              {this.setRawIcon(record.type)}
              <div>{record.number ? record.number : null}</div>
            </div>
          );
        }
      },
      {
        title: "Description",
        width: isMobileOnly ? 150 : 300,
        dataIndex: "description",
        key: "1",
        render: (text, record, index) => {
          return (
            <div className="SC_main_txt">
              {record.summary ? record.summary : null}
            </div>
          );
        }
      },
      {
        title: "Created Date",
        width: isMobileOnly ? 150 : 400,
        dataIndex: "createdate",
        key: "2",
        render: (text, record, index) => {
          return (
            <div className="SC_main_txt">
              {/* Wed, Aug 04th */}
              {moment(record.created_at.date).format("MMMM Do, YYYY")}
              <div className="SC_main_time">
                {moment(record.created_at.date).format("h:mm A")}
              </div>
            </div>
          );
        }
      },
      {
        title: "Status",
        key: "status",
        fixed: "right",
        // width: isMobileOnly ? 68 : 200,
        width: isMobileOnly ? 80 : 200,
        render: (text, record, index) => {
          return (
            <div>
              <div>
                {/* Staus */}
                <TicketStatus status={record.status} />
                {/* Staus */}
              </div>
              <div>
                {/* Button */}

                {TICKET_STATUS.find(data => {
                  return data.value === "Waiting for Review";
                }).key === record.status &&
                  (record.id === this.state.activateRaw &&
                    record.ticket_type !== "received") && (
                    <DeleteBtn
                      deleteConfirm={e => {
                        e.stopPropagation();
                        this.deleteTicketConfirm(record.id);
                      }}
                      deleteCancel={this.deleteTicketCancel}
                      size={12}
                    />
                  )}
                {/* Button */}
              </div>
            </div>
          );
        }
      }
    ];
  };

  render() {
    const { tickets } = this.props;
    const { isGuest, isHost, page, ticketStatus, ticketType } = this.state;
    const { meta } = tickets;

    return (
      <Fragment>
        {/* <MainNav /> */}
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <div className="row SC_page_title">
              <div className="col-xs-9 col-sm-6 SC_page_title_new">
                {/* Support Connect */}
              </div>
              <div className="col-xs-3 col-sm-6 SC_main_create">
                <img
                  onClick={this.showDrawer}
                  alt="icon"
                  className="xs-icon"
                  src="/images/support-center/create_icon_full.svg"
                />
                <img
                  onClick={this.showDrawer}
                  alt="icon"
                  className="sm-icon"
                  src="/images/support-center/create_icon.svg"
                />
                <a className="hidden-xs" onClick={this.showDrawer}>
                  Create new ticket
                </a>
                <Drawer
                  placement="right"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                  width={530}
                  className="trip-booking-drawer"
                >
                  {this.state.drawerContent}

                  <CreateNewTicket />
                </Drawer>
              </div>
            </div>

            {/* Page Header */}

            {/* Filter */}
            <div className="row SC_main_filters">
              <div className="col-xs-12 col-sm-7 SC_main_checkbox">
                <Checkbox
                  onChange={() =>
                    this.setState(
                      {
                        isHost: !isHost,
                        isGuest:
                          isHost === true && isGuest === false ? true : isGuest
                      },
                      () => {
                        this.setSearchParams();
                        this.fetchWithFilterd();
                      }
                    )
                  }
                  checked={isHost}
                >
                  Host
                </Checkbox>
                <Checkbox
                  onChange={() =>
                    this.setState(
                      {
                        isGuest: !isGuest,
                        isHost:
                          isHost === false && isGuest === true ? true : isHost
                      },
                      () => {
                        this.setSearchParams();
                        this.fetchWithFilterd();
                      }
                    )
                  }
                  checked={isGuest}
                >
                  Guest
                </Checkbox>
              </div>

              <div className="col-xs-12 col-sm-5">
                <div className="row SC_main_list_select_box">
                  <div className="col-xs-12 col-sm-6 SC_main_list_select">
                    <Select
                      value={ticketType ? ticketType : "Ticket type"}
                      style={{ width: "100%" }}
                      onChange={e => this.handleTicketTypesChange(e)}
                    >
                      <Option
                        value="Ticket type"
                        key={30}
                        className="SC_tick_type"
                      >
                        <span className="SC_main_list_title">Ticket type</span>
                      </Option>
                      {TICKET_TYPES.map((item, index) => {
                        return (
                          <Option
                            value={item.key}
                            key={index}
                            className="SC_tick_type"
                          >
                            <Image
                              alt="icon"
                              className="SC_main_list_icon"
                              src={item.icon_src}
                              width={20}
                              height={20}
                              style={{ objectFit: "cover" }}
                            />
                            <span className="SC_main_list_title">
                              {item.value}
                            </span>
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="col-xs-12 col-sm-6 SC_main_list_select">
                    <Select
                      defaultValue="Status"
                      value={ticketStatus !== null ? ticketStatus : "Status"}
                      style={{ width: "100%" }}
                      onChange={this.handleTicketStatusChange}
                    >
                      <Option
                        value="Status"
                        key="Status"
                        className="SC_tick_status"
                      >
                        <span className="SC_main_list_title">Status</span>
                      </Option>
                      {TICKET_STATUS.map((item, index) => {
                        return (
                          <Option
                            value={item.key}
                            key={index}
                            className="SC_tick_status"
                          >
                            <Image
                              alt="icon"
                              className="SC_main_list_icon"
                              src={item.icon_src}
                              width={20}
                              height={20}
                              style={{ objectFit: "cover" }}
                            />
                            <span className="SC_main_list_title">
                              {item.value}
                            </span>
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            {/* Filter */}

            <div className="row">
              <div className="col-sm-12">
                <Table
                  rowKey={data => data.id}
                  columns={this.tableColumns()}
                  dataSource={tickets.data}
                  scroll={{ x: isMobileOnly ? 468 : 1100 }}
                  rowClassName={record =>
                    record.id === this.state.activateRaw
                      ? "ant-table-row-hover"
                      : null
                  }
                  onRow={record => {
                    return {
                      onMouseEnter: () => {
                        this.setState({ activateRaw: record.id });
                      },
                      onClick: () => {
                        const { history } = this.props;
                        if (record.ticket_type == "received") {
                          history.push(
                            `/support-center/ticket/review/${record.id}`
                          );
                        } else {
                          history.push(`/support-center/ticket/${record.id}`);
                        }
                        this.props.clicked(record.id);
                      }
                    };
                  }}
                  pagination={false}
                />

                {meta && <PaginationHeader parent="tickets" meta={meta} />}

                <div className="SC_option_pagination">
                  {tickets.meta && (
                    <Pagination
                      onChange={this.onChangePagination}
                      total={tickets.meta.pagination.total}
                      pageSize={tickets.meta.pagination.per_page}
                      current={page}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    tickets: state.supportCenter.tickets
  };
};
export default connect(mapStateToProps)(withRouter(checkAuth(Tickets)));
