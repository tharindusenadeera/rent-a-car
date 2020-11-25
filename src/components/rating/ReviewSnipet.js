import React, { Component } from "react";
import moment from "moment";
import TruncateMarkup from "react-truncate-markup";
import Image from "react-shimmer";

class ReviewSnipet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false
    };
  }

  render() {
    const { rowData } = this.props;

    return (
      <div className="reviewer-wrapper">
        {/* <img
          className="img-responsive img-circle"
          src={rowData.profile_image_thumb}
        /> */}
        <Image
          className="img-responsive img-circle"
          src={rowData.profile_image_thumb}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
        <div className="reviewer-comment">
          <div className="reviewer-name">
            {rowData.first_name}
            <span>{moment(rowData.ratingCreated).format("MMM DD,YYYY")}</span>
          </div>
          {!this.state.showMore ? (
            <TruncateMarkup
              lines={2}
              ellipsis={
                <span>
                  ... <br />{" "}
                  <a
                    className="more-read"
                    onClick={() => this.setState({ showMore: true })}
                  >
                    Read more{" "}
                  </a>
                </span>
              }
            >
              <p>{rowData.description}</p>
            </TruncateMarkup>
          ) : (
            <p>{rowData.description}</p>
          )}
        </div>
      </div>
    );
  }
}

export default ReviewSnipet;
