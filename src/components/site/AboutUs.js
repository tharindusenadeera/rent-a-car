import React, { Fragment } from "react";
import InnerpageHeader from "../layouts/InnerPageHeader";
import MainNav from "../layouts/MainNav";
import MainFooter from "../layouts/MainFooter";
import Helmet from "react-helmet";

const AboutUs = () => (
  <Fragment>
    <Helmet
      title="About Us | RYDE"
      meta={[
        {
          name: "description",
          content: "About Us"
        }
      ]}
    />
    <MainNav />
    <InnerpageHeader header="About Us" title="" />

    <div className="container how-works-page how-ryde-works-inner">
      <div className="row">
        <div className="col-md-12">
          <h4 className="sub-headline">A car for every occasion.</h4>
          <p style={{ paddingBottom: 10 }}>
            RYDE is a carsharing platform where guests can book any vehicle they
            want from a community of trusted hosts across the US.
          </p>

          <p style={{ paddingBottom: 10 }}>
            Our customers can choose from a large selection of brands and car
            models near them, while our hosts earn extra income to offset the
            costs of car ownership.
          </p>

          <p style={{ paddingBottom: 10 }}>
            Whether it is for a day of fun, an adventurous road trip or your
            business trip, we have the car you need!
          </p>

          <p style={{ paddingBottom: 10 }}>
            Founded in 2017 in Los Angeles, California, RYDE was inspired by the
            passion for great cars and the desire to help everyone enjoy the
            convenience of a different car rental experience!
          </p>

          {/* <button
            onClick={() => this.handleFormSubmit()}
            className="btn-success about-button"
          >
            Find the perfect car
          </button> */}

          <br />
          <br />

          {/* <h4 className="sub-headline">The Freedom</h4>
                <p>
                      Let your dreams inspire your ride. One set of college girlfriends channeled their inner 20-something year old selves by renting a Mercedes AMG G 65
                      on their annual girls’ weekender getaway from the monotony of the “pots and pans” that had come to define their married lives. For one weekend, the
                      soccer moms of today turned back the clock to the glory days of domination of clubs and spandex as they cruised through the streets of Laguna Beach
                      in eager anticipation of getting carded that night. Another pharmaceutical rep from Texas opted for a Tesla Model X as his vehicle of choice
                      while attending a convention at LAX where the food was as noxious as the presentation itself. Others were dreaming of going home. He was dreaming
                      of his Ryde with camera in hand to actually prove that he was in the driver’s seat of something that turned heads rather than stomachs. With Ryde,
                      you are only as limited as your imagination. Imagine a new reality for yourself with Ryde at your side.   <br/><br/><br/>

                </p>
                <h4 className="sub-headline">The Choice</h4>
                <p>
                    In a world where the obscene is the new norm and permanence is as temporary as a reality television romance, cars serve to remind us that the beauty
                    of timeless elegance is still attainable no matter how far out of reach it may seem. With Ryde, give yourself permission to sit back and enjoy the
                    road and remind yourself that it isn’t the destination in life that matters but rather the journey.  <br/><br/><br/>

                </p> */}
        </div>
      </div>
    </div>
    <MainFooter />
  </Fragment>
);

export default AboutUs;
