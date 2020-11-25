import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import moment from "moment-timezone";
import queryString from "query-string";
import rootReducer from "./reducers";
import ScrollToTop from "./scroller/ScrollToTop";
import App from "./App";
import SquarePaymentMobile from "./components/credit-card/SquarePaymentMobile";
import TestK from "./pages/TestK";
import PasswordResetPage from "./components/site/PasswordResetPage";
import PreLoader from "./components/preloaders/preloaders";
import "owl.carousel/dist/assets/owl.carousel.css";
import "./App.css";
import "./Animate.css";
import "./IconSets.css";
import "./shimmer.css";
import "./IconSetRevamp.css";

const SiteIndex = lazy(() => import("./components/site/Index"));
const HowToUse = () => {
  window.location = "https://rydecarshelp.zendesk.com/";
  return null;
};
const Safety = lazy(() => import("./components/site/Safety"));
const ContactUs = lazy(() => import("./components/site/ContactUs"));
const AboutUs = lazy(() => import("./components/site/AboutUs"));
const Faq = lazy(() => import("./components/site/Faq"));
const TermsConditions = lazy(() => import("./components/site/TermsConditions"));
const SignUp = lazy(() => import("./components/user/SignUp"));
const Login = lazy(() => import("./components/site/Login"));
const Tickets = lazy(() => import("./pages/supportcenter/lib/Tickets"));
const ViewTicket = lazy(() => import("./pages/supportcenter/lib/ViewTicket"));
const CreateTicket = lazy(() =>
  import("./pages/supportcenter/lib/CreateTicket")
);
const ReviewTicket = lazy(() =>
  import("./pages/supportcenter/lib/ReviewTicket")
);
const CarSearch = lazy(() => import("./pages/CarSearch"));
const CarDetails = lazy(() => import("./pages/CarDetails"));
const Update = lazy(() => import("./components/car/Update"));
const CarAvailability = lazy(() => import("./components/car/CarAvailability"));
const OwnerIndex = lazy(() => import("./pages/OwnerIndex"));
const PrivacyPolicy = lazy(() => import("./components/site/PrivacyPolicy"));
const Profile = lazy(() => import("./pages/Profile"));
const DeliveryOptions = lazy(() => import("./pages/DeliveryOptions"));
const BookingFinal = lazy(() => import("./pages/BookingFinal"));
const Booking = lazy(() => import("./pages/Booking"));
const CarCheckoutForm = lazy(() =>
  import("./components/booking/CarCheckoutForm")
);
const CarCreate = lazy(() => import("./pages/CarListing"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const PromotionIndex = lazy(() => import("./pages/PromotionIndex"));
const SearchMobile = lazy(() => import("./pages/SearchMobile"));
const CarDetailMobile = lazy(() => import("./pages/CarDetailMobile"));

const CarSearchOld = ({ match }) => {
  return (
    <Redirect
      to={{
        pathname: "/cars",
        search: queryString.stringify({
          location: match.params.location,
          lat: match.params.lat,
          lng: match.params.lng,
          from: moment(match.params.from, "MM-DD-YYYY").format("MM-DD-YYYY"),
          to: moment(match.params.to, "MM-DD-YYYY").format("MM-DD-YYYY"),
          fromTime: match.params.fromTime,
          toTime: match.params.toTime
        })
      }}
    />
  );
};
const CarDetailsOld = ({ match }) => {
  return (
    <Redirect
      to={{
        pathname: `/car/${match.params.name}/${match.params.id}`,
        search: queryString.stringify({
          from: moment(match.params.from, "MM-DD-YYYY").format("MM-DD-YYYY"),
          fromTime: match.params.fromTime,
          to: moment(match.params.to, "MM-DD-YYYY").format("MM-DD-YYYY"),
          toTime: match.params.toTime
        })
      }}
    />
  );
};

const oldProfile = () => {
  return <Redirect to="/my-profile/cars" />;
};

export const store = createStore(rootReducer, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App>
      <Router onUpdate={() => console.log("updated")}>
        <ScrollToTop>
          <Switch>
            <React.Fragment>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/" component={SiteIndex} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/car-rentals/:city" component={SiteIndex} />
              </Suspense>
              <Route
                path="/squre-form-for-mobile"
                component={SquarePaymentMobile}
              />
              <Route path="/test-k" component={TestK} />
              <Suspense fallback={<PreLoader />}>
                <Route path="/how-to-use/:tab?/:id?" component={HowToUse} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/contact-us" component={ContactUs} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/about-us" component={AboutUs} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/safety" component={Safety} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/safety/index/:index" component={Safety} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/faq" component={Faq} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/signup/:referral?" component={SignUp} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/login" component={Login} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/support-center" component={Tickets} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  exact
                  path="/support-center/ticket/:id"
                  component={ViewTicket}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                {" "}
                <Route
                  path="/support-center/ticket-create"
                  component={CreateTicket}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                {" "}
                <Route
                  path="/support-center/ticket/review/:id"
                  component={ReviewTicket}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  exact
                  path="/my-profile/:tab?/:id?"
                  component={Profile}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/profile/:id" component={PublicProfile} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/car-update/:id" component={Update} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  // path="/cars/:location/:lat/:lng/:from/:fromTime/:to/:toTime/:makeId?/:cat?"
                  path="/cars"
                  component={isMobileOnly ? SearchMobile : CarSearch}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/cars/:location/:lat/:lng/:from/:fromTime/:to/:toTime/:makeId?/:cat?"
                  component={CarSearchOld}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/car-availability/:id"
                  component={CarAvailability}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/list-your-car/:referral?"
                  component={OwnerIndex}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/privacy-policy" component={PrivacyPolicy} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/car-delivery/:carId/:from/:fromTime/:to/:toTime/:deliveryLocation?/:lat?/:lng?"
                  component={DeliveryOptions}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/car-checkout/:carId/:from/:fromTime/:to/:toTime/:freeDeliveryLocationId?/:deliveryLocation?/:lat?/:lng?"
                  component={BookingFinal}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route exact path="/booking/:id/:status?" component={Booking} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/booking-checkout/:id"
                  component={CarCheckoutForm}
                />
              </Suspense>

              {/* 
                <Route path="/message-center" component={MessageCenter} />
               */}
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/terms-and-conditions"
                  component={TermsConditions}
                />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route path="/car-create/:id?" component={CarCreate} />
              </Suspense>
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/car/:name?/:id/:cat?"
                  component={isMobileOnly ? CarDetailMobile : CarDetails}
                />
              </Suspense>
              <Route
                path="/car/:name?/:id/:from/:fromTime/:to/:toTime/:cat?"
                component={CarDetailsOld}
              />
              <Route path="/profile/index/2" component={oldProfile} />
              <Route
                path="/password/reset/:token"
                component={PasswordResetPage}
              />
              <Suspense fallback={<PreLoader />}>
                <Route
                  path="/:location/carloverschoice"
                  component={PromotionIndex}
                />
              </Suspense>
            </React.Fragment>
          </Switch>
        </ScrollToTop>
      </Router>
    </App>
  </Provider>,
  document.getElementById("root")
);
