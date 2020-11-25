import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Helmet from "react-helmet";
import { getReferralAmount } from "../../actions/PromotionAction";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import { Tabs } from "antd";
import "antd/lib/tabs/style/index.css";

const TabPane = Tabs.TabPane;
class HowToUse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "1",
      mode: "top"
    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.getDefaltActivationKey();
    //this.focusDiv();
    dispatch(getReferralAmount());
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (match.params.tab != prevProps.match.params.tab) {
      this.getDefaltActivationKey();
    }
  }

  navigateTabs(index) {
    this.props.history.push(`/how-to-use/index/${index}`);
    this.focusDiv();
  }

  focusDiv() {
    window.scrollTo(0, 0);
  }

  getDefaltActivationKey = () => {
    const { match } = this.props;

    switch (match.params.tab) {
      case "renting":
        return this.setState({ activeKey: "1" });
      case "list":
        return this.setState({ activeKey: "2" });
      case "policy":
        return this.setState({ activeKey: "3" });
      case "faq-center":
        return this.setState({ activeKey: "4" });
      case "loyalty":
        return this.setState({ activeKey: "5" });
      default:
        return this.setState({ activeKey: "1" });
    }
  };

  handleTabClick(tabKey) {
    switch (tabKey) {
      case "1":
        return this.props.history.push("/how-to-use/renting");
      case "2":
        return this.props.history.push("/how-to-use/list");
      case "3":
        return this.props.history.push("/how-to-use/policy");
      case "4":
        return this.props.history.push("/how-to-use/faq-center");
      case "5":
        return this.props.history.push("/how-to-use/loyalty");
      default:
        return this.props.history.push("/how-to-use/renting");
    }
  }

  render() {
    const { referralData } = this.props;

    const { mode } = this.state;
    return (
      <Fragment>
        <Helmet
          title="How It Works | RYDE"
          meta={[
            {
              name: "description",
              content:
                "How does RYDE work? Whether you're a renter or an owner, we'll get your questions answered and tell you everything you need to know here."
            }
          ]}
        />
        <MainNav />
        <div ref="theDiv" className="container how-works-page">
          <h1 className="innerpage-headline">How RYDE works</h1>
          <div className="row">
            <div className="col-md-12 Prof_topmenu">
              <Tabs
                //defaultActiveKey="1"
                activeKey={this.state.activeKey}
                onChange={e => {
                  this.setState({
                    activeKey: e
                  });
                }}
                onTabClick={key => this.handleTabClick(key)}
                tabPosition={mode}
                className="how-works-tab"
              >
                <TabPane
                  tab={
                    <div className="tab-not-dot-wrapper">
                      <span>Renting a RYDE</span>
                    </div>
                  }
                  key="1"
                >
                  <div className="text-wrap">
                    <h5 className="sub-headline">Sign Up</h5>
                    <p>
                      <a target="_blank" href="https://rydecars.com/signup">
                        <b>Sign up</b>
                      </a>{" "}
                      with your email, Facebook, or Google account to get
                      started. You will receive, via text message and email, a
                      confirmation email from us. Upon successful verification,
                      we will ask you to update your information (including your
                      driver’s license). After this, you’re all set. Now you can
                      schedule and book a vehicle on our website or right from
                      your phone.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Searching the perfect car</h5>
                    <p>
                      Enter your location and date for your trip your travel in
                      the search back to browse all the options available in
                      your area.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Book your trip</h5>
                    <p>
                      Once you find the vehicle that works for you, click on
                      “Request Booking”. Your host will then respond, either
                      accepting or declining your booking.
                    </p>
                    <p>
                      In addition to the ease and convenience we provide, you’ll
                      also have peace of mind, knowing that our rental rates are
                      on average 40% lower than standard car rental companies.
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">Customize your trip</h5>
                    <p>
                      We allow you to fully customize your experience with
                      additional services. Request your host to deliver the
                      vehicle to a location of your choosing, for added
                      convenience.
                    </p>
                    {/* <p>
                      In addition to the ease and convenience RYDE provides,
                      you’ll also have peace of mind, knowing that our rental
                      rates are on average 55% lower than standard car rental
                      companies.
                    </p> */}
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Vehicle pick-up</h5>
                    <p>
                      <b>Step 1:</b> Each host will arrange pick-up and drop off
                      locations with the renter.
                      <br />
                      <br /> <b>Step 2:</b> Meet the host in-person and get
                      possession of the vehicle and keys.
                      <br />
                      <br /> <b>Step 3:</b> Show your driver’s license to the
                      host. They may wish to have a copy for the duration of the
                      booked trip.
                      <br />
                      <br /> <b>Step 4:</b> Photograph the odometer and upload
                      the mileage directly to the Ryde mobile application.
                      <br />
                      <br /> <b>Step 5:</b> Perform a thorough walk-around of
                      the vehicle with the host, paying close attention to the
                      condition of the car for any dings or dents. If any
                      defects are found, take pictures before assuming
                      possession of the vehicle.
                      <br />
                      <br /> <b>Step 6:</b> Hit the road. It’s time to start
                      making memories!
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Vehicle return</h5>
                    <p>
                      At the end of your trip please be sure to return the
                      vehicle in excellent condition, just the way it was handed
                      over to you.
                      <br />
                      <br /> We request that you return your car with the gas
                      tank filled to the same level as when you received it. In
                      almost all circumstances this should be a full tank.
                      <br />
                      <br /> Inspect the vehicle inside and out to make sure it
                      is clear of any of your personal items.
                      <br />
                      <br /> Return the vehicle to the host at the rental end
                      time or before rental end time at the agreed-upon place.
                      Make sure you only return the keys to the host, the same
                      person who gave you the keys.
                      <br />
                      <br /> Your host will rate you on how well you took care
                      of their car. Maintaining high ratings as a preferred
                      renter allows you to rent at discounted prices in the
                      future. You can rate the host as well.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Share your vehicle</h5>
                    <p>
                      Now that you’ve enjoyed RYDE, share the memories and
                      experience. Please review our service and your vehicle
                      host on our app or website at the end of the trip. If you
                      took pictures we’d love it if you would share them on our
                      social media page (
                      <a
                        target="_blank"
                        href="https://www.facebook.com/rydehq/"
                      >
                        <b>Facebook</b>
                      </a>
                      ,{" "}
                      <a target="_blank" href="https://twitter.com/ryde_hq">
                        <b>Twitter</b>
                      </a>
                      ).
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Other policies &amp; questions
                    </h5>
                    <p>
                      Please consult our FAQ for additional information and
                      requirements about renting a vehicle with RYDE.
                    </p>
                  </div>
                  <br />
                </TabPane>
                <TabPane
                  tab={
                    <div className="tab-not-dot-wrapper">
                      <span>Listing your car</span>
                    </div>
                  }
                  key="2"
                >
                  <div className="text-wrap">
                    <h5 className="sub-headline">Listing your car</h5>
                    <p>
                      As a RYDE host, you can increase your monthly income by
                      listing your vehicle for rental, using our website or
                      mobile app. Your car works for you.
                    </p>
                    <p>
                      To list your vehicle, simply click on “List your car” and
                      sign up with your email address, Facebook or Google.
                      Listing is a simple 3-step process:
                    </p>
                    <p>
                      <b>1.</b> Provide your vehicle details.
                    </p>
                    <p>
                      <b>2.</b> Add specs &amp; description
                    </p>
                    <p>
                      <b>3.</b> Upload Photos.
                    </p>
                    <p>
                      As the owner of the vehicle, you have the freedom to
                      determine the availability of your vehicle as well as the
                      listing price of your vehicle per day.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Insurance with RYDE</h5>
                    <p>
                      You have the choice of providing your own auto insurance
                      or choosing one of our coverage plans.
                    </p>
                    <p>
                      Please read about our insurance coverage plans
                      <Link to="/safety/index/1">
                        {" "}
                        <b>here.</b>
                      </Link>{" "}
                      Our team is always available{" "}
                      <Link to="/contact-us">
                        {" "}
                        <b>here</b>
                      </Link>{" "}
                      to answer any questions regarding the detailed coverage
                      plans that we provide.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Respond to Bookings</h5>
                    <p>
                      You will begin to receive reservation requests shortly
                      after you list your vehicle. Please be sure to respond as
                      quickly as possible. A swift response will reward you with
                      more bookings, as renters usually explore multiple
                      vehicles simultaneously. You are free to accept or decline
                      any booking request. It’s your car and we want you to feel
                      comfortable putting it in someone else’s hands.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Delivery</h5>
                    <p>
                      Upon accepting a rental request, you can coordinate the
                      vehicle pickup and drop off times as well as the location
                      with your renter. Our messaging board makes this process
                      clear and easy. If you are dropping off your vehicle, be
                      sure to arrive at the agreed-upon time &amp; location with
                      your renter. For a better review and improved customer
                      service, we recommend being at the delivery location 5 to
                      10 minutes early. If your car is being picked up by the
                      renter, make sure you are at the pickup location at the
                      agreed-upon time.
                    </p>
                    <p>
                      In either situation, have the vehicle prepared and ready
                      for delivery. Inspect your car, snap a picture of the
                      odometer for your records, fill up the gas tank and clean
                      your vehicle to make it shine!
                    </p>
                    <p>
                      Meet and greet your renter in a professional and friendly
                      manner, check their license, perform a walk-around
                      inspection with them, then hand over the keys.
                    </p>
                    <p>
                      Please inform us that the renter has taken possession of
                      your vehicle by uploading photos of the odometer and
                      starting the trip on the website, or mobile app.
                      Similarly, the vehicle renter will confirm through their
                      profile that the trip has begun. If the trip is canceled
                      before the start time, do not move forward with the
                      reservation.
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">Getting your vehicle back</h5>
                    <p>
                      Prior to the end of the trip, we will send a reminder to
                      you and your renter to return the vehicle on time.
                    </p>
                    <p>
                      When the renter returns your car, inspect the vehicle
                      inside and out. Make sure it is in the same condition as
                      when you delivered it to the renter. Verify the gas tank
                      is full. If everything is satisfactory, reclaim your keys.
                    </p>
                    <p>
                      Rate and review your renter to help us guarantee that only
                      premier renters retain access to our services. If your
                      renter has gone over the agreed-upon mileage or has not
                      refueled your car then make them aware of this and first
                      try to solve the problem of extra fees with them directly.
                      If you cannot come to a resolution with the renter,
                      contact us and we will resolve the issue and reimburse
                      you.
                    </p>
                  </div>

                  {/* <div className="text-wrap">
                    <h5 className="sub-headline">Earnings</h5>
                    <p>
                      You will earn 80% of your listed price. Your payout will
                      be via direct deposit within 5 business days of the
                      rental.
                    </p>
                  </div> */}
                  <div className="text-wrap">
                    <h5 className="sub-headline">Vehicle Eligibility</h5>
                    <p>
                      Vehicles on RYDE needs to be in standard driving
                      conditions with valid registration from the vehicle
                      registered state.
                    </p>
                    <p>
                      When you list a vehicle as a host you are required to
                      certify that car is in good driving condition to the
                      applicable law of the state. All cars must be less than
                      120,000 miles in order to be eligible for coverage. Cars
                      with over 120,000 miles are not eligible on the RYDE
                      platform and coverage will be denied if the host provides
                      fraudulent information at the time of listing.
                    </p>
                    <br />
                  </div>
                </TabPane>
                <TabPane
                  tab={
                    <div className="tab-not-dot-wrapper">
                      <span>Cancellation Policy</span>
                    </div>
                  }
                  key="3"
                >
                  <div className="text-wrap">
                    <p>
                      Renters or hosts may cancel a booking through our website,
                      mobile app, or by contacting RYDE support directly
                      (support@rydecars.com). Once a trip is canceled, it is
                      effective immediately.
                    </p>
                    <p>
                      Funds are based on the original rental price agreement at
                      the time of booking. Hosts must agree to honor the
                      original rental price agreement at the time of booking.
                      Failure to agree to these terms will result in the
                      deactivation of a host's account from our marketplace. In
                      addition, penalty fees may be incurred as a result.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <p>
                      The specific cancellation conditions for both the renter
                      and vehicle host are as follows:
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Renter</h5>
                    <p />
                    <p>
                      Eligible for a Full Refund if the renter cancels the
                      booking 12 hours prior to the scheduled booking time.
                      Cancellations less than 12 hours before the trip starts
                      will not be entitled to a refund.
                    </p>
                    <p />
                    <p>
                      Please note that the service fee (5%) covering payment
                      processing fees is non-refundable.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Host</h5>
                    <p>
                      If the host cancels 6 hours before the start of a booked
                      trip, an inconvenience fee of $25.00 USD will be charged
                      to the host. A full refund will be issued to the renter.
                    </p>
                    <p>
                      On the spot cancellations by the host will be a $100 USD
                      fee and renters will receive a full refund.
                    </p>
                    <p>
                      As part of our effort to continuously provide stellar
                      service and convenience to our customers, vehicle owners
                      who repeatedly cancel reservations are subject to
                      suspension or the removal of their account from our
                      marketplace.
                    </p>
                  </div>
                  <br />
                </TabPane>
                <TabPane
                  tab={
                    <div className="tab-not-dot-wrapper">
                      <span>FAQ</span>
                    </div>
                  }
                  key="4"
                >
                  <div className="text-wrap">
                    <h5 className="sub-headline">What is RYDE?</h5>
                    <p>
                      RYDE is a carsharing platform where guests can book any
                      vehicle they want from a community of trusted hosts across
                      the US. Find out more in our{" "}
                      <Link to="/about-us">
                        <b>about us section.</b>
                      </Link>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What are the age and eligibility requirements to join?
                    </h5>
                    <p>
                      You must be 21 years old with an active, valid US driver’s
                      license.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">How do I join?</h5>
                    <p>
                      Download the mobile app or sign up on our website. Once
                      your registration is completed, you are set. You can
                      reserve a car immediately. In some circumstances, our
                      Trust &amp; Safety team might ask for extra documentation
                      from you.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h4>RYDE Rentals</h4>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How do I know that a car is available?
                    </h5>
                    <p>
                      A list of our available inventory is constantly available
                      24/7.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">How long can I book a car?</h5>
                    <p>
                      Most of our vehicles are available for short term or long
                      term (maximum 30 days) rentals. You will be able to choose
                      the dates that work best for you and the owner of the
                      vehicle will review and approve your dates.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How much mileage is included?
                    </h5>
                    <p>
                      Mileage is determined by each individual host and will be
                      shown on the listing page details.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What is the cancellation policy?
                    </h5>
                    <p>
                      See our cancellation policy
                      <Link to="/how-to-use/index/2">
                        {" "}
                        <b>here.</b>
                      </Link>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">How do I pay?</h5>
                    <p>
                      When you register with RYDE you will file a debit/credit
                      card as part of your profile. This card will be billed as
                      the method of payment each time you book a vehicle. You
                      will see a charge on your card from RYDE Inc. every time
                      you use the service.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How do I resolve a billing issue?
                    </h5>
                    <p>
                      Email us directly at <b>support@rydecars.com</b>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What types of cars do you offer?
                    </h5>
                    <p>
                      You name it and we most likely offer it. We offer a vast
                      selection to meet every occasion. Convertibles, Sedans,
                      Coupes, SUVs we have just about every vehicle you could
                      want.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">How do I get my keys?</h5>
                    <p>
                      They will be handed to you by the vehicle host themselves
                      upon pick-up.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if the car is damaged?
                    </h5>
                    <p>
                      Before you take possession of the vehicle, take a few
                      minutes to review it inside and out with the host. You
                      specifically want to look for any dents, scratches or
                      other physical damage. Take pictures and upload them to
                      the RYDE mobile app or website. If you have any additional
                      issues, please email us right away at{" "}
                      <b>support@rydecars.com.</b>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if the car is low on fuel or dirty?
                    </h5>
                    <p>
                      Let us know immediately. We will address any issues to the
                      host and make sure they are resolved.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Can I extend my rental beyond the original return date?
                    </h5>
                    <p>
                      Yes, you can. As long as the car is available, extensions
                      are possible. Please go to reservation details and edit
                      your dates.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Can I change where I return a vehicle after I’ve picked it
                      up?
                    </h5>
                    <p>
                      Yes, you can. Communicate with the owner. This may be
                      subject to an additional charge. Call us or edit it in
                      reservation details.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      If I return my vehicle early, do I get my money back?
                    </h5>
                    <p>
                      This is at the discretion of your car host. Please
                      communicate any changes in your trip to your host as soon
                      as possible.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How do I cancel my reservation?
                    </h5>
                    <p>
                      You will see a cancellation button in your booking. After
                      you pass the starting time you will have to contact us
                      directly to cancel the trip. This is subject to our
                      cancellation policy.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What about tolls or tickets?
                    </h5>
                    <p>
                      Renters, if you get a ticket while the vehicle is in your
                      possession, you are responsible to pay it yourself. Car
                      hosts, you have 21 days to request reimbursement for
                      tickets. (If the time exceeds 21 days please contact{" "}
                      <b>support@rydecars.com</b>) You also have the choice to
                      request reimbursement from the renter directly through the
                      app.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Do you offer car seats?</h5>
                    <p>
                      We do not offer car seats. If an individual owner has one
                      and feels comfortable letting you use it that is their
                      choice.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Can I take my pet in the vehicle?
                    </h5>
                    <p>
                      Pets are not allowed in vehicles and doing so will subject
                      the renter to fines and cleaning fees.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What about parking fees I incur while using the car?
                    </h5>
                    <p>You are responsible for parking fees.</p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What is the smoking policy?
                    </h5>
                    <p>
                      We enforce a strict no smoking policy in all vehicles.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What should I do if the car smells like smoke?
                    </h5>
                    <p>
                      If it smells like smoke when you get the car please let
                      the owner know. If you smoke inside the car you are
                      subject to a cleaning fee.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What do I do if there is an issue with the vehicle?
                    </h5>
                    <p>
                      Please contact the owner immediately. Send us an email as
                      well to <b>support@rydecars.com.</b>
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Can someone else drive during my reservation?
                    </h5>
                    <p>
                      No. The renter is the only person allowed to drive the
                      car.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Are there geographic restrictions where I can take a
                      vehicle?
                    </h5>
                    <p>
                      The vehicle must stay within the United States. Crossing
                      country borders is a strict violation of RYDE’s policies.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if I leave something behind in the car?
                    </h5>
                    <p>
                      Contact your car host and Ryde at{" "}
                      <b>support@rydecars.com.</b>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if I’m in an accident?
                    </h5>
                    <p>
                      Please exchange information with the other party. Your
                      insurance card can be found in the booking confirmation
                      email. As well as the glove compartment in the car.
                    </p>
                    <p>
                      Call the number on the insurance card and let us know the
                      accident details. We will take care of the claim from
                      there.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What happens if the car gets towed during my reservation?
                    </h5>
                    <p>
                      Please contact us at <b>1-800-418-4930</b> or{" "}
                      <b>support@rydecars.com.</b> You are responsible for
                      towing fees incurred.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How much gas should I fill the tank with before I return
                      the car?
                    </h5>
                    <p>
                      You must return the car with the same level of fuel that
                      you received it.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What happens if I return the car late?
                    </h5>
                    <p>
                      The renter is responsible for returning the car at the
                      pre-decided drop off time. Late returns of over 30 minutes
                      can be subject to a late fee of $20/hour, up to $75 or the
                      maximum daily price. This will be up to your host.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What happens if I return the Vehicle dirty or with low
                      fuel?
                    </h5>
                    <p>
                      Hosts can request reimbursement for missing gas and
                      cleaning fees at the renter’s expense. We encourage
                      renters to take photos of their RYDE upon receiving it and
                      when returning it to the host.
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if I go over the mileage?
                    </h5>
                    <p>
                      The owner will send us a request with applicable photos
                      and documentation. After we review the trip photos and
                      documents you’ll receive an email with our decision. Extra
                      mileage charge is $0.75 per mile and $3.00 for high-end
                      luxury cars up to 500 maximum miles.
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h4>Owners</h4>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What happens if the renter receives a ticket?
                    </h5>
                    <p>
                      The renter is responsible for any tickets/tolls received
                      during the time they have your vehicle. RYDE will ensure
                      owners are compensated in a timely manner. Please request
                      reimbursement through the app as soon as possible.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What happens to my car if it is stolen or damaged?
                    </h5>
                    <p>
                      Under any condition, your vehicle is covered. Please refer
                      to the{" "}
                      <Link to="/safety">
                        <b>safety page</b>
                      </Link>{" "}
                      for further details.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What is Ryde’s reimbursement process?
                    </h5>
                    <p>
                      We have several methods of reimbursement for your
                      convenience. There is a tool for owners on the app and
                      website. You can also contact us directly at
                      support@rydecars.com with the trip ID and relevant photos.
                      Our commitment is to reimburse owners within 12-24 hours.
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h4>Insurance and Damage</h4>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What is the insurance coverage?
                    </h5>
                    <p>
                      Please see all insurance information coverage{" "}
                      <Link to="/safety/index/1">
                        <b>here</b>
                      </Link>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h4>List your car and make money</h4>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">How do upload my vehicle?</h5>
                    <p>
                      Find all the information about listing your car{" "}
                      <Link to="/car-create">
                        <b>here</b>
                      </Link>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      Do you have a checklist for creating a post?
                    </h5>
                    <p>
                      We have included a checklist below.
                      <ul>
                        <li>
                          Basic information about your car, including year,
                          make, model, body style, and mileage.
                        </li>
                        <li>A list of standard and optional equipment.</li>
                        <li>
                          The best-selling points about your car, so you can
                          create a detailed description. The more info you
                          provide the easier it is to reach renters looking for
                          those options.
                        </li>
                        <li>Photos of your car.</li>
                      </ul>
                    </p>
                  </div>

                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      What if I do not have a digital camera?
                    </h5>
                    <p>
                      We offer a professional photography service. Contact us at{" "}
                      <b>1-800-418-4930.</b>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      How do I edit or remove my listing?
                    </h5>
                    <p>
                      You can log into your profile at any time to make
                      adjustments to your listing or delete it entirely.
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h4>Feedback</h4>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">
                      I have a great story that I’d like to share about Ryde,
                      who can I send it to?
                    </h5>
                    <p>
                      We love to hear your stories. Please write to us{" "}
                      <b>community@rydecars.com</b>
                    </p>
                  </div>
                  <div className="text-wrap">
                    <h5 className="sub-headline">Where do I report issues?</h5>
                    <p>
                      For all issues with our app, website or hosts, please
                      write to us at <b>support@rydecars.com.</b>
                    </p>
                  </div>
                  <br />
                </TabPane>
                <TabPane
                  tab={
                    <div className="tab-not-dot-wrapper">
                      <span>Loyalty Program</span>
                    </div>
                  }
                  key="5"
                >
                  <div className="text-wrap">
                    <h5 className="sub-headline">Loyalty Program</h5>
                    <p>
                      At RYDE we know that earning your loyalty is our utmost
                      priority. We want you to be an active part of our growing
                      community. Thus we offer a $
                      {referralData && Math.floor(referralData.referral_amount)}{" "}
                      credit for every referral you make and promotional credit
                      of {referralData && referralData.first_ryde_coupon_amount}{" "}
                      for first time users.{" "}
                    </p>
                  </div>
                  <br />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
        <MainFooter />
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  referralData: state.promotion.referralData
});
export default withRouter(connect(mapStateToProps)(HowToUse));
