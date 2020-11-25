import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment-timezone";
import queryString from "query-string";
import { CarSearchHeaderFilter } from "../components/organisms/car-header-filter/";
import { HamburgerMenu } from "../components/organisms/hamburger-menu/";
import { PromotionBannerMobile } from "../components/organisms/promotion-banner-mobile/";
import InfiniteScroll from "react-infinite-scroller";
import { fetchCars, fetchAuthCars } from "../api/car";
import {
  CarCard,
  AdvanceFilter,
  PriceRangeAdvancedFilter,
  CarMakeFilter,
  CarTypeFilter,
  Map,
  EmptyScreen
} from "../components/organisms/car-search/";
import "antd/lib/select/style/index.css";
import "antd/lib/slider/style/index.css";
import "antd/lib/checkbox/style/index.css";
import "antd/lib/radio/style/index.css";
import "../Revamp2019.css";

const YEAR_MIN = 1994;
const YEAR_MAX = 2020;
const PRICE_MAX = 2500;
const PRICE_MIN = 0;
const CarCards = ({ cars, authenticated, from, to, timeZoneId, location }) => {
  return cars.map((car, key) => {
    return (
      <CarCard
        {...car}
        key={key}
        authenticated={authenticated}
        from={from}
        to={to}
        timeZoneId={timeZoneId}
        location={location}
      />
    );
  });
};

const PAGE_START = 1;

class SearchMobile extends Component {
  constructor(props) {
    super(props);
    const { history } = props;
    const queryData = queryString.parse(history.location.search);

    this.state = {
      hasMore: true,
      cars: [],
      showModal: false,
      value: 1,
      routeData: queryData,
      location: queryData.location,
      county: null,
      lat: queryData.lat,
      lng: queryData.lng,
      from: moment(
        queryData.from + " " + queryData.fromTime,
        "MM-DD-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm"),
      to: moment(
        queryData.to + " " + queryData.toTime,
        "MM-DD-YYYY HH:mm"
      ).format("YYYY-MM-DD HH:mm"),
      fromTime: queryData.fromTime,
      toTime: queryData.totime,
      showMap: false,
      priceRange: { min: PRICE_MIN, max: PRICE_MAX },
      yearRange: { min: YEAR_MIN, max: YEAR_MAX },
      makeId: queryData.makeId ? parseInt(queryData.makeId) : "",
      distancePerDay: "",
      deliveryLocationId: "",
      carType: "",
      transmission: "",
      selectedFeatures: [],
      pages: 1,
      nextPage: `/?page=1`,
      variableChanged: false,
      clear: ""
    };
  }

  submitFilters = data => {
    this.setState(
      {
        cars: [],
        ...data,
        nextPage: `/?page=1`,
        hasMore: true
      },
      () => {
        this.loadMore();
      }
    );
  };

  loadMore = () => {
    const {
      cars,
      from,
      to,
      lat,
      lng,
      location,
      makeId,
      distancePerDay,
      deliveryLocationId,
      carType,
      transmission,
      priceRange,
      yearRange,
      pages,
      selectedFeatures,
      nextPage
    } = this.state;

    const { authenticated, timeZoneId } = this.props;
    let data = {
      lat,
      lng,
      location,
      from: from,
      to: to,
      timeZoneId,
      priceRange: priceRange ? JSON.stringify(priceRange) : null,
      yearRange: yearRange ? JSON.stringify(yearRange) : null,
      include: "user"
    };

    if (makeId) {
      data.makeId = makeId;
    }
    if (distancePerDay) {
      data.distancePerDay = distancePerDay;
    }
    if (deliveryLocationId) {
      data.deliveryLocationId = deliveryLocationId;
    }
    if (carType) {
      data.carType = carType;
    }
    if (transmission) {
      data.transmission = transmission;
    }
    if (selectedFeatures.length) {
      data.features = selectedFeatures;
    }
    if (!nextPage) {
      return false;
    }
    if (authenticated === true) {
      fetchAuthCars({ ...data }, nextPage)
        .then(res => {
          let hasMore = true;
          const { current_page, total_pages } = res.data.cars.meta.pagination;
          const { data } = res.data.cars;

          if (current_page === total_pages) {
            hasMore = false;
          }
          if (!data.length) {
            hasMore = false;
          }
          data.forEach(element => {
            if (
              !cars.find(i => {
                return i.id == element.id;
              })
            ) {
              cars.push(element);
            }
          });
          this.setState({
            cars,
            hasMore,
            pages: pages + 1,
            nextPage: res.data.cars.meta.pagination.links.next
          });
        })
        .catch(e => {});
    } else {
      fetchCars({ ...data }, nextPage)
        .then(res => {
          let hasMore = true;
          const { current_page, total_pages } = res.data.cars.meta.pagination;
          const { data } = res.data.cars;
          if (current_page === total_pages) {
            hasMore = false;
          }
          if (!data.length) {
            hasMore = false;
          }
          data.forEach(element => {
            if (
              !cars.find(i => {
                return i.id == element.id;
              })
            ) {
              cars.push(element);
            }
          });

          this.setState({
            cars,
            hasMore,
            pages: pages + 1,
            nextPage: res.data.cars.meta.pagination.links.next
          });
        })
        .catch(e => {});
    }
  };

  loadMoreForMap = () => {
    const { hasMore, showMap } = this.state;
    if (hasMore && showMap) {
      this.loadMore();
    }
  };

  _onChangeHeaderData = data => {
    this.setState({ ...data });
  };

  _onClear = data => {
    if (data == "make") {
      this.setState({
        makeId: "",
        clear: "make"
      });
    } else if (data == "type") {
      this.setState({
        carType: "",
        clear: "carType"
      });
    } else if (data == "priceRange") {
      this.setState({
        priceRange: { min: PRICE_MIN, max: PRICE_MAX },
        variableChanged: false,
        clear: "priceRange"
      });
    } else {
      this.setState({
        makeId: "",
        distancePerDay: "",
        deliveryLocationId: "",
        carType: "",
        selectedFeatures: [],
        transmission: "",
        priceRange: { min: PRICE_MIN, max: PRICE_MAX },
        yearRange: { min: YEAR_MIN, max: YEAR_MAX },
        variableChanged: false,
        clear: "all"
      });
    }
  };

  handleVariableChange = data => {
    this.setState({ variableChanged: data });
  };

  render() {
    const {
      hasMore,
      cars,
      from,
      to,
      lat,
      lng,
      location,
      showMap,
      routeData,
      makeId,
      carType,
      priceRange,
      clear
    } = this.state;
    const { timeZoneId, authenticated } = this.props;

    return (
      <div className="wrapper">
        {/* Header */}
        <header className="header">
          {/* Logo - start  */}
          <div className="brand">
            <Link to="/">
              <img src="../images/ryde-logo.png" className="logo" />
            </Link>
          </div>
          {/* Logo - end  */}
          <div className="search">
            <CarSearchHeaderFilter
              routeData={routeData}
              submitFilters={this.submitFilters}
              _onChangeHeaderData={this._onChangeHeaderData}
              source={"search"}
            />
          </div>
          <HamburgerMenu />
          <div className="scroll-menu">
            <div className="scroll-menu-item">
              <AdvanceFilter
                submitFilters={this.submitFilters}
                _onClear={this._onClear}
                makeId={makeId}
                carType={carType}
                priceRange={priceRange}
                variableChanged={this.handleVariableChange}
                clear={clear}
              ></AdvanceFilter>
            </div>
            <div className="scroll-menu-item">
              <CarMakeFilter
                submitFilters={this.submitFilters}
                _onClear={this._onClear}
                makeId={makeId}
              />
            </div>
            <div className="scroll-menu-item">
              <CarTypeFilter
                submitFilters={this.submitFilters}
                _onClear={this._onClear}
                carType={carType}
              />
            </div>
            <div className="scroll-menu-item">
              <PriceRangeAdvancedFilter
                submitFilters={this.submitFilters}
                priceRange={priceRange}
                variableChanged={this.state.variableChanged}
                _onClear={this._onClear}
                handleVariableChange={this.handleVariableChange}
              />
            </div>
            <div className="scroll-menu-item">
              <a
                herf="#"
                className={
                  showMap ? "flex-align-center" : "black flex-align-center"
                }
                onClick={() => this.setState({ showMap: !showMap })}
              >
                <span
                  className={
                    !showMap
                      ? "icon-revamp-map-open-location scroll-menu-icon"
                      : "icon-revamp-list-set scroll-menu-icon"
                  }
                ></span>
                {!showMap ? "Map" : "List"}
              </a>
            </div>

            {/* Items */}
          </div>
        </header>
        {/* Header */}

        {!showMap ? (
          <div className="content">
            {!authenticated ? <PromotionBannerMobile /> : null}

            <div className="search-section">
              <InfiniteScroll
                pageStart={PAGE_START - 1}
                loadMore={this.loadMore}
                hasMore={hasMore}
                loader={
                  <div className="io-loading" key={0}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                }
              >
                <CarCards
                  {...this.state}
                  authenticated={authenticated}
                  from={from}
                  to={to}
                  timeZoneId={timeZoneId}
                  location={location}
                />
              </InfiniteScroll>
            </div>

            {/* Empty data */}
            {cars.length == 0 && !hasMore && (
              <EmptyScreen location={location} />
            )}

            {/* Empty data */}
          </div>
        ) : (
          <div className="content-fluid">
            <div className="search-map-wrapper">
              <div className="search-map-inner">
                <Map
                  cars={cars}
                  from={from}
                  fromTime={moment(from).format("HH:mm")}
                  toTime={moment(to).format("HH:mm")}
                  to={to}
                  loadMoreForMap={this.loadMoreForMap}
                  hasMore={hasMore}
                  location={{
                    address: location,
                    lat,
                    lng
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="footer"></div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filteredCar: state.car.filteredCar,
  features: state.car.features,
  carMakes: state.car.carMakes,
  carModels: state.car.carModels,
  user: state.user.user,
  authenticated: state.user.authenticated,
  timeZoneId: state.common.timeZoneId
});

export default withRouter(connect(mapStateToProps)(SearchMobile));
