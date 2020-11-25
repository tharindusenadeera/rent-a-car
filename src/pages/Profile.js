import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Tabs } from "antd";
import {
  fetchUnreadNotification,
  readUnreadNotification
} from "../actions/ProfileActions";
import { fetchCarsFromUserBooking } from "../actions/BookingActions";
import EditProfile from "../components/profile/edit-profile";
import TripsContent from "../components/profile/Trips";
import CarsContent from "../components/profile/user-cars";
import ReviewsContent from "../components/profile/reviews";
import NotificationsContent from "../components/profile/Notifications";
import SupportCenter from "../components/profile/SupportCenter";
import Earnings from "../components/profile/earnings";
import MessageCenterContainer from "../components/profile/MessageCenter";
import MainNav from "../components/layouts/MainNav";
import MainFooter from "../components/layouts/MainFooter.js";
import NoMessages from "../components/profile/message-center/NoMessages";
import checkAuth from "../components/requireAuth";
import { MESSAGE } from "../actions/ActionTypes";
import { StickyContainer } from "react-sticky";
import Helmet from "react-helmet";
import "antd/lib/tabs/style/index.css";
import "antd/lib/icon/style/index.css";

const TabPane = Tabs.TabPane;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "1",
      onClickBooking: false,
      browserTab: ""
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDefaltActivationKey();
    dispatch(fetchUnreadNotification());
    dispatch(fetchCarsFromUserBooking());
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (match.params.tab != prevProps.match.params.tab) {
      this.getDefaltActivationKey();
    }
  }

  showUnreadIcon = detailabel => {
    const { unreadTabData } = this.props;
    return unreadTabData.some(item => {
      return item.detailable_type == detailabel;
    });
  };

  clickedBookingAction = data => {
    const { unreadTabData, dispatch } = this.props;
    dispatch({ type: MESSAGE, payload: {} });
    // dispatch({ type: MESSAGES, payload: [] });
    // dispatch({ type: CONVERSATIONS, payload: [] });
    return unreadTabData.map(item => {
      if (item.detailable_id == data) {
        dispatch(readUnreadNotification([item.id]));
      }
    });
  };

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

  handleTabClick(tabKey) {
    switch (tabKey) {
      case "1":
        return this.props.history.push("/my-profile/trips");
      case "2":
        return this.props.history.push("/my-profile/cars");
      case "3":
        return this.props.history.push("/my-profile/earnings");
      case "4":
        return this.props.history.push("/my-profile/message-center");
      case "5":
        return this.props.history.push("/my-profile/edit-profile");
      case "6":
        return this.props.history.push("/my-profile/reviews");
      case "7":
        return this.props.history.push("/my-profile/support-center");
      case "8":
        return this.props.history.push("/my-profile/notifications");
      default:
        return this.props.history.push("/my-profile/trips");
    }
  }

  handleTabForBrowser(tabKey) {
    switch (tabKey) {
      case "1":
        return "Trips";
      case "2":
        return "Cars";
      case "3":
        return "Earnings";
      case "4":
        return "Messages";
      case "5":
        return "Profile";
      case "6":
        return "Reviews";
      case "7":
        return "Support Connect";
      case "8":
        return "Notifications";
      default:
        return "Trips";
    }
  }

  handleNotification = e => {
    const { unreadTabData, dispatch } = this.props;
    var newArr = [];
    if (e == 8) {
      unreadTabData.forEach(element => {
        if (element.detailable_type === "notification") {
          newArr.push(element.id);
        }
      });
      dispatch(readUnreadNotification(newArr));
    }
  };

  render() {
    const { history, messages, hasMessages, match } = this.props;

    return (
      <Fragment>
        <MainNav history={history} />
        <StickyContainer>
          <Helmet
            title={this.handleTabForBrowser(this.state.activeKey)}
            meta={[
              {
                name: "description",
                content: this.handleTabForBrowser(this.state.activeKey)
              }
            ]}
          />

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="Prof_topmenu">
                  {/* Top Menu */}
                  <Tabs
                    activeKey={this.state.activeKey}
                    onTabClick={key => this.handleTabClick(key)}
                    onChange={e => this.handleNotification(e)}
                  >
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          {this.showUnreadIcon("booking") && (
                            <div className="not-dot dot-red" />
                          )}
                          <span>
                            <span className="icon-set-one-trip-icon edit-profile-tab-icons" />
                            Trips
                          </span>
                        </div>
                      }
                      key="1"
                    >
                      <TripsContent
                        match={match}
                        history={history}
                        clicked={this.clickedBookingAction}
                      />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          <span>
                            <span className="icon-set-one-car-icon edit-profile-tab-icons" />
                            Cars
                          </span>
                        </div>
                      }
                      key="2"
                    >
                      <CarsContent history={history} match={match} />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          <span>
                            <span className="icon-set-one-wallet-icon edit-profile-tab-icons" />
                            Earnings
                          </span>
                        </div>
                      }
                      key="3"
                    >
                      <Earnings match={match} />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          {this.showUnreadIcon("conversation") && (
                            <div className="not-dot dot-red" />
                          )}
                          <span>
                            <span className="icon-set-one-chat-icon edit-profile-tab-icons" />
                            Messages
                          </span>
                        </div>
                      }
                      key="4"
                    >
                      {hasMessages === false && match.params.id == null && (
                        <NoMessages />
                      )}
                      {hasMessages === false && match.params.id != null && (
                        <MessageCenterContainer
                          match={this.props.match}
                          history={this.props.history}
                          clickedTab={this.clickedBookingAction}
                        />
                      )}
                      {hasMessages === true && (
                        <MessageCenterContainer
                          match={this.props.match}
                          history={this.props.history}
                          clickedTab={this.clickedBookingAction}
                        />
                      )}
                    </TabPane>

                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          <span>
                            <span className="icon-set-one-settings-icon edit-profile-tab-icons" />
                            Profile
                          </span>
                        </div>
                      }
                      key="5"
                    >
                      <EditProfile history={history} />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          {this.showUnreadIcon("review") && (
                            <div className="not-dot dot-red" />
                          )}

                          <span>
                            <span className="icon-set-one-favorite-icon edit-profile-tab-icons" />
                            Reviews
                          </span>
                        </div>
                      }
                      key="6"
                    >
                      <ReviewsContent history={history} match={match} />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          {this.showUnreadIcon("support_ticket") && (
                            <div className="not-dot dot-red" />
                          )}
                          <span>
                            <span className="icon-set-one-support-center-icon edit-profile-tab-icons" />
                            Support Connect
                          </span>
                        </div>
                      }
                      key="7"
                    >
                      <SupportCenter clicked={this.clickedBookingAction} />
                    </TabPane>
                    <TabPane
                      tab={
                        <div className="tab-not-dot-wrapper">
                          {this.showUnreadIcon("notification") && (
                            <div className="not-dot dot-red" />
                          )}
                          <span>
                            {/* <Icon className="custicon notifications-icon" /> */}
                            <span className="icon-set-one-bell-icon edit-profile-tab-icons" />
                            Notifications
                          </span>
                        </div>
                      }
                      key="8"
                    >
                      <NotificationsContent
                        history={history}
                        match={match}
                        clickedBookingAction={this.clickedBookingAction}
                      />
                    </TabPane>
                  </Tabs>
                  {/* Top Menu */}
                </div>
              </div>
            </div>
          </div>
        </StickyContainer>
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    unreadTabData: state.profile.unreadTabData,
    authUser: state.user.user,
    messages: state.messageCenter.messages,
    carsFromBookings: state.booking.carsFromBookings,
    hasMessages: state.messageCenter.hasMessages
  };
};

export default withRouter(connect(mapStateToProps)(checkAuth(Profile)));
