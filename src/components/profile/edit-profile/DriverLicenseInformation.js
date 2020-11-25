import React from "react";
import moment from "moment";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";

class DriverLicenseInformation extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      error: false,
      success: false,
      message: "",
      driving_license_number: user.driving_license_number,
      driving_license_expiration: moment(
        user.driving_license_expiration
      ).format("MM-DD-YYYY"),
      license_issued_state: user.license_issued_state,
      license_issued_country: user.license_issued_country
    };
  }
  render() {
    const { user } = this.props;
    const {
      driving_license_number,
      driving_license_expiration,
      license_issued_state,
      license_issued_country
    } = this.state;
    const completeStatus =
      user.driving_license_number &&
      user.driving_license_expiration &&
      user.license_issued_state &&
      user.license_issued_country
        ? true
        : false;
    return (
      <AccordionItem className="accordion__item">
        <AccordionItemTitle>
          <h3 className=" u-position-relative u-margin-bottom-s">
            Driver license information
            <div className="Prof_list_complete">
              {completeStatus && (
                <img src="/images/profilev2/icon-correct.svg" />
              )}
            </div>
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          {/* Driver license information - Start */}
          <div className="Prof_form_details_box">
            <div className="row">
              {driving_license_number ? (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-6 title">Driver license number</div>
                    <div className="col-md-6 txt">{driving_license_number}</div>
                  </div>
                </div>
              ) : null}
              {driving_license_expiration ? (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-6 title">Expiration</div>
                    <div className="col-md-6 txt">
                      {driving_license_expiration}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="row">
              {license_issued_state ? (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-6 title">License issued state</div>
                    <div className="col-md-6 txt">{license_issued_state}</div>
                  </div>
                </div>
              ) : null}
              {license_issued_country ? (
                <div className="col-md-6 col-xs-6 Prof_form_details">
                  <div className="row">
                    <div className="col-md-6 title">License issued country</div>
                    <div className="col-md-6 txt">{license_issued_country}</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {/* Driver license information - End */}
        </AccordionItemBody>
      </AccordionItem>
    );
  }
}
export default DriverLicenseInformation;
