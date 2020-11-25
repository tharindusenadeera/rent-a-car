import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  fetchWebNotifications,
  readNotification
} from "../../actions/ProfileActions";
import { NAVBARNOTIFICATION_CLICK } from "../../actions/ActionTypes";
import ProfilePagination from "./lib/ProfilePagination";
import PaginationHeader from "./lib/PaginationHeader";
import Empty from "./Empty";
import moment from "moment";
import Image from "react-shimmer";
class NotificationsContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchWebNotifications());
  }

  onChangePagination = page => {
    const { dispatch } = this.props;
    this.setState({ page }, () => {
      dispatch(fetchWebNotifications({ page: page }));
    });
  };

  handleNotification = notification => {
    const { history, dispatch } = this.props;

    dispatch(readNotification(notification.id));
    if (notification.data.data.category == "booking") {
      history.push(`/booking/${notification.data.data.id.booking_id}`);
    }
    if (notification.data.data.category == "conversation") {
      if (notification.data.data.booking_data) {
        history.push(
          `message-center/${notification.data.data.booking_data.details.id}`
        );
      } else {
        history.push(`message-center/${notification.data.data.id.thread_id}`);
      }
    }
    if (notification.data.data.category == "support_center") {
      if (notification.data.data.id.ticket_type) {
        if (notification.data.data.id.ticket_type == "received") {
          history.push(
            `/support-center/ticket/review/${
              notification.data.data.id.ticket_id
            }`
          );
        } else {
          history.push(
            `/support-center/ticket/${notification.data.data.id.ticket_id}`
          );
        }
      }
    }
    if (notification.data.data.category == "booking_ticket") {
      history.push(`/booking/${notification.data.data.id.booking_id}`);
    }

    dispatch({
      type: NAVBARNOTIFICATION_CLICK,
      payload: notification.data.data
    });
  };

  renderNotifications(notifications) {
    return notifications.map((notification, key) => {
      const lastUpdated = notification.created_at
        ? notification.created_at
        : null;

      const local = moment
        .utc(lastUpdated)
        .local()
        .format();
      const date = moment(local, "YYYY-MM-DD hh:mm:ss");
      const duration = moment.duration(moment().diff(date));

      return (
        <div
          className="Prof_body"
          key={key}
          onClick={() => this.handleNotification(notification)}
        >
          <div className="row">
            <div className="col-md-12">
              <div className="notifi-outer">
                <div className="notifi-left">
                  <div
                    className={`notifi-left-inner-car ${
                      notification &&
                      notification.data.data.category == "support_center"
                        ? "support-notify"
                        : ""
                    }`}
                  >
                    <a className="trip-car-pic hov-click">
                      <Image src={notification.image} width={70} height={46} />
                    </a>
                  </div>
                  <div className="notifi-left-inner-content">
                    <a className="drawer-text-md-semi hov-click">
                      {notification.data.title}
                    </a>
                    <div className="drawer-text-md-normal">
                      {moment(notification.created_at).format("MMMM Do, YYYY")}
                    </div>
                    <div className="drawer-text-md-normal">
                      {notification.data.body}
                    </div>

                    {notification.data.data.category == "booking" && (
                      <div className="drawer-text-sm notifi-content-bottom">
                        <a href={`/profile/${notification.user.id}`}>
                          <Image
                            className="hov-click"
                            src={notification.user.profile_image_thumb}
                            width={20}
                            height={20}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="hov-click">
                            {notification.user.first_name}
                          </div>
                        </a>
                        <span>{duration.humanize()} </span>
                      </div>
                    )}
                    {notification.data.data.category == "support_center" && (
                      <div className="drawer-text-sm notifi-content-bottom">
                        <span>{duration.humanize()} </span>
                      </div>
                    )}

                    {notification.data.data.category == "conversation" && (
                      <div className="drawer-text-sm notifi-content-bottom">
                        <span>{duration.humanize()} </span>
                      </div>
                    )}
                    {notification.data.data.category == "booking_ticket" && (
                      <div className="drawer-text-sm notifi-content-bottom">
                        <span>{duration.humanize()} </span>
                      </div>
                    )}
                    {notification.data.data.category == "conversation" && (
                      <div className="drawer-text-sm notifi-content-bottom">
                        <span>{duration.humanize()} </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="notifi-right">
                  {!notification.read_at && <div className="not-dot dot-red" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
  render() {
    const notifications = this.props.notifications.data;
    const notificationMeta = this.props.notifications.meta;

    return (
      <div className="Prof_page_wrapper prof_notifications">
        <div className="row">
          <div className="col-md-12 prof_trip">
            {/* <div className="Prof_body_title full">
              Notifications -
              {notificationMeta
                ? " " + notificationMeta.pagination.total
                : " " + 0}
            </div> */}
          </div>
        </div>
        {notifications &&
          notifications.length > 0 &&
          this.renderNotifications(notifications)}
        {notificationMeta && (
          <PaginationHeader parent="notifications" meta={notificationMeta} />
        )}

        {notifications &&
          notificationMeta &&
          notificationMeta.pagination.total > 1 && (
            <ProfilePagination
              onChange={this.onChangePagination}
              total={notificationMeta.pagination.total}
              pageSize={notificationMeta.pagination.per_page}
              current={this.state.page}
            />
          )}

        {notifications && notifications.length === 0 && (
          <Empty match={this.props.match} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.profile.notifications,
    isFetching: state.profile.isFetching
  };
};

export default withRouter(connect(mapStateToProps)(NotificationsContent));
