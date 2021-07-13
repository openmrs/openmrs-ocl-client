import api from "../api";
import {
  createActionThunk,
  startAction,
  completeAction,
  resetAction,
  indexedAction,
  AppState,
  Action
} from "../../../redux";
import {
  getIndexedAction,
  errorMsgResponse,
  FAILURE
} from "../../../redux/utils";
import {
  CREATE_ORGANISATION_ACTION,
  EDIT_ORGANISATION_ACTION,
  GET_ORG_ACTION,
  GET_ORG_COLLECTIONS_ACTION,
  GET_ORG_SOURCES_ACTION,
  DELETE_ORGANISATION_ACTION,
  RETRIEVE_ORGS_ACTION,
  GET_ORG_MEMBERS_ACTION,
  CREATE_ORG_MEMBER_ACTION,
  DELETE_ORG_MEMBER_ACTION,
  SHOW_ADD_MEMBER_DIALOG,
  HIDE_ADD_MEMBER_DIALOG,
  SHOW_DELETE_MEMBER_DIALOG,
  HIDE_DELETE_MEMBER_DIALOG,
  TOGGLE_SHOW_VERIFIED_ACTION
} from "./actionTypes";
import { PERSONAL_ORGS_ACTION_INDEX } from "./constants";
import { debug, STATUS_CODES_TO_MESSAGES } from "../../../utils";

const createOrganisationAction = createActionThunk(
  CREATE_ORGANISATION_ACTION,
  api.create
);

const editOrganisationAction = createActionThunk(
  EDIT_ORGANISATION_ACTION,
  api.organisation.update
);

const retrievePublicOrganisationsAction = createActionThunk(
  RETRIEVE_ORGS_ACTION,
  api.organisations.retrieve.public
);

const retrievePersonalOrganisationsAction = createActionThunk(
  indexedAction(RETRIEVE_ORGS_ACTION, PERSONAL_ORGS_ACTION_INDEX),
  api.organisations.retrieve.private
);

const resetCreateOrganisationAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(CREATE_ORGANISATION_ACTION));
  };
};

const resetEditOrganisationAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(EDIT_ORGANISATION_ACTION));
  };
};

const resetAddOrgMemberAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(CREATE_ORG_MEMBER_ACTION));
  };
};

const resetDeleteOrgMemberAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(DELETE_ORG_MEMBER_ACTION));
  };
};

const retrieveOrganisationAction = (orgUrl: string) => {
  const action = getIndexedAction(GET_ORG_ACTION);
  const { actionType, actionIndex } = action;
  return async (dispatch: (action: Action) => {}, getState: () => AppState) => {
    retrieveOrgSourcesAction(orgUrl)(dispatch, getState);
    retrieveOrgCollectionsAction(orgUrl)(dispatch, getState);
    retrieveOrgMembersAction(orgUrl)(dispatch, getState);

    try {
      dispatch(startAction(action, orgUrl));

      try {
        const response = await api.organisation.retrieve(orgUrl);

        dispatch({
          type: actionType,
          actionIndex: actionIndex,
          payload: response.data,
          meta: [orgUrl],
          responseMeta: response.headers
        });
      } catch (error) {
        debug(error, "redux/utils/#createActionThunk#:catch");

        const response = error.response;

        let errorMsg = errorMsgResponse(response);

        const errorMessage: string | undefined | {} | [] =
          response?.data || response
            ? STATUS_CODES_TO_MESSAGES[response.status] || errorMsg
            : errorMsg;

        dispatch({
          type: `${actionType}_${FAILURE}`,
          actionIndex: actionIndex,
          payload: errorMessage,
          meta: [orgUrl]
        });
      }
    } catch (error) {
      debug("should not happen", error);

      dispatch({
        type: `${actionType}_${FAILURE}`,
        actionIndex: actionIndex,
        payload: "The action could not be completed (1)",
        meta: [orgUrl]
      });
    } finally {
      dispatch(completeAction(action, [orgUrl]));
    }
  };
};

const retrieveOrgSourcesAction = createActionThunk(
  GET_ORG_SOURCES_ACTION,
  api.organisation.retrieveSources
);

const retrieveOrgCollectionsAction = createActionThunk(
  GET_ORG_COLLECTIONS_ACTION,
  api.organisation.retrieveCollections
);

const deleteOrganisationAction = createActionThunk(
  DELETE_ORGANISATION_ACTION,
  api.organisation.delete
);

const retrieveOrgMembersAction = createActionThunk(
  GET_ORG_MEMBERS_ACTION,
  api.organisation.retrieveMembers
);

const showAddMemberDialogAction = () => (
  dispatch: (action: Action) => void
) => {
  dispatch({ type: SHOW_ADD_MEMBER_DIALOG, actionIndex: 0, meta: [] });
};

const hideAddMemberDialogAction = () => (
  dispatch: (action: Action) => void
) => {
  dispatch({ type: HIDE_ADD_MEMBER_DIALOG, actionIndex: 0, meta: [] });
};

const addOrgMemberAction = (
  ...args: Parameters<typeof api.organisation.addMember>
) => {
  const action = getIndexedAction(CREATE_ORG_MEMBER_ACTION);
  const { actionType, actionIndex } = action;
  return async (dispatch: (action: Action) => {}, getState: () => AppState) => {
    try {
      dispatch(startAction(action, ...args));

      try {
        const response = await api.organisation.addMember(...args);

        dispatch({
          type: actionType,
          actionIndex: actionIndex,
          payload: response.data,
          meta: args,
          responseMeta: response.headers
        });
      } catch (error) {
        debug(error, "redux/utils/#createActionThunk#:catch");

        const response = error.response;

        let errorMsg = errorMsgResponse(response);

        const errorMessage: string | undefined | {} | [] =
          response?.data || response
            ? STATUS_CODES_TO_MESSAGES[response.status] || errorMsg
            : errorMsg;

        dispatch({
          type: `${actionType}_${FAILURE}`,
          actionIndex: actionIndex,
          payload: errorMessage,
          meta: args
        });

        return;
      }
    } catch (error) {
      debug("should not happen", error);

      dispatch({
        type: `${actionType}_${FAILURE}`,
        actionIndex: actionIndex,
        payload: "The action could not be completed (1)",
        meta: args
      });

      return;
    } finally {
      dispatch(completeAction(action, ...args));
    }

    hideAddMemberDialogAction()(dispatch);
    retrieveOrgMembersAction(args[0])(dispatch, getState);
  };
};

const showDeleteMemberDialogAction = () => (
  dispatch: (action: Action) => void
) => {
  dispatch({ type: SHOW_DELETE_MEMBER_DIALOG, actionIndex: 0, meta: [] });
};

const hideDeleteMemberDialogAction = () => (
  dispatch: (action: Action) => void
) => {
  dispatch({ type: HIDE_DELETE_MEMBER_DIALOG, actionIndex: 0, meta: [] });
};

const deleteOrgMemberAction = (
  ...args: Parameters<typeof api.organisation.deleteMember>
) => {
  const action = getIndexedAction(DELETE_ORG_MEMBER_ACTION);
  const { actionType, actionIndex } = action;
  return async (dispatch: (action: Action) => {}, getState: () => AppState) => {
    try {
      dispatch(startAction(action, ...args));

      try {
        const response = await api.organisation.deleteMember(...args);

        dispatch({
          type: actionType,
          actionIndex: actionIndex,
          payload: response.data,
          meta: args,
          responseMeta: response.headers
        });
      } catch (error) {
        debug(error, "redux/utils/#createActionThunk#:catch");

        const response = error.response;

        let errorMsg = errorMsgResponse(response);

        const errorMessage: string | undefined | {} | [] =
          response?.data || response
            ? STATUS_CODES_TO_MESSAGES[response.status] || errorMsg
            : errorMsg;

        dispatch({
          type: `${actionType}_${FAILURE}`,
          actionIndex: actionIndex,
          payload: errorMessage,
          meta: args
        });
      }
    } catch (error) {
      debug("should not happen", error);

      dispatch({
        type: `${actionType}_${FAILURE}`,
        actionIndex: actionIndex,
        payload: "The action could not be completed (1)",
        meta: args
      });
    } finally {
      dispatch(completeAction(action, ...args));
    }

    hideDeleteMemberDialogAction()(dispatch);
    retrieveOrgMembersAction(args[0])(dispatch, getState);
  };
};
const toggleShowVerifiedAction = () => {
  return (dispatch: Function) =>
    dispatch({ type: TOGGLE_SHOW_VERIFIED_ACTION });
};

export {
  createOrganisationAction,
  resetCreateOrganisationAction,
  editOrganisationAction,
  retrieveOrganisationAction,
  resetEditOrganisationAction,
  resetAddOrgMemberAction,
  resetDeleteOrgMemberAction,
  retrieveOrgCollectionsAction,
  retrieveOrgSourcesAction,
  deleteOrganisationAction,
  retrievePublicOrganisationsAction,
  retrievePersonalOrganisationsAction,
  retrieveOrgMembersAction,
  addOrgMemberAction,
  deleteOrgMemberAction,
  showAddMemberDialogAction,
  hideAddMemberDialogAction,
  showDeleteMemberDialogAction,
  hideDeleteMemberDialogAction,
  toggleShowVerifiedAction
};
