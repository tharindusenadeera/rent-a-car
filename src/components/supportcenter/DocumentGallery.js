import React, { Component } from "react";

class DocumentGallery extends Component {
  constructor(props) {
    super(props);
  }

  setDocumentIcon = type => {
    switch (type) {
      case "pdf":
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-pdf.svg" />
        );
      case "doc":
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-word.svg" />
        );
      case "docx":
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-word.svg" />
        );
      case "xls":
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-excel.svg" />
        );
      case "xlsx":
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-excel.svg" />
        );
      default:
        return (
          <img src="https://cdn.rydecars.com/static-images/sc-icon-document.svg" />
        );
    }
  };

  setThumbnailWidth = width => {
    switch (width) {
      case 24:
        return "SC_sideattach_box width_24";
      default:
        return "SC_sideattach_box width_47";
    }
  };

  handlePreview = url => {
    window.open(url, "_blank");
  };

  render() {
    const { docs, width } = this.props;

    return (
      <div className="SC_sideattach">
        <div className="row">
          {docs.map((doc, index) => {
            return (
              <a
                key={index}
                onClick={() => this.handlePreview(doc.src)}
                title={decodeURIComponent(doc.src)
                  .split("/")
                  .pop()}
              >
                <div className={this.setThumbnailWidth(width)}>
                  {this.setDocumentIcon(doc.type)}
                  <div className="txt">
                    {decodeURIComponent(doc.src)
                      .split("/")
                      .pop()
                      .substring(0, 13) + "..."}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DocumentGallery;
