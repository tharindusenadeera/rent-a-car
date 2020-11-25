import React from "react";
import moment from "moment-timezone";
import { Button, notification } from "antd";
import _ from "lodash";
import Image from "react-shimmer";
import "antd/lib/button/style/index.css";
import "antd/lib/notification/style/index.css";

const openNotificationWithIcon = (type, item) => {
  notification[type]({
    className: "archived-message-wrapper",
    message: `Message ${item.is_archived == 0 ? "archived" : "unarchived"}`,
    duration: 5
  });
};

class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedArchive: false,
      active: false
    };
  }

  componentDidUpdate(priveProps) {
    if (priveProps.item != this.props.item) {
      this.setState({ clickedArchive: false });
    }
  }

  onClickArchive = item => {
    const { archiveClicked } = this.props;
    if (this.state.clickedArchive) {
      return;
    }
    this.setState({ clickedArchive: true }, () => {
      openNotificationWithIcon("success", item);
      archiveClicked(item, true);
    });
  };

  render() {
    const { item, archiveClicked, message } = this.props;
    const last_updated_time = moment.utc(item.last_message_at);

    return (
      <div
        className={`chat-person-wrapper inline-blocks-vertical-start ${
          message && message.id == item.id ? "cp-active" : ""
        }`}
      >
        {" "}
        {/* Active styele here */}
        <a
          onClick={() => {
            archiveClicked(item);
          }}
        >
          <div className="chat-person-left">
            <Image
              className="pro-pic"
              src={item.participant.data[0].profile_image_thumb}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
            {item.unread_count > 0 && (
              <div className="cp-messages-count">{item.unread_count}</div>
            )}
          </div>
          <div className="chat-person-right">
            <div className="inline-blocks-vertical-center">
              <div className="cp-name drawer-text-md-semi">
                {item.participant.data[0].participant_name}
              </div>
              <div className="cp-time drawer-text-xs-normal">
                {moment
                  .duration(
                    moment(last_updated_time.local()).diff(moment(), "minutes"),
                    "minutes"
                  )
                  .humanize(true)}
              </div>
            </div>
            <div className="inline-blocks-vertical-center">
              <div className="cp-booking-id drawer-text-xs">
                {item.details.data.number}
              </div>
              <div className="cp-car-name drawer-text-xs">
                {item.details.data.car_name}
              </div>
            </div>
            <div className="cp-booking-summary drawer-text-sm">
              Booked trip with {item.details.data.car_name}
            </div>
          </div>
        </a>
        {item.isTemp !== true && (
          <div className="chat-convs-archive">
            <Button
              onClick={() => this.onClickArchive(item)}
              className="unstyled-btn hov-click"
            >
              <span className="icon-set-one-archive-icon" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}
export default Thread;
