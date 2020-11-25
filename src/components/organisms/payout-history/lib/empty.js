import React from "react";

const Empty = () => {
  return (
    <div className="Prof_empty">
      <div>
        <div className="inner">
          <img src="/images/profilev2/earning-icon.svg" />
        </div>
        <div className="inner">
          <span>You do not have any payout history yet</span>
        </div>
      </div>
    </div>
  );
};

export default Empty;
