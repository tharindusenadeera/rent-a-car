import React, { Component } from "react";

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
    const countDownDate = new Date("Nov 10, 2018 18:00:01").getTime();
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
          <div className="col-md-10 col-md-offset-1">
            <div className="count-box-wrap clearfix">
              <div className="count-box">
                {this.state.days}
                <div className="count-label">Days</div>
              </div>
              <div className="count-box">
                {this.state.hours}
                <div className="count-label">Hours</div>
              </div>
              <div className="count-box">
                {this.state.minutes}
                <div className="count-label">Minutes</div>
              </div>
              <div className="count-box">
                {this.state.seconds}
                <div className="count-label">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="rate-msg">
                    <h4>Please rate your RYDE with <br/><span> David D</span></h4>
                    <div className="rate-wrap">
                        <span className="star star-rated"></span>
                        <span className="star"></span>
                        <span className="star"></span>
                        <span className="star"></span>
                        <span className="star"></span>
                    </div>
                    <div className="comment-box">
                        <p>Tell us about your RYDE experience</p>
                        <div className="form-group">
                          <label for="comment">Comment:</label>
                          <textarea className="form-control rate-input" rows="3" id="rate"></textarea>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-success"> SUBMIT</button>
                     </div>
                </div>
                */}
      </div>
    );
  }
}

export default CountDown;
