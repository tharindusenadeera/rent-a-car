import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import MainNav from "../../../components/layouts/MainNav";
import MainFooter from "../../../components/layouts/MainFooter";
import SidePanel from "./side-panel/SidePanel";
import GenarelForm from "../../../components/supportcenter/GenarelForm";
import UrgentForm from "../../../components/supportcenter/UrgentForm";
import ReportDamageForm from "../../../components/supportcenter/ReportDamageForm";
import { toggleDrawer } from "../../../actions/CommenActions";
import S3Client from "aws-s3";
import { BUCKET_OPTIONS } from "../../../consts/consts";
import checkAuth from "../../../components/requireAuth";
import { authFail } from "../../../actions/AuthAction";

class CreateTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seletedContent: null,
      isDamageReport: null,
      isUrgentReport: null,
      successDialog: false,
      message: "",
      ticketId: null,
      submitting: false
    };
  }

  componentDidMount() {
    this.checkTicketCreatable();
  }

  createTicket = data => {
    this.setState({ submitting: true });
    axios
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
      .catch(err => {
        //console.log("err", err);
        this.props.dispatch(authFail(err));
        this.setState({ submitting: false });
      });
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
        this.props.dispatch(authFail(err));
        console.log("err", err);
      });
  };

  handleCancel = () => {
    const { dispatch, isDrawerOpen } = this.props;
    dispatch(toggleDrawer(!isDrawerOpen));
    setTimeout(() => {
      this.setState({ seletedContent: null });
    }, 250);
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
            unMount={() => this.setState({ seletedContent: null })}
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            handleCancel={this.handleCancel}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
          />
        );

      case "urgent-form":
        return (
          <UrgentForm
            // unMount={() => this.setState({ seletedContent: null })}
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            handleCancel={this.handleCancel}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
          />
        );

      case "reportdamage-form":
        return (
          <ReportDamageForm
            // unMount={() => this.setState({ seletedContent: null })}
            uploadFile={this.uploadFile}
            createTicket={this.createTicket}
            handleCancel={this.handleCancel}
            successDialog={successDialog}
            ticketId={ticketId}
            message={message}
            submitting={submitting}
          />
        );

      default:
        break;
    }
  };

  onClose = () => {
    this.setState({ successDialog: false });
  };

  uploadFile = (file, callback) => {
    // return S3Client.uploadFile(file, BUCKET_OPTIONS);
    S3Client.uploadFile(file, BUCKET_OPTIONS)
      .then(res => {
        callback(res);
      })
      .catch(err => console.error("err", err));
  };

  render() {
    const { dispatch, isDrawerOpen } = this.props;

    console.log("this.props");
    return (
      <Fragment>
        <MainNav />
        <div className="container">
          <div className="SC_backlink">
            <div className="SC_backlink_box">
              <Link to="/">Home</Link>
            </div>
            <div className="SC_backlink_iconbox">
              <img src="/images/support-center/bclinks-arrow.png" />
            </div>
            <div className="SC_backlink_box">
              <Link to="/profile">Profile</Link>
            </div>
            <div className="SC_backlink_iconbox">
              <img src="/images/support-center/bclinks-arrow.png" />
            </div>
            <div className="SC_backlink_box">
              <Link to="/support-center">Support Connect</Link>
            </div>
            <div className="SC_backlink_iconbox">
              <img src="/images/support-center/bclinks-arrow.png" />
            </div>
            <div className="SC_backlink_box">New Ticket</div>
          </div>

          {/* Page Header */}
          <div className="SC_page_title">
            <div className="col-sm-12 no_padding">
              <div className="name">Create new ticket</div>
            </div>
          </div>
          {/* Page Header */}

          <div className="SC_section_title main">Select ticket type</div>

          <div className="row">
            <div className="col-sm-12 SC_section_optbox">
              <div className="row">
                <div className="col-sm-3">
                  <a
                    className="SC_option_box_wrapper gen-color"
                    onClick={() => {
                      this.setState(
                        {
                          seletedContent: "genarel-form"
                        },
                        state => {
                          dispatch(toggleDrawer(!isDrawerOpen));
                        }
                      );
                    }}
                  >
                    <img src="/images/support-center/gen-icon.svg" />
                    <div className="title">General</div>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a
                    className="SC_option_box_wrapper ugm-color"
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
                    <img src="/images/support-center/urgent-icon.svg" />
                    <div className="title">Urgent</div>
                  </a>
                </div>
                <div className="col-sm-3">
                  <a
                    className="SC_option_box_wrapper dmg-color"
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
                    <img src="/images/support-center/damage-icon.svg" />
                    <div className="title">Report damage</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.seletedContent === "reportdamage-form" ? (
          // <SidePanel whenClose={this.closedSidePanel} width="700px">
          //   {this.selectDrawerContent()}
          // </SidePanel>
          <SidePanel onClose={this.onClose} width="700px">
            {this.selectDrawerContent()}
          </SidePanel>
        ) : (
          // <SidePanel whenClose={this.closedSidePanel}>
          //   {this.selectDrawerContent()}
          // </SidePanel>
          <SidePanel onClose={this.onClose}>
            {this.selectDrawerContent()}
          </SidePanel>
        )}
        <MainFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isDrawerOpen: state.common.isDrawerOpen
  };
};
export default connect(mapStateToProps)(checkAuth(CreateTicket));
