import React, { Fragment } from "react";

import RedirectLink from "./RederectButton";

const SignUpSuccessModal = props => {
  return (
    <Fragment>
      <div className="sign-up-popup prom-popup">
        <div className="close-popup">
          <span
            className="icon-cancel"
            onClick={!props.page ? props.closeModel : props.promoCloseCallBack}
          />
        </div>
        <div className="icon">
          <img src="/images/checkout/success-icon-green.png" />
        </div>
        <div className="prom_header promo_body">
          <div className="prom-medium_p">Welcome new Ryder,</div>
          check your email to
          <br />
          <span className="prom-extra">Save $30</span>
          <br />
          on your first ryde
        </div>
        <div className="prom-desc promo_body">
          <img
            src="https://cdn.rydecars.com/static-images/email-with-heart-v2.jpg"
            width="44px"
          />
        </div>
        {/* <div className="btn-scbox">
          <RedirectLink className="btn-popup SC_btn SC_btn_submit">
            BROWSE CARS
          </RedirectLink>
        </div> */}
      </div>
    </Fragment>
  );
};

export default SignUpSuccessModal;
