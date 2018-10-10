import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Alert } from 'react-bootstrap';
import { setGlobalNotification } from 'containers/App/redux/actions';
import { makeSelectNotification } from 'containers/App/redux/selectors';

class Notification extends Component {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.notification.get('visible') !==
      this.props.notification.get('visible')
    ) {
      if (nextProps.notification.get('visible')) {
        this.timeout = setTimeout(() => {
          this.onDismiss();
        }, 5000);
      } else {
        clearTimeout(this.timeout);
      }
    }
  }

  onDismiss = () => {
    this.props.setNotification('', '', false);
  };

  render() {
    const { notification } = this.props;
    const type = notification.get('type');
    if (!notification.get('visible')) {
      return null;
    }

    return (
      <Alert
        bsStyle={`${type === 'error' ? 'danger' : type}`}
        onDismiss={this.onDismiss}
      >
        <h4>{notification.get('heading')}</h4>
        <p>{notification.get('message')}</p>
      </Alert>
    );
  }
}

Notification.propTypes = {
  setNotification: PropTypes.func.isRequired,
  notification: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notification: makeSelectNotification(),
});

const mapDispatchToProps = {
  setNotification: setGlobalNotification,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Notification);
