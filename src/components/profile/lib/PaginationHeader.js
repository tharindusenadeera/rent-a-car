import React from "react";

const PaginationHeader = props => {
  const { meta,parent } = props;
  const cp = meta.pagination.current_page;
  const pp = meta.pagination.per_page;
  const c = meta.pagination.count;

  // Charith
  const set1 = cp * pp + 1 - pp;
  const set2 = cp * pp - pp + c;

  // Lahiru
  //   const set1 = pp * (cp - 1) + 1;
  //   const set2 = pp * (cp - 1) + c;

  // Shamal
  //   const set1 =  (cp - 1) * pp + 1;
  //   const set2 =  (cp - 1) * pp + c;

  // Azran
  //   const set1 = (cp - 1) * pp + 1;
  //   const set2 = (cp - 1) * pp + c;

  return (
    <div className="trips-count-bottom-wrapper">
      <div className="tc-show-trips-count-page">
        Viewing {set1} - {set2} of
      </div>
      <div className="tc-show-total-trips">{meta.pagination.total} {parent} </div>
    </div>
  );
};

export default PaginationHeader;
