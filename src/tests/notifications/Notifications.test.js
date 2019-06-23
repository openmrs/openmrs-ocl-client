import { shallow } from 'enzyme';
import React from 'react';
import { Notifications } from '../../components/Notifications';

describe('Notifications', () => {
  it('should render all notifications passed to it', () => {
    const notifications = [
      {
        id: 1,
        message: 'Test Notification',
      },
    ];
    const clearAllNotificationsMock = jest.fn();

    const notificationComponent = shallow(
      <Notifications
        notifications={notifications}
        clearAllNotifications={clearAllNotificationsMock}
      />,
    );

    expect(clearAllNotificationsMock).toHaveBeenCalled();
    expect(notificationComponent.find('.notification')).toHaveLength(notifications.length);
  });
});
