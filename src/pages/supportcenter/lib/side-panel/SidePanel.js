import React from "react";
import { connect } from "react-redux";
import { Drawer } from "antd";
import { toggleDrawer } from "../../../../actions/CommenActions";
import ToggleDrawer from "../../../../components/ant-drawer/toggleDrawer";
import "../../../../components/ant-drawer/style.css";
// import 'antd/lib/drawer/style/index.css';

class SidePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  onClose = () => {
    // const { dispatch, isDrawerOpen, whenClose } = this.props;
    // dispatch(toggleDrawer(!isDrawerOpen));
    // whenClose && whenClose();
    this.setState({
      visible: false
    });
  };

  // componentWillUnmount() {
  //   this.onClose();
  // }

  render() {
    const { children, isDrawerOpen, width, onClose } = this.props;
    return (
      <Drawer
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={isDrawerOpen}
        width={width ? width : "540px"}
      >
        {isDrawerOpen === true && (
          <ToggleDrawer>
            <div
              className="close-panel-button approved-cb"
              onChange={() => {
                setTimeout(() => {
                  onClose();
                }, 500);
              }}
            >
              <img
                src="/images/car-edit/close-icon.svg"
                className="panel-close-icon"
                alt="Close"
              />
            </div>
          </ToggleDrawer>
        )}
        {children}
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    isDrawerOpen: state.common.isDrawerOpen
  };
};

export default connect(mapStateToProps)(SidePanel);
