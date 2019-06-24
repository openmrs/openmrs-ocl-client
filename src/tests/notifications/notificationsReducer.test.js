import {
  CLEAR_NOTIFICATIONS,
  DELETE_NOTIFICATION,
  UPSERT_NOTIFICATION
} from '../../redux/actions/notifications';
import notificationsReducer from '../../redux/reducers/notificationsReducer';

describe('notificationsReducer', () => {
  const notification = {
    id: 1,
    message: 'test notification',
  };
  const upsertAction = {
    type: UPSERT_NOTIFICATION,
    payload: notification,
  };

  describe(UPSERT_NOTIFICATION, () => {
    it('should add a notification if it does not exist', () => {
      expect(notificationsReducer([], upsertAction)).toEqual([notification]);
    });

    it('should update a notification if it exists', () => {
      const updatedNotification = { ...notification, message: 'updated notification' };
      const previousState = notificationsReducer([], upsertAction);
      expect(notificationsReducer(previousState, {
        type: UPSERT_NOTIFICATION,
        payload: updatedNotification,
      })).toEqual(
        [updatedNotification],
      );
    });
  });

  describe(DELETE_NOTIFICATION, () => {
    it('should remove an existing notification', () => {
      const previousState = notificationsReducer([], upsertAction);
      expect(notificationsReducer(previousState, {
        type: DELETE_NOTIFICATION,
        payload: { id: notification.id },
      })).toEqual([]);
    });
  });

  describe(CLEAR_NOTIFICATIONS, () => {
    it('should delete all notifications', () => {
      const previousState = notificationsReducer([], upsertAction);
      expect(notificationsReducer(previousState, { type: CLEAR_NOTIFICATIONS })).toEqual([]);
    });
  });
});
