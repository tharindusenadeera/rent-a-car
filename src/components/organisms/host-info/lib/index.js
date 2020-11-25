import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

const HostInfo = props => {
  const { host } = props;

  return (
    <div className="detail-card inner">
      <h5>Host info</h5>
      <Link to={`/profile/${host && host.user.id}`} className="black">
        <div className="p owner-info-card flex-align-center">
          <img
            src={host && host.user && host.user.profile_image_thumb}
            className="avatar-medium"
          />
          <div>
            <div className="card-row flex-align-center">
              <span className="font-16 font-semibold owner-name">
                {host && host.user && host.user.first_name}
              </span>
              {host && host.user && host.user.user_rating > 0 && (
                <Fragment>
                  <span className="bull-icon-medium">&bull;</span>
                  <div>
                    <span className="icon-revamp-star-filled color-orange icon"></span>
                    <span className="font-16 font-semibold">
                      {host &&
                        host.user &&
                        parseInt(host.user.user_rating).toFixed(1)}
                    </span>
                  </div>
                </Fragment>
              )}
              <span className="bull-icon-medium">&bull;</span>
              <div>
                <span className="icon-revamp-verified color-green icon"></span>
                <span className="font-14 font-semibold">Verified</span>
              </div>
            </div>
            <div className="card-row flex-align-center">
              {host && host.user && host.user.trips > 0 && (
                <Fragment>
                  {" "}
                  <span className="font-12 font-semibold">
                    Trips : {host && host.user && host.user.trips}
                  </span>
                  <span className="bull-icon-medium">&bull;</span>
                </Fragment>
              )}
              <span className="font-12 font-reguler">
                Joined:{" "}
                {moment(host && host.user && host.user.created_at).format(
                  "MMMM"
                )}{" "}
                -{" "}
                {moment(host && host.user && host.user.created_at).format(
                  "YYYY"
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HostInfo;
