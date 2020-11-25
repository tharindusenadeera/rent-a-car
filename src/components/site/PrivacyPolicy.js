import React, { Fragment, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import MainNav from "../../components/layouts/MainNav";
import Helmet from "react-helmet";
import PreLoader from "../preloaders/preloaders";

const MainFooter = lazy(() => import("../../components/layouts/MainFooter"));
const PrivacyPolicy = () => (
  <Fragment>
    <Helmet
      title="Privacy Policy | RYDE"
      meta={[
        {
          name: "description",
          content: "Privacy Policy."
        }
      ]}
    />
    <MainNav />
    <div className="container how-works-page">
      <h1>PRIVACY POLICY</h1>
      <br />

      <div className="row ">
        <div className="col-md-12">
          <div className="text-wrap">
            <p>
              “Agreement” shall mean this End-User Agreement and all terms
              contained herein and any modifications, revisions implemented;{" "}
              <br />
              <br />
              “ RYDE” shall mean Ryde Rent A Car LLC;
              <br />
              <br />
              “Company” shall mean Ryde Rent A Car LLC;
              <br />
              <br />
              “Owner” shall mean the owner of the vehicle that is to be rented;
              <br />
              <br />
              <br />
              “Party”, “Parties” shall mean Company, Owner, Renter and their
              Agents, officers, employees, representatives, or attorneys;
              <br />
              <br />
              “Renter” shall mean the person renting the vehicle;
              <br />
              <br />
              “Services” shall mean the services that Company offers per the
              terms of this Agreement;
              <br />
              <br />
              “You”, “Your” shall mean to refer, when applicable, the Owner
              and/or Renter.
              <br />
              <br />
            </p>
            <h5 className="sub-headline">Information We collect </h5>
            <p>
              We may collect and hold personal information that is essential for
              the business, to keep the RYDE environment safe and secure. This
              includes identifying information such as name(individual), age,
              gender, telephone number and email address, plus banking/credit
              card information, driver’s license details, photographs of you
              (which you will need to submit as part of the online application
              process) and driving history.
              <br />
              If you register as an User, we will also collect details about
              your vehicle including registration details, make, model, color,
              year of manufacture, VIN as well as a record of any existing
              damage. As part of our service, we will collect necessary data to
              ease the processing of tolls and fuel expenses and will keep this
              information for a reasonable period of time.
              <br />
              This data will be retained for a reasonable period of time. <br />
              <br />
              <br />
              <br />
            </p>
            <h5 className="sub-headline">How we collect information.</h5>
            <p>
              We may collect your information in a number of ways, including:{" "}
              <br />
            </p>
            <ul>
              <li>
                {" "}
                directly from you (such as where you provide information to us
                when you visit our website, complete an application form or
                agreement for one of our services, or contact us with a query or
                request),{" "}
              </li>
              <li>
                {" "}
                from third parties such as credit reporting bodies (for more
                details see our Credit Reporting Policy below),
              </li>
              <li> from publicly available sources of information, or</li>
              <li> from our records of how you use our services. </li>
              <br />
              <br />
            </ul>
            <p>
              If you choose not to provide certain information about you, we may
              not be able to provide you with the <br />
              services you require or accept your application for membership.{" "}
              <br />
            </p>
            <h5 className="sub-headline">Payment and Deposits .</h5>
            <p>
              RYDE collects your personal payment information, including
              information stored on outside services that you may use within
              RYDE, such as payment gateways. By submitting your payment
              information and/or linking your RYDE account with an outside
              payment services, you authorize RYDE to access and use this
              information to provide you with and accept payment for the
              Service. This allows RYDE to keep a safe and secure environment
              for its users. Cancellation and refund policy; refer to{" "}
              <a href="https://rydecarshelp.zendesk.com/hc/en-us/articles/360038442451-Cancellation-Policy" target="_blank">cancellation policy .</a>
              <br />
            </p>
            <h5 className="sub-headline">Owner/ Renter Driving record </h5>
            <p>
              By registering with RYDE rent a car.llc you are agreeing/ giving
              authority to constantly monitor your driving record. RYDE rent a
              car.llc has authority to deactivate/remove any user from the
              marketplace if driving background is unclear, does not meet the
              user requirements. Refer to{" "}
              <Link to="/terms-and-conditions">user agreement</Link> for more
              details. <br />
            </p>
            <h5 className="sub-headline">
              Social Media and sharing your information{" "}
            </h5>
            <p>
              We, RYDE Rent a car.llc, RYDE will not sell any information for
              3rd party. We/RYDE will not share any your credit card/payment
              information with anybody unless applicable laws require/request us
              to do so. RYDE will not sell/share information with a 3rd party
              for their marketing purposes. We may communicate with you via
              email, SMS text, calls or other method. <br />
              By using the site and/or applying to become a member of RYDE Rent
              A car.llc, you consent to the collection and use of information as
              outlined in the above documentation. RYDE/ RYDE Rent a car.llc
              welcomes you to contact us if you have any questions regarding
              these matters. We availble for you 24*7 at support@rydecars.com
              <br />
            </p>
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>

    <Suspense fallback={<PreLoader />}>
      <MainFooter />
    </Suspense>
  </Fragment>
);

export default PrivacyPolicy;
