import React, { Component } from "react";
import Rating from "react-rating";
import { Table } from "antd";
import "antd/lib/table/style/index.css";
import axios from "axios";
import ReviewSnipet from "./ReviewSnipet";
import "antd/lib/pagination/style/index.css";
import { authFail } from "../../actions/AuthAction";

class ReviewsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: []
    };
  }

  componentDidMount() {
    this._loadReviews(this.props.car_id);
  }

  _loadReviews = async id => {
    try {
      const response = await await axios.get(
        `${process.env.REACT_APP_API_URL}v2/car/reviews/${id}`,
        {
          headers: {
            Authorization: localStorage.access_token
          }
        }
      );
      if (!response.data.error) {
        this.setState({ reviews: response.data.reviews });
      }
    } catch (error) {
      this.props.dispatch(authFail(error));
    }
  };

  setColumns = () => {
    return [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
          return <ReviewSnipet rowData={record} />;
        }
      }
    ];
  };

  render() {
    const { car } = this.props;
    const { reviews } = this.state;

    if (!reviews.length) {
      return <React.Fragment />;
    }

    return (
      <div className="car-reviews-section">
        <div className="flex-header">
          <h2 className="car-info-head">{this.state.reviews.length} Reviews</h2>
          {car && car.user.user_rating ? (
            <Rating
              emptySymbol="fa fa-star-o fa-1x"
              fullSymbol="fa fa-star fa-1x"
              fractions={2}
              readonly
              initialRating={car.user.user_rating}
            />
          ) : null}
        </div>
        {/* First 5reviews should show */}
        {reviews.length > 0 && (
          <Table
            rowKey={data => data._id}
            dataSource={reviews}
            columns={this.setColumns()}
            showHeader={false}
            bordered={false}
            pagination={reviews.length <= 5 ? false : { pageSize: 5 }}
          />
        )}
      </div>
    );
  }
}

export default ReviewsGrid;
