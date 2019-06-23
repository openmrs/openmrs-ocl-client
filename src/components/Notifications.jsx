import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearAllNotifications } from '../redux/actions/notifications';

export class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    clearAllNotifications: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { clearAllNotifications: clearNotifications } = this.props;
    clearNotifications();
  }

  render() {
    const { notifications } = this.props;
    return (
      <div className="notifications">
        <div className="notification-container">
          {notifications.map(
            notification => (
              <span key={notification.id} className="notification notification-info">
                <span className="body align-self-center">{notification.message}</span>
                <i className="fas fa-info-circle align-self-center" />
              </span>
            ),
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications,
});

const mapDispatchToProps = dispatch => ({
  clearAllNotifications: () => dispatch(clearAllNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
