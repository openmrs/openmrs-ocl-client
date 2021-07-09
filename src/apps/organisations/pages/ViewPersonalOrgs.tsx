import { AppState } from "../../../redux";
import { profileSelector } from "../../authentication/redux/reducer";
import { retrievePersonalOrganisationsLoadingSelector } from "../redux";
import { connect } from "react-redux";
import { retrievePersonalOrganisationsAction } from "../redux/actions";
import { ViewOrganisationsPage } from "../components";
import { PERSONAL_ORGS_ACTION_INDEX } from "../redux/constants";
import { toggleShowVerifiedAction } from "../../dictionaries/redux";

const mapStateToProps = (state: AppState) => ({
  loading: retrievePersonalOrganisationsLoadingSelector(state),
  profile: profileSelector(state),
  organisations:
    state.organisations.organisations[PERSONAL_ORGS_ACTION_INDEX]?.items,
  meta:
    state.organisations.organisations[PERSONAL_ORGS_ACTION_INDEX]?.responseMeta,
  showOnlyVerified: state.dictionaries.showOnlyVerified
});

const mapDispatchToProps = {
  retrieveOrganisations: retrievePersonalOrganisationsAction,
  toggleShowVerified: toggleShowVerifiedAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewOrganisationsPage);
