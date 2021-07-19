import { AppState } from "../../../redux";
import {
  retrieveOrgDictionariesAction,
  retrieveOrgDictionariesLoadingSelector,
  toggleShowVerifiedAction
} from "../redux";
import { connect } from "react-redux";
import { ViewDictionariesPage } from "../components";
import { ORG_DICTIONARIES_ACTION_INDEX } from "../redux/constants";

const mapStateToProps = (state: AppState) => ({
  loading: retrieveOrgDictionariesLoadingSelector(state),
  dictionaries:
    state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]?.items,
  meta:
    state.dictionaries.dictionaries[ORG_DICTIONARIES_ACTION_INDEX]
      ?.responseMeta,
  showOnlyVerified: state.dictionaries.showOnlyVerified
});

const mapDispatchToProps = {
  retrieveDictionaries: retrieveOrgDictionariesAction,
  toggleShowVerified: toggleShowVerifiedAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDictionariesPage);
