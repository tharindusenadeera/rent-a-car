import React from "react";
import { Upload, Modal } from "antd";
import { isMobileSafari } from "react-device-detect";
import { compress } from "./FileCompress";
import { fileUpload } from "./FileUpload";
import "antd/lib/upload/style/index.css";
import "antd/lib/modal/style/index.css";

class RydeUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      fileList: [],
      selectedFile: "",
      cropperOpen: false,
      currentCropImg: "",
      errObj: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues) {
      this.setState({
        fileList: this.state.fileList.concat(
          this.setInitialValues(nextProps.initialValues)
        )
      });
    }
  }

  setInitialValues = files => {
    let fileList = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      if (
        this.state.fileList.find(i => {
          return i.uid != element.id;
        })
      ) {
        continue;
      }
      fileList.push({
        isNew: false,
        name: "Attachment",
        status: "done",
        uid: element.id,
        url: element.image_path,
        isMain: element.status && element.status === 1 ? true : false
      });
    }
    return fileList;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file,
      previewVisible: true
    });
  };

  handleRemove = file => {
    const { fileList } = this.state;
    const { removeUploadImage } = this.props;
    if (!file.isNew && removeUploadImage) {
      removeUploadImage(file.uid).then(res => {
        if (!res.data.error) {
          let newList = fileList.filter(data => {
            return data.uid != file.uid;
          });
          this.setState({ fileList: newList });
        }
      });
    } else {
      let newList = fileList.filter(data => {
        return data.uid != file.uid;
      });
      this.setState({ fileList: newList });
    }
  };

  submittingData = () => {
    let imgArr = [];
    const { fileList } = this.state;

    let newList = fileList.filter(data => {
      return data.isNew === true;
    });

    newList.map(img => {
      if (img.key) imgArr.push(img.key);
    });
    return imgArr;
  };

  validateImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if (file.type == "image/heic") {
      callback(false);
      return false;
    }
    reader.onload = event => {
      let img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let naturalWidth = img.width;
        let naturalHeight = img.height;
        let error = {};

        if (naturalWidth < 1440 || naturalHeight < 890) {
          error.is_error = true;
          error.message = "Image resolution is too small!";
          this.setState({ errObj: error });
          callback(true);
        } else {
          this.setState({ errObj: error });
          callback(false);
        }
      };
    };
  };

  customRequest = obj => {
    try {
      const { folder, onUpload } = this.props;
      const { fileList } = this.state;
      const selectedUid = obj.file.uid;
      const fileName = "";
      this.validateImage(obj.file, err => {
        if (!err) {
          fileList.push({
            isNew: true,
            name: obj.file.name,
            status: "uploading",
            uid: selectedUid
          });
          this.setState({ fileList }, () => {
            compress(obj.file, fileName, { width: 1440, height: 890 }, file => {
              fileUpload(
                file,
                res => {
                  if (onUpload) {
                    onUpload([{ key: res.key, location: res.location }]);
                  }
                  let newItem = this.state.fileList.find(item => {
                    return item.uid == selectedUid;
                  });
                  newItem.url = res.location;
                  newItem.status = "done";
                  newItem.key = res.key;
                  this.setState({ fileList });
                },
                folder ? folder : null
              );
            });
          });
        }
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  handleBeforeUpload = () => {
    const { fileList } = this.state;
    let error = {};
    let isDone = fileList.every(file => {
      return file.status === "done";
    });
    if (isDone) {
      return true;
    } else {
      error.is_error = true;
      error.message = "Please wait untill upload is done!";
      this.setState({ errObj: error });
      return false;
    }
  };

  isUploading = () => {
    const { fileList } = this.state;
    const isDone = fileList.every(file => {
      return file.status === "done";
    });
    if (isDone) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, errObj } = this.state;
    const {
      renderSubmitButton,
      max,
      uploadBtn,
      multipleUploads,
      styleFullWidth,
      enableProfileImageFeature,
      accept
    } = this.props;

    let mainImage = fileList.find(item => {
      return item.isMain == true;
    });

    const maxFiles = max ? max : 50;
    const defaultBtn = (
      <div className="SC_ticket_upload">
        <img
          className="icon"
          src="/images/support-center/img_upload_icon.svg"
        />
        <div className="title">Upload</div>
        <div className="txt">images</div>
      </div>
    );

    const uploadButton = uploadBtn ? uploadBtn : defaultBtn;
    return (
      <div
        className={
          styleFullWidth
            ? "attachments-wrapper images-comp full-width"
            : "attachments-wrapper images-comp"
        }
      >
        {enableProfileImageFeature && enableProfileImageFeature === true && (
          <div>
            <p className="car-form-txt car-form-upload">
              A cover photo is the primary photo of your car. Click on an image
              you have recently uploaded and select “Mark as Cover Photo” to
              pick the cover photo.
            </p>

            <div className="row">
              <div className="col-md-4">
                {mainImage && (
                  <img
                    className="img-responsive make-cover-photo"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      height: "215px",
                      borderRadius: "8px",
                      marginBottom: "10px"
                    }}
                    src={mainImage.url}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <Upload
          multiple={multipleUploads ? true : false}
          customRequest={this.customRequest}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onRemove={this.handleRemove}
          disabled={isMobileSafari && this.isUploading() ? true : false}
          // beforeUpload={this.handleBeforeUpload}
          accept={accept ? accept : "*"}
        >
          {fileList.length >= maxFiles ? null : uploadButton}
        </Upload>

        {errObj.is_error && (
          <div className="GC_form_error">{errObj.message}</div>
        )}
        {
          <div className="GC_form_error">
            {isMobileSafari && this.isUploading()
              ? "Please wait untill upload is done!"
              : null}
          </div>
        }

        {renderSubmitButton &&
          renderSubmitButton(this.submittingData(), fileList.length)}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          className="ant-full-image-modal-custom"
        >
          <div style={{ position: "relative" }}>
            <img
              alt="example"
              style={{ width: "100%" }}
              src={previewImage.url}
            />
            {enableProfileImageFeature && enableProfileImageFeature === true && (
              <button
                onClick={() => {
                  fileList.map(obj => {
                    return (obj.isMain = obj.uid == previewImage.uid);
                  });
                  this.setState({ previewVisible: false });
                  this.props.setProfileImage &&
                    this.props.setProfileImage(previewImage);
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  margin: "15px",
                  backgroundColor: "#00C07F",
                  border: "none",
                  borderRadius: "15px",
                  height: "30px",
                  padding: "5px 15px 5px 15px",
                  color: "#fff"
                }}
              >
                Mark As Profile Image
              </button>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default RydeUpload;
