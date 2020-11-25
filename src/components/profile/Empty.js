import React from "react";
import { Link } from "react-router-dom";

class Empty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "0"
    };
  }
  componentDidMount() {
    this.getDefaltActivationKey();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (match.params.tab != prevProps.match.params.tab) {
      this.getDefaltActivationKey();
    }
  }

  getDefaltActivationKey = () => {
    const { match } = this.props;
    switch (match.params.tab) {
      case "trips":
        return this.setState({ activeKey: "1" });
      case "cars":
        return this.setState({ activeKey: "2" });
      case "earnings":
        return this.setState({ activeKey: "3" });
      case "message-center":
        return this.setState({ activeKey: "4" });
      case "edit-profile":
        return this.setState({ activeKey: "5" });
      case "reviews":
        return this.setState({ activeKey: "6" });
      case "support-center":
        return this.setState({ activeKey: "7" });
      case "notifications":
        return this.setState({ activeKey: "8" });
      default:
        return this.setState({ activeKey: "1" });
    }
  };

  render() {
    return (
      <div className="col-md-12">
        {/* Trips */}
        {this.state.activeKey === "1" && (
          <div className="Prof_empty">
            <div className="inner">
              <img src="/images/profilev2/trip-icon.svg" />
            </div>
            <div className="inner">
              <span>You do not have any trips yet</span>
            </div>
            {/* <div className="Prof_detail_button inner">
                        <a href="#" className="btn Prof_btn_view">
                        FIND A CAR
                        </a>
            </div> */}
          </div>
        )}

        {/* Cars */}
        {this.state.activeKey === "2" && (
          <div className="Prof_empty">
            <div className="inner">
              <img src="/images/profilev2/car-icon.svg" />
            </div>
            <div className="inner">
              <span>You do not have any cars yet</span>
            </div>
            <div className="inner">
              <Link to={"/car-create"} className="btn Prof_btn_view  orange">
                LIST YOUR FIRST RYDE
              </Link>
            </div>
          </div>
        )}

        {/* Messages */}
        {/* {this.state.activeKey === "4" && (
          <div className="Prof_empty">
            <div>
              <div className="inner">
                <img src="/images/profilev2/message-icon.png" />
              </div>
              <div className="inner">
                <span>You do not have any messages yet</span>
              </div>
            </div>
          </div>
        )} */}

        {/* Reviews */}
        {this.state.activeKey === "6" && (
          <div className="Prof_empty">
            <div>
              <div className="inner">
                <img src="/images/profilev2/reviews-icon.svg" />
              </div>
              <div className="inner">
                <span>You do not have any reviews yet</span>
              </div>
            </div>
          </div>
        )}

        {/* notification */}
        {this.state.activeKey === "8" && (
          <div className="Prof_empty">
            <div>
              <div className="inner">
                <img src="/images/profilev2/notification-icon.svg" />
              </div>
              <div className="inner">
                <span>You do not have any notifications yet</span>
              </div>
            </div>
          </div>
        )}

        {/* support ticket */}
        {this.state.activeKey === "7" && (
          <div className="Prof_empty">
            <div>
              <div className="inner">
                <img src="/images/profilev2/support-ticket-icon.svg" />
              </div>
              <div className="inner">
                <span>You do not have any support tickets yet</span>
              </div>
              <div className="inner">
                <a href="#" className="btn Prof_btn_view">
                  CREATE A TICKET
                </a>
              </div>
            </div>
          </div>
        )}

        {/* earning */}
        {this.state.activeKey === "3" && (
          <div className="Prof_empty">
            <div>
              <div className="inner">
                <img src="/images/profilev2/earning-icon.svg" />
              </div>
              <div className="inner">
                <span>You do not have any earning report yet</span>
              </div>
            </div>
          </div>
        )}
        {/* earning */}
      </div>
    );
  }
}

export default Empty;
