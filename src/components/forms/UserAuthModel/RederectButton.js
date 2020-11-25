import React from "react";
import queryString from "query-string";
import _ from "lodash";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";

const RederectButton = props => {
  const { history } = props;
  const searchData = queryString.parse(history.location.search);

  if (!_.isEmpty(searchData) && searchData._from) {
    if (searchData._from == "cardetails") {
      const { match } = props;
      const { from, fromTime, to, toTime } = searchData;
      return (
        <Link
          className={props.className}
          to={`/car-delivery/${
            match.params.id
          }/${from}/${fromTime}/${to}/${toTime}`}
        >
          Continue
        </Link>
      );
    } else if (searchData._from == "promoindex") {
      const { address, lat, lng } = searchData;
      const from = moment().add(3, "hours");
      const to = moment().add(3, "days");
      return (
        <Link
          className={props.className}
          to={{
            pathname: "/cars",
            search: queryString.stringify({
              location: address,
              lat: lat,
              lng: lng,
              from: moment(from).format("MM-DD-YYYY"),
              to: moment(to).format("MM-DD-YYYY"),
              fromTime: from.format("HH:mm"),
              toTime: to.format("HH:mm")
            })
          }}
        >
          {props.children}
        </Link>
      );
    }
  }
  return (
    <a className={props.className} onClick={() => history.goBack()}>
      Continue
    </a>
  );
};

export default withRouter(RederectButton);
