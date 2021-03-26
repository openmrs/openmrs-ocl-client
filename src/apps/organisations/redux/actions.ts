import api from "../api";
import {
  createActionThunk,
  startAction,
  completeAction,
  progressAction,
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
  HIDE_DELETE_MEMBER_DIALOG
} from "./actionTypes";
import { PERSONAL_ORGS_ACTION_INDEX } from "./constants";
import { Organisation, EditableOrganisationFields } from "../types";
import { debug, STATUS_CODES_TO_MESSAGES } from "../../../utils";

const createOrgsAction = createActionThunk(
  CREATE_ORGANISATION_ACTION,
  api.create
);

const editOrgsAction = createActionThunk(
  EDIT_ORGANISATION_ACTION,
  api.organisation.update
);

const retrieveOrgAction = createActionThunk(
  GET_ORG_ACTION,
  api.organisation.retrieve
);

const retrievePublicOrganisationsAction = createActionThunk(
  RETRIEVE_ORGS_ACTION,
  api.organisations.retrieve.public
);

const retrievePersonalOrganisationsAction = createActionThunk(
  indexedAction(RETRIEVE_ORGS_ACTION, PERSONAL_ORGS_ACTION_INDEX),
  api.organisations.retrieve.private
);

const createOrganisationAction = (organisationData: Organisation) => {
  return async (dispatch: Function) => {
    dispatch(startAction(CREATE_ORGANISATION_ACTION));
    let organisationResponse;
    organisationResponse = await dispatch(
      createOrgsAction<Organisation>(organisationData)
    );
    dispatch(
      progressAction(CREATE_ORGANISATION_ACTION, "Creating organisation...")
    );
    if (!organisationResponse) {
      dispatch(completeAction(CREATE_ORGANISATION_ACTION));
      return false;
    }

    dispatch(completeAction(CREATE_ORGANISATION_ACTION));
  };
};

const editOrganisationAction = (
  orgUrl: string,
  edittedOrganisation: EditableOrganisationFields
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(EDIT_ORGANISATION_ACTION));
    let organisationResponse;
    organisationResponse = await dispatch(
      editOrgsAction<EditableOrganisationFields>(orgUrl, edittedOrganisation)
    );
    dispatch(
      progressAction(EDIT_ORGANISATION_ACTION, "Editing organisation...")
    );
    if (!organisationResponse) {
      dispatch(completeAction(EDIT_ORGANISATION_ACTION));
      return false;
    }

    dispatch(completeAction(EDIT_ORGANISATION_ACTION));
  };
};

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
  return async (dispatch: Function) => {
    await dispatch(retrieveOrgAction(orgUrl));
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
  console.log("action", action);
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
  hideDeleteMemberDialogAction
};
