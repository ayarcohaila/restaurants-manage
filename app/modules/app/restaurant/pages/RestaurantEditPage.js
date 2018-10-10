import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import Select from 'react-select';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  PageHeader,
  ControlLabel,
  InputGroup,
} from 'react-bootstrap';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import 'react-datepicker/dist/react-datepicker.css';
import {
  restaurantLoadRequest,
  updateRestaurantField,
  restaurantSaveRequest,
  loadNewRestaurant,
} from '../redux/actions';
import {
  makeSelectRestaurant,
  makeSelectRestaurantLoading,
} from '../redux/selectors';
import { makeSelectUserList } from '../../user/redux/selectors';

import './style.css';

class RestaurantEditPage extends Component {
  componentWillMount() {
    this.loadRestaurant(this.props.match.params.id); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.loadRestaurant(nextProps.match.params.id);
    }
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.restaurantSave();
    this.props.history.push(`/restaurants`); // eslint-disable-line
  };

  onUpdateField = field => evt => {
    this.props.updateField(field, evt.target.value);
  };

  onOwnerChange = e => {
    this.props.updateField('user', e.value);
  };

  loadRestaurant = id => {
    const { restaurantLoad } = this.props;
    if (id === 'new') {
      this.props.loadNewRestaurant();
    } else {
      restaurantLoad(id);
    }
  };

  formatUserOptions = () => {
    const { users } = this.props;
    const owners = users.toJS().filter(user => user.role === 'owner');
    return owners.map(owner => ({
      value: owner._id,
      label: `${owner.firstName} ${owner.lastName}`,
    }));
  };

  render() {
    const { restaurant, currentUser } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col xs={6} xsOffset={3}>
            <PageHeader>
              {restaurant.get('_id') ? 'Edit Restaurant' : 'New Restaurant'}
            </PageHeader>
            <Form horizontal onSubmit={this.onSubmit}>
              <FormGroup controlId="name">
                <Col componentClass={ControlLabel} sm={3}>
                  Name
                </Col>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroup.Addon>@</InputGroup.Addon>
                    <FormControl
                      value={restaurant.get('name') || ''}
                      onChange={this.onUpdateField('name')}
                      placeholder="Name"
                      required
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
              {currentUser.get('role') === 'admin' && (
                <FormGroup controlId="owner">
                  <Col componentClass={ControlLabel} sm={3}>
                    Owner :
                  </Col>
                  <Col sm={9}>
                    <Select
                      options={this.formatUserOptions()}
                      value={this.formatUserOptions().filter(
                        item => item.value === restaurant.toJS().user,
                      )}
                      isSearchable={false}
                      onChange={this.onOwnerChange}
                      placeholder="Please choose an Owner"
                    />
                  </Col>
                </FormGroup>
              )}
              <Col smOffset={4}>
                <Button bsStyle="primary" type="submit">
                  Save
                </Button>
                &nbsp;
                <Link
                  className="signup-link btn btn-default"
                  role="button"
                  to="/restaurants"
                  href="/restaurants"
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

RestaurantEditPage.propTypes = {
  restaurantSave: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  restaurantLoad: PropTypes.func.isRequired,
  loadNewRestaurant: PropTypes.func.isRequired,
  restaurant: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  restaurant: makeSelectRestaurant(),
  currentUser: makeSelectCurrentUser(),
  loading: makeSelectRestaurantLoading(),
  users: makeSelectUserList(),
});

const mapDispatchToProps = {
  restaurantLoad: restaurantLoadRequest,
  updateField: updateRestaurantField,
  restaurantSave: restaurantSaveRequest,
  loadNewRestaurant,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RestaurantEditPage);
