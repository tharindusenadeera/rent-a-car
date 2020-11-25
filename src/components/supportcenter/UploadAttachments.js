import React, { Component } from "react";
import ModalPopUp from "react-modal";
import { isMobileOnly } from "react-device-detect";
import {
  defaultModelPopup,
  defaultMobileModelPopup
} from "../../consts/consts";
import { Upload, Modal } from "antd";
import { compress } from "../file-processing/lib/FileCompress";
import { fileUpload } from "../file-processing/lib/FileUpload";
import "antd/lib/upload/style/index.css";
import "antd/lib/modal/style/index.css";

class UploadAttachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      previewVisible: false,
      previewImage: "",
      fileList: [],
      delConfirmModel: false,
      selectedFile: ""
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    if (file.url.toLowerCase().match(/\.(jpeg|jpg|png)$/) === null) {
      window.open(file.url, "_blank");
    } else {
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true
      });
    }
  };

  updateDocStatus = data => {
    const { isUploading } = this.props;
    const { fileList } = this.state;
    let isDone = fileList.every(file => {
      return file.status === "done";
    });
    isDone ? isUploading(false) : isUploading(true);
    this.setItems();
  };

  generateFileName = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  handleChange = info => {
    const { validateUpload, isUploading } = this.props;
    const isValid = validateUpload(info.file);
    if (isValid && !this.state.delConfirmModel) {
      isUploading(true);
      let fileList = info.fileList;
      let file = fileList[fileList.length - 1];
      let ext = file.name.split(".").pop();

      let generatedText = this.generateFileName();

      console.log("generatedText", generatedText);

      let fileName = `${generatedText}${"Ryde"}.${ext}`;
      let selectedUid = file.uid;
      this.state.fileList.push({
        uid: selectedUid,
        name:
          ext === "pdf" ||
          ext === "doc" ||
          ext === "docx" ||
          ext === "xlsx" ||
          ext === "xls"
            ? file.name
            : fileName,
        status: "uploading",
        url: file.thumbUrl
      });

      this.setState({ fileList: this.state.fileList }, () => {
        if (file.type.split("/")[0] === "image") {
          const settings = {
            width: 1440,
            height: 890,
            quality: 0.8
          };
          compress(file.originFileObj, fileName, settings, file => {
            fileUpload(
              file,
              res => {
                let newItem = this.state.fileList.find(item => {
                  return item.uid == selectedUid;
                });
                newItem.url = res.location;
                newItem.status = "done";
                newItem.key = res.key;
                let temps = this.state.fileList.filter(item => {
                  return item.uid != selectedUid;
                });
                temps.push(newItem);
                this.setState({ fileList: temps }, () => {
                  let isDone = temps.every(file => {
                    return file.status === "done";
                  });
                  isDone ? isUploading(false) : isUploading(true);
                  this.setItems();
                });
              },
              "tmp/support-center"
            );
          });
        } else {
          fileUpload(
            file.originFileObj,
            res => {
              let newItem = this.state.fileList.find(item => {
                return item.uid == selectedUid;
              });
              newItem.url = res.location;
              newItem.key = res.key;
              newItem.status = "done";
              let temps = this.state.fileList.filter(item => {
                return item.uid != selectedUid;
              });
              temps.push(newItem);
              this.setState({ fileList: temps }, () => {
                this.updateDocStatus(res);
              });
            },
            "tmp/support-center"
          );
        }
      });
    }
  };

  handleRemove = () => {
    const { selectedFile, fileList } = this.state;
    let newList = fileList.filter(data => {
      return data.uid != selectedFile.uid;
    });
    this.setState({ fileList: newList, delConfirmModel: false });
  };

  setItems = () => {
    let data = [];
    const { fileList } = this.state;
    for (let index = 0; index < fileList.length; index++) {
      data.push(fileList[index].key);
    }
    this.props.onChange(data);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div className="SC_ticket_upload new">
        <img
          alt="img_upload_icon"
          className="icon"
          src="/images/support-center/img_upload_icon.svg"
        />
        <div className="title">Upload</div>
        <div className="txt">images or documents</div>
      </div>
    );
    return (
      <div className="attachments-wrapper">
        <Upload
          multiple={true}
          customRequest={() => {}}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={file => {
            this.setState({ delConfirmModel: true, selectedFile: file });
          }}
        >
          {fileList.length >= 100 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
          className="ant-full-image-modal-custom"
        >
          <img style={{ width: "100%" }} src={previewImage} alt="testimg2" />
        </Modal>
        <ModalPopUp
          isOpen={this.state.delConfirmModel}
          onRequestClose={() => this.setState({ delConfirmModel: false })}
          shouldCloseOnOverlayClick={true}
          contentLabel="Successful!"
          style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
        >
          <div className="SC_popup">
            <div className="del_icon">
              <span
                className="icon-cancel"
                onClick={() => this.setState({ delConfirmModel: false })}
              />
            </div>
            <div className="header_second">Are you sure delete this file?</div>
            <div className="btn-scbox">
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_withdraw"
                onClick={() => this.setState({ delConfirmModel: false })}
              >
                NO
              </button>
              <button
                type="button"
                className="btn-popup SC_btn SC_btn_submit"
                onClick={() => this.handleRemove()}
              >
                YES
              </button>
            </div>
          </div>
        </ModalPopUp>
      </div>
    );
  }
}

export default UploadAttachments;
