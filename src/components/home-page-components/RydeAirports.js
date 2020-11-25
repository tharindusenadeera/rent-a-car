import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";

const URL = props => {
  const { location, lat, lng, from, to, children, fromTime, toTime } = props;
  return (
    <Link
      to={{
        pathname: "/cars",
        search: queryString.stringify({
          location,
          lat,
          lng,
          from,
          to,
          fromTime,
          toTime
        })
      }}
    >
      {children}
    </Link>
  );
};

const RydeAirports = props => {
  const {
    isLosAngeles,
    isSanDiego,
    isSanFrancisco,
    isMiami
  } = props.landingPageProps;
  return (
    <section className="ryde-airports-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="section-header">
              <span className="textBold">
                RYDE airports in the greater {isLosAngeles && `Los Angeles`}{" "}
                {isSanDiego && `San Diego`}
                {isSanFrancisco && `San Francisco`}
                {isMiami && `Miami`} area
              </span>
            </h1>
          </div>
        </div>

        <div className="row">
          {/* for Los Angeles */}
          {isLosAngeles && (
            <div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />
                  <URL
                    location="Los Angeles International Airport (LAX), World Way, Los Angeles, CA, USA"
                    lat="33.9444133"
                    lng="-118.39666879999999"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Los Angeles International Airport (LAX)
                  </URL>
                </div>
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />
                  <URL
                    location="Hollywood Burbank Airport, N Hollywood Way, Burbank, CA, USA"
                    lat="34.1983122"
                    lng="-118.3574036"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Hollywood Burbank Airport (BUR)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />
                  <URL
                    location="Long Beach Airport, Donald Douglas Drive, Long Beach, CA, USA"
                    lat="33.8172714"
                    lng="-118.1424791"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Long Beach Airport (LGB)
                  </URL>
                </div>
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="John Wayne Airport, California, USA"
                    lat="33.6761901"
                    lng="-117.86747589999999"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    John Wayne Airport (SNA)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />
                  <URL
                    location="Van Nuys Airport (VNY) (VNY), Sherman Way, Van Nuys, CA, USA"
                    lat="34.2096399"
                    lng="-118.48964480000001"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Van Nuys Airport (VNY)
                  </URL>
                </div>
              </div>
            </div>
          )}

          {/* for San Diego */}
          {isSanDiego && (
            <div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="San Diego International Airport (SAN), North Harbor Drive, San Diego, CA, USA"
                    lat="32.7338006"
                    lng="-117.19330379999997"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    San Diego International Air Port (SAN)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="McClellan-Palomar Airport, Palomar Airport Road, Carlsbad, CA, USA"
                    lat="33.1268216"
                    lng="-117.27924080000003"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    McClellan Airport-Palmar (CRQ)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="John Wayne Airport, John Wayne Airport (SNA), California, USA"
                    lat="33.6761901"
                    lng="-117.86747589999999"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    John Wayne- Orange County (SNA)
                  </URL>
                </div>
              </div>
            </div>
          )}

          {/* for San Francisco */}
          {isSanFrancisco && (
            <div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />
                  <URL
                    location="San Francisco International Airport (SFO), San Francisco, CA, USA"
                    lat="37.6213129"
                    lng="-122.3789554"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    San Francisco International Airport (SFO)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="Oakland International Airport, Oakland, CA, USA"
                    lat="37.7125689"
                    lng="-122.2197428"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Oakland International Airport (OAK)
                  </URL>
                </div>
              </div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="San Jose International Airport Electrical Vehicle Charging Stations, Airport Boulevard, San Jose, CA, USA"
                    lat="37.3695377"
                    lng="-121.9294448"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    San Jose International Airport (SJC)
                  </URL>
                </div>
              </div>
            </div>
          )}

          {/* for Miami */}
          {isMiami && (
            <div>
              <div className="col-md-4">
                <div className="ryde-airport-inner">
                  <span className="icon-right-arrow" />

                  <URL
                    location="Miami International Airport, Miami, FL, USA"
                    lat="25.795865"
                    lng="-80.28704570000002"
                    from={props.from.format("MM-DD-YYYY")}
                    fromTime={props.from.format("HH:mm")}
                    to={props.to.format("MM-DD-YYYY")}
                    toTime={props.to.format("HH:mm")}
                  >
                    Miami International Airport MIA
                  </URL>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RydeAirports;
