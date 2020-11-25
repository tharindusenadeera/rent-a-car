import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { LazyImage } from "../comman";
import { log } from "util";
import queryString from "query-string";
import moment from "moment-timezone";

const RentCarLandingsection = props => {
  const {
    isLosAngeles,
    isSanDiego,
    isSanFrancisco,
    isMiami
  } = props.landingPageProps;

  const changeBackgroundClass = city => {
    if (city && city.isMiami) {
      return "miami-rent-car-section";
    }
    if (city && city.isLosAngeles) {
      return "losangeles-rent-car-section";
    }
    if (city && city.isSanDiego) {
      return "sandiego-rent-car-section";
    }
    if (city && city.isSanFrancisco) {
      return "sanfrancisco-rent-car-section";
    }
  };

  return (
    // <section className="ryde-section los-angeles-rent-car-section">
    <section
      className={`ryde-section ryde-cities-intro-section ${changeBackgroundClass(
        props.landingPageProps
      )}`}
    >
      <LazyImage src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/rent-car-cities-bg.jpg" />

      <div className="fixed-content-wrapper container">
        <div className="row">
          <div className="col-lg-7">
            <div className="ryde-inner-content">
              <h1>
                Rent a Car in {isLosAngeles && `Los Angeles`}
                {isSanDiego && `San Diego`}
                {isSanFrancisco && `San Francisco`}
                {isMiami && `Miami`},
                <span className="textNormal"> it’s easy.</span>
              </h1>
              <p className="lg-para">
                {isLosAngeles &&
                  `Get a RYDE peer-to-peer rental car the next time you’re in Los
                Angeles. Whether for a business trip to downtown LA or a drive
                down PCH through Santa Monica and Malibu, we’ve got you covered
                with the best cars for rent from trusted owners in our network.`}
                {isSanDiego &&
                  `Hit the beach, drive down the Pacific Coast Highway
                          and head out to San Diego’s Gaslamp Quarter with Ryde.
                          Arrange personalized drop off for your car and have it
                          ready when you are. Worry less about lines, paperwork
                          and insurance headaches and experience the best car
                          rental experience in California.`}
                {isSanFrancisco &&
                  `Skip the lines at the rental counter and opt for
                          Ryde’s smooth rental experience the next time you’re
                          in the San Francisco Bay Area. Our peer-to-peer car
                          rental marketplace covers SFO and other area airports
                          like OAK and SJC. Conveniently have your rental car
                          waiting at the airport, grab the keys and be on your
                          way.`}
                {isMiami &&
                  `Cruise up and down Miami Beach's iconic Ocean Drive in
                          style with a premium car from Ryde. Ditch the old,
                          tired, boring rental cars - they've got no place in
                          South Beach. Ryde has the best cars for rent from
                          trusted owners in our Miami network so you can do your
                          Miami Beach trip the right way.`}
              </p>
              <br />
              {isLosAngeles && (
                <Fragment>
                  <p className="lg-para">
                    Want to roll down Rodeo Drive in Beverly Hills in a Ferrari?
                    We can make that happen. Find anything from sports cars,
                    European sedans, JEEPs and high end supercars for rent.
                  </p>
                  <br />
                  <p className="lg-para">Cheap or luxury? We got it all.</p>
                  <p className="lg-para">Feeling green? Take a Prius.</p>
                </Fragment>
              )}
              {isSanDiego && (
                <Fragment>
                  <p className="lg-para">
                    Visit SeaWorld, Balboa Park and the world famous San Diego
                    Zoo in style. Ditch the same old boring cars associated with
                    traditional car rental agencies and rent cars you’d actually
                    want to drive - direct from trusted Ryde owners – for less
                    than you’d expect.
                  </p>
                  <br />
                  <p className="lg-para">
                    Rent a car for any and every occasion with Ryde.
                  </p>
                </Fragment>
              )}
              {isSanFrancisco && (
                <Fragment>
                  <p className="lg-para">
                    Drive across the iconic Golden Gate Bridge and check out
                    Fisherman’s Wharf with any number of vehicles that fit your
                    personal style. Here for business? Get to Silicon Valley
                    with the perfect executive luxury vehicle and make a
                    statement.
                  </p>
                  <br />
                  <p className="lg-para">
                    Our trusted marketplace has sports cars, Euro sedans, SUVs
                    and supercars available to rent for every occasion.
                  </p>
                </Fragment>
              )}
              {isMiami && (
                <Fragment>
                  <p className="lg-para">
                    Soak in some sun on the Florida beaches while dreaming about
                    the art-deco and neon infused Miami Beach nightlife. Don't
                    just get to where you're going, arrive.
                  </p>
                  <br />
                  <p className="lg-para">Always #rydeinstyle.</p>
                </Fragment>
              )}
              <Link
                className="rent-car-btn"
                to={{
                  pathname: "/cars",
                  search: queryString.stringify({
                    location: props.citiesLocationData.address,
                    lat: props.citiesLocationData.lat,
                    lng: props.citiesLocationData.lng,
                    from: moment(props.from).format("MM-DD-YYYY"),
                    to: moment(props.to).format("MM-DD-YYYY"),
                    fromTime: props.from.format("HH:mm"),
                    toTime: props.to.format("HH:mm")
                  })
                }}
              >
                RENT A CAR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentCarLandingsection;
