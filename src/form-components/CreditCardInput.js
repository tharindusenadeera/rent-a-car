import React, { Component } from "react";
import MaskedTextInput from "react-text-mask";

export default class CreditCardInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      error: null,
      placeholder:
        props.placeholder && props.placeholder !== "undefined"
          ? props.placeholder
          : ""
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value != this.props.value || nextProps.submitting) {
      this._validate();
    }
  }
  _onBlur = () => {
    this.setState({ placeholder: this.props.placeholder }, state => {
      this._validate();
    });
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
      autocomplete,
      validate,
      submitting,
      type,
      min
    } = this.props;
    const { isError, placeholder } = this.state;
    return (
      <>
        <div
          className={
            isError === true ? "fields-error form-group" : "form-group"
          }
        >
          {label && label !== "undefined" && (
            <label>
              {label}{" "}
              {required === true && <span className="fields-requred">*</span>}
            </label>
          )}
          <input
            className={className}
            value={value}
            type={type && type !== "undefined" ? type : "text"}
            min={type && type == "number" && min ? min : ""}
            placeholder={placeholder}
            id={id}
            onChange={onChange}
            inputMode="numeric"
            autoComplete={autocomplete !== "undefined" ? autocomplete : "on"}
            onFocus={() => this.setState({ placeholder: "" })}
            onBlur={() => this._onBlur()}
          />
        </div>
        {isError && (
          <p className="fields-error-text-bottom">{this.state.error}</p>
        )}
      </>
    );
  }
}
