import React from "react";
import { Accordion } from "react-accessible-accordion";
import PersonalInformation from "./PersonalInformation";
import DriverLicenseInformation from "./DriverLicenseInformation";
import ExtraInformation from "./ExtraInformation";
import CarOwnersOnly from "./CarOwnersOnly";
import CreditCardDetails from "./CreditCardDetails";
import ResetPassword from "./ResetPassword";
import PhoneVerification from "../../../components/verifications/PhoneVerification";

const ProfileRight = props => {
  const handleMessage = data => {
    props.handleMessage(data);
  };

  return (
    <div className="col-md-8">
      <div className="Prof_body_title">Edit Profile</div>
      <div className="Prof_body">
        <div className="demo-container">
          <Accordion>
            {/* Personal Information - Start */}
            <PersonalInformation
              user={props.user}
              dispatch={props.dispatch}
              usStates={props.usStates}
              success={props.success}
              error={props.error}
            />

            {/* Driver license information - Start */}
            {props.user && props.user.driving_license_number && (
              <DriverLicenseInformation
                user={props.user}
                dispatch={props.dispatch}
                usStates={props.usStates}
                success={props.success}
                error={props.error}
              />
            )}

            {/* Extra information - Start */}
            <ExtraInformation
              user={props.user}
              languagesList={props.languageList}
              success={props.success}
              error={props.error}
              dispatch={props.dispatch}
            />

            {/* Car owners only - Start */}
            <CarOwnersOnly
              user={props.user}
              usStates={props.usStates}
              success={props.success}
              error={props.error}
              dispatch={props.dispatch}
              isOpne={props.isOpne}
              accordionDisableStatus={
                props.user.street_address &&
                props.user.state &&
                props.user.city &&
                props.user.zip_code
                  ? false
                  : true
              }
              handleMessage={handleMessage}
            />

            {/* Reset password - Start */}
            <ResetPassword
              success={props.success}
              error={props.error}
              dispatch={props.dispatch}
            />

            {/* Credit cards details - Start */}
            <CreditCardDetails
              user={props.user}
              countryArray={props.countryArray}
              usStates={props.usStates}
              success={props.success}
              error={props.error}
              dispatch={props.dispatch}
            />

            {/* <VerifyPhone /> */}
            <PhoneVerification
              signupFormData={props.verifyPhone}
              isOpen={props.verifyPhone}
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
};
export default ProfileRight;
