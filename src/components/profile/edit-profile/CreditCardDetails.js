import React from "react";
import {
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";
import PreloaderIcon from "react-preloader-icon";
import Oval from "react-preloader-icon/loaders/Oval";
import { Input, Select, Radio } from "antd";
import JSEncrypt from "js-encript";
import CreditCardInput from "react-credit-card-input";
import { addCreditCard, setPrimaryCard } from "../../../actions/ProfileActions";
import { UPDATE_SUCCESS, UPDATE_ERROR } from "../../../actions/ActionTypes";
import { getLoggedInUser } from "../../../actions/UserActions";
const Option = Select.Option;

class CreditCardDetails extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props;
    this.state = {
      error: false,
      success: false,
      message: "",
      showForm: false,
      selectedCard: null,
      submitting: false,
      credit_card: user.credit_card,
      credit_card_first_name: "",
      credit_card_last_name: "",
      credit_card_number: "",
      cardType: "",
      card_expiry: "",
      credit_card_expiry_month: "",
      credit_card_expiry_year: "",
      credit_card_ccv: "",
      credit_card_street_address: "",
      credit_card_city: "",
      credit_card_state: "",
      credit_card_zip_code: "",
      credit_card_country: "US"
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getLoggedInUser());
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;

    if (this.props.success && prevProps.success === "") {
      this.setState(
        {
          submitting: false,
          success: true,
          message: this.props.success,
          credit_card_first_name: "",
          credit_card_last_name: "",
          credit_card_number: "",
          card_expiry: "",
          credit_card_expiry_month: "",
          credit_card_expiry_year: "",
          credit_card_ccv: "",
          credit_card_street_address: "",
          credit_card_city: "",
          credit_card_state: "",
          credit_card_zip_code: "",
          showForm: false
        },
        () => {
          setTimeout(() => {
            this.setState({ success: false, message: "" }, state => {
              this.props.dispatch({ type: UPDATE_SUCCESS, payload: "" });
            });
          }, 2000);
        }
      );
    }

    if (this.props.error && prevProps.error === "") {
      this.setState(
        { error: true, message: this.props.error, submitting: false },
        () => {
          setTimeout(() => {
            this.setState({ error: false, message: "" }, state => {
              this.props.dispatch({ type: UPDATE_ERROR, payload: "" });
            });
          }, 2000);
        }
      );
    }

    if (user.id && prevProps.user) {
      if (prevProps.user.credit_card_details !== user.credit_card_details) {
        const dfCd = user.credit_card_details.find(({ status }) => {
          return status == 1;
        });
        if (dfCd) {
          this.setState({ selectedCard: dfCd.id });
        }
      }
    }
  }

  encript = data => {
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(process.env.REACT_APP_RSA_PUBLIC_KEY);
    var encrypted = encrypt.encrypt(data);
    return encrypted;
  };

  handleCardNumberChange = e => {
    this.setState(
      {
        credit_card_number: e.target.value
      },
      () => {
        this._onChageCreditCardNumber(this.state.credit_card_number);
      }
    );
  };

  handleCardExpiryChange = e => {
    this.setState({
      card_expiry: e.target.value
    });
  };

  handleCardCVCChange = e => {
    this.setState({
      credit_card_ccv: e.target.value
    });
  };

  validateForm() {
    const {
      credit_card_first_name,
      credit_card_last_name,
      credit_card_number,
      card_expiry,
      credit_card_ccv,
      credit_card_street_address,
      credit_card_city,
      credit_card_state,
      credit_card_zip_code,
      credit_card_country
    } = this.state;

    if (credit_card_first_name === "" || credit_card_first_name === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_last_name === "" || credit_card_last_name === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_number === "" || credit_card_number === null) {
      this.setState({ error: true });
      return false;
    } else if (card_expiry === "" || card_expiry === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_ccv === "" || credit_card_ccv === null) {
      this.setState({ error: true });
      return false;
    } else if (
      credit_card_street_address === "" ||
      credit_card_street_address === null
    ) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_city === "" || credit_card_city === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_state === "" || credit_card_state === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_zip_code === "" || credit_card_zip_code === null) {
      this.setState({ error: true });
      return false;
    } else if (credit_card_country === "" || credit_card_country === null) {
      this.setState({ error: true });
      return false;
    } else {
      this.setState({ error: false, submitting: true }, () => {
        this.handleSave();
      });
    }
  }

  pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  handleSave() {
    const { dispatch } = this.props;
    const cardNumber = this.state.credit_card_number.replace(/ /g, "");
    const cardExpiry = this.state.card_expiry.split("/");
    const creditCardExpiryMonth = this.pad(parseInt(cardExpiry[0]), 2);
    const creditCardExpiryYear =
      "20" + cardExpiry[1].replace(/ /g, "").toString();

    const data = {
      credit_card_first_name: this.state.credit_card_first_name,
      credit_card_last_name: this.state.credit_card_last_name,
      credit_card_number: this.encript(cardNumber),
      credit_card_type: this.state.cardType,
      credit_card_expiry_month: this.encript(creditCardExpiryMonth),
      credit_card_expiry_year: this.encript(creditCardExpiryYear),
      credit_card_ccv: this.encript(this.state.credit_card_ccv),
      credit_card_street_address: this.state.credit_card_street_address,
      credit_card_city: this.state.credit_card_city,
      credit_card_state: this.state.credit_card_state,
      credit_card_zip_code: this.encript(this.state.credit_card_zip_code),
      credit_card_country: this.state.credit_card_country,
      focused: false
    };

    dispatch(addCreditCard(data));
  }

  handleChangePrimaryCard(value) {
    const { dispatch } = this.props;
    this.setState({ selectedCard: value }, () => {
      dispatch(setPrimaryCard(value));
    });
  }

  _onChageCreditCardNumber = number => {
    if (
      number.charAt(0) == 3 &&
      (number.charAt(1) == 4 || number.charAt(1) == 7)
    ) {
      this.setState({
        cardType: "American Express"
      });
    } else if (
      number.charAt(0) == 6 &&
      (number.charAt(2) == 0 || number.charAt(1) == 4 || number.charAt(1) == 5)
    ) {
      this.setState({
        cardType: "Discover"
      });
    } else if (
      number.charAt(0) == 3 &&
      (number.charAt(1) == 9 ||
        number.charAt(1) == 0 ||
        number.charAt(1) == 6 ||
        number.charAt(1) == 8)
    ) {
      this.setState({ cardType: "JCB" });
    } else if (
      number.charAt(0) == 3 &&
      (number.charAt(1) == 4 || number.charAt(1) == 7 || number.charAt(1) == 8)
    ) {
      this.setState({
        cardType: "Diners Club/ Carte Blanche"
      });
    } else if (number.charAt(0) == 4) {
      this.setState({ cardType: "Visa" });
    } else if (
      number.charAt(0) == 5 &&
      number.charAt(1) >= 1 &&
      number.charAt(1) <= 5
    ) {
      this.setState({
        cardType: "Mastercard"
      });
    }
  };

  render() {
    const {
      error,
      success,
      message,
      credit_card_first_name,
      credit_card_last_name,
      credit_card_number,
      card_expiry,
      credit_card_ccv,
      credit_card_street_address,
      credit_card_city,
      credit_card_state,
      credit_card_zip_code,
      credit_card_country
    } = this.state;

    const { usStates, countryArray, user } = this.props;
    return (
      <AccordionItem className="accordion__item">
        <AccordionItemTitle>
          <h3 className=" u-position-relative u-margin-bottom-s">
            Credit card details
            {user &&
              user.credit_card_details &&
              user.credit_card_details.length > 0 && (
                <div className="Prof_list_complete">
                  <img src="/images/profilev2/icon-correct.svg" />
                </div>
              )}
            <div className="accordion__arrow" role="presentation" />
          </h3>
        </AccordionItemTitle>
        <AccordionItemBody>
          {user &&
            user.credit_card_details &&
            user.credit_card_details.length > 0 && (
              <div className="Prof_card_details_box">
                <div className="row">
                  <Radio.Group
                    onChange={e => {
                      this.handleChangePrimaryCard(e.target.value);
                    }}
                    value={this.state.selectedCard}
                  >
                    {user.credit_card_details.map((card, index) => {
                      let iconPath = "";
                      if (card.type === "Visa") {
                        iconPath = "/images/profilev2/card-visa.svg";
                      } else if (card.type === "Amex") {
                        iconPath = "/images/profilev2/card-amex.svg";
                      } else if (card.type === "Mastercard") {
                        iconPath = "/images/profilev2/master-icon.png";
                      } else if (card.type === "American Express") {
                        iconPath =
                          "/images/profilev2/american-express-icon.png";
                      } else if (card.type === "JCB") {
                        iconPath = "/images/profilev2/jcb-icon.png";
                      } else if (card.type === "Discover") {
                        iconPath = "/images/profilev2/discover-icon.png";
                      } else if (card.type === "Diners Club") {
                        iconPath = "/images/profilev2/diners-club-icon.png";
                      } else {
                        iconPath = "/images/profilev2/card-visa.svg";
                      }

                      return (
                        <div className="col-md-4 col-xs-6" key={index}>
                          <Radio
                            value={card.id}
                            className="Prof_card_box-wrapper"
                          >
                            <div className="Prof_card_box">
                              <img src={iconPath} />
                              <div>{card.number}</div>
                            </div>
                          </Radio>
                        </div>
                      );
                    })}
                  </Radio.Group>
                </div>
              </div>
            )}

          {!this.state.showForm && (
            <div className="Prof_card_button_box">
              <div className="Prof_btn_add_box">
                <a
                  onClick={() => {
                    this.setState({ showForm: !this.state.showForm });
                  }}
                >
                  <img src="/images/support-center/create_icon.svg" />
                  <div className="Prof_btn_add">Add a new</div>
                </a>
              </div>
            </div>
          )}

          {/* Credit cards details - End */}

          {this.state.showForm && (
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_first_name && (
                      <label>
                        First Name
                        <span className="fields-requred">*</span>
                      </label>
                    )}

                    <Input
                      placeholder="First name *"
                      value={credit_card_first_name}
                      name="firstname"
                      onChange={e =>
                        this.setState({
                          credit_card_first_name: e.target.value
                        })
                      }
                      className={
                        error && !credit_card_first_name ? "error" : " "
                      }
                    />
                    {error && !credit_card_first_name && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_last_name && (
                      <label>
                        Last Name
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="Last name *"
                      value={credit_card_last_name}
                      name="lastname"
                      onChange={e =>
                        this.setState({
                          credit_card_last_name: e.target.value
                        })
                      }
                      className={error && !credit_card_last_name ? "error" : ""}
                    />
                    {error && !credit_card_last_name && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <div className="Prof_cardfield">
                    {credit_card_number && (
                      <label>
                        Card Number
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <CreditCardInput
                      cardNumberInputProps={{
                        value: credit_card_number,
                        onChange: this.handleCardNumberChange
                      }}
                      cardExpiryInputProps={{
                        value: card_expiry,
                        onChange: this.handleCardExpiryChange
                      }}
                      cardCVCInputProps={{
                        value: credit_card_ccv,
                        onChange: this.handleCardCVCChange
                      }}
                      // fieldClassName={
                      //   !credit_card_number
                      //     ? "error"
                      //     : "input"
                      // }
                    />
                    {error && !credit_card_number && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_street_address && (
                      <label>
                        Street Address
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="Street address *"
                      value={credit_card_street_address}
                      name="streetaddress"
                      onChange={e =>
                        this.setState({
                          credit_card_street_address: e.target.value
                        })
                      }
                      className={
                        error && !credit_card_street_address ? "error" : " "
                      }
                    />
                    {error && !credit_card_street_address && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_city && (
                      <label>
                        City
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      placeholder="City *"
                      name="cardcity"
                      className={error && !credit_card_city ? "error" : " "}
                      value={credit_card_city}
                      onChange={e =>
                        this.setState({
                          credit_card_city: e.target.value
                        })
                      }
                    />
                    {error && !credit_card_city && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_state && (
                      <label>
                        State
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Select
                      showSearch
                      placeholder="State *"
                      name="cardstate"
                      optionFilterProp="children"
                      value={credit_card_state ? credit_card_state : undefined}
                      onChange={e =>
                        this.setState({
                          credit_card_state: e
                        })
                      }
                      className={error && !credit_card_state ? "error" : ""}
                    >
                      {usStates &&
                        usStates.map((item, index) => {
                          return (
                            <Option key={index} value={item.code}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                    {error && !credit_card_state && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_zip_code && (
                      <label>
                        Zip code
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Input
                      type="number"
                      placeholder="Zip code *"
                      value={credit_card_zip_code}
                      name="zipcode"
                      onChange={e =>
                        this.setState({
                          credit_card_zip_code: e.target.value
                        })
                      }
                      className={error && !credit_card_zip_code ? "error" : " "}
                    />
                    {error && !credit_card_zip_code && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="text_field">
                    {credit_card_country && (
                      <label>
                        Country
                        <span className="fields-requred">*</span>
                      </label>
                    )}
                    <Select
                      showSearch
                      disabled={true}
                      placeholder="Country *"
                      optionFilterProp="children"
                      value={
                        credit_card_country ? credit_card_country : undefined
                      }
                      onChange={e =>
                        this.setState({
                          credit_card_country: e
                        })
                      }
                    >
                      {countryArray &&
                        countryArray.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.key}
                            </Option>
                          );
                        })}
                    </Select>
                    {error && !credit_card_country && (
                      <div className="Prof_error_txt">Required</div>
                    )}
                  </div>
                </div>
              </div>

              {success && message && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="Prof_msg_box success">
                      <img src="/images/profilev2/message_icon_sucess.svg" />
                      {message}
                    </div>
                  </div>
                </div>
              )}

              {error && message && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="Prof_msg_box failed">
                      <img src="/images/profilev2/message_icon_failed.svg" />
                      {message}
                    </div>
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-sm-12">
                  <div className="Prof_btn_box">
                    <button
                      className="Prof_btn Prof_btn_cancel"
                      onClick={() =>
                        this.setState({ showForm: !this.state.showForm })
                      }
                    >
                      CANCEL
                    </button>
                    <button
                      className="Prof_btn Prof_btn_submit"
                      onClick={() => this.validateForm()}
                    >
                      {this.state.submitting === true && (
                        <div style={{ paddingRight: "5px", paddingTop: "2px" }}>
                          <PreloaderIcon
                            loader={Oval}
                            size={20}
                            strokeWidth={8} // min: 1, max: 50
                            strokeColor="#fff"
                            duration={800}
                            style={{
                              float: "left"
                            }}
                          />
                        </div>
                      )}
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AccordionItemBody>
      </AccordionItem>
    );
  }
}
export default CreditCardDetails;
