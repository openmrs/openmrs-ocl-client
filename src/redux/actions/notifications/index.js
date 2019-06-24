export const UPSERT_NOTIFICATION = '[notifications] update notification';
export const DELETE_NOTIFICATION = '[notifications] delete notification';
export const CLEAR_NOTIFICATIONS = '[notifications] clear notifications';

export const upsertNotification = (id, message) => (
  {
    type: UPSERT_NOTIFICATION,
    payload: { id, message },
  }
);

export const deleteNotification = id => (
  {
    type: DELETE_NOTIFICATION,
    payload: { id },
  }
);

export const clearAllNotifications = () => (
  {
    type: CLEAR_NOTIFICATIONS,
  }
);
