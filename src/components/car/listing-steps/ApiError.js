import React from "react";

const ApiError = props => (
  <div className="row">
    <div className="col-sm-12">
      <div className="alert alert-danger">
        <strong>{props.children}</strong>
      </div>
    </div>
  </div>
);

export default ApiError;
