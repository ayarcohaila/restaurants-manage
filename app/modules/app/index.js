import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import Notification from 'containers/Notification';

import reducer from './redux/reducers';
import saga from './redux/saga';
import TopBar from './layout/TopBar';
import Dashboard from './dashboard';

import UsersPage from './user/pages/UsersPage';
import UserEditPage from './user/pages/UserEditPage';
import RestaurantsPage from './restaurant/pages/RestaurantsPage';
import RestaurantEditPage from './restaurant/pages/RestaurantEditPage';
import ReviewsPage from './review/pages/ReviewsPage';
import ReviewEditPage from './review/pages/ReviewEditPage';

import './style.css';

class App extends Component {
  adminRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/users/:id" component={UserEditPage} />
        <Route exact path="/restaurants" component={RestaurantsPage} />
        <Route exact path="/restaurants/:id" component={RestaurantEditPage} />
        <Route exact path="/restaurants/:id/reviews" component={ReviewsPage} />
        <Route
          exact
          path="/restaurants/:id/reviews/:reviewId"
          component={ReviewEditPage}
        />
        <Route
          exact
          path="/restaurants/:id/reviews/:reviewId"
          component={ReviewEditPage}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  userRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/restaurants" component={RestaurantsPage} />
        <Route
          exact
          path="/restaurants/:id/reviews/:reviewId"
          component={ReviewEditPage}
        />
        <Route exact path="/restaurants/:id/reviews" component={ReviewsPage} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  ownerRoutes() {
    return (
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/restaurants" component={RestaurantsPage} />
        <Route exact path="/restaurants/:id" component={RestaurantEditPage} />
        <Route exact path="/restaurants/:id/reviews" component={ReviewsPage} />
        <Route
          exact
          path="/restaurants/:id/reviews/:reviewId"
          component={ReviewEditPage}
        />

        <Route render={() => <Redirect to="/" />} />
      </Switch>
    );
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div className="main-app">
        <TopBar />
        <Notification />
        {this[`${currentUser.get('role')}Routes`]()}
      </div>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps);
const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default withRouter(
  compose(
    withReducer,
    withSaga,
    withConnect,
  )(App),
);
