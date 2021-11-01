import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import { APIOrganisation, OrgSource, OrgCollection, OrgMember } from "../types";
import {
  retrieveOrganisationAction,
  retrieveOrgLoadingSelector
} from "../redux";
import Header from "../../../components/Header";
import {
  OrganisationDetails,
  OrganisationMembers,
  OrganisationDictionaries,
  OrganisationSources
} from "../components";
import { ProgressOverlay } from "../../../utils/components";
import { Grid, Theme } from "@mui/material";
import { EditButton } from "../../containers/components/EditButton";
import { AppState } from "../../../redux";
import { APIOrg, APIProfile, profileSelector } from "../../authentication";
import { orgsSelector } from "../../authentication/redux/reducer";
import { createStyles, makeStyles } from "@mui/styles";

interface Props {
  profile?: APIProfile;
  usersOrgs?: APIOrg[];
  organisation: APIOrganisation;
  sources?: OrgSource[];
  collections?: OrgCollection[];
  members?: OrgMember[];
  loading: boolean;
  retrieveOrg: (...args: Parameters<typeof retrieveOrganisationAction>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridContainers: {
      display: "flex",
      flexWrap: "nowrap",
      padding:"25px",
      marginTop: "0",
      margin: "1.25rem"
    },
    name: {
      marginRight: "1rem"
    }
  })
);

const ViewOrganisationPage: React.FC<Props> = ({
  profile,
  usersOrgs = [],
  organisation,
  sources,
  collections,
  members,
  loading,
  retrieveOrg
}: Props) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();

  const orgUrl = url.replace("/user", "").replace("edit/", "");

  useEffect(() => {
    retrieveOrg(orgUrl);
  }, [orgUrl, retrieveOrg]);

  const isAnOrgMember = (owner: string, id: string) =>
    Boolean(
      profile?.username === owner || usersOrgs?.map(org => org.id).includes(id)
    );
  const canModify = isAnOrgMember(organisation.created_by, organisation.id);

  const { name } = organisation || {};

  return (
    <Header
      title={` Your Organisations > ${name}`}
      // backUrl="/user/orgs/"
      backUrl="/orgs/"
      backText="Back to organisations"
      justifyChildren="space-around"
    >
      <ProgressOverlay delayRender loading={loading}>
        <Grid
          container
          xs={12}
          spacing={5}
          className={classes.gridContainers}
        >
          <Grid item xs={6}>
            <OrganisationDetails organisation={organisation} />
          </Grid>
          <Grid item xs={6}>
            <OrganisationMembers
              canModifyMembers={canModify}
              members={members}
              orgUrl={orgUrl}
              orgName={name}
            />
          </Grid>
        </Grid>
        <Grid
          container
          xs={12}
          spacing={5}
          className={classes.gridContainers}
        >
          <Grid item xs={6}>
            <OrganisationSources sources={sources} />
          </Grid>
          <Grid item xs={6}>
            <OrganisationDictionaries collections={collections} />
          </Grid>
        </Grid>
        {!canModify ? null : (
          <EditButton url={`${url}edit/`} title="Edit this Organisation" />
        )}
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: profileSelector(state),
  usersOrgs: orgsSelector(state),
  organisation: state.organisations.organisation,
  sources: state.organisations.orgSources,
  collections: state.organisations.orgCollections,
  members: state.organisations.orgMembers,
  loading: retrieveOrgLoadingSelector(state)
});

const mapActionsToProps = {
  retrieveOrg: retrieveOrganisationAction
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ViewOrganisationPage);
