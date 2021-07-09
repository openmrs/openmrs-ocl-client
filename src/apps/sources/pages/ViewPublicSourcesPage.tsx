import { AppState } from "../../../redux";
import {
  retrievePublicSourcesAction,
  retrievePublicSourcesLoadingSelector
} from "../redux";
import { connect } from "react-redux";
import { ViewSourcesPage } from "../components";
import { PUBLIC_SOURCES_ACTION_INDEX } from "../redux/constants";
import { toggleShowVerifiedAction } from "../../dictionaries/redux";

export const mapStateToProps = (state: AppState) => ({
  loading: retrievePublicSourcesLoadingSelector(state),
  sources: state.sources.sources[PUBLIC_SOURCES_ACTION_INDEX]?.items,
  meta: state.sources.sources[PUBLIC_SOURCES_ACTION_INDEX]?.responseMeta,
  showOnlyVerified: state.dictionaries.showOnlyVerified
});

export const mapDispatchToProps = {
  retrieveSources: retrievePublicSourcesAction,
  toggleShowVerified: toggleShowVerifiedAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSourcesPage);
