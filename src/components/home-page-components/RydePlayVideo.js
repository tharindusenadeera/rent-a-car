import React from "react";
// import { SimpleImg } from 'react-simple-img';
import { LazyImage } from "../comman";

const RydePlayVideo = props => {
  return (
    <div className="video-wrapper">
      <LazyImage
        src="https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/static-images/video-bg.jpg"
        withloader="content-loader"
      />
      <div className="video-inner-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-lg-offset-1">
              <h2 className="main-title">Find your RYDE. Find your road.</h2>
              <div className="main-title main-title-small">
                We're redefining the car rental experience.
              </div>
              {/* <p>
                This is the new way. Fast, personalized, and easy car rental.
                All through the power of your phone. RYDE makes the car the
                occasion.
              </p> */}

              <a className="btn play-btn" onClick={props.onClick}>
                <span className="icon-play-icon" /> Play Video
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RydePlayVideo;
