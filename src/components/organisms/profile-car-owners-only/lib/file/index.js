import React, { Component, Fragment } from "react";
import { Progress, Button } from "antd";
import moment from "moment";
import "antd/lib/progress/style/index.css";
import { fileUpload } from "../../../../../api/owners";
// import { upload } from "../../../utils/upload";

const UPLOAD_SUCCESS = 1;
const UPLOAD_ERROR = -1;
const UPLOAD_PENDING = 2;

class Upload extends Component {
  constructor(props) {
    super(props);
    const { initialFiles } = props;
    this.state = {
      files: initialFiles ? initialFiles : []
    };
  }
  changeFileStatus = (status, index, res = null) => {
    const { files } = this.state;
    const file = files.find(item => {
      return item.key === index;
    });

    file.status = status;
    if (res && res.location) {
      file.url = res.location;
    }
    this.changeFileArray(files);
  };

  upload = file => {
    const { files } = this.state;
    const { upload_file_type, type } = this.props;
    let purpose = "identity_document";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_file_type", upload_file_type);
    data.append("type", purpose);

    fileUpload(data)
      .then(res => {
        files[0].status = UPLOAD_SUCCESS;
        this.setState({ files }, () => {
          this.props.onChange(res.data.response);
        });
      })
      .catch(e => {
        files[0].status = UPLOAD_ERROR;
        this.setState({ files: [] }, () => {
          this.props.handleError(e.response.data.message);
        });

        console.log("e", e);
      });
  };
  handleFileChange = ({ target }) => {
    try {
      var imgFiles = target.files;
      const { files } = this.state;
      const element = imgFiles[0];
      if (element) {
        this.upload(element);
        const currentKey = `${moment().valueOf()}_${0}`;
        files.push({
          key: currentKey,
          path: URL.createObjectURL(element),
          status: UPLOAD_PENDING,
          url: "",
          file: element
        });
      }

      this.changeFileArray(files);
      target.value = "";
    } catch (error) {
      console.log(error);
    }
  };

  changeFileArray = files => {
    this.setState({ files });
  };

  removeTempAttachments = id => {
    const { files } = this.state;
    const newArray = files.filter(item => {
      return item.key !== id;
    });
    this.changeFileArray(newArray);
  };

  render() {
    const { files } = this.state;
    const { label, error } = this.props;

    return (
      <Fragment>
        <input
          type="file"
          style={{ visibility: "hidden", display: "none" }}
          multiple={false}
          onChange={this.handleFileChange}
          ref={fileUpload => {
            this.fileUpload = fileUpload;
          }}
        />
        {!files.length && (
          <button
            className="Prof_photo_single"
            onClick={() => {
              if (files.length < 2) {
                this.fileUpload.click();
              }
            }}
          >
            <div className="Prof_photo_single_inner">
              <img
                alt="img_upload_icon"
                className="icon"
                src="/images/support-center/img_upload_icon.svg"
              />
              <span className="Prof_photo_single_title">
                {this.props.thumbTitle}
              </span>
            </div>
          </button>
        )}
        {error && <div className="fields-error">{error}</div>}
        {files.map((file, index) => {
          return (
            <div key={index} className="uploading-attachments-inner">
              <img
                className={
                  file.status === UPLOAD_PENDING
                    ? `img-responsive img-fade`
                    : "img-responsive"
                }
                alt="images-upload"
                src={file.path}
              />
              {file.status === UPLOAD_PENDING && (
                <div className="progress-wrapper">
                  <Progress
                    strokeColor="#1CC185"
                    percent={100}
                    showInfo={false}
                    status="active"
                  />
                </div>
              )}
              {file.status !== UPLOAD_PENDING && (
                <Button
                  onClick={() => this.removeTempAttachments(file.key)}
                  className="unstyled-btn hov-click img-remove-btn"
                >
                  <span className="icon-set-one-close-icon" />
                </Button>
              )}
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export default Upload;
