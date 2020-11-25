import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import InnerpageHeader from "../layouts/InnerPageHeader";
import Griddle, { RowDefinition, ColumnDefinition } from "griddle-react";
import moment from "moment";
//import AvatarCropper from "react-avatar-cropper";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { connect } from "react-redux";
import { destroy } from "redux-form";
import ProfileForm from "./ProfileForm";
import {
  updateProfile,
  //uploadProfilePic,
  uploadProfilePicV2,
  fetchAuthUserReviews
} from "../../actions/UserActions";
import { getUsStates, getUsersCars } from "../../actions/CarActions";
import { getUsersBookings } from "../../actions/BookingActions";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import FileUpload from "./FileUpload";
import CopyToClipboard from "react-copy-to-clipboard";
import checkAuth from "../requireAuth";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import { getLoggedInUser } from "../../actions/UserActions";
import Drawer from "../ant-drawer";
import Reviews from "../reviews";
import CarGrid from "../car/CarGrid";
import AdvanceCarView from "../car/advance-car-view/AdvanceCarView";
import RydeAvatar from "../file-processing/lib/Avatar";

const DateComponent = ({ value }) => {
  const date = moment(value, "YYYY-MM-DD h:mm:ss a");

  return (
    <span style={{ color: "rgb(88, 88, 88)" }}>
      <b>
        {" "}
        {date.format("ddd, MMM D")} <br /> {date.format("h:mm A")}{" "}
      </b>
    </span>
  );
};

const CarImage = ({ rowData, value }) => {
  return (
    <div>
      {rowData && (
        <Link to={`/booking/${rowData.id}`}>
          <img
            src={
              rowData.car.car_photo[0]
                ? rowData.car.car_photo[0].image_thumb
                : "https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png"
            }
            className="img-rounded"
            alt="Cinque Terre"
            width="140"
            height="86"
          />
          <p> TRIP ID - {rowData.number}</p>
        </Link>
      )}
    </div>
  );
};

const TripStatus = ({ rowData, value }) => {
  if (rowData.status == 0) {
    return (
      <div>
        <strong className="text-warning">Pending</strong>
      </div>
    );
  } else if (rowData.status == 1) {
    return (
      <div>
        <strong className="text-primary"> Confirmed </strong>
      </div>
    );
  } else if (rowData.status == 2) {
    return (
      <div>
        <strong className="text-success">On Trip</strong>
      </div>
    );
  } else if (rowData.status == 3) {
    return (
      <div>
        <strong className="text-secondary" style={{ color: "#7f8c8d" }}>
          {" "}
          Completed{" "}
        </strong>
      </div>
    );
  } else if (rowData.status == -1) {
    return (
      <div>
        <strong className="text-danger"> Canceled </strong>
      </div>
    );
  }
};

const DeliveryLocation = ({ rowData, value }) => {
  if (rowData.delivery_location_method) {
    if (
      (rowData.status == 0 || rowData.status == -1) &&
      rowData.user_type == "renter" &&
      rowData.delivery_location_method.type == "PICK UP LOCATION"
    ) {
      return (
        <span>
          <b>{rowData.car_zip_code}</b>
        </span>
      );
    } else {
      return (
        <span>
          <b>{rowData.delivery_location_method.location}</b>
        </span>
      );
    }
  }
};

const TitleHeading = ({ title }) => {
  let removeUnderscore = title.replace("_", " ");
  return <span>{removeUnderscore}</span>;
};
const PickUpAndDropOfLocation = () => {
  return <span>Pick Up And Drop Of Location</span>;
};
const FromDate = () => {
  return <span>From</span>;
};
const ToDate = () => {
  return <span>To</span>;
};

class Profile extends Component {
  constructor(props) {
    super(props);
    const { initialValues } = props;
    this.state = {
      cropperOpen: false,
      isInternational:
        initialValues.country == "United States" || !initialValues.country
          ? false
          : true,
      img: null,
      index: 0,
      croppedImg: initialValues.profile_image
        ? initialValues.profile_image
        : "/images/defaultprofile.jpg",
      value: "",
      showPanel: false,
      profile_img_error: {}
    };

    //this.handleCrop = this.handleCrop.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.handleInternational = this.handleInternational.bind(this);
  }

  componentWillMount() {
    const { dispatch, usStates } = this.props;
    dispatch(destroy("car-registration"));
    if (usStates.length === 0) {
      dispatch(getUsStates());
    }
    dispatch(getUsersCars());
    dispatch(getUsersBookings());
    dispatch(fetchAuthUserReviews());
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.initialValues);
    if (
      nextProps.initialValues.profile_image //&&
      //this.props.initialValues.profile_image !=
      //nextProps.initialValues.profile_image
    ) {
      this.setState({ croppedImg: nextProps.initialValues.profile_image });
    }
    if (
      nextProps.initialValues.country != undefined &&
      nextProps.initialValues.country != "United States"
    ) {
      this.setState({ isInternational: true });
    }
    this.setState({
      value: `${window.location.origin}/signup/${
        nextProps.initialValues.referral_code
      }`
    });
  }

  handleInternational() {
    this.setState({ isInternational: !this.state.isInternational });
  }

  openPanel = () => {
    this.setState({ showPanel: !this.state.showPanel });
  };

  handleFileChange(dataURI) {
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      cropperOpen: true
    });
  }

  // handleCrop(dataURI) {
  //   // send the cropped image to the server
  //   const { dispatch } = this.props;
  //   dispatch(uploadProfilePic(dataURI, false));

  //   this.setState({
  //     cropperOpen: false,
  //     img: null,
  //     croppedImg: dataURI
  //   });
  // }

  handleRequestHide() {
    this.setState({
      cropperOpen: false
    });
  }

  changeTitle(index) {
    this.props.history.push(`/profile/index/${index}`);
  }

  rentedCarsCount(usersBookings) {
    const bookings = usersBookings.filter(booking => {
      if (booking.booking_status == 2) {
        return booking;
      }
    });
    return bookings.length;
  }

  generateInitialValues(initialValues) {
    return {
      ...initialValues,
      date_of_birth: moment(initialValues.date_of_birth).format("MM-DD-YYYY"),
      driving_license_expiration: moment(
        initialValues.driving_license_expiration
      ).format("MM-DD-YYYY")
    };
  }

  _updateProfile = data => {
    const { dispatch } = this.props;
    return dispatch(updateProfile(data));
  };

  responseFacebook = async e => {
    try {
      const response = await await axios.post(
        process.env.REACT_APP_API_URL + "users/verify-facebook",
        { count: e.friends.summary.total_count },
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.props.dispatch(getLoggedInUser());
      }
    } catch (error) {}
  };

  getUploadedFiles = data => {
    const { dispatch } = this.props;
    //console.log(data);
    dispatch(uploadProfilePicV2(data[0].location));
  };

  getUploadError = err => {
    this.setState({ profile_img_error: err });
  };

  render() {
    const {
      initialValues,
      usStates,
      usersCars,
      usersBookings,
      creditCardError
    } = this.props;
    const { profile_img_error } = this.state;
    const formatedInitialValues = this.generateInitialValues(initialValues);

    const styleConfig = {
      classNames: {
        Table: "table"
      }
    };
    const facebookVerifyName =
      initialValues && initialValues.facebook_friends_count > 0
        ? "Facebook Verified (Friends " +
          initialValues.facebook_friends_count +
          " )"
        : "Verify Facebook";

    const defaultAvatar = (
      <div className="profile-image-wrapper">
        <div className="avatar-photo">
          <div className="avatar-edit">
            <span>Upload</span>
            <i className="fa fa-camera" />
          </div>
          <img src={this.state.croppedImg} width="100%" />
        </div>
      </div>
    );

    return (
      <Fragment>
        <MainNav />
        <Drawer>
          <AdvanceCarView />
        </Drawer>
        <InnerpageHeader header="PERSONAL INFO" title="" />
        <div className="car-view container">
          <div className="row" />
          <br />
          <div className="row">
            <div className="col-md-4">
              <div className="panel">
                <div className="panel-heading panel-custom-profile">
                  YOUR PERSONAL INFO
                </div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="profcomp-avatar">
                        <RydeAvatar
                          cropper
                          folder={`profile/${initialValues.id}`}
                          onUpload={this.getUploadedFiles}
                          uploadBtn={defaultAvatar}
                          onError={this.getUploadError}
                        />
                        {/* <div className="profile-image-wrapper">
                          <div className="avatar-photo">
                            <FileUpload
                              handleFileChange={this.handleFileChange}
                            />
                            <div className="avatar-edit">
                              <span>Upload</span>
                              <i className="fa fa-camera" />
                            </div>
                            <img src={this.state.croppedImg} width="100%" />
                          </div>
                          {this.state.cropperOpen && (
                            <AvatarCropper
                              onRequestHide={this.handleRequestHide}
                              cropperOpen={this.state.cropperOpen}
                              cropButtonCopy={"Save"}
                              onCrop={this.handleCrop}
                              cropButtonCopy={"Save"}
                              image={this.state.img}
                              width={328}
                              height={328}
                            />
                          )}
                        </div> */}
                        {/* {this.state.croppedImg ==
                        "/images/defaultprofile.jpg" ? (
                          <span className="text-danger">
                            Please Upload Your Photo
                          </span>
                        ) : null}
                        <br /> */}
                        {profile_img_error.is_error && (
                          <div className="GC_form_error">
                            {profile_img_error.message &&
                              profile_img_error.message}
                          </div>
                        )}
                        <h4>
                          {initialValues.first_name} {initialValues.last_name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="profcomp-detail">
                      <div>Referral Code</div>
                      <div>
                        {initialValues.referral_code &&
                          initialValues.referral_code}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profcomp-detail">
                      <div>Available Car Credit</div>
                      <div>
                        $ {initialValues && initialValues.available_car_credit}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profcomp-detail">
                      <div>Pending Car Credit</div>
                      <div>
                        $ {initialValues && initialValues.pending_car_credit}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="profcomp-detail">
                      <div>Cars Rented</div>
                      <div>{initialValues.cars_rented}</div>
                    </div>
                  </div>

                  {/* <div className="row">
                    <div className="col-md-6">
                      <p className="">Referral Code</p>
                    </div>
                    <div className="col-md-6">
                      <p className="pull-right">
                        {initialValues.referral_code &&
                          initialValues.referral_code}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <p className="">Available Car Credit</p>
                    </div>
                    <div className="col-md-6">
                      <p className="pull-right">
                        $ {initialValues && initialValues.available_car_credit}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <p className="">Pending Car Credit</p>
                    </div>
                    <div className="col-md-6">
                      <p className="pull-right">
                        $ {initialValues && initialValues.pending_car_credit}
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <p className="">Cars Rented </p>
                    </div>
                    <div className="col-md-6">
                      <p className="pull-right">{initialValues.cars_rented}</p>
                    </div>
                  </div> */}

                  <p>
                    <b>Refer a friend get $30 off on your next rental</b>
                  </p>
                  {initialValues.referral_code ? (
                    <div className="row">
                      <div className="col-sm-12 text-center">
                        <input
                          value={this.state.value}
                          onChange={({ target: { value } }) =>
                            this.setState({ value, copied: false })
                          }
                          className="form-control input-sm"
                          type="text"
                          readOnly={true}
                        />
                      </div>
                      <div className="col-sm-12 text-center">
                        <CopyToClipboard
                          text={this.state.value}
                          onCopy={() => this.setState({ copied: true })}
                        >
                          <a>Copy to clipboard</a>
                        </CopyToClipboard>
                        {this.state.copied ? (
                          <small style={{ color: "green" }}>
                            {" "}
                            Copied. <span className="glyphicon glyphicon-ok" />
                          </small>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <br />
                  <br />
                  <div className="row btn-wrapper">
                    <Link className="btn btn-danger" to="/support-center">
                      {"  "}
                      Support Connect
                      {"  "}
                    </Link>
                  </div>
                  <br />
                  <div className="row btn-wrapper">
                    <Link className="btn btn-danger" to="/message-center">
                      Message Center
                    </Link>
                  </div>
                  <br />
                  <div className="row btn-wrapper">
                    <FacebookLogin
                      textButton={facebookVerifyName}
                      appId="1573804792688964"
                      autoLoad={false}
                      fields="friends"
                      callback={this.responseFacebook}
                      cssClass="facebook-btn"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 profile-tabs-section">
              <Tabs
                //className="profile-tab"
                onSelect={index => {
                  this.changeTitle(index);
                }}
                selectedIndex={
                  this.props.match.params.index
                    ? parseInt(this.props.match.params.index)
                    : this.state.index
                }
              >
                <TabList>
                  <Tab>Personal Info</Tab>
                  <Tab>Future Trips</Tab>
                  <Tab>My Cars</Tab>
                  <Tab>Reviews</Tab>
                </TabList>

                <TabPanel>
                  <div className="car-form">
                    {formatedInitialValues.id ? (
                      <ProfileForm
                        onSubmit={this._updateProfile}
                        initialValues={formatedInitialValues}
                        user={formatedInitialValues}
                        usStates={usStates}
                        profile={true}
                        profilePicUploaded={
                          this.state.croppedImg == "/images/defaultprofile.jpg"
                            ? false
                            : true
                        }
                        isInternational={this.state.isInternational}
                        handleInternational={this.handleInternational}
                        creditCard={
                          initialValues.credit_card
                            ? initialValues.credit_card
                            : ""
                        }
                        creditCardError={creditCardError}
                      />
                    ) : null}
                  </div>
                </TabPanel>
                <TabPanel>
                  {usersBookings.length ? (
                    <Griddle
                      data={usersBookings}
                      showFilter={false}
                      styleConfig={styleConfig}
                      components={{
                        Layout: NewLayout
                      }}
                    >
                      <RowDefinition>
                        <ColumnDefinition
                          id="Car"
                          customComponent={val =>
                            enhancedWithRowData(val, usersBookings, CarImage)
                          }
                          customHeadingComponent={TitleHeading}
                        />
                        <ColumnDefinition
                          id="Delivery_Location"
                          customComponent={val =>
                            enhancedWithRowData(
                              val,
                              usersBookings,
                              DeliveryLocation
                            )
                          }
                          customHeadingComponent={PickUpAndDropOfLocation}
                        />
                        <ColumnDefinition
                          id="from_date"
                          customComponent={DateComponent}
                          customHeadingComponent={FromDate}
                        />
                        <ColumnDefinition
                          id="to_date"
                          customComponent={DateComponent}
                          customHeadingComponent={ToDate}
                        />
                        <ColumnDefinition
                          id="Trip_status"
                          customComponent={val =>
                            enhancedWithRowData(val, usersBookings, TripStatus)
                          }
                          customHeadingComponent={TitleHeading}
                        />
                      </RowDefinition>
                    </Griddle>
                  ) : (
                    "No bookings yet"
                  )}
                </TabPanel>
                <TabPanel>
                  <CarGrid usersCars={usersCars} />
                </TabPanel>
                <TabPanel>
                  <Reviews />
                </TabPanel>
              </Tabs>
              <br />
            </div>
          </div>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}

const NewLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
  <div>
    <Table />
    <div className="row">
      <div className="col-md-1 col-md-offset-5">
        <Pagination />
      </div>
    </div>
  </div>
);

// const rowDataSelector = (state, { griddleKey }) => {
//   return state
//     .get("data")
//     .find(rowMap => rowMap.get("griddleKey") === griddleKey)
//     .toJSON();
// };

// const enhancedWithRowData = connect((state, props) => {
//   return {
//     // rowData will be available into MyCustomComponent
//     rowData: rowDataSelector(state, props)
//   };
// });

const enhancedWithRowData = ({ griddleKey }, data, callback) => {
  const rowData = data.find((row, index) => index === griddleKey);
  return callback({ rowData });
};

const mapStateToProps = state => ({
  initialValues: state.user.user,
  usStates: state.car.usStates,
  usersCars: state.car.usersCars,
  usersBookings: state.booking.users_bookings,
  creditCardError: state.user.creditCardError
});

export default withRouter(connect(mapStateToProps)(checkAuth(Profile)));
