import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import moment from "moment";
import { POPULAR_VEHICLE_BRANDS } from "../../consts/consts";

const PopularVehicleBrands = props => {
  const {
    isLosAngeles,
    isSanDiego,
    isSanFrancisco,
    isMiami
  } = props.landingPageProps;
  const { address, lat, lng } = props.citiesLocationData;
  return (
    <section className="vehicle-brands-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="section-header">
              <span className="textBold">
                {isLosAngeles && `Popular vehicle brands for rent around LA`}
                {isSanDiego &&
                  `Popular vehicle brands for rent around San Diego`}
                {isSanFrancisco &&
                  `Popular vehicle brands for rent around San Francisco`}
                {isMiami && `Popular vehicle brands for rent around MIA`}
              </span>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div>
              <div className="vehicle-brands-inner">
                {POPULAR_VEHICLE_BRANDS.map((brand, index) => {
                  return (
                    <span className="vehicle-brands" key={index}>
                      <span className="icon-right-arrow" />
                      <Link
                        // to={`/cars/${address}/${lat}/${lng}/${props.from.format(
                        //   "MM-DD-YYYY"
                        // )}/${props.from.format("HH:mm")}/${props.to.format(
                        //   "MM-DD-YYYY"
                        // )}/${props.to.format("HH:mm")}/${brand.id}`}
                        to={{
                          pathname: "/cars",
                          search: queryString.stringify({
                            location: address,
                            lat: lat,
                            lng: lng,
                            from: moment(props.from).format("MM-DD-YYYY"),
                            to: moment(props.to).format("MM-DD-YYYY"),
                            fromTime: moment(props.from).format("HH:mm"),
                            toTime: moment(props.to).format("HH:mm"),
                            makeId: brand.id
                          })
                        }}
                      >
                        {brand.name}
                      </Link>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularVehicleBrands;
