import React, { Component, Fragment } from "react";
import { fetchStripeDetail } from "../../../../../api/owners";

class PaymentAccountView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account_type: "",
      bank_account_number: "",
      person_email: "",
      person_first_name: "",
      person_last_name: "",
      person_relationship_title: "",
      clickToEdit: false
    };
  }

  componentDidMount() {
    fetchStripeDetail().then(res => {
      if (res.data.details) {
        let bank_number = res.data.details.bank_account_number.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          " "
        );

        this.setState({
          account_type: res.data.details.account_type,
          person_email: res.data.details.person_email,
          bank_account_number: bank_number,
          person_first_name: res.data.details.person_first_name,
          person_last_name: res.data.details.person_last_name,
          person_relationship_title: res.data.person_relationship_title
        });
      }
    });
  }

  render() {
    const {
      account_type,
      bank_account_number,
      person_email,
      person_first_name,
      person_last_name,
      person_relationship_title,
      clickToEdit
    } = this.state;
    const { user } = this.props;

    return (
      <div className="Prof_owner_section">
        <div className="Prof_bankdetail Prof_flex_center">
          <div className="Prof_bankdetail_icon">
            <span className="icon-revamp-bank" />
          </div>
          <div className="Prof_bankdetail_desc">
            <span className="Prof_bankdetail_font18">
              {bank_account_number}
            </span>
            <span className="Prof_bankdetail_font14 grey">
              {user && user.bank_account_name}
            </span>
          </div>
          <div className="Prof_bankdetail_action">
            <button
              className="Prof_bankdetail_edit Prof_icon_btn"
              onClick={() =>
                this.setState({ clickToEdit: !clickToEdit }, () =>
                  this.props.handleEdit(account_type)
                )
              }
            >
              <span className="icon-revamp-edit" />
            </button>
          </div>
        </div>
        {account_type != "individual" ? (
          <Fragment>
            <hr className="Prof_dash_separater"></hr>

            <div className="Prof_bankdetail Prof_flex_center">
              <div className="Prof_bankdetail_icon">
                {user && user.profile_image_thumb ? (
                  <img src={user && user.profile_image_thumb} />
                ) : (
                  <img src={"/images/defaultprofile.jpg"} width="100%" />
                )}
              </div>
              <div className="Prof_bankdetail_desc">
                <span className="Prof_bankdetail_font18">
                  {person_first_name} {person_last_name}
                </span>
                <span className="Prof_bankdetail_font14">
                  {person_relationship_title}
                </span>
                <span className="Prof_bankdetail_font14 grey">
                  {person_email}
                </span>
              </div>
              <div className="Prof_bankdetail_action">
                {/* <button
                  className="Prof_bankdetail_edit Prof_icon_btn"
                  onClick={() => this.setState({ clickToEdit: !clickToEdit })}
                >
                  <span className="icon-revamp-edit" />
                </button> */}
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment />
        )}
      </div>
    );
  }
}

export default PaymentAccountView;
