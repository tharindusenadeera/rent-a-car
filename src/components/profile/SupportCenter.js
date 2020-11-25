import React from "react";
import { Tickets } from "../../pages/supportcenter";

class SupportCenter extends React.Component {
  state = { visible: false, drawerContent: null };

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

  handleClick = data => {
    this.props.clicked(data);
  };

  render() {
    return (
      <div>
        <Tickets clicked={this.handleClick} />
      </div>
    );
  }
}

export default SupportCenter;
