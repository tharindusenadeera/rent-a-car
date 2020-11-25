import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class SuccessMsg extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = ticketId => {
    const { onClickView, history } = this.props;
    onClickView && onClickView();
    history.push("/support-center/ticket/" + ticketId);
  };

  render() {
    const { successMsg, ticketId } = this.props;
    return (
      successMsg && (
        <div className="SC_drawer_msg">
          <div>
            <img src="/images/support-center/sucess_icon.svg" />
          </div>
          <div>
            <span className="title">{successMsg[0] && successMsg[0]}</span>
            <span className="id">{successMsg[1] && successMsg[1]}</span>
            <span className="content">{successMsg[2] && successMsg[2]}</span>
          </div>
          <div className="SC_drawer button">
            {ticketId && (
              <button
                type="button"
                className="btn SC_btn_submit"
                onClick={() => this.handleSubmit(ticketId)}
              >
                VIEW TICKET
              </button>
            )}
          </div>
        </div>
      )
    );
  }
}

export default withRouter(SuccessMsg);
