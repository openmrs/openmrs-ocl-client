import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import { ConceptForm, ConceptSpeedDial } from "../components";
import { AppState } from "../../../redux";
import {
  retrieveConceptAction,
  viewConceptErrorsSelector,
  viewConceptLoadingSelector
} from "../redux";
import { APIConcept, apiConceptToConcept, APIMapping } from "../types";
import { useLocation, useParams } from "react-router";
import { connect } from "react-redux";
import Header from "../../../components/Header";
import { APIOrg, APIProfile, profileSelector } from "../../authentication";
import { orgsSelector } from "../../authentication/redux/reducer";
import { CONTEXT, ProgressOverlay, useQueryParams } from "../../../utils";
import { recursivelyAddConceptsToDictionaryAction } from "../../dictionaries/redux";

interface Props {
  loading: boolean;
  concept?: APIConcept;
  mappings: APIMapping[];
  errors?: {};
  retrieveConcept: (...args: Parameters<typeof retrieveConceptAction>) => void;
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  addConceptsToDictionary?: (
    ...args: Parameters<typeof recursivelyAddConceptsToDictionaryAction>
  ) => void;
}

const ViewConceptPage: React.FC<Props> = ({
  retrieveConcept,
  concept,
  mappings,
  loading,
  errors,
  profile,
  usersOrgs,
  addConceptsToDictionary
}) => {
  const { pathname: url } = useLocation();
  const { ownerType, owner } = useParams<{
    ownerType: string;
    owner: string;
  }>();
  const { linkedDictionary, dictionaryToAddTo } = useQueryParams<{
    linkedDictionary: string;
    dictionaryToAddTo: string;
  }>();
  const conceptSource = concept?.source_url;

  useEffect(() => {
    retrieveConcept(url);
  }, [url, retrieveConcept]);

  const fromDictionary = linkedDictionary ?? dictionaryToAddTo;
  const backUrl = `${fromDictionary ? fromDictionary : conceptSource}concepts/`

  return (
    <>
      <Header
        allowImplicitNavigation
        title={
          concept && concept.display_name
            ? concept.display_name
            : "View concept"
        }
        backUrl={backUrl}
      >
        <ProgressOverlay
          delayRender
          loading={loading}
          error={
            errors
              ? "Could not retrieve concept. Refresh this page to retry."
              : undefined
          }
        >
          <Grid id="viewConceptPage" item xs={8} component="div">
            <ConceptForm
              context={CONTEXT.view}
              savedValues={apiConceptToConcept(concept, mappings)}
              errors={errors}
            />
          </Grid>
          {concept && conceptSource && (
            <ConceptSpeedDial
              concept={concept}
              conceptSource={conceptSource}
              ownerType={ownerType}
              owner={owner}
              profile={profile}
              usersOrgs={usersOrgs}
              linkedDictionary={linkedDictionary}
              dictionaryToAddTo={dictionaryToAddTo}
              conceptUrl={url}
            />
          )}
        </ProgressOverlay>
      </Header>
    </>
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
  retrieveConcept: retrieveConceptAction,
  addConceptsToDictionary: recursivelyAddConceptsToDictionaryAction
};

export default connect(mapStateToProps, mapActionsToProps)(ViewConceptPage);
