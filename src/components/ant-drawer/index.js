import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Button } from "antd";
import "antd/lib/drawer/style/index.css";
import { toggleSubDrawer } from "../../actions/CommenActions";
import { isMobileOnly, isTablet } from "react-device-detect";
import ToggleDrawer from "./toggleDrawer";
import SecondSideBar from "./secondSideBar";
import CarSummary from "./carSummary";
import "./style.css";

class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // widthDrawerMain: 960,
      // widthDrawerSecond:690,
      childrenDrawer: false
    };
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  showChildrenDrawer = () => {
    this.setState({
      childrenDrawer: true
    });
  };

  onChildrenDrawerClose = () => {
    const { dispatch, isSubDrawerOpen } = this.props;
    const data = {
      isSubDrawerOpen: !isSubDrawerOpen
    };
    dispatch(toggleSubDrawer(data));
  };

  render() {
    const {
      isDrawerOpen,
      children,
      isSubDrawerOpen,
      subDrawerName
    } = this.props;
    return (
      <Drawer
        className="main-panel side-panel"
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        width={isMobileOnly ? 430 : 930}
        width={isTablet ? 630 : 930}
        closable={false}
        onClose={this.onClose}
        visible={isDrawerOpen}
      >
        <Drawer
          className="edit-panel side-panel"
          width={isMobileOnly ? 300 : 500}
          width={isTablet ? 400 : 500}
          closable={false}
          onClose={this.onChildrenDrawerClose}
          visible={isSubDrawerOpen}
        >
          {/* <ToggleDrawer>
                <div className="close-back-button approved-cb">
                    <img src="/images/car-edit/back-arrow-icon.svg" className="panel-back-icon" alt="Back" />
                </div>
            </ToggleDrawer> */}
          {subDrawerName === "car-summary" && <CarSummary />}
          {subDrawerName === "price-calendar" && <SecondSideBar />}
        </Drawer>

        <div className="container-fluid">
          {isDrawerOpen === true && (
            <ToggleDrawer>
              <div className="close-panel-button approved-cb">
                <img
                  src="/images/car-edit/close-icon.svg"
                  className="panel-close-icon"
                  alt="Close"
                />
              </div>
            </ToggleDrawer>
          )}
          {children}
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    isDrawerOpen: state.common.isDrawerOpen,
    isSubDrawerOpen: state.common.isSubDrawerOpen,
    subDrawerName: state.common.subDrawerName
  };
};

export default connect(mapStateToProps)(SidePanel);
