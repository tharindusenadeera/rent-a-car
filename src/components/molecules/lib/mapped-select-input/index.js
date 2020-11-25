import React, { Fragment } from "react";
import { Select } from "antd";

const mappedSelect = props => {
  const { mappingProperty, onChange, value } = props;

  return (
    <Fragment>
      <Select
        onChange={onChange}
        className="ant-select-grey-default"
        value={value != "" ? value : "Select"}
      >
        {mappingProperty.map(({ name, id }, key) => {
          return (
            <Select.Option value={id} key={key}>
              {name}
            </Select.Option>
          );
        })}
      </Select>
    </Fragment>
  );
};

export default mappedSelect;
