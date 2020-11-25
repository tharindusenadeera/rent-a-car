import React, { Component } from "react";

class TicketStatus extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { status } = this.props;
    return (
      <div>
        {status === 0 && (
          <div className="SC_status">
            <div className="trip-status-icon">
              {/* <img src="/images/support-center/status_waiting_icon.svg" /> */}
              <span className="icon-set-one-pending-icon status-icon-default" />
            </div>
            <div className="trip-status-text pending-stat-color hidden-xs">
              <span className="wtfr">Waiting for review</span>
            </div>
          </div>
        )}
        {status === 2 && (
          <div className="SC_status">
            <div className="trip-status-icon">
              {/* <img src="/images/support-center/status_undereview_icon.svg" /> */}
              <span className="icon-set-one-on-trip-icon status-icon-default" />
            </div>
            <div className="trip-status-text ontrip-stat-color hidden-xs">
              <span className="undr">Under review</span>
            </div>
          </div>
        )}
        {status === 1 && (
          <div className="SC_status">
            <div className="trip-status-icon">
              {/* <img src="/images/support-center/status_resolved_icon.svg" /> */}
              <span className="icon-set-one-completed-icon status-icon-default" />
            </div>
            <div className="trip-status-text completed-stat-color hidden-xs">
              <span className="rsolv">Resolved</span>
            </div>
          </div>
        )}
        {status === -1 && (
          <div className="SC_status">
            <div className="trip-status-icon">
              {/* <img src="/images/support-center/status_withdraw_icon.svg" /> */}
              <span className="icon-set-one-cancel-icon status-icon-default" />
            </div>
            <div className="trip-status-text canceled-stat-color hidden-xs">
              <span className="withdrw">Withdrawn</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TicketStatus;
