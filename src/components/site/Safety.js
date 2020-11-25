import React, { Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import Helmet from "react-helmet";

const Safety = props => {
  return (
    <Fragment>
      <Helmet
        title="Safety | RYDE"
        meta={[
          {
            name: "description",
            content: "Safety."
          }
        ]}
      />
      <MainNav />
      <div className="container how-works-page">
        <h1 className="innerpage-headline">
          Trust &amp; Safety: Insurance included with every rental
        </h1>
        <br />
        <div className="row">
          <div className="col-md-12">
            <Tabs
              className="profile-tab"
              onSelect={index => {
                props.history.push(`/safety/index/${index}`);
              }}
              selectedIndex={
                props.match.params.index
                  ? parseInt(props.match.params.index)
                  : 0
              }
            >
              <TabList>
                <Tab>Safety</Tab>
                <Tab>Car Coverage</Tab>
              </TabList>
              {/*// safety///////////////////////////////////////////// */}
              <TabPanel>
                <h5 className="sub-headline">Peace of mind with RYDE</h5>
                <p>
                  Worried about insurance? We have you covered! Our renters and
                  vehicles are automatically covered by our insurance policy
                  during every trip. Our policy includes comprehensive,
                  collision and liability coverage (with uninsured motorist
                  protection) up to $1,000,000 and is administered by
                  <a target="_blank" href="https://www.assurant.com/">
                    {" "}
                    <b>Assurant</b>
                  </a>
                </p>
                <p>
                  Your personal safety and the safety of our host’s cars is our
                  top priority.{" "}
                </p>
                <br />

                <h5 className="sub-headline">Renters</h5>
                <ul>
                  <li>
                    Choose your insurance plan for physical damage and liability
                    during our checkout process.
                  </li>
                  <li>
                    All our hosts are screened before they can make their
                    vehicle available on the platform.
                  </li>
                  <li>
                    Roadside assistance and emergency support are included for
                    every rental.
                  </li>
                </ul>
                <br />

                <h5 className="sub-headline">Hosts</h5>
                <ul>
                  <li>
                    Your vehicle is protected by our commercial insurance policy
                    for up to $130,000 in physical damage coverage and
                    $1,000,000 in liability coverage.
                  </li>
                  <li>
                    All our renters are screened (background &amp; DMV checks)
                    by our support team before they can book a vehicle.
                  </li>
                  <li>
                    Our premier customer team is available to help you be
                    successful on our platform.
                  </li>
                </ul>
                <p>
                  Our customer support team is available 8 am - 5 pm Pacific
                  Time (Monday - Friday). If you have any questions or concerns,
                  reach out to us right away at support@rydecars.com. We’re here
                  for you!
                </p>
                <br />

                {/* <h5 className="sub-headline">Help us keep you safe!</h5>
                  <p>Please take your time to review different profiles of renters and hosts before making a booking.</p>
                  <p>Always rate and review your host or renter so we can keep our community current and updated.</p>
                  <p>Do not share any personal information over our platform. We will share your contact information with respective hosts and renters when trip is confirmed.</p>
                  <p>Our community is built on mutual respect, love and care. So be kind and respectful towards all renters and hosts that you come across.
                  You can report any issues to us and we will take action promptly to insure our marketplace is safe and secure.</p> */}
                <br />

                {/* <h5 className="sub-headline">Vehicle Protection </h5>
                  <div className="row">
                    <div className="col-md-2">
                      <p className="pull-right"><b>Provided via</b></p>
                    </div>
                    <div className="col-md-2">
                      <span className="pull-left"><img className="img-responsive" src="https://cdn.rydecars.com/Eranda/assurant-logo%402x.png" /></span>
                    </div>
                  </div> */}
              </TabPanel>
              {/*// car coverage///////////////////////////////////////////// */}
              <TabPanel>
                <h5 className="sub-headline">
                  Peace of mind &amp; Carsharing.
                </h5>
                <p>
                  At RYDE, we understand just how important insurance coverage
                  is to all parties involved in a vehicle rental agreement.
                  Therefore, we are pleased to offer an auto insurance coverage
                  package to vehicle owners and renters who meet our eligibility
                  requirements for every trip booked on our platform.
                </p>
                <br />

                <h5 className="sub-headline">
                  Who is the RYDE contracted auto insurance carrier?
                </h5>
                <p>
                  We have partnered with Assurant Inc., an A-rated insurance
                  company, to provide coverage to our vehicle owners and
                  renters. Coverage complies with or exceeds the state minimum
                  coverage limit requirements of each state in which we operate.
                </p>
                <br />

                <h5 className="sub-headline">Coverage - renters:</h5>
                {/* <p>The Ryde insurance coverage package includes:</p> */}
                <ul>
                  <li>
                    <p>
                      <b>Liability Coverage:</b> Insured renters have personal
                      liability coverage up to $105,000 (Combined Single Limit)
                      when they are operating a vehicle in California, and up to
                      the minimum required limits in all other states. In case
                      of damage by the renter, the deductible owned by renters
                      is $750 for an economy car and $2000 for luxury cars.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Physical Damage Coverage:</b> Physical damage coverage
                      protects the owner’s vehicle in the event of an accident
                      up to the actual cash value of the vehicle.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Uninsured and Under-Insured (UI/UM):</b> UI/UM coverage
                      at the state-required minimum limits.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Personal Injury Protection (PIP):</b> PIP, where
                      required, is provided at state-required minimum limits.
                    </p>
                  </li>
                </ul>
                <br />

                <h5 className="sub-headline">When is my vehicle covered?</h5>
                <p>
                  The coverage is active throughout the period of time that your
                  rental is active and the vehicle is being shared between a
                  renter and host. From the moment the keys are turned over to
                  the renter, until the end of the rental period, coverage
                  applies.
                </p>
                <br />

                <h5 className="sub-headline">
                  Exclusions to the RYDE auto insurance policy
                </h5>

                <ol>
                  <li>
                    <p>
                      <b>Owner operation of the vehicle:</b> coverage is only
                      provided when a car is shared in a peer-to-peer
                      transaction. When a vehicle is operated by the hosts,
                      there is no coverage under the RYDE insurance coverage
                      package.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Wear and tear:</b> Vehicle “wear and tear” is not
                      covered. If a renter causes excessive wear and tear to a
                      car, he or she will not be responsible for such excessive
                      wear and tear less than 2 inches.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Personal Belongings:</b> Personal belongings left in
                      the car are not insured. These include tapes, records,
                      discs or other similar audio, visual or data electronic
                      devices. It is the responsibility of both the owner and
                      the renter to ensure they remove any personal belongings
                      from the car before and after each rental period.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>No Permissive Drivers:</b> As per RYDE’s Terms of
                      Service, cars may only be operated by the renter who
                      booked the car. No coverage is provided for permissive
                      drivers.
                    </p>
                  </li>
                  <li>
                    <p>
                      <b>Personal Usage Only:</b> Insurance coverage applies to
                      vehicles being used for personal use only. Coverage is not
                      provided when vehicles are used for commercial purposes
                      (such as commercial deliveries or commercial
                      ride-sharing), organized racing, or stunting activity.
                    </p>
                  </li>
                </ol>
                <p>
                  This list of exclusions is not exhaustive. The terms and
                  conditions of the actual insurance policy will apply in all
                  circumstances. We encourage our owners, renters, and
                  prospective clients to learn more about the RYDE insurance
                  coverage, including its terms, limitations, and exclusions, by
                  visiting our website or by calling our customer service agents
                  who are here to assist you every step of the way.
                </p>
                <br />

                <h5 className="sub-headline">Reporting incidents</h5>
                <p>
                  It is our policy that any accidents or damage to a vehicle
                  must be reported within 24 hours of the occurrence.
                </p>
                <br />
                <br />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
      <MainFooter />
    </Fragment>
  );
};
export default withRouter(Safety);
