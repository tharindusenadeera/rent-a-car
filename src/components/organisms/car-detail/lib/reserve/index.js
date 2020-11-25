import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { defaultMobileModelPopup } from "../../../../../consts/consts";
import UserAuthModel from "../../../../forms/UserAuthModel";
import { setTripsData } from "../../../../../actions/BookingActions";

class Reserve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModelPopUp: false,
      showError: false,
      availability: false
    };
  }

  componentDidMount() {
    const { bookingData } = this.props;
    if (bookingData) {
      this.setState({ availability: bookingData.car_availability });
    }
  }

  componentDidUpdate(prevProps) {
    const { bookingData } = this.props;
    if (
      bookingData.car_availability !== prevProps.bookingData.car_availability
    ) {
      this.setState({ availability: bookingData.car_availability });
    }
  }

  onClickReserveButton = () => {
    const { reserveCar, authenticated, bookingData } = this.props;
    const { availability } = this.state;

    if (authenticated === false) {
      this.setState({ showModelPopUp: true });
    } else if (bookingData.car_availability == false) {
      this.setState({ availability: !availability });
    } else {
      reserveCar();
    }
  };

  afterAuth = () => {
    const { afterLogin, reserveCar, dispatch } = this.props;
    afterLogin()
      .then(res => {
        dispatch(setTripsData(res.data.data));
        if (res.data.data.car_availability) {
          reserveCar();
          // this.setState({ showModelPopUp: false });
        } else {
          this.setState({ showModelPopUp: false });
        }
      })
      .catch(e => {
        console.log("e", e);
        this.setState({ showModelPopUp: false });
      });
  };

  render() {
    const { bookingData, isLoading } = this.props;
    const { showModelPopUp, availability } = this.state;

    return (
      <Fragment>
        {bookingData && !availability && !isLoading && (
          <div className="mobile-modal-sticky-fixed flex-align-center custom-error">
            <div className="custom-error-inner">
              {/* Close button */}
              <button
                className="custom-error-close transparent-btn"
                onClick={() => this.setState({ availability: !availability })}
              >
                <span className="icon-set-one-close-icon" />
              </button>
              <div className="flex-align-center">
                <div className="custom-error-icon flex-align-center">
                  <span className="icon-set-one-error-icon" />
                </div>
                <p className="font-12 font-medium">
                  {bookingData.availability_message}
                </p>
              </div>
            </div>
          </div>
        )}

        {bookingData && availability && !isLoading && (
          <div className="mobile-modal-sticky-fixed flex-align-center">
            {bookingData && (
              <div className="form-field-split">
                <span className="font-15 font-bold">
                  ${bookingData.unit_price}/day x {bookingData.number_of_dates}{" "}
                  days
                </span>
                <div>
                  <span className="font-11 font-medium color-grey-72">
                    Trip price
                  </span>
                  <span className="font-11 font-bold color-grey-72">
                    {" "}
                    $ {bookingData.item_price}
                  </span>
                </div>
              </div>
            )}
            <div className="form-field-split">
              {/* Disable class "disabled-btn", when click should appear error dialog again */}
              <button
                type="submit"
                className="default-btn full-width submit"
                onClick={this.onClickReserveButton}
              >
                Reserve
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mobile-modal-sticky-fixed flex-align-center">
            <div className="form-field-split">
              <span className="font-15 font-bold">
                ${bookingData.unit_price}/day x {bookingData.number_of_dates}{" "}
                days
              </span>
              <div>
                <span className="font-11 font-medium color-grey-72">
                  Trip price
                </span>
                <span className="font-11 font-bold color-grey-72">
                  {" "}
                  $ {bookingData.item_price}
                </span>
              </div>
            </div>

            <div className="form-field-split">
              {/* Disable class "disabled-btn", when click should appear error dialog again */}
              <button
                type="submit"
                className="default-btn loading submit flex-align-center flex-justify-center"
              >
                <div className="btn-io-loading">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModelPopUp}
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick={true}
          contentLabel="Modal"
          style={defaultMobileModelPopup}
        >
          <UserAuthModel
            stack="signup"
            callBack={this.afterAuth}
            page="car_detail"
            closeModel={() => {
              this.setState({ showModelPopUp: false });
            }}
            promoCloseCallBack={this.afterAuth}
          />
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(Reserve);
