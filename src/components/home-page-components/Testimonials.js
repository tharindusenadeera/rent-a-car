import React from "react";
import OwlCarousel from "react-owl-carousel";
import { OWLCAROSEL_RESPONSIVE_OPTIONS } from "../../consts/consts";

const Testimonials = props => {
  return (
    <section
      className={`section-wrap gray-bg ${!props.isMain &&
        "cities-testimonials-section"} `}
    >
      <div
        className={`container ${
          props.isMain ? "ss-section" : "testimonials-section"
        } `}
      >
        <h2 className="section-header">What our community has to say:</h2>
        <div className="testimonial-wrap">
          <OwlCarousel
            className="owl-theme"
            responsiveClass={true}
            responsive={OWLCAROSEL_RESPONSIVE_OPTIONS}
            items={3}
            loop
            margin={15}
            nav
            dots={false}
            lazyLoad={true}
            navClass="owl-prev owl-next"
          >
            {props.children}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
