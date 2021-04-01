import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router";
import qs from "qs";

import { retrievePublicOrganisationsAction } from "../redux";
import { Fab, Tooltip } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { Header } from "../../../components";
import { BaseAPIOrganisation } from "../types";

import { ViewOrganisations } from "../components";
import { useQueryParams } from "../../../utils";
import { ProgressOverlay } from "../../../utils/components";
import { ContainerOwnerTabs } from "../../containers/components";
import { TAB_LIST } from "../constants";
import { APIProfile } from "../../authentication";

interface Props {
  organisations?: BaseAPIOrganisation[];
  profile?: APIProfile;
  meta?: { num_found?: number };
  loading: boolean;
  retrieveOrganisations: (
    ...args: Parameters<typeof retrievePublicOrganisationsAction>
  ) => void;
}

const ViewOrganisationsPage: React.FC<Props> = ({
  organisations = [],
  profile,
  retrieveOrganisations,
  loading,
  meta = {}
}: Props) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();

  const { num_found: numFound = organisations.length } = meta;
  const queryParams: { page?: number; q?: string } = useQueryParams();
  const { page = 1, q: initialQ = "" } = queryParams;
  const PER_PAGE = 20;

  const gimmeAUrl = (params: { page?: number; q?: string }) => {
    const newParams: { page?: number; q?: string } = {
      ...queryParams,
      ...params
    };
    return `${url}?${qs.stringify(newParams)}`;
  };

  useEffect(() => {
    if (profile) {
      retrieveOrganisations(profile?.username, initialQ, PER_PAGE, page);
    } else retrieveOrganisations(url, initialQ, PER_PAGE, page);
  }, [retrieveOrganisations, url, initialQ, page, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Header title="Organisations">
      <ContainerOwnerTabs currentPageUrl={url} tabList={TAB_LIST} />
      <ProgressOverlay loading={loading}>
        <ViewOrganisations
          organisations={organisations}
          title="Organisations"
          onSearch={(q: string) => goTo(gimmeAUrl({ q }))}
          initialQ={initialQ}
          page={page}
          perPage={PER_PAGE}
          onPageChange={(page: number) => goTo(gimmeAUrl({ page }))}
          numFound={numFound}
        />
        <Link to={`/orgs/new/`}>
          <Tooltip title="Create new organisation">
            <Fab color="primary" className="fab">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </ProgressOverlay>
    </Header>
  );
};

export default ViewOrganisationsPage;
