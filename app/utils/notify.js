export default function initialize(store) {
  const showNotification = (heading, message, type = 'danger') => {
    store.dispatch({
      type: 'global/set_global_notification',
      heading,
      message,
      visible: true,
      messageType: type,
    });
  };

  return {
    success(message, heading = 'Success') {
      showNotification(heading, message, 'success');
    },
    error(message, heading = 'Error') {
      showNotification(heading, message, 'danger');
    },
  };
}
