import React from "react";
import { Link } from "react-router";
import { Menu, Dropdown, Button, Icon, message } from "antd";
import "antd/lib/menu/style/index.css";
import "antd/lib/dropdown/style/index.css";
import "antd/lib/button/style/index.css";

function handleButtonClick(e) {
  message.info("Click on left button.");
  console.log("click left button", e);
}

function handleMenuClick(e) {
  message.info("Click on menu item.");
  console.log("click", e);
}

/* -------------------------- PROFILE ----------------------------- */
const menu = (
  <div className="Prof_dropoutbox">
    <img src="/images/profilev2/prof-arrow.svg" className="arrow" />

    <div className="Prof_dropmenu">
      <div className="details_box">
        <div className="row">
          <div className="col-sm-4 col-xs-4">
            <img src="https://cdn.rydecars.com/profile/5b6a7e88e5058.jpg" />
          </div>
          <div className="col-sm-8 col-xs-8">
            <div className="title">Welcome back!</div>
            <div className="name">Rodeo Damin</div>
            <div className="view">
              <a herf="#">View your profile</a>
            </div>
          </div>
        </div>
      </div>

      <Menu onClick={handleMenuClick} onClick={handleMenuClick}>
        <Menu.Item key="1">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon trips" />
              <span className="title">Trips</span>
            </div>
            <div className="int">150</div>
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon cars" />
              <span className="title">Cars</span>
            </div>
            <div className="int">10</div>
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon earnings" />
              <span className="title">Earnings</span>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key="4">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon messages" />
              <span className="title">Messages</span>
            </div>
            <div className="int">
              <span className="alert_box">9+</span>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key="5">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon profile" />
              <span className="title">Profile</span>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key="6">
          <div className="menuitem_wrapper">
            <div className="menuitem_title">
              <div className="topcusticon logout" />
              <span className="title">Logout</span>
            </div>
          </div>
        </Menu.Item>
      </Menu>
    </div>
  </div>
);

class DropdownMenu extends React.Component {
  render() {
    return (
      <div className="Prof_dropmenu_a">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button className="unstyled-btn">
            <div className="Prof_dropmenu_b">
              <div className="not-dot dot-red" />
              <img src="https://cdn.rydecars.com/profile/5b6a7e88e5058.jpg" />
              <span>Rodeo</span>
              <Icon type="down" />
            </div>
          </Button>
        </Dropdown>
      </div>
    );
  }
}
/* -------------------------- PROFILE ----------------------------- */

/* -------------------------- NOTIFICATION ----------------------------- */
// const menu = (
//     <div className="Prof_dropoutbox">
//         <img src="/images/profilev2/prof-arrow.svg" className="arrow"></img>

//         <div className="Prof_notifymenu" >
//             <Menu onClick={handleMenuClick}>
//                 <Menu.Item key="1">
//                     <div className="wrapper">
//                         <div className="detail-wrapper">
//                             <div className="car">
//                                 <img src="https://ryde-bucket-lk.s3.amazonaws.com/WhatsApp%20Image%202019-01-21%20at%206.25.35%20PM.jpeg" />
//                             </div>
//                             <div className="details">
//                                 <div className="txt">Your trip with Andreson has been cancelled. sdsd  d dsn snd snd snd.</div>
//                                 <div className="time">3 days ago</div>
//                             </div>
//                         </div>
//                         <div className="icon">
//                             <div className="not-dot dot-red"></div>
//                         </div>
//                     </div>
//                 </Menu.Item>

//                 <Menu.Item key="5">
//                     <span className="view">View All</span>
//                 </Menu.Item>
//             </Menu>
//         </div>
//     </div>
// );

// class DropdownMenu extends React.Component{
//     render(){
//         return(
//             <div className="Prof_dropmenu_notify">
//                 <Dropdown overlay={menu} trigger={['click']}>
//                     <Button className="unstyled-btn" style={{ marginLeft: 8 }}>
//                         <div className="Prof_dropmenu_b">
//                             <div className="not-dot dot-red"></div>
//                             <img src="/images/profilev2/tab-icons/notifications-green-icon.png" />
//                         </div>
//                     </Button>
//                 </Dropdown>
//             </div>
//         );
//     }
// }
/* -------------------------- NOTIFICATION ----------------------------- */

export default DropdownMenu;
