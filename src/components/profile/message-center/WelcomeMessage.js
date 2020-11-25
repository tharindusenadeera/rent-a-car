import React from "react";

class WelcomeMessage extends React.Component {
  render() {
    return (
      <div className="empty-screen-wrapper">
        <span className="icon-set-one-welcome-message-icon" />
        <div className="es-welcome-header">Welcome!</div>
        {/* <p className="es-welcome-sub-header">Lorem ipsum dolor dolor sit</p> */}
      </div>
    );
  }
}

export default WelcomeMessage;
