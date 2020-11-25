import React, { Component, Fragment } from "react";

class DescriptionSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readMore: false,
      newDescription: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setDescription(nextProps && nextProps.description);
  }

  setDescription = str => {
    if (str && str.length > 100) {
      this.setState({ newDescription: str.substring(0, 100) + " . . ." });
    } else {
      this.setState({ newDescription: str });
    }
  };

  handleReadMore = () => {
    const { description } = this.props;
    const { readMore } = this.state;
    if (description) {
      if (!readMore) {
        this.setState({
          newDescription: description
        });
      } else {
        this.setState({
          newDescription: description.substring(0, 100) + " . . ."
        });
      }
    }
    this.setState({ readMore: !this.state.readMore });
  };

  render() {
    const { description, title } = this.props;
    const { readMore, newDescription } = this.state;
    return (
      <Fragment>
        <h5>{title}</h5>
        <p className="detail-card-desc">{newDescription}</p>
        {description && description.length > 100 && (
          <button
            onClick={this.handleReadMore}
            className="default-btn-link font-16 font-semibold no-margin-top"
          >
            {readMore ? "Less" : "More"}
          </button>
        )}
      </Fragment>
    );
  }
}

export default DescriptionSection;
