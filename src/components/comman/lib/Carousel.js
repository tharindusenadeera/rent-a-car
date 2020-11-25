import React from "react";
import OwlCarousel from "react-owl-carousel";

const Carousel = props => {
  return <OwlCarousel {...props}>{props.children}</OwlCarousel>;
};

export default Carousel;
