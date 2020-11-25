import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import queryString from "query-string";
import { getGalleryCars } from "../../actions/CarActions";
import GalleryItem from "../site/GalleryItem";
import { OWLCAROSEL_RESPONSIVE_OPTIONS } from "../../consts/consts";

const List = props => {
  const { from, to, fromTime, toTime } = props.searchProps;
  const cars = props.galleryCars.map((car, index) => {
    return (
      <GalleryItem
        key={car.id}
        car={car}
        active={index === 1 ? true : false}
        from={from}
        to={to}
        fromTime={fromTime}
        toTime={toTime}
      />
    );
  });
  return (
    <OwlCarousel
      className="owl-theme"
      responsiveClass={true}
      responsive={OWLCAROSEL_RESPONSIVE_OPTIONS}
      margin={15}
      dots={false}
      lazyLoad={true}
      navClass="owl-prev owl-next"
      loop={false}
    >
      {cars}
    </OwlCarousel>
  );
};

class FeaturedRydes extends Component {
  componentWillMount() {
    this.fetchGalarayCars();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.landingPageProps != this.props.landingPageProps) {
  //     this.fetchGalarayCars();
  //   }
  // }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.galleryCars != this.props.galleryCars) {
  //     return true;
  //   }
  // }

  fetchGalarayCars = () => {
    const { landingPageProps, dispatch } = this.props;
    const { city } = landingPageProps;
    let queary = {};
    switch (city) {
      case "san-diego":
        queary = {
          address: "San Diego, CA, USA",
          lat: 32.715738,
          lng: -117.16108380000003,
          city: "San Diego"
        };
        break;
      case "los-angeles":
        queary = {
          address: "Los Angeles, CA, USA",
          lat: 34.0522342,
          lng: -118.2436849,
          city: "Los Angeles"
        };
        break;
      case "san-francisco":
        queary = {
          address: "San Francisco, CA, USA",
          lat: 37.7749295,
          lng: -122.41941550000001,
          city: "San Francisco"
        };
        break;
      case "miami":
        queary = {
          address: "San Francisco, CA, USA",
          lat: 25.7616798,
          lng: -80.19179020000001,
          city: "Miami"
        };
        break;
      default:
        queary = {};
        break;
    }
    dispatch(getGalleryCars(queary));
  };

  render() {
    const { landingPageProps, galleryCars } = this.props;
    const {
      isLosAngeles,
      isMain,
      isMiami,
      isSanDiego,
      isSanFrancisco
    } = landingPageProps;
    let queary = {};
    return (
      <section className="section-wrap featured-rydes-outer">
        <div className="container">
          <h2 className="section-header">
            {isMain ? (
              <Fragment>
                Featured Cars
              </Fragment>
            ) : (
              <Fragment>
                {isLosAngeles && (
                  <span className="textBold">
                    Featured cars in Los Angeles, California
                  </span>
                )}
                {isSanDiego && (
                  <span className="textBold">
                    Featured cars in San Diego, California
                  </span>
                )}
                {isSanFrancisco && (
                  <span className="textBold">
                    Featured cars in San Francisco, California
                  </span>
                )}
                {isMiami && (
                  <span className="textBold">Featured cars in Miami</span>
                )}
              </Fragment>
            )}
          </h2>
          <div className="featuredCarousel">
            {galleryCars.length > 0 && (
              <List
                searchProps={this.props}
                queary={queryString.stringify(queary)}
                galleryCars={galleryCars}
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
