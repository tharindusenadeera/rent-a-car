import React from "react";
import { Link } from "react-router-dom";
import OwlCarousel from "react-owl-carousel";
import { OWLCAROSEL_RESPONSIVE_OPTIONS } from "../../consts/consts";
// import { SimpleImg } from 'react-simple-img';
import { LazyImage } from "../comman";
import { isMobileOnly } from "react-device-detect";

const RydeCities = () => {
  return (
    <section className="section-wrap">
      <div className="container ryde-cities-section">
        <h2 className="section-header">
          <span className="textBold">Top</span> Destinations
        </h2>
        <OwlCarousel
          className="owl-theme"
          items={4}
          responsiveClass={true}
          responsive={OWLCAROSEL_RESPONSIVE_OPTIONS}
          autoplay={isMobileOnly ? false : true}
          autoplayTimeout={2500}
          loop={false}
          margin={15}
          nav
          dots={false}
          lazyLoad={true}
          navClass="owl-prev owl-next"
        >
          <div className="item cities-box">
            <Link to={"/car-rentals/los-angeles"}>
              <div className="city-name">Los Angeles</div>
              <LazyImage
                withloader="content-loader"
                alt="Rent a car with Ryde  in Hollywood "
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/hollywood.jpg"
                width={isMobileOnly ? 320 : 270}
                height={isMobileOnly ? 210 : 170}
                style={{ objectFit: "cover" }}
              />
              {/* <SimpleImg
                alt="Rent a car with Ryde in Hollywood"
                src="https://cdn.rydecars.com/static-images/hollywood.jpg"
                className="img-responsive img-rounded"
                role="presentation"
              /> */}
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/san-francisco"}>
              <div className="city-name">San Francisco</div>
              <LazyImage
                withloader="content-loader"
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/san-francisco.jpg"
                width={isMobileOnly ? 320 : 270}
                height={isMobileOnly ? 210 : 170}
                style={{ objectFit: "cover" }}
              />
              {/* <SimpleImg
                alt="Rent a car with Ryde in San Francisco"
                src="https://cdn.rydecars.com/static-images/san-francisco.jpg"
                className="img-responsive img-rounded"
                role="presentation"
              /> */}
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/san-diego"}>
              <div className="city-name">San Diego</div>
              <LazyImage
                withloader="content-loader"
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/san-diego.jpg"
                width={isMobileOnly ? 320 : 270}
                height={isMobileOnly ? 210 : 170}
                style={{ objectFit: "cover" }}
              />
              {/* <SimpleImg
                alt="Rent a car with Ryde in San Diego"
                src="https://cdn.rydecars.com/static-images/san-diego.jpg"
                className="img-responsive img-rounded"
                role="presentation"
              /> */}
            </Link>
          </div>
          <div className="item cities-box">
            <Link to={"/car-rentals/miami"}>
              <div className="city-name">Miami</div>
              <LazyImage
                withloader="content-loader"
                alt="Rent a car with Ryde in Los Angeles int airport"
                role="presentation"
                className="img-responsive img-rounded"
                src="https://cdn.rydecars.com/static-images/miami.jpg"
                width={isMobileOnly ? 320 : 270}
                height={isMobileOnly ? 210 : 170}
                style={{ objectFit: "cover" }}
              />
              {/* <SimpleImg
                alt="Rent a car with Ryde in Miami"
                src="https://cdn.rydecars.com/static-images/miami.jpg"
                className="img-responsive img-rounded"
                role="presentation"
              /> */}
            </Link>
          </div>
        </OwlCarousel>
      </div>
    </section>
  );
};

export default RydeCities;
