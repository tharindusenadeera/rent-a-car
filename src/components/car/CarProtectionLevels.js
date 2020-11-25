import React, { Component } from "react";

class CarProtectionLevels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ""
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentWillMount() {
    const { currentProtectionLevel, carProtectionLevels } = this.props;
    if (carProtectionLevels) {
      carProtectionLevels.map((i, key) => {
        if (currentProtectionLevel == i.value) {
          this.setState({
            selectedOption: i.id
          });
        }
      });
    }
  }

  handleOptionChange(e) {
    this.setState({
      selectedOption: parseInt(e.target.value)
    });
  }

  render() {
    const { carProtectionLevels, changeProtectionLevel } = this.props;

    return (
      <div>
        <h3> Car Protection </h3>

        <ul className="car-pro-list">
          {carProtectionLevels.map(level => {
            return (
              <li key={level.id}>
                <label>
                  <input
                    type="radio"
                    value={level.id}
                    checked={this.state.selectedOption === level.id}
                    onChange={this.handleOptionChange}
                  />{" "}
                  {level.title}{" "}
                </label>
              </li>
            );
          })}
        </ul>
        <div className="clearfix">
          <button
            className="btn btn-danger pull-right"
            onClick={() => changeProtectionLevel(this.state.selectedOption)}
          >
            {" "}
            SAVE{" "}
          </button>
        </div>
      </div>
    );
  }
}

export default CarProtectionLevels;
