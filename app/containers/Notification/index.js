import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { AlertList } from 'react-bs-notifier';
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
    if (!notification.get('visible')) {
      return null;
    }

    const newAlert = [
      {
        id: new Date().getTime(),
        type:
          notification.get('type') === 'error'
            ? 'danger'
            : notification.get('type'),
        headline: `${notification.get('heading')}!`,
        message: notification.get('message'),
      },
    ];

    return <AlertList position="top-right" timeout={3} alerts={newAlert} />;
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
