import React, { Fragment } from "react";
import OwlCarousel from "react-owl-carousel";

const MainCarousel = props => {
  const { car } = props;

  return (
    <Fragment>
      {car && (
        <OwlCarousel
          className="owl-theme"
          loop={true}
          margin={5}
          center={true}
          dots={false}
          autoplayHoverPause={true}
          navClass="owl-prev owl-next"
          responsiveClass={true}
          responsive={{
            0: {
              items: 1,
              nav: true
            },
            480: {
              items: 1,
              nav: true
            }
          }}
        >
          {car.car_photos.data.map((img, index) => {
            return (
              <div className="item" key={index}>
                <img src={img.image_path} />
              </div>
            );
          })}
        </OwlCarousel>
      )}
    </Fragment>
  );
};

export default MainCarousel;
