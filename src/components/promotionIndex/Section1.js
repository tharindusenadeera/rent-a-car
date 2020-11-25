import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import MainSearch from "../site/MainSearch";
import PreLoader from "../preloaders/preloaders";

const Section1 = props => {
  const { citiesLocationData } = props.landingPageProps;
  const { foucesFrom, foucesFromReturn } = props;

  return (
    <div className="hero-content container">
      <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <div className="hero-content-inner">
            <div className="Promo19-slide">
              <h1 className="hero-content-title">
                Get $30 off on your first trip
              </h1>
              <Link
                to={{
                  pathname: "/signup",
                  search: queryString.stringify({
                    _from: "promoindex",
                    ...citiesLocationData
                  })
                }}
                className="Promo19-add-btn signup"
              >
                Sign up to get rewarded
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="Main_searchbox_wrapper">
            <div className="search-box">
              <Suspense fallback={<PreLoader />}>
                <MainSearch
                  {...citiesLocationData}
                  foucesFrom={foucesFrom}
                  foucesFromReturn={foucesFromReturn}
                  locationFieldProps={{
                    label: "Try",
                    placeholder: "City or Zip code"
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
