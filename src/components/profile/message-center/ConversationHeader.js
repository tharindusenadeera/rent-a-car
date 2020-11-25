import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Image from "react-shimmer";
import { Button, Menu, Dropdown, Tooltip } from "antd";
import { MESSAGE } from "../../../actions/ActionTypes";
import { setConversations } from "../../../actions/MessageCenterAction";
import "antd/lib/button/style/index.css";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";
import "antd/lib/tooltip/style/index.css";

const Details = <span>Details</span>;
const Archive = <span>Archive</span>;

const menu = props => {
  return (
    <Menu onClick={e => handleMenu(props, e)}>
      <Menu.Item key={1}>
        <a>Booking details</a>
      </Menu.Item>
      <Menu.Item key={2}>
        <a>Archive</a>
      </Menu.Item>
    </Menu>
  );
};

const handleMenu = (props, data) => {
  if (data.key == "1") {
    props.history.push(`/booking/${props.message.detailable_id}`);
  }
  if (data.key == "2") {
    props.handleClick();
    if (props.click == false) {
      props.onArchive("success", props.message.id);
    }
    props.dispatch(setConversations([]));
  }
};

const ConversationHeader = props => {
  const { message, onArchive, history } = props;

  return (
    <div>
      <div className="con-chat-tophead">
        <a
          onClick={() => {
            props.dispatch(setConversations([]));
            props.dispatch({ type: MESSAGE, payload: {} });
            if (message.isTemp !== true) {
              history.push("/my-profile/message-center");
            } else {
              window.scrollTo(0, 0);
              history.goBack();
            }
          }}
        >
          <img
            className="con-chat-backicon"
            src="/images/profilev2/left-arrow.svg"
          />
        </a>
        <span className="title">
          {message.participant.data[0].participant_name}
        </span>
        <Tooltip placement="top">
          <Dropdown
            overlay={menu(props)}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="drop-menus drop-down-sm"
          >
            <Button className="unstyled-btn more-options-btn hov-click">
              <span className="icon-set-one-more-op-icon" />
            </Button>
          </Dropdown>
        </Tooltip>
      </div>

      <div className="inline-blocks-horizontal-between-center con-booking-summary-wrapper">
        <div className="con-bs-left">
          <div className="inline-blocks-vertical-center">
            {message.details.data.car_photo && (
              <Image
                className="hidden-xs"
                src={message.details.data.car_photo}
                width={100}
                height={66}
                style={{ objectFit: "cover" }}
              />
            )}

            <div className="con-booking-inner">
              <a className="drawer-text-sm hov-click">
                {message.details.data.number}
              </a>
              <div className="drawer-text-lg-bo">
                {message.details.data.car_name}
              </div>
              <div className="drawer-text-xs-normal">
                {`${moment(message.details.data.from_date).format(
                  "MMMM Do, YYYY h:mm A"
                )} to ${moment(message.details.data.to_date).format(
                  "MMMM Do, YYYY h:mm A"
                )}`}
                {/* Mon, Jan 21st 18 04:30 AM to Fri, Jan 25th 18 04:30 AM */}
              </div>
            </div>
          </div>
        </div>

        <div className="con-bs-right">
          <Tooltip placement="top" title={Details}>
            <Button
              className="unstyled-btn hov-click"
              onClick={() => history.push(`/booking/${message.detailable_id}`)}
            >
              <span className="icon-set-one-invoice-icon" />
            </Button>
          </Tooltip>
          {message && message.isTemp !== true && (
            <Tooltip placement="top" title={Archive}>
              <Button
                onClick={() => {
                  props.handleClick();
                  if (props.click == false) {
                    onArchive("success", message.id);
                  }
                  props.dispatch(setConversations([]));
                }}
                className="unstyled-btn hov-click"
              >
                <span className="icon-set-one-archive-icon" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect()(withRouter(ConversationHeader));
