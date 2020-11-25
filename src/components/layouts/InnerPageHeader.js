import React from "react";

const InnerPageHeader = props => {
  return (
    <div className="innerpage-header inner-headers">
      <h1 style={{ color: "white", textAlign: "center" }}>{props.header}</h1>
      <div className="text-center">
        <span style={{ color: "white" }}>{props.title}</span>
      </div>
    </div>
  );
};
export default InnerPageHeader;
