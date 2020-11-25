import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { defaultMobileModelPopup } from "../../../../../consts/consts";
import { getCarMakes } from "../../../../../actions/CarActions";
import { Radio } from "antd";

class CarMakeFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      makeId: "",
      isVisible: false,
      carMake: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    const { carMakes } = this.props;

    if (nextProps && nextProps.makeId) {
      carMakes.map(({ name, id }, key) => {
        if (nextProps.makeId == id) {
          this.setState({
            carMake: name,
            makeId: nextProps.makeId
          });
        }
      });
    } else {
      this.setState({
        carMake: "",
        makeId: ""
      });
    }
  }

  componentDidMount() {
    const { dispatch, carMakes } = this.props;
    if (carMakes.length == 0) {
      dispatch(getCarMakes("registered-makes"));
    }
  }

  setVisible = isVisible => this.setState({ isVisible });

  handleMakeChange = makeId =>
    this.setState({ makeId: makeId.target.value }, () =>
      this.handleCarMake(makeId.target.value)
    );

  handleCarMake = makeId => {
    const { carMakes } = this.props;
    carMakes.map(({ name, id }, key) => {
      if (makeId == id) {
        this.setState({
          carMake: name
        });
      }
    });
  };

  submitForm = () => {
    const { makeId } = this.state;
    const { submitFilters } = this.props;
    const filterdData = {};

    if (makeId) {
      filterdData.makeId = makeId;
    }
    submitFilters(filterdData);
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, makeId, carMake } = this.state;
    const { carMakes } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    return (
      <Fragment>
        <a
          onClick={() => this.setVisible(true)}
          className={
            carMake == "" ? "black flex-align-center" : "flex-align-center"
          }
        >
          <span className="icon-revamp-steering-wheel scroll-menu-icon"></span>
          {carMake == "" ? "Vehicle make" : carMake}
        </a>

        <Modal
          isOpen={isVisible}
          onRequestClose={() => this.setVisible(false)}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={defaultMobileModelPopup}
        >
          <div className="mobile-modal">
            <div className="mobile-modal-header flex-justify-spacebetween flex-align-center">
              <span
                className="icon-cancel"
                onClick={() => this.setVisible(false)}
              />
              <div className="flex-justify-spacebetween flex-align-center">
                <h6>Vehicle make</h6>
              </div>
              <button
                className={`${
                  makeId != "" ? "default-btn-link" : "gray-link"
                } font-semibold submit`}
                onClick={() =>
                  this.setState({ makeId: "", carMake: "" }, () =>
                    this.props._onClear("make")
                  )
                }
              >
                Clear
              </button>
            </div>
            <div className="mobile-modal-body">
              <div className="mobile-modal-section without-padding">
                <Radio.Group
                  onChange={e => this.handleMakeChange(e)}
                  value={makeId}
                >
                  {carMakes.map(({ name, id }, key) => {
                    return (
                      <Radio style={radioStyle} value={id} key={key}>
                        {name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </div>
            </div>
            <div className="mobile-modal-sticky">
              <button
                type="submit"
                className="default-btn full-width submit"
                onClick={this.submitForm}
              >
                Show results
              </button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}
const mapToStateProps = state => {
  return {
    carMakes: state.car.carMakes
  };
};
export default connect(mapToStateProps)(CarMakeFilter);
