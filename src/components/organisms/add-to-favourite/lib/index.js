import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { addToFavourite } from "../../../../api/car";
import { defaultMobileModelPopup } from "../../../../consts/consts";
import UserAuthModel from "../../../forms/UserAuthModel";

class AddFavourite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorite_cars: [],
      showModelPopUp: false
    };
  }

  _toggleFavorites = (id, isRemove) => {
    const { favorite_cars } = this.state;
    const { authenticated } = this.props;
    let checked = favorite_cars;
    if (!isRemove) {
      checked.push(id);
    } else {
      checked = this.state.favorite_cars.filter(item => {
        return item !== id;
      });
    }
    this.setState({
      favorite_cars: checked
    });
    if (authenticated) {
      addToFavourite(id);
    } else {
      this.setState({
        showModelPopUp: true
      });
    }
  };

  afterLogin = () => {
    const { carId, favourite } = this.props;
    const { favorite_cars } = this.state;
    this.setState({
      showModelPopUp: false
    });
    this._toggleFavorites(
      carId,
      favourite || favorite_cars.includes(carId) ? true : false
    );
  };

  handleCloseModal = () => {
    this.setState({ showModelPopUp: false });
  };

  render() {
    const { carId, favourite, authenticated } = this.props;
    const { favorite_cars, showModelPopUp } = this.state;

    return (
      <Fragment>
        {authenticated && (
          <button
            className={
              favourite || favorite_cars.includes(carId)
                ? "favorite-icon active"
                : "favorite-icon"
            }
            onClick={() =>
              this._toggleFavorites(
                carId,
                favourite || favorite_cars.includes(carId) ? true : false
              )
            }
          >
            <span
              className={
                favourite || favorite_cars.includes(carId)
                  ? "icon-set-one-like-filled icon"
                  : "icon-set-one-like icon"
              }
            />
          </button>
        )}
        {/* {authenticated == false && (
          <button
            className="favorite-icon"
            onClick={() => this._toggleFavorites()}
          >
            <span className="icon-set-one-like icon" />
          </button>
        )} */}
        <Modal
          isOpen={showModelPopUp}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={defaultMobileModelPopup}
        >
          <UserAuthModel
            stack="signup"
            callBack={this.afterLogin}
            closeModel={() => {
              this.setState({ showModelPopUp: false });
            }}
          />
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(AddFavourite);
