import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import SidePanel from "./side-panel/SidePanel";
import GenarelForm from "../../../components/supportcenter/GenarelForm";
import UrgentForm from "../../../components/supportcenter/UrgentForm";
import ReportDamageForm from "../../../components/supportcenter/ReportDamageForm";
import { toggleDrawer } from "../../../actions/CommenActions";
import S3Client from "aws-s3";
import { BUCKET_OPTIONS } from "../../../consts/consts";
import checkAuth from "../../../components/requireAuth";
import { authFail } from "../../../actions/AuthAction";

class CreateNewTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seletedContent: null,
      isDamageReport: null,
      isUrgentReport: null,
      message: "",
      ticketId: null,
      submitting: false,
      cancelling: false,
      successDialog: false
    };
  }

  componentDidMount() {
    this.checkTicketCreatable();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isDrawerOpen && !this.props.isDrawerOpen) {
      this.setState({
        seletedContent: null,
        message: "",
        successDialog: false
      });
    }
  }
  createTicket = data => {
    this.setState({
      submitting: true
    });
    return axios
      .post(`${process.env.REACT_APP_API_URL}v2/support-ticket`, data, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(res => {
        if (!res.data.error) {
          this.setState({
            successDialog: true,
            message: res.data.message,
            ticketId: res.data.data.id,
            submitting: false
          });
        }
      })
      .catch(e => this.props.dispatch(authFail(e)));
  };

  handleCancelling = () => {
    const { isDrawerOpen, dispatch } = this.props;
    dispatch(toggleDrawer(!isDrawerOpen));
    setTimeout(() => {
      this.setState({ seletedContent: null });
    }, 250);
  };

  checkTicketCreatable = () => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}support-ticket/damage/create`, {
        headers: {
          Authorization: localStorage.access_token
        }
      })
      .then(res => {
        this.setState({
          isDamageReport: res.data.damage_report,
          isUrgentReport: res.data.urgent_report
        });
      })
      .catch(err => {
        console.log("err", err);
        this.props.dispatch(authFail(err));
      });
  };

  selectDrawerContent = () => {
    const {
      seletedContent,
      successDialog,
      ticketId,
      message,
      submitting
    } = this.state;
    switch (seletedContent) {
      case "genarel-form":
        return (
          <GenarelForm
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
            handleCancel={this.handleCancelling}
          />
        );
        break;
      case "urgent-form":
        return (
          <UrgentForm
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
            handleCancel={this.handleCancelling}
          />
        );
        break;
      case "reportdamage-form":
        return (
          <ReportDamageForm
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
            handleCancel={this.handleCancelling}
          />
        );
        break;
      default:
        break;
    }
  };

  uploadFile = file => {
    return S3Client.uploadFile(file, BUCKET_OPTIONS);
  };

  render() {
    const { dispatch, isDrawerOpen } = this.props;

    return (
      <div>
        <div className="container dw-body-wrapper">
          {/* Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="SC_drawer_title">
                <div className="SC_page_title_new">Get help</div>
              </div>
            </div>
          </div>
          {/* Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <a
                className="SC_option_box_wrapper gen-color"
                href="https://rydecarshelp.zendesk.com/" target="_blank"
              >
                <img src="/images/support-center/info_help_icon.svg" />
                <div className="title">Resource center</div>
              </a>
            </div>
            <div className="col-sm-12">
              <a
                className={
                  this.state.isUrgentReport
                    ? "SC_option_box_wrapper ugm-color"
                    : "SC_option_box_wrapper ugm-color disabled"
                }
                onClick={() => {
                  if (this.state.isUrgentReport) {
                    this.setState(
                      {
                        seletedContent: "urgent-form"
                      },
                      () => {
                        dispatch(toggleDrawer(!isDrawerOpen));
                      }
                    );
                  }
                }}
              >
                <img
                  src={
                    this.state.isUrgentReport
                      ? "/images/support-center/urgent-icon.svg"
                      : "/images/support-center/urgent-icon-disable.svg"
                  }
                />
                <div className="SC_option_box_info">
                  <div className="title">Urgent</div>
                  <div className="info-message-box disabled">
                    <p>You don’t have any on-trip bookings</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-sm-12">
              <a
                className={
                  this.state.isDamageReport
                    ? "SC_option_box_wrapper dmg-color"
                    : "SC_option_box_wrapper dmg-color disabled"
                }
                onClick={() => {
                  if (this.state.isDamageReport) {
                    this.setState(
                      {
                        seletedContent: "reportdamage-form"
                      },
                      () => {
                        dispatch(toggleDrawer(!isDrawerOpen));
                      }
                    );
                  }
                }}
              >
                <img
                  src={
                    this.state.isDamageReport
                      ? "/images/support-center/damage-icon.svg"
                      : "/images/support-center/damage-icon-disable.svg"
                  }
                />
                <div className="SC_option_box_info">
                  <div className="title">Report damage</div>
                  <div className="info-message-box disabled">
                    <p>You don’t have any completed bookings</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {this.state.seletedContent === "reportdamage-form" ? (
          <SidePanel width="600px">{this.selectDrawerContent()}</SidePanel>
        ) : (
          <SidePanel>{this.selectDrawerContent()}</SidePanel>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isDrawerOpen: state.common.isDrawerOpen
  };
};
export default connect(mapStateToProps)(checkAuth(CreateNewTicket));
