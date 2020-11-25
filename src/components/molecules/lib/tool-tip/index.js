import React from "react";
import { Popover } from "antd";

const ToolTip = props => {
  const { content } = props;
  return (
    <Popover
      content={content.length > 0 && content[0].description}
      title={content.length > 0 && content[0].title}
      trigger="click"
      overlayClassName="tooltip-pop"
    >
      <button type="primary" className="tooltip-btn">
        <span className="icon-revamp-tooltip-question icon"></span>
      </button>
    </Popover>
  );
};

export default ToolTip;
