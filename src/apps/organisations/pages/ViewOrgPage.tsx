import React, {useEffect} from "react";
import {connect} from "react-redux";
import {useLocation} from "react-router-dom";

import {APIOrganisation, OrgSource, OrgCollection,OrgMember} from "../types";
import {
  retrieveOrganisationAction,
  retrieveOrgSourcesAction,
  retrieveOrgCollectionsAction,
  retrieveOrgMembersAction,
  retrieveOrgLoadingSelector,
  addOrgMemberErrorSelector,
  addOrgMemberAction,
  addOrgMemberLoadingSelector
} from "../redux";
import Header from "../../../components/Header";
import { 
  OrganisationDetails, 
  OrganisationMembers, 
  OrganisationDictionaries, 
  OrganisationSources } 
  from "../components";
import {ProgressOverlay} from "../../../utils/components";
import {Grid, makeStyles, createStyles} from "@material-ui/core";
import {EditButton} from "../../containers/components/EditButton";
import {getPrettyError} from "../../../utils";

interface Props {
  organisation: APIOrganisation;
  sources: OrgSource[];
  collections: OrgCollection[];
  members:OrgMember[];
  loading: boolean;
  addOrgMemberError?: string;
  loadingAddMember: boolean;
  retrieveOrg: (
    ...args: Parameters<typeof retrieveOrganisationAction>
  ) => void;
  retrieveOrgSources: (
    ...args: Parameters<typeof retrieveOrgSourcesAction>
  ) => void;
  retrieveOrgCollections: (
    ...args: Parameters<typeof retrieveOrgCollectionsAction>
  ) => void;
  retrieveOrgMembers: (
      ...args: Parameters<typeof retrieveOrgMembersAction>
  ) => void;
  addOrgMember: (
    ...args: Parameters<typeof addOrgMemberAction>
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
  retrieveOrgMembers,
  addOrgMember,
  organisation,
  sources,
  collections,
  members,
  loading,
  addOrgMemberError = '',
  loadingAddMember
}: Props) => {
  const classes = useStyles();
  const { pathname: url } = useLocation();
  
  const orgUrl = url.replace("/user", "").replace("edit/", "");
  
  useEffect(() => {
    retrieveOrg(orgUrl);
    retrieveOrgSources(orgUrl);
    retrieveOrgCollections(orgUrl);
    retrieveOrgMembers(orgUrl);
  }, [orgUrl, retrieveOrg, retrieveOrgCollections, retrieveOrgSources,retrieveOrgMembers]);

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
          <OrganisationMembers 
            members={members} 
            addMember={addOrgMember} 
            orgUrl={orgUrl} 
            loading={loadingAddMember} 
            error={getPrettyError(addOrgMemberError)} />
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
  members:state.organisations.orgMembers,
  loading: retrieveOrgLoadingSelector(state),
  addOrgMemberError: addOrgMemberErrorSelector(state),
  loadingAddMember: addOrgMemberLoadingSelector(state)
});

const mapActionsToProps = {
  retrieveOrg: retrieveOrganisationAction,
  retrieveOrgSources: retrieveOrgSourcesAction,
  retrieveOrgCollections: retrieveOrgCollectionsAction,
  retrieveOrgMembers: retrieveOrgMembersAction,
  addOrgMember: addOrgMemberAction

};

export default connect(mapStateToProps, mapActionsToProps)(ViewOrganisationPage);
