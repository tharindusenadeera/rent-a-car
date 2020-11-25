import React, { Component, Fragment } from "react";

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      hasError: false,
      error: ""
    };
  }

  _onChangeText = e => {
    const { onChange } = this.props;
    this.setState({ text: e.target.value, hasError: false, error: "" }, () => {
      onChange(this.state.text);
    });
  };

  _onBluer = () => {
    const { onBlur } = this.props;
    const { text } = this.state;
    onBlur(getErrors => {
      if (getErrors()) {
        if (!text) {
          this.setState({
            hasError: true,
            error: getErrors().error
          });
        }
      }
    });
  };

  render() {
    const { setErrors, placeholder, type } = this.props;
    const { hasError, error, text } = this.state;
    console.log("setErrors", setErrors());

    return (
      <Fragment>
        <div className="rc-input-wrapper">
          <input
            type={type ? type : "text"}
            placeholder={placeholder}
            value={text}
            onChange={this._onChangeText}
            onBlur={this._onBluer}
            className={
              hasError || (setErrors && setErrors().error)
                ? "rc-input rc-input-error"
                : "rc-input"
            }
          />

          {hasError ? (
            <span className="rc-input-error-txt"> {error}</span>
          ) : (
            <Fragment>
              <span className="rc-input-error-txt">
                {" "}
                {setErrors && setErrors().error && setErrors().error}
              </span>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}
export default TextInput;
