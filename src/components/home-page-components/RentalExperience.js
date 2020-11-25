import React from "react";
import { Link } from "react-router-dom";
import { LazyImage } from "../comman";

const RentalExperience = () => {
  return (
    <section className="ryde-landing-features-section">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <h1 className="section-header">
              RYDE is redefining the car rental experience
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
            <div className="ryde-features-wrapper why-ryde">
              <div className="ryde-features-icon">
                <LazyImage src="/images/owner/why-ryde.svg" />
              </div>
              <div className="ryde-features-content">
                <h2>Frictionless</h2>
                <ul className="list-unstyled features-list">
                  <li>Eliminate paper work</li>
                  <li>No more waiting in lines with car delivery</li>
                  <li>Insurance coverage built in</li>
                </ul>
                <a href="https://rydecarshelp.zendesk.com/" target="_blank">Learn More</a>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
            <div className="ryde-features-wrapper safety-first">
              <div className="ryde-features-icon">
                <LazyImage src="/images/owner/safety-first.svg" />
              </div>
              <div className="ryde-features-content">
                <h2>Safe</h2>
                <ul className="list-unstyled features-list">
                  <li>Verified users & owners</li>
                  <li>In-person exchanges</li>
                  <li>Thousands of happy renters</li>
                </ul>
                <Link className="learn-more" to="/safety">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 why-ryde-outer">
            <div className="ryde-features-wrapper best-insurance">
              <div className="ryde-features-icon">
                <LazyImage src="/images/owner/best-insurance.svg" />
              </div>
              <div className="ryde-features-content">
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
      </div>
    </section>
  );
};

export default RentalExperience;
