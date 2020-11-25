import React, { Fragment } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const CarouselItem = props => {
  const { car, onPressImg } = props;
  console.log("car", car);
  if (car) {
    return car.car_photos.data.map((img, index) => {
      return (
        <div
          className="item"
          key={index}
          onClick={() => {
            onPressImg(index);
          }}
        >
          <img className="img-responsive img-rounded" src={img.image_path} />
        </div>
      );
    });
  } else {
    return [
      // <div className="item" key={12121}>
      //   <img
      //     className="img-responsive img-rounded"
      //     src="/images/imageLoading.gif"
      //   />
      // </div>
    ];
  }
};

const Maincarousel = props => {
  return (
    <section className="cars-slider-section">
      <OwlCarousel
        className="owl-theme"
        loop={true}
        margin={5}
        center={true}
        lazyLoad={true}
        dots={false}
        autoplay={true}
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
          },
          900: {
            items: 2,
            nav: true
          },
          1200: {
            items: 2,
            nav: true
          }
        }}
      >
        <CarouselItem car={props.car} onPressImg={props.onPressImg} />
      </OwlCarousel>
    </section>
  );
};

export default Maincarousel;
