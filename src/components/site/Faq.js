import React, { Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import InnerpageHeader from "../layouts/InnerPageHeader";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";

const Faq = () => (
  <Fragment>
    <MainNav />
    <InnerpageHeader header="FAQ" title="" />
    <div className="container faq-page">
      <div className="row">
        <div className="col-sm-12">
          <h1 className="innerpage-headline">FAQ</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Tabs className="faq-tab">
            <TabList>
              <Tab>CAR RENTERS</Tab>
              <Tab>CAR OWNERS</Tab>
              <Tab>COMMON QUESTIONS</Tab>
            </TabList>

            <TabPanel>
              <ul className="faq-list">
                <li>Do I need my own insurance?</li>
                <li />
              </ul>
            </TabPanel>
            {/*// listing ryde content///////////////////////////////////////////// */}
            <TabPanel>
              <div className="text-wrap">
                <h5 className="sub-headline">List your Ryde</h5>
                <p>
                  Click on “List your ryde” and Sign up with your Facebook,
                  Google or email. Finish listing your ryde is 5 simple steps:
                  car description, specs, photos, your information and
                  availability or preferences for your listing. Set up your
                  calendar and your price.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Insure your Ryde</h5>
                <p>
                  You have the control over how much you want to earn by
                  providing your own commercial auto insurance or choosing one
                  of the coverage options we provide.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Respond to Bookings</h5>
                <p>
                  You will get booking requests shortly after you list, make
                  sure to respond as quickly as possible. You can either accept
                  or reject the booking. You can coordinate pick up or drop off
                  times and location with your renter. Confirm your bookings.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Hand over your Ryde</h5>
                <p>
                  If you are dropping off your ryde, be on time and confirm drop
                  off location. If your ryde is being picked up by the renter,
                  have your ryde ready for pick up. Inspect your car, snap a
                  picture of car meter, fill up gas and clean your ryde for your
                  renter. Meet and greet your renter, check their license and
                  hand over the keys.
                </p>
                <p>
                  If our provided chauffer is requested and coming to pick up
                  your ryde, confirm chauffer’s identity, take a look at his
                  Driver license and match his profile with the one we provide
                  you.{" "}
                </p>
                <p>
                  Tell us that your ryde is off with renter or chauffer by going
                  on the app or website and clicking on “Start trip”. Renter or
                  chauffer can confirm through their profile that trip has
                  started.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Earn with your Ryde</h5>
                <p>
                  As your ryde is out there making you money, you can sip on
                  mojitos knowing that we got your ryde covered. Your vehicle is
                  insured and watched over by our team.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Get your ryde back</h5>
                <p>
                  Near the end of trip, we will send you and the renter
                  reminders to return the vehicle on time. When renter or
                  chauffer returns your ryde, inspect your vehicle inside and
                  out, check its meter, check gas, if everything looks good take
                  back your keys and prepare for your next booking. Rate and
                  review your renter to help us get you only the best renters.
                </p>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="text-wrap">
                <p>
                  Renter or Owner may cancel the trip via Website, Apps or
                  contacting RYDE support. Once the trip is cancelled it is
                  effective immediately. Refund depends on which time frame
                  owner, renter cancelled the trip. If Renter canceled the trip
                  before trip start, renter is fully entitled for full refund of{" "}
                  <b>
                    delivery fee and other fees may have included in the
                    reservation
                  </b>
                  . Owners are to accommodate renters with the car for the price
                  they agreed to. Failing to accommodation will be result of
                  deactivating user account from the market place. Trip(amount
                  paid for the daily rental) refund as follows
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Renter- </h5>
                <p>
                  If Renter cancels the trip before 24( twenty four) hours its
                  start renter is eligible for full refund.
                  <br />
                  <br />
                  If Renter cancels the trip 1(one) hour after the booking is
                  made and booking starts within 24 hours, renter is not
                  entitled for the refund.
                </p>
              </div>
              <div className="text-wrap">
                <h5 className="sub-headline">Owner-</h5>
                <p>
                  If owner cancels 24( twenty four) hours before trip start,
                  owner will not be charged a cancellation fee, renter will get
                  the full refund.
                  <br />
                  <br />
                  If owner cancels 6(six) hours before trip start, renter will
                  get the full refund and owner will be charged inconvenience
                  fee of 50.00 (fifty) USD.
                  <br />
                  <br />
                  Owners who cancels repeatedly may get removed from the market
                  place.
                </p>
                <br />
                <br />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
    <MainFooter />
  </Fragment>
);

export default Faq;
