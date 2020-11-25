import "react-dates/initialize";
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import BigCalendar from "react-big-calendar";
import { connect } from "react-redux";
import moment from "moment";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { getUnavailableList } from "../../actions/CarActions";
import { SingleDatePicker } from "react-dates";
import Modal from "react-modal";
import { modalStylesBooking } from "../../consts/consts";
import axios from "axios";
import { UNAVAILABLE_LIST } from "../../actions/ActionTypes";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import { timeList } from "../../consts/consts";
import { isMobileOnly, isMobile } from "react-device-detect";
import { defaultMobileModelPopup } from "../../consts/consts";
import { authFail } from "../../actions/AuthAction";
import checkAuth from "../requireAuth";
import "react-dates/lib/css/_datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

//BigCalendar.momentLocalizer(moment);
Modal.setAppElement("#root");

const localizer = BigCalendar.momentLocalizer(moment);

function Event({ event }) {
  return <div title="Edit/Remove">{event.title}</div>;
}

class CarAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      from: moment(),
      fromTime: "23:30",
      to: moment().add(3, "days"),
      toTime: "23:30",
      submitting: false,
      removeing: false,
      titleError: "",
      toError: "",
      fromError: "",
      unavailableError: "",
      showModal: false
    };

    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.buildEventList = this.buildEventList.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentWillMount() {
    const { dispatch, match } = this.props;
    dispatch(getUnavailableList(match.params.id));
  }

  handleDateChangeFrom(from) {
    // check if the to date is smaller that this value if so add three more days and set it
    const checkToDate = from.isAfter(this.state.to);
    if (checkToDate) {
      const toDate = moment(from).add(3, "days");
      this.setState({ from: from, to: toDate, unavailableError: "" });
    } else {
      this.setState({ from: from, unavailableError: "" });
    }
  }

  handleDateChangeTo(to) {
    this.setState({ to: to, unavailableError: "" });
  }

  handleCreate = () => {
    const { dispatch, match } = this.props;
    const { title, from, to, fromTime, toTime } = this.state;

    var strFrom = from.format("YYYY-MM-DD");
    var fromDate = strFrom.replace(/-/g, "");

    var strTo = to.format("YYYY-MM-DD");
    var toDate = strTo.replace(/-/g, "");

    if (!title) {
      this.setState({ titleError: "Required" });
      return false;
    }
    if (fromDate > toDate) {
      this.setState({
        unavailableError: "you cannot enter a back date"
      });
    } else {
      const unavailableData = {
        car_id: match.params.id,
        title: title,
        from_date: from.format("YYYY-MM-DD") + " " + fromTime,
        to_date: to.format("YYYY-MM-DD") + " " + toTime
      };

      this.addUnavailability(unavailableData);
    }
  };

  buildEventList() {
    let dates = [];
    this.props.unavailableList.map(data => {
      dates.push({
        id: data.id,
        title: data.title,
        start: moment(data.start, "YYYY-MM-DD HH:mm:ss").toDate(),
        end: moment(data.end, "YYYY-MM-DD HH:mm:ss").toDate()
      });
    });
    return dates;
  }

  editEvent(e) {
    const from = moment(e.start);
    const to = moment(e.end);
    this.setState({
      id: e.id,
      title: e.title,
      from: from,
      fromTime: moment(e.start).format("HH:mm"),
      to: to,
      toTime: moment(e.end).format("HH:mm"),
      showModal: true
    });
  }

  handleEdit(e) {
    const { match } = this.props;
    const { id, title, from, to, fromTime, toTime } = this.state;
    if (!title) {
      this.setState({ titleError: "Required" });
    } else {
      const unavailableData = {
        id: id,
        car_id: match.params.id,
        title: title,
        from_date: from.format("YYYY-MM-DD") + " " + fromTime,
        to_date: to.format("YYYY-MM-DD") + " " + toTime
      };
      this.editUnavailability(unavailableData);
    }
  }

  handleDelete = async () => {
    try {
      const { removeing } = this.state;
      if (removeing === true) {
        return false;
      }
      this.setState({ removeing: true });
      const response = await await axios.delete(
        process.env.REACT_APP_API_URL + `availability/${this.state.id}`,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch({
          type: UNAVAILABLE_LIST,
          payload: response.data.list
        });
        this.resetForm();
      } else {
        this.setState({
          unavailableError: response.data.message,
          removeing: false
        });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({
        unavailableError: error.response.data.message,
        removeing: false
      });
    }
  };

  resetForm() {
    this.setState({
      id: "",
      title: "",
      from: moment(),
      fromTime: "23:30",
      to: moment().add(3, "days"),
      toTime: "23:30",
      titleError: "",
      toError: "",
      fromError: "",
      unavailableError: "",
      showModal: false,
      submitting: false,
      removeing: false
    });
  }

  addUnavailability = async data => {
    try {
      const { submitting } = this.state;
      if (submitting === true) {
        return false;
      }
      this.setState({ submitting: true });
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + `availability`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch({
          type: UNAVAILABLE_LIST,
          payload: response.data.list
        });
        this.resetForm();
      } else {
        this.props.dispatch(authFail(response.data.error));
        this.setState({
          unavailableError: response.data.message,
          submitting: false
        });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({
        unavailableError: error.response.data.message,
        submitting: false
      });
    }
  };

  editUnavailability = async data => {
    try {
      const { submitting } = this.state;
      if (submitting === true) {
        return false;
      }
      this.setState({ submitting: true });
      const response = await await axios.put(
        process.env.REACT_APP_API_URL + `availability/${data.id}`,
        data,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch({
          type: UNAVAILABLE_LIST,
          payload: response.data.list
        });
        this.resetForm();
      } else {
        this.setState({
          unavailableError: response.data.message,
          submitting: false
        });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
      this.setState({
        unavailableError: error.response.data.message,
        submitting: false
      });
    }
  };

  render() {
    const { submitting, removeing } = this.state;
    return (
      <Fragment>
        <MainNav />
        <div className="container setHeight">
          <button
            className="btn btn-success availability-btn-content add-unavailble-btn"
            onClick={() => {
              this.setState({ showModal: true });
            }}
          >
            {" "}
            Add Unavailability{" "}
          </button>
          <br />
          <div style={{ paddingTop: "30px", paddingBottom: "60px" }}>
            <BigCalendar
              localizer={localizer}
              events={
                this.props.unavailableList.length > 0
                  ? this.buildEventList()
                  : []
              }
              onSelectEvent={this.editEvent}
              components={{
                event: Event
              }}
              className="add-unavailab-cal"
            />
          </div>

          <Modal
            isOpen={this.state.showModal}
            onRequestClose={this.resetForm}
            contentLabel="Modal"
            shouldCloseOnOverlayClick={true}
            // style={modalStylesBooking}
            style={isMobileOnly ? defaultMobileModelPopup : modalStylesBooking}
          >
            <div className="add-unavailab-header">
              <h1>Add Unavailability</h1>
              <div className="close-popup">
                <span className="icon-cancel" onClick={this.resetForm} />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12">
                  <input
                    className="add-unavailab-input"
                    placeholder="Reason"
                    type="text"
                    value={this.state.title}
                    onChange={e =>
                      this.setState({ title: e.target.value, titleError: "" })
                    }
                  />
                  <span className="add-unavailab-error">
                    {this.state.titleError}
                  </span>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12">
                    <input
                      className="add-unavailab-input"
                      placeholder="Reason"
                      type="text"
                      value={this.state.title}
                      onChange={e =>
                        this.setState({ title: e.target.value, titleError: "" })
                      }
                    />
                    <span className="add-unavailab-error">
                      {this.state.titleError}
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className=" add-unavailab-from">
                      <span className="control-label green">FROM</span>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="addun-date-row">
                            <div className="row">
                              <div className="col-xs-7">
                                <SingleDatePicker
                                  date={this.state.from}
                                  onDateChange={this.handleDateChangeFrom} // PropTypes.func.isRequired
                                  focused={this.state.focusedFrom} // PropTypes.bool
                                  onFocusChange={({ focused }) =>
                                    this.setState({ focusedFrom: focused })
                                  }
                                  // orientation={isMobile ? "vertical" : "horizontal"}
                                  readOnly={true}
                                  numberOfMonths={isMobile ? 1 : 2}
                                />
                                <span className="text-danger">
                                  {this.state.fromError}
                                </span>
                              </div>
                              <div className="col-xs-5">
                                <select
                                  value={this.state.fromTime}
                                  className="coupon-wrap-select"
                                  onChange={e => {
                                    this.setState({
                                      fromTime: e.target.value,
                                      unavailableError: ""
                                    });
                                  }}
                                >
                                  {timeList.map(time => {
                                    return (
                                      <option key={time[0]} value={time[0]}>
                                        {time[1]}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className=" add-unavailab-from">
                      <span className="control-label green">TO</span>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="addun-date-row">
                            <div className="row">
                              <div className="col-xs-7">
                                <SingleDatePicker
                                  date={this.state.to}
                                  onDateChange={this.handleDateChangeTo} // PropTypes.func.isRequired
                                  focused={this.state.focusedTo} // PropTypes.bool
                                  onFocusChange={({ focused }) =>
                                    this.setState({ focusedTo: focused })
                                  }
                                  // orientation={isMobile ? "vertical" : "horizontal"}
                                  readOnly={true}
                                  numberOfMonths={isMobile ? 1 : 2}
                                />
                                <span className="text-danger">
                                  {this.state.toError}
                                </span>
                              </div>
                              <div className="col-xs-5">
                                <select
                                  value={this.state.toTime}
                                  className="coupon-wrap-select"
                                  onChange={e => {
                                    this.setState({
                                      toTime: e.target.value,
                                      unavailableError: ""
                                    });
                                  }}
                                >
                                  {timeList.map(time => {
                                    return (
                                      <option key={time[0]} value={time[0]}>
                                        {time[1]}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-12">
                  <p className="text-danger">{this.state.unavailableError}</p>
                </div>
              </div>

              <div className="buttons-wrapper addunavailble-btn">
                {this.state.id ? (
                  <button
                    type="submit"
                    onClick={this.handleEdit}
                    className="btn-success btn availability-btn-content"
                  >
                    {submitting && (
                      <PreloaderIcon
                        loader={Oval}
                        size={20}
                        strokeWidth={8} // min: 1, max: 50
                        strokeColor="#fff"
                        duration={800}
                      />
                    )}
                    Save
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={this.handleCreate}
                    className="btn-success btn availability-btn-content"
                  >
                    {submitting && (
                      <PreloaderIcon
                        loader={Oval}
                        size={20}
                        strokeWidth={8} // min: 1, max: 50
                        strokeColor="#fff"
                        duration={800}
                      />
                    )}
                    Add
                  </button>
                )}
                {this.state.id ? (
                  <button
                    type="submit"
                    onClick={() => this.handleDelete()}
                    className="btn-danger btn availability-btn-content unavilability-btndel"
                  >
                    {removeing && (
                      <PreloaderIcon
                        loader={Oval}
                        size={20}
                        strokeWidth={8} // min: 1, max: 50
                        strokeColor="#fff"
                        duration={800}
                      />
                    )}
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          </Modal>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    unavailableList: state.car.unavailableList,
    unavailableError: state.car.unavailableError
  };
};

export default withRouter(connect(mapStateToProps)(checkAuth(CarAvailability)));
