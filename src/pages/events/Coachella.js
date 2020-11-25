import "react-dates/initialize";
import React, { Component } from "react";
import { connect } from "react-redux";
import PlacesAutocomplete, {
  geocodeByAddress
} from "react-places-autocomplete";
import { browserHistory, Link } from "react-router";
import DateTime from "react-datetime";
import { SingleDatePicker } from "react-dates";
import OwlCarousel from "react-owl-carousel";
import Modal from "react-modal";
import moment from "moment-timezone";
import VideoPlayer from "../../components/site/VideoPlayer";
import GalleryItem from "../../components/site/GalleryItem";
import { SEARCH_DATA } from "../../actions/ActionTypes";
import { getCoachellaGalleryCars } from "../../actions/CarActions";
import "react-dates/lib/css/_datepicker.css";
import { modalStylesVideo } from "../../consts/modalStyles";
import { loginFacebook } from "../../actions/UserActions";
import { timeList } from "../../consts/consts";
import Helmet from "react-helmet";

class Coachella extends Component {
  constructor(props) {
    super(props);
    const caliDateTime = moment()
      .add(3, "hours")
      .tz("America/Los_Angeles");
    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add("minutes", remainder)
      .format("HH:mm");

    this.state = {
      showPlayer: false,
      showModal: false,
      couponCode: "",
      address: "",
      search: true,
      from: moment(),
      fromTime: timeToDisplay,
      to: moment().add(3, "days"),
      toTime: timeToDisplay,
      focusedFrom: false,
      focusedTo: false,
      locationClass: {
        root: "",
        input: "locationInput",
        autocompleteContainer: "row expanded-location"
      }
    };
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.validDateTo = this.validDateTo.bind(this);
    this.validDateFrom = this.validDateFrom.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setCouponCode = this.setCouponCode.bind(this);
    this.timeStatus = this.timeStatus.bind(this);
  }

  componentWillMount() {
    document.body.classList.remove("login");
    document.body.classList.remove("signup");
    const { dispatch } = this.props;
    dispatch(getCoachellaGalleryCars());
  }

  onChangeAddress(address) {
    this.setState({
      address: address,
      locationClass: {
        root: "",
        input: "locationInput",
        autocompleteContainer: "row expanded-location"
      }
    });
  }

  handleFormSubmit = event => {
    const { address, from, to, fromTime, toTime } = this.state;
    if (!address) {
      this.setState({
        locationClass: {
          root: "",
          input: "locationInput locationRequired",
          autocompleteContainer: "row expanded-location"
        }
      });
      return false;
    }

    event.preventDefault();

    const { dispatch } = this.props;

    geocodeByAddress(address, (err, { lat, lng }) => {
      dispatch({
        type: SEARCH_DATA,
        payload: {
          location: address,
          from: from,
          to: to,
          lat: lat,
          lng: lng
        }
      });
      browserHistory.push(
        `/cars/${address}/${lat}/${lng}/${from.format(
          "MM-DD-YYYY"
        )}/${fromTime}/${to.format("MM-DD-YYYY")}/${toTime}/`
      );
    });
  };
  handleCloseModal() {
    this.setState({ showModal: false });
    this.setState({ showPlayer: false });
  }

  setCouponCode() {
    localStorage.setItem("couponCode", this.state.couponCode);
    this.handleCloseModal();
  }

  handleSearch = address => {
    this.setState({ address: address, search: false });
  };

  handleDateChangeFrom(from) {
    // check if the to date is smaller that this value if so add three more days and set it
    const checkToDate = from.isAfter(this.state.to);
    if (checkToDate) {
      const toDate = DateTime.moment(from).add(3, "days");
      this.setState({ from: from, to: toDate });
    } else {
      this.setState({ from: from });
    }
  }

  handleDateChangeTo(to) {
    this.setState({ to: to });
  }

  validDateTo(currentDate) {
    const yesterday = DateTime.moment().subtract(1, "day");
    return (
      currentDate.isAfter(this.state.from) && currentDate.isAfter(yesterday)
    );
  }

  validDateFrom(currentDate) {
    const yesterday = DateTime.moment().subtract(1, "day");
    return currentDate.isAfter(yesterday);
  }
  timeStatus(selectedTime, selectedDate) {
    const [hours, minutes] = selectedTime.split(":");
    selectedDate.set({ hours, minutes });
    const today = moment()
      .add(3, "hours")
      .tz("America/Los_Angeles");
    if (
      Date.parse(today.format("YYYY-MM-DD HH:MM")) <
      Date.parse(selectedDate.format("YYYY-MM-DD HH:MM"))
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const screenWidth = window.innerWidth;

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      sources: [
        {
          src:
            "https://cdn.rydecars.com/video/Ryde+Commercial+_+V10.0+_+High+Res+_+07.10.2017.mp4",
          type: "video/mp4"
        }
      ]
    };

    const cssClasses2 = {
      root: "",
      input: "form-control",
      autocompleteContainer: "row expanded-location"
    };
    const options = {
      location: new window.google.maps.LatLng(34.0522, -118.243),
      radius: 2000,
      route: "Los Angeles County",
      //types: ['address'],
      componentRestrictions: {
        country: "us"
      }
    };

    const responsiveOptions = {
      0: {
        items: 1,
        nav: true
      },
      480: {
        items: 2,
        nav: true
      },
      900: {
        items: 3,
        nav: true
      },
      1200: {
        items: 4,
        nav: true
      }
    };

    const citiesResponsiveOptions = {
      0: {
        items: 1,
        nav: true
      },
      480: {
        items: 2,
        nav: true
      },
      900: {
        items: 3,
        nav: true
      },
      1200: {
        items: 4,
        nav: true
      }
    };

    const { coachellaGalleryCars } = this.props;
    const startDate = moment(
      this.state.from.format("MM-DD-YYYY") + " " + this.state.fromTime,
      "MM-DD-YYYY HH:mm"
    );
    const caliDateTime = moment().tz("America/Los_Angeles");

    const remainder = 30 - (caliDateTime.minute() % 30);
    const timeToDisplay = moment(caliDateTime)
      .add("minutes", remainder)
      .format("HH:mm");

    const ms = startDate.diff(caliDateTime);
    const timeDiff = moment.duration(ms)._milliseconds;

    const rydeButton = false;
    return (
      <div className="site-index">
        <Helmet
          title="Peer 2 Peer Car Rental for Coachella 2018 - RYDE"
          meta={[
            {
              name: "description",
              content:
                "RYDE offers peer to peer car renting in Los Angeles that is faster, cheaper and easier than renting from anyone else. Use code RYDE30 for $30 off your first RYDE and pick up your car today to go from LA to Indio."
            }
          ]}
        />
        <section>
          <div className="event-hero">
            <div className="hero-content container">
              <div className="row flex-container">
                <div className="col-md-4">
                  <div className="search-box">
                    <div className="search-box-form">
                      <h1>
                        <span className="textBold">Find your</span> RYDE for
                        Coachella
                      </h1>
                      <form onSubmit={this.handleFormSubmit}>
                        <div className="form-group">
                          <label htmlFor="">Location</label>
                          <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.onChangeAddress}
                            placeholder={"Type City, ZIP Code or Airport"}
                            classNames={this.state.locationClass}
                            onSelect={this.handleSearch}
                            options={options}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">From</label>
                          <div className="row">
                            <div className="col-xs-6">
                              <SingleDatePicker
                                date={this.state.from}
                                onDateChange={this.handleDateChangeFrom} // PropTypes.func.isRequired
                                focused={this.state.focusedFrom} // PropTypes.bool
                                onFocusChange={({ focused }) =>
                                  this.setState({ focusedFrom: focused })
                                }
                                orientation={
                                  screenWidth < 700 ? "vertical" : "horizontal"
                                }
                              />
                            </div>
                            <div className="col-xs-6">
                              <select
                                className="form-control"
                                value={this.state.fromTime}
                                onChange={e => {
                                  this.setState({ fromTime: e.target.value });
                                }}
                              >
                                {timeList.map(time => {
                                  return (
                                    <option
                                      key={time[0]}
                                      hidden={this.timeStatus(
                                        time[0],
                                        this.state.from
                                      )}
                                      value={time[0]}
                                    >
                                      {time[1]}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">To</label>
                          <div className="row">
                            <div className="col-xs-6">
                              <SingleDatePicker
                                date={this.state.to}
                                onDateChange={this.handleDateChangeTo} // PropTypes.func.isRequired
                                focused={this.state.focusedTo} // PropTypes.bool
                                onFocusChange={({ focused }) =>
                                  this.setState({ focusedTo: focused })
                                }
                                orientation={
                                  screenWidth < 700 ? "vertical" : "horizontal"
                                }
                              />
                            </div>
                            <div className="col-xs-6">
                              <select
                                className="form-control"
                                value={this.state.toTime}
                                onChange={e => {
                                  this.setState({ toTime: e.target.value });
                                }}
                              >
                                {timeList.map(time => {
                                  return (
                                    <option
                                      key={time[0]}
                                      hidden={this.timeStatus(
                                        time[0],
                                        this.state.to
                                      )}
                                      value={time[0]}
                                    >
                                      {time[1]}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        </div>
                      </form>
                      <button
                        type="submit"
                        onClick={this.handleFormSubmit}
                        disabled={rydeButton}
                        className="btn-success btn home-button btn-block"
                      >
                        RYDE
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-8">
                                    <div className="hero-content-inner">
                                        <h1 className="hero-content-title">Rent a car<br /><span className="htc-sm">for every occasion</span></h1>
                                        <p>Rent the perfect car from a trusted local owner or earn money by renting your own car to verified renters from our community</p>
                                        <Link className="hero-content-sub btn btn-danger" href="/car/create">LIST YOUR RYDE</Link>
                                    </div>
                                </div> */}
              </div>
            </div>
            <div className="coachella-banner-text">
              <img
                role="presentation"
                className="img-responsive"
                src="images/hero-event-bg-text.png"
              />
            </div>
          </div>
        </section>

        <section className="section-wrap">
          <div className="container">
            <h1 className="section-header">
              <span className="textBold">Featured</span> RYDES
            </h1>
            <div className="featuredCarousel">
              <OwlCarousel
                className="owl-theme"
                responsiveClass={true}
                responsive={responsiveOptions}
                loop
                margin={15}
                nav
                dots={false}
                lazyLoad={true}
                navClass="owl-prev owl-next"
              >
                {coachellaGalleryCars &&
                  coachellaGalleryCars.map((car, index) => {
                    return (
                      <GalleryItem
                        key={car.id}
                        car={car}
                        active={index === 1 ? true : false}
                        from={this.state.from}
                        to={this.state.to}
                        fromTime={this.state.fromTime}
                        toTime={this.state.toTime}
                      />
                    );
                  })}
              </OwlCarousel>
            </div>
          </div>
        </section>

        {/* Playboy Banner */}
        <section className="playboy-outer">
          <img
            role="presentation"
            className="img-responsive"
            src="images/playboy-banner.jpg?170404042018"
          />
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <img
                  role="presentation"
                  className="img-responsive playboy-banner"
                  src="images/playboy-banner-text.png"
                />
                <div className="playboy-content-wrapper">
                  <p>
                    RYDE is the official partner for Playboy. We will be at the
                    Playboy Coachella Club giving rides to attendees ranging
                    from Playboy Bunnies to G­Eazy. Look for us there and also
                    any cars branded RYDE.
                  </p>
                  <p>
                    Follow us{" "}
                    <Link
                      target="_blank"
                      href="https://www.instagram.com/rydeinstyle/"
                    >
                      {" "}
                      @instagram
                    </Link>{" "}
                    and you can use promo code RYDE30 for $30 off your first
                    ryde with us!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap gray-bg">
          <div className="whay-trade container">
            <div className="container">
              <h1 className="section-header">
                <span className="textBold">WHAT MAKES RYDE</span> THE BEST PLACE
                TO RENT CARS
              </h1>
              <div className="row">
                <div className="col-sm-6 col-md-3">
                  <div className="feature-box">
                    <img
                      role="presentation"
                      className=""
                      src="images/wwa-icon.svg"
                    />
                    <h3 className="feature-box-title">
                      <span className="textBold">WHAT</span> WE ARE
                    </h3>
                    <p>
                      We&acute;re an automated way to rent a vehicle a wide
                      range of make and model selections. Take our rentals
                      around the corner from the sandy beaches of Santa Monica
                      to the glimmering streets of Beverly Hills.
                    </p>
                    <Link className="link" to="/how-to-use">
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="feature-box">
                    <img
                      role="presentation"
                      className=""
                      src="images/wr-icon.svg"
                    />
                    <h3 className="feature-box-title">
                      <span className="textBold">WHY</span> RYDE
                    </h3>
                    <p>
                      RYDE is not your standard car rental service where all too
                      often aesthetics are sacrificed. RYDE offers you the
                      freedom to bypass the car rental counter whose sub-par
                      selections does not match your expectations.
                    </p>
                    <Link className="link" to="/how-to-use">
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="feature-box">
                    <img
                      role="presentation"
                      className=""
                      src="images/dayc-icon.svg"
                    />
                    <h3 className="feature-box-title">
                      <span className="textBold">DELIVERY AT</span>
                      <br />
                      YOUR CONVENIENCE
                    </h3>
                    <p>
                      Ryde offers delivered to you or selecting a local pick up
                      site. You choose the place. You choose the time. No more
                      waiting for shuttles at the airport with curbside delivery
                    </p>
                    <Link className="link" to="/how-to-use">
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="feature-box">
                    <img
                      role="presentation"
                      className=""
                      src="images/ri-icon.svg"
                    />
                    <h3 className="feature-box-title">
                      <span className="textBold">RYDE</span>
                      <br />
                      INSURANCE
                    </h3>
                    <p>
                      Ryde ensure you are covered by $1 million dollar liability
                      insurance policy. Your car is protected against for any
                      all physical damage through Assurant partner.
                    </p>
                    <Link className="link" to="/how-to-use">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-wrap">
          <div className="container ryde-cities-section">
            <h1 className="section-header">
              <span className="textBold">RYDE</span> Cities
            </h1>
            <OwlCarousel
              className="owl-theme"
              items={4}
              responsiveClass={true}
              responsive={citiesResponsiveOptions}
              loop
              margin={15}
              nav
              dots={false}
              lazyLoad={true}
              navClass="owl-prev owl-next"
            >
              <div className="item cities-box">
                <div className="city-name">Los Angeles int airport</div>
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/la-airport.jpg"
                />
              </div>
              <div className="item cities-box">
                <div className="city-name">Beverly Hills</div>
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/beverlyHills.jpg"
                />
              </div>
              <div className="item cities-box">
                <div className="city-name">Downtown LA</div>
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/downtown.jpg"
                />
              </div>
              <div className="item cities-box">
                <div className="city-name">Santa Monica </div>
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/santamonica.jpg"
                />
              </div>
              <div className="item cities-box">
                <div className="city-name">Hollywood</div>
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/hollywood.jpg"
                />
              </div>
            </OwlCarousel>
          </div>
        </section>
        <div className="video-wrapper home-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 col-lg-offset-1">
                <h1 className="main-title">
                  <span className="textBold">This is where the rent a car</span>
                  <br />
                  experience is re-defined
                </h1>
                <p>
                  Imagine the places you can go when the passion of driving is
                  fused with the technology of renting a top of the line vehicle
                  from the click of your phone.
                </p>
                <p>
                  <a
                    className="btn play-btn"
                    onClick={() => {
                      this.setState({ showPlayer: true });
                    }}
                  >
                    {/* <img role="presentation" className="play-btn" src="images/play-btn.png" /> */}
                    <span className="icon-play-icon" /> Play Video
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="app-wrapper home-section">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 text-left">
                <h1 className="main-title">
                  <span className="textBold">RYDE AT YOUR CONVENIENCE</span>
                  <br />
                  DOWNLOAD THE MOBILE APP
                </h1>
                <p>
                  Managing your vehicle listing, bookings and earning transfers
                  to your bank is in palm of your hands.
                </p>
                {/*<div>
                                  <p><Link className="link" to="/how-to-use">Loyalty Program</Link></p>
                                </div>
                                <div>
                                  <p><Link className="link" to="/car/create">List your car</Link></p>
                                </div>
                                <div>
                                  <p><Link className="link" to="/how-to-use">Tricks</Link></p>
                                </div>*/}
                <p />
                <div className="text-left">
                  <a
                    className=""
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.ryde.app"
                  >
                    <img
                      role="presentation"
                      className="app-link"
                      src="images/play-store.png"
                    />
                  </a>
                  <a
                    className=""
                    target="_blank"
                    href="https://itunes.apple.com/us/app/rydeapp/id1316990341?ls=1&mt=8"
                  >
                    <img
                      role="presentation"
                      className="app-link"
                      src="images/app-store.png"
                    />
                  </a>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <img
                  role="presentation"
                  className="img-responsive"
                  src="images/app-screen.png"
                />
              </div>
            </div>
          </div>
        </div>
        <section className="section-wrap gray-bg">
          <div className="container testimonials-section">
            <h1 className="section-header">
              <span className="textBold">TESTIMONIALS</span>
            </h1>
            <div className="testimonial-wrap">
              <OwlCarousel
                className="owl-theme"
                responsiveClass={true}
                responsive={citiesResponsiveOptions}
                items={3}
                loop
                margin={15}
                nav
                dots={false}
                items={3}
                lazyLoad={true}
                navClass="owl-prev owl-next"
              >
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “I could have never imagined that my trip to LA up from
                        San Diego would include a Maserati for under $150 a
                        day!!” We all know that LA is full of beautiful people
                        but the cars were the real head truner for me on this
                        trip! From the convenience of the car dropoff at my
                        hotel to the pickup on my last day here, RYDE made my
                        three-day stay in LA feel more like the life of a
                        moviestar” I will definitely be using RYDE again on my
                        next trip!
                      </p>
                      <p className="writer">- Richard, 52</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “Working in real estate means ups and downs in sales and
                        since listing my Mercedes AMG on RYDE, I have earned
                        approximately $700 a month which is sufficient to cover
                        my lease payments when business is slow. I was
                        considering getting another job to suppliment my income
                        however with the side income that I earn from RYDE as a
                        vehicle host, I no longer have to search for secondary
                        employment”
                      </p>
                      <p className="writer">- Jen, 34</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “I was skepticle about renting out my 2017 Porche
                        Cayenne on RYDE at first since it is less than a year
                        old and in pristine condition. However, the 1 million
                        dollar coverage policy that RYDE provides is a guarantee
                        not only of full wrap-around coverage but also complete
                        peace of mind that the drivers who will be renting are
                        responsible and dependable drivers.”
                      </p>
                      <p className="writer">- Lisa, 40</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “I work in beverage sales and I am always looking for
                        ways to impress new clients who come to Los Angeles to
                        experience the glamour of the entertainment industry.
                        Renting with RYDE is an affordable way to maximize the
                        business of entertainment for my client relations while
                        keeping to a modest budget!”
                      </p>
                      <p className="writer">-Melissa, 42</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “I am a recent college graduate student working in radio
                        advertising with massive debt. Luxury is not in the
                        cards for me with my two jobs and 3 roommates. When one
                        of my friends recently told me about her amazing
                        experience renting a BMW for a weekend for under $100 a
                        day, I decided to treat myself to a similar experience
                        as a birthday gift to myself. I am so glad I did! I
                        rented a Porsche 911 for two days and one night and the
                        memories will last a lifetime (as will my student
                        debt!)“
                      </p>
                      <p className="writer">- Ryan, 25</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “Why take Uber and put your life in the hands of a total
                        stranger when you can drive yourself in style with RYDE?
                        Seriously why hasn&acute;t anyone thought of this idea
                        before?“
                      </p>
                      <p className="writer">- Maria, 37</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="media">
                    <div className="media-body">
                      <p>
                        “There is nothing I detest more than waiting in dingy
                        car rental offices and filling out lengthy paperwork for
                        hours only to receive a car that is so basic and
                        unappealing that it looks like it belongs in a Sears ad.
                        When I tried RYDE, I had a gorgeous 2016 BMW M-Series
                        SUV at my hotel waiting for me in under an hour with the
                        keys in my hand for only .“
                      </p>
                      <p className="writer">-Andrea, 29</p>
                    </div>
                  </div>
                </div>
              </OwlCarousel>
            </div>
          </div>
        </section>
        <Modal
          className=""
          isOpen={this.state.showPlayer}
          onRequestClose={this.handleCloseModal}
          contentLabel="Modal"
          shouldCloseOnOverlayClick={true}
          style={modalStylesVideo}
        >
          <VideoPlayer {...videoJsOptions} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.user,
  coachellaGalleryCars: state.car.coachellaGalleryCars
});

export default connect(mapStateToProps)(Coachella);
