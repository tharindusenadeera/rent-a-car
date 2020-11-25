import React, { Component, Fragment } from "react";
import StringMask from "string-mask";

export const Phone = value => {
  var phone = value.replace(/[^a-zA-Z0-9]/g, "");
  return {
    format: () => {
      if (phone.substring(0, 1) == "1" && phone.length == 11) {
        return `+${phone}`;
      }
      if (phone.length == 10) {
        return `+1${phone}`;
      }
      if (phone.length > 11) {
        return `+1${phone.slice(-10)}`;
      }
      return `+1${phone}`;
    },
    reset: () => {
      return phone ? `+1${phone}` : "";
    }
  };
};
export default class TelInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      phone: "",
      isHovered: false
    };
  }

  componentDidMount() {
    const { initalNumber } = this.props;
    if (initalNumber) {
      const number = this.phoneFormater(Phone(initalNumber).format());
      this.setState({ phone: number });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { initalNumber, error } = nextProps;
    if (initalNumber) {
      if (this.props.initalNumber != initalNumber) {
        const number = this.phoneFormater(Phone(initalNumber).format());
        this.setState({ phone: number });
      }
    }
  }

  onChangeText = e => {
    const { onChange } = this.props;
    const number = this.phoneFormater(e.target.value, this.state.phone);
    if (number.length < 15) {
      this.setState({ phone: number, isError: false }, () => {
        onChange(Phone(this.state.phone).reset());
      });
    }
  };

  phoneFormater = (value, prevValue = null) => {
    try {
      var mask = "(000) 000-00000";
      let phone = value;
      phone = phone.split("+1").pop();
      phone = phone.replace(/[^a-zA-Z0-9]/g, "");

      if (prevValue && value.length < prevValue.length) {
        if (phone.length === 6) {
          mask = "(000) 000";
        }
        if (phone.length === 3) {
          mask = "(000";
        }
      }
      var formatter = new StringMask(mask);
      return formatter.apply(phone);
    } catch (error) {
      return "";
    }
  };

  toggleHoverEnter = () => {
    this.setState(prevState => ({ isHovered: !prevState.isHovered }));
  };

  toggleHoverLeave = () => {
    this.setState(prevState => ({ isHovered: !prevState.isHovered }));
  };

  render() {
    const { label, onBlurValidator, errorFnc } = this.props;
    const { isError, phone, error, isHovered } = this.state;

    return (
      <Fragment>
        <div className="rc-tel-input-wrapper">
          {label !== false ? <label>Phone number*</label> : <Fragment />}
          <div
            className={
              (onBlurValidator && isError) || (errorFnc && errorFnc())
                ? "rc-tel-input-inline fields-error"
                : `${
                    isHovered
                      ? "rc-tel-input-inline tel-hover"
                      : "rc-tel-input-inline"
                  }` /* Hover class "rc-tel-input-inline tel-hover" */
            }
            onMouseEnter={() => this.toggleHoverEnter()}
            onMouseLeave={() => this.toggleHoverLeave()}
          >
            <span>+1</span>
            <input
              value={phone}
              onChange={this.onChangeText}
              className="rc-tel-input"
              onBlur={() => {
                if (onBlurValidator) {
                  if (!phone) {
                    this.setState({
                      isError: true,
                      error: "Phone number required"
                    });
                  }
                }
              }}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>
        {isError && <p className="fields-error-text-bottom">{error}</p>}
        {!isError && errorFnc && errorFnc() && (
          <p className="fields-error-text-bottom">{errorFnc()}</p>
        )}
      </Fragment>
    );
  }
}
