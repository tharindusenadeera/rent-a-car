import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import "./style.css";

class CountDown extends Component {
  constructor() {
    super();
    this.state = { days: "", hours: "", minutes: "", seconds: "" };
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    this.loadInterval = setInterval(this.countDown, 1000);
  }

  componentWillUnmount() {
    this.loadInterval && clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  countDown() {
    const countDownDate = new Date("Nov 29, 2018 18:00:01").getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.setState({
      days,
      hours,
      minutes,
      seconds
    });

    // if (distance < 0) {
    //     browserHistory.push('/');
    // }
  }

  render() {
    return (
      <div className="container count-down-wrap">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="count-box-wrap">
              <div className="count-box">
                {this.state.days > 0 ? this.state.days : 0}
                <div className="count-label">Days</div>
              </div>
              <div className="count-box">
                <div className="count-dots">:</div>
              </div>
              <div className="count-box">
                {this.state.hours > 0 ? this.state.hours : 0}
                <div className="count-label">Hours</div>
              </div>
              <div className="count-box">
                <div className="count-dots">:</div>
              </div>
              <div className="count-box">
                {this.state.minutes > 0 ? this.state.minutes : 0}
                <div className="count-label">Minutes</div>
              </div>
              <div className="count-box">
                <div className="count-dots">:</div>
              </div>
              <div className="count-box">
                {this.state.seconds > 0 ? this.state.seconds : 0}
                <div className="count-label">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CountDown;
