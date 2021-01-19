import React, {useEffect} from "react";
import {connect} from "react-redux";
import {useLocation} from "react-router-dom";

import {APIOrganisation, OrgSource, OrgCollection} from "../types";
import {
  retrieveOrganisationAction,
  retrieveOrgSourcesAction,
  retrieveOrgCollectionsAction,
  retrieveOrgLoadingSelector
} from "../redux";
import Header from "../../../components/Header";
import { 
  OrganisationDetails, 
  OrganisationMembers, 
  OrganisationDictionaries, 
  OrganisationSources } 
  from "../components";
import {ProgressOverlay} from "../../../utils/components";
import { Grid, makeStyles, createStyles } from "@material-ui/core";
import {EditButton} from "../../containers/components/EditButton";

interface Props {
  organisation: APIOrganisation;
  sources: OrgSource[];
  collections: OrgCollection[];
  loading: boolean;
  retrieveOrg: (
    ...args: Parameters<typeof retrieveOrganisationAction>
  ) => void;
  retrieveOrgSources: (
    ...args: Parameters<typeof retrieveOrgSourcesAction>
  ) => void;
  retrieveOrgCollections: (
    ...args: Parameters<typeof retrieveOrgCollectionsAction>
  ) => void;
}

const useStyles = makeStyles((theme) => 
  createStyles({
    gridContainers:{
    display: 'flex',
    flexWrap: 'nowrap',
    marginTop: '0',
    margin: '1.25rem',
  },
  name: {
    marginRight: '1rem'
  }
}),
);

const ViewOrganisationPage: React.FC<Props> = ({ 
  retrieveOrg, 
  retrieveOrgSources, 
  retrieveOrgCollections, 
  organisation,
  sources,
  collections,
  loading
}: Props) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();
  
  const orgUrl = url.replace("/user", "").replace("edit/", "");
  
  useEffect(() => {
    retrieveOrg(orgUrl);
    retrieveOrgSources(orgUrl);
    retrieveOrgCollections(orgUrl);
  }, [orgUrl, retrieveOrg, retrieveOrgCollections, retrieveOrgSources]);

  const { name } = organisation || {};
  return (
    <Header 
      title={` Your Organisations > ${name}`}
      backUrl="/user/orgs/"
      backText="Back to organisations"
      justifyChildren='space-around'>
      <ProgressOverlay delayRender loading={loading}>
        <Grid item container xs={12} spacing={5} className={classes.gridContainers}>
          <OrganisationDetails organisation={organisation}/>
          <OrganisationMembers />
        </Grid>
        <Grid item container xs={12} spacing={5} className={classes.gridContainers}>
          <OrganisationSources sources={sources}/>
          <OrganisationDictionaries collections={collections}/>
        </Grid>
        <EditButton url={`${url}edit/`} title="Edit this Organisation"/>
      </ProgressOverlay>
    </Header>
  );
};

const mapStateToProps = (state: any) => ({
  organisation: state.organisations.organisation,
  sources: state.organisations.orgSources,
  collections: state.organisations.orgCollections,
  loading: retrieveOrgLoadingSelector(state)
});

const mapActionsToProps = {
  retrieveOrg: retrieveOrganisationAction,
  retrieveOrgSources: retrieveOrgSourcesAction,
  retrieveOrgCollections: retrieveOrgCollectionsAction

};

export default connect(mapStateToProps, mapActionsToProps)(ViewOrganisationPage);
