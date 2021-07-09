import { AppState } from "../../../redux";
import {
  retrievePersonalSourcesAction,
  retrievePersonalSourcesLoadingSelector
} from "../redux";
import { connect } from "react-redux";

import { PERSONAL_SOURCES_ACTION_INDEX } from "../redux/constants";
import { ViewSourcesPage } from "../components";
import { toggleShowVerifiedAction } from "../../dictionaries/redux";

export const mapStateToProps = (state: AppState) => ({
  loading: retrievePersonalSourcesLoadingSelector(state),
  sources: state.sources.sources[PERSONAL_SOURCES_ACTION_INDEX]?.items,
  meta: state.sources.sources[PERSONAL_SOURCES_ACTION_INDEX]?.responseMeta,
  showOnlyVerified: state.dictionaries.showOnlyVerified
});

export const mapDispatchToProps = {
  retrieveSources: retrievePersonalSourcesAction,
  toggleShowVerified: toggleShowVerifiedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSourcesPage);
