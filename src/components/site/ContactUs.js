import React, { Fragment } from "react";
import InnerpageHeader from "../layouts/InnerPageHeader";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import MainNav from "./../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";

const ContactUs = () => (
  <Fragment>
    <Helmet
      title="Contact Us | RYDE"
      meta={[
        {
          name: "description",
          content: "Questions or concerns? Contact us here."
        }
      ]}
    />
    <MainNav />
    <InnerpageHeader header="Contact Us" title="" />
    <div className="container contact-page">
      <div className="row">
        <div className="col-md-4">
          <div className="media">
            <div className="media-left media-top">
              <img className="media-object" src="images/pobox.png" alt="..." />
            </div>
            <div className="media-body">
              <h4 className="media-heading">Address</h4>
              <h3>
                <a href="https://goo.gl/maps/nV4C6XBgZH12">
                  <strong>RYDE</strong> <br />
                  5757 W Century Blvd <br />
                  7th floor <br />
                  Los Angeles CA 90045
                </a>
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="media">
            <div className="media-left media-top">
              <img className="media-object" src="images/phone.png" alt="..." />
            </div>
            <div className="media-body">
              <h4 className="media-heading">Call Us</h4>
              <h3>
                <a href="tel:1-800-418-4930">1-800-418-4930</a>
              </h3>
              <p>8 am - 5 pm PST (Monday - Friday)</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="media">
            <div className="media-left media-top">
              <img
                className="media-object"
                src="images/envelope.png"
                alt="..."
              />
            </div>
            <div className="media-body">
              <h4 className="media-heading">Email Us</h4>
              <h3>
                <a href="mailto:support@rydecars.com">support@rydecars.com</a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MainFooter />
  </Fragment>
);

export default ContactUs;
