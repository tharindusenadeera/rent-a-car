import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";
import {
  fetchNavNotifications,
  readUnreadNotification,
  readNotification
} from "../../actions/ProfileActions";
import { NAVBARNOTIFICATION_CLICK } from "../../actions/ActionTypes";
import moment from "moment-timezone";
import Pusher from "pusher-js";
import Image from "react-shimmer";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";
import "antd/lib/button/style/index.css";

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  encrypted: true,
  cluster: "ap1"
});

class NavBarNotification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      new_notifications: []
    };
  }

  componentDidMount() {
    const { user_id, dispatch } = this.props;
    dispatch(fetchNavNotifications());
    const channel = pusher.subscribe(`notification-${user_id}`);
    channel.bind("unread-count", data => {
      dispatch(fetchNavNotifications());
    });
  }

  handleNotification = notification => {
    const { history, dispatch } = this.props;

    dispatch(readNotification(notification.id));

    if (notification.data.data.category == "booking") {
      history.push(`/booking/${notification.data.data.id.booking_id}`);
    }
    if (notification.data.data.category == "conversation") {
      history.push(
        `/my-profile/message-center/${
          notification.data.data.booking_data.details.id
        }`
      );
    }
    if (notification.data.data.category == "support_center") {
      if (
        notification.data.data.id &&
        notification.data.data.id.ticket_type &&
        notification.data.data.id.ticket_type == "received"
      ) {
        history.push(
          `/support-center/ticket/review/${notification.data.data.id.ticket_id}`
        );
      } else {
        history.push(
          `/support-center/ticket/${notification.data.data.id.ticket_id}`
        );
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

  render() {
    const { notifications } = this.props;
    let unreadCount = [];
    if (notifications.data) {
      unreadCount = notifications.data.filter(i => {
        return !i.read_at;
      });
    }

    const menu = (
      <div className="Prof_dropoutbox">
        {/* <img src="/images/profilev2/prof-arrow.svg" className="arrow notify" /> */}

        <div className="Prof_notifymenu">
          <Menu>
            {notifications.data &&
              notifications.data.map((notification, key) => {
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
                  <Menu.Item key={key}>
                    <div
                      onClick={() => {
                        this.handleNotification(notification);
                      }}
                      className="wrapper"
                    >
                      <div className="detail-wrapper">
                        <div className="car">
                          {/* <img src={notification.image} /> */}
                          <Image
                            src={notification.image}
                            width={50}
                            height={33}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="details">
                          <div className="txt">
                            {notification.data.data.category === "conversation"
                              ? notification.data.body.substr(0, 25)
                              : notification.data.body}
                          </div>
                          <div className="time">{duration.humanize()}</div>
                        </div>
                      </div>
                      {!notification.read_at && (
                        <div className="icon">
                          <div className="not-dot dot-red" />
                        </div>
                      )}
                    </div>
                  </Menu.Item>
                );
              })}
            <Menu.Item key="5">
              <Link to="/my-profile/notifications">
                <span className="view">View All</span>
              </Link>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );

    return (
      <div className="Prof_dropmenu_notify">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="unstyled-btn" style={{ marginLeft: 8 }}>
            <div className="Prof_dropmenu_b">
              {unreadCount.length > 0 && <div className="not-dot dot-red" />}
              {/* <img src="/images/profilev2/tab-icons/notifications-white-icon.png" /> */}
              <span className="icon-set-one-bell-icon" />
            </div>
          </Button>
        </Dropdown>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.profile.navBarNotifications
});
export default withRouter(connect(mapStateToProps)(NavBarNotification));
