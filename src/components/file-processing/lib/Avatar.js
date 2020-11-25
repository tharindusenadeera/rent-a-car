import React from "react";
import { Upload } from "antd";
import { connect } from "react-redux";
import {
  compress,
  dataURLtoFile,
  fixImageRotation,
  getOrientation
} from "./FileCompress";
import { fileUpload } from "./FileUpload";
import { IS_FETCHING } from "../../../actions/ActionTypes";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../../consts/consts";
import AvatarEditor from "react-avatar-editor";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import "antd/lib/upload/style/index.css";


Modal.setAppElement("#root");

class RydeAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cropperOpen: false,
      currentCropImg: "",
      imgUrl: null,
      loading: false,
      rendering: false,
      tempImg: "",
      showErrorPopup: false,
      popUpErrorMessage: ""
    };
  }

  updateFileStatus = data => {
    this.setState({ loading: false, imgUrl: data.location });
  };

  getBucketResponse = res => {
    const { onUpload } = this.props;
    this.updateFileStatus(res);
    const data = {
      key: res.key,
      location: res.location
    };
    onUpload && onUpload([data]);
  };

  getCompressedFile = file => {
    const { folder } = this.props;
    this.setState({ loading: true });
    fileUpload(file, this.getBucketResponse, folder ? folder : null);
  };

  validateImage = (dataurl, callback) => {
    const { onError } = this.props;
    let img = new Image();
    img.src = dataurl;
    img.onload = () => {
      let naturalWidth = img.width;
      let naturalHeight = img.height;
      let error = {};
      if (naturalWidth < 400 || naturalHeight < 400) {
        error.is_error = true;
        error.message = "Image resolution is too small!";
        // onError && onError(error);
        this.setState({
          showErrorPopup: true,
          popUpErrorMessage:
            "This image size is not allowed. Image size should be minimum 1440X890."
        });
        callback(true);
      } else {
        onError && onError(error);
        this.setState({
          showErrorPopup: false,
          popUpErrorMessage: ""
        });
        callback(false);
      }
    };
  };

  handleChange = ({ fileList }) => {
    this.setState({
      showErrorPopup: false,
      popUpErrorMessage: ""
    });
    const { cropper } = this.props;
    const settings = {
      width: 1440,
      height: 890,
      quality: 0.8
    };
    const file = fileList[fileList.length - 1];
    const nameFile = "";
    this.setState({ currentUploadFile: file });
    if (cropper) {
      getOrientation(file.originFileObj, nameFile, orientation => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        console.log(URL.createObjectURL(file.originFileObj));

        reader.onload = event => {
          this.validateImage(event.target.result, err => {
            if (!err) {
              fixImageRotation(
                event.target.result,
                orientation,
                { mimeType: file.type, quality: 1 },
                res => {
                  this.setState({
                    currentCropImg: res,
                    cropperOpen: true
                  });
                }
              );
            }
          });
        };
      });
    } else {
      getOrientation(file.originFileObj, nameFile, orientation => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = event => {
          this.validateImage(event.target.result, err => {
            if (!err) {
              this.props.dispatch({ type: IS_FETCHING });
              compress(
                file.originFileObj,
                nameFile,
                settings,
                this.getCompressedFile
              );
            }
          });
        };
      });
    }
  };

  handleRemove = file => {
    const { fileList } = this.state;
    let newList = fileList.filter(data => {
      return data.uid !== file.uid;
    });
    this.setState({ fileList: newList });
  };

  // Image Cropper functions
  handleCrop = dataurl => {
    const settings = {
      width: 400,
      height: 400
    };
    const nameFile = "";
    let file = this.state.currentUploadFile;
    const fileObj = dataURLtoFile(dataurl, file.name, file.type);
    this.setState({ cropperOpen: false, imgUrl: dataurl });
    this.props.dispatch({ type: IS_FETCHING });
    compress(fileObj, nameFile, settings, this.getCompressedFile);
  };

  onClickSave = () => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      const dataURL = canvasScaled.toDataURL();
      const settings = {
        width: 400,
        height: 400
      };
      let file = this.state.currentUploadFile;
      const fileObj = dataURLtoFile(dataURL, file.name, file.type);
      this.setState({ cropperOpen: false, imgUrl: dataURL, tempImg: dataURL });
      this.props.dispatch({ type: IS_FETCHING });
      compress(fileObj, "", settings, this.getCompressedFile);
    }
  };

  setEditorRef = editor => (this.editor = editor);

  setImg = () => {
    const { loading, tempImg } = this.state;
    const { img } = this.props;

    if (tempImg) {
      return tempImg;
    } else {
      if (img) {
        return img;
      } else {
        return "/images/defaultprofile.jpg";
      }
    }
  };

  render() {
    const { _errors } = this.props;
    const { loading, tempImg, showErrorPopup, popUpErrorMessage } = this.state;
    const avatarWraperStyles = {
      backgroundImage: `url(${this.setImg()}`
    };
    if (loading) {
      avatarWraperStyles.filter = "blur(4px)";
      avatarWraperStyles.WebkitFilter = "blur(4px)";
    }
    return (
      <div className="attachments-wrapper">
        <div className="Prof_avatar_wrapper">
          <div className="profcomp-avatar">
            <Upload
              customRequest={() => {}}
              name="avatar"
              showUploadList={false}
              onChange={this.handleChange}
              accept="image/*"
              disabled={loading ? true : false}
            >
              <div>
                {loading && (
                  <div className="submit-btn-preloder prof-pg">
                    <PreloaderIcon
                      loader={Oval}
                      size={30}
                      strokeWidth={8} // min: 1, max: 50
                      strokeColor="#fff"
                      duration={800}
                    />
                  </div>
                )}
              </div>
              <div
                className={
                  _errors.isError ? "Prof_avatar error" : "Prof_avatar"
                }
                style={avatarWraperStyles}
              >
                <div className="Prof_avatar_edit">
                  <img src="/images/profilev2/cam-icon.svg" />
                </div>
              </div>
            </Upload>
            {_errors.isError && (
              <div className="GC_form_error">{_errors.message}</div>
            )}
          </div>
        </div>

        <Modal
          isOpen={this.state.cropperOpen}
          onRequestClose={() => this.setState({ cropperOpen: false })}
          //shouldCloseOnOverlayClick={false}
          contentLabel="Avatar Crop"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.currentCropImg}
            width={400}
            height={400}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
            style={isMobileOnly ? { width: "100%", height: 400 } : {}}
          />
          <div>
            <button
              style={{
                width: "100%",
                height: "50px",
                border: "none",
                backgroundColor: "#00bf7c",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600"
              }}
              onClick={this.onClickSave}
            >
              Save
            </button>
          </div>
        </Modal>

        {/* Image upload error */}
        <Modal
          isOpen={showErrorPopup}
          contentLabel="Image upload error"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="images-upload-error-modal">
            <div className="images-upload-error-modal-inner">
              <img
                alt="Pending Acceptance status Icon"
                src="/images/error-exclamation-60-icon.png"
              />
              <div className="fontsize25-semibold">Upload error</div>
              <div className="fontsize16-regular">
                {popUpErrorMessage && popUpErrorMessage}
              </div>
              <div className="pop-buttons-inline-center">
                <button
                  onClick={() => this.setState({ showErrorPopup: false })}
                  className="pop-btn btns-default cancel-btn-default"
                >
                  CANCEL
                </button>
                <Upload
                  customRequest={() => {}}
                  name="avatar"
                  showUploadList={false}
                  onChange={this.handleChange}
                  accept="image/*"
                  disabled={loading ? true : false}
                >
                  <button className="pop-btn btns-default upload-btn-default">
                    UPLOAD
                  </button>
                </Upload>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect()(RydeAvatar);
