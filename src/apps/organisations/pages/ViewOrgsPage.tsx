import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import { sortBy } from 'lodash';
import { useHistory, useLocation } from "react-router";
import qs from "qs";

import { retrieveOrganisationsAction, retrieveOrgsLoadingSelector } from "../redux";
import { Fab, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { Header } from "../../../components";
import { APIOrganisation } from "../types";
import {AppState} from "../../../redux";
import { ViewOrganisations } from "../components";
import { useQueryParams } from "../../../utils";
import {ProgressOverlay} from "../../../utils/components";


interface Props {
  organisations?: APIOrganisation[];
  username?: string;
  meta?: { num_found?: number };
  loading: boolean;
  retrieveOrgs: (
    ...args: Parameters<typeof retrieveOrganisationsAction>
  ) => void;
}

export const ViewOrganisationsPage: React.FC<Props> = ({ organisations = [], retrieveOrgs, username = '', loading, meta = {} }:Props) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();

  const { num_found: numFound = organisations.length } = meta;
  const queryParams: { page?: number; q?: string } = useQueryParams();
  const {  page = 1, q: initialQ = "" } = queryParams;
  const PER_PAGE = 20;

  const gimmeAUrl = (params: { page?: number; q?: string }) => {
    const newParams: { page?: number; q?: string } = {
      ...queryParams,
      ...params,
    };
    return `${url}?${qs.stringify(newParams)}`;
  };

  useEffect(() => {
      retrieveOrgs(username,initialQ,PER_PAGE, page);
  },[retrieveOrgs, initialQ, username, page]);

  const sortedOrganisation = sortBy(organisations, 'asc', 'name');
  return (
    <Header title="My Organisations">
      <ProgressOverlay loading={loading}>
        <ViewOrganisations 
          organisations={sortedOrganisation} 
          title="Organisations"
          onSearch ={(q: string) => goTo(gimmeAUrl({ q }))}
          initialQ={initialQ}
          page={page}
          perPage={PER_PAGE}
          onPageChange={(page: number) => goTo(gimmeAUrl({ page }))}
          numFound={numFound} />
          <Link to={`/orgs/new/`}>
              <Tooltip title='Create new organisation'>
                <Fab color='primary' className='fab'>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Link>
        </ProgressOverlay>
    </Header>
  );
};

export const mapStateToProps = (state: AppState) => ({
  organisations: state.organisations.organisations,
  meta: state.organisations.meta,
  username: state.auth.profile?.username,
  loading: retrieveOrgsLoadingSelector(state)
});

export const mapDispatchToProps = {
    retrieveOrgs: retrieveOrganisationsAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganisationsPage);
