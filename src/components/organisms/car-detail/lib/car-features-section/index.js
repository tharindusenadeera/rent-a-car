import React, { Component, Fragment } from "react";

class CarFeaturesSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      more: false
    };
  }

  handleMore = () => {
    this.setState({ more: !this.state.more });
  };

  getFeatures = (features, limit) => {
    return (
      features &&
      features.map((feature, index) => {
        if (limit == 0) {
          if (index < 3) {
            return (
              <div className="icon-detail-card flex-align-center" key={index}>
                <span className={feature.icon_name + " icon"} />
                <span>{feature.name}</span>
              </div>
            );
          }
        } else {
          return (
            <div className="icon-detail-card flex-align-center" key={index}>
              <span className={feature.icon_name + " icon"} />
              <span>{feature.name}</span>
            </div>
          );
        }
      })
    );
  };

  render() {
    const { features, car } = this.props;
    const { more } = this.state;

    return (
      <Fragment>
        <div className="detail-card inner">
          <h5>Features</h5>
          {/* Icon detail card - start */}
          <div className="icon-detail-wrapper">
            <div className="icon-detail-card flex-align-center">
              <span className="icon-revamp-shift-gear icon" />
              <span>
                {car && car.transmission == "Auto" ? "Automatic" : "Shift Gear"}
              </span>
            </div>
            {!more && this.getFeatures(features && features.data, 0)}
            {more && this.getFeatures(features && features.data, 1)}
          </div>
          {features && features.data.length > 3 && (
            <button
              onClick={this.handleMore}
              className="default-btn-link font-16 font-semibold"
            >
              {more ? "Less" : "More"}
            </button>
          )}
        </div>
        {/* Icon detail card - end */}
      </Fragment>
    );
  }
}

export default CarFeaturesSection;
