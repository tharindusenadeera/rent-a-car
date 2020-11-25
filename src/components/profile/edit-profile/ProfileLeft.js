import React, { Fragment } from "react";
import Rating from "react-rating";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  EmailShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from "react-share";
import FacebookLogin from "react-facebook-login";
import CopyToClipboard from "react-copy-to-clipboard";
import RydeAvatar from "../../file-processing/lib/Avatar";
import { getLoggedInUser } from "../../../actions/UserActions";
import { uploadProfile } from "../../../actions/ProfileActions";
import { PROFILE_PIC_UPDATE_SUCCESS } from "../../../actions/ActionTypes";
import { authFail } from "../../../actions/AuthAction";
class ProfileLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      code: "",
      error: false,
      success: false,
      message: "",
      submitting: false,
      rendering: "",
      profile_img_error: {}
    };
  }

  responseFacebook = res => {
    if (res.friends && res.friends.summary) {
      return axios
        .post(
          process.env.REACT_APP_API_URL + "users/verify-facebook",
          { count: res.friends.summary.total_count },
          {
            headers: {
              Authorization: localStorage.access_token
            }
          }
        )
        .then(response => {
          this.props.dispatch(getLoggedInUser());
        })
        .catch(error => {
          this.props.dispatch(authFail(error));
          console.log("error", error);
        });
    }
  };

  getUploadedFiles = data => {
    const { dispatch } = this.props;
    this.setState({ submitting: true, rendering: "" }, () => {
      dispatch(uploadProfile(data[0].location));
    });
  };

  getUploadError = error => {
    this.setState({ profile_img_error: error });
  };

  componentDidMount() {
    const { user } = this.props;
    this.setState({
      code: `${window.location.origin}/signup/${user.referral_code}`
    });
  }

  componentDidUpdate(prevProps) {
    const { picUpdateSuccess, dispatch } = this.props;
    if (picUpdateSuccess && prevProps.picUpdateSuccess === "") {
      this.setState(
        { success: true, message: picUpdateSuccess, submitting: false },
        () => {
          setTimeout(() => {
            this.setState({ success: false, message: "" }, () => {
              dispatch({ type: PROFILE_PIC_UPDATE_SUCCESS, payload: "" });
            });
          }, 2000);
        }
      );
    }
  }

  render() {
    const { user } = this.props;
    const { error, message, success, profile_img_error } = this.state;

    const defaultAvatar = (
      <div className="profile-image-wrapper">
        <img src={"/images/profilev2/cam-icon.svg"} width="100%" />
      </div>
    );

    let facebook_friends_count =
      user.facebook_friends_count != null
        ? " Facebook verified (friends " + user.facebook_friends_count + ")"
        : " Verify Facebook";

    return (
      <div className="col-md-4">
        <span>&nbsp;</span>
        <div className="Prof_detail_wrapper">
          <div className="Prof_avatar_wrapper">
            <div className="Prof_avatar">
              <RydeAvatar
                cropper
                folder={`profile/${user.id}`}
                onUpload={this.getUploadedFiles}
                uploadBtn={defaultAvatar}
                onError={this.getUploadError}
                _errors={{
                  isError: profile_img_error.is_error ? true : false,
                  message: ""
                }}
                img={
                  user && user.profile_image_thumb
                    ? user.profile_image_thumb
                    : null
                }
              />
            </div>
          </div>
          <div>
            {user && !user.profile_image_thumb && (
              <div className="GC_form_error avatar">Profile photo required</div>
            )}

            {success && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box success">
                    <img src="/images/profilev2/message_icon_sucess.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}

            {error && message && (
              <div className="row">
                <div className="col-md-12">
                  <div className="Prof_msg_box failed">
                    <img src="/images/profilev2/message_icon_failed.svg" />
                    {message}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="Prof_detail_name">{user.first_name}</div>
          <div className="Prof_detail_email">{user.email}</div>
          {user.user_rating ? (
            <div className="Prof_detail_rate">
              <span className="digit">{user.user_rating}</span>
              <Rating
                emptySymbol="fa fa-star-o fa-1x"
                fullSymbol="fa fa-star fa-1x"
                fractions={2}
                readonly
                initialRating={user.user_rating}
              />
            </div>
          ) : (
            <Fragment />
          )}
          {user && user.profile_image_thumb && (
            <div className="Prof_detail_button">
              <Link to={`/profile/${user.id}`} className="btn Prof_btn_view">
                View your profile
              </Link>
            </div>
          )}
          <div className="Prof_detail_stats_wrapper">
            <div className="Prof_detail_stats">
              <div>
                <span>{user.cars_rented}</span>
              </div>
              Cars rented
            </div>
            <div className="Prof_detail_stats">
              <div>
                <span>{user.cars_count}</span>
              </div>
              Cars
            </div>
            <div className="Prof_detail_stats">
              <div>
                <span>{user.booking_count}</span>
              </div>
              Trips
            </div>
          </div>
        </div>

        <div className="Prof_share_wrapper">
          <div className="textA">Referral code : {user.referral_code}</div>
          <div className="textA">
            Available car credit : $ {user.available_car_credit}
          </div>
          <div className="textA">
            Pending car credit : $ {user.pending_car_credit}
          </div>
          <div className="textD">
            Refer a friend get $ {parseInt(user.referral_campaign_amount)} off
            on your next rental
          </div>
          <div>
            <div className="textE">Share your referral code via</div>
            <div className="Prof_share_icons">
              <FacebookShareButton
                url={this.state.code}
                quote={user.first_name}
              >
                <FacebookIcon size={50} round>
                  <img src="/images/profilev2/social-fb.svg" />
                </FacebookIcon>
              </FacebookShareButton>

              <TwitterShareButton url={this.state.code} quote={user.first_name}>
                <TwitterIcon size={50} round>
                  <img src="/images/profilev2/social-twitter.svg" />
                </TwitterIcon>
              </TwitterShareButton>

              <EmailShareButton url={this.state.code} quote={user.first_name}>
                <EmailIcon size={50} round>
                  <img src="/images/profilev2/social-mail.svg" />
                </EmailIcon>
              </EmailShareButton>

              <CopyToClipboard
                text={this.state.code}
                onCopy={() => this.setState({ copied: true })}
              >
                <button className="sharelink">
                  <img src="/images/profilev2/social-link.svg" />
                </button>
              </CopyToClipboard>
            </div>

            {/* need to style Copy to clipboard Copied. success message*/}
            <div className="Prof_share_message">
              {this.state.copied ? (
                <span>
                  <img src="/images/profilev2/icon-correct.svg" />
                  Copy to clipboard Copied.
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <FacebookLogin
            type="button"
            textButton={facebook_friends_count}
            appId="1573804792688964"
            autoLoad={false}
            fields="name,email,picture,friends"
            scope="public_profile,user_friends,user_actions.books"
            callback={this.responseFacebook}
            returnScopes={true}
            cssClass="Prof-sharefb"
            icon="fa-facebook fa-lg"
          />
        </div>
      </div>
    );
  }
}

export default ProfileLeft;
