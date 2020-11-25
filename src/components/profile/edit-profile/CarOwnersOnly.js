import React, { Fragment } from "react";
import { Radio } from "antd";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import {
  IndividualAccount,
  PaymentAccountView,
  CorporateAccount
} from "../../organisms/profile-car-owners-only";
import "antd/lib/select/style/index.css";

const ACCOUNT_TYPE_IS_INDIVIDUAL = 1;
const ACCOUNT_TYPE_IS_CORPORATE = 2;

class CarOwnersOnly extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      accountType: ACCOUNT_TYPE_IS_INDIVIDUAL,
      clickToEdit: false,
      savedAccountType: "",
      editView: false,
      completeStatus:
        user && user.stripe_connect_account_id == null ? false : true,
      isOpen: false
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({
      completeStatus:
        user && user.stripe_connect_account_id == null ? false : true
    });

    if (user.stripe_connect_account_id == null) {
      this.setState({ accountType: ACCOUNT_TYPE_IS_INDIVIDUAL });
    } else {
      this.setState({ accountType: "" });
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (prevProps.isOpne !== this.props.isOpne) {
      this.handleClick();
      setTimeout(() => {
        var element = document.getElementById("ownersOnlyAccordion");
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }, 50);
    }

    if (prevProps.user !== this.props.user) {
      this.setState({
        completeStatus:
          user && user.stripe_connect_account_id == null ? false : true
      });
      if (user.stripe_connect_account_id == null) {
        this.setState({ accountType: ACCOUNT_TYPE_IS_INDIVIDUAL });
      } else {
        this.setState({ accountType: "" });
      }
    }
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  handleClick = () => {
    this.divElement.click();
  };

  handleEdit = data => {
    this.setState({
      clickToEdit: true,
      savedAccountType: data,
      editView: true,
      accountType:
        data == "individual"
          ? ACCOUNT_TYPE_IS_INDIVIDUAL
          : ACCOUNT_TYPE_IS_CORPORATE
    });
  };

  afterSubmit = () => {
    this.setState({ completeStatus: true, clickToEdit: false });
  };

  handleCloseCarOwnersOnly = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen }, () => this.props.handleMessage(!isOpen));
  };

  render() {
    const {
      accountType,
      clickToEdit,
      savedAccountType,
      editView,
      completeStatus
    } = this.state;
    const { user, usStates, accordionDisableStatus } = this.props;

    return (
      <AccordionItem className="accordion__item" id="ownersOnlyAccordion">
        <div onClick={() => this.handleCloseCarOwnersOnly()}>
          <AccordionItemTitle>
            <h3 className=" u-position-relative u-margin-bottom-s">
              Car owners only
              <div className="Prof_list_complete">
                {completeStatus && (
                  <img src="/images/profilev2/icon-correct.svg" />
                )}
              </div>
              <div
                ref={div => (this.divElement = div)}
                className="accordion__arrow"
                role="presentation"
              />
            </h3>
          </AccordionItemTitle>
          <AccordionItemBody>
            {!completeStatus || clickToEdit ? (
              <div className="Prof_form_details_box">
                {!accordionDisableStatus ? (
                  <Fragment>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="Prof_owner_desc">
                          Please choose Individual option if you operate your
                          business as an individual or choose corporate option
                          if you operate your business as a registered company
                          on this platform.
                        </div>
                        <div>
                          <Radio.Group
                            onChange={e =>
                              this.setState({ accountType: e.target.value })
                            }
                            value={accountType}
                            className="Prof_owner_radiogroup"
                          >
                            {!editView ? (
                              <Fragment>
                                <Radio value={ACCOUNT_TYPE_IS_INDIVIDUAL}>
                                  Individual
                                </Radio>
                                <Radio value={ACCOUNT_TYPE_IS_CORPORATE}>
                                  Corporate
                                </Radio>
                              </Fragment>
                            ) : savedAccountType == "individual" ? (
                              <Radio value={ACCOUNT_TYPE_IS_INDIVIDUAL}>
                                Individual
                              </Radio>
                            ) : (
                              <Radio value={ACCOUNT_TYPE_IS_CORPORATE}>
                                Corporate
                              </Radio>
                            )}
                          </Radio.Group>
                        </div>
                      </div>
                    </div>
                    {accountType === 1 || savedAccountType == "individual" ? (
                      <IndividualAccount
                        user={user}
                        page="profile"
                        editView={editView}
                        submitted={this.afterSubmit}
                      />
                    ) : (
                      <CorporateAccount
                        user={user}
                        page="profile"
                        usStates={usStates}
                        editView={editView}
                        submitted={this.afterSubmit}
                      />
                    )}
                  </Fragment>
                ) : (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="Prof_notifimessage">
                        <span>
                          Please fill personal information section first.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <PaymentAccountView user={user} handleEdit={this.handleEdit} />
            )}
          </AccordionItemBody>
        </div>
      </AccordionItem>
    );
  }
}
export default CarOwnersOnly;
