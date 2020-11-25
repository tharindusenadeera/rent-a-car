import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { modalStylesBookingReciptLarge } from "../../consts/consts";
import Receipt from "../booking/Receipt";
import { getBooking } from "../../actions/BookingActions";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";
import { isMobileOnly } from "react-device-detect";

class ViewReceipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    const { dispatch, tripInfo } = this.props;
    // dispatch(getBooking(tripInfo.id));
  }

  componentDidUpdate(prevProps) {
    const { dispatch, tripInfo } = this.props;
    if (tripInfo.id !== prevProps.tripInfo.id) {
      // dispatch(getBooking(tripInfo.id));
    }
  }

  showModal = () => {
    if (this.state.showModal === false) {
      this.setState({ showModal: true });
    }
  };

  toggleModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { booking, carCoverageLevels } = this.props;
    return (
      <div
        className="drawer-section drawer-receipt"
        onClick={() => this.showModal()}
      >
        <a className="profile-inline-blocks inline-green-link-wrapper">
          <img
            alt="Receipt Icon"
            src="/images/profilev2/receipt-icon-green.svg"
          />
          <span> View Receipt</span>
        </a>

        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          // style={modalStylesBookingReciptLarge}
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          {booking && (
            <Receipt
              _toggleModal={this.toggleModal}
              booking={booking}
              carCoverageLevels={carCoverageLevels}
            />
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    booking: state.booking.booking,
    popUp: state.booking.popUp,
    user: state.user.user
  };
};
export default connect(mapStateToProps)(ViewReceipt);
