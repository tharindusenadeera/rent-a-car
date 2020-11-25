import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchRestimonialReviews } from "../../api/promo";
import GalleryItemPromotion from "./GalleryItemPromotion";
import { isMobileOnly } from "react-device-detect";
import { Carousel } from "../comman";

const List = props => {
  const testamonials = props.testamonials.map((testamonial, index) => {
    return (
      <GalleryItemPromotion
        key={index}
        testamonial={testamonial}
        landingPageProps={props.landingPageProps}
      />
    );
  });

  return (
    <Carousel
      /* If city name not cameup on the car card - carousal arrows position adjust by "city-header-none" class - Janitha */
      className={`owl-theme car-detail-carousal-ads Promo19Carousel-cities ${
        testamonials &&
        !testamonials[0].props.testamonial.location.location_name
          ? "city-header-none"
          : ""
      }`}
      margin={12}
      dots={false}
      lazyLoad={true}
      navClass="owl-prev owl-next"
      loop={false}
      nav={isMobileOnly ? false : true}
      items={isMobileOnly ? 1 : 3}
      // center={isMobileOnly ? true : false}
      autoplay={isMobileOnly ? false : true}
      autoplayTimeout={5000}
      stagePadding={isMobileOnly ? 25 : 0}
    >
      {testamonials}
    </Carousel>
  );
};

class ReviewRydes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testamonials: []
    };
  }
  componentWillMount() {
    const { landingPageProps } = this.props;

    fetchRestimonialReviews({
      location: landingPageProps.citiesLocationData._address
    }).then(res => {
      this.setState({
        testamonials: res.data.testamonial
      });
    });
  }
  render() {
    const { testamonials } = this.state;

    return (
      <section className="section-wrap-promo Promo19-white-section">
        <div className="container">
          <h2 className="Promo19-section-head">
            <span>{this.props.title}</span>
          </h2>
          <div className="Promo19Carousel">
            {testamonials.length > 0 && (
              <List
                testamonials={testamonials}
                landingPageProps={this.props.landingPageProps}
              />
            )}
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    galleryCars: state.car.galleryCars
  };
};
export default connect(mapStateToProps)(ReviewRydes);
