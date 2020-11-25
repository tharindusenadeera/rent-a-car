import React, { Component } from "react";
import { Popconfirm, Icon } from "antd";
import "antd/lib/icon/style/index.css";

class DeleteBtn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { size, deleteConfirm, deleteCancel } = this.props;
    return (
      <Popconfirm
        overlayClassName="popconfirm-delete"
        title="Are you sure to delete this？"
        okText="Yes"
        okType="primary"
        cancelText="No"
        onConfirm={deleteConfirm}
        onCancel={deleteCancel}
        icon={<Icon type="question-circle-o" style={{ color: "#ff5858" }} />}
      >
        <button
          type="button"
          className={
            size && size === 12
              ? "btn SC_btn SC_btn_delete msgbtn"
              : "btn SC_btn SC_btn_delete"
          }
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {/* If want font size in button 12=show 12-style, */}
          <img
            src="/images/support-center/delete_button_icon.svg"
            width="100%"
          />{" "}
          <span>DELETE TICKET</span>
        </button>
      </Popconfirm>
    );
  }
}

export default DeleteBtn;
