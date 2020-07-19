import { AppState } from "../../../redux";
import {
    retrieveOrgSourcesAction,
    retrieveOrgSourcesLoadingSelector
} from "../redux";
import { connect } from "react-redux";
import { ViewSourcesPage} from "../components";
import { ORG_SOURCES_ACTION_INDEX } from "../redux/constants";

export const mapStateToProps = (state: AppState) => ({
    loading: retrieveOrgSourcesLoadingSelector(state),
    sources:
    state.sources.sources[ORG_SOURCES_ACTION_INDEX]?.items,
    meta:
    state.sources.sources[ORG_SOURCES_ACTION_INDEX]?.responseMeta
});

export const mapDispatchToProps = {
    retrieveSources: retrieveOrgSourcesAction
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewSourcesPage);
