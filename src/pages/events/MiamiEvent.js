import React, { Component } from "react";
import MainNav from "../../components/layouts/MainNav";
import OwlCarousel from "react-owl-carousel";
import Rating from "react-rating";
import { Link } from "react-router";
import SharePage from "../../components/events/miyami-lonch/sharePage";
import RsvpForm from "../../components/rsvp-form";
import CountDown from "../../components/count-down";

const MiamiEvent = props => {
  let nevClass = "home-navigation";
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
    <div>
      <section className="hero-section">
        <div className="hero-event">
          <div className="home-main-menu">
            <MainNav cssClass={nevClass} />
          </div>
          <div className="hero-event-bg-content container">
            <div className="row">
              <div className="col-md-12">
                <div className="hero-event-inner">
                  <h1 className="hero-event-title-lg">Miami</h1>
                  <span className="hero-event-title-sm">
                    are you ready for us?
                  </span>
                  <p>
                    Join Ryde’s Miami Launch Party on November 29th, 2018 at
                    Venture Cafe Miami
                  </p>
                </div>
                <RsvpForm />
                <div className="limited-text">
                  Limited Availability - RSVP Required
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="countdown-section">
        <CountDown />
      </section>

      <section className="event-info-section">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-md-push-7">
              <div className="search-box-form-inline">
                <img
                  alt="Rent a car with Ryde"
                  className="find-ryde-icons hidden-xs"
                  src="https://cdn.rydecars.com/static-images/schedule-icon-green.svg"
                />
                <div className="when-wrap">
                  <div className="inner-text-sm">When</div>
                  <div className="inner-text-lg">
                    Thursday, November 29th, 2018 - 6 PM
                  </div>
                </div>
              </div>
              <div className="search-box-form-inline">
                <a href="https://goo.gl/maps/aFrt2ZrffDp" target="_blank">
                  <img
                    alt="Rent a car with Ryde"
                    className="find-ryde-icons hidden-xs"
                    src="https://cdn.rydecars.com/static-images/location-icon-green.svg"
                  />
                </a>
                <div className="when-wrap">
                  <div className="inner-text-sm">Where</div>
                  <div className="inner-text-lg">
                    <a href="https://goo.gl/maps/EofcmQPKwvP2" target="_blank">
                      1951 NW 7th Ave., Suite 600 Miami, Florida 33136
                    </a>
                  </div>
                </div>
              </div>
              <SharePage />
            </div>
            <div className="col-md-7 col-md-pull-5">
              <div className="event-about">
                <h2 className="section-header">About the event</h2>
                <p className="event-info">
                  Ryde is launching in Florida! Join the launch party at Venture
                  Cafe Miami #ThursdayGathering to celebrate with Ryde. As part
                  of the launch, Ryde is hosting an educational roundtable
                  discussion on the shared gig economy industry!
                </p>
                <p className="event-info">
                  Ryde is the Airbnb for cars, focusing on luxury, exotic and
                  curated car experiences.
                </p>
              </div>
              <div className="event-speakers">
                <h2 className="section-header">Prizes and Perks</h2>
                <p className="event-info">
                  <ul className="">
                    <li>FREE Rydes for luxury cars.</li>
                    <li>FREE Parking in the lot adjacent to the building.</li>
                    <li>
                      COMPLIMENTARY BEVERAGES - Veza Sur beer, wine and other
                      refreshments will be served!
                    </li>
                    <li>
                      FREE COWORKING starting at 4 PM in the Cafe Space on the
                      6th floor!
                    </li>
                  </ul>
                </p>
              </div>
              <div className="event-speakers">
                <h2 className="section-header">Speakers</h2>
                <p className="event-info">
                  Guests and Celebrities will be in attendance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap gray-bg cities-testimonials-section">
        <div className="container testimonials-section">
          <h2 className="section-header">
            <span className="textBold">What our community has to say:</span>
          </h2>
          <div className="testimonial-wrap">
            <OwlCarousel
              className="owl-theme"
              responsiveClass={true}
              responsive={citiesResponsiveOptions}
              items={3}
              loop
              margin={15}
              nav
              dots={false}
              items={3}
              lazyLoad={true}
              navClass="owl-prev owl-next"
            >
              <div className="item">
                <div className="media">
                  <div className="media-body">
                    <p className="writer-description">
                      Very helpful! Flexbile with timing. Easy and quick
                      communication made for an overall excellent experience. I
                      really recommend for anyone looking for an extraordinary
                      car in the city.
                    </p>
                    <div className="ct-user-rating">
                      <Rating
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        fractions={2}
                        initialRating={4}
                        readonly
                      />
                    </div>
                    <div className="ct-user-wrap">
                      <img
                        className="img-responsive img-circle testimonial-user"
                        src="https://rydecars.com/images/cities/joseph.jpg"
                      />
                      <div className="ct-user-inner-content">
                        <p className="writer">Joseph</p>
                        <div className="date-writer">Jun 17, 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="media">
                  <div className="media-body">
                    <p className="writer-description">
                      Very easy and affordable would definitely rent again
                    </p>
                    <div className="ct-user-rating">
                      <Rating
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        fractions={2}
                        initialRating={5}
                        readonly
                      />
                    </div>
                    <div className="ct-user-wrap">
                      <img
                        className="img-responsive img-circle testimonial-user"
                        src="https://rydecars.com/images/cities/camilla.jpg"
                      />
                      <div className="ct-user-inner-content">
                        <p className="writer">Camilla</p>
                        <div className="date-writer">Apr 02, 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="media">
                  <div className="media-body">
                    <p className="writer-description">
                      Excellent car. Loved it. Handles extremely well on the
                      road . Will use again for sure!!!!
                    </p>
                    <div className="ct-user-rating">
                      <Rating
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        fractions={2}
                        initialRating={4}
                        readonly
                      />
                    </div>
                    <div className="ct-user-wrap">
                      <img
                        className="img-responsive img-circle testimonial-user"
                        src="https://rydecars.com/images/cities/kim.jpg"
                      />
                      <div className="ct-user-inner-content">
                        <p className="writer">Kim</p>
                        <div className="date-writer">Jan 23, 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="media">
                  <div className="media-body">
                    <p className="writer-description">
                      Great rental, the car was clean and met my needs. The
                      pickup and drop off were both easy. I will defenitly rent
                      again.
                    </p>
                    <div className="ct-user-rating">
                      <Rating
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        fractions={2}
                        initialRating={4}
                        readonly
                      />
                    </div>
                    <div className="ct-user-wrap">
                      <img
                        className="img-responsive img-circle testimonial-user"
                        src="https://rydecars.com/images/cities/olivia.jpg"
                      />
                      <div className="ct-user-inner-content">
                        <p className="writer">Olivia</p>
                        <div className="date-writer">Feb 16, 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="media">
                  <div className="media-body">
                    <p className="writer-description">
                      Nice car, easy process! Even when i dropped off the car
                      later then scheduled, he handled it professionally. The
                      first site i am gonna check to see if available if i need
                      a ride to rent!
                    </p>
                    <div className="ct-user-rating">
                      <Rating
                        emptySymbol="fa fa-star-o"
                        fullSymbol="fa fa-star"
                        fractions={2}
                        initialRating={5}
                        readonly
                      />
                    </div>
                    <div className="ct-user-wrap">
                      <img
                        className="img-responsive img-circle testimonial-user"
                        src="https://rydecars.com/images/cities/lucas.jpg"
                      />
                      <div className="ct-user-inner-content">
                        <p className="writer">Lucas</p>
                        <div className="date-writer">Mar 14, 2018</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
      </section>

      <section className="ryde-landing-features-section">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1 className="section-header">
                <span className="textBold">
                  RYDE is redefining the car rental experience
                </span>
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
              <div className="ryde-features-wrapper why-ryde">
                <h2>Frictionless</h2>
                <ul className="list-unstyled features-list">
                  <li>Eliminate paper work</li>
                  <li>No more waiting in lines with car delivery</li>
                  <li>Insurance coverage built in</li>
                </ul>
                {/* <Link className="learn-more" to="/how-to-use/index/1">
                  Learn More
                </Link> */}
                <a href="https://rydecarshelp.zendesk.com/" target="_blank">Learn More</a>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
              <div className="ryde-features-wrapper safety-first">
                <h2>Safe</h2>
                <ul className="list-unstyled features-list">
                  <li>Verified users & owners</li>
                  <li>In-person exchanges</li>
                  <li>Thousands of happy renters</li>
                </ul>
                {/* <Link className="learn-more" to="/safety">
                  Learn More
                </Link> */}
                <a href="https://rydecarshelp.zendesk.com/" target="_blank">Learn More</a>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
              <div className="ryde-features-wrapper best-insurance">
                <h2>Flexible</h2>
                <ul className="list-unstyled features-list">
                  <li>Choose the EXACT vehicle you want, when you want</li>
                  <li>Available economy and luxury cars</li>
                  <li>App or mobile/desktop sites</li>
                </ul>
                <Link className="learn-more" to="/safety/index/1">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MiamiEvent;
