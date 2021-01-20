import { AppState } from "../../../redux";
import { retrievePublicOrganisationsLoadingSelector } from "../redux";
import { connect } from "react-redux";
import { retrievePublicOrganisationsAction } from "../redux/actions";
import { ViewOrganisationsPage } from "../components";
import { PUBLIC_ORGS_ACTION_INDEX } from "../redux/constants";

const mapStateToProps = (state: AppState) => ({
  loading: retrievePublicOrganisationsLoadingSelector(state),
  organisations:
    state.organisations.organisations[PUBLIC_ORGS_ACTION_INDEX]?.items,
  meta:
    state.organisations.organisations[PUBLIC_ORGS_ACTION_INDEX]
      ?.responseMeta
});

const mapDispatchToProps = {
  retrieveOrganisations: retrievePublicOrganisationsAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewOrganisationsPage);
