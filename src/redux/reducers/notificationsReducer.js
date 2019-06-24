import { cloneDeep } from 'lodash';
import {
  DELETE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
  UPSERT_NOTIFICATION,
} from '../actions/notifications';

const defaultState = [];

const notificationsReducer = (state = defaultState, action) => {
  const newState = cloneDeep(state);

  const notification = newState.find(
    activeNotification => action && action.payload && activeNotification.id === action.payload.id,
  );

  switch (action.type) {
    case UPSERT_NOTIFICATION: {
      if (notification) notification.message = action.payload.message;
      else newState.push(action.payload);
      return newState;
    }
    case DELETE_NOTIFICATION: {
      newState.splice(newState.indexOf(notification), 1);
      return newState;
    }
    case CLEAR_NOTIFICATIONS: {
      return [];
    }
    default: return newState;
  }
};

export default notificationsReducer;
