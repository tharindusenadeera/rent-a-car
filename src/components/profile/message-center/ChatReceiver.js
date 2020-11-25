import React from "react";
import moment from "moment-timezone";
import Image from "react-shimmer";
import ChatAttachment from "./ChatAttachment";

const ChatReceiver = props => {
  const { message, thread_id } = props;
  const time = moment.utc(message.created_at);
  return (
    <div className="inline-blocks-vertical-start ch-cons-resever">
      <div className="chat-person-left">
        {/* <img className="pro-pic" src={message.sender_profile_image_thumb} /> */}
        <Image
          className="pro-pic"
          src={message.sender_profile_image_thumb}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="chat-person-right">
        <div className="inline-blocks-vertical-center">
          <div className="cp-name drawer-text-md">
            {message.sender_name
              ? message.sender_name
              : message.sender_first_name}
          </div>
          <div className="cp-time drawer-text-xs-normal">
            {time.local().format("MMMM DD, YYYY  h:mm a")}
          </div>
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
      {/* After Loading - Chat view */}
    </div>
  );
};
export default ChatReceiver;
