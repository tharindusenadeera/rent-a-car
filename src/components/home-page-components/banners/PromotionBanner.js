import React from "react";
import { isMobile } from "react-device-detect";

const PromotionBanner = () => {
    return(
        <section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {isMobile ? (
                        <div className="promotion-banner-xs">
                            <img src="https://cdn.rydecars.com/static-images/firstryde-19-mobile.jpg" width="100%" alt="promotion-banner" />
                        </div>
                        ):
                        (
                        <div className="promotion-banner-md">
                            <img src="https://cdn.rydecars.com/static-images/firstryde-19-web.jpg" width="100%" alt="promotion-banner" />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PromotionBanner;