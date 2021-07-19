// todo: make this handle both user and orgs dictionaries
import { AppState } from "../../../redux";
import {
  retrievePersonalDictionariesAction,
  retrievePersonalDictionariesLoadingSelector,
  toggleShowVerifiedAction
} from "../redux";
import { connect } from "react-redux";
import { ViewDictionariesPage } from "../components";
import { PERSONAL_DICTIONARIES_ACTION_INDEX } from "../redux/constants";

const mapStateToProps = (state: AppState) => ({
  loading: retrievePersonalDictionariesLoadingSelector(state),
  dictionaries:
    state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]?.items,
  meta:
    state.dictionaries.dictionaries[PERSONAL_DICTIONARIES_ACTION_INDEX]
      ?.responseMeta,
  showOnlyVerified: state.dictionaries.showOnlyVerified
});

const mapDispatchToProps = {
  retrieveDictionaries: retrievePersonalDictionariesAction,
  toggleShowVerified: toggleShowVerifiedAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDictionariesPage);
