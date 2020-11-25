import React, { Fragment, Suspense } from "react";
import MainSearch from "../site/MainSearch";
import PreLoader from "../preloaders/preloaders";

const Section1 = props => {
  const {
    isLosAngeles,
    isMain,
    isMiami,
    isSanDiego,
    isSanFrancisco
  } = props.landingPageProps;
  return (
    <div className="hero-content container">
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <div className="hero-content-inner">
            <h1 className="hero-content-title">
              {isMain ? (
                `Car rental made easy `
              ) : (
                <Fragment>
                  {isLosAngeles &&
                    `Car Rentals in Los Angeles for Every Occasion`}
                  {isSanDiego && `Car Rentals in San Diego for Every Occasion`}
                  {isSanFrancisco &&
                    `Car Rentals in San Francisco for Every Occasion`}
                  {isMiami && `Car Rentals in Miami for Every Occasion`}
                </Fragment>
              )}
            </h1>
            <p>
              {isMain ? (
                `Find and book unique cars without the hassle.`
              ) : (
                <Fragment>
                  {isLosAngeles &&
                    `Ryde is a peer-to-peer car sharing platform in Los
                    Angeles. Rent the car you want, when you want.`}
                  {isSanDiego &&
                    `Ryde is a peer-to-peer car sharing platform in San
                            Diego. Rent the car you want, when you want.`}
                  {isSanFrancisco &&
                    `Ryde is a peer-to-peer car sharing platform in San
                    Francisco. Rent the car you want, when you want.`}
                  {isMiami &&
                    `Ryde is a peer-to-peer car sharing platform in
                            Miami. Rent the car you want, when you want.`}
                </Fragment>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="Main_searchbox_wrapper">
            <div className="search-box">
              <Suspense fallback={<PreLoader />}>
                <MainSearch
                  locationFieldProps={{
                    label: "Location",
                    placeholder: "Type City, ZIP Code or Airport"
                  }}
                  submitButtonProps={{ name: "SEARCH" }}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
