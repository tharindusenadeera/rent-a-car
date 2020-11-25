import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import Image from "react-shimmer";
import { DOCUMENT_TYPES } from "../../../consts/consts";
import {
  getExtension,
  getDocumentIcon
} from "../../../consts/commen-functions/";
import "antd/lib/button/style/index.css";

class ChatAttachment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shwoDeleteIcon: false
    };
  }

  getFileName(path) {
    return path.split("/")[path.split("/").length - 1];
  }

  makeDocLink = link => {
    const { thread_id } = this.props;
    var splitedLink = link.split("/").find(i => {
      return i == "tmp";
    });
    if (splitedLink) {
      link = link.replace("/tmp", "");
      link = link.replace("/message-center", `/message-center/${thread_id}`);
    }
    return link;
  };

  render() {
    const { attachment } = this.props;

    return (
      <Fragment>
        {DOCUMENT_TYPES.includes(getExtension(attachment.image_thumb)) ? (
          <a target="_blank" href={this.makeDocLink(attachment.image_path)}>
            <div className="inline-blocks-vertical-center attachment-outer">
              <div className="inline-blocks-vertical-center attachment-left-wrapper">
                <Button className="unstyled-btn doc-icon-wrapper">
                  <img
                    src={getDocumentIcon(getExtension(attachment.image_thumb))}
                  />
                </Button>
                <div className="doc-type-wrapper">
                  <div className="drawer-text-sm-normal">
                    {this.getFileName(attachment.image_path)}
                  </div>
                </div>
              </div>
            </div>
          </a>
        ) : (
          <div className="inline-blocks-vertical-center attachment-outer">
            <Button className="unstyled-btn attached-image-wrapper">
              <Image
                className="img-responsive"
                src={attachment.image_thumb}
                width={300}
                height={200}
                style={{ objectFit: "cover" }}
              />
            </Button>

            <div className="con-bs-right"></div>
          </div>
        )}
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    message: state.messageCenter.message
  };
};
export default connect(mapStateToProps)(ChatAttachment);
