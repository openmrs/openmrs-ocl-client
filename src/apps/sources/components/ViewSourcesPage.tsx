import React, { useEffect } from "react";
import { APISource } from "../types";
import { ProgressOverlay } from "../../../utils/components";
import { useQueryParams } from "../../../utils";
import { useHistory, useLocation } from "react-router";
import qs from "qs";
import { retrievePersonalSourcesAction } from "../redux";
import ViewSources from "./ViewSources";
import Header from "../../../components/Header";
import { TAB_LIST, PER_PAGE, TITLE } from "../constants";

import { ContainerOwnerTabs } from "../../containers/components";
import { Link } from "react-router-dom";
import { Fab, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { toggleShowVerifiedAction } from "../../dictionaries/redux";

interface Props {
  loading: boolean;
  sources?: APISource[];
  meta?: { num_found?: number };
  // not nice, but better than not typing it
  retrieveSources: (
    ...args: Parameters<typeof retrievePersonalSourcesAction>
  ) => void;
  toggleShowVerified: (
    ...args: Parameters<typeof toggleShowVerifiedAction>
  ) => void;
  showOnlyVerified: boolean;
}

const ViewPersonalSourcesPage: React.FC<Props> = ({
  sources = [],
  loading,
  meta = {},
  retrieveSources,
  toggleShowVerified,
  showOnlyVerified
}) => {
  const { push: goTo } = useHistory();
  const { pathname: url } = useLocation();
  const { num_found: numFound = sources.length } = meta;

  const queryParams: { page?: number; q?: string } = useQueryParams();
  const { page = 1, q: initialQ = "" } = queryParams;

  useEffect(() => {
    retrieveSources(url, showOnlyVerified ? "CIEL" : initialQ, PER_PAGE, page);
  }, [retrieveSources, url, initialQ, page, showOnlyVerified]);

  const gimmeAUrl = (params: { page?: number; q?: string }) => {
    const newParams: { page?: number; q?: string } = {
      ...queryParams,
      ...params
    };
    return `${url}?${qs.stringify(newParams)}`;
  };

  return (
    <Header title="Sources">
      <ContainerOwnerTabs currentPageUrl={url} tabList={TAB_LIST} />
      <ProgressOverlay loading={loading}>
        <ViewSources
          initialQ={initialQ}
          page={page}
          perPage={PER_PAGE}
          onSearch={(q: string) => goTo(gimmeAUrl({ q }))}
          onPageChange={(page: number) => goTo(gimmeAUrl({ page }))}
          sources={sources}
          numFound={numFound}
          title={TITLE}
          showOnlyVerified={showOnlyVerified}
          toggleShowVerified={toggleShowVerified}
        />
        <Link to={`/sources/new/`}>
          <Tooltip title="Create new source">
            <Fab color="primary" className="fab">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Link>
      </ProgressOverlay>
    </Header>
  );
};

export default ViewPersonalSourcesPage;
