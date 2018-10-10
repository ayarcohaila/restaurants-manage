import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import AuthModule from 'modules/auth';
import AppModule from 'modules/app';
import reducer from 'modules/auth/redux/reducers';
import saga from 'modules/auth/redux/saga';
import {
  makeSelectCurrentUser,
  makeSelectPersistLoaded,
} from './redux/selectors';

class RootApp extends Component {
  renderApp = () => {
    const { currentUser } = this.props;
    return currentUser ? <AppModule /> : <AuthModule />;
  };

  render() {
    const { persistLoaded } = this.props;
    if (!persistLoaded) {
      return null;
    }

    return (
      <div className="app">
        <Helmet titleTemplate="%s - Restaurants" defaultTitle="Restaurants">
          <meta name="description" content="Restaurants Application" />
        </Helmet>

        <Switch>
          <Route path="/" render={this.renderApp} />
        </Switch>
      </div>
    );
  }
}

RootApp.propTypes = {
  currentUser: PropTypes.object,
  persistLoaded: PropTypes.bool.isRequired,
};

RootApp.defaultProps = {
  currentUser: null,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  persistLoaded: makeSelectPersistLoaded(),
});

const withReducer = injectReducer({ key: 'auth', reducer });
const withSaga = injectSaga({ key: 'auth', saga });
const withConnect = connect(mapStateToProps);

export default withRouter(
  compose(
    withReducer,
    withSaga,
    withConnect,
  )(RootApp),
);
