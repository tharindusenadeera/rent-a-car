import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import VisibilitySensor from "react-visibility-sensor";
import ContentLoader from "react-content-loader";
import { LazyLoadImage } from "react-lazy-load-image-component";

class DiImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      imgStyle: {
        display: "none"
      }
    };
  }
  render() {
    const { circle } = this.props;
    const { imgStyle, isLoad } = this.state;
    return (
      <Fragment>
        {!isLoad && (
          <ContentLoader
            height={this.props.height ? this.props.height : 400}
            width={this.props.width ? this.props.width : 400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            {circle === true ? (
              <circle cx="25" cy="25" r="25" />
            ) : (
              <rect
                x="0"
                y="0"
                rx="5"
                ry="5"
                height={this.props.height ? this.props.height : 400}
                width={this.props.width ? this.props.width : 400}
              />
            )}
          </ContentLoader>
        )}
        <img
          {...this.props}
          style={imgStyle}
          onLoad={() =>
            this.setState({ isLoad: true, imgStyle: { display: "block" } })
          }
        />
      </Fragment>
    );
  }
}

class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      isVisible: false
    };
  }

  onChange = isVisible => {
    this.setState({ isVisible: isVisible });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { isVisible } = this.state;

    if (nextState.isVisible === false) {
      return false;
    }
    if (
      (isVisible === true && nextState.isVisible === false) ||
      (isVisible === true && nextState.isVisible === true)
    ) {
      return false;
    }
    return true;
  }
  render() {
    const { isVisible } = this.state;
    const { circle, withloader } = this.props;

    if (withloader == "content-loader") {
      return (
        <VisibilitySensor onChange={this.onChange} partialVisibility={true}>
          <Fragment>
            {isVisible ? (
              <DiImage {...this.props} />
            ) : (
              <ContentLoader
                height={this.props.height ? this.props.height : 400}
                width={this.props.width ? this.props.width : 400}
                speed={2}
                primaryColor="#f3f3f3"
                secondaryColor="#ecebeb"
              >
                {circle === true ? (
                  <circle cx="25" cy="25" r="25" />
                ) : (
                  <rect
                    x="0"
                    y="0"
                    rx="5"
                    ry="5"
                    height={this.props.height ? this.props.height : 400}
                    width={this.props.width ? this.props.width : 400}
                  />
                )}
              </ContentLoader>
            )}
          </Fragment>
        </VisibilitySensor>
      );
    }

    return <LazyLoadImage {...this.props} />;
  }
}

LazyImage.protoType = {
  src: PropTypes.string
};

export default LazyImage;
