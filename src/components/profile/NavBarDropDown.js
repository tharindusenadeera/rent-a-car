import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Button, Icon } from "antd";
import { withRouter } from "react-router-dom";
import Image from "react-shimmer";
import { logoutUser } from "../../actions/UserActions";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";
import "antd/lib/button/style/index.css";

class NavBarDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(logoutUser);
  }

  render() {
    const { user } = this.props;

    const menu = (
      <div className="Prof_dropoutbox Main-prof">
        {/* <img src="/images/profilev2/prof-arrow.svg" className="arrow profile" /> */}

        <div className="Prof_dropmenu">
          <div className="details_box">
            <div className="row">
              <div className="col-sm-4 col-xs-4">
                <img
                  src={
                    user.profile_image_thumb
                      ? user.profile_image_thumb
                      : "/images/defaultprofile.jpg"
                  }
                />
              </div>
              <div className="col-sm-8 col-xs-8 padding-left-remove">
                <div
                  className={
                    user && user.profile_image_thumb
                      ? "Prof_dropmenu_indetail"
                      : null
                  }
                >
                  <div className="title">Welcome !</div>
                  <div className="name">
                    {user.first_name} {user.last_name}
                  </div>
                  {user && !user.profile_image_thumb ? (
                    <div className="view">
                      <Link to={"/my-profile/edit-profile"}>
                        Complete your profile
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <Menu>
            <Menu.Item key="1">
              <Link to="/my-profile/trips">
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon trips" /> */}
                    <span className="icon-set-one-trip-icon profile-icons" />
                    <span className="title">Trips</span>
                  </div>
                  <div className="int">{user.booking_count}</div>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/my-profile/cars">
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon cars" /> */}
                    <span className="icon-set-one-car-icon profile-icons" />
                    <span className="title">Cars</span>
                  </div>
                  <div className="int">{user.cars_count}</div>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/my-profile/earnings">
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon earnings" /> */}
                    <span className="icon-set-one-wallet-icon profile-icons" />
                    <span className="title">Earnings</span>
                  </div>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/my-profile/message-center">
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon messages" /> */}
                    <span className="icon-set-one-chat-icon profile-icons" />
                    <span className="title">Messages</span>
                  </div>
                  {user.unread_messages ? (
                    <div className="int alert_box">
                      {user.unread_messages < 10 ? user.unread_messages : "9+"}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/my-profile/edit-profile">
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon profile" /> */}
                    <span className="icon-set-one-settings-icon profile-icons" />
                    <span className="title">Profile</span>
                  </div>
                  {user && user.stripe_connect_account_status == "pending" ? (
                    <span className="icon-set-one-cancel-icon warning"></span>
                  ) : (
                    <Fragment />
                  )}
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
              <a onClick={() => this.logout()}>
                <div className="menuitem_wrapper">
                  <div className="menuitem_title">
                    {/* <div className="topcusticon logout" /> */}
                    <span className="icon-set-one-logout-icon profile-icons" />
                    <span className="title">Logout</span>
                  </div>
                </div>
              </a>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );

    return (
      <div className="Prof_dropmenu_a">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="unstyled-btn">
            <div className="Prof_dropmenu_b">
              <Image
                src={
                  user.profile_image_thumb
                    ? user.profile_image_thumb
                    : "/images/defaultprofile.jpg"
                }
                width={30}
                height={30}
                style={{ objectFit: "cover" }}
              />
              <span className="navbar-menuitems-web">{user.first_name}</span>
              <div className="navbar-menuitems-web">
                {/* <Icon type="down" /> */}
                <span className="icon-set-one-down-arrow-icon" />
              </div>
            </div>
          </Button>
        </Dropdown>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user
});
export default withRouter(connect(mapStateToProps)(NavBarDropDown));
