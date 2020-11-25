import React from "react";
import { LazyImage } from "../comman";

const RydeDownloadMobileApp = props => {
  return (
    <div className="app-wrapper home-section">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 text-left">
            <h2 className="main-title">
              {/* RYDE at your convenience.
              <br />
              Download the mobile app */}
              Manage and schedule your bookings easily.
            </h2>
            {/* <p>
              Manage your vehicle listings. Transfer earnings to your bank.
              Schedule your RYDE bookings. It&#39;s all in the palm of your
              hands.
            </p> */}
            <p />
            <div className="text-left">
              <a
                className=""
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.ryde.app"
              >
                <LazyImage
                  alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                  role="presentation"
                  className="app-link"
                  src="/images/play-store.png"
                />
              </a>
              <a
                className=""
                target="_blank"
                href="https://itunes.apple.com/us/app/rydeapp/id1316990341?ls=1&mt=8"
              >
                <LazyImage
                  alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                  role="presentation"
                  className="app-link"
                  src="/images/app-store.png"
                />
              </a>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
            <LazyImage
              alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
              role="presentation"
              className="img-responsive"
              src="https://cdn.rydecars.com/static-images/app-screen.png"
            />
            {/* <SimpleImg
                alt="RYDE AT YOUR CONVENIENCE DOWNLOAD THE MOBILE APP"
                role="presentation"
                className="img-responsive"
                src="https://cdn.rydecars.com/static-images/app-screen.png"
              /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RydeDownloadMobileApp;
