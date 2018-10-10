import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import StarRatings from 'react-star-ratings';
import {
  Button,
  Grid,
  Row,
  Col,
  Table,
  Modal,
  FormControl,
} from 'react-bootstrap';
import {
  reviewListRequest,
  reviewReplyRequest,
  reviewDeleteRequest,
} from '../redux/actions';
import {
  makeSelectReviewList,
  makeSelectReviewListLoading,
} from '../redux/selectors';

class ReviewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyConfirm: false,
      showDeleteConfirm: false,
      replyText: '',
      selectedReviewId: '',
    };
  }

  componentDidMount() {
    const restaurantId = this.props.match.params.id; // eslint-disable-line
    this.props.reviewList(restaurantId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { showReplyConfirm } = this.state;
    const restaurantId = this.props.match.params.id;

    if (nextState.showReplyConfirm !== showReplyConfirm) {
      this.props.reviewList(restaurantId);
      this.setState({ replyText: '' });
    }
    return true;
  }

  handleReplyConfirm = () => {
    const restaurantId = this.props.match.params.id;
    const { replyText, selectedReviewId } = this.state;

    this.props.replyComment(restaurantId, selectedReviewId, replyText);
    this.setState({ showReplyConfirm: false });
  };

  handleCancel = () => {
    this.setState({ showReplyConfirm: false });
  };

  onReplyChange = e => {
    this.setState({ replyText: e.target.value });
  };

  onReply = reviewId => {
    this.setState({ showReplyConfirm: true, selectedReviewId: reviewId });
  };

  onDelete = deleteId => () => {
    this.setState({ deleteId, showDeleteConfirm: true });
  };

  handleDeleteConfirm = () => {
    this.props.reviewDelete(this.state.deleteId, this.props.match.params.id);
    this.setState({ showDeleteConfirm: false });
  };

  handleDeleteCancel = () => this.setState({ showDeleteConfirm: false });

  formatReviewsData = () => {
    const { reviews } = this.props;
    if (!reviews.toJS().length) {
      return '';
    }
    const minRateId = reviews
      .toJS()
      .filter(
        item =>
          item.rate ===
          Math.min(...reviews.toJS().map(element => element.rate)),
      )[0]._id;
    const maxRateId = reviews
      .toJS()
      .filter(
        item =>
          item.rate ===
          Math.max(...reviews.toJS().map(element => element.rate)),
      )[0]._id;

    const averageRate =
      reviews
        .toJS()
        .map(item => item.rate)
        .reduce((a, b) => a + b, 0) / reviews.toJS().length;

    return [
      {
        header: 'Overall Averate Rate',
        value: averageRate,
      },
      {
        header: 'Max-rated Review',
        id: maxRateId,
      },
      {
        header: 'Min-rated Review',
        id: minRateId,
      },
    ];
  };

  sortReviewsByDate = reviews =>
    reviews
      .toJS()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  renderDeleteConfirmDialog = () => {
    const { showDeleteConfirm } = this.state;

    return (
      <Modal show={showDeleteConfirm} onHide={this.handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this Review?</Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.handleDeleteConfirm}>
            Delete&nbsp;
          </Button>
          <Button bsStyle="primary" onClick={this.handleDeleteCancel}>
            Cancel&nbsp;
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderReplyDialog = () => {
    const { showReplyConfirm, replyText } = this.state;
    return (
      <Modal show={showReplyConfirm} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Reply Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            componentClass="textarea"
            value={replyText}
            onChange={this.onReplyChange}
            placeholder="Reply..."
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="info" onClick={this.handleReplyConfirm}>
            Submit
          </Button>
          <Button bsStyle="danger" onClick={this.handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderReview = review => {
    const { currentUser } = this.props;
    const restaurantId = this.props.match.params.id;
    return (
      <tr key={review._id}>
        <td>{moment(review.date).format('MMM DD YYYY')}</td>
        <td>
          <StarRatings
            numberOfStars={5}
            starRatedColor="rgb(255, 180, 0)"
            rating={review.rate}
            starDimension="20px"
            starSpacing="1px"
            isSelectable={false}
          />
        </td>
        <td>{review.comment}</td>
        {/* eslint-disable */}
        <td>
          {!review.reply ? (
            currentUser.get('role') === 'user' ? (
              ''
            ) : (
              <Button
                disabled={review.reply.length !== 0}
                bsStyle="success"
                onClick={() => this.onReply(review._id)}
              >
                {review.reply.length !== 0 ? 'Replied' : 'Reply'}
              </Button>
            )
          ) : (
            review.reply
          )}
        </td>
        {/* eslint-enable */}
        {currentUser.get('role') !== 'user' && (
          <td>
            {currentUser.get('role') === 'admin' && (
              <Link
                className="signup-link btn btn-info"
                role="button"
                to={`/restaurants/${restaurantId}/reviews/${review._id}`}
                href={`/restaurants/${restaurantId}/reviews/${review._id}`}
              >
                Edit
              </Link>
            )}
            &nbsp;&nbsp;
            {currentUser.get('role') === 'admin' && (
              <Button bsStyle="danger" onClick={this.onDelete(review._id)}>
                Delete
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  };

  render() {
    const { reviews, currentUser } = this.props;
    const restaurantId = this.props.match.params.id;
    if (!reviews.toJS().length) {
      return (
        <Grid>
          <Row className="page-header">
            <Col sm={6}>
              <h2>No Reviews</h2>
            </Col>
            <Col sm={6} className="header-btn">
              {currentUser.get('role') !== 'owner' && (
                <Link
                  className="signup-link btn btn-primary"
                  role="button"
                  to={`/restaurants/${restaurantId}/reviews/new`}
                  href={`/restaurants/${restaurantId}/reviews/new`}
                >
                  Add
                </Link>
              )}
            </Col>
          </Row>
        </Grid>
      );
    }

    return (
      <Grid>
        <Row>
          {this.renderReplyDialog()}
          {this.renderDeleteConfirmDialog()}
          <Row className="page-header">
            <Col sm={6}>
              <h2>Review{reviews.toJS().length !== 1 && 's'}</h2>
            </Col>
            <Col sm={6} className="header-btn">
              {currentUser.get('role') !== 'owner' && (
                <Link
                  className="signup-link btn btn-primary"
                  role="button"
                  to={`/restaurants/${restaurantId}/reviews/new`}
                  href={`/restaurants/${restaurantId}/reviews/new`}
                >
                  Add
                </Link>
              )}
            </Col>
          </Row>
          {this.formatReviewsData().map((item, idx) => {
            if (idx === 0) {
              return (
                <h3 key={`key_${item.header}`}>
                  {`Overall Average Rate (${reviews.toJS().length} review${
                    reviews.toJS().length !== 1 ? 's' : ''
                  }): ${item.value.toFixed(2)}`}
                </h3>
              );
            }
            return (
              <Row key={`key_${item.header}`}>
                <Col sm={2}>
                  <h4>{item.header}</h4>
                </Col>
                <Col sm={10}>
                  <Table className="review-table" striped>
                    <thead>
                      <tr>
                        <th>Visite Date</th>
                        <th>Rate</th>
                        <th>Comment</th>
                        <th>Reply</th>
                        {currentUser.get('role') === 'owner' && <th />}
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderReview(
                        reviews
                          .toJS()
                          .filter(element => element._id === item.id)[0],
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            );
          })}
          <Row>
            <Col sm={2}>
              <h4>Last Reviews</h4>
            </Col>
            <Col sm={10}>
              <Table className="review-table" striped>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Rate</th>
                    <th>Comment</th>
                    <th>Reply</th>
                    {currentUser.get('role') === 'owner' && <th />}
                  </tr>
                </thead>
                <tbody>
                  {this.sortReviewsByDate(reviews).map(item =>
                    this.renderReview(item),
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Row>
      </Grid>
    );
  }
}

ReviewsPage.propTypes = {
  reviewList: PropTypes.func.isRequired,
  replyComment: PropTypes.func.isRequired,
  reviewDelete: PropTypes.func.isRequired,
  reviews: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reviews: makeSelectReviewList(),
  loading: makeSelectReviewListLoading(),
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = {
  reviewList: reviewListRequest,
  replyComment: reviewReplyRequest,
  reviewDelete: reviewDeleteRequest,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ReviewsPage);
