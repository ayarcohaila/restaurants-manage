import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import StarRatings from 'react-star-ratings';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import Loading from 'components/LoadingIndicator';
import { Button, Grid, Row, Col, Table, Modal } from 'react-bootstrap';
import {
  restaurantListRequest,
  restaurantDeleteRequest,
} from '../redux/actions';
import { reviewListRequest } from '../../review/redux/actions';
import { userListRequest } from '../../user/redux/actions';
import {
  makeSelectRestaurantList,
  makeSelectRestaurantListLoading,
} from '../redux/selectors';

const MARKS = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' };

class RestaurantsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteId: null,
      showDeleteConfirm: false,
      from: 0,
      to: 5,
    };
  }

  componentWillMount() {
    const { currentUser } = this.props;
    this.props.restaurantList();

    if (currentUser.get('role') === 'admin') {
      this.props.userList();
    }
  }

  onDelete = deleteId => () => {
    this.setState({ deleteId, showDeleteConfirm: true });
  };

  onChangeFilter = (filterName, value) => {
    this.setState({ [filterName]: value });
  };

  onFilterChange = range => {
    this.setState({ from: range[0], to: range[1] });
  };

  handleConfirm = () => {
    this.props.restaurantDelete(this.state.deleteId);
    this.setState({ showDeleteConfirm: false });
  };

  handleCancel = () => this.setState({ showDeleteConfirm: false });

  renderConfirmDialog = () => {
    const { showDeleteConfirm } = this.state;

    return (
      <Modal show={showDeleteConfirm} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this Restaurant?</Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.handleConfirm}>
            Delete
          </Button>
          <Button bsStyle="primary" onClick={this.handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  sortByRate = restaurants =>
    restaurants.toJS().sort((a, b) => b.average - a.average);

  renderRestaurants = restaurants => {
    const { currentUser } = this.props;
    const { from, to } = this.state;
    if (!restaurants.size) {
      return (
        <tr>
          <td colSpan="6">No Restaurants</td>
        </tr>
      );
    }

    return this.sortByRate(restaurants)
      .filter(item => from <= item.average && item.average <= to)
      .map((restaurant, idx) => (
        <tr key={restaurant._id}>
          <td>{idx + 1}</td>
          <td>{restaurant.name}</td>
          {currentUser.get('role') !== 'owner' && (
            <td>
              {!restaurant.user
                ? '-'
                : `${restaurant.user.firstName} ${restaurant.user.lastName}`}
            </td>
          )}
          <td>
            {restaurant.average === null ? (
              'No rate'
            ) : (
              <StarRatings
                rating={restaurant.average}
                isSelectable={false}
                starRatedColor="rgb(255, 180, 0)"
                starDimension="20px"
                starSpacing="1px"
              />
            )}
          </td>
          <td>
            {currentUser.get('role') === 'user' && (
              <Link
                className="btn btn-primary"
                role="button"
                to={`/restaurants/${restaurant._id}/reviews/new`}
                href={`/restaurants/${restaurant._id}/reviews/new`}
              >
                Comment
              </Link>
            )}&nbsp;&nbsp;
            <Link
              className="btn btn-success"
              role="button"
              to={`/restaurants/${restaurant._id}/reviews`}
              href={`/restaurants/${restaurant._id}/reviews`}
            >
              Details
            </Link>
            &nbsp;&nbsp;
            {currentUser.get('role') === 'admin' && (
              <Link
                className="signup-link btn btn-info"
                role="button"
                to={`/restaurants/${restaurant._id}`}
                href={`/restaurants/${restaurant._id}`}
              >
                Edit
              </Link>
            )}
            &nbsp;&nbsp;
            {currentUser.get('role') === 'admin' && (
              <Button bsStyle="danger" onClick={this.onDelete(restaurant._id)}>
                Delete
              </Button>
            )}
          </td>
        </tr>
      ));
  };

  render() {
    const { restaurants, currentUser, loading } = this.props;
    const { from, to } = this.state;

    if (loading) {
      return <Loading />;
    }
    return (
      <Grid>
        <Row>
          <Col>
            {this.renderConfirmDialog()}
            <Row className="page-header">
              <Col sm={6}>
                <h1>Restaurants</h1>
              </Col>
              <Col sm={6} className="header-btn">
                {currentUser.get('role') !== 'user' && (
                  <Link
                    className="signup-link btn btn-primary"
                    role="button"
                    to="/restaurants/new"
                    href="/restaurants/new"
                  >
                    Add
                  </Link>
                )}
              </Col>
            </Row>
            <Row className="page-header">
              <Col sm={4}>
                <h3>Filter by Rate</h3>
              </Col>
              <Col sm={8}>
                <Range
                  defaultValue={[0, 5]}
                  min={0}
                  max={5}
                  marks={MARKS}
                  value={[from, to]}
                  pushable
                  onChange={this.onFilterChange}
                />
              </Col>
            </Row>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  {currentUser.get('role') !== 'owner' && <th>Owner</th>}
                  <th>Average Rate</th>
                  <th />
                </tr>
              </thead>
              <tbody>{this.renderRestaurants(restaurants)}</tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    );
  }
}

RestaurantsPage.propTypes = {
  restaurantList: PropTypes.func.isRequired,
  restaurantDelete: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  restaurants: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  userList: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  restaurants: makeSelectRestaurantList(),
  loading: makeSelectRestaurantListLoading(),
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = {
  reviewList: reviewListRequest,
  restaurantList: restaurantListRequest,
  restaurantDelete: restaurantDeleteRequest,
  userList: userListRequest,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RestaurantsPage);
