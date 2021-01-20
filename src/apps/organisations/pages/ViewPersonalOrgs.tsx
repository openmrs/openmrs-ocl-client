import { AppState } from "../../../redux";
import { retrievePersonalOrganisationsLoadingSelector } from "../redux";
import { connect } from "react-redux";
import { retrievePersonalOrganisationsAction } from "../redux/actions";
import { ViewOrganisationsPage } from "../components";
import { PERSONAL_ORGS_ACTION_INDEX } from "../redux/constants";

const mapStateToProps = (state: AppState) => ({
  loading: retrievePersonalOrganisationsLoadingSelector(state),
  organisations:
    state.organisations.organisations[PERSONAL_ORGS_ACTION_INDEX]?.items,
  meta:
    state.organisations.organisations[PERSONAL_ORGS_ACTION_INDEX]
      ?.responseMeta
});

const mapDispatchToProps = {
  retrieveOrganisations: retrievePersonalOrganisationsAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewOrganisationsPage);
