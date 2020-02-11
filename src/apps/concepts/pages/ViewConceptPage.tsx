import React, { useEffect } from "react";
import { Fab, Grid, Tooltip } from "@material-ui/core";
import { ConceptForm } from "../components";
import { AppState } from "../../../redux";
import {
  retrieveConceptAction,
  viewConceptErrorsSelector,
  viewConceptLoadingSelector
} from "../redux";
import { APIConcept, apiConceptToConcept, APIMapping } from "../types";
import { useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import { Edit as EditIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import { startCase, toLower } from "lodash";
import {
  APIOrg,
  APIProfile,
  canModifyContainer,
  profileSelector
} from "../../authentication";
import { orgsSelector } from "../../authentication/redux/reducer";
import { CONTEXT } from "../constants";
import { useQuery } from "../../../utils";
import { NotFound } from "../../../components";

interface Props {
  loading: boolean;
  concept?: APIConcept;
  mappings: APIMapping[];
  errors?: {};
  retrieveConcept: Function;
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
}

const ViewConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  mappings,
  loading,
  errors,
  profile,
  usersOrgs
}) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();
  const { linkedDictionary } = useQuery();

  const showEditButton = canModifyContainer(
    ownerType,
    owner,
    profile,
    usersOrgs
  );

  useEffect(() => {
    retrieveConcept(url);
  }, [url, retrieveConcept]);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (errors) return <NotFound />;

  return (
    <Header
      title={startCase(
        toLower(concept ? concept.display_name : "View concept")
      )}
    >
      <Grid id="viewConceptPage" item xs={8} component="div">
        <ConceptForm
          context={CONTEXT.view}
          savedValues={apiConceptToConcept(concept, mappings)}
          errors={errors}
        />
      </Grid>
      {!showEditButton ? null : (
        <Link to={`${url}edit/?linkedDictionary=${linkedDictionary}`}>
          <Tooltip title="Edit this concept">
            <Fab color="primary" className="fab">
              <EditIcon />
            </Fab>
          </Tooltip>
        </Link>
      )}
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  concept: state.concepts.concept,
  mappings: state.concepts.mappings,
  loading: viewConceptLoadingSelector(state),
  errors: viewConceptErrorsSelector(state)
});

const mapActionsToProps = {
  retrieveConcept: retrieveConceptAction
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptPage);
