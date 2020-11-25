import React, { Component } from "react";
import { Link } from "react-router-dom";
import Image from "react-shimmer";
import { LazyImage } from "../comman";

class MainFooter extends Component {
  render() {
    return (
      <div>
        {/* Footer - Start - Only for pages */}
        <footer className="footer-green">
          <div className="container">
            <div className="row">
              <div className="col-md-6 logo-section">
                <div className="row">
                  <div className="col-md-4">
                    <h5 className="footer-headers">Learn More</h5>
                  </div>
                </div>
                <div className="footer_nav">
                  <span className="footer-link">
                    <Link to="/about-us">What is Ryde</Link>
                  </span>
                  <span className="footer-link">
                    <a href="https://rydecarshelp.zendesk.com/hc/en-us/articles/360038070452-Listing-your-car" target="_blank">List Your Car</a>
                  </span>

                  <span className="footer-link">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                  </span>
                  <span className="footer-link">
                    <Link to="/terms-and-conditions">Terms of Service</Link>
                  </span>
                  <span className="footer-link">
                    <Link to="/safety">Safety</Link>
                  </span>
                  <span className="footer-link">
                    <a href="https://rydecarshelp.zendesk.com/" target="_blank">FAQ</a>
                  </span>
                  <span className="footer-link">
                    <Link to="/my-profile/support-center">Support Connect</Link>
                  </span>
                  <span className="footer-link">
                    <Link to="/contact-us">Contact Us</Link>
                  </span>
                  {/* <span className="footer-link">
                    <Link to="/gift-cards">Gift Cards</Link>
                  </span> */}
                </div>
              </div>
              <div className="col-sm-6 col-md-3 footer_nav footer-top-cities">
                <h5 className="footer-headers">Top cities</h5>
                <span className="footer-link">
                  <Link to={"/car-rentals/los-angeles"}>Los Angeles</Link>
                </span>
                <span className="footer-link">
                  <Link to={"/car-rentals/san-diego"}>San Diego</Link>
                </span>
                <span className="footer-link">
                  <Link to={"/car-rentals/san-francisco"}>San Francisco</Link>
                </span>
                <span className="footer-link">
                  <Link to={"/car-rentals/miami"}>Miami</Link>
                </span>
              </div>
              <div className="col-sm-6 col-md-3 social-icons-sec clearfix">
                <h5 className="footer-headers">CONNECT WITH US</h5>
                <div className="">
                  <div className="social-icons-panel">
                    <span className="social-icons">
                      <a
                        target="_blank"
                        href="https://www.facebook.com/rydehq/"
                      >
                        <span className="icon-facebook-letter-logo" />
                      </a>
                    </span>
                    <span className="social-icons">
                      <a target="_blank" href="https://twitter.com/ryde_hq">
                        <span className="icon-twitter-logo" />
                      </a>
                    </span>
                    <span className="social-icons">
                      <a
                        target="_blank"
                        href="https://www.instagram.com/rydehq/"
                      >
                        <span className="icon-instagram-logo" />
                      </a>
                    </span>
                    <span className="social-icons">
                      <a
                        target="_blank"
                        href="https://www.linkedin.com/company/rydehq/"
                      >
                        <span className="icon-linkedin-logo" />
                      </a>
                    </span>
                  </div>
                </div>
                <div className="footer-call-us">
                  <h5 className="footer-headers">CALL US</h5>
                  <a href="tel:+18004184930">1-800-418-4930</a>
                  <p>8 am - 5 pm PST (Monday - Friday)</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 download-text download-text-wrapper">
                <h5 className="footer-headers">Get RYDE on mobile</h5>
                <span>
                  <a
                    target="_blank"
                    className="app-links"
                    href="https://play.google.com/store/apps/details?id=com.ryde.app"
                  >
                    <LazyImage
                      alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                      src="https://cdn.rydecars.com/static-images/playstore_icon.png"
                    />
                    {/* <SimpleImg
                      alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                      src="https://cdn.rydecars.com/static-images/playstore_icon.png"
                    /> */}
                  </a>{" "}
                </span>
                <span>
                  <a
                    target="_blank"
                    className="app-links"
                    href="https://itunes.apple.com/us/app/rydeapp/id1316990341?ls=1&mt=8"
                  >
                    <LazyImage
                      alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                      src="https://cdn.rydecars.com/static-images/appstore.png"
                    />
                    {/* <SimpleImg
                      alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                      src="https://cdn.rydecars.com/static-images/appstore.png"
                    /> */}
                  </a>{" "}
                </span>
              </div>
            </div>
            <hr />
            <div className="row copyrights">
              <div className="col-sm-8 col-md-8">
                <p className="white">
                  © Copyright {new Date().getFullYear()}
                  {""}
                  <span className="textBold"> RYDE Inc.</span> All rights
                  reserved.
                </p>
              </div>
              <div className="col-sm-4 col-md-4">
                <div className="country-wrap" style={{ textAlign: "right" }}>
                  <LazyImage
                    src="https://cdn.rydecars.com/static-images/united-states-circle-512.png"
                    width={25}
                    height={25}
                    style={{ objectFit: "cover" }}
                  />
                  {/* <SimpleImg
                      src="https://cdn.rydecars.com/static-images/united-states-circle-512.png"
                      width={25}
                      height={25}
                      style={{ objectFit: "cover" }}
                    /> */}
                  <font className="white"> &nbsp;United States</font>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* Footer - End - Only for pages */}
      </div>
    );
  }
}
export default MainFooter;