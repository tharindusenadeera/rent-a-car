import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPromoFeaturedRydes } from "../../api/promo";
import GalleryItemFetures from "./GalleryItemFetures";
import { isMobileOnly } from "react-device-detect";
import { Carousel } from "../comman";

const List = props => {
  const cars = props.galleryCars.map((car, index) => {
    return (
      <GalleryItemFetures
        key={index}
        car={car}
        citiesLocationData={props.citiesLocationData}
      />
    );
  });

  return (
    <Carousel
      className="owl-theme Promo19Carousel-explore car-detail-carousal-ads"
      margin={12}
      dots={false}
      navClass="owl-prev owl-next"
      loop={false}
      nav={isMobileOnly ? false : true}
      items={isMobileOnly ? 1 : 4}
      // center={isMobileOnly ? true : false}
      stagePadding={isMobileOnly ? 40 : 0}
      autoplay={isMobileOnly ? false : true}
      autoplayTimeout={5000}
      stagePadding={isMobileOnly ? 25 : 0}
    >
      {cars}
    </Carousel>
  );
};

class FeaturedRydes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: []
    };
  }
  componentWillMount() {
    const { citiesLocationData } = this.props;

    fetchPromoFeaturedRydes({
      location: citiesLocationData._address
    }).then(res => {
      this.setState({
        cars: res.data.galleryCars
      });
    });
  }

  render() {
    const { cars } = this.state;

    return (
      <section className="section-wrap-promo Promo19-white-section">
        <div className="container">
          <h2 className="Promo19-section-head">
            <span>{this.props.title}</span>
          </h2>
          <div className="Promo19Carousel">
            {cars.length > 0 && (
              <List
                galleryCars={cars}
                citiesLocationData={this.props.citiesLocationData}
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
export default connect(mapStateToProps)(FeaturedRydes);
