import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import { sortBy } from 'lodash';
import { useHistory, useLocation } from "react-router";
import qs from "qs";

import { retrieveOrganisationsAction } from "../redux";
import { getProfileAction } from "../../authentication"
import { Fab, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { Header } from "../../../components";
import { APIOrganisation } from "../types";
import {AppState} from "../../../redux";
import { ViewOrganisations } from "../components";
import { useQueryParams } from "../../../utils";


interface Props {
  organisations?: APIOrganisation[];
  username?: string;
  retrieveOrgs: (
    ...args: Parameters<typeof retrieveOrganisationsAction>
  ) => void;
}

export const ViewOrganisationsPage: React.FC<Props> = ({ organisations = [], retrieveOrgs, username = '' }:Props) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const queryParams: { q?: string } = useQueryParams();
  const {  q: initialQ = "" } = queryParams;
 
  const gimmeAUrl = (params: { q?: string }) => {
    console.log(params.q, 'ppp')
    const newParams: { q?: string } = {
      ...queryParams,
      ...params,
    };
    return `${url}?${qs.stringify(newParams)}`;
  };


  useEffect(() => {
    retrieveOrgs(username,initialQ);
  },[retrieveOrgs, initialQ, username]);

  

  const title = "Organisations"
  const sortedOrganisation = sortBy(organisations, 'asc', 'name');
  return (
    <Header title="My Organisations">
      <ViewOrganisations 
        organisations={sortedOrganisation} 
        title={title}
        onSearch ={(q: string) => goTo(gimmeAUrl({ q }))}
        initialQ={initialQ} />
      <Link to={`/orgs/new/`}>
          <Tooltip title='Create new organisation'>
            <Fab color='primary' className='fab'>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
    </Header>
  );
};

export const mapStateToProps = (state: AppState) => ({
  organisations: state.organisations.organisations,
  username: state.auth.profile?.username
});

export const mapDispatchToProps = {
    retrieveOrgs: retrieveOrganisationsAction,
    getUser: getProfileAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganisationsPage);
