import React from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";

const section3 = props => {
  const citiesResponsiveOptions = {
    0: {
      items: 1,
      nav: true
    },
    480: {
      items: 2,
      nav: true
    },
    900: {
      items: 3,
      nav: true
    },
    1200: {
      items: 4,
      nav: true
    }
  };
  return (
    <section className="section-wrap">
      <div className="container ryde-cities-section">
        <h2 className="section-header">
          <span className="textBold">RYDE</span> Cities
        </h2>
        <OwlCarousel
          className="owl-theme"
          items={4}
          responsiveClass={true}
          responsive={citiesResponsiveOptions}
          autoplay={true}
          autoplayTimeout={2500}
          loop
          margin={15}
          nav
          dots={false}
          lazyLoad={true}
          navClass="owl-prev owl-next"
        >
          <div className="item cities-box">
            <Link to={"/car-rentals/los-angeles"}>
              <div className="city-name">Los Angeles</div>
              <img
                alt="Rent a car with Ryde  in Hollywood "
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/hollywood.jpg"
              />
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/san-francisco"}>
              <div className="city-name">San Francisco</div>
              <img
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/san-francisco.jpg"
              />
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/san-diego"}>
              <div className="city-name">San Diego</div>
              <img
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/san-diego.jpg"
              />
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/miami"}>
              <div className="city-name">Miami</div>
              <img
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/miami.jpg"
              />
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/promo19"}>
              <div className="city-name">Promo</div>
              <img
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/miami.jpg"
              />
            </Link>
          </div>
        </OwlCarousel>
      </div>
    </section>
  );
};

export default section3;
