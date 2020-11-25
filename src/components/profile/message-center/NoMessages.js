import React from "react";

class NoMessages extends React.Component {
  render() {
    return (
      <div className="empty-screen-wrapper">
        <span className="icon-set-one-no-message-icon" />
        <div className="es-main-header">No messages yet</div>
        {/* <p className="es-sub-header">Lorem ipsum dolor sit amet, consetetur <br/> sadipscing nonumy.</p> */}
      </div>
    );
  }
}

export default NoMessages;
