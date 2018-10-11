import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StarRatings from 'react-star-ratings';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  PageHeader,
} from 'react-bootstrap';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import {
  reviewLoadRequest,
  updateReviewField,
  reviewSaveRequest,
  loadNewReview,
} from '../redux/actions';
import { makeSelectReview, makeSelectReviewLoading } from '../redux/selectors';

class ReviewEditPage extends Component {
  componentWillMount() {
    this.loadReview(this.props.match.params.reviewId); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.reviewId !== this.props.match.params.reviewId) {
      this.loadReview(nextProps.match.params.reviewId);
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const restaurantId = this.props.match.params.id; // eslint-disable-line
    this.props.reviewSave(restaurantId);
    this.props.history.push(`/restaurants/${restaurantId}/reviews`); // eslint-disable-line
  };

  onUpdateField = field => evt => {
    this.props.updateField(field, evt.target.value);
  };

  onUpdateDropdown = field => (evt, data) => {
    this.props.updateField(field, data.value);
  };

  onStarClick = nextValue => {
    this.props.updateField('rate', nextValue);
  };

  handleDateChange = date => {
    this.props.updateField('date', date);
  };

  loadReview = reviewId => {
    const { reviewLoad } = this.props;
    const restaurantId = this.props.match.params.id;
    if (reviewId === 'new') {
      this.props.loadNewReview();
    } else {
      reviewLoad(reviewId, restaurantId);
    }
  };

  render() {
    const { review, currentUser } = this.props;
    const restaurantId = this.props.match.params.id;

    return (
      <Grid fluid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <PageHeader>
              {review.get('_id') ? 'Edit Review' : 'New Review'}
            </PageHeader>
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup controlId="rate">
                <Col componentClass={ControlLabel} sm={3}>
                  Rate: {review.get('rate')}
                </Col>
                <Col sm={9}>
                  <StarRatings
                    numberOfStars={5}
                    starRatedColor="rgb(255, 180, 0)"
                    changeRating={this.onStarClick}
                    rating={review.get('rate') || 0}
                    starDimension="20px"
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="date">
                <Col componentClass={ControlLabel} sm={3}>
                  Visite Date:
                </Col>
                <Col sm={9}>
                  <DatePicker
                    className="form-control"
                    selected={moment(review.get('date')) || moment()}
                    onChange={this.handleDateChange}
                    dateFormat="LL"
                    todayButton="Today"
                    maxDate={moment()}
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="comment">
                <Col componentClass={ControlLabel} sm={3}>
                  Comment
                </Col>
                <Col sm={9}>
                  <FormControl
                    componentClass="textarea"
                    value={review.get('comment') || ''}
                    onChange={this.onUpdateField('comment')}
                    placeholder="Comment..."
                    rows={10}
                    required
                  />
                </Col>
              </FormGroup>
              {currentUser.get('role') === 'admin' && (
                <FormGroup controlId="reply">
                  <Col componentClass={ControlLabel} sm={3}>
                    Reply
                  </Col>
                  <Col sm={9}>
                    <FormControl
                      componentClass="textarea"
                      value={review.get('reply') || ''}
                      onChange={this.onUpdateField('reply')}
                      placeholder="Reply..."
                      rows={2}
                    />
                  </Col>
                </FormGroup>
              )}
              <Col sm={6} className="header-btn">
                <Button bsStyle="primary" type="submit">
                  Save
                </Button>&nbsp;&nbsp;
                <Link
                  className="signup-link btn btn-default"
                  role="button"
                  to={`/restaurants/${restaurantId}/reviews`}
                  href={`/restaurants/${restaurantId}/reviews`}
                >
                  Cancel
                </Link>
              </Col>
            </Form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ReviewEditPage.propTypes = {
  reviewSave: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  reviewLoad: PropTypes.func.isRequired,
  loadNewReview: PropTypes.func.isRequired,
  review: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  review: makeSelectReview(),
  currentUser: makeSelectCurrentUser(),
  loading: makeSelectReviewLoading(),
});

const mapDispatchToProps = {
  reviewLoad: reviewLoadRequest,
  updateField: updateReviewField,
  reviewSave: reviewSaveRequest,
  loadNewReview,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ReviewEditPage);
