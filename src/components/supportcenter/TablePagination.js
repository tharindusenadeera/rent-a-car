import React, { Component } from "react";
import { Pagination } from "antd";

class TablePagination extends Component {
  render() {
    const { total, onChange, perPage,current } = this.props;
    return (
      <Pagination
        onChange={e => onChange(e)}
        total={total}
        defaultPageSize={perPage}
        current={current ? current : null }
      />
    );
  }
}

export default TablePagination;
