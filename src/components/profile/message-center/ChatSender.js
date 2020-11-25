import React from "react";
import moment from "moment-timezone";
import ChatAttachment from "./ChatAttachment";

const ChatSender = props => {
  const { message, thread_id } = props;
  const time = moment.utc(message.created_at);
  return (
    <div className="inline-blocks-vertical-start my-wrapper">
      <div className="chat-person-right">
        <div className="cp-time drawer-text-xs-normal">
          {time.local().format("MMMM DD, YYYY  h:mm a")}
        </div>
        {message.attachments.data.length
          ? message.attachments.data.map((attachment, index) => {
              return (
                <ChatAttachment
                  key={index}
                  attachment={attachment}
                  thread_id={thread_id}
                />
              );
            })
          : ""}
        <p className="para-md-normal">{message.message}</p>
      </div>
    </div>
  );
};
export default ChatSender;
