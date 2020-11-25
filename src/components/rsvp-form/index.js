import React, { Component } from "react";
import axios from "axios";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import "./style.css";

class RsvpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      reference: "",
      submitting: null,
      error: false
    };
  }

  _checkEmailIsCorrect = (email = null) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) || !email) {
      return false;
    } else {
      return true;
    }
  };

  _validateEmail = () => {
    const { email } = this.state;
    if (email && !this._checkEmailIsCorrect(email)) {
      return false;
    } else {
      return true;
    }
  };

  handleSubmit = async () => {
    try {
      const { first_name, last_name, email, reference } = this.state;
      if (
        !first_name ||
        !last_name ||
        !email ||
        !reference ||
        !this._checkEmailIsCorrect(email)
      ) {
        this.setState({
          error: true
        });
        return false;
      }
      this.setState({
        submitting: true
      });

      const data = {
        firstname: first_name,
        lastname: last_name,
        how_did_you_hear_about_this_event: reference,
        email
      };
      const response = await await axios.post(
        `${process.env.REACT_APP_API_URL}hubspotform`,
        data
      );
      if (!response.data.error) {
        this.setState({
          submitting: false,
          error: false
        });
        setTimeout(() => {
          this.setState({
            submitting: null,
            first_name: "",
            last_name: "",
            email: "",
            reference: ""
          });
        }, 5000);
      }
    } catch (error) {
      this.setState({
        submitting: false,
        error: false
      });
      setTimeout(() => {
        this.setState({
          submitting: null,
          first_name: "",
          last_name: "",
          email: "",
          reference: ""
        });
      }, 5000);
      console.log("error", error);
    }
  };

  render() {
    const {
      first_name,
      last_name,
      email,
      reference,
      submitting,
      error
    } = this.state;

    return (
      <div>
        <div className="rsvp-flex-container">
          <div id="form-rsvp">
            <div className="form-rsvp-inner">
              <input
                className={`form-control fc-first-name ${first_name &&
                  "active-field"} ${!first_name &&
                  error === true &&
                  "error-field"} `}
                name="first_name"
                type="text"
                data-validate-input=""
                placeholder="First Name *"
                value={first_name}
                onChange={e => this.setState({ first_name: e.target.value })}
              />
              <input
                className={`form-control fc-last-name ${last_name &&
                  "active-field"} ${!last_name &&
                  error === true &&
                  "error-field"} `}
                name="last_name"
                type="text"
                data-validate-input=""
                placeholder="Last Name *"
                value={last_name}
                onChange={e => this.setState({ last_name: e.target.value })}
              />
              <input
                className={`form-control fc-email ${email &&
                  this._validateEmail() &&
                  "active-field"} ${(error || !this._validateEmail()) &&
                  "error-field"} `}
                name="email"
                type="email"
                data-validate-input=""
                placeholder="Email *"
                value={email}
                onChange={e => this.setState({ email: e.target.value })}
              />
              <div className="form-control-outer fc-dropdwon">
                <select
                  className={`form-control ${reference &&
                    "active-field"} ${!reference &&
                    error === true &&
                    "error-field"} `}
                  value={reference}
                  onChange={e => this.setState({ reference: e.target.value })}
                >
                  <option value="" hidden disabled>
                    How did you hear about this? *
                  </option>
                  <option value="Social Media">Social Media</option>
                  <option value="Google Search">Google Search</option>
                  <option value="From a friend">From a friend</option>
                </select>
                <img
                  src="https://cdn.rydecars.com/static-images/events/fields-down-arrow.svg"
                  alt="Drop down"
                />
              </div>
            </div>
            <button className="rsvp-button" onClick={() => this.handleSubmit()}>
              {submitting == null && "RSVP"}
              {submitting === true && (
                <PreloaderIcon
                  loader={Oval}
                  size={28}
                  strokeWidth={10} // min: 1, max: 50
                  strokeColor="#fff"
                  duration={800}
                />
              )}
              {submitting === false && (
                <img
                  className="done-icon"
                  src="https://cdn.rydecars.com/static-images/events/success.svg"
                  alt="Success"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RsvpForm;
