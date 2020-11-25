import React from "react";
import moment from "moment";

const ChatMessage = ({ message }) => {
  const messageTime = message.created_at
    ? moment.utc(message.created_at, "YYYY-MM-DD h:mm:ss a").local()
    : moment();
  return (
    <div className="row chat-message">
      <span className="col-sm-1 col-xs-2">
        <img
          className="img-circle user-profile-pic-small"
          src={message.user.profile_image_thumb}
        />
      </span>
      <div className="col-sm-11 col-xs-10">
        <p className="message-body"> {message.message} </p>
        <span className="message-time">
          {messageTime.format("MMMM-DD-YYYY h:mm:ss a")}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
