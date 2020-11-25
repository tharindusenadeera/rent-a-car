import React, { Component, Fragment } from "react";

export default class SelectInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      error: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value || nextProps.submitting) {
      this._validate();
    }
  }

  _onBlur = () => {
    this._validate();
  };

  _validate = () => {
    const { validate, name } = this.props;
    if (validate().hasOwnProperty(name)) {
      this.setState({ isError: true, error: validate()[name] });
    } else {
      this.setState({ isError: false, error: null });
    }
  };

  render() {
    const {
      className,
      value,
      id,
      onChange,
      label,
      required,
      validate,
      submitting,
      prompt,
      data
    } = this.props;
    const { isError } = this.state;
    return (
      <Fragment>
        <div className={isError === true ? " fields-error form-group " : ""}>
          {label && label !== "undefined" && (
            <label>
              {label}{" "}
              {required === true && <span className="fields-requred">*</span>}
            </label>
          )}
          <div className="select-border-bottom">
            <select
              className={className ? className : ""}
              value={value}
              id={id}
              onBlur={() => this._onBlur()}
              onChange={onChange}
            >
              {prompt && prompt !== "undefined" && (
                <option value="">{prompt}</option>
              )}
              {data.map((i, index) => {
                return (
                  <option key={index} value={i.key ? i.key : i.value}>
                    {i.value}
                  </option>
                );
              })}
            </select>
            <img
              className="select-drop-down"
              src="/images/checkout/fields-down-arrow-sm.png"
            />
          </div>
        </div>
        {isError && (
          <p className="fields-error-text-bottom">{this.state.error}</p>
        )}
      </Fragment>
    );
  }
}
