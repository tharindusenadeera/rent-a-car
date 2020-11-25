import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import {
  fetchReviewsAboutMe,
  fetchReviewsByMe
} from "../../../actions/ProfileActions";
import ReviewAboutMe from "./reviewsAboutMe";
import ReviewByMe from "./reviewsByMe";
import ProfilePagination from "../lib/ProfilePagination";
import Empty from "../Empty";
import PreLoader from "../../../components/preloaders/preloaders";
import "antd/lib/tabs/style/index.css";
import "./style.css";
const TabPane = Tabs.TabPane;

class ReviewsContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "1",
      fetching: false,
      page: 1
    };
  }
  setActiveKey = key => {
    this.setState({ activeKey: key });
  };

  onChangePagination = page => {
    const { dispatch } = this.props;
    this.setState({ page });
    dispatch(fetchReviewsAboutMe({ page: page }));
  };

  onChangePaginationTabTwo = page => {
    const { dispatch } = this.props;
    this.setState({ page });
    dispatch(fetchReviewsByMe({ page: page }));
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchReviewsAboutMe());
    dispatch(fetchReviewsByMe());
  }

  render() {
    const { isFetching } = this.props;
    const reviewsAboutMe = this.props.reviewsAboutMe.reviews_about_me;
    const reviewsByMe = this.props.reviewsByMe.given_reviews;
    const reviewsAboutMeMeta = this.props.reviewsAboutMe.meta;
    const reviewsByMeMeta = this.props.reviewsByMe.meta;

    return (
      <div className="reviews-buttons-wrapper">
        {isFetching && (
          <div className="preloader">
            <PreLoader />
          </div>
        )}
        <Tabs
          onChange={this.setActiveKey}
          activeKey={this.state.activeKey}
          onTabClick={this.setActiveKey}
        >
          {/* Tab  One */}
          <TabPane
            tab={`Reviews about me (${
              reviewsAboutMeMeta ? reviewsAboutMeMeta.pagination.total : 0
            })`}
            key="1"
          >
            {reviewsAboutMe && reviewsAboutMe.length > 0 && (
              <ReviewAboutMe reviews={reviewsAboutMe} />
            )}

            {reviewsAboutMeMeta &&
              reviewsAboutMeMeta.pagination.total_pages > 1 && (
                <ProfilePagination
                  onChange={this.onChangePagination}
                  total={reviewsAboutMeMeta.pagination.total}
                  pageSize={reviewsAboutMeMeta.pagination.per_page}
                  current={this.state.page}
                />
              )}

            {reviewsAboutMe &&
              reviewsAboutMe.length === 0 &&
              this.props.isFetching === false && (
                <Empty match={this.props.match} />
              )}
          </TabPane>

          {/* Tab  Two */}
          <TabPane
            tab={`Reviews by me (${
              reviewsByMeMeta ? reviewsByMeMeta.pagination.total : 0
            })`}
            key="2"
          >
            {reviewsByMe && reviewsByMe.length > 0 && (
              <ReviewByMe reviews={reviewsByMe} />
            )}

            {reviewsByMeMeta && reviewsByMeMeta.pagination.total_pages > 1 && (
              <ProfilePagination
                onChange={this.onChangePaginationTabTwo}
                total={reviewsByMeMeta.pagination.total}
                pageSize={reviewsByMeMeta.pagination.per_page}
                current={this.state.page}
              />
            )}

            {reviewsByMe &&
              reviewsByMe.length === 0 &&
              this.props.isFetching === false && (
                <Empty match={this.props.match} />
              )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    reviewsAboutMe: state.profile.reviewsAboutMe,
    reviewsByMe: state.profile.reviewsByMe,
    isFetching: state.profile.isFetching
  };
};
export default connect(mapStateToProps)(ReviewsContent);
